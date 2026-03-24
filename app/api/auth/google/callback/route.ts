import { NextRequest, NextResponse } from "next/server";
import {
  clearGoogleOauthContext,
  getGoogleOauthContext,
  setAuthCookie,
  withGoogleAuthError,
} from "../utils";

export async function GET(request: NextRequest) {
  const backendUrl =
    process.env.CUSTOM_API_BASE_URL || "http://127.0.0.1:3001/api";
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const oauthError = request.nextUrl.searchParams.get("error");
  const context = await getGoogleOauthContext();
  const fallbackRedirect = context.failureRedirect || "/login";
  const successRedirect = context.successRedirect || "/";

  const fail = async (reason: string) => {
    await clearGoogleOauthContext();
    return NextResponse.redirect(
      new URL(withGoogleAuthError(fallbackRedirect, reason), request.url)
    );
  };

  if (oauthError) {
    return fail(oauthError);
  }

  if (!code || !state || !context.state || state !== context.state) {
    return fail("state");
  }

  if (!context.nonce) {
    return fail("nonce");
  }

  try {
    const response = await fetch(`${backendUrl}/auth/google/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        nonce: context.nonce,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return fail("backend");
    }

    const data = await response.json();
    const token = data.token || data.data?.token;

    if (!token) {
      return fail("token");
    }

    await setAuthCookie(token);
    await clearGoogleOauthContext();

    return NextResponse.redirect(new URL(successRedirect, request.url));
  } catch (error) {
    console.error("Google OAuth callback failed:", error);
    return fail("failed");
  }
}

