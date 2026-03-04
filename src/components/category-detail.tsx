"use client";

import { useTranslations, useLocale } from "next-intl";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CategoryWithIntentions } from "@/lib/types/database";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface CategoryDetailProps {
  category: CategoryWithIntentions | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getIcon(iconName: string): LucideIcon {
  const formatted = iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("") as keyof typeof LucideIcons;
  return (LucideIcons[formatted] as LucideIcon) || LucideIcons.Circle;
}

export function CategoryDetail({
  category,
  open,
  onOpenChange,
}: CategoryDetailProps) {
  const t = useTranslations("actions");
  const locale = useLocale();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!category) return null;

  const Icon = getIcon(category.icon_name);
  const categoryName =
    locale === "ar" ? category.name_ar : category.name_en;

  async function handleCopyAll() {
    if (!category) return;
    const lines = category.intentions
      .map((int, i) => {
        const text = locale === "ar" ? int.text_ar : int.text_en;
        return `${i + 1}. ${text}`;
      })
      .join("\n");

    const header = `${categoryName}\n${"—".repeat(20)}\n`;
    await navigator.clipboard.writeText(header + lines);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  }

  async function handleCopySingle(index: number) {
    if (!category) return;
    const int = category.intentions[index];
    const text = locale === "ar" ? int.text_ar : int.text_en;
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={locale === "ar" ? "right" : "left"}
        className="w-full sm:max-w-lg overflow-y-auto"
      >
        <SheetHeader className="text-start">
          <div className="flex items-center gap-3 mb-1">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <SheetTitle
                className={cn(
                  "font-[family-name:var(--font-heading)] text-foreground",
                  locale === "ar" ? "text-xl" : "text-lg"
                )}
              >
                {categoryName}
              </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {category.intentions.map((intention, index) => {
            const textAr = intention.text_ar;
            const textEn = intention.text_en;
            const sourceAr = intention.source_ar;
            const sourceEn = intention.source_en;
            const isCopied = copiedIndex === index;

            return (
              <div
                key={intention.id}
                className="group rounded-xl border border-brand-100 bg-brand-50/50 p-4 hover:bg-brand-50 transition-colors duration-200"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-200/60 text-brand-800 text-sm font-bold font-[family-name:var(--font-heading)]">
                    {index + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    <p
                      className="font-[family-name:var(--font-heading)] text-base leading-relaxed text-brand-950"
                      dir="rtl"
                      lang="ar"
                    >
                      {textAr}
                    </p>

                    {locale === "en" && (
                      <p
                        className="mt-1.5 text-sm leading-relaxed text-muted-foreground"
                        dir="ltr"
                        lang="en"
                      >
                        {textEn}
                      </p>
                    )}

                    {(sourceAr || sourceEn) && (
                      <p className="mt-2 text-xs text-brand-500">
                        {locale === "ar" ? sourceAr : sourceEn}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleCopySingle(index)}
                    className={cn(
                      "shrink-0 mt-0.5 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                      "hover:bg-brand-200/60 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                      isCopied && "opacity-100"
                    )}
                    title={t("copy")}
                  >
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5 text-brand-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-brand-400" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <Separator className="my-6 bg-brand-100" />

        <Button
          onClick={handleCopyAll}
          className={cn(
            "w-full",
            copiedAll
              ? "bg-brand-600 hover:bg-brand-600"
              : "bg-brand-800 hover:bg-brand-700"
          )}
        >
          {copiedAll ? (
            <>
              <Check className="h-4 w-4 me-2" />
              {t("copied")}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 me-2" />
              {t("copy_all")}
            </>
          )}
        </Button>
      </SheetContent>
    </Sheet>
  );
}
