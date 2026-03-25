# 快速开始

最后更新：2026-03-09

## 1. 环境要求

- Node.js 18+
- pnpm（推荐）

## 2. 安装依赖

```bash
pnpm install
```

如果要从 `shop` 根目录统一启动前后端，也可以在父目录执行一次：

```bash
cd ..
pnpm install
```

## 3. 配置环境变量

在项目根目录创建 `.env.local`。

### 方案 A：自研后端 API（当前默认模式）

```bash
COMMERCE_PROVIDER=custom
CUSTOM_API_BASE_URL=http://127.0.0.1:3001/api
NEXT_PUBLIC_CUSTOM_API_BASE_URL=http://127.0.0.1:3001/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false
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

推荐方式：在 `shop` 根目录统一启动前后端。

第一次启动后端前，先在 `catshop-api` 目录初始化数据库：

```bash
cd ../catshop-api
docker compose up -d postgres redis minio clickhouse meilisearch mailpit
pnpm install
pnpm prisma:generate
pnpm prisma:migrate:dev --name init_persistence
pnpm seed
```

开发环境默认账号：

- 后台管理员：`admin@example.com / admin123`
- 前台用户：`alice@example.com / password123`

完成后回到父目录统一启动：

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

如需启用 Google 登录/注册：

- 前端 `.env.local` 设置 `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true`
- 后端 `.env` 设置 `GOOGLE_AUTH_ENABLED=true`、`GOOGLE_CLIENT_ID`、`GOOGLE_CLIENT_SECRET`
- Google OAuth 控制台回调地址配置为 `http://localhost:3000/api/auth/google/callback`

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

## 9. Ubuntu 服务器部署验证（推荐流程）

适用场景：你需要在 Ubuntu 服务器上先验证完整流程（注册/登录/下单/后台管理）。

### 9.1 启动后端依赖容器（避免 Argon2 哈希变量告警）

在 `catshop-api` 目录执行：

```bash
cp .env.compose.example .env.compose
docker compose --env-file .env.compose up -d postgres redis minio clickhouse meilisearch mailpit
```

说明：

- 不要直接让 Docker Compose 读取应用 `.env`（其中有 Argon2 哈希，包含 `$`，会触发变量展开 warning）。
- 应用进程仍然读取 `catshop-api/.env`，Compose 只读取 `.env.compose`。

### 9.2 启动后端 API（catshop-api）

```bash
cd ../catshop-api
cp .env.example .env
pnpm install
pnpm prisma:generate
pnpm prisma:migrate:dev --name init_persistence
pnpm seed
pnpm start:dev
```

检查：

- 健康检查：`curl http://127.0.0.1:3001/api/health`
- Swagger：`http://<server-ip>:3001/api/docs`

### 9.3 启动前端（catshop）

```bash
cd ../catshop
cp .env.example .env.local
pnpm install
pnpm dev
```

前端 `.env.local` 至少确认：

```bash
COMMERCE_PROVIDER=custom
CUSTOM_API_BASE_URL=http://127.0.0.1:3001/api
NEXT_PUBLIC_CUSTOM_API_BASE_URL=http://127.0.0.1:3001/api
NEXT_PUBLIC_SITE_URL=http://<your-domain-or-ip>
```

### 9.4 服务器部署差异与注意事项（必须看）

- `localhost` 与 `127.0.0.1`：同机部署推荐统一使用 `127.0.0.1`，避免 `localhost` 的 IPv6/解析差异指向错误进程。
- Cookie 安全策略：当前登录 cookie 在 `NODE_ENV=production` 下为 `Secure`，如果你用纯 HTTP（无 TLS）访问，浏览器不会保存认证 cookie，表现为登录后仍未登录。  
  建议先配置 HTTPS 再做生产模式验证。
- 域名配置：上线后务必把前后端的 `NEXT_PUBLIC_SITE_URL`、`APP_URL`、`GOOGLE_REDIRECT_URI`（如启用）改成真实域名。
- 端口与防火墙：至少放行前端端口（通常 3000 或反代后的 80/443）；数据库与中间件端口建议仅内网开放。

