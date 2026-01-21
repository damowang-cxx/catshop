import { defaultLocale, type Locale } from "./config";
import zh from "../../messages/zh.json";
import en from "../../messages/en.json";
import de from "../../messages/de.json";
import fr from "../../messages/fr.json";
import it from "../../messages/it.json";

const messages = {
  zh,
  en,
  de,
  fr,
  it,
} as const;

export function getTranslations(locale: Locale) {
  return messages[locale] || messages[defaultLocale];
}

export function getNestedTranslation(
  locale: Locale,
  namespace: string,
  key: string
): string {
  const translations = getTranslations(locale);
  const namespaceObj = (translations as any)[namespace];
  if (!namespaceObj) {
    console.warn(`Namespace "${namespace}" not found`);
    return key;
  }
  return namespaceObj[key] || key;
}

export function t(locale: Locale, namespace: string, key: string): string {
  return getNestedTranslation(locale, namespace, key);
}
