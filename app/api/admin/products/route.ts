/**
 * 后台产品管理 API 路由
 * 对接后端 API，处理产品列表和创建请求
 */

import { NextRequest, NextResponse } from "next/server";
import { adminApiClient } from "lib/api/admin-client";

/**
 * GET /api/admin/products
 * 获取产品列表
 * 对接后端: GET /api/admin/products
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "20";
    const search = searchParams.get("search") || "";

    const products = await adminApiClient.get<any>("/products", {
      page,
      limit,
      search,
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error("获取产品列表失败:", error);
    return NextResponse.json(
      {
        error: error.message || "获取产品列表失败",
        // 开发模式：返回空数组
        data: [],
        total: 0,
      },
      { status: error.status || 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * 创建产品
 * 对接后端: POST /api/admin/products
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await adminApiClient.post<any>("/products", body);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error("创建产品失败:", error);
    return NextResponse.json(
      { error: error.message || "创建产品失败" },
      { status: error.status || 500 }
    );
  }
}
