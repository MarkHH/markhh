"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Trash2,
  MoreHorizontal,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { BookmarkWithCategory, CategoryWithCount } from "@/types";

interface BookmarkCardProps {
  bookmark: BookmarkWithCategory;
  categories: CategoryWithCount[];
  onDelete: (id: string) => void;
  onUpdateCategory: (bookmarkId: string, categoryId: string | null) => void;
}

export function BookmarkCard({
  bookmark,
  categories,
  onDelete,
  onUpdateCategory,
}: BookmarkCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  return (
    <article className="group relative rounded-xl border border-surface-100 bg-white p-4 transition-all hover:border-surface-200 hover:shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {bookmark.authorAvatar ? (
            <Image
              src={bookmark.authorAvatar}
              alt={bookmark.authorName}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-200 text-sm font-semibold text-surface-600">
              {bookmark.authorName[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-surface-900">
                {bookmark.authorName}
              </span>
              <span className="text-sm text-surface-400">
                @{bookmark.authorUsername}
              </span>
            </div>
            <time className="text-xs text-surface-400">
              {formatDate(bookmark.tweetCreatedAt)}
            </time>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {bookmark.category && (
            <Badge
              color={bookmark.category.color}
              onClick={() => setShowCategoryPicker(!showCategoryPicker)}
              className="cursor-pointer"
            >
              {bookmark.category.name}
            </Badge>
          )}

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="rounded-lg p-1.5 text-surface-300 opacity-0 transition-opacity hover:bg-surface-50 hover:text-surface-600 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 z-20 mt-1 w-48 overflow-hidden rounded-lg border border-surface-200 bg-white shadow-lg">
                  <button
                    onClick={() => {
                      setShowCategoryPicker(true);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                  >
                    <Tag className="h-4 w-4" />
                    Change Category
                  </button>
                  <a
                    href={`https://twitter.com/${bookmark.authorUsername}/status/${bookmark.tweetId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                    onClick={() => setShowMenu(false)}
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on Twitter
                  </a>
                  <button
                    onClick={() => {
                      onDelete(bookmark.id);
                      setShowMenu(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Bookmark
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-surface-700 leading-relaxed whitespace-pre-wrap">
        {bookmark.content}
      </p>

      {bookmark.mediaUrls.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {bookmark.mediaUrls.map((url, i) => (
            <Image
              key={i}
              src={url}
              alt="Tweet media"
              width={200}
              height={150}
              className="rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <a
          href={`https://twitter.com/${bookmark.authorUsername}/status/${bookmark.tweetId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-surface-400 hover:text-primary-600 transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          View on Twitter
        </a>
      </div>

      {showCategoryPicker && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowCategoryPicker(false)}
          />
          <div className="absolute right-4 top-12 z-20 w-56 overflow-hidden rounded-lg border border-surface-200 bg-white shadow-lg">
            <div className="border-b border-surface-100 px-3 py-2">
              <span className="text-xs font-semibold text-surface-500 uppercase">
                Assign Category
              </span>
            </div>
            <div className="max-h-48 overflow-y-auto">
              <button
                onClick={() => {
                  onUpdateCategory(bookmark.id, null);
                  setShowCategoryPicker(false);
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-500 hover:bg-surface-50"
              >
                None
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onUpdateCategory(bookmark.id, cat.id);
                    setShowCategoryPicker(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-surface-700 hover:bg-surface-50"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                  {cat.id === bookmark.categoryId && (
                    <svg
                      className="ml-auto h-4 w-4 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </article>
  );
}
