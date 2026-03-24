import { redirect } from "next/navigation";
import ProductsList from "components/admin/products-list";
import { requireAdminAuth } from "lib/admin/auth";
import { adminApiClient } from "lib/api/admin-client";
import {
  normalizePaginatedResponse,
  type PaginatedResponse,
} from "lib/admin/types";
import {
  getSearchParam,
  parsePositiveInt,
  type RawSearchParams,
} from "lib/admin/query";

interface Product {
  id: string;
  title: string;
  handle: string;
  price: number | string;
  status: string;
  inventory: number;
  images?: Array<string | { url?: string }>;
}

function buildQueryString(params: {
  page: number;
  pageSize: number;
  q?: string;
  status?: string;
}): string {
  const searchParams = new URLSearchParams();
  searchParams.set("page", String(params.page));
  searchParams.set("pageSize", String(params.pageSize));
  if (params.q) {
    searchParams.set("q", params.q);
  }
  if (params.status) {
    searchParams.set("status", params.status);
  }
  return searchParams.toString();
}

async function getProducts(params: {
  page: number;
  pageSize: number;
  q: string;
  status: string;
}): Promise<PaginatedResponse<Product>> {
  try {
    const payload = await adminApiClient.get<unknown>("/admin/products", {
      page: params.page,
      pageSize: params.pageSize,
      q: params.q || undefined,
      status: params.status || undefined,
    });

    return normalizePaginatedResponse<Product>(
      payload,
      params.page,
      params.pageSize
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return {
      items: [],
      total: 0,
      page: params.page,
      pageSize: params.pageSize,
    };
  }
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  await requireAdminAuth();

  const resolvedSearchParams = await searchParams;
  const page = parsePositiveInt(getSearchParam(resolvedSearchParams, "page"), 1);
  const pageSize = parsePositiveInt(
    getSearchParam(resolvedSearchParams, "pageSize"),
    20
  );
  const q = getSearchParam(resolvedSearchParams, "q") ?? "";
  const status = getSearchParam(resolvedSearchParams, "status") ?? "";

  const data = await getProducts({ page, pageSize, q, status });
  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
  if (data.total > 0 && page > totalPages) {
    const query = buildQueryString({ page: totalPages, pageSize, q, status });
    redirect(`/admin/products?${query}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage product catalog with pagination and batch operations.
        </p>
      </div>
      <ProductsList data={data} query={{ q, status }} />
    </div>
  );
}

