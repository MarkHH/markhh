import { Suspense } from "react";
import { BookmarkList } from "@/components/bookmarks/bookmark-list";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        }
      >
        <BookmarkList />
      </Suspense>
    </div>
  );
}
