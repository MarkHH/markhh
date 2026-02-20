"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, Sparkles, Type, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"semantic" | "keyword">("semantic");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback(() => {
    if (!query.trim()) {
      window.dispatchEvent(new CustomEvent("search-clear"));
      return;
    }
    window.dispatchEvent(
      new CustomEvent("search-query", {
        detail: { query: query.trim(), type: searchType },
      })
    );
  }, [query, searchType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [query, searchType, handleSearch]);

  function handleClear() {
    setQuery("");
    window.dispatchEvent(new CustomEvent("search-clear"));
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-lg">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            searchType === "semantic"
              ? "Search with AI... (e.g., 'tweets about vibecoding')"
              : "Search by keyword..."
          }
          icon={<Search className="h-4 w-4" />}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-2 flex items-center text-surface-400 hover:text-surface-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="hidden items-center rounded-lg border border-surface-200 p-0.5 sm:flex">
        <button
          onClick={() => setSearchType("semantic")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
            searchType === "semantic"
              ? "bg-primary-50 text-primary-700"
              : "text-surface-500 hover:text-surface-700"
          )}
          title="AI-powered semantic search"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI
        </button>
        <button
          onClick={() => setSearchType("keyword")}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
            searchType === "keyword"
              ? "bg-primary-50 text-primary-700"
              : "text-surface-500 hover:text-surface-700"
          )}
          title="Traditional keyword search"
        >
          <Type className="h-3.5 w-3.5" />
          Keyword
        </button>
      </div>
    </div>
  );
}
