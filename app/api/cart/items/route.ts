import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "lib/api/server-client";
import {
  clearCartIdCookie,
  getCartIdCookie,
  getErrorStatus,
  getResourceId,
  setCartIdCookie,
  toErrorResponse,
} from "app/api/storefront-utils";

async function resolveCartId(createIfMissing = false) {
  let cartId = await getCartIdCookie();

  if (!cartId && createIfMissing) {
    const cart = await apiClient.post<any>("/cart");
    cartId = getResourceId(cart);
    if (!cartId) {
      throw new Error("Cart was created without an id.");
    }
    await setCartIdCookie(cartId);
  }

  return cartId;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cartId = await resolveCartId(true);
    const cart = await apiClient.post<any>(`/cart/${cartId}/items`, body);
    return NextResponse.json(cart);
  } catch (error) {
    return toErrorResponse(error, "Failed to add items to cart.");
  }
}

export async function PATCH(request: NextRequest) {
  const cartId = await getCartIdCookie();
  if (!cartId) {
    return NextResponse.json({ error: "Cart not found." }, { status: 404 });
  }

  try {
    const body = await request.json();
    const cart = await apiClient.patch<any>(`/cart/${cartId}/items`, body);
    return NextResponse.json(cart);
  } catch (error) {
    if (getErrorStatus(error) === 404) {
      await clearCartIdCookie();
    }

    return toErrorResponse(error, "Failed to update cart.");
  }
}

export async function DELETE(request: NextRequest) {
  const cartId = await getCartIdCookie();
  if (!cartId) {
    return NextResponse.json({ error: "Cart not found." }, { status: 404 });
  }

  try {
    const body = await request.json();
    const cart = await apiClient.delete<any>(`/cart/${cartId}/items`, body);
    return NextResponse.json(cart);
  } catch (error) {
    if (getErrorStatus(error) === 404) {
      await clearCartIdCookie();
    }

    return toErrorResponse(error, "Failed to remove items from cart.");
  }
}
