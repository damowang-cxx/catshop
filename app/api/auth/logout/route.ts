/**
 * 鐢ㄦ埛鐧诲嚭 API 璺敱
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.CUSTOM_API_BASE_URL || "http://127.0.0.1:3001/api";
    
    // 灏濊瘯璋冪敤鍚庣 API 鐧诲嚭
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
          // 蹇界暐鍚庣閿欒锛岀户缁竻闄ゆ湰鍦?cookie
        });
      }
    } catch (error) {
      // 蹇界暐鍚庣閿欒锛岀户缁竻闄ゆ湰鍦?cookie
      console.error("鍚庣鐧诲嚭 API 璋冪敤澶辫触:", error);
    }

    // 娓呴櫎鏈湴 cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("鐧诲嚭閿欒:", error);
    // 鍗充娇鍑洪敊涔熸竻闄?cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

