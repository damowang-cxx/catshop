/**
 * 后台订单管理 API 路由
 * 对接后端 API，处理订单列表请求
 */

import { NextRequest, NextResponse } from "next/server";
import { adminApiClient } from "lib/api/admin-client";

/**
 * GET /api/admin/orders
 * 获取订单列表
 * 对接后端: GET /api/admin/orders
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const status = searchParams.get("status") || "";

    const orders = await adminApiClient.get<any>("/orders", {
      page,
      limit,
      status,
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error("获取订单列表失败:", error);
    return NextResponse.json(
      {
        error: error.message || "获取订单列表失败",
        // 开发模式：返回空数组
        data: [],
        total: 0,
      },
      { status: error.status || 500 }
    );
  }
}
