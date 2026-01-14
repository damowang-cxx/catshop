/**
 * 后台产品详情 API 路由
 * 对接后端 API，处理单个产品的获取、更新、删除
 */

import { NextRequest, NextResponse } from "next/server";
import { adminApiClient } from "lib/api/admin-client";

/**
 * GET /api/admin/products/:id
 * 获取产品详情
 * 对接后端: GET /api/admin/products/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await adminApiClient.get<any>(`/products/${id}`);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("获取产品详情失败:", error);
    return NextResponse.json(
      { error: error.message || "获取产品详情失败" },
      { status: error.status || 500 }
    );
  }
}

/**
 * PUT /api/admin/products/:id
 * 更新产品
 * 对接后端: PUT /api/admin/products/:id
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const product = await adminApiClient.put<any>(`/products/${id}`, body);

    return NextResponse.json(product);
  } catch (error: any) {
    console.error("更新产品失败:", error);
    return NextResponse.json(
      { error: error.message || "更新产品失败" },
      { status: error.status || 500 }
    );
  }
}

/**
 * DELETE /api/admin/products/:id
 * 删除产品
 * 对接后端: DELETE /api/admin/products/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await adminApiClient.delete<any>(`/products/${id}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("删除产品失败:", error);
    return NextResponse.json(
      { error: error.message || "删除产品失败" },
      { status: error.status || 500 }
    );
  }
}
