/**
 * 产品分类/集合页面
 * 显示特定分类下的所有产品
 */

import { getCollection, getCollectionProducts } from "lib/commerce";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";

/**
 * 生成分类页面的 SEO 元数据
 * @param props - 包含分类标识的参数对象
 * @returns 分类页面的元数据
 */
export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} products`,
  };
}

/**
 * 分类页主组件
 * @param props - 包含分类标识和搜索参数的对象
 * @returns 分类产品列表页面的 JSX
 */
export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  // 从 URL 参数中提取排序方式
  const { sort } = searchParams as { [key: string]: string };
  // 根据排序参数找到对应的排序配置，如果没有则使用默认排序
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  // 获取该分类下的产品列表（支持排序）
  const products = await getCollectionProducts({
    collection: params.collection,
    sortKey,
    reverse,
  });

  return (
    <section>
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
