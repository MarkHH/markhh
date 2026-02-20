"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FilterBarProps {
  authorFilter: string;
  dateFrom: string;
  dateTo: string;
  onAuthorChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
}

export function FilterBar({
  authorFilter,
  dateFrom,
  dateTo,
  onAuthorChange,
  onDateFromChange,
  onDateToChange,
}: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasFilters = authorFilter || dateFrom || dateTo;

  function clearFilters() {
    onAuthorChange("");
    onDateFromChange("");
    onDateToChange("");
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button
          variant={isExpanded ? "secondary" : "ghost"}
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="mr-1.5 h-4 w-4" />
          Filters
          {hasFilters && (
            <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] text-white">
              {[authorFilter, dateFrom, dateTo].filter(Boolean).length}
            </span>
          )}
        </Button>

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-3 flex flex-wrap items-end gap-3 rounded-lg border border-surface-100 bg-surface-50 p-4">
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-surface-500">
              Author
            </label>
            <Input
              value={authorFilter}
              onChange={(e) => onAuthorChange(e.target.value)}
              placeholder="e.g. elonmusk"
              className="w-full sm:w-44"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-surface-500">
              From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => onDateFromChange(e.target.value)}
              className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:w-40"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="mb-1 block text-xs font-medium text-surface-500">
              To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => onDateToChange(e.target.value)}
              className="w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 sm:w-40"
            />
          </div>
        </div>
      )}
    </div>
  );
}
