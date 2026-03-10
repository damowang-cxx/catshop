import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * 确保字符串以指定前缀开头
 */
export function ensureStartsWith(str: string, prefix: string): string {
  if (str.startsWith(prefix)) {
    return str;
  }
  return `${prefix}${str}`;
}

export function createUrl(
  pathname: string,
  params: { toString(): string }
): string {
  const paramsString = params.toString();
  return `${pathname}${paramsString.length ? `?${paramsString}` : ""}`;
}

const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

export function getBaseUrl(): string {
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL);
}

export const baseUrl = getBaseUrl();

export function validateEnvironmentVariables(): void {
  const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!configuredSiteUrl) {
    return;
  }

  try {
    const parsed = new URL(configuredSiteUrl);
    if (!parsed.protocol.startsWith("http")) {
      throw new Error("URL must use http/https protocol");
    }
  } catch (error) {
    console.warn(
      "NEXT_PUBLIC_SITE_URL is invalid, fallback to default URL.",
      error
    );
  }
}
