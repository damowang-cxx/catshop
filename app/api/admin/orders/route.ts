/**
 * 订单管理 API 路由
 * GET: 获取订单列表
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
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const url = query ? `${backendUrl}/orders?${query}` : `${backendUrl}/orders`;

    const response = await fetch(url, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("获取订单列表失败:", error);
    return NextResponse.json(
      { error: "获取订单列表失败" },
      { status: 500 }
    );
  }
}
