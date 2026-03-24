export const locales = ["zh", "en", "de", "fr", "it"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";
export const autoDetectFallbackLocale: Locale = "en";

export function isSupportedLocale(
  value: string | null | undefined
): value is Locale {
  return Boolean(value && locales.includes(value as Locale));
}

export const countryLocaleMap: Record<string, Locale> = {
  CN: "zh",
  HK: "zh",
  MO: "zh",
  TW: "zh",
  DE: "de",
  AT: "de",
  LI: "de",
  FR: "fr",
  BE: "fr",
  MC: "fr",
  IT: "it",
  SM: "it",
  VA: "it",
  US: "en",
  GB: "en",
  AU: "en",
  CA: "en",
  IE: "en",
  NZ: "en",
  SG: "en",
  IN: "en",
  PH: "en",
  ZA: "en",
};

export const localeNames: Record<Locale, string> = {
  zh: "Chinese",
  en: "English",
  de: "Deutsch",
  fr: "Francais",
  it: "Italiano",
};

export const localeFlags: Record<Locale, string> = {
  zh: "🇨🇳",
  en: "🇺🇸",
  de: "🇩🇪",
  fr: "🇫🇷",
  it: "🇮🇹",
};
