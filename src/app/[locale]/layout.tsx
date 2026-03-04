import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "ar" | "en")) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";
  const fontHeading = locale === "ar" ? "var(--font-amiri)" : "var(--font-playfair)";
  const fontBody = locale === "ar" ? "var(--font-ibm-plex-arabic)" : "var(--font-inter)";

  return (
    <div
      lang={locale}
      dir={dir}
      style={{
        ["--font-heading" as string]: fontHeading,
        ["--font-body" as string]: fontBody,
      }}
    >
      <NextIntlClientProvider messages={messages}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </NextIntlClientProvider>
    </div>
  );
}
