# 快速开始指南

## 1. 安装依赖

```bash
pnpm install
```

## 2. 配置环境变量

创建 `.env.local` 文件（参考 `.env.local.example`）：

### 使用本地 Provider（默认，用于开发测试）

```bash
COMMERCE_PROVIDER=local
SITE_NAME=Next.js Commerce
```

### 使用自定义 Provider（对接自研后端）

```bash
COMMERCE_PROVIDER=custom
CUSTOM_API_BASE_URL=http://localhost:3001/api
SITE_NAME=Next.js Commerce
```

### 使用 Shopify Provider

```bash
COMMERCE_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_REVALIDATION_SECRET=your-revalidation-secret
SITE_NAME=Next.js Commerce
```

## 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000

## 4. 切换 Provider

只需修改 `.env.local` 中的 `COMMERCE_PROVIDER` 值，重启服务器即可切换。

## Provider 功能对比

| 功能 | Local | Custom | Shopify |
|------|-------|--------|---------|
| 产品列表/详情 | ✅ | ✅ | ✅ |
| 购物车 | ❌ | ✅ | ✅ |
| 用户登录/注册 | ❌ | ✅ | ❌ |
| 订单结算 | ❌ | ✅ | ⚠️* |

*Shopify 通过 checkoutUrl 跳转到 Shopify 结账页面

## 常见问题

### Q: 如何添加新的 Provider？

1. 在 `lib/providers/` 下创建新目录
2. 实现 `CommerceProvider` 接口
3. 在 `lib/commerce.ts` 中添加 Provider 选择逻辑

### Q: Local Provider 为什么禁用购物车？

Local Provider 设计用于开发和测试，使用静态数据。如需完整功能，请使用 Custom 或 Shopify Provider。

### Q: 如何调试 Custom Provider？

检查 `CUSTOM_API_BASE_URL` 是否正确，确保后端 API 正常运行，查看浏览器控制台和服务器日志。

## 更多信息

- 详细配置：查看 `PROVIDER_SETUP.md`
- 实现细节：查看 `PROVIDER_IMPLEMENTATION.md`
