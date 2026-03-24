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
    const response = await fetch(`${backendUrl}/admin/products/${id}`, {
      method: "GET",
      headers: authHeader,
    });

    const payload = await readResponsePayload(response);
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const authHeader = await getAdminAuthorizationHeader();
    const response = await fetch(`${backendUrl}/admin/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(body),
    });

    const payload = await readResponsePayload(response);
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const authHeader = await getAdminAuthorizationHeader();
    const response = await fetch(`${backendUrl}/admin/products/${id}`, {
      method: "DELETE",
      headers: authHeader,
    });

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const payload = await readResponsePayload(response);
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
