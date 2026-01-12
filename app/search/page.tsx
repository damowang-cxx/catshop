/**
 * 搜索/产品列表页
 * 支持产品搜索、排序和筛选功能
 */

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";
import { getProducts } from "lib/commerce";

// 页面 SEO 元数据
export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

/**
 * 搜索页主组件
 * @param props - 包含搜索参数的对象
 * @returns 搜索结果页面的 JSX
 */
export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  // 从 URL 参数中提取排序方式和搜索关键词
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  // 根据排序参数找到对应的排序配置，如果没有则使用默认排序
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // 获取产品列表（支持搜索和排序）
  const products = await getProducts({ sortKey, reverse, query: searchValue });
  // 结果文本（单数/复数）
  const resultsText = products.length > 1 ? "results" : "result";

  return (
    <>
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? "There are no products that match "
            : `Showing ${products.length} ${resultsText} for `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
