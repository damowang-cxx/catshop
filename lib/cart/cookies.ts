import "server-only";

import { cookies } from "next/headers";

const CART_COOKIE_NAME = "cartId";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function getCartCookie() {
  return (await cookies()).get(CART_COOKIE_NAME)?.value ?? null;
}

export async function setCartCookie(cartId: string) {
  (await cookies()).set(CART_COOKIE_NAME, cartId, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function clearCartCookie() {
  (await cookies()).delete(CART_COOKIE_NAME);
}
