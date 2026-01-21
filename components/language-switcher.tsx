"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { locales, localeNames, localeFlags, type Locale } from "lib/i18n/config";
import { removeLocaleFromPath, addLocaleToPath } from "lib/i18n/utils";

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (locale: Locale) => {
    setIsOpen(false);
    // 移除当前语言前缀，添加新语言前缀
    const pathWithoutLocale = removeLocaleFromPath(pathname);
    const newPath = addLocaleToPath(pathWithoutLocale, locale);
    
    // 设置 cookie
    document.cookie = `locale=${locale}; path=/; max-age=31536000`;
    
    router.push(newPath);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".language-switcher")) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative language-switcher">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 rounded-lg border-2 border-pink-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition-all duration-300 hover:border-rose-400 hover:bg-pink-50 hover:text-rose-600"
        aria-label="切换语言"
      >
        <span className="text-lg">{localeFlags[currentLocale]}</span>
        <span className="hidden sm:inline">{localeNames[currentLocale]}</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-20 mt-2 w-40 rounded-lg border-2 border-pink-200 bg-white shadow-lg">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={(e) => {
                e.stopPropagation();
                switchLanguage(locale);
              }}
              className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                currentLocale === locale
                  ? "bg-pink-100 text-rose-600 font-semibold"
                  : "text-stone-700 hover:bg-pink-50 hover:text-rose-600"
              }`}
            >
              <span className="text-lg">{localeFlags[locale]}</span>
              <span>{localeNames[locale]}</span>
              {currentLocale === locale && (
                <span className="ml-auto text-rose-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
