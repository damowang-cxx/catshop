# Provider 机制实现总结

## 已完成的工作

### 1. 创建 Commerce 抽象层 (`packages/commerce/`)

- **`packages/commerce/src/types.ts`**: 定义了所有电商相关的类型（Product, Cart, Order, User 等）
- **`packages/commerce/src/provider.ts`**: 定义了 `CommerceProvider` 接口，所有 Provider 必须实现此接口
- **`packages/commerce/src/index.ts`**: 导出所有类型和接口
- **`packages/commerce/package.json`**: 包配置文件

### 2. 实现三个 Provider

#### Local Provider (`lib/providers/local/`)
- 使用静态数据模拟产品
- 禁用购物车、登录、订单功能
- 适合开发和测试

#### Custom Provider (`lib/providers/custom/`)
- 对接自研后端 API
- 实现完整功能：产品、购物车、用户、订单
- 通过 `CUSTOM_API_BASE_URL` 环境变量配置后端地址

#### Shopify Provider (`lib/providers/shopify/`)
- 包装现有的 Shopify 实现
- 保持向后兼容
- 支持 Shopify Storefront API 的所有功能

### 3. Provider 工厂 (`lib/commerce.ts`)

- `getCommerceProvider()`: 根据环境变量选择 Provider
- `commerce` 对象: 提供便捷方法直接调用当前 Provider
- 向后兼容: 导出原有的函数名（getProduct, getCart 等）

### 4. 类型系统 (`lib/types.ts`)

- 从 `@commerce/types` 重新导出类型
- 保持向后兼容，现有代码无需修改类型导入

### 5. 更新所有引用

已更新所有使用 `lib/shopify` 的文件，改为使用 `lib/commerce`：
- App 路由文件（`app/`）
- 组件文件（`components/`）
- API 路由（`app/api/`）

### 6. 配置支持

- 更新 `tsconfig.json` 添加路径别名 `@commerce/*`
- 创建 `PROVIDER_SETUP.md` 配置指南
- 环境变量支持：
  - `COMMERCE_PROVIDER`: 选择 Provider（local/custom/shopify）
  - `CUSTOM_API_BASE_URL`: 自定义后端地址
  - Shopify 相关环境变量保持不变

## 使用方法

### 1. 配置环境变量

创建 `.env.local` 文件：

```bash
# 使用本地 Provider（默认）
COMMERCE_PROVIDER=local

# 或使用自定义 Provider
COMMERCE_PROVIDER=custom
CUSTOM_API_BASE_URL=http://localhost:3001/api

# 或使用 Shopify Provider
COMMERCE_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
```

### 2. 在代码中使用

```typescript
import { commerce } from "lib/commerce";

// 获取产品
const product = await commerce.getProduct("handle");
const products = await commerce.getProducts({ query: "search" });

// 购物车操作
const cart = await commerce.getCart();
await commerce.addToCart([{ merchandiseId: "id", quantity: 1 }]);

// 用户操作（仅 Custom Provider）
const user = await commerce.login({ email: "user@example.com", password: "pass" });
```

### 3. 向后兼容

现有代码无需修改，所有原有的导入仍然有效：

```typescript
import { getProduct, getCart } from "lib/commerce";
```

## 自定义后端 API 规范

如果使用 Custom Provider，后端需要实现以下接口：

### 产品
- `GET /api/products` - 产品列表
- `GET /api/products/:handle` - 产品详情
- `GET /api/products/:id/recommendations` - 产品推荐

### 分类
- `GET /api/collections` - 分类列表
- `GET /api/collections/:handle` - 分类详情
- `GET /api/collections/:handle/products` - 分类产品

### 购物车
- `GET /api/cart/:cartId` - 获取购物车
- `POST /api/cart` - 创建购物车
- `POST /api/cart/:cartId/items` - 添加商品
- `DELETE /api/cart/:cartId/items` - 删除商品
- `PATCH /api/cart/:cartId/items` - 更新商品

### 用户
- `POST /api/auth/login` - 登录
- `POST /api/auth/register` - 注册
- `POST /api/auth/logout` - 登出
- `GET /api/auth/me` - 当前用户

### 订单
- `POST /api/orders` - 创建订单
- `GET /api/orders/:id` - 订单详情
- `GET /api/orders` - 订单列表

详细 API 规范请参考 `PROVIDER_SETUP.md`。

## 架构优势

1. **解耦**: 前端代码与具体后端实现解耦
2. **可扩展**: 轻松添加新的 Provider
3. **类型安全**: 完整的 TypeScript 类型支持
4. **向后兼容**: 现有代码无需修改
5. **灵活配置**: 通过环境变量切换 Provider

## 下一步

1. 实现自研后端 API
2. 配置 `.env.local` 切换到 Custom Provider
3. 测试所有功能
4. 根据需要扩展 Provider 功能
