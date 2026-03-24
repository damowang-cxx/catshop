import { cookies } from "next/headers";

export interface AdminApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface AdminApiResponse<T> {
  data: T;
  message?: string;
}

class AdminApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL =
      process.env.CUSTOM_API_BASE_URL || "http://127.0.0.1:3001/api";
  }

  private async getAdminToken(): Promise<string | null> {
    try {
      const cookieStore = await cookies();
      return cookieStore.get("admin_token")?.value || null;
    } catch {
      return null;
    }
  }

  private async buildHeaders(customHeaders?: HeadersInit): Promise<HeadersInit> {
    const token = await this.getAdminToken();
    const headers = new Headers(customHeaders);
    headers.set("Content-Type", "application/json");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<AdminApiResponse<T>> {
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText}`;
      let errors: Record<string, string[]> | undefined;

      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          errors = errorData.errors;
        } catch {
          // Ignore malformed error payloads.
        }
      }

      throw {
        message: errorMessage,
        status: response.status,
        errors,
      } as AdminApiError;
    }

    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {} as AdminApiResponse<T>;
    }

    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (data && typeof data === "object" && "data" in data) {
      return data as AdminApiResponse<T>;
    }

    return {
      data: data as T,
    };
  }

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
        cache: "no-store",
      });

      const result = await this.handleResponse<T>(response);
      return result.data;
    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      const errorCode = error?.cause?.code || error?.code;

      if (
        errorCode === "ECONNREFUSED" ||
        errorMessage.includes("fetch failed") ||
        errorMessage.includes("ECONNREFUSED") ||
        errorMessage.includes("network")
      ) {
        const networkError = new Error("Backend service is unavailable.");
        (networkError as any).isNetworkError = true;
        (networkError as any).code = "ECONNREFUSED";
        throw networkError;
      }

      throw error;
    }
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

export const adminApiClient = new AdminApiClient();

export class ClientAdminApiClient {
  private readonly baseURL = "/api/admin";

  private buildHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers = new Headers(customHeaders);
    headers.set("Content-Type", "application/json");
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type") || "";

    if (!response.ok) {
      let errorMessage = `API Error: ${response.statusText}`;

      if (contentType.includes("application/json")) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Ignore malformed error payloads.
        }
      }

      throw new Error(errorMessage);
    }

    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return undefined as T;
    }

    if (contentType.includes("application/json")) {
      const data = await response.json();
      if (data && typeof data === "object" && "data" in data) {
        return data.data as T;
      }
      return data as T;
    }

    return (await response.text()) as T;
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): string {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
    }

    const query = searchParams.toString();
    return `${this.baseURL}${endpoint}${query ? `?${query}` : ""}`;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ): Promise<T> {
    const response = await fetch(this.buildUrl(endpoint, params), {
      method: "GET",
      headers: this.buildHeaders(),
      credentials: "same-origin",
    });

    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.buildHeaders(),
      credentials: "same-origin",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PUT",
      headers: this.buildHeaders(),
      credentials: "same-origin",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "PATCH",
      headers: this.buildHeaders(),
      credentials: "same-origin",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "DELETE",
      headers: this.buildHeaders(),
      credentials: "same-origin",
      body: data ? JSON.stringify(data) : undefined,
    });

    return this.handleResponse<T>(response);
  }
}

export const clientAdminApi = new ClientAdminApiClient();

