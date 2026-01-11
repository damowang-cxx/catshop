import clsx from "clsx";
import Price from "./price";

const Label = ({
  title,
  amount,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amount: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) => {
  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label",
        {
          "lg:px-20 lg:pb-[35%]": position === "center",
        },
      )}
    >
      <div className="flex items-center gap-3 rounded-lg border border-stone-300/50 bg-khaki-light/95 px-4 py-3 backdrop-blur-sm shadow-sm">
        <h3 className="line-clamp-2 grow text-sm font-medium leading-tight text-stone-900">
          {title}
        </h3>
        <Price
          className="flex-none text-sm font-semibold text-stone-900"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  );
};

export default Label;
