/**
 * 导航栏组件
 * 包含网站 Logo、菜单、搜索框、购物车等主要导航元素
 */

import CartModal from "components/cart/modal";
import LogoSquare from "components/logo-square";
import { FeatureGate } from "components/features/feature-gate";
import { getMenu, getCommerceFeatures } from "lib/commerce";
import { Menu } from "lib/types";
import Link from "next/link";
import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

// 从环境变量获取网站名称
const { SITE_NAME } = process.env;

/**
 * 导航栏主组件
 * 根据功能开关显示/隐藏相应功能
 * @returns 导航栏的 JSX
 */
export async function Navbar() {
  // 获取导航菜单
  const menu = await getMenu("next-js-frontend-header-menu");
  // 获取功能开关配置
  const features = getCommerceFeatures();

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
          >
            <LogoSquare />
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              {SITE_NAME}
            </div>
          </Link>
          <FeatureGate feature="menus">
            {menu.length ? (
              <ul className="hidden gap-6 text-sm md:flex md:items-center">
                {menu.map((item: Menu) => (
                  <li key={item.title}>
                    <Link
                      href={item.path}
                      prefetch={true}
                      className="text-stone-600 underline-offset-4 hover:text-stone-900 hover:underline transition-colors"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="hidden gap-6 text-sm md:flex md:items-center">
                <li>
                  <Link
                    href="/"
                    prefetch={true}
                    className="text-stone-600 underline-offset-4 hover:text-stone-900 hover:underline transition-colors"
                  >
                    首页
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    prefetch={true}
                    className="text-stone-600 underline-offset-4 hover:text-stone-900 hover:underline transition-colors"
                  >
                    全部商品
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    prefetch={true}
                    className="text-stone-600 underline-offset-4 hover:text-stone-900 hover:underline transition-colors"
                  >
                    分类
                  </Link>
                </li>
              </ul>
            )}
          </FeatureGate>
        </div>
        <FeatureGate feature="search">
          <div className="hidden justify-center md:flex md:w-1/3">
            <Suspense fallback={<SearchSkeleton />}>
              <Search />
            </Suspense>
          </div>
        </FeatureGate>
        <div className="flex justify-end md:w-1/3">
          <FeatureGate feature="cart">
            <CartModal />
          </FeatureGate>
          <FeatureGate feature="customerAuth">
            {/* 用户认证组件可以在这里添加 */}
            {/* <UserAuth /> */}
          </FeatureGate>
        </div>
      </div>
    </nav>
  );
}
