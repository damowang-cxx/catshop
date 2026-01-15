/**
 * 单个订单管理 API 路由
 * GET: 获取订单详情
 * PATCH: 更新订单状态
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${backendUrl}/orders/${params.id}`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("获取订单详情失败:", error);
    return NextResponse.json(
      { error: "获取订单详情失败" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const response = await fetch(`${backendUrl}/orders/${params.id}`, {
      method: "PATCH",
      headers: await getAuthHeaders(),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("更新订单失败:", error);
    return NextResponse.json(
      { error: "更新订单失败" },
      { status: 500 }
    );
  }
}
