/**
 * 后台管理员登录 API 路由
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "邮箱和密码不能为空" },
        { status: 400 }
      );
    }

    // 尝试调用后端 API
    const backendUrl = process.env.CUSTOM_API_BASE_URL || "http://localhost:3001/api";
    
    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token || data.data?.token;

        if (token) {
          // 设置 cookie
          const cookieStore = await cookies();
          cookieStore.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 天
          });

          return NextResponse.json({
            success: true,
            user: data.user || data.data?.user,
          });
        }
      }
    } catch (backendError) {
      // 后端不可用时，使用临时测试账号（仅开发环境）
      if (process.env.NODE_ENV === "development") {
        if (email === "admin@example.com" && password === "admin123") {
          const testToken = "test_admin_token_" + Date.now();
          const cookieStore = await cookies();
          cookieStore.set("admin_token", testToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7, // 7 天
          });

          return NextResponse.json({
            success: true,
            user: {
              id: "1",
              email: "admin@example.com",
              name: "管理员",
            },
          });
        }
      }

      console.error("后端 API 调用失败:", backendError);
    }

    return NextResponse.json(
      { error: "邮箱或密码错误" },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("登录错误:", error);
    return NextResponse.json(
      { error: "登录失败，请稍后重试" },
      { status: 500 }
    );
  }
}
