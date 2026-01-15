/**
 * 登出页面
 * 处理管理员登出逻辑
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function LogoutPage() {
  const cookieStore = await cookies();
  
  // 删除 admin_token cookie
  cookieStore.delete("admin_token");
  
  // 重定向到登录页面
  redirect("/admin/login");
}
