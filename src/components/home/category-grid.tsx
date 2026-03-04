"use client";

import { useTranslations } from "next-intl";
import { CategoryWithIntentions } from "@/lib/types/database";
import { CategoryCard } from "./category-card";

interface CategoryGridProps {
  categories: CategoryWithIntentions[];
  onSelectCategory: (category: CategoryWithIntentions) => void;
}

export function CategoryGrid({
  categories,
  onSelectCategory,
}: CategoryGridProps) {
  const t = useTranslations("site");

  if (categories.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-12 text-center">
        <p className="text-muted-foreground">{t("no_results")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 pb-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <div
            key={category.id}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
            className="animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both"
          >
            <CategoryCard
              category={category}
              onClick={() => onSelectCategory(category)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
