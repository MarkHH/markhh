import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { BookmarkService } from "@/services/bookmark.service";

export async function POST() {
  try {
    const user = await requireUser();
    const result = await BookmarkService.syncBookmarks(user.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/bookmarks/sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync bookmarks" },
      { status: 500 }
    );
  }
}
