import OpenAI from "openai";
import type { TwitterBookmark } from "@/types";
import { slugify, getCategoryColor } from "@/lib/utils";

function getOpenAI(): OpenAI {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

interface CategorizedBookmark {
  tweetId: string;
  categoryName: string;
}

interface CategorySuggestion {
  name: string;
  slug: string;
  color: string;
}

export class AIService {
  static async categorizeBookmarks(
    bookmarks: TwitterBookmark[],
    existingCategories: string[] = []
  ): Promise<CategorizedBookmark[]> {
    if (bookmarks.length === 0) return [];

    const batchSize = 20;
    const results: CategorizedBookmark[] = [];

    for (let i = 0; i < bookmarks.length; i += batchSize) {
      const batch = bookmarks.slice(i, i + batchSize);
      const batchResults = await AIService.categorizeBatch(
        batch,
        existingCategories
      );
      results.push(...batchResults);

      const newCategories = batchResults
        .map((r) => r.categoryName)
        .filter((c) => !existingCategories.includes(c));
      existingCategories.push(...new Set(newCategories));
    }

    return results;
  }

  private static async categorizeBatch(
    bookmarks: TwitterBookmark[],
    existingCategories: string[]
  ): Promise<CategorizedBookmark[]> {
    const tweetsText = bookmarks
      .map((b, i) => `[${i}] @${b.authorUsername}: ${b.content}`)
      .join("\n\n");

    const existingCatsText =
      existingCategories.length > 0
        ? `Existing categories to prefer when appropriate: ${existingCategories.join(", ")}`
        : "No existing categories yet — create appropriate ones.";

    const prompt = `You are a tweet categorization engine. Categorize each tweet into a short, descriptive topic category (2-4 words max).

${existingCatsText}

Rules:
- Use existing categories when a tweet clearly fits
- Create new categories only when necessary
- Categories should be broad enough to group related tweets (e.g., "AI Tools", "Product Management", "Web Development", "Design Inspiration", "Startup Advice")
- Return valid JSON only

Tweets:
${tweetsText}

Return a JSON array with objects containing "index" (number) and "category" (string):`;

    try {
      const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        response_format: { type: "json_object" },
      });

      const content = response.choices[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(content);
      const items: { index: number; category: string }[] =
        parsed.categories ?? parsed.results ?? parsed.data ?? [];

      return items.map((item) => ({
        tweetId: bookmarks[item.index]?.tweetId ?? "",
        categoryName: item.category,
      }));
    } catch (error) {
      console.error("AI categorization failed:", error);
      return bookmarks.map((b) => ({
        tweetId: b.tweetId,
        categoryName: "Uncategorized",
      }));
    }
  }

  static buildCategorySuggestions(
    categoryNames: string[],
    startIndex = 0
  ): CategorySuggestion[] {
    const unique = [...new Set(categoryNames)];
    return unique.map((name, i) => ({
      name,
      slug: slugify(name),
      color: getCategoryColor(startIndex + i),
    }));
  }

  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await getOpenAI().embeddings.create({
        model: "text-embedding-3-small",
        input: text,
      });
      return response.data[0]?.embedding ?? [];
    } catch (error) {
      console.error("Failed to generate embedding:", error);
      return [];
    }
  }

  static async generateEmbeddings(
    texts: string[]
  ): Promise<Map<number, number[]>> {
    const results = new Map<number, number[]>();
    if (texts.length === 0) return results;

    const batchSize = 100;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);
      try {
        const response = await getOpenAI().embeddings.create({
          model: "text-embedding-3-small",
          input: batch,
        });
        for (const item of response.data) {
          results.set(i + item.index, item.embedding);
        }
      } catch (error) {
        console.error(`Embedding batch ${i} failed:`, error);
      }
    }

    return results;
  }

  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}
