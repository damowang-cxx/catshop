/**
 * 订单详情页面
 * 显示订单详细信息，支持更新订单状态
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
  };
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}`);
        if (!response.ok) {
          throw new Error("获取订单失败");
        }
        const data = await response.json();
        const orderData = data.data || data;
        setOrder(orderData);
        setStatus(orderData.status || "pending");
      } catch (err: any) {
        console.error("获取订单错误:", err);
        setError(err.message || "获取订单失败");
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (!order) return;

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "更新订单状态失败");
      }

      const data = await response.json();
      const updatedOrder = data.data || data;
      setOrder(updatedOrder);
      setSaving(false);
    } catch (err: any) {
      console.error("更新订单错误:", err);
      setError(err.message || "更新订单状态失败");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
        <Link
          href="/admin/orders"
          className="text-amber-600 hover:text-amber-800"
        >
          返回订单列表
        </Link>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            订单 #{order.orderNumber}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            创建于 {new Date(order.createdAt).toLocaleString("zh-CN")}
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="text-amber-600 hover:text-amber-800"
        >
          返回订单列表
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* 订单商品 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                订单商品
              </h3>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b border-gray-200 pb-4"
                  >
                    <div className="flex items-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-16 w-16 rounded-md object-cover mr-4"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          数量: {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      ¥{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 配送信息 */}
          {order.shippingAddress && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  配送地址
                </h3>
                <div className="text-sm text-gray-600">
                  <p>{order.shippingAddress.address1}</p>
                  {order.shippingAddress.address2 && (
                    <p>{order.shippingAddress.address2}</p>
                  )}
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
                    {order.shippingAddress.zip}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* 订单状态 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                订单状态
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    状态
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 sm:text-sm"
                  >
                    <option value="pending">待处理</option>
                    <option value="processing">处理中</option>
                    <option value="shipped">已发货</option>
                    <option value="delivered">已送达</option>
                    <option value="cancelled">已取消</option>
                  </select>
                </div>
                <button
                  onClick={handleStatusUpdate}
                  disabled={saving || status === order.status}
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "更新中..." : "更新状态"}
                </button>
              </div>
            </div>
          </div>

          {/* 订单摘要 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                订单摘要
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">小计</span>
                  <span className="text-gray-900">¥{order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">运费</span>
                  <span className="text-gray-900">¥{order.shipping || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">税费</span>
                  <span className="text-gray-900">¥{order.tax || 0}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="text-base font-medium text-gray-900">
                    总计
                  </span>
                  <span className="text-base font-medium text-gray-900">
                    ¥{order.total}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 客户信息 */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                客户信息
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">姓名:</span>{" "}
                  <span className="text-gray-900">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-600">邮箱:</span>{" "}
                  <span className="text-gray-900">{order.customerEmail}</span>
                </div>
                {order.customerPhone && (
                  <div>
                    <span className="text-gray-600">电话:</span>{" "}
                    <span className="text-gray-900">{order.customerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
