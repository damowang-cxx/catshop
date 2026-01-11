// 自定义 Provider - 对接自研后端 API

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
import { fullFeatures } from "@commerce/features";
import { cookies } from "next/headers";
import { apiClient } from "lib/api/client";
import {
  transformProduct,
  transformCollection,
  transformCart,
  transformOrder,
  transformUser,
} from "lib/api/transformers";

class CustomProvider implements CommerceProvider {
  // 功能特性声明 - 自定义 Provider 支持所有功能
  features: CommerceFeatures = {
    ...fullFeatures,
  };

  // 产品相关
  async getProduct(handle: string): Promise<Product | undefined> {
    try {
      const apiProduct = await apiClient.get<any>(`/products/${handle}`);
      return transformProduct(apiProduct);
    } catch (error) {
      console.error("Failed to get product:", error);
      return undefined;
    }
  }

  async getProducts(params?: GetProductsParams): Promise<Product[]> {
    try {
      const queryParams: Record<string, string> = {};
      if (params?.query) queryParams.q = params.query;
      if (params?.sortKey) queryParams.sortKey = params.sortKey;
      if (params?.reverse) queryParams.reverse = "true";

      const apiProducts = await apiClient.get<any[]>("/products", queryParams);
      return apiProducts.map(transformProduct);
    } catch (error) {
      console.error("Failed to get products:", error);
      return [];
    }
  }

  async getProductRecommendations(productId: string): Promise<Product[]> {
    try {
      const apiProducts = await apiClient.get<any[]>(
        `/products/${productId}/recommendations`
      );
      return apiProducts.map(transformProduct);
    } catch (error) {
      console.error("Failed to get product recommendations:", error);
      return [];
    }
  }

  // 分类相关
  async getCollection(handle: string): Promise<Collection | undefined> {
    try {
      const apiCollection = await apiClient.get<any>(`/collections/${handle}`);
      return transformCollection(apiCollection);
    } catch (error) {
      console.error("Failed to get collection:", error);
      return undefined;
    }
  }

  async getCollections(): Promise<Collection[]> {
    try {
      const apiCollections = await apiClient.get<any[]>("/collections");
      const collections = apiCollections.map(transformCollection);
      // 添加 "全部" 分类
      return [
        {
          handle: "",
          title: "全部",
          description: "所有产品",
          seo: { title: "全部", description: "所有产品" },
          path: "/search",
          updatedAt: new Date().toISOString(),
        },
        ...collections,
      ];
    } catch (error) {
      console.error("Failed to get collections:", error);
      return [
        {
          handle: "",
          title: "全部",
          description: "所有产品",
          seo: { title: "全部", description: "所有产品" },
          path: "/search",
          updatedAt: new Date().toISOString(),
        },
      ];
    }
  }

  async getCollectionProducts(
    params: GetCollectionProductsParams
  ): Promise<Product[]> {
    try {
      const queryParams: Record<string, string> = {
        collection: params.collection,
      };
      if (params.sortKey) queryParams.sortKey = params.sortKey;
      if (params.reverse) queryParams.reverse = "true";

      const apiProducts = await apiClient.get<any[]>(
        `/collections/${params.collection}/products`,
        queryParams
      );
      return apiProducts.map(transformProduct);
    } catch (error) {
      console.error("Failed to get collection products:", error);
      return [];
    }
  }

  // 购物车相关
  async getCart(): Promise<Cart | undefined> {
    try {
      const cookieStore = await cookies();
      const cartId = cookieStore.get("cartId")?.value;
      if (!cartId) return undefined;

      const apiCart = await apiClient.get<any>(`/cart/${cartId}`);
      return transformCart(apiCart);
    } catch (error) {
      console.error("Failed to get cart:", error);
      return undefined;
    }
  }

  async createCart(): Promise<Cart> {
    const apiCart = await apiClient.post<any>("/cart");
    const cart = transformCart(apiCart);

    // 设置 cartId cookie
    const cookieStore = await cookies();
    cookieStore.set("cartId", cart.id!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return cart;
  }

  async addToCart(lines: AddToCartParams[]): Promise<Cart> {
    const cookieStore = await cookies();
    let cartId = cookieStore.get("cartId")?.value;

    if (!cartId) {
      // 如果没有购物车，先创建一个
      const newCart = await this.createCart();
      cartId = newCart.id!;
    }

    const apiCart = await apiClient.post<any>(`/cart/${cartId}/items`, {
      lines: lines.map((line) => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
      })),
    });

    return transformCart(apiCart);
  }

  async removeFromCart(lineIds: string[]): Promise<Cart> {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;
    if (!cartId) {
      throw new Error("Cart not found");
    }

    const apiCart = await apiClient.delete<any>(`/cart/${cartId}/items`, {
      lineIds,
    });

    return transformCart(apiCart);
  }

  async updateCart(lines: UpdateCartParams[]): Promise<Cart> {
    const cookieStore = await cookies();
    const cartId = cookieStore.get("cartId")?.value;
    if (!cartId) {
      throw new Error("Cart not found");
    }

    const apiCart = await apiClient.patch<any>(`/cart/${cartId}/items`, {
      lines: lines.map((line) => ({
        id: line.id,
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
      })),
    });

    return transformCart(apiCart);
  }

  // 用户相关
  async login(params: LoginParams): Promise<User> {
    const response = await apiClient.post<{ user: any; token: string }>(
      "/auth/login",
      params
    );

    // 设置认证 token cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 天
    });

    return transformUser(response.user);
  }

  async register(params: RegisterParams): Promise<User> {
    const response = await apiClient.post<{ user: any; token: string }>(
      "/auth/register",
      params
    );

    // 设置认证 token cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 天
    });

    return transformUser(response.user);
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      // 即使 API 调用失败，也清除本地 token
      console.error("Logout API error:", error);
    } finally {
      const cookieStore = await cookies();
      cookieStore.delete("auth_token");
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const apiUser = await apiClient.get<any>("/auth/me");
      return transformUser(apiUser);
    } catch (error) {
      return null;
    }
  }

  // 订单相关
  async createOrder(params: CheckoutParams): Promise<Order> {
    const apiOrder = await apiClient.post<any>("/orders", params);
    return transformOrder(apiOrder);
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    try {
      const apiOrder = await apiClient.get<any>(`/orders/${orderId}`);
      return transformOrder(apiOrder);
    } catch (error) {
      console.error("Failed to get order:", error);
      return undefined;
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      const apiOrders = await apiClient.get<any[]>("/orders");
      return apiOrders.map(transformOrder);
    } catch (error) {
      console.error("Failed to get orders:", error);
      return [];
    }
  }

  // 其他
  async getMenu(handle: string): Promise<Menu[]> {
    try {
      return await this.fetch<Menu[]>(`/menus/${handle}`);
    } catch (error) {
      console.error("Failed to get menu:", error);
      return [];
    }
  }

  async getPage(handle: string): Promise<Page | undefined> {
    try {
      return await this.fetch<Page>(`/pages/${handle}`);
    } catch (error) {
      console.error("Failed to get page:", error);
      return undefined;
    }
  }

  async getPages(): Promise<Page[]> {
    try {
      return await this.fetch<Page[]>("/pages");
    } catch (error) {
      console.error("Failed to get pages:", error);
      return [];
    }
  }
}

export const customProvider = new CustomProvider();
