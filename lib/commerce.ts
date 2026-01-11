// Commerce Provider 工厂和选择器

import type { CommerceProvider, CommerceFeatures } from "@commerce/types";
import { LocalProvider } from "lib/providers/local";
import { customProvider } from "lib/providers/custom";
import { shopifyProvider } from "lib/providers/shopify";
import { getCommerceConfig, mergeFeatures } from "lib/commerce-config";

let providerInstance: CommerceProvider | null = null;

/**
 * 获取当前配置的 Commerce Provider
 */
export function getCommerceProvider(): CommerceProvider {
  if (providerInstance) {
    return providerInstance;
  }

  const providerName = process.env.COMMERCE_PROVIDER || "local";

  switch (providerName) {
    case "local":
      providerInstance = new LocalProvider();
      break;
    case "custom":
      providerInstance = customProvider;
      break;
    case "shopify":
      providerInstance = shopifyProvider;
      break;
    default:
      console.warn(
        `Unknown COMMERCE_PROVIDER: ${providerName}, falling back to local`
      );
      providerInstance = new LocalProvider();
  }

  // 合并 commerce.config.json 中的功能配置
  const config = getCommerceConfig();
  if (config.features && Object.keys(config.features).length > 0) {
    providerInstance.features = mergeFeatures(
      providerInstance.features,
      config.features
    );
  }

  return providerInstance;
}

/**
 * 获取当前 Provider 的功能特性
 */
export function getCommerceFeatures(): CommerceFeatures {
  const provider = getCommerceProvider();
  return provider.features;
}

// 导出便捷方法，直接调用当前 Provider 的方法
export const commerce = {
  // 产品相关
  getProduct: (handle: string) => getCommerceProvider().getProduct(handle),
  getProducts: (params?: any) => getCommerceProvider().getProducts(params),
  getProductRecommendations: (productId: string) =>
    getCommerceProvider().getProductRecommendations(productId),

  // 分类相关
  getCollection: (handle: string) =>
    getCommerceProvider().getCollection(handle),
  getCollections: () => getCommerceProvider().getCollections(),
  getCollectionProducts: (params: any) =>
    getCommerceProvider().getCollectionProducts(params),

  // 购物车相关
  getCart: () => getCommerceProvider().getCart(),
  createCart: () => getCommerceProvider().createCart(),
  addToCart: (lines: any[]) => getCommerceProvider().addToCart(lines),
  removeFromCart: (lineIds: string[]) =>
    getCommerceProvider().removeFromCart(lineIds),
  updateCart: (lines: any[]) => getCommerceProvider().updateCart(lines),

  // 用户相关
  login: (params: any) => getCommerceProvider().login(params),
  register: (params: any) => getCommerceProvider().register(params),
  logout: () => getCommerceProvider().logout(),
  getCurrentUser: () => getCommerceProvider().getCurrentUser(),

  // 订单相关
  createOrder: (params: any) => getCommerceProvider().createOrder(params),
  getOrder: (orderId: string) => getCommerceProvider().getOrder(orderId),
  getOrders: () => getCommerceProvider().getOrders(),

  // 其他
  getMenu: (handle: string) => getCommerceProvider().getMenu(handle),
  getPage: (handle: string) => getCommerceProvider().getPage(handle),
  getPages: () => getCommerceProvider().getPages(),

  // Webhook 重新验证（如果支持）
  revalidate: (req: any) => {
    const provider = getCommerceProvider();
    if (provider.revalidate) {
      return provider.revalidate(req);
    }
    return Promise.resolve({ status: 200 });
  },
};

// 向后兼容：导出 shopify 相关的函数（使用当前 Provider）
export const getProduct = commerce.getProduct;
export const getProducts = commerce.getProducts;
export const getProductRecommendations = commerce.getProductRecommendations;
export const getCollection = commerce.getCollection;
export const getCollections = commerce.getCollections;
export const getCollectionProducts = commerce.getCollectionProducts;
export const getCart = commerce.getCart;
export const createCart = commerce.createCart;
export const addToCart = commerce.addToCart;
export const removeFromCart = commerce.removeFromCart;
export const updateCart = commerce.updateCart;
export const getMenu = commerce.getMenu;
export const getPage = commerce.getPage;
export const getPages = commerce.getPages;
