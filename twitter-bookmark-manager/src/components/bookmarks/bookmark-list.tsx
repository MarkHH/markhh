"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { BookmarkCard } from "./bookmark-card";
import { FilterBar } from "./filter-bar";
import { Button } from "@/components/ui/button";
import type { BookmarkWithCategory, CategoryWithCount } from "@/types";

export function BookmarkList() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category") ?? undefined;

  const [bookmarks, setBookmarks] = useState<BookmarkWithCategory[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [authorFilter, setAuthorFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const pageSize = 20;

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (categoryId) params.set("categoryId", categoryId);
      if (authorFilter) params.set("authorUsername", authorFilter);
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);
      if (searchQuery && !isSearching) {
        params.set("query", searchQuery);
        params.set("searchType", "keyword");
      }

      const res = await fetch(`/api/bookmarks?${params}`);
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.data);
        setTotal(data.total);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page, categoryId, authorFilter, dateFrom, dateTo, searchQuery, isSearching]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
    fetchCategories();
  }, [fetchBookmarks, fetchCategories]);

  useEffect(() => {
    setPage(1);
  }, [categoryId, authorFilter, dateFrom, dateTo]);

  useEffect(() => {
    function handleSearch(e: Event) {
      const { query, type } = (e as CustomEvent).detail;
      if (type === "semantic") {
        performSemanticSearch(query);
      } else {
        setSearchQuery(query);
        setIsSearching(false);
      }
    }

    function handleSearchClear() {
      setSearchQuery("");
      setIsSearching(false);
      setPage(1);
    }

    function handleBookmarksUpdated() {
      fetchBookmarks();
      fetchCategories();
    }

    window.addEventListener("search-query", handleSearch);
    window.addEventListener("search-clear", handleSearchClear);
    window.addEventListener("bookmarks-updated", handleBookmarksUpdated);

    return () => {
      window.removeEventListener("search-query", handleSearch);
      window.removeEventListener("search-clear", handleSearchClear);
      window.removeEventListener("bookmarks-updated", handleBookmarksUpdated);
    };
  }, [fetchBookmarks, fetchCategories]);

  async function performSemanticSearch(query: string) {
    setIsSearching(true);
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/bookmarks/search?q=${encodeURIComponent(query)}&type=semantic`
      );
      if (res.ok) {
        const data = await res.json();
        setBookmarks(data.data);
        setTotal(data.data.length);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Semantic search failed:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(bookmarkId: string) {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookmarkId }),
      });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
        setTotal((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
    }
  }

  async function handleUpdateCategory(
    bookmarkId: string,
    newCategoryId: string | null
  ) {
    try {
      const res = await fetch("/api/bookmarks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookmarkId, categoryId: newCategoryId }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBookmarks((prev) =>
          prev.map((b) =>
            b.id === bookmarkId
              ? { ...b, categoryId: updated.categoryId, category: updated.category }
              : b
          )
        );
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4">
      <FilterBar
        authorFilter={authorFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onAuthorChange={setAuthorFilter}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-surface-500">
          {isSearching
            ? `${total} search results`
            : `${total} bookmark${total !== 1 ? "s" : ""}`}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Inbox className="h-12 w-12 text-surface-300" />
          <h3 className="mt-4 text-lg font-medium text-surface-700">
            No bookmarks found
          </h3>
          <p className="mt-1 text-sm text-surface-500">
            {searchQuery || isSearching
              ? "Try a different search query"
              : "Click Sync to import your Twitter bookmarks"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              categories={categories}
              onDelete={handleDelete}
              onUpdateCategory={handleUpdateCategory}
            />
          ))}
        </div>
      )}

      {!isSearching && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-surface-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasMore}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
