# 功能开关配置指南

本项目支持通过 `commerce.config.json` 配置文件来管理功能开关，根据 Provider 的支持情况自动显示或隐藏相应的 UI 组件。

## 配置文件

创建 `commerce.config.json` 文件在项目根目录：

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
  },
  "provider": {
    "name": "custom",
    "config": {
      "apiBaseUrl": "${CUSTOM_API_BASE_URL}"
    }
  }
}
```

## 功能列表

### cart (购物车)
- **默认**: 根据 Provider 声明
- **说明**: 控制购物车功能的显示
- **影响组件**: 购物车图标、购物车模态框、添加到购物车按钮

### customerAuth (用户认证)
- **默认**: 根据 Provider 声明
- **说明**: 控制用户登录/注册功能的显示
- **影响组件**: 登录/注册按钮、用户菜单

### wishlist (愿望单)
- **默认**: 根据 Provider 声明
- **说明**: 控制收藏/愿望单功能的显示
- **影响组件**: 收藏按钮、愿望单页面

### orders (订单)
- **默认**: 根据 Provider 声明
- **说明**: 控制订单功能的显示
- **影响组件**: 订单列表、订单详情

### search (搜索)
- **默认**: 根据 Provider 声明
- **说明**: 控制搜索功能的显示
- **影响组件**: 搜索框、搜索页面

### productRecommendations (产品推荐)
- **默认**: 根据 Provider 声明
- **说明**: 控制产品推荐功能的显示
- **影响组件**: 相关产品推荐

### collections (分类)
- **默认**: 根据 Provider 声明
- **说明**: 控制分类功能的显示
- **影响组件**: 分类菜单、分类页面

### menus (菜单)
- **默认**: 根据 Provider 声明
- **说明**: 控制菜单功能的显示
- **影响组件**: 导航菜单

### pages (页面)
- **默认**: 根据 Provider 声明
- **说明**: 控制页面功能的显示
- **影响组件**: 静态页面

## Provider 功能声明

每个 Provider 都会声明它支持的功能：

### Local Provider
```typescript
features = {
  cart: false,              // 禁用
  customerAuth: false,       // 禁用
  wishlist: false,          // 禁用
  orders: false,            // 禁用
  search: true,             // 启用
  productRecommendations: true,
  collections: true,
  menus: false,
  pages: false,
}
```

### Custom Provider
```typescript
features = {
  cart: true,               // 全部启用
  customerAuth: true,
  wishlist: true,
  orders: true,
  search: true,
  productRecommendations: true,
  collections: true,
  menus: true,
  pages: true,
}
```

### Shopify Provider
```typescript
features = {
  cart: true,
  customerAuth: false,      // Shopify Storefront API 不支持
  wishlist: false,
  orders: false,            // 通过 checkoutUrl 跳转
  search: true,
  productRecommendations: true,
  collections: true,
  menus: true,
  pages: true,
}
```

## 配置优先级

1. **commerce.config.json** 中的 `features` 配置（最高优先级）
2. Provider 声明的 `features`
3. 默认配置（全部禁用）

如果 `commerce.config.json` 中设置了功能开关，会覆盖 Provider 的声明。

## 在代码中使用

### 服务端组件

```typescript
import { getCommerceFeatures } from "lib/commerce";

export default async function Page() {
  const features = getCommerceFeatures();
  
  if (features.cart) {
    // 显示购物车相关 UI
  }
}
```

### 客户端组件

```typescript
"use client";

import { FeatureGate } from "components/features/feature-gate";
import { useFeature } from "lib/hooks/use-features";

export function MyComponent() {
  const hasCart = useFeature("cart");
  
  return (
    <>
      <FeatureGate feature="cart">
        <CartButton />
      </FeatureGate>
      
      {hasCart && <CartIcon />}
    </>
  );
}
```

## 启用完整功能

### 使用 Custom Provider

在 `commerce.config.json` 中：

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

### 使用 Local Provider（仅开发测试）

Local Provider 默认禁用购物车和用户认证。如果需要启用，可以在配置文件中覆盖：

```json
{
  "features": {
    "cart": true,
    "customerAuth": true,
    "wishlist": true,
    "orders": true
  }
}
```

**注意**: 即使启用了这些功能，Local Provider 的实现仍然会抛出错误，因为它是用静态数据模拟的。

## 环境变量支持

配置文件中可以使用环境变量：

```json
{
  "provider": {
    "name": "custom",
    "config": {
      "apiBaseUrl": "${CUSTOM_API_BASE_URL}"
    }
  }
}
```

`${CUSTOM_API_BASE_URL}` 会被替换为环境变量 `CUSTOM_API_BASE_URL` 的值。

## 示例：启用购物车和用户认证

```json
{
  "features": {
    "cart": true,
    "customerAuth": true,
    "wishlist": false,
    "orders": true,
    "search": true,
    "productRecommendations": true,
    "collections": true,
    "menus": true,
    "pages": true
  }
}
```

这样配置后，购物车和用户认证相关的 UI 组件会自动显示，而愿望单功能会被隐藏。
