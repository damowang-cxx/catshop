/**
 * 单个分类管理 API 路由
 * GET: 获取分类详情
 * PUT: 更新分类
 * DELETE: 删除分类
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
    const response = await fetch(`${backendUrl}/collections/${params.id}`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("获取分类详情失败:", error);
    return NextResponse.json(
      { error: "获取分类详情失败" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const response = await fetch(`${backendUrl}/collections/${params.id}`, {
      method: "PUT",
      headers: await getAuthHeaders(),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("更新分类失败:", error);
    return NextResponse.json(
      { error: "更新分类失败" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const response = await fetch(`${backendUrl}/collections/${params.id}`, {
      method: "DELETE",
      headers: await getAuthHeaders(),
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("删除分类失败:", error);
    return NextResponse.json(
      { error: "删除分类失败" },
      { status: 500 }
    );
  }
}
