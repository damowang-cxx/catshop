/**
 * 后台登录 API 路由
 * 处理管理员登录请求，对接后端 API
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * POST /api/admin/login
 * 管理员登录
 * 对接后端 API: POST /api/admin/auth/login
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 获取后端 API 地址
    const adminApiBaseUrl =
      process.env.ADMIN_API_BASE_URL ||
      process.env.CUSTOM_API_BASE_URL?.replace("/api", "/api/admin") ||
      "http://localhost:3001/api/admin";

    // 调用后端登录 API
    try {
      const response = await fetch(`${adminApiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.message || "用户名或密码错误" },
          { status: response.status }
        );
      }

      // 登录成功，设置 cookie
      const cookieStore = await cookies();
      const token = data.token || data.data?.token;

      if (token) {
        cookieStore.set("admin_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 天
        });
      }

      return NextResponse.json({
        success: true,
        message: "登录成功",
        user: data.user || data.data?.user || {
          id: data.id,
          email: data.email,
          name: data.name,
          role: data.role || "admin",
        },
      });
    } catch (apiError) {
      // 如果后端 API 不可用，使用临时测试账号（开发模式）
      console.warn("后端 API 不可用，使用临时测试账号:", apiError);

      if (email === "admin@example.com" && password === "admin123") {
        const token = "admin_token_" + Date.now();
        const cookieStore = await cookies();
        cookieStore.set("admin_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7,
        });

        return NextResponse.json({
          success: true,
          message: "登录成功（开发模式）",
          user: {
            id: "1",
            email: "admin@example.com",
            name: "管理员",
            role: "admin",
          },
        });
      }

      return NextResponse.json(
        { error: "后端服务不可用，请检查配置" },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error("登录错误:", error);
    return NextResponse.json(
      { error: "登录失败，请稍后重试" },
      { status: 500 }
    );
  }
}
