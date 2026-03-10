"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { updateOrderStatus } from "lib/admin/client-actions";
import {
  isOrderStatus,
  ORDER_STATUS_BADGES,
  ORDER_STATUS_OPTIONS,
} from "lib/admin/status";
import type { OrderStatus } from "lib/admin/types";

interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress?: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  subtotal?: number;
  shipping?: number;
  tax?: number;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

function normalizeOrderStatus(status: string): OrderStatus {
  return isOrderStatus(status) ? status : "pending";
}

async function fetchOrder(orderId: string): Promise<Order> {
  const response = await fetch(`/api/admin/orders/${orderId}`);
  if (!response.ok) {
    throw new Error("Failed to load order details.");
  }

  const payload = (await response.json()) as Order | { data: Order };
  const rawOrder =
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data
      ? payload.data
      : (payload as Order);

  if (
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data
  ) {
    return {
      ...rawOrder,
      items: Array.isArray(rawOrder.items) ? rawOrder.items : [],
    };
  }

  return {
    ...rawOrder,
    items: Array.isArray(rawOrder.items) ? rawOrder.items : [],
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState<OrderStatus>("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOrder = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const nextOrder = await fetchOrder(orderId);
        if (cancelled) {
          return;
        }
        setOrder(nextOrder);
        setStatus(normalizeOrderStatus(nextOrder.status));
      } catch (loadError) {
        if (cancelled) {
          return;
        }
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load order details."
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const currentStatus = useMemo(
    () => (order ? normalizeOrderStatus(order.status) : "pending"),
    [order]
  );

  const handleUpdateStatus = async () => {
    if (!order) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await updateOrderStatus(order.id, status);
      setOrder((previous) =>
        previous
          ? {
              ...previous,
              status,
            }
          : previous
      );
      setSuccess("Order status updated.");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update order status."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-600">
        Loading order...
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
        <Link href="/admin/orders" className="text-sm text-amber-700 hover:underline">
          Back to order list
        </Link>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Order #{order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Created {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <Link href="/admin/orders" className="text-sm text-amber-700 hover:underline">
          Back to order list
        </Link>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      ) : null}
      {success ? (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          {success}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Items</h2>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-4"
                >
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-14 w-14 rounded object-cover"
                      />
                    ) : null}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {order.shippingAddress ? (
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
              <div className="mt-3 text-sm text-gray-700">
                <p>{order.shippingAddress.address1}</p>
                {order.shippingAddress.address2 ? (
                  <p>{order.shippingAddress.address2}</p>
                ) : null}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                  {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Status</h2>
            <div className="mt-4 space-y-3">
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${ORDER_STATUS_BADGES[currentStatus]}`}
              >
                {
                  ORDER_STATUS_OPTIONS.find((option) => option.value === currentStatus)
                    ?.label
                }
              </span>
              <div>
                <label htmlFor="order-status" className="block text-sm text-gray-600">
                  Update Status
                </label>
                <select
                  id="order-status"
                  value={status}
                  onChange={(event) =>
                    setStatus(normalizeOrderStatus(event.target.value))
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  {ORDER_STATUS_OPTIONS.map((statusOption) => (
                    <option key={statusOption.value} value={statusOption.value}>
                      {statusOption.label}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={handleUpdateStatus}
                disabled={isSaving || status === currentStatus}
                className="w-full rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving ? "Updating..." : "Update Status"}
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${order.subtotal ?? order.total}</span>
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <span>Shipping</span>
                <span>${order.shipping ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-gray-700">
                <span>Tax</span>
                <span>${order.tax ?? 0}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2 text-base font-semibold text-gray-900">
                <span>Total</span>
                <span>${order.total}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Name:</span>{" "}
                {order.customerName || "Unknown"}
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                {order.customerEmail || "-"}
              </p>
              {order.customerPhone ? (
                <p>
                  <span className="font-medium">Phone:</span> {order.customerPhone}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
