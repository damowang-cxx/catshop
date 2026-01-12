# Next.js Commerce - 电商应用

一个基于 Next.js 15 App Router 的高性能、服务端渲染电商应用。

本项目使用 React Server Components、Server Actions、`Suspense`、`useOptimistic` 等现代 React 特性构建。

## ✨ 主要特性

- 🚀 **Next.js 15** - 使用最新的 App Router 和 React Server Components
- 🔌 **多 Provider 支持** - 支持 Local、Custom、Shopify 三种后端 Provider
- ⚙️ **功能开关配置** - 通过 `commerce.config.json` 灵活控制功能启用
- 🎨 **现代化 UI** - 使用 Tailwind CSS 4.0 构建的响应式界面
- 🔍 **完整电商功能** - 产品浏览、搜索、购物车、用户认证、订单等
- 📱 **响应式设计** - 完美适配桌面和移动设备

## 🛠️ 技术栈

- **框架**: Next.js 15.6.0 (Canary)
- **React**: 19.0.0
- **样式**: Tailwind CSS 4.0
- **UI 组件**: Headless UI, Heroicons
- **包管理**: pnpm
- **类型检查**: TypeScript 5.8

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

#### 使用本地 Provider（默认，用于开发测试）

```bash
COMMERCE_PROVIDER=local
SITE_NAME=Next.js Commerce
```

#### 使用自定义 Provider（对接自研后端）

```bash
COMMERCE_PROVIDER=custom
CUSTOM_API_BASE_URL=http://localhost:3001/api
SITE_NAME=Next.js Commerce
```

#### 使用 Shopify Provider

```bash
COMMERCE_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_REVALIDATION_SECRET=your-revalidation-secret
SITE_NAME=Next.js Commerce
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📦 Provider 机制

本项目支持通过 Provider 机制对接不同的电商后端，默认使用 Local Provider。

### Provider 类型

| Provider | 用途 | 产品列表 | 购物车 | 用户认证 | 订单 |
|----------|------|---------|--------|---------|------|
| **Local** | 开发测试 | ✅ | ❌ | ❌ | ❌ |
| **Custom** | 自研后端 | ✅ | ✅ | ✅ | ✅ |
| **Shopify** | Shopify API | ✅ | ✅ | ❌ | ⚠️* |

*Shopify 通过 checkoutUrl 跳转到 Shopify 结账页面

### 切换 Provider

只需修改 `.env.local` 中的 `COMMERCE_PROVIDER` 值，重启服务器即可切换。

## ⚙️ 功能配置

通过 `commerce.config.json` 配置文件管理功能开关：

```json
{
  "features": {
    "cart": true,
    "customerAuth": true,
    "wishlist": true,
    "orders": true,
    "search": true,
    "productRecommendations": true,
    "collections": true,
    "menus": true,
    "pages": true
  }
}
```

功能开关会根据 Provider 的支持情况自动显示或隐藏相应的 UI 组件。

## 📁 项目结构

```
.
├── app/                    # Next.js App Router 页面
│   ├── page.tsx           # 首页
│   ├── product/           # 产品详情页
│   ├── search/            # 搜索/列表页
│   └── api/               # API 路由
├── components/             # React 组件
│   ├── cart/              # 购物车组件
│   ├── layout/            # 布局组件
│   ├── product/           # 产品组件
│   └── ...
├── lib/                    # 工具库
│   ├── providers/         # Provider 实现
│   │   ├── local/         # 本地 Provider
│   │   ├── custom/        # 自定义 Provider
│   │   └── shopify/       # Shopify Provider
│   ├── commerce.ts        # Provider 工厂
│   └── ...
├── packages/               # 内部包
│   └── commerce/          # Commerce 抽象层
└── public/                 # 静态资源
```

## 📚 相关文档

- [快速开始指南](QUICKSTART.md) - 详细的配置和运行说明
- [Provider 配置指南](PROVIDER_SETUP.md) - Provider 的详细配置方法
- [功能开关指南](FEATURES_GUIDE.md) - 功能开关的配置说明
- [API 集成文档](API_INTEGRATION.md) - Custom Provider API 集成说明
- [立即运行](RUN_NOW.md) - 快速运行项目的步骤

## 🛠️ 开发命令

```bash
# 启动开发服务器（使用 Turbopack）
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码格式化
pnpm prettier

# 检查代码格式
pnpm prettier:check

# 运行测试（代码格式检查）
pnpm test
```

## 🔧 环境变量说明

| 变量名 | 说明 | 必需 | 默认值 |
|--------|------|------|--------|
| `COMMERCE_PROVIDER` | Provider 类型 (local/custom/shopify) | 否 | `local` |
| `CUSTOM_API_BASE_URL` | Custom Provider 后端地址 | Custom 时必需 | - |
| `SHOPIFY_STORE_DOMAIN` | Shopify 店铺域名 | Shopify 时必需 | - |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Shopify Storefront API Token | Shopify 时必需 | - |
| `SHOPIFY_REVALIDATION_SECRET` | Shopify 重新验证密钥 | Shopify 时必需 | - |
| `SITE_NAME` | 网站名称 | 否 | `Next.js Commerce` |
| `COMPANY_NAME` | 公司名称 | 否 | - |

## 🎯 功能特性

### 已实现功能

- ✅ 产品列表和详情页
- ✅ 产品搜索和筛选
- ✅ 产品分类浏览
- ✅ 购物车管理（Custom/Shopify Provider）
- ✅ 用户认证（Custom Provider）
- ✅ 订单管理（Custom Provider）
- ✅ 产品推荐
- ✅ 响应式布局
- ✅ SEO 优化（sitemap、robots.txt、Open Graph）

### 开发中功能

- 🔄 愿望单功能
- 🔄 产品评论和评分

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

查看 [license.md](license.md) 文件了解详情。

## 🔗 相关链接

- [Next.js 文档](https://nextjs.org/docs)
- [Vercel 部署指南](https://vercel.com/docs)
- [Shopify Storefront API](https://shopify.dev/docs/api/storefront)

---

基于 [Next.js Commerce](https://github.com/vercel/commerce) 模板构建
