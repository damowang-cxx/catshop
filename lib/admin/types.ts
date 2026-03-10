export type ProductStatus = "active" | "draft";
export type CollectionStatus = "active" | "hidden";
export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface BulkActionRequest {
  action: string;
  ids: string[];
  status?: string;
}

export interface UploadResponse {
  url: string;
}

export interface ProductFormValues {
  title: string;
  handle: string;
  description: string;
  price: string;
  compareAtPrice: string;
  inventory: string;
  status: ProductStatus;
  images: string[];
  primaryImageIndex: number;
}

export interface CollectionFormValues {
  title: string;
  handle: string;
  description: string;
  status: CollectionStatus;
  image: string;
}

function toNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

export function normalizePaginatedResponse<T>(
  payload: unknown,
  fallbackPage: number,
  fallbackPageSize: number
): PaginatedResponse<T> {
  if (Array.isArray(payload)) {
    return {
      items: payload as T[],
      total: payload.length,
      page: fallbackPage,
      pageSize: fallbackPageSize,
    };
  }

  if (!payload || typeof payload !== "object") {
    return {
      items: [],
      total: 0,
      page: fallbackPage,
      pageSize: fallbackPageSize,
    };
  }

  const record = payload as Record<string, unknown>;
  const nestedData =
    record.data && typeof record.data === "object"
      ? (record.data as Record<string, unknown>)
      : null;

  const source = nestedData ?? record;
  const items = Array.isArray(source.items)
    ? (source.items as T[])
    : Array.isArray(source.rows)
      ? (source.rows as T[])
      : [];

  return {
    items,
    total: toNumber(source.total, items.length),
    page: toNumber(source.page, fallbackPage),
    pageSize: toNumber(source.pageSize, fallbackPageSize),
  };
}

