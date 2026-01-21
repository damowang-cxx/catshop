import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "../globals.css";
import { FeaturesProvider } from "components/features/features-provider";
import Navbar from "components/layout/navbar";
import Footer from "components/layout/footer";
import { locales, defaultLocale, type Locale } from "lib/i18n/config";
import { notFound } from "next/navigation";
import { use } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: process.env.SITE_NAME || "Next.js Commerce",
    template: `%s | ${process.env.SITE_NAME || "Next.js Commerce"}`,
  },
  description: "一个现代化的电商平台",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: process.env.SITE_NAME || "Next.js Commerce",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    follow: true,
    index: true,
  },
};

const localeNames: Record<Locale, string> = {
  zh: "zh-CN",
  en: "en-US",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <html lang={localeNames[locale as Locale]} className={GeistSans.className}>
      <body className="bg-gradient-to-br from-pink-50 via-amber-50 to-rose-50 text-black antialiased">
        <FeaturesProvider>
          <Navbar locale={locale as Locale} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer locale={locale as Locale} />
        </FeaturesProvider>
      </body>
    </html>
  );
}
