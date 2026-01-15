import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * 要求管理员认证
 * 如果未登录，重定向到登录页面
 */
export async function requireAdminAuth() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");
  
  if (!adminToken) {
    redirect("/admin/login");
  }
  
  // TODO: 实现 token 验证逻辑
  return { isAuthenticated: true };
}

/**
 * 获取当前管理员用户信息
 */
export async function getAdminUser() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");
  
  if (!adminToken) {
    return null;
  }
  
  // TODO: 从 token 中获取用户信息
  return null;
}
