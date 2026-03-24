import { NextRequest, NextResponse } from "next/server";
import {
  backendUrl,
  getAdminAuthorizationHeader,
  readResponsePayload,
} from "app/api/admin/utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();
    const authHeader = await getAdminAuthorizationHeader();
    const response = await fetch(
      query ? `${backendUrl}/admin/orders?${query}` : `${backendUrl}/admin/orders`,
      {
        method: "GET",
        headers: authHeader,
      }
    );

    const payload = await readResponsePayload(response);
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders." },
      { status: 500 }
    );
  }
}
