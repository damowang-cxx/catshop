# Provider 配置指南

本项目支持通过 Provider 机制对接不同的电商后端。默认使用本地 Provider，也可以切换到自定义后端或 Shopify。

## Provider 类型

### 1. Local Provider (`local`)
- **用途**: 开发和测试，使用静态文件模拟数据
- **功能**: 
  - ✅ 产品列表和详情
  - ❌ 购物车功能（已禁用）
  - ❌ 用户登录/注册（已禁用）
  - ❌ 订单功能（已禁用）

### 2. Custom Provider (`custom`)
- **用途**: 对接自研后端 API
- **功能**: 
  - ✅ 产品列表和详情
  - ✅ 购物车增删改
  - ✅ 用户登录/注册
  - ✅ 订单结算

### 3. Shopify Provider (`shopify`)
- **用途**: 对接 Shopify Storefront API
- **功能**: 
  - ✅ 产品列表和详情
  - ✅ 购物车增删改
  - ❌ 用户登录/注册（Shopify Storefront API 不支持）
  - ⚠️ 订单通过 checkoutUrl 跳转

## 配置方法

### 1. 创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件：

```bash
# Commerce Provider 配置
# 可选值: local, custom, shopify
COMMERCE_PROVIDER=local

# Shopify Provider 配置（当 COMMERCE_PROVIDER=shopify 时使用）
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_REVALIDATION_SECRET=your-revalidation-secret

# Custom Provider 配置（当 COMMERCE_PROVIDER=custom 时使用）
CUSTOM_API_BASE_URL=http://localhost:3001/api

# 站点配置
SITE_NAME=Next.js Commerce
COMPANY_NAME=Your Company Name
```

### 2. 切换到本地 Provider

```bash
COMMERCE_PROVIDER=local
```

### 3. 切换到自定义 Provider

```bash
COMMERCE_PROVIDER=custom
CUSTOM_API_BASE_URL=http://localhost:3001/api
```

### 4. 切换到 Shopify Provider

```bash
COMMERCE_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-storefront-access-token
SHOPIFY_REVALIDATION_SECRET=your-revalidation-secret
```

## 自定义后端 API 接口规范

如果使用 Custom Provider，后端需要实现以下 API 接口：

### 产品相关

- `GET /api/products` - 获取产品列表
  - Query 参数: `q` (搜索关键词), `sortKey`, `reverse`
- `GET /api/products/:handle` - 获取产品详情
- `GET /api/products/:productId/recommendations` - 获取产品推荐

### 分类相关

- `GET /api/collections` - 获取分类列表
- `GET /api/collections/:handle` - 获取分类详情
- `GET /api/collections/:handle/products` - 获取分类下的产品

### 购物车相关

- `GET /api/cart/:cartId` - 获取购物车
- `POST /api/cart` - 创建购物车
- `POST /api/cart/:cartId/items` - 添加商品到购物车
- `DELETE /api/cart/:cartId/items` - 从购物车删除商品
- `PATCH /api/cart/:cartId/items` - 更新购物车商品数量

### 用户相关

- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/me` - 获取当前用户信息

### 订单相关

- `POST /api/orders` - 创建订单
- `GET /api/orders/:orderId` - 获取订单详情
- `GET /api/orders` - 获取订单列表

### 其他

- `GET /api/menus/:handle` - 获取菜单
- `GET /api/pages/:handle` - 获取页面
- `GET /api/pages` - 获取页面列表

## 使用 Provider

在代码中使用 Provider：

```typescript
import { commerce } from "lib/commerce";

// 获取产品
const product = await commerce.getProduct("product-handle");
const products = await commerce.getProducts({ query: "search term" });

// 购物车操作
const cart = await commerce.getCart();
await commerce.addToCart([{ merchandiseId: "variant-id", quantity: 1 }]);

// 用户操作（仅 Custom Provider 支持）
const user = await commerce.login({ email: "user@example.com", password: "password" });
```

## 开发自定义 Provider

如果需要开发新的 Provider，请参考 `lib/providers/custom/index.ts` 的实现，并确保实现 `CommerceProvider` 接口（定义在 `packages/commerce/src/provider.ts`）。
