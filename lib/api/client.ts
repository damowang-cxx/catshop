// 统一的 API 客户端 - 封装所有后端 API 请求

import { cookies } from "next/headers";

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.CUSTOM_API_BASE_URL || "http://localhost:3001/api";
  }

  /**
   * 获取认证 token
   */
  private async getAuthToken(): Promise<string | null> {
    try {
      const cookieStore = await cookies();
      return cookieStore.get("auth_token")?.value || null;
    } catch {
      // 客户端调用时 cookies() 不可用
      return null;
    }
  }

  /**
   * 构建请求头
   */
  private async buildHeaders(
    customHeaders?: HeadersInit
  ): Promise<HeadersInit> {
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * 处理 API 响应
   */
  private async handleResponse<T>(
    response: Response
  ): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText}`;
      let errors: Record<string, string[]> | undefined;

      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          errors = errorData.errors;
        } catch {
          // 如果 JSON 解析失败，使用默认错误消息
        }
      }

      const error: ApiError = {
        message: errorMessage,
        status: response.status,
        errors,
      };

      throw error;
    }

    // 处理空响应
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return {} as ApiResponse<T>;
    }

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    // 如果后端返回的是 { data: T } 格式，直接返回
    if (data && typeof data === "object" && "data" in data) {
      return data as ApiResponse<T>;
    }

    // 否则包装成统一格式
    return {
      data: data as T,
    };
  }

  /**
   * 发送 GET 请求
   */
  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    try {
      const url = new URL(`${this.baseURL}${endpoint}`);

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(url.toString(), {
        method: "GET",
        headers: await this.buildHeaders(),
        cache: "no-store", // 服务端组件默认不缓存
      });

      const result = await this.handleResponse<T>(response);
      return result.data;
    } catch (error: any) {
      // 重新抛出错误，让调用者处理
      throw error;
    }
  }

  /**
   * 发送 POST 请求
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: await this.buildHeaders(customHeaders),
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }

  /**
   * 发送 PUT 请求
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: await this.buildHeaders(customHeaders),
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }

  /**
   * 发送 PATCH 请求
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    customHeaders?: HeadersInit
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: await this.buildHeaders(customHeaders),
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }

  /**
   * 发送 DELETE 请求
   */
  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: await this.buildHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }
}

// 导出单例实例
export const apiClient = new ApiClient();

// 客户端 API 客户端（用于客户端组件）
export class ClientApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.NEXT_PUBLIC_CUSTOM_API_BASE_URL ||
      process.env.CUSTOM_API_BASE_URL ||
      "http://localhost:3001/api";
  }

  private getAuthToken(): string | null {
    // 客户端获取 token 的方式（从 cookie 或 localStorage）
    if (typeof document !== "undefined") {
      // 可以从 document.cookie 或 localStorage 读取
      const cookies = document.cookie.split("; ");
      const tokenCookie = cookies.find((c) => c.startsWith("auth_token="));
      if (tokenCookie) {
        return tokenCookie.split("=")[1];
      }
    }
    return null;
  }

  private buildHeaders(customHeaders?: HeadersInit): HeadersInit {
    const token = this.getAuthToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...customHeaders,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText}`;

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // 忽略解析错误
        }
      }

      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      // 如果后端返回的是 { data: T } 格式
      if (data && typeof data === "object" && "data" in data) {
        return data.data as T;
      }
      return data as T;
    }

    return (await response.text()) as T;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.buildHeaders(),
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: this.buildHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.buildHeaders(),
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }
}

export const clientApi = new ClientApiClient();
