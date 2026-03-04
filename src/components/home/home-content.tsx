"use client";

import { useState, useMemo } from "react";
import { useLocale } from "next-intl";
import { CategoryWithIntentions } from "@/lib/types/database";
import { Hero } from "./hero";
import { CategoryGrid } from "./category-grid";
import { CategoryDetail } from "@/components/category-detail";

interface HomeContentProps {
  categories: CategoryWithIntentions[];
}

export function HomeContent({ categories }: HomeContentProps) {
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithIntentions | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const q = searchQuery.trim().toLowerCase();
    return categories.filter((cat) => {
      const nameAr = cat.name_ar.toLowerCase();
      const nameEn = cat.name_en.toLowerCase();
      const hasMatchingIntention = cat.intentions.some(
        (int) =>
          int.text_ar.toLowerCase().includes(q) ||
          int.text_en.toLowerCase().includes(q)
      );
      return nameAr.includes(q) || nameEn.includes(q) || hasMatchingIntention;
    });
  }, [categories, searchQuery]);

  function handleSelectCategory(category: CategoryWithIntentions) {
    setSelectedCategory(category);
    setDrawerOpen(true);
  }

  return (
    <>
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryGrid
        categories={filteredCategories}
        onSelectCategory={handleSelectCategory}
      />
      <CategoryDetail
        category={selectedCategory}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );
}
