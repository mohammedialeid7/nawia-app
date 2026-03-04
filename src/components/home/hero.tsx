"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Hero({ searchQuery, onSearchChange }: HeroProps) {
  const t = useTranslations("site");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-brand-800 to-brand-700 hero-texture islamic-pattern">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(93,170,124,0.15),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(26,42,28,0.3),_transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-14 sm:py-20 sm:px-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 font-[family-name:var(--font-heading)]">
          {t("name")}
        </h1>
        <p className="text-brand-200 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
          {t("tagline")}
        </p>

        <div className="relative mx-auto max-w-md">
          <Search className="absolute start-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-400 z-10" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("search_placeholder")}
            className="w-full rounded-xl border border-white/10 bg-white/10 ps-11 pe-4 py-3 text-sm text-white placeholder:text-brand-300/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-brand-400/50 focus:bg-white/15 transition-colors duration-200"
          />
        </div>
      </div>
    </section>
  );
}
