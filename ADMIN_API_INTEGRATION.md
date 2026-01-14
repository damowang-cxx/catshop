# 后台管理 API 对接文档

## 📋 概述

本文档说明后台管理系统如何对接后端 API。

## 🔧 已完成的对接工作

### 1. API 客户端

创建了专门的后台管理 API 客户端：`lib/api/admin-client.ts`

- **服务端客户端** (`adminApiClient`) - 用于服务端组件和 Server Actions
- **客户端客户端** (`clientAdminApi`) - 用于客户端组件
- 自动处理认证 token (`admin_token`)
- 统一的错误处理

### 2. API 路由

已创建以下 API 路由，对接后端 API：

#### 认证相关
- `POST /api/admin/login` → 后端 `POST /api/admin/auth/login`
- `GET /api/admin/me` → 后端 `GET /api/admin/auth/me`

#### 产品管理
- `GET /api/admin/products` → 后端 `GET /api/admin/products`
- `POST /api/admin/products` → 后端 `POST /api/admin/products`
- `GET /api/admin/products/:id` → 后端 `GET /api/admin/products/:id`
- `PUT /api/admin/products/:id` → 后端 `PUT /api/admin/products/:id`
- `DELETE /api/admin/products/:id` → 后端 `DELETE /api/admin/products/:id`

#### 订单管理
- `GET /api/admin/orders` → 后端 `GET /api/admin/orders`
- `GET /api/admin/orders/:id` → 后端 `GET /api/admin/orders/:id`
- `PATCH /api/admin/orders/:id/status` → 后端 `PATCH /api/admin/orders/:id/status`

#### 分类管理
- `GET /api/admin/collections` → 后端 `GET /api/admin/collections`
- `POST /api/admin/collections` → 后端 `POST /api/admin/collections`
- `GET /api/admin/collections/:id` → 后端 `GET /api/admin/collections/:id`
- `PUT /api/admin/collections/:id` → 后端 `PUT /api/admin/collections/:id`
- `DELETE /api/admin/collections/:id` → 后端 `DELETE /api/admin/collections/:id`

#### 统计数据
- `GET /api/admin/stats` → 后端 `GET /api/admin/stats`

## 🔌 后端 API 规范

### 基础 URL

后台管理 API 的基础 URL 通过以下优先级确定：

1. `ADMIN_API_BASE_URL` 环境变量
2. `CUSTOM_API_BASE_URL` 环境变量 + `/admin`
3. 默认：`http://localhost:3001/api/admin`

### 认证

所有后台管理 API 请求需要在请求头中包含认证 token：

```
Authorization: Bearer <admin_token>
```

Token 通过登录接口获取，存储在 HTTP-only Cookie 中。

### API 接口规范

#### 1. 管理员登录

**POST** `/api/admin/auth/login`

**请求体：**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**响应：**
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "1",
    "email": "admin@example.com",
    "name": "管理员",
    "role": "admin"
  }
}
```

#### 2. 获取当前用户

**GET** `/api/admin/auth/me`

**响应：**
```json
{
  "id": "1",
  "email": "admin@example.com",
  "name": "管理员",
  "role": "admin"
}
```

#### 3. 获取产品列表

**GET** `/api/admin/products?page=1&limit=20&search=关键词`

**响应：**
```json
{
  "data": [
    {
      "id": "1",
      "title": "产品名称",
      "handle": "product-handle",
      "price": "99.00",
      "availableForSale": true,
      "featuredImage": {
        "url": "https://example.com/image.jpg"
      }
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### 4. 创建产品

**POST** `/api/admin/products`

**请求体：**
```json
{
  "title": "产品名称",
  "handle": "product-handle",
  "description": "产品描述",
  "price": "99.00",
  "availableForSale": true
}
```

#### 5. 更新产品

**PUT** `/api/admin/products/:id`

**请求体：** 同创建产品

#### 6. 删除产品

**DELETE** `/api/admin/products/:id`

**响应：**
```json
{
  "success": true
}
```

#### 7. 获取订单列表

**GET** `/api/admin/orders?page=1&limit=20&status=pending`

**响应：**
```json
{
  "data": [
    {
      "id": "1",
      "orderNumber": "ORD-2024-001",
      "totalPrice": "198.00",
      "status": "pending",
      "customerName": "张三",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 50
}
```

#### 8. 更新订单状态

**PATCH** `/api/admin/orders/:id/status`

**请求体：**
```json
{
  "status": "processing" | "shipped" | "delivered" | "cancelled"
}
```

#### 9. 获取分类列表

**GET** `/api/admin/collections`

**响应：**
```json
[
  {
    "id": "1",
    "handle": "collection-handle",
    "title": "分类名称",
    "description": "分类描述"
  }
]
```

#### 10. 获取统计数据

**GET** `/api/admin/stats`

**响应：**
```json
{
  "totalProducts": 100,
  "totalOrders": 50,
  "totalRevenue": 50000.00,
  "totalUsers": 200,
  "recentOrders": [...],
  "popularProducts": [...]
}
```

## 🛠️ 环境变量配置

在 `.env.local` 中配置：

```bash
# 后台 API 地址（可选，优先使用）
ADMIN_API_BASE_URL=http://localhost:3001/api/admin

# 或使用通用 API 地址（会自动添加 /admin）
CUSTOM_API_BASE_URL=http://localhost:3001/api

# 客户端使用的 API 地址（可选）
NEXT_PUBLIC_ADMIN_API_BASE_URL=http://localhost:3001/api/admin
NEXT_PUBLIC_CUSTOM_API_BASE_URL=http://localhost:3001/api
```

## 📝 使用示例

### 服务端组件

```typescript
// app/admin/products/page.tsx
export default async function ProductsPage() {
  const response = await fetch("/api/admin/products", {
    cache: "no-store",
  });
  const data = await response.json();
  const products = data.data || data;
  
  return <div>{/* 渲染产品列表 */}</div>;
}
```

### 客户端组件

```typescript
// components/admin/product-list.tsx
"use client";

import { useEffect, useState } from "react";

export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || data);
      });
  }, []);

  return <div>{/* 渲染产品列表 */}</div>;
}
```

### 直接使用 API 客户端

```typescript
// Server Action 或服务端组件
import { adminApiClient } from "lib/api/admin-client";

const products = await adminApiClient.get("/products");
```

## 🔄 开发模式降级

如果后端 API 不可用，系统会自动降级到开发模式：

- **登录**：使用临时测试账号 (`admin@example.com` / `admin123`)
- **数据获取**：返回空数组或默认值
- **控制台警告**：显示后端 API 不可用的警告信息

这样可以确保前端开发不受后端影响。

## ✅ 待完善功能

- [ ] 产品创建/编辑表单页面
- [ ] 图片上传功能
- [ ] 订单详情页面
- [ ] 数据验证和错误处理优化
- [ ] 加载状态和骨架屏
- [ ] 分页组件
- [ ] 搜索和筛选功能

## 🐛 故障排查

### 1. API 调用失败

检查：
- 后端服务是否运行
- `ADMIN_API_BASE_URL` 或 `CUSTOM_API_BASE_URL` 配置是否正确
- 网络连接是否正常
- CORS 设置是否允许跨域

### 2. 认证失败

检查：
- `admin_token` Cookie 是否设置
- Token 是否过期
- 后端是否验证 token

### 3. 数据格式不匹配

检查：
- 后端返回的数据格式是否符合规范
- API 路由是否正确处理了不同的响应格式

---

如有问题，请查看代码注释或提交 Issue。
