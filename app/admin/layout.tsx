import { ReactNode } from "react";
import { requireAdminAuth } from "lib/admin/auth";
import AdminSidebar from "components/admin/sidebar";
import AdminHeader from "components/admin/header";

/**
 * 后台管理布局
 * 注意：登录页面的布局在 app/admin/login/layout.tsx 中单独定义
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // 验证管理员权限（登录页面会在其自己的布局中处理）
  await requireAdminAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col md:ml-64">
        <AdminHeader />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
