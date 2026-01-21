export const locales = ["zh", "en", "de", "fr", "it"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

export const localeNames: Record<Locale, string> = {
  zh: "中文",
  en: "English",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
};

export const localeFlags: Record<Locale, string> = {
  zh: "🇨🇳",
  en: "🇬🇧",
  de: "🇩🇪",
  fr: "🇫🇷",
  it: "🇮🇹",
};
