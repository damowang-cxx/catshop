/**
 * 产品变体选择器组件
 * 允许用户选择产品的不同变体（如颜色、尺寸等）
 * 注意：必须是客户端组件（"use client"）
 */

"use client";

import clsx from "clsx";
import { ProductOption, ProductVariant } from "lib/types";
import { useRouter, useSearchParams } from "next/navigation";

// 变体组合类型
type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

/**
 * 变体选择器主组件
 * @param options - 产品选项数组（如颜色、尺寸）
 * @param variants - 产品变体数组
 * @returns 变体选择器的 JSX
 */
export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 检查是否有多个选项（如果没有选项或只有一个选项且只有一个值，则不需要显示选择器）
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  // 如果不需要选择器，返回 null
  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  // 构建变体组合映射，用于快速查找可用变体
  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {},
    ),
  }));

  /**
   * 更新选中的选项
   * 通过更新 URL 参数来切换变体
   * @param name - 选项名称
   * @param value - 选项值
   */
  const updateOption = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    // 更新 URL 但不滚动页面
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return options.map((option) => (
    <form key={option.id}>
      <dl className="mb-8">
        <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
        <dd className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();

            // Base option params on current searchParams so we can preserve any other param state.
            const optionParams: Record<string, string> = {};
            searchParams.forEach((v, k) => (optionParams[k] = v));
            optionParams[optionNameLowerCase] = value;

            // Filter out invalid options and check if the option combination is available for sale.
            const filtered = Object.entries(optionParams).filter(
              ([key, value]) =>
                options.find(
                  (option) =>
                    option.name.toLowerCase() === key &&
                    option.values.includes(value),
                ),
            );
            const isAvailableForSale = combinations.find((combination) =>
              filtered.every(
                ([key, value]) =>
                  combination[key] === value && combination.availableForSale,
              ),
            );

            // The option is active if it's in the selected options.
            const isActive = searchParams.get(optionNameLowerCase) === value;

            return (
              <button
                formAction={() => updateOption(optionNameLowerCase, value)}
                key={value}
                aria-disabled={!isAvailableForSale}
                disabled={!isAvailableForSale}
                title={`${option.name} ${value}${!isAvailableForSale ? " (Out of Stock)" : ""}`}
                className={clsx(
                  "flex min-w-[48px] items-center justify-center rounded-full border bg-khaki-light px-2 py-1 text-sm border-stone-300",
                  {
                    "cursor-default ring-2 ring-amber-600": isActive,
                    "ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-amber-600":
                      !isActive && isAvailableForSale,
                    "relative z-10 cursor-not-allowed overflow-hidden bg-stone-200 text-stone-500 ring-1 ring-stone-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-stone-300 before:transition-transform":
                      !isAvailableForSale,
                  },
                )}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
    </form>
  ));
}
