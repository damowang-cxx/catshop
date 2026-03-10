"use client";

import type {
  BulkActionRequest,
  OrderStatus,
  UploadResponse,
} from "lib/admin/types";

type Resource = "products" | "collections" | "orders";

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();
    if (typeof data?.error === "string") {
      return data.error;
    }
    if (typeof data?.message === "string") {
      return data.message;
    }
  } catch {
    // Ignore JSON parse errors and use fallback.
  }

  return `Request failed with status ${response.status}`;
}

export async function executeBulkAction(
  resource: Resource,
  payload: BulkActionRequest
): Promise<void> {
  const response = await fetch(`/api/admin/${resource}/bulk`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  await executeBulkAction("orders", {
    action: "updateStatus",
    ids: [orderId],
    status,
  });
}

export async function uploadAdminImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const data = (await response.json()) as UploadResponse;
  if (!data?.url) {
    throw new Error("Upload succeeded but no url was returned.");
  }

  return data;
}

