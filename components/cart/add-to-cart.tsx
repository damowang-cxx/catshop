/**
 * 添加到购物车组件
 * 处理产品添加到购物车的逻辑，包括变体选择、库存检查等
 * 注意：必须是客户端组件（"use client"）
 */

"use client";

import { PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { Product, ProductVariant } from "lib/types";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useCart } from "./cart-context";

/**
 * 提交按钮组件
 * 根据产品可用性和变体选择状态显示不同的按钮状态
 * @param availableForSale - 产品是否可售
 * @param selectedVariantId - 选中的变体 ID
 * @returns 提交按钮的 JSX
 */
function SubmitButton({
  availableForSale,
  selectedVariantId,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-amber-700 p-4 tracking-wide text-white hover:bg-amber-800 transition-colors";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      <div className="absolute left-0 ml-4">
        <PlusIcon className="h-5" />
      </div>
      Add To Cart
    </button>
  );
}

/**
 * 添加到购物车主组件
 * @param product - 要添加到购物车的产品对象
 * @returns 添加到购物车表单的 JSX
 */
export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const searchParams = useSearchParams();
  // 使用 Server Action 处理添加到购物车的操作
  const [message, formAction] = useActionState(addItem, null);

  // 根据 URL 参数查找对应的产品变体
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase()),
    ),
  );
  // 如果只有一个变体，默认选中它
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  // 确定最终选中的变体 ID
  const selectedVariantId = variant?.id || defaultVariantId;
  // 绑定选中变体 ID 到 Server Action
  const addItemAction = formAction.bind(null, selectedVariantId);
  // 获取最终选中的变体对象
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
