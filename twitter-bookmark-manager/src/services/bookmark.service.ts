import { prisma } from "@/lib/prisma";
import { AIService } from "./ai.service";
import { TwitterService } from "./twitter.service";
import type {
  TwitterBookmark,
  BookmarkWithCategory,
  SearchFilters,
  SyncResult,
  PaginatedResponse,
} from "@/types";

export class BookmarkService {
  static async syncBookmarks(userId: string): Promise<SyncResult> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { categories: true },
    });

    if (!user || !user.twitterAccessToken) {
      throw new Error("User not found or Twitter not connected");
    }

    const twitterService = TwitterService.fromUserAccessToken(
      user.twitterAccessToken
    );

    let twitterBookmarks: TwitterBookmark[];
    const errors: string[] = [];

    if (!user.lastSyncAt) {
      twitterBookmarks = await twitterService.fetchAllBookmarks(
        user.twitterId!
      );
    } else {
      const existingBookmarks = await prisma.bookmark.findMany({
        where: { userId: user.id },
        select: { tweetId: true },
      });
      const knownIds = new Set(existingBookmarks.map((b) => b.tweetId));
      twitterBookmarks = await twitterService.fetchNewBookmarks(
        user.twitterId!,
        knownIds
      );
    }

    if (twitterBookmarks.length === 0) {
      await prisma.user.update({
        where: { id: userId },
        data: { lastSyncAt: new Date() },
      });
      return { imported: 0, categorized: 0, errors };
    }

    const existingCategoryNames = user.categories.map((c) => c.name);
    let categorized: { tweetId: string; categoryName: string }[] = [];

    try {
      categorized = await AIService.categorizeBookmarks(
        twitterBookmarks,
        existingCategoryNames
      );
    } catch (error) {
      errors.push("AI categorization partially failed");
      console.error("Categorization error:", error);
    }

    const newCategoryNames = [
      ...new Set(
        categorized
          .map((c) => c.categoryName)
          .filter((name) => !existingCategoryNames.includes(name))
      ),
    ];

    const categorySuggestions = AIService.buildCategorySuggestions(
      newCategoryNames,
      user.categories.length
    );

    for (const suggestion of categorySuggestions) {
      try {
        await prisma.category.upsert({
          where: {
            slug_userId: { slug: suggestion.slug, userId: user.id },
          },
          create: {
            name: suggestion.name,
            slug: suggestion.slug,
            color: suggestion.color,
            userId: user.id,
            isAuto: true,
          },
          update: {},
        });
      } catch (error) {
        console.error(`Failed to create category ${suggestion.name}:`, error);
      }
    }

    const allCategories = await prisma.category.findMany({
      where: { userId: user.id },
    });
    const categoryMap = new Map(allCategories.map((c) => [c.name, c.id]));
    const categorizationMap = new Map(
      categorized.map((c) => [c.tweetId, c.categoryName])
    );

    const embeddings = await AIService.generateEmbeddings(
      twitterBookmarks.map(
        (b) => `@${b.authorUsername}: ${b.content}`
      )
    );

    let imported = 0;
    for (let i = 0; i < twitterBookmarks.length; i++) {
      const bookmark = twitterBookmarks[i];
      const categoryName = categorizationMap.get(bookmark.tweetId);
      const categoryId = categoryName
        ? categoryMap.get(categoryName) ?? null
        : null;
      const embedding = embeddings.get(i) ?? [];

      try {
        await prisma.bookmark.upsert({
          where: {
            tweetId_userId: {
              tweetId: bookmark.tweetId,
              userId: user.id,
            },
          },
          create: {
            tweetId: bookmark.tweetId,
            userId: user.id,
            authorName: bookmark.authorName,
            authorUsername: bookmark.authorUsername,
            authorAvatar: bookmark.authorAvatar,
            content: bookmark.content,
            mediaUrls: bookmark.mediaUrls,
            tweetCreatedAt: bookmark.tweetCreatedAt,
            embedding,
            categoryId,
          },
          update: {},
        });
        imported++;
      } catch (error) {
        errors.push(`Failed to import tweet ${bookmark.tweetId}`);
        console.error(`Failed to import bookmark:`, error);
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { lastSyncAt: new Date() },
    });

    return { imported, categorized: categorized.length, errors };
  }

  static async getBookmarks(
    userId: string,
    page = 1,
    pageSize = 20,
    filters?: SearchFilters
  ): Promise<PaginatedResponse<BookmarkWithCategory>> {
    const where: Record<string, unknown> = {
      userId,
      isDeleted: false,
    };

    if (filters?.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters?.authorUsername) {
      where.authorUsername = {
        contains: filters.authorUsername,
        mode: "insensitive",
      };
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.tweetCreatedAt = {};
      if (filters.dateFrom) {
        (where.tweetCreatedAt as Record<string, unknown>).gte = new Date(
          filters.dateFrom
        );
      }
      if (filters.dateTo) {
        (where.tweetCreatedAt as Record<string, unknown>).lte = new Date(
          filters.dateTo
        );
      }
    }

    if (filters?.query && filters.searchType !== "semantic") {
      where.OR = [
        { content: { contains: filters.query, mode: "insensitive" } },
        { authorName: { contains: filters.query, mode: "insensitive" } },
        { authorUsername: { contains: filters.query, mode: "insensitive" } },
      ];
    }

    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, slug: true, color: true },
          },
        },
        orderBy: { bookmarkedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.bookmark.count({ where }),
    ]);

    return {
      data: bookmarks as unknown as BookmarkWithCategory[],
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
    };
  }

  static async searchSemantic(
    userId: string,
    query: string,
    limit = 20
  ): Promise<BookmarkWithCategory[]> {
    const queryEmbedding = await AIService.generateEmbedding(query);
    if (queryEmbedding.length === 0) return [];

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId, isDeleted: false },
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    });

    const scored = bookmarks
      .filter((b) => b.embedding.length > 0)
      .map((b) => ({
        bookmark: b,
        score: AIService.cosineSimilarity(queryEmbedding, b.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scored.map((s) => s.bookmark) as unknown as BookmarkWithCategory[];
  }

  static async updateCategory(
    bookmarkId: string,
    userId: string,
    categoryId: string | null
  ) {
    return prisma.bookmark.update({
      where: { id: bookmarkId, userId },
      data: { categoryId },
      include: {
        category: {
          select: { id: true, name: true, slug: true, color: true },
        },
      },
    });
  }

  static async deleteBookmark(bookmarkId: string, userId: string) {
    return prisma.bookmark.update({
      where: { id: bookmarkId, userId },
      data: { isDeleted: true },
    });
  }

  static async getCategories(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      include: {
        _count: { select: { bookmarks: { where: { isDeleted: false } } } },
      },
      orderBy: { name: "asc" },
    });
  }

  static async createCategory(
    userId: string,
    name: string,
    slug: string,
    color: string
  ) {
    return prisma.category.create({
      data: { name, slug, color, userId, isAuto: false },
    });
  }

  static async deleteCategory(categoryId: string, userId: string) {
    await prisma.bookmark.updateMany({
      where: { categoryId, userId },
      data: { categoryId: null },
    });
    return prisma.category.delete({
      where: { id: categoryId, userId },
    });
  }
}
