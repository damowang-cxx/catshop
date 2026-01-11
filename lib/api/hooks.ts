"use client";

// 客户端 API Hooks - 用于客户端组件调用后端 API

import { useState, useCallback } from "react";
import { clientApi } from "./client";
import {
  transformProduct,
  transformCollection,
  transformCart,
  transformOrder,
  transformUser,
} from "./transformers";
import type {
  Product,
  Collection,
  Cart,
  Order,
  User,
  GetProductsParams,
  AddToCartParams,
  UpdateCartParams,
  LoginParams,
  RegisterParams,
} from "@commerce/types";

/**
 * 使用产品列表的 Hook
 */
export function useProducts(params?: GetProductsParams) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams: Record<string, string> = {};
      if (params?.query) queryParams.q = params.query;
      if (params?.sortKey) queryParams.sortKey = params.sortKey;
      if (params?.reverse) queryParams.reverse = "true";

      const apiProducts = await clientApi.get<any[]>("/products", queryParams);
      const transformedProducts = apiProducts.map(transformProduct);
      setProducts(transformedProducts);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch products"));
    } finally {
      setLoading(false);
    }
  }, [params]);

  return { products, loading, error, fetchProducts };
}

/**
 * 使用购物车的 Hook
 */
export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCartId = useCallback(() => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const cartCookie = cookies.find((c) => c.startsWith("cartId="));
    return cartCookie ? cartCookie.split("=")[1] : null;
  }, []);

  const fetchCart = useCallback(async () => {
    const cartId = getCartId();
    if (!cartId) {
      setCart(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiCart = await clientApi.get<any>(`/cart/${cartId}`);
      setCart(transformCart(apiCart));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch cart"));
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [getCartId]);

  const addToCart = useCallback(
    async (lines: AddToCartParams[]) => {
      setLoading(true);
      setError(null);
      try {
        let cartId = getCartId();
        if (!cartId) {
          // 创建新购物车
          const newCart = await clientApi.post<any>("/cart");
          cartId = newCart.id || newCart._id;
          document.cookie = `cartId=${cartId}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 天
        }

        const apiCart = await clientApi.post<any>(`/cart/${cartId}/items`, {
          lines: lines.map((line) => ({
            merchandiseId: line.merchandiseId,
            quantity: line.quantity,
          })),
        });

        setCart(transformCart(apiCart));
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to add to cart"));
      } finally {
        setLoading(false);
      }
    },
    [getCartId]
  );

  const removeFromCart = useCallback(
    async (lineIds: string[]) => {
      const cartId = getCartId();
      if (!cartId) return;

      setLoading(true);
      setError(null);
      try {
        const apiCart = await clientApi.delete<any>(`/cart/${cartId}/items`, {
          lineIds,
        });
        setCart(transformCart(apiCart));
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to remove from cart"));
      } finally {
        setLoading(false);
      }
    },
    [getCartId]
  );

  const updateCart = useCallback(
    async (lines: UpdateCartParams[]) => {
      const cartId = getCartId();
      if (!cartId) return;

      setLoading(true);
      setError(null);
      try {
        const apiCart = await clientApi.patch<any>(`/cart/${cartId}/items`, {
          lines: lines.map((line) => ({
            id: line.id,
            merchandiseId: line.merchandiseId,
            quantity: line.quantity,
          })),
        });
        setCart(transformCart(apiCart));
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to update cart"));
      } finally {
        setLoading(false);
      }
    },
    [getCartId]
  );

  return {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    removeFromCart,
    updateCart,
  };
}

/**
 * 使用用户认证的 Hook
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (params: LoginParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientApi.post<{ user: any; token: string }>(
        "/auth/login",
        params
      );
      const transformedUser = transformUser(response.user);
      setUser(transformedUser);
      return transformedUser;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Login failed");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (params: RegisterParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await clientApi.post<{ user: any; token: string }>(
        "/auth/register",
        params
      );
      const transformedUser = transformUser(response.user);
      setUser(transformedUser);
      return transformedUser;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Registration failed");
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await clientApi.post("/auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null); // 即使 API 失败也清除本地状态
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUser = await clientApi.get<any>("/auth/me");
      const transformedUser = transformUser(apiUser);
      setUser(transformedUser);
      return transformedUser;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch user"));
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
  };
}
