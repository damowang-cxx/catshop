import Link from "next/link";
import { Suspense } from "react";
import LogoSquare from "components/logo-square";
import { getMenu } from "lib/commerce";
import { Menu } from "lib/types";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";
import LanguageSwitcher from "components/language-switcher";
import { type Locale } from "lib/i18n/config";
import { addLocaleToPath } from "lib/i18n/utils";
import { t } from "lib/i18n";

export default async function Navbar({ locale }: { locale: Locale }) {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-pink-200/50 bg-gradient-to-r from-pink-50/95 via-rose-50/95 to-amber-50/95 p-4 backdrop-blur-sm shadow-sm lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href={addLocaleToPath("/", locale)}
            className="mr-2 flex w-full items-center justify-center transition-transform duration-300 hover:scale-105 md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-bold text-rose-600 md:hidden lg:block">
              {process.env.SITE_NAME || t(locale, "common", "store")}
            </div>
          </Link>
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <Link
                    href={addLocaleToPath(item.path, locale)}
                    className="rounded-lg px-3 py-2 text-stone-700 transition-all duration-300 hover:bg-pink-100 hover:text-rose-600 hover:shadow-sm"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton locale={locale} />}>
            <Search locale={locale} />
          </Suspense>
        </div>
        <div className="flex items-center justify-end gap-3 md:w-1/3">
          <LanguageSwitcher currentLocale={locale} />
          <Link
            href="/admin"
            className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition-all duration-300 hover:bg-pink-100 hover:text-rose-600 hover:shadow-sm"
          >
            {t(locale, "common", "admin")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
