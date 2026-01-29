/**
 * 用户菜单组件 - 显示登录/注册按钮或用户信息
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "lib/api/hooks";
import { t } from "lib/i18n";
import { addLocaleToPath } from "lib/i18n/utils";
import { type Locale } from "lib/i18n/config";

export default function UserMenu({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { user, loading, logout, fetchCurrentUser } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 组件挂载时获取当前用户信息
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push(addLocaleToPath("/", locale));
      router.refresh();
    } catch (error) {
      console.error("登出失败:", error);
    }
  };

  // 避免服务端和客户端渲染不一致
  if (!mounted || loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-16 bg-pink-200/50 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  if (user) {
    // 已登录状态
    return (
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 text-sm text-stone-700">
          <span className="text-rose-600">👤</span>
          <span className="font-medium">
            {user.firstName || user.lastName
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
              : user.email?.split("@")[0] || t(locale, "common", "account")}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition-all duration-300 hover:bg-pink-100 hover:text-rose-600 hover:shadow-sm"
        >
          {t(locale, "common", "logout")}
        </button>
      </div>
    );
  }

  // 未登录状态
  return (
    <div className="flex items-center gap-2">
      <Link
        href={addLocaleToPath("/login", locale)}
        className="rounded-lg px-4 py-2 text-sm font-medium text-stone-600 transition-all duration-300 hover:bg-pink-100 hover:text-rose-600 hover:shadow-sm"
      >
        {t(locale, "common", "login")}
      </Link>
      <Link
        href={addLocaleToPath("/register", locale)}
        className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        {t(locale, "common", "register")}
      </Link>
    </div>
  );
}
