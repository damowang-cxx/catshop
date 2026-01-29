/**
 * 获取当前用户信息 API 路由
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.CUSTOM_API_BASE_URL || "http://localhost:3001/api";
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "未登录" },
        { status: 401 }
      );
    }

    try {
      const response = await fetch(`${backendUrl}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data.user || data.data?.user || data);
      } else {
        // 如果后端返回 401，清除本地 token
        if (response.status === 401) {
          cookieStore.delete("auth_token");
        }
        return NextResponse.json(
          { error: "获取用户信息失败" },
          { status: response.status }
        );
      }
    } catch (backendError) {
      // 后端不可用时，使用临时测试用户（仅开发环境）
      if (process.env.NODE_ENV === "development" && token?.startsWith("test_user_token_")) {
        return NextResponse.json({
          id: "1",
          email: "user@example.com",
          firstName: "Test",
          lastName: "User",
        });
      }

      console.error("后端 API 调用失败:", backendError);
      return NextResponse.json(
        { error: "无法连接到服务器" },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error("获取用户信息错误:", error);
    return NextResponse.json(
      { error: "获取用户信息失败" },
      { status: 500 }
    );
  }
}
