import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { BookmarkService } from "@/services/bookmark.service";
import type { SearchFilters } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const searchParams = req.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") ?? "1");
    const pageSize = parseInt(searchParams.get("pageSize") ?? "20");

    const filters: SearchFilters = {};
    if (searchParams.get("query")) filters.query = searchParams.get("query")!;
    if (searchParams.get("categoryId"))
      filters.categoryId = searchParams.get("categoryId")!;
    if (searchParams.get("authorUsername"))
      filters.authorUsername = searchParams.get("authorUsername")!;
    if (searchParams.get("dateFrom"))
      filters.dateFrom = searchParams.get("dateFrom")!;
    if (searchParams.get("dateTo"))
      filters.dateTo = searchParams.get("dateTo")!;
    if (searchParams.get("searchType"))
      filters.searchType = searchParams.get("searchType") as
        | "keyword"
        | "semantic";

    const result = await BookmarkService.getBookmarks(
      user.id,
      page,
      pageSize,
      filters
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/bookmarks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser();
    const { bookmarkId } = await req.json();

    await BookmarkService.deleteBookmark(bookmarkId, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/bookmarks error:", error);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser();
    const { bookmarkId, categoryId } = await req.json();

    const bookmark = await BookmarkService.updateCategory(
      bookmarkId,
      user.id,
      categoryId
    );
    return NextResponse.json(bookmark);
  } catch (error) {
    console.error("PATCH /api/bookmarks error:", error);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}
