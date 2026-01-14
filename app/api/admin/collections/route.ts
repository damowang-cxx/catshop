/**
 * 后台分类管理 API 路由
 * 对接后端 API，处理分类列表和创建请求
 */

import { NextRequest, NextResponse } from "next/server";
import { adminApiClient } from "lib/api/admin-client";

/**
 * GET /api/admin/collections
 * 获取分类列表
 * 对接后端: GET /api/admin/collections
 */
export async function GET(request: NextRequest) {
  try {
    const collections = await adminApiClient.get<any[]>("/collections");

    return NextResponse.json(collections);
  } catch (error: any) {
    console.error("获取分类列表失败:", error);
    return NextResponse.json(
      {
        error: error.message || "获取分类列表失败",
        // 开发模式：返回空数组
        data: [],
      },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST /api/admin/collections
 * 创建分类
 * 对接后端: POST /api/admin/collections
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const collection = await adminApiClient.post<any>("/collections", body);

    return NextResponse.json(collection, { status: 201 });
  } catch (error: any) {
    console.error("创建分类失败:", error);
    return NextResponse.json(
      { error: error.message || "创建分类失败" },
      { status: error.status || 500 }
    );
  }
}
