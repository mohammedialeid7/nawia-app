"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageToggle } from "@/components/language-toggle";

export function Header() {
  const t = useTranslations("site");

  return (
    <header className="sticky top-0 z-50 border-b border-brand-200/60 bg-surface-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group"
        >
          <span className="text-lg font-bold text-brand-900 font-[family-name:var(--font-heading)] tracking-tight group-hover:text-brand-700 transition-colors duration-200">
            {t("name")}
          </span>
        </Link>

        <LanguageToggle />
      </div>
    </header>
  );
}
