import { redirect } from "next/navigation";
import CollectionsList from "components/admin/collections-list";
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

interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: string;
  status?: string;
  productCount?: number;
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

async function getCollections(params: {
  page: number;
  pageSize: number;
  q: string;
  status: string;
}): Promise<PaginatedResponse<Collection>> {
  try {
    const payload = await adminApiClient.get<unknown>("/admin/collections", {
      page: params.page,
      pageSize: params.pageSize,
      q: params.q || undefined,
      status: params.status || undefined,
    });

    return normalizePaginatedResponse<Collection>(
      payload,
      params.page,
      params.pageSize
    );
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    return {
      items: [],
      total: 0,
      page: params.page,
      pageSize: params.pageSize,
    };
  }
}

export default async function CollectionsPage({
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

  const data = await getCollections({ page, pageSize, q, status });
  const totalPages = Math.max(1, Math.ceil(data.total / pageSize));
  if (data.total > 0 && page > totalPages) {
    const query = buildQueryString({ page: totalPages, pageSize, q, status });
    redirect(`/admin/collections?${query}`);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Collections</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage collection visibility and perform bulk updates.
        </p>
      </div>
      <CollectionsList data={data} query={{ q, status }} />
    </div>
  );
}

