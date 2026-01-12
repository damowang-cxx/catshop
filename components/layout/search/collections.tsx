/**
 * 产品分类列表组件
 * 显示所有产品分类，用于搜索页面的侧边栏导航
 */

import clsx from "clsx";
import { Suspense } from "react";

import { getCollections } from "lib/commerce";
import FilterList from "./filter";

/**
 * 分类列表组件
 * 获取并显示所有分类
 * @returns 分类列表的 JSX
 */
async function CollectionList() {
  const collections = await getCollections();
  return <FilterList list={collections} title="Collections" />;
}

// 骨架屏样式
const skeleton = "mb-3 h-4 w-5/6 animate-pulse rounded-sm";
const activeAndTitles = "bg-stone-700";
const items = "bg-stone-300";

/**
 * 分类组件主入口
 * 使用 Suspense 处理加载状态
 * @returns 分类组件的 JSX
 */
export default function Collections() {
  return (
    <Suspense
      fallback={
        <div className="col-span-2 hidden h-[400px] w-full flex-none py-4 lg:block">
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, activeAndTitles)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
          <div className={clsx(skeleton, items)} />
        </div>
      }
    >
      <CollectionList />
    </Suspense>
  );
}
