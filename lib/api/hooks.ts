"use client";

import { useCallback, useState } from "react";
import { clientApi } from "./client";
import {
  transformCart,
  transformProduct,
  transformUser,
} from "./transformers";
import type {
  AddToCartParams,
  Cart,
  GetProductsParams,
  LoginParams,
  Product,
  RegisterParams,
  UpdateCartParams,
  User,
} from "@commerce/types";

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
      setProducts(apiProducts.map(transformProduct));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch products"));
    } finally {
      setLoading(false);
    }
  }, [params]);

  return { products, loading, error, fetchProducts };
}

export function useCart() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const apiCart = await clientApi.get<any | null>("/cart");
      if (!apiCart) {
        setCart(null);
        return null;
      }

      const transformedCart = transformCart(apiCart);
      setCart(transformedCart);
      return transformedCart;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch cart"));
      setCart(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (lines: AddToCartParams[]) => {
    setLoading(true);
    setError(null);
    try {
      const apiCart = await clientApi.post<any>("/cart/items", {
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
  }, []);

  const removeFromCart = useCallback(async (lineIds: string[]) => {
    if (lineIds.length === 0) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiCart = await clientApi.delete<any>("/cart/items", { lineIds });
      setCart(transformCart(apiCart));
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to remove from cart"));
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCart = useCallback(async (lines: UpdateCartParams[]) => {
    if (lines.length === 0) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const apiCart = await clientApi.patch<any>("/cart/items", {
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
  }, []);

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

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const login = useCallback(async (params: LoginParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Login failed");
      }

      const data = await response.json();
      const transformedUser = transformUser(data.user);
      setUser(transformedUser);
      return transformedUser;
    } catch (err) {
      const authError = err instanceof Error ? err : new Error("Login failed");
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (params: RegisterParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Registration failed");
      }

      const data = await response.json();
      const transformedUser = transformUser(data.user);
      setUser(transformedUser);
      return transformedUser;
    } catch (err) {
      const authError =
        err instanceof Error ? err : new Error("Registration failed");
      setError(authError);
      throw authError;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUser(null);
    } catch (err) {
      console.error("Logout error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          return null;
        }
        throw new Error("Failed to fetch user");
      }

      const apiUser = await response.json();
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
