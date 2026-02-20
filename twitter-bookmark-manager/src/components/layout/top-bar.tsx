"use client";

import { UserButton } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/bookmarks/search-bar";

export function TopBar() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  async function handleSync() {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/bookmarks/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setSyncResult(
          data.imported > 0
            ? `Synced ${data.imported} new bookmarks`
            : "Already up to date"
        );
        window.dispatchEvent(new CustomEvent("bookmarks-updated"));
      } else {
        setSyncResult("Sync failed");
      }
    } catch {
      setSyncResult("Sync failed");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncResult(null), 4000);
    }
  }

  return (
    <div className="flex h-16 items-center gap-4 border-b border-surface-100 bg-white px-4 sm:px-6">
      <div className="ml-12 flex-1 lg:ml-0">
        <SearchBar />
      </div>

      <div className="flex items-center gap-3">
        {syncResult && (
          <span className="hidden text-sm text-surface-500 sm:block">
            {syncResult}
          </span>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSync}
          isLoading={isSyncing}
          className="shrink-0"
        >
          <RefreshCw className={cn("mr-1.5 h-4 w-4", isSyncing && "animate-spin")} />
          <span className="hidden sm:inline">Sync</span>
        </Button>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
