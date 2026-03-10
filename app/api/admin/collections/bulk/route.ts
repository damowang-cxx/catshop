import { NextRequest, NextResponse } from "next/server";
import {
  backendUrl,
  getAdminAuthorizationHeader,
  readResponsePayload,
} from "app/api/admin/utils";
import type { BulkActionRequest } from "lib/admin/types";

function isBulkPayload(value: unknown): value is BulkActionRequest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;
  return (
    typeof payload.action === "string" &&
    Array.isArray(payload.ids) &&
    payload.ids.every((id) => typeof id === "string" && id.length > 0)
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!isBulkPayload(body)) {
      return NextResponse.json(
        { error: "Invalid bulk action payload." },
        { status: 400 }
      );
    }

    if (body.ids.length === 0) {
      return NextResponse.json(
        { error: "At least one id is required." },
        { status: 400 }
      );
    }

    const authHeader = await getAdminAuthorizationHeader();
    const response = await fetch(`${backendUrl}/collections/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
      },
      body: JSON.stringify(body),
    });

    const payload = await readResponsePayload(response);
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    console.error("Collection bulk action failed:", error);
    return NextResponse.json(
      { error: "Collection bulk action failed." },
      { status: 500 }
    );
  }
}

