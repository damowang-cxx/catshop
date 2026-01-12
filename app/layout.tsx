/**
 * 根布局组件
 * 定义整个应用的全局布局结构，包括导航栏、购物车、功能开关等
 */

import { CartProvider } from "components/cart/cart-context";
import { FeaturesProvider } from "components/features/features-provider";
import { Navbar } from "components/layout/navbar";
import { WelcomeToast } from "components/welcome-toast";
import { GeistSans } from "geist/font/sans";
import { getCart, getCommerceFeatures } from "lib/commerce";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { baseUrl } from "lib/utils";

// 从环境变量获取网站名称
const { SITE_NAME } = process.env;

// 全局 SEO 元数据配置
export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

/**
 * 根布局组件
 * @param children - 子页面内容
 * @returns 包含全局布局的 HTML 结构
 */
export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 不等待数据获取，将 Promise 传递给上下文提供者（流式渲染优化）
  const cart = getCart();
  const features = getCommerceFeatures();

  return (
    <html lang="zh-CN" className={GeistSans.variable} suppressHydrationWarning>
      <body className="relative bg-khaki text-stone-900 selection:bg-amber-300">
        {/* 全局渐变光晕动画背景 - 固定定位，确保滚动时连续 */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* 主光晕 - 右上角 */}
          <div className="absolute right-0 top-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-amber-200/40 via-amber-300/30 to-amber-200/20 blur-3xl animate-pulse"></div>
          
          {/* 次光晕 - 左下角 */}
          <div className="absolute bottom-0 left-0 h-[700px] w-[700px] translate-y-1/2 -translate-x-1/2 rounded-full bg-gradient-to-tr from-stone-300/30 via-amber-200/20 to-stone-300/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* 中心光晕 */}
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-200/20 via-amber-300/25 to-amber-200/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* 移动光晕效果 */}
          <div className="absolute right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-amber-300/20 to-stone-300/15 blur-3xl animate-float"></div>
          
          {/* 额外的光晕层，增加深度 */}
          <div className="absolute left-1/4 bottom-1/4 h-[550px] w-[550px] rounded-full bg-gradient-to-tl from-amber-200/15 via-stone-300/10 to-amber-200/15 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        </div>
        
        <FeaturesProvider features={features}>
          <CartProvider cartPromise={cart}>
            <Navbar />
            <main className="relative z-0">
              {children}
              <Toaster closeButton />
              <WelcomeToast />
            </main>
          </CartProvider>
        </FeaturesProvider>
      </body>
    </html>
  );
}
