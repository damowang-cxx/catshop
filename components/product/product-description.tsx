/**
 * 产品描述组件
 * 显示产品标题、价格、变体选择器、描述和添加到购物车按钮
 */

import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Product } from "lib/types";
import { VariantSelector } from "./variant-selector";

/**
 * 产品描述主组件
 * @param product - 产品对象
 * @returns 产品描述的 JSX
 */
export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b border-stone-200 pb-6 dark:border-stone-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-amber-700 p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight dark:text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <AddToCart product={product} />
    </>
  );
}
