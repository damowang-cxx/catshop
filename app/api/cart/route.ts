import { NextResponse } from "next/server";
import { apiClient } from "lib/api/server-client";
import {
  clearCartIdCookie,
  getCartIdCookie,
  getErrorStatus,
  getResourceId,
  setCartIdCookie,
  toErrorResponse,
} from "app/api/storefront-utils";

export async function GET() {
  const cartId = await getCartIdCookie();
  if (!cartId) {
    return NextResponse.json(null);
  }

  try {
    const cart = await apiClient.get<any>(`/cart/${cartId}`);
    return NextResponse.json(cart);
  } catch (error) {
    if (getErrorStatus(error) === 404) {
      await clearCartIdCookie();
      return NextResponse.json(null);
    }

    return toErrorResponse(error, "Failed to fetch cart.");
  }
}

export async function POST() {
  try {
    const cart = await apiClient.post<any>("/cart");
    const cartId = getResourceId(cart);
    if (cartId) {
      await setCartIdCookie(cartId);
    }

    return NextResponse.json(cart);
  } catch (error) {
    return toErrorResponse(error, "Failed to create cart.");
  }
}
