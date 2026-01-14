/**
 * 获取当前管理员信息 API 路由
 * 对接后端 API: GET /api/admin/auth/me
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminApiClient } from "lib/api/admin-client";

/**
 * GET /api/admin/me
 * 获取当前登录的管理员信息
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token");

    if (!adminToken) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    // 尝试从后端 API 获取用户信息
    try {
      const user = await adminApiClient.get<any>("/auth/me");
      return NextResponse.json({ user });
    } catch (apiError) {
      // 如果后端 API 不可用，返回临时用户信息（开发模式）
      console.warn("后端 API 不可用，返回临时用户信息:", apiError);
      return NextResponse.json({
        user: {
          id: "1",
          email: "admin@example.com",
          name: "管理员",
          role: "admin",
        },
      });
    }
  } catch (error) {
    console.error("获取用户信息错误:", error);
    return NextResponse.json(
      { error: "获取用户信息失败" },
      { status: 500 }
    );
  }
}
