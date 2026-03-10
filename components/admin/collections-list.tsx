"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BulkActionToolbar from "components/admin/bulk-action-toolbar";
import AdminPagination from "components/admin/pagination";
import { executeBulkAction } from "lib/admin/client-actions";
import type { PaginatedResponse } from "lib/admin/types";

interface Collection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: string;
  status?: string;
  productCount?: number;
}

interface CollectionListProps {
  data: PaginatedResponse<Collection>;
  query: {
    q: string;
    status: string;
  };
}

export default function CollectionsList({ data, query }: CollectionListProps) {
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
    setSelectedIds(data.items.map((collection) => collection.id));
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
    router.push(`/admin/collections?${params.toString()}`);
  };

  const handleBulkAction = async (action: string, status?: string) => {
    const payload =
      action === "delete"
        ? { action: "delete", ids: selectedIds }
        : { action: "updateStatus", ids: selectedIds, status };

    await executeBulkAction("collections", payload);
    setSelectedIds([]);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 md:flex-row md:items-end md:justify-between">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="collection-q" className="block text-sm text-gray-600">
              Search
            </label>
            <input
              id="collection-q"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Title or handle"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="collection-status"
              className="block text-sm text-gray-600"
            >
              Visibility
            </label>
            <select
              id="collection-status"
              value={statusInput}
              onChange={(event) => setStatusInput(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="active">Visible</option>
              <option value="hidden">Hidden</option>
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
            href="/admin/collections/new"
            className="rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800"
          >
            Add Collection
          </Link>
        </div>
      </div>

      <BulkActionToolbar
        selectedCount={selectedIds.length}
        actions={[
          { value: "show", label: "Set Visible" },
          { value: "hide", label: "Set Hidden" },
          { value: "delete", label: "Delete" },
        ]}
        onApply={async (action) => {
          if (action === "show") {
            await handleBulkAction(action, "active");
            return;
          }
          if (action === "hide") {
            await handleBulkAction(action, "hidden");
            return;
          }
          await handleBulkAction(action);
        }}
      />

      <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
        {data.items.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-500">
            No collections found.
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
                    aria-label="Select all collections"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Collection
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Products
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Visibility
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.items.map((collection) => (
                <tr key={collection.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 align-top">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(collection.id)}
                      onChange={() => toggleSelect(collection.id)}
                      aria-label={`Select ${collection.title}`}
                    />
                  </td>
                  <td className="px-4 py-4">
                    <Link href={`/admin/collections/${collection.id}`} className="flex items-center gap-3">
                      {collection.image ? (
                        <img
                          src={collection.image}
                          alt={collection.title}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : null}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {collection.title}
                        </p>
                        <p className="text-sm text-gray-500">{collection.handle}</p>
                        {collection.description ? (
                          <p className="text-sm text-gray-500">{collection.description}</p>
                        ) : null}
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700">
                    {collection.productCount ?? 0}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        collection.status === "hidden"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {collection.status === "hidden" ? "Hidden" : "Visible"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AdminPagination
        pathname="/admin/collections"
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
        query={{ q: query.q, status: query.status }}
      />
    </div>
  );
}

