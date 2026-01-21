import { getMenu } from "lib/commerce";
import LogoSquare from "components/logo-square";
import Link from "next/link";
import FooterMenu from "./footer-menu";
import { type Locale } from "lib/i18n/config";
import { addLocaleToPath } from "lib/i18n/utils";
import { t } from "lib/i18n";

export default async function Footer({ locale }: { locale: Locale }) {
  const menu = await getMenu("next-js-frontend-footer-menu");

  return (
    <footer className="border-t border-pink-200/50 bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 text-stone-900">
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-4">
          <div className="flex flex-col">
            <Link
              href={addLocaleToPath("/", locale)}
              className="mb-4 flex items-center gap-2 transition-transform duration-300 hover:scale-105"
            >
              <LogoSquare />
              <span className="font-bold text-rose-600">
                {process.env.SITE_NAME || t(locale, "common", "store")}
              </span>
            </Link>
            <p className="text-sm text-stone-700">
              {t(locale, "common", "footerDesc")}
              <br />
              {t(locale, "common", "footerDesc2")} 💕
            </p>
            <div className="mt-4 flex gap-2">
              {["🐻", "🧸", "💕"].map((emoji, i) => (
                <span key={i} className="text-xl animate-bounce" style={{ animationDelay: `${i * 200}ms` }}>
                  {emoji}
                </span>
              ))}
            </div>
          </div>
          <FooterMenu menu={menu} />
        </div>
        <div className="border-t border-pink-200/50 py-6 text-sm">
          <p className="text-center text-stone-600">
            © {new Date().getFullYear()} {process.env.SITE_NAME || t(locale, "common", "store")}. {t(locale, "common", "rights")}. 
            <span className="ml-2">💝</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
