"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-brand-200/60 bg-surface-elevated">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-center text-sm text-brand-600 font-medium">
          {t("credit")}
        </p>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {t("disclaimer")}
        </p>
      </div>
    </footer>
  );
}
