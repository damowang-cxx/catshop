import "server-only";

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

  private async getAuthToken(): Promise<string | null> {
    try {
      const cookieStore = await cookies();
      return cookieStore.get("auth_token")?.value || null;
    } catch {
      return null;
    }
  }

  private async buildHeaders(customHeaders?: HeadersInit): Promise<HeadersInit> {
    const token = await this.getAuthToken();
    const headers = new Headers(customHeaders);
    headers.set("Content-Type", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
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
          // Ignore malformed error payloads.
        }
      }

      throw {
        message: errorMessage,
        status: response.status,
        errors,
      } as ApiError;
    }

    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as ApiResponse<T>;
    }

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (data && typeof data === "object" && "data" in data) {
      return data as ApiResponse<T>;
    }

    return { data: data as T };
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
      headers: await this.buildHeaders(),
      cache: "no-store",
    });

    const result = await this.handleResponse<T>(response);
    return result.data;
  }

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

export const apiClient = new ApiClient();
