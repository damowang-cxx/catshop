import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { FeaturesProvider } from "components/features/features-provider";

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
  return (
    <html lang="zh-CN" className={GeistSans.className}>
      <body className="bg-white text-black antialiased dark:bg-neutral-900 dark:text-white">
        <FeaturesProvider>
          {children}
        </FeaturesProvider>
      </body>
    </html>
  );
}
