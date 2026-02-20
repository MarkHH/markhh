export interface TwitterBookmark {
  tweetId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string | null;
  content: string;
  mediaUrls: string[];
  tweetCreatedAt: Date;
}

export interface BookmarkWithCategory {
  id: string;
  tweetId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string | null;
  content: string;
  mediaUrls: string[];
  tweetCreatedAt: Date;
  bookmarkedAt: Date;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
    color: string;
  } | null;
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  color: string;
  isAuto: boolean;
  _count: {
    bookmarks: number;
  };
}

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  authorUsername?: string;
  dateFrom?: string;
  dateTo?: string;
  searchType?: "keyword" | "semantic";
}

export interface SyncResult {
  imported: number;
  categorized: number;
  errors: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
