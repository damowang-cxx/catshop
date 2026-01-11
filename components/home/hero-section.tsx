"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative py-20 px-4 md:py-32">
      {/* 主要内容 */}
      <div className="relative z-10 mx-auto max-w-5xl">
        <div
          className={`transform transition-all duration-700 ease-out ${
            mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <div className="mb-6 inline-block rounded-full border border-stone-300/50 bg-khaki-light/80 px-4 py-1.5 text-sm text-stone-700 backdrop-blur-sm">
            精选优质玩偶
          </div>
          
          <h1 className="mb-6 text-5xl font-light tracking-tight text-stone-900 md:text-7xl lg:text-8xl">
            每一只玩偶
            <br />
            <span className="font-medium text-amber-600">都值得被珍爱</span>
          </h1>
          
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-stone-600 md:text-xl">
            精心挑选的优质玩偶，陪伴你的每一个时刻。简约设计，温暖质感，让生活更有温度。
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Link
              href="/search"
              className="group relative inline-flex items-center gap-2 rounded-lg bg-stone-900 px-8 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:bg-stone-800 hover:shadow-lg"
            >
              浏览商品
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300/50 bg-khaki-light/80 px-8 py-3.5 text-sm font-medium text-stone-700 backdrop-blur-sm transition-all duration-300 hover:border-stone-400 hover:bg-khaki-light"
            >
              了解更多
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
