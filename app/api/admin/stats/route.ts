/**
 * 后台统计数据 API 路由
 * 对接后端 API，获取仪表盘统计数据
 */

import { NextResponse } from "next/server";
import { adminApiClient } from "lib/api/admin-client";

/**
 * GET /api/admin/stats
 * 获取统计数据
 * 对接后端: GET /api/admin/stats
 */
export async function GET() {
  try {
    const stats = await adminApiClient.get<any>("/stats");

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("获取统计数据失败:", error);
    // 开发模式：返回默认统计数据
    return NextResponse.json({
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalUsers: 0,
      recentOrders: [],
      popularProducts: [],
    });
  }
}
