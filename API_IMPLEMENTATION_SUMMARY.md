# API 接口对接实现总结

## 完成的工作

### 1. 创建统一的 API 客户端

**服务端 API 客户端** (`lib/api/client.ts`)
- `ApiClient` 类：用于服务端组件和 Server Actions
- 自动处理认证 token（从 cookie 读取）
- 统一的错误处理
- 支持 GET、POST、PUT、PATCH、DELETE 方法

**客户端 API 客户端** (`lib/api/client.ts`)
- `ClientApiClient` 类：用于客户端组件
- 从 cookie 或 localStorage 读取 token
- 支持所有 HTTP 方法

### 2. 数据转换工具

**转换器** (`lib/api/transformers.ts`)
- `transformProduct`: 转换产品数据
- `transformCollection`: 转换分类数据
- `transformCart`: 转换购物车数据
- `transformOrder`: 转换订单数据
- `transformUser`: 转换用户数据
- `transformImage`: 转换图片数据
- `transformMoney`: 转换金额数据

支持多种后端数据格式：
- `id` / `_id` → `id`
- `handle` / `slug` → `handle`
- `name` / `title` → `title`
- `price` / `amount` → `price.amount`
- `currency` / `currencyCode` → `price.currencyCode`

### 3. 更新 Custom Provider

**完整实现** (`lib/providers/custom/index.ts`)
- 使用统一的 API 客户端
- 所有方法都使用数据转换器
- 正确处理错误和异常
- 自动管理购物车 ID 和认证 token

**功能覆盖:**
- ✅ 产品列表/详情/推荐
- ✅ 分类列表/详情/产品
- ✅ 购物车增删改查
- ✅ 用户登录/注册/登出
- ✅ 订单创建/查询

### 4. 客户端 Hooks

**React Hooks** (`lib/api/hooks.ts`)
- `useProducts`: 产品列表 Hook
- `useCart`: 购物车操作 Hook
- `useAuth`: 用户认证 Hook

所有 Hooks 提供：
- `loading` 状态
- `error` 错误处理
- 异步操作方法

### 5. 文档

- `API_INTEGRATION.md`: 完整的 API 接口规范和使用文档

## 使用方式

### 服务端组件

```typescript
import { commerce } from "lib/commerce";

export default async function Page() {
  const products = await commerce.getProducts();
  return <div>{/* 渲染产品 */}</div>;
}
```

### Server Actions

```typescript
"use server";

import { addToCart } from "lib/commerce";

export async function addItem(variantId: string) {
  await addToCart([{ merchandiseId: variantId, quantity: 1 }]);
}
```

### 客户端组件

```typescript
"use client";

import { useCart } from "lib/api/hooks";

export function CartButton() {
  const { cart, addToCart, loading } = useCart();
  
  return (
    <button onClick={() => addToCart([{ merchandiseId: "id", quantity: 1 }])}>
      添加到购物车
    </button>
  );
}
```

## API 接口规范

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

详细规范请参考 `API_INTEGRATION.md`。

## 配置

在 `.env.local` 中配置：

```bash
COMMERCE_PROVIDER=custom
CUSTOM_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_CUSTOM_API_BASE_URL=http://localhost:3001/api
```

## 数据流程

1. **前端调用** → `commerce.getProduct()` 或 `useCart()`
2. **Provider 层** → Custom Provider 接收请求
3. **API 客户端** → 调用 `apiClient.get()` 或 `clientApi.get()`
4. **HTTP 请求** → 发送到后端 API
5. **数据转换** → `transformProduct()` 等转换器处理响应
6. **返回数据** → 前端接收标准格式的数据

## 特性

1. **统一接口**: 所有 API 调用通过统一的客户端
2. **自动转换**: 后端数据自动转换为前端格式
3. **错误处理**: 统一的错误处理机制
4. **类型安全**: 完整的 TypeScript 类型支持
5. **认证管理**: 自动处理 token 和 cookie
6. **购物车管理**: 自动管理购物车 ID

## 下一步

1. 实现后端 API 接口（参考 `API_INTEGRATION.md`）
2. 配置环境变量指向后端地址
3. 测试所有功能
4. 根据需要调整数据转换逻辑
