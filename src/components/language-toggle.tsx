"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(newLocale: "ar" | "en") {
    if (newLocale === locale) return;
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-brand-100 p-0.5">
      <button
        onClick={() => switchLocale("ar")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors transition-opacity duration-200",
          locale === "ar"
            ? "bg-brand-800 text-white shadow-sm"
            : "text-brand-700 hover:text-brand-900 hover:bg-brand-200/60"
        )}
      >
        عربي
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={cn(
          "rounded-md px-3 py-1.5 text-sm font-medium transition-colors transition-opacity duration-200",
          locale === "en"
            ? "bg-brand-800 text-white shadow-sm"
            : "text-brand-700 hover:text-brand-900 hover:bg-brand-200/60"
        )}
      >
        EN
      </button>
    </div>
  );
}
