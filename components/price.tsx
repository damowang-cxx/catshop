/**
 * 价格显示组件
 * 格式化并显示货币价格
 */

import clsx from "clsx";

/**
 * 价格组件
 * @param amount - 价格金额（字符串）
 * @param className - 容器样式类名
 * @param currencyCode - 货币代码（默认 USD）
 * @param currencyCodeClassName - 货币代码样式类名
 * @returns 格式化后的价格 JSX
 */
const Price = ({
  amount,
  className,
  currencyCode = "USD",
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<"p">) => (
  <p suppressHydrationWarning={true} className={className}>
    {/* 使用 Intl.NumberFormat 格式化货币 */}
    {`${new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
    }).format(parseFloat(amount))}`}
    {/* 显示货币代码 */}
    <span
      className={clsx("ml-1 inline", currencyCodeClassName)}
    >{`${currencyCode}`}</span>
  </p>
);

export default Price;
