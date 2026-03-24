import { cookies } from "next/headers";

const OAUTH_COOKIE_MAX_AGE = 60 * 10;
const STATE_COOKIE = "google_oauth_state";
const NONCE_COOKIE = "google_oauth_nonce";
const SUCCESS_REDIRECT_COOKIE = "google_oauth_success_redirect";
const FAILURE_REDIRECT_COOKIE = "google_oauth_failure_redirect";

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: OAUTH_COOKIE_MAX_AGE,
  };
}

export function sanitizeInternalPath(
  path: string | null | undefined,
  fallback: string
) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  return path;
}

export async function setGoogleOauthContext(context: {
  state: string;
  nonce: string;
  successRedirect: string;
  failureRedirect: string;
}) {
  const cookieStore = await cookies();
  const options = cookieOptions();

  cookieStore.set(STATE_COOKIE, context.state, options);
  cookieStore.set(NONCE_COOKIE, context.nonce, options);
  cookieStore.set(SUCCESS_REDIRECT_COOKIE, context.successRedirect, options);
  cookieStore.set(FAILURE_REDIRECT_COOKIE, context.failureRedirect, options);
}

export async function getGoogleOauthContext() {
  const cookieStore = await cookies();

  return {
    state: cookieStore.get(STATE_COOKIE)?.value ?? null,
    nonce: cookieStore.get(NONCE_COOKIE)?.value ?? null,
    successRedirect: cookieStore.get(SUCCESS_REDIRECT_COOKIE)?.value ?? null,
    failureRedirect: cookieStore.get(FAILURE_REDIRECT_COOKIE)?.value ?? null,
  };
}

export async function clearGoogleOauthContext() {
  const cookieStore = await cookies();
  cookieStore.delete(STATE_COOKIE);
  cookieStore.delete(NONCE_COOKIE);
  cookieStore.delete(SUCCESS_REDIRECT_COOKIE);
  cookieStore.delete(FAILURE_REDIRECT_COOKIE);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export function withGoogleAuthError(path: string, error: string) {
  const url = new URL(path, "http://local");
  url.searchParams.set("googleAuthError", error);
  return `${url.pathname}${url.search}`;
}
