import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { BookmarkService } from "@/services/bookmark.service";

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser();
    const query = req.nextUrl.searchParams.get("q") ?? "";
    const type = req.nextUrl.searchParams.get("type") ?? "semantic";

    if (!query.trim()) {
      return NextResponse.json({ data: [] });
    }

    if (type === "semantic") {
      const results = await BookmarkService.searchSemantic(
        user.id,
        query,
        20
      );
      return NextResponse.json({ data: results });
    }

    const results = await BookmarkService.getBookmarks(user.id, 1, 50, {
      query,
      searchType: "keyword",
    });
    return NextResponse.json(results);
  } catch (error) {
    console.error("GET /api/bookmarks/search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
