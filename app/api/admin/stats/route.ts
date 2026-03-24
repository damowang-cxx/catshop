/**
 * 缁熻鏁版嵁 API 璺敱
 * GET: 鑾峰彇浠〃鐩樼粺璁℃暟鎹?
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const backendUrl = process.env.CUSTOM_API_BASE_URL || "http://127.0.0.1:3001/api";

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");
  
  return {
    "Content-Type": "application/json",
    ...(adminToken ? { Authorization: `Bearer ${adminToken.value}` } : {}),
  };
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${backendUrl}/stats`, {
      method: "GET",
      headers: await getAuthHeaders(),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    }

    // 濡傛灉鍚庣涓嶅彲鐢紝杩斿洖榛樿鏁版嵁
    return NextResponse.json({
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalUsers: 0,
      recentOrders: [],
      popularProducts: [],
    });
  } catch (error: any) {
    console.error("鑾峰彇缁熻鏁版嵁澶辫触:", error);
    // 杩斿洖榛樿鏁版嵁
    return NextResponse.json({
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalUsers: 0,
      recentOrders: [],
      popularProducts: [],
    });
  }
}

