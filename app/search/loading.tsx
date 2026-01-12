/**
 * 搜索页加载状态组件
 * 在数据加载时显示骨架屏占位符
 */

import Grid from "components/grid";

/**
 * 加载状态组件
 * 显示 12 个脉冲动画的占位卡片
 * @returns 加载中的骨架屏 JSX
 */
export default function Loading() {
  return (
    <>
      {/* 标题占位符 */}
      <div className="mb-4 h-6" />
      {/* 产品网格占位符 */}
      <Grid className="grid-cols-2 lg:grid-cols-3">
        {Array(12)
          .fill(0)
          .map((_, index) => {
            return (
              <Grid.Item
                key={index}
                className="animate-pulse bg-stone-100"
              />
            );
          })}
      </Grid>
    </>
  );
}
