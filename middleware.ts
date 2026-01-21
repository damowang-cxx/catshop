import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "./lib/i18n/config";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 检查路径是否已经包含语言前缀
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // 如果路径已经包含语言前缀，直接通过
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 从 cookie 或 Accept-Language header 获取语言偏好
  const locale = getLocale(request);

  // 重定向到带语言前缀的URL
  const newUrl = new URL(`/${locale}${pathname}`, request.url);
  return NextResponse.redirect(newUrl);
}

function getLocale(request: NextRequest): string {
  // 1. 优先从 cookie 获取
  const cookieLocale = request.cookies.get("locale")?.value;
  if (cookieLocale && locales.includes(cookieLocale as any)) {
    return cookieLocale;
  }

  // 2. 从 Accept-Language header 获取
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    // 解析 Accept-Language header
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [code, q = "1"] = lang.trim().split(";q=");
        return { code: code.split("-")[0], quality: parseFloat(q) };
      })
      .sort((a, b) => b.quality - a.quality);

    for (const lang of languages) {
      if (locales.includes(lang.code as any)) {
        return lang.code;
      }
    }
  }

  // 3. 默认返回中文
  return defaultLocale;
}

export const config = {
  matcher: [
    // 匹配所有路径，除了：
    // - api 路由
    // - _next/static (静态文件)
    // - _next/image (图片优化)
    // - favicon.ico (图标)
    // - 已包含语言前缀的路径
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|admin).*)",
  ],
};
