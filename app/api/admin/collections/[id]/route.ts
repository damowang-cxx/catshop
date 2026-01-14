/**
 * 后台分类详情 API 路由
 * 对接后端 API，处理单个分类的获取、更新、删除
 */

import { NextRequest, NextResponse } from "next/server";
import { adminApiClient } from "lib/api/admin-client";

/**
 * GET /api/admin/collections/:id
 * 获取分类详情
 * 对接后端: GET /api/admin/collections/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collection = await adminApiClient.get<any>(`/collections/${id}`);

    return NextResponse.json(collection);
  } catch (error: any) {
    console.error("获取分类详情失败:", error);
    return NextResponse.json(
      { error: error.message || "获取分类详情失败" },
      { status: error.status || 500 }
    );
  }
}

/**
 * PUT /api/admin/collections/:id
 * 更新分类
 * 对接后端: PUT /api/admin/collections/:id
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const collection = await adminApiClient.put<any>(
      `/collections/${id}`,
      body
    );

    return NextResponse.json(collection);
  } catch (error: any) {
    console.error("更新分类失败:", error);
    return NextResponse.json(
      { error: error.message || "更新分类失败" },
      { status: error.status || 500 }
    );
  }
}

/**
 * DELETE /api/admin/collections/:id
 * 删除分类
 * 对接后端: DELETE /api/admin/collections/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await adminApiClient.delete<any>(`/collections/${id}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("删除分类失败:", error);
    return NextResponse.json(
      { error: error.message || "删除分类失败" },
      { status: error.status || 500 }
    );
  }
}
