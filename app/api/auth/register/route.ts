/**
 * 用户注册 API 路由
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, firstName, lastName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "邮箱和密码不能为空" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "密码至少需要6个字符" },
        { status: 400 }
      );
    }

    // 尝试调用后端 API
    const backendUrl = process.env.CUSTOM_API_BASE_URL || "http://localhost:3001/api";
    
    try {
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token || data.data?.token;

        if (token) {
          // 设置 cookie
          const cookieStore = await cookies();
          cookieStore.set("auth_token", token, {
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
      } else {
        const errorData = await response.json().catch(() => ({}));
        return NextResponse.json(
          { error: errorData.message || "注册失败" },
          { status: response.status }
        );
      }
    } catch (backendError) {
      // 后端不可用时，使用临时测试账号（仅开发环境）
      if (process.env.NODE_ENV === "development") {
        // 模拟注册成功
        const testToken = "test_user_token_" + Date.now();
        const cookieStore = await cookies();
        cookieStore.set("auth_token", testToken, {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 7 天
        });

        return NextResponse.json({
          success: true,
          user: {
            id: Date.now().toString(),
            email: email,
            firstName: firstName || "",
            lastName: lastName || "",
          },
        });
      }

      console.error("后端 API 调用失败:", backendError);
      return NextResponse.json(
        { error: "无法连接到服务器，请稍后重试" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "注册失败" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("注册错误:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
}
