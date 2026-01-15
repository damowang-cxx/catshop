/**
 * 统计数据 API 路由
 * GET: 获取仪表盘统计数据
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const backendUrl = process.env.CUSTOM_API_BASE_URL || "http://localhost:3001/api";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");
  
  return {
    "Content-Type": "application/json",
    ...(adminToken ? { Authorization: `Bearer ${adminToken.value}` } : {}),
  };
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${backendUrl}/stats`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    }

    // 如果后端不可用，返回默认数据
    return NextResponse.json({
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalUsers: 0,
      recentOrders: [],
      popularProducts: [],
    });
  } catch (error: any) {
    console.error("获取统计数据失败:", error);
    // 返回默认数据
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
