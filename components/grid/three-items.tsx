/**
 * 三产品网格组件
 * 用于首页展示精选推荐产品，采用一大两小的布局
 */

import { GridTileImage } from "components/grid/tile";
import { getCollectionProducts } from "lib/commerce";
import type { Product } from "lib/types";
import Link from "next/link";

/**
 * 单个产品网格项组件
 * @param item - 产品对象
 * @param size - 尺寸类型："full" 全宽或 "half" 半宽
 * @param priority - 是否优先加载图片（用于 LCP 优化）
 * @returns 产品网格项的 JSX
 */
function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: Product;
  size: "full" | "half";
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode,
          }}
        />
      </Link>
    </div>
  );
}

/**
 * 三产品网格主组件
 * 从隐藏的集合中获取首页推荐产品
 * 注意：以 `hidden-*` 开头的集合不会在搜索页面显示
 * @returns 三产品网格的 JSX
 */
export async function ThreeItemGrid() {
  // 获取首页精选产品集合（隐藏集合，不在搜索页显示）
  const homepageItems = await getCollectionProducts({
    collection: "hidden-homepage-featured-items",
  });

  // 如果产品数量不足 3 个，不显示此组件
  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  // 解构获取三个产品
  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
