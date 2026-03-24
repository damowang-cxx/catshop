import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const backendUrl =
  process.env.CUSTOM_API_BASE_URL || "http://127.0.0.1:3001/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${backendUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return NextResponse.json(
        {
          error: payload.message || payload.error || "Registration failed.",
        },
        { status: response.status }
      );
    }

    const token =
      typeof payload?.token === "string"
        ? payload.token
        : typeof payload?.data?.token === "string"
          ? payload.data.token
          : null;
    const user =
      payload?.user && typeof payload.user === "object"
        ? payload.user
        : payload?.data?.user && typeof payload.data.user === "object"
          ? payload.data.user
          : null;

    if (!token || !user || user.role !== "customer") {
      return NextResponse.json(
        { error: "Invalid registration response." },
        { status: 502 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed." },
      { status: 500 }
    );
  }
}

