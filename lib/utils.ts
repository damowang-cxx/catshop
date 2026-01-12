/**
 * 工具函数库
 * 提供常用的辅助函数
 */

import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * 获取基础 URL
 * 优先使用 Vercel 生产环境 URL，否则使用本地开发 URL
 */
export const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

/**
 * 创建带查询参数的 URL
 * @param pathname - 路径名
 * @param params - URL 搜索参数对象
 * @returns 完整的 URL 字符串
 */
export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
) => {
  const paramsString = params.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;

  return `${pathname}${queryString}`;
};

/**
 * 确保字符串以指定前缀开头
 * @param stringToCheck - 要检查的字符串
 * @param startsWith - 期望的前缀
 * @returns 带前缀的字符串
 */
export const ensureStartsWith = (stringToCheck: string, startsWith: string) =>
  stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;

/**
 * 验证必需的环境变量
 * 检查 Shopify 相关的环境变量是否已配置
 * @throws 如果缺少必需的环境变量，抛出错误
 */
export const validateEnvironmentVariables = () => {
  const requiredEnvironmentVariables = [
    "SHOPIFY_STORE_DOMAIN",
    "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  ];
  const missingEnvironmentVariables = [] as string[];

  requiredEnvironmentVariables.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingEnvironmentVariables.push(envVar);
    }
  });

  if (missingEnvironmentVariables.length) {
    throw new Error(
      `The following environment variables are missing. Your site will not work without them. Read more: https://vercel.com/docs/integrations/shopify#configure-environment-variables\n\n${missingEnvironmentVariables.join(
        "\n",
      )}\n`,
    );
  }

  if (
    process.env.SHOPIFY_STORE_DOMAIN?.includes("[") ||
    process.env.SHOPIFY_STORE_DOMAIN?.includes("]")
  ) {
    throw new Error(
      "Your `SHOPIFY_STORE_DOMAIN` environment variable includes brackets (ie. `[` and / or `]`). Your site will not work with them there. Please remove them.",
    );
  }
};
