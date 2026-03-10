import { NextRequest, NextResponse } from "next/server";
import {
  backendUrl,
  getAdminAuthorizationHeader,
  readResponsePayload,
} from "app/api/admin/utils";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function parseUploadedUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  if (typeof record.url === "string" && record.url.length > 0) {
    return record.url;
  }

  if (record.data && typeof record.data === "object") {
    const nested = record.data as Record<string, unknown>;
    if (typeof nested.url === "string" && nested.url.length > 0) {
      return nested.url;
    }
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "A file field named 'file' is required." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "Image size must be 5MB or less." },
        { status: 400 }
      );
    }

    const authHeader = await getAdminAuthorizationHeader();
    if (!authHeader.Authorization) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 401 }
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("file", file);

    const response = await fetch(`${backendUrl}/upload`, {
      method: "POST",
      headers: {
        ...authHeader,
      },
      body: backendFormData,
    });

    const payload = await readResponsePayload(response);

    if (!response.ok) {
      const errorMessage =
        payload && typeof payload === "object"
          ? ((payload as Record<string, unknown>).message as string) ||
            ((payload as Record<string, unknown>).error as string)
          : null;

      return NextResponse.json(
        { error: errorMessage || "Failed to upload image." },
        { status: response.status }
      );
    }

    const url = parseUploadedUrl(payload);
    if (!url) {
      return NextResponse.json(
        { error: "Upload succeeded but no image url was returned." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Image upload failed:", error);
    return NextResponse.json(
      { error: "Image upload failed." },
      { status: 500 }
    );
  }
}

