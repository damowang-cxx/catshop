# API 接口对接文档

本文档说明如何将 Next.js Commerce 前端与自研后端 API 对接。

## 架构概述

前端通过统一的 API 客户端 (`lib/api/client.ts`) 调用后端 REST API，数据转换工具 (`lib/api/transformers.ts`) 将后端数据格式转换为前端需要的格式。

## API 客户端

### 服务端 API 客户端 (`apiClient`)

用于服务端组件和 Server Actions：

```typescript
import { apiClient } from "lib/api/client";

// GET 请求
const products = await apiClient.get<any[]>("/products", { q: "search" });

// POST 请求
const cart = await apiClient.post<any>("/cart", {});
```

### 客户端 API 客户端 (`clientApi`)

用于客户端组件：

```typescript
import { clientApi } from "lib/api/client";

const products = await clientApi.get<any[]>("/products");
```

## API 接口规范

### 1. 产品相关

#### GET /api/products
获取产品列表

**Query 参数:**
- `q` (string, 可选): 搜索关键词
- `sortKey` (string, 可选): 排序字段 (RELEVANCE, PRICE, CREATED_AT, BEST_SELLING)
- `reverse` (boolean, 可选): 是否反向排序

**响应格式:**
```json
[
  {
    "id": "product-1",
    "handle": "product-handle",
    "title": "产品名称",
    "description": "产品描述",
    "price": "99.00",
    "currencyCode": "CNY",
    "availableForSale": true,
    "images": [
      {
        "url": "https://example.com/image.jpg",
        "altText": "产品图片",
        "width": 800,
        "height": 800
      }
    ],
    "variants": [
      {
        "id": "variant-1",
        "title": "默认",
        "price": "99.00",
        "availableForSale": true,
        "selectedOptions": []
      }
    ],
    "tags": [],
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /api/products/:handle
获取产品详情

**响应格式:** 同产品列表中的单个产品对象

#### GET /api/products/:productId/recommendations
获取产品推荐

**响应格式:** 产品数组

### 2. 分类相关

#### GET /api/collections
获取分类列表

**响应格式:**
```json
[
  {
    "id": "collection-1",
    "handle": "collection-handle",
    "title": "分类名称",
    "description": "分类描述",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /api/collections/:handle
获取分类详情

**响应格式:** 单个分类对象

#### GET /api/collections/:handle/products
获取分类下的产品

**Query 参数:** 同产品列表

**响应格式:** 产品数组

### 3. 购物车相关

#### GET /api/cart/:cartId
获取购物车

**响应格式:**
```json
{
  "id": "cart-1",
  "checkoutUrl": "/checkout",
  "totalQuantity": 2,
  "subtotal": "198.00",
  "total": "198.00",
  "tax": "0.00",
  "currencyCode": "CNY",
  "lines": [
    {
      "id": "line-1",
      "quantity": 1,
      "total": "99.00",
      "merchandiseId": "variant-1",
      "variantTitle": "默认",
      "productId": "product-1",
      "productHandle": "product-handle",
      "productTitle": "产品名称",
      "productImage": "https://example.com/image.jpg"
    }
  ]
}
```

#### POST /api/cart
创建购物车

**响应格式:** 购物车对象（初始为空）

#### POST /api/cart/:cartId/items
添加商品到购物车

**请求体:**
```json
{
  "lines": [
    {
      "merchandiseId": "variant-1",
      "quantity": 1
    }
  ]
}
```

**响应格式:** 更新后的购物车对象

#### DELETE /api/cart/:cartId/items
从购物车删除商品

**请求体:**
```json
{
  "lineIds": ["line-1", "line-2"]
}
```

**响应格式:** 更新后的购物车对象

#### PATCH /api/cart/:cartId/items
更新购物车商品数量

**请求体:**
```json
{
  "lines": [
    {
      "id": "line-1",
      "merchandiseId": "variant-1",
      "quantity": 2
    }
  ]
}
```

**响应格式:** 更新后的购物车对象

### 4. 用户认证相关

#### POST /api/auth/login
用户登录

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应格式:**
```json
{
  "user": {
    "id": "user-1",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "jwt-token-here"
}
```

#### POST /api/auth/register
用户注册

**请求体:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**响应格式:** 同登录接口

#### POST /api/auth/logout
用户登出

**响应:** 204 No Content

#### GET /api/auth/me
获取当前用户信息

**响应格式:**
```json
{
  "id": "user-1",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### 5. 订单相关

#### POST /api/orders
创建订单

**请求体:**
```json
{
  "cartId": "cart-1",
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address1": "123 Main St",
    "city": "Beijing",
    "province": "Beijing",
    "zip": "100000",
    "country": "CN"
  },
  "billingAddress": {
    // 同 shippingAddress
  }
}
```

**响应格式:**
```json
{
  "id": "order-1",
  "orderNumber": "ORD-2024-001",
  "totalPrice": "198.00",
  "currencyCode": "CNY",
  "status": "pending",
  "createdAt": "2024-01-01T00:00:00Z",
  "lineItems": [
    {
      "id": "item-1",
      "title": "产品名称",
      "quantity": 1,
      "variant": {
        "id": "variant-1",
        "title": "默认",
        "price": "99.00"
      },
      "product": {
        "id": "product-1",
        "handle": "product-handle",
        "title": "产品名称"
      }
    }
  ]
}
```

#### GET /api/orders/:orderId
获取订单详情

**响应格式:** 订单对象

#### GET /api/orders
获取订单列表

**响应格式:** 订单数组

## 数据转换

后端 API 返回的数据会自动通过 `lib/api/transformers.ts` 转换为前端格式。转换器支持以下字段映射：

- `id` / `_id` → `id`
- `handle` / `slug` → `handle`
- `name` / `title` → `title`
- `price` / `amount` → `price.amount`
- `currency` / `currencyCode` → `price.currencyCode`
- `inStock` / `availableForSale` → `availableForSale`

## 使用示例

### 服务端组件

```typescript
import { commerce } from "lib/commerce";

export default async function ProductsPage() {
  const products = await commerce.getProducts({ query: "search" });
  return <div>{/* 渲染产品 */}</div>;
}
```

### Server Actions

```typescript
"use server";

import { addToCart } from "lib/commerce";

export async function addItemToCart(variantId: string) {
  await addToCart([{ merchandiseId: variantId, quantity: 1 }]);
}
```

### 客户端组件

```typescript
"use client";

import { useCart } from "lib/api/hooks";

export function CartButton() {
  const { cart, addToCart, loading } = useCart();

  const handleAdd = async () => {
    await addToCart([{ merchandiseId: "variant-1", quantity: 1 }]);
  };

  return <button onClick={handleAdd}>添加到购物车</button>;
}
```

## 错误处理

API 客户端会自动处理错误，并抛出包含错误信息的异常：

```typescript
try {
  const product = await apiClient.get("/products/123");
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

## 环境变量配置

在 `.env.local` 中配置：

```bash
CUSTOM_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_CUSTOM_API_BASE_URL=http://localhost:3001/api  # 客户端使用
```

## 认证 Token 管理

- 登录/注册成功后，token 会自动存储在 HTTP-only cookie 中
- 所有 API 请求会自动携带 `Authorization: Bearer <token>` 头
- 登出时会清除 token

## 购物车 ID 管理

- 创建购物车后，cartId 会存储在 cookie 中
- 所有购物车操作会自动使用存储的 cartId
- Cookie 有效期为 30 天
