# 快速开始

最后更新：2026-03-09

## 1. 环境要求

- Node.js 18+
- pnpm（推荐）

## 2. 安装依赖

```bash
pnpm install
```

如果要从 `E:\reveone2\shop` 根目录统一启动前后端，也可以在父目录执行一次：

```bash
cd ..
pnpm install
```

## 3. 配置环境变量

在项目根目录创建 `.env.local`。

### 方案 A：自研后端 API（当前默认模式）

```bash
COMMERCE_PROVIDER=custom
CUSTOM_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_CUSTOM_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_NAME=CatShop
```

### 方案 B：本地演示 Provider

```bash
COMMERCE_PROVIDER=local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_NAME=CatShop
```

### 方案 C：Shopify

```bash
COMMERCE_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_REVALIDATION_SECRET=your-revalidation-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SITE_NAME=CatShop
```

## 4. 启动开发服务

推荐方式：在 `E:\reveone2\shop` 根目录统一启动前后端。

```bash
cd ..
pnpm dev
```

如果你只想在当前前端目录单独启动，也可以继续使用：

```bash
pnpm dev
```

如需只启动某一侧：

```bash
cd ..
pnpm dev:web
pnpm dev:api
```

打开 `http://localhost:3000`。

## 5. 构建与生产运行

```bash
pnpm build
pnpm start
```

## 6. 常见路由

- 前台首页：`/`
- 商品检索：`/search`
- 管理后台：`/admin`

## 7. 运行模式说明

- 当前默认模式是 `custom`，会通过 `CUSTOM_API_BASE_URL` 连接自研后端。
- 推荐在父目录 `shop` workspace 运行 `pnpm dev`，这样前后端一起启动。
- `local` Provider 只适合前台展示和静态调试，不包含真实后台联调能力。
- 如后端端口不是 `3001`，请同步修改 `.env.local` 中的 `CUSTOM_API_BASE_URL` 和 `NEXT_PUBLIC_CUSTOM_API_BASE_URL`。

## 8. 相关文档

- 架构与模块：`PROJECT_ANALYSIS.md`
- API 对接：`API_INTEGRATION.md`
- 功能开关：`FEATURES_GUIDE.md`
- 本地图资源：`LOCAL_IMAGES_GUIDE.md`
