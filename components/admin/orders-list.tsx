"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BulkActionToolbar from "components/admin/bulk-action-toolbar";
import AdminPagination from "components/admin/pagination";
import { executeBulkAction } from "lib/admin/client-actions";
import { ORDER_STATUS_BADGES, ORDER_STATUS_OPTIONS } from "lib/admin/status";
import type { OrderStatus, PaginatedResponse } from "lib/admin/types";

interface Order {
  id: string;
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  total: number | string;
  status: string;
  createdAt: string;
  items?: Array<{ id?: string }>;
}

interface OrdersListProps {
  data: PaginatedResponse<Order>;
  query: {
    q: string;
    status: string;
  };
}

function isKnownOrderStatus(status: string): status is OrderStatus {
  return ORDER_STATUS_OPTIONS.some((option) => option.value === status);
}

export default function OrdersList({ data, query }: OrdersListProps) {
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
    setSelectedIds(data.items.map((order) => order.id));
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
    router.push(`/admin/orders?${params.toString()}`);
  };

  const handleBulkAction = async (status: string | undefined) => {
    if (!status) {
      throw new Error("Status is required.");
    }

    await executeBulkAction("orders", {
      action: "updateStatus",
      ids: selectedIds,
      status,
    });
    setSelectedIds([]);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-md border border-gray-200 bg-white p-4 md:flex-row md:items-end md:justify-between">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="order-q" className="block text-sm text-gray-600">
              Search
            </label>
            <input
              id="order-q"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Order number or customer"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="order-status" className="block text-sm text-gray-600">
              Status
            </label>
            <select
              id="order-status"
              value={statusInput}
              onChange={(event) => setStatusInput(event.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">All</option>
              {ORDER_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={applyFilters}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Apply Filters
        </button>
      </div>

      <BulkActionToolbar
        selectedCount={selectedIds.length}
        actions={[{ value: "updateStatus", label: "Update Status", requiresStatus: true }]}
        statusOptions={ORDER_STATUS_OPTIONS}
        onApply={async (_action, status) => {
          await handleBulkAction(status);
        }}
      />

      <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
        {data.items.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-500">
            No orders found.
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
                    aria-label="Select all orders"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Order
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data.items.map((order) => {
                const status = isKnownOrderStatus(order.status)
                  ? order.status
                  : "pending";

                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 align-top">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(order.id)}
                        onChange={() => toggleSelect(order.id)}
                        aria-label={`Select order ${order.orderNumber}`}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/admin/orders/${order.id}`}>
                        <p className="text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <p>{order.customerName || "Unknown customer"}</p>
                      <p className="text-gray-500">{order.customerEmail || "-"}</p>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      ${order.total}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${ORDER_STATUS_BADGES[status]}`}
                      >
                        {ORDER_STATUS_OPTIONS.find((option) => option.value === status)
                          ?.label ?? status}
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
        pathname="/admin/orders"
        page={data.page}
        pageSize={data.pageSize}
        total={data.total}
        query={{ q: query.q, status: query.status }}
      />
    </div>
  );
}

