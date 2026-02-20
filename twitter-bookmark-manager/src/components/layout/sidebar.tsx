"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BookmarkCheck,
  LayoutDashboard,
  Settings,
  Tag,
  ChevronLeft,
  Plus,
  Trash2,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  _count: { bookmarks: number };
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const activeCategoryId = searchParams.get("category") ?? null;

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (res.ok) {
        setNewCategoryName("");
        setIsAddingCategory(false);
        fetchCategories();
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  }

  async function handleDeleteCategory(categoryId: string) {
    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId }),
      });
      if (res.ok) {
        fetchCategories();
        if (activeCategoryId === categoryId) {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  }

  function selectCategory(categoryId: string | null) {
    if (categoryId) {
      router.push(`/dashboard?category=${categoryId}`);
    } else {
      router.push("/dashboard");
    }
    setIsMobileOpen(false);
  }

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-surface-100 px-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <BookmarkCheck className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold">BookmarkIQ</span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600 lg:block"
        >
          <ChevronLeft
            className={cn("h-5 w-5 transition-transform", isCollapsed && "rotate-180")}
          />
        </button>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3 scrollbar-thin">
        <button
          onClick={() => selectCategory(null)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/dashboard" && !activeCategoryId
              ? "bg-primary-50 text-primary-700"
              : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          {!isCollapsed && "All Bookmarks"}
        </button>

        {!isCollapsed && (
          <div className="pt-4">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-surface-400">
                Categories
              </span>
              <button
                onClick={() => setIsAddingCategory(!isAddingCategory)}
                className="rounded p-0.5 text-surface-400 hover:bg-surface-100 hover:text-surface-600"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {isAddingCategory && (
              <div className="mt-1 px-3">
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                    placeholder="Category name"
                    className="w-full rounded border border-surface-200 px-2 py-1 text-sm focus:border-primary-500 focus:outline-none"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleAddCategory}
                    className="shrink-0"
                  >
                    Add
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-1 space-y-0.5">
              {categories.map((category) => (
                <div key={category.id} className="group flex items-center">
                  <button
                    onClick={() => selectCategory(category.id)}
                    className={cn(
                      "flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      activeCategoryId === category.id
                        ? "bg-primary-50 text-primary-700 font-medium"
                        : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
                    )}
                  >
                    <Tag
                      className="h-3.5 w-3.5 shrink-0"
                      style={{ color: category.color }}
                    />
                    <span className="truncate">{category.name}</span>
                    <Badge className="ml-auto" color={category.color}>
                      {category._count.bookmarks}
                    </Badge>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="mr-1 hidden rounded p-1 text-surface-300 hover:bg-red-50 hover:text-red-500 group-hover:block"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="border-t border-surface-100 p-3">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-primary-50 text-primary-700"
              : "text-surface-600 hover:bg-surface-50 hover:text-surface-900"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          {!isCollapsed && "Settings"}
        </Link>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        <Menu className="h-5 w-5 text-surface-700" />
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-surface-200 bg-white transition-all duration-200 lg:static lg:z-auto",
          isCollapsed ? "lg:w-16" : "lg:w-64",
          isMobileOpen ? "w-64 translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
