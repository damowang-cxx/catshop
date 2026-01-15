import clsx from "clsx";
import { ReactNode } from "react";

const Grid = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "grid w-full gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const GridItem = ({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) => {
  return <div className={clsx("relative", className)}>{children}</div>;
};

Grid.Item = GridItem;

export default Grid;
