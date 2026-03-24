import type { NextRequest, NextResponse } from "next/server";
import {
  autoDetectFallbackLocale,
  countryLocaleMap,
  isSupportedLocale,
  type Locale,
} from "./config";

const GEO_COUNTRY_HEADERS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-appengine-country",
  "x-geo-country",
];

const LOCALE_COOKIE_NAME = "locale";
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function hasLocalePrefix(pathname: string) {
  return pathname
    .split("/")
    .filter(Boolean)
    .slice(0, 1)
    .some((segment) => isSupportedLocale(segment));
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return isSupportedLocale(firstSegment) ? firstSegment : null;
}

export function resolveRequestLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  const browserLocale = getLocaleFromAcceptLanguage(
    request.headers.get("accept-language")
  );
  if (browserLocale) {
    return browserLocale;
  }

  const countryLocale = getLocaleFromCountryCode(
    getCountryCodeFromHeaders(request)
  );
  if (countryLocale) {
    return countryLocale;
  }

  return autoDetectFallbackLocale;
}

export function applyLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

function getLocaleFromAcceptLanguage(
  acceptLanguage: string | null
): Locale | null {
  if (!acceptLanguage) {
    return null;
  }

  const languages = acceptLanguage
    .split(",")
    .map((part) => {
      const [rawCode = "", rawQ = "1"] = part.trim().split(";q=");
      const normalizedCode = rawCode.toLowerCase();
      const [baseCode = ""] = normalizedCode.split("-");

      return {
        code: normalizedCode,
        baseCode,
        quality: Number.parseFloat(rawQ),
      };
    })
    .filter(
      (entry) =>
        entry.code.length > 0 &&
        Number.isFinite(entry.quality) &&
        entry.quality > 0
    )
    .sort((left, right) => right.quality - left.quality);

  for (const language of languages) {
    if (isSupportedLocale(language.code)) {
      return language.code;
    }

    if (isSupportedLocale(language.baseCode)) {
      return language.baseCode;
    }
  }

  return null;
}

function getCountryCodeFromHeaders(request: NextRequest): string | null {
  for (const headerName of GEO_COUNTRY_HEADERS) {
    const value = request.headers.get(headerName)?.trim().toUpperCase();
    if (value && value !== "XX" && value !== "T1") {
      return value;
    }
  }

  return null;
}

function getLocaleFromCountryCode(countryCode: string | null): Locale | null {
  if (!countryCode) {
    return null;
  }

  return countryLocaleMap[countryCode] ?? null;
}
