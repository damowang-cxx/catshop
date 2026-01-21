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
      <div className="flex items-center gap-3 rounded-xl border-2 border-pink-200/60 bg-gradient-to-r from-pink-50/95 to-rose-50/95 px-4 py-3 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:border-pink-300/80 group-hover:shadow-xl">
        <h3 className="line-clamp-2 grow text-sm font-semibold leading-tight text-rose-800">
          {title}
        </h3>
        <Price
          className="flex-none text-base font-bold text-rose-600"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  );
};

export default Label;
