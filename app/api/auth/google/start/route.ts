import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, type Locale } from "lib/i18n/config";
import { addLocaleToPath } from "lib/i18n/utils";
import {
  sanitizeInternalPath,
  setGoogleOauthContext,
  withGoogleAuthError,
} from "../utils";

export async function GET(request: NextRequest) {
  const backendUrl =
    process.env.CUSTOM_API_BASE_URL || "http://127.0.0.1:3001/api";
  const requestedLocale = request.nextUrl.searchParams.get("locale");
  const locale: Locale =
    requestedLocale && locales.includes(requestedLocale as Locale)
      ? (requestedLocale as Locale)
      : defaultLocale;
  const successRedirect = sanitizeInternalPath(
    request.nextUrl.searchParams.get("next"),
    addLocaleToPath("/", locale)
  );
  const failureRedirect = sanitizeInternalPath(
    request.nextUrl.searchParams.get("failureRedirect"),
    addLocaleToPath("/login", locale)
  );
  const state = randomUUID();
  const nonce = randomUUID();

  try {
    await setGoogleOauthContext({
      state,
      nonce,
      successRedirect,
      failureRedirect,
    });

    const response = await fetch(
      `${backendUrl}/auth/google/url?${new URLSearchParams({
        state,
        nonce,
      }).toString()}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.redirect(
        new URL(withGoogleAuthError(failureRedirect, "unavailable"), request.url)
      );
    }

    const data = await response.json();
    const url = data.url || data.data?.url;
    if (!url) {
      return NextResponse.redirect(
        new URL(withGoogleAuthError(failureRedirect, "config"), request.url)
      );
    }

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Google OAuth start failed:", error);
    return NextResponse.redirect(
      new URL(withGoogleAuthError(failureRedirect, "failed"), request.url)
    );
  }
}

