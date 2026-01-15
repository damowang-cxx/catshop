import clsx from "clsx";

const Price = ({
  amount,
  className,
  currencyCode = "CNY",
  currencyCodeClassName,
}: {
  amount: string;
  className?: string;
  currencyCode?: string;
  currencyCodeClassName?: string;
}) => {
  const numericAmount = parseFloat(amount);
  const formattedAmount = numericAmount.toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <span className={className}>
      ¥{formattedAmount}
      {currencyCodeClassName && (
        <span className={currencyCodeClassName}> {currencyCode}</span>
      )}
    </span>
  );
};

export default Price;
