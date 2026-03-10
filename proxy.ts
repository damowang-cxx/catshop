import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, locales } from "./lib/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

function getLocale(request: NextRequest): string {
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && locales.includes(cookieLocale as (typeof locales)[number])) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [rawCode = "", q = "1"] = lang.trim().split(";q=");
        const [baseCode = ""] = rawCode.split("-");
        return { code: baseCode, quality: parseFloat(q) };
      })
      .sort((a, b) => b.quality - a.quality);

    for (const lang of languages) {
      if (locales.includes(lang.code as (typeof locales)[number])) {
        return lang.code;
      }
    }
  }

  return defaultLocale;
}

export const config = {
  matcher: [
    "/((?!api|admin|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|search/[^/]+/opengraph-image|.*\\..*).*)",
  ],
};
