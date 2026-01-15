/**
 * 获取当前管理员用户信息 API 路由
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token");

    if (!adminToken) {
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      );
    }

    // 尝试调用后端 API
    const backendUrl = process.env.CUSTOM_API_BASE_URL || "http://localhost:3001/api";
    
    try {
      const response = await fetch(`${backendUrl}/auth/me`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${adminToken.value}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data.user || data.data?.user || data);
      }
    } catch (backendError) {
      // 后端不可用时，返回临时用户信息（仅开发环境）
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({
          id: "1",
          email: "admin@example.com",
          name: "管理员",
        });
      }

      console.error("后端 API 调用失败:", backendError);
    }

    return NextResponse.json(
      { error: "获取用户信息失败" },
      { status: 500 }
    );
  } catch (error: any) {
    console.error("获取用户信息错误:", error);
    return NextResponse.json(
      { error: "获取用户信息失败" },
      { status: 500 }
    );
  }
}
