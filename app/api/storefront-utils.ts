import { NextResponse } from "next/server";
import {
  clearCartCookie,
  getCartCookie,
  setCartCookie,
} from "lib/cart/cookies";

interface ApiLikeError {
  message?: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export function toErrorResponse(error: unknown, fallbackMessage: string) {
  const apiError = error as ApiLikeError | undefined;
  const message =
    typeof apiError?.message === "string" && apiError.message.length > 0
      ? apiError.message
      : fallbackMessage;
  const status =
    typeof apiError?.status === "number" && apiError.status >= 400
      ? apiError.status
      : 500;

  return NextResponse.json(
    {
      error: message,
      ...(apiError?.errors ? { errors: apiError.errors } : {}),
    },
    { status }
  );
}

export function getErrorStatus(error: unknown): number | null {
  const apiError = error as ApiLikeError | undefined;
  return typeof apiError?.status === "number" ? apiError.status : null;
}

export async function getCartIdCookie() {
  return getCartCookie();
}

export async function setCartIdCookie(cartId: string) {
  await setCartCookie(cartId);
}

export async function clearCartIdCookie() {
  await clearCartCookie();
}

export function getResourceId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;
  if (typeof candidate.id === "string" && candidate.id.length > 0) {
    return candidate.id;
  }

  if (typeof candidate._id === "string" && candidate._id.length > 0) {
    return candidate._id;
  }

  return null;
}
