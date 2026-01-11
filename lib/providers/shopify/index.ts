// Shopify Provider - 包装现有的 Shopify 实现

import type {
  CommerceProvider,
  Product,
  Collection,
  Cart,
  Menu,
  Page,
  Order,
  User,
  GetProductsParams,
  GetCollectionProductsParams,
  AddToCartParams,
  UpdateCartParams,
  LoginParams,
  RegisterParams,
  CheckoutParams,
  CommerceFeatures,
} from "@commerce/types";
import * as shopify from "lib/shopify";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export class ShopifyProvider implements CommerceProvider {
  // 功能特性声明 - Shopify Storefront API 支持的功能
  features: CommerceFeatures = {
    cart: true,
    search: true,
    productRecommendations: true,
    collections: true,
    menus: true,
    pages: true,
    // Shopify Storefront API 不支持的功能
    customerAuth: false,
    wishlist: false,
    orders: false, // 通过 checkoutUrl 跳转，不直接支持订单 API
  } as CommerceFeatures;

  // 产品相关
  async getProduct(handle: string): Promise<Product | undefined> {
    return shopify.getProduct(handle);
  }

  async getProducts(params?: GetProductsParams): Promise<Product[]> {
    return shopify.getProducts({
      query: params?.query,
      reverse: params?.reverse,
      sortKey: params?.sortKey,
    });
  }

  async getProductRecommendations(productId: string): Promise<Product[]> {
    return shopify.getProductRecommendations(productId);
  }

  // 分类相关
  async getCollection(handle: string): Promise<Collection | undefined> {
    return shopify.getCollection(handle);
  }

  async getCollections(): Promise<Collection[]> {
    return shopify.getCollections();
  }

  async getCollectionProducts(
    params: GetCollectionProductsParams
  ): Promise<Product[]> {
    return shopify.getCollectionProducts({
      collection: params.collection,
      reverse: params.reverse,
      sortKey: params.sortKey,
    });
  }

  // 购物车相关
  async getCart(): Promise<Cart | undefined> {
    return shopify.getCart();
  }

  async createCart(): Promise<Cart> {
    const cart = await shopify.createCart();
    // 设置 cartId cookie
    const cookieStore = await cookies();
    cookieStore.set("cartId", cart.id!);
    return cart;
  }

  async addToCart(lines: AddToCartParams[]): Promise<Cart> {
    return shopify.addToCart(
      lines.map((line) => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
      }))
    );
  }

  async removeFromCart(lineIds: string[]): Promise<Cart> {
    return shopify.removeFromCart(lineIds);
  }

  async updateCart(lines: UpdateCartParams[]): Promise<Cart> {
    return shopify.updateCart(
      lines.map((line) => ({
        id: line.id,
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
      }))
    );
  }

  // 用户相关 - Shopify Storefront API 不支持用户认证
  async login(params: LoginParams): Promise<User> {
    throw new Error("Shopify Storefront API 不支持用户登录功能");
  }

  async register(params: RegisterParams): Promise<User> {
    throw new Error("Shopify Storefront API 不支持用户注册功能");
  }

  async logout(): Promise<void> {
    throw new Error("Shopify Storefront API 不支持用户登出功能");
  }

  async getCurrentUser(): Promise<User | null> {
    return null;
  }

  // 订单相关 - Shopify Storefront API 通过 checkoutUrl 处理订单
  async createOrder(params: CheckoutParams): Promise<Order> {
    const cart = await this.getCart();
    if (!cart) {
      throw new Error("Cart not found");
    }
    // Shopify 通过 checkoutUrl 跳转到结账页面
    // 这里返回一个模拟订单对象
    throw new Error("请使用 checkoutUrl 跳转到 Shopify 结账页面");
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    throw new Error("Shopify Storefront API 不支持订单查询功能");
  }

  async getOrders(): Promise<Order[]> {
    throw new Error("Shopify Storefront API 不支持订单列表功能");
  }

  // 其他
  async getMenu(handle: string): Promise<Menu[]> {
    return shopify.getMenu(handle);
  }

  async getPage(handle: string): Promise<Page | undefined> {
    return shopify.getPage(handle);
  }

  async getPages(): Promise<Page[]> {
    return shopify.getPages();
  }

  // Webhook 重新验证
  async revalidate(req: NextRequest) {
    return shopify.revalidate(req);
  }
}

export const shopifyProvider = new ShopifyProvider();
