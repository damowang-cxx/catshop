import { NextRequest, NextResponse } from "next/server";
import {
  backendUrl,
  getAdminAuthorizationHeader,
  readResponsePayload,
} from "app/api/admin/utils";

export async function GET(request: NextRequest) {
  try {
    const authHeader = await getAdminAuthorizationHeader();
    if (!authHeader.Authorization) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${backendUrl}/admin/me`, {
      method: "GET",
      headers: authHeader,
      cache: "no-store",
    });

    const payload = await readResponsePayload(response);
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Failed to fetch admin user:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin user." },
      { status: 500 }
    );
  }
}
