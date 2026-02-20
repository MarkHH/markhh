import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { BookmarkService } from "@/services/bookmark.service";
import { slugify, getCategoryColor } from "@/lib/utils";

export async function GET() {
  try {
    const user = await requireUser();
    const categories = await BookmarkService.getCategories(user.id);
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { name } = await req.json();

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    const existingCategories = await BookmarkService.getCategories(user.id);
    const color = getCategoryColor(existingCategories.length);

    const category = await BookmarkService.createCategory(
      user.id,
      name.trim(),
      slugify(name.trim()),
      color
    );

    return NextResponse.json(category);
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser();
    const { categoryId } = await req.json();

    await BookmarkService.deleteCategory(categoryId, user.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/categories error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
