"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { t } from "lib/i18n";
import { type Locale } from "lib/i18n/config";
import { addLocaleToPath } from "lib/i18n/utils";

export default function HeroSection({ locale }: { locale: Locale }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-amber-50 to-rose-50 py-16 md:py-24">
      {/* 装饰性小熊图标 - 使用 SVG */}
      <div className="absolute left-4 top-8 animate-float delay-300">
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          className="opacity-20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" fill="#F9A8D4" />
          <circle cx="35" cy="35" r="8" fill="#EC4899" />
          <circle cx="65" cy="35" r="8" fill="#EC4899" />
          <ellipse cx="50" cy="55" rx="15" ry="12" fill="#EC4899" />
          <circle cx="40" cy="50" r="3" fill="#FFF" />
          <circle cx="60" cy="50" r="3" fill="#FFF" />
        </svg>
      </div>

      <div className="absolute right-8 top-16 animate-float delay-500">
        <svg
          width="60"
          height="60"
          viewBox="0 0 100 100"
          className="opacity-20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" fill="#FBCFE8" />
          <circle cx="35" cy="35" r="8" fill="#F472B6" />
          <circle cx="65" cy="35" r="8" fill="#F472B6" />
          <ellipse cx="50" cy="55" rx="15" ry="12" fill="#F472B6" />
        </svg>
      </div>

      <div className="absolute bottom-8 left-1/4 animate-float delay-700">
        <svg
          width="50"
          height="50"
          viewBox="0 0 100 100"
          className="opacity-15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" fill="#FCD34D" />
          <circle cx="35" cy="35" r="8" fill="#F59E0B" />
          <circle cx="65" cy="35" r="8" fill="#F59E0B" />
          <ellipse cx="50" cy="55" rx="15" ry="12" fill="#F59E0B" />
        </svg>
      </div>

      {/* 主要内容 */}
      <div className="relative mx-auto max-w-screen-2xl px-4">
        <div
          className={`flex flex-col items-center text-center transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* 主标题 */}
          <h1 className="mb-4 text-4xl font-bold text-rose-600 md:text-6xl lg:text-7xl">
            <span className="inline-block animate-bounce delay-100">🐻</span>
            <span className="mx-2">{t(locale, "common", "welcome")}</span>
            <span className="inline-block animate-bounce delay-200">🧸</span>
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              {t(locale, "common", "store")}
            </span>
          </h1>

          {/* 副标题 */}
          <p className="mb-8 max-w-2xl text-lg text-stone-700 md:text-xl">
            {t(locale, "common", "subtitle")}
            <br />
            {t(locale, "common", "subtitle2")} 💕
          </p>

          {/* CTA 按钮 */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href={addLocaleToPath("/search", locale)}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t(locale, "common", "shopNow")}
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>

            <Link
              href={addLocaleToPath("/search", locale)}
              className="rounded-full border-2 border-rose-300 bg-white px-8 py-4 text-lg font-semibold text-rose-600 transition-all duration-300 hover:scale-105 hover:bg-rose-50 hover:shadow-lg"
            >
              {t(locale, "common", "browseAll")}
            </Link>
          </div>

          {/* 装饰性星星 */}
          <div className="mt-12 flex gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <span
                key={i}
                className="text-2xl animate-bounce"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                ⭐
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 底部波浪装饰 */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="white"
            fillOpacity="0.8"
          />
        </svg>
      </div>
    </section>
  );
}
