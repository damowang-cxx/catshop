import clsx from "clsx";
import Image from "next/image";
import Label from "../label";

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: "bottom" | "center";
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        "group relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-2",
        {
          relative: label,
          "ring-2 ring-rose-400 ring-offset-2": active,
        },
      )}
    >
      {/* 装饰性光晕效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200/0 via-rose-200/0 to-amber-200/0 transition-all duration-500 group-hover:from-pink-200/20 group-hover:via-rose-200/20 group-hover:to-amber-200/20" />
      
      {props.src ? (
        <Image
          className={clsx("h-full w-full object-cover transition-transform duration-500", {
            "group-hover:scale-110": isInteractive,
          })}
          {...props}
        />
      ) : null}
      
      {/* 可爱的装饰边框 */}
      <div className="absolute inset-0 rounded-2xl border-2 border-pink-200/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
