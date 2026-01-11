# 快速运行指南

## 前置要求

- Node.js 18+ 
- pnpm (推荐) 或 npm/yarn

## 快速启动步骤

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量（可选）

创建 `.env.local` 文件（如果不存在会自动使用默认配置）：

```bash
# 使用本地 Provider（默认，无需后端）
COMMERCE_PROVIDER=local

# 站点名称
SITE_NAME=Next.js Commerce
```

**注意**: 如果使用 `local` Provider，不需要配置后端 API，可以直接运行查看页面效果。

### 3. 启动开发服务器

```bash
pnpm dev
```

### 4. 访问网站

打开浏览器访问: http://localhost:3000

## 当前功能状态

### Local Provider（默认）
- ✅ 产品列表和详情页面可以查看
- ✅ 搜索功能可用
- ✅ 产品推荐功能可用
- ❌ 购物车功能已禁用（会显示错误）
- ❌ 用户登录/注册已禁用
- ❌ 订单功能已禁用

### 查看效果

即使购物车功能禁用，你仍然可以：
1. 浏览产品列表页面 (`/search`)
2. 查看产品详情页面 (`/product/[handle]`)
3. 查看首页 (`/`)
4. 使用搜索功能

购物车按钮会显示，但点击时会报错（这是正常的，因为 Local Provider 禁用了购物车功能）。

## 切换到其他 Provider

### 使用 Custom Provider（需要后端 API）

```bash
# .env.local
COMMERCE_PROVIDER=custom
CUSTOM_API_BASE_URL=http://localhost:3001/api
```

### 使用 Shopify Provider

```bash
# .env.local
COMMERCE_PROVIDER=shopify
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
```

## 常见问题

### 1. 端口被占用

如果 3000 端口被占用，Next.js 会自动使用下一个可用端口（如 3001）。

### 2. 类型错误

如果遇到 TypeScript 类型错误，运行：

```bash
pnpm install
```

确保所有依赖都已安装。

### 3. 页面显示错误

- 检查控制台是否有错误信息
- 确认 `commerce.config.json` 文件存在
- 确认环境变量配置正确

### 4. 购物车功能报错

如果使用 Local Provider，购物车功能会报错，这是正常的。要启用购物车功能，需要：
- 切换到 Custom Provider 并配置后端 API
- 或者在 `commerce.config.json` 中启用购物车功能（但 Local Provider 的实现会抛出错误）

## 项目结构

- `app/` - Next.js App Router 页面
- `components/` - React 组件
- `lib/` - 工具函数和 Provider 实现
- `packages/commerce/` - Commerce 类型定义
- `commerce.config.json` - 功能开关配置

## 下一步

1. 查看页面效果，了解 UI 结构
2. 如果需要完整功能，配置 Custom Provider 和后端 API
3. 参考 `API_INTEGRATION.md` 了解后端 API 规范
