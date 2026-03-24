import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  applyLocaleCookie,
  getLocaleFromPathname,
  hasLocalePrefix,
  resolveRequestLocale,
} from "./lib/i18n/detection";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (hasLocalePrefix(pathname)) {
    const locale = getLocaleFromPathname(pathname);
    if (!locale) {
      return NextResponse.next();
    }

    const currentCookie = request.cookies.get("locale")?.value;
    if (currentCookie === locale) {
      return NextResponse.next();
    }

    return applyLocaleCookie(NextResponse.next(), locale);
  }

  const locale = resolveRequestLocale(request);
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
  redirectUrl.search = request.nextUrl.search;

  return applyLocaleCookie(NextResponse.redirect(redirectUrl), locale);
}

export const config = {
  matcher: [
    "/((?!api|admin|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|search/[^/]+/opengraph-image|.*\\..*).*)",
  ],
};
