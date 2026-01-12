/**
 * 网格布局组件
 * 用于产品列表的网格布局，支持响应式设计
 */

import clsx from "clsx";

/**
 * 网格容器组件
 * @param props - ul 元素的所有标准属性
 * @returns 网格容器的 JSX
 */
function Grid(props: React.ComponentProps<"ul">) {
  return (
    <ul
      {...props}
      className={clsx("grid grid-flow-row gap-4", props.className)}
    >
      {props.children}
    </ul>
  );
}

/**
 * 网格项组件
 * @param props - li 元素的所有标准属性
 * @returns 网格项的 JSX
 */
function GridItem(props: React.ComponentProps<"li">) {
  return (
    <li
      {...props}
      className={clsx("aspect-square transition-opacity", props.className)}
    >
      {props.children}
    </li>
  );
}

// 将 GridItem 作为 Grid 的静态属性，方便使用：<Grid.Item />
Grid.Item = GridItem;

export default Grid;
