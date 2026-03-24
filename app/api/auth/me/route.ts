import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const backendUrl =
  process.env.CUSTOM_API_BASE_URL || "http://127.0.0.1:3001/api";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${backendUrl}/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const payload = await response.json().catch(() => ({}));
    if (response.status === 401) {
      cookieStore.delete("auth_token");
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: payload.message || payload.error || "Failed to fetch user." },
        { status: response.status }
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Fetch current user error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user." },
      { status: 500 }
    );
  }
}

