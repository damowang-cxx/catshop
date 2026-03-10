import { cookies } from "next/headers";

export const backendUrl =
  process.env.CUSTOM_API_BASE_URL || "http://localhost:3001/api";

export async function getAdminAuthorizationHeader(): Promise<{
  Authorization?: string;
}> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;

  return adminToken ? { Authorization: `Bearer ${adminToken}` } : {};
}

export async function readResponsePayload(
  response: Response
): Promise<unknown> {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

