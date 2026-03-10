import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { FeaturesProvider } from "components/features/features-provider";
import Navbar from "components/layout/navbar";
import Footer from "components/layout/footer";
import { defaultLocale } from "lib/i18n/config";
import { getCommerceFeatures } from "lib/commerce";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const features = getCommerceFeatures();

  return (
    <html lang="zh-CN" className={GeistSans.className}>
      <body className="bg-gradient-to-br from-pink-50 via-amber-50 to-rose-50 text-black antialiased">
        <FeaturesProvider features={features}>
          <Navbar locale={defaultLocale} />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer locale={defaultLocale} />
        </FeaturesProvider>
      </body>
    </html>
  );
}
