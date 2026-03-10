"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BulkActionToolbar from "components/admin/bulk-action-toolbar";
import AdminPagination from "components/admin/pagination";
import { executeBulkAction } from "lib/admin/client-actions";
import type { PaginatedResponse } from "lib/admin/types";

interface Product {
  id: string;
  title: string;
  handle: string;
  price: number | string;
  status: string;
  inventory: number;
  images?: Array<string | { url?: string }>;
}

interface ProductListProps {
  data: PaginatedResponse<Product>;
  query: {
    q: string;
    status: string;
  };
}

function getFirstImageUrl(product: Product): string {
  if (!Array.isArray(product.images) || product.images.length === 0) {
    return "";
  }

  const firstImage = product.images[0];
  if (typeof firstImage === "string") {
    return firstImage;
  }

  if (firstImage && typeof firstImage.url === "string") {
    return firstImage.url;
  }

  return "";
}

export default function ProductsList({ data, query }: ProductListProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchInput, setSearchInput] = useState(query.q);
  const [statusInput, setStatusInput] = useState(query.status);

  useEffect(() => {
    setSearchInput(query.q);
    setStatusInput(query.status);
  }, [query.q, query.status]);

  const allSelected = useMemo(
    () => data.items.length > 0 && selectedIds.length === data.items.length,
    [data.items.length, selectedIds.length]
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(data.items.map((item) => item.id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((selectedId) => selectedId !== id)
        : [...previous, id]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchInput.trim()) {
      params.set("q", searchInput.trim());
    }
    if (statusInput) {
      params.set("status", statusInput);
    }
    params.set("page", "1");
    params.set("pageSize", String(data.pageSize));
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleBulkAction = async (action: string, status?: string) => {
    const payload =
      action === "delete"
        ? { action: "delete", ids: selectedIds }
        : { action: "updateStatus", ids: selectedIds, status };

    await executeBulkAction("products", payload);
    setSelectedIds([]);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 md:flex-row md:items-end md:justify-between">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="product-q" className="block text-sm text-gray-600">
              Search
            </label>
            <input
              id="product-q"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Title or handle"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="product-status" className="block text-sm text-gray-600">
              Status
            </label>
            <select
              id="product-status"
              value={statusInput}
              onChange={(event) => setStatusInput(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={applyFilters}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Apply Filters
          </button>
          <Link
            href="/admin/products/new"
            className="rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
          >
            Add Product
          </Link>
        </div>
      </div>

      <BulkActionToolbar
        selectedCount={selectedIds.length}
        actions={[
          { value: "activate", label: "Set Active" },
          { value: "deactivate", label: "Set Draft" },
          { value: "delete", label: "Delete" },
        ]}
        onApply={async (action) => {
          if (action === "activate") {
            await handleBulkAction(action, "active");
            return;
          }
          if (action === "deactivate") {
            await handleBulkAction(action, "draft");
            return;
          }
          await handleBulkAction(action);
        }}
      />

      <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
        {data.items.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-500">
            No products found.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all products"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Inventory
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.items.map((product) => {
                const firstImage = getFirstImageUrl(product);
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 align-top">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleSelect(product.id)}
                        aria-label={`Select ${product.title}`}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                        {firstImage ? (
                          <img
                            src={firstImage}
                            alt={product.title}
                            className="h-12 w-12 rounded object-cover"
                          />
                        ) : null}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.title}</p>
                          <p className="text-sm text-gray-500">{product.handle}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      ${product.price}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {product.inventory}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          product.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.status === "active" ? "Active" : "Draft"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <AdminPagination
        pathname="/admin/products"
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
        query={{ q: query.q, status: query.status }}
      />
    </div>
  );
}

