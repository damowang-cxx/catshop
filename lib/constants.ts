/**
 * 常量定义文件
 * 包含排序选项、标签、默认值等常量
 */

/**
 * 排序筛选项类型
 */
export type SortFilterItem = {
  title: string; // 显示标题
  slug: string | null; // URL slug（用于路由）
  sortKey: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE"; // 排序键
  reverse: boolean; // 是否反向排序
};

/**
 * 默认排序选项（相关性排序）
 */
export const defaultSort: SortFilterItem = {
  title: "Relevance",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
};

/**
 * 所有可用的排序选项列表
 */
export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Trending",
    slug: "trending-desc",
    sortKey: "BEST_SELLING",
    reverse: false,
  }, // 最畅销
  {
    title: "Latest arrivals",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  }, // 最新上架
  {
    title: "Price: Low to high",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  }, // 价格从低到高
  {
    title: "Price: High to low",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  }, // 价格从高到低
];

/**
 * Next.js 缓存标签
 * 用于重新验证特定类型的数据
 */
export const TAGS = {
  collections: "collections", // 分类标签
  products: "products", // 产品标签
  cart: "cart", // 购物车标签
};

/**
 * 隐藏产品标签
 * 带有此标签的产品不会在搜索页面显示
 */
export const HIDDEN_PRODUCT_TAG = "nextjs-frontend-hidden";

/**
 * 默认选项值
 * 用于产品变体的默认标题
 */
export const DEFAULT_OPTION = "Default Title";

/**
 * Shopify GraphQL API 端点
 */
export const SHOPIFY_GRAPHQL_API_ENDPOINT = "/api/2023-01/graphql.json";
