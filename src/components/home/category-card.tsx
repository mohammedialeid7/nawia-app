"use client";

import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { CategoryWithIntentions } from "@/lib/types/database";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  category: CategoryWithIntentions;
  onClick: () => void;
}

function getIcon(iconName: string): LucideIcon {
  const formatted = iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("") as keyof typeof LucideIcons;
  return (LucideIcons[formatted] as LucideIcon) || LucideIcons.Circle;
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  const locale = useLocale();
  const t = useTranslations("site");
  const Icon = getIcon(category.icon_name);
  const name = locale === "ar" ? category.name_ar : category.name_en;
  const count = category.intentions.length;
  const Arrow = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full text-start rounded-xl border border-brand-200/60 bg-surface-base p-5",
        "shadow-card hover:shadow-card-hover",
        "hover:scale-[1.01] active:scale-[0.99]",
        "transition-transform duration-200 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      )}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 group-hover:bg-brand-200 transition-colors duration-200">
          <Icon className="h-5 w-5" />
        </span>

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "font-[family-name:var(--font-heading)] font-bold text-foreground leading-tight",
              locale === "ar" ? "text-lg" : "text-base"
            )}
          >
            {name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {count} {t("intentions_count")}
          </p>
        </div>

        <Arrow className="h-5 w-5 shrink-0 text-brand-400 mt-1 group-hover:text-brand-600 transition-colors duration-200" />
      </div>
    </button>
  );
}
