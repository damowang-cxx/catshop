// Browser-only API client. Client components should only call Next.js BFF routes.
export class ClientApiClient {
  private readonly baseURL = "/api";

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
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          // Ignore malformed error payloads.
        }
      }

      const error = new Error(errorMessage) as Error & { status?: number };
      error.status = response.status;
      throw error;
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

export const clientApi = new ClientApiClient();
