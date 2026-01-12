/**
 * 首页组件
 * 展示网站的主要内容和产品推荐
 */

import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";
import { HeroSection } from "components/home/hero-section";

// 页面 SEO 元数据配置
export const metadata = {
  description:
    "精选优质玩偶 - 每一只玩偶都值得被珍爱",
  openGraph: {
    type: "website",
  },
};

/**
 * 首页主组件
 * 包含：英雄区域、精选推荐、更多商品轮播
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      {/* 精选推荐区域 */}
      <section className="relative border-t border-stone-300/30 py-16 md:py-24">
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-light tracking-tight text-stone-900 md:text-4xl">
              精选推荐
            </h2>
            <p className="text-stone-700">精心挑选的优质商品</p>
          </div>
          <ThreeItemGrid />
        </div>
      </section>

      {/* 更多商品轮播 */}
      <section className="relative border-t border-stone-300/30 py-16 md:py-24">
        <div className="relative z-10 mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-light tracking-tight text-stone-900 md:text-4xl">
              更多商品
            </h2>
            <p className="text-stone-700">探索更多精选玩偶</p>
          </div>
          <Carousel />
        </div>
      </section>

      <Footer />
    </>
  );
}
