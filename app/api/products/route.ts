import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "lib/api/server-client";
import { toErrorResponse } from "app/api/storefront-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    const products = await apiClient.get<any[]>("/products", params);
    return NextResponse.json(products);
  } catch (error) {
    return toErrorResponse(error, "Failed to fetch products.");
  }
}
