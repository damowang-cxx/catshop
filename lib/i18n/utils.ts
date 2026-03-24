import {
  defaultLocale,
  isSupportedLocale,
  locales,
  type Locale,
} from "./config";

function normalizePathname(pathname: string): string {
  if (!pathname) {
    return "/";
  }

  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getLocaleFromPath(pathname: string): Locale {
  const segments = normalizePathname(pathname).split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }

  return defaultLocale;
}

export function removeLocaleFromPath(pathname: string): string {
  const normalizedPathname = normalizePathname(pathname);
  const segments = normalizedPathname.split("/").filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && locales.includes(firstSegment as Locale)) {
    const pathWithoutLocale = `/${segments.slice(1).join("/")}`;
    return pathWithoutLocale === "/"
      ? "/"
      : pathWithoutLocale.replace(/\/+$/, "");
  }

  return normalizedPathname === "/"
    ? "/"
    : normalizedPathname.replace(/\/+$/, "");
}

export function addLocaleToPath(
  pathname: string,
  locale: Locale | string | null | undefined
): string {
  const pathWithoutLocale = removeLocaleFromPath(pathname);
  const safeLocale = isSupportedLocale(locale) ? locale : defaultLocale;

  return `/${safeLocale}${pathWithoutLocale}`;
}
