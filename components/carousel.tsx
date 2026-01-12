/**
 * 产品轮播组件
 * 用于首页展示产品，支持无限滚动
 * 注意：以 `hidden-*` 开头的集合不会在搜索页面显示
 */

import { getCollectionProducts } from "lib/commerce";
import Link from "next/link";
import { GridTileImage } from "./grid/tile";

/**
 * 产品轮播主组件
 * 通过重复产品数组实现无缝循环滚动
 * @returns 产品轮播的 JSX
 */
export async function Carousel() {
  // 获取首页轮播产品集合（隐藏集合，不在搜索页显示）
  const products = await getCollectionProducts({
    collection: "hidden-homepage-carousel",
  });

  // 如果没有产品，不显示轮播
  if (!products?.length) return null;

  // 故意重复产品数组，使轮播能够无缝循环，在大屏幕上不会出现产品不足的情况
  const carouselProducts = [...products, ...products, ...products];

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1 scrollbar-hide">
      <ul className="flex animate-carousel gap-4 md:gap-6">
        {carouselProducts.map((product, i) => (
          <li
            key={`${product.handle}${i}`}
            className="relative aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3"
          >
            <Link
              href={`/product/${product.handle}`}
              className="relative block h-full w-full"
            >
              <GridTileImage
                alt={product.title}
                label={{
                  title: product.title,
                  amount: product.priceRange.maxVariantPrice.amount,
                  currencyCode: product.priceRange.maxVariantPrice.currencyCode,
                }}
                src={product.featuredImage?.url}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
