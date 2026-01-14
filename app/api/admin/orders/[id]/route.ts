/**
 * 后台订单详情 API 路由
 * 对接后端 API，处理单个订单的获取和状态更新
 */

import { NextRequest, NextResponse } from "next/server";
import { adminApiClient } from "lib/api/admin-client";

/**
 * GET /api/admin/orders/:id
 * 获取订单详情
 * 对接后端: GET /api/admin/orders/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await adminApiClient.get<any>(`/orders/${id}`);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("获取订单详情失败:", error);
    return NextResponse.json(
      { error: error.message || "获取订单详情失败" },
      { status: error.status || 500 }
    );
  }
}

/**
 * PATCH /api/admin/orders/:id/status
 * 更新订单状态
 * 对接后端: PATCH /api/admin/orders/:id/status
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const order = await adminApiClient.patch<any>(
      `/orders/${id}/status`,
      body
    );

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("更新订单状态失败:", error);
    return NextResponse.json(
      { error: error.message || "更新订单状态失败" },
      { status: error.status || 500 }
    );
  }
}
