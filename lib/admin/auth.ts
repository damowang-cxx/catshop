import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const backendUrl =
  process.env.CUSTOM_API_BASE_URL || "http://127.0.0.1:3001/api";

export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: "admin";
  adminRole?: string;
}

function normalizeAdminUser(payload: unknown): AdminUser | null {
  const user =
    payload &&
    typeof payload === "object" &&
    "data" in payload &&
    payload.data &&
    typeof payload.data === "object"
      ? payload.data
      : payload;

  if (!user || typeof user !== "object") {
    return null;
  }

  const candidate = user as Record<string, unknown>;
  if (
    typeof candidate.id !== "string" ||
    typeof candidate.email !== "string" ||
    candidate.role !== "admin"
  ) {
    return null;
  }

  return {
    id: candidate.id,
    email: candidate.email,
    name: typeof candidate.name === "string" ? candidate.name : undefined,
    role: "admin",
    adminRole:
      typeof candidate.adminRole === "string"
        ? candidate.adminRole
        : undefined,
  };
}

async function validateAdminToken(adminToken: string): Promise<AdminUser | null> {
  try {
    const response = await fetch(`${backendUrl}/admin/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    return normalizeAdminUser(payload);
  } catch (error) {
    console.error("Failed to validate admin session:", error);
    return null;
  }
}

export async function requireAdminAuth(): Promise<AdminUser> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;

  if (!adminToken) {
    redirect("/admin/login");
  }

  const adminUser = await validateAdminToken(adminToken);
  if (!adminUser) {
    redirect("/admin/login");
  }

  return adminUser;
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;

  if (!adminToken) {
    return null;
  }

  return validateAdminToken(adminToken);
}

