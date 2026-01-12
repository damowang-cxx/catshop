/**
 * 页脚组件
 * 显示网站 Logo、菜单链接、版权信息等
 */

import Link from "next/link";

import FooterMenu from "components/layout/footer-menu";
import LogoSquare from "components/logo-square";
import { getMenu } from "lib/commerce";
import { Suspense } from "react";

// 从环境变量获取公司名称和网站名称
const { COMPANY_NAME, SITE_NAME } = process.env;

/**
 * 页脚主组件
 * @returns 页脚的 JSX
 */
export default async function Footer() {
  const currentYear = new Date().getFullYear();
  // 生成版权日期字符串
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  // 加载状态的骨架屏样式
  const skeleton =
    "w-full h-6 animate-pulse rounded-sm bg-stone-200 dark:bg-stone-700";
  // 获取页脚菜单
  const menu = await getMenu("next-js-frontend-footer-menu");
  // 版权名称（优先使用公司名称）
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="text-sm text-stone-600">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-stone-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0">
        <div>
          <Link
            className="flex items-center gap-2 text-stone-900 md:pt-1"
            href="/"
          >
            <LogoSquare size="sm" />
            <span className="uppercase">{SITE_NAME}</span>
          </Link>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
        <div className="md:ml-auto">
          <a
            className="flex h-8 w-max flex-none items-center justify-center rounded-md border border-stone-300 bg-khaki-light text-xs text-stone-900"
            aria-label="Deploy on Vercel"
            href="https://vercel.com/templates/next.js/nextjs-commerce"
          >
            <span className="px-3">▲</span>
            <hr className="h-full border-r border-stone-200 dark:border-stone-700" />
            <span className="px-3">Deploy</span>
          </a>
        </div>
      </div>
      <div className="border-t border-stone-200 py-6 text-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".")
              ? "."
              : ""}{" "}
            All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-stone-400 md:inline-block" />
          <p>
            <a href="https://github.com/vercel/commerce">View the source</a>
          </p>
          <p className="md:ml-auto">
            <a href="https://vercel.com" className="text-stone-900">
              Created by ▲ Vercel
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
