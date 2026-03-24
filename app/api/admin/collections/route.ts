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
      query
        ? `${backendUrl}/admin/collections?${query}`
        : `${backendUrl}/admin/collections`,
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
    console.error("Failed to fetch collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = await getAdminAuthorizationHeader();
    const response = await fetch(`${backendUrl}/admin/collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(body),
    });

    const payload = await readResponsePayload(response);
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Failed to create collection:", error);
    return NextResponse.json(
      { error: "Failed to create collection." },
      { status: 500 }
    );
  }
}
