import { NextRequest, NextResponse } from "next/server";
import {
  backendUrl,
  getAdminAuthorizationHeader,
  readResponsePayload,
} from "app/api/admin/utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const authHeader = await getAdminAuthorizationHeader();
    const response = await fetch(`${backendUrl}/admin/orders/${id}`, {
      method: "GET",
      headers: authHeader,
    });

    const payload = await readResponsePayload(response);
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const authHeader = await getAdminAuthorizationHeader();
    const response = await fetch(`${backendUrl}/admin/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(body),
    });

    const payload = await readResponsePayload(response);
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Failed to update order:", error);
    return NextResponse.json(
      { error: "Failed to update order." },
      { status: 500 }
    );
  }
}
