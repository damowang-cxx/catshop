/**
 * 订单管理页面
 * 显示订单列表，支持筛选和查看详情
 */

import { requireAdminAuth } from "lib/admin/auth";
import { adminApiClient } from "lib/api/admin-client";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    title: string;
    quantity: number;
    price: number;
  }>;
}

async function getOrders(): Promise<Order[]> {
  try {
    const orders = await adminApiClient.get<Order[]>("/orders");
    return Array.isArray(orders) ? orders : [];
  } catch (error: any) {
    console.error("获取订单列表失败:", error);
    return [];
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    pending: "待处理",
    processing: "处理中",
    shipped: "已发货",
    delivered: "已送达",
    cancelled: "已取消",
  };
  return statusMap[status] || status;
}

export default async function OrdersPage() {
  await requireAdminAuth();
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">订单管理</h1>
        <p className="mt-2 text-sm text-gray-600">
          查看和管理所有订单，共 {orders.length} 个订单
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">暂无订单</h3>
            <p className="mt-1 text-sm text-gray-500">
              还没有任何订单
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            订单 #{order.orderNumber}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.customerName} ({order.customerEmail})
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleString("zh-CN")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            ¥{order.total}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.items?.length || 0} 件商品
                          </div>
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </div>
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
