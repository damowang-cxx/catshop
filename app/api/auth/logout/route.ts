/**
 * 用户登出 API 路由
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.CUSTOM_API_BASE_URL || "http://localhost:3001/api";
    
    // 尝试调用后端 API 登出
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("auth_token")?.value;

      if (token) {
        await fetch(`${backendUrl}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => {
          // 忽略后端错误，继续清除本地 cookie
        });
      }
    } catch (error) {
      // 忽略后端错误，继续清除本地 cookie
      console.error("后端登出 API 调用失败:", error);
    }

    // 清除本地 cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("登出错误:", error);
    // 即使出错也清除 cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
