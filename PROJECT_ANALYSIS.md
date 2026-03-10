# 项目功能分析与模块梳理

最后更新：2026-03-09

## 1. 项目定位

CatShop 是一个基于 Next.js App Router 的电商项目，包含：

- 前台商城：多语言、商品展示、用户登录注册、购物流程
- 后台管理：管理员登录、商品/分类/订单管理、仪表盘能力

系统通过 `Commerce Provider` 抽象支持多后端来源（`local` / `custom` / `shopify`）。

## 2. 技术栈与工程结构

- 框架：Next.js 15 + React 19 + TypeScript
- UI：Tailwind CSS 4 + Headless UI + Heroicons
- 包管理：pnpm
- 关键目录：
  - `app/`：页面路由与 API Route
  - `components/`：前台/后台 UI 组件
  - `lib/`：Provider、API 客户端、通用工具
  - `packages/commerce/`：领域类型与 Provider 接口
  - `messages/`：国际化文案

## 3. 核心功能模块

### 3.1 前台商城

- 多语言站点（中/英等）与语言路由
- 商品列表、详情、搜索、推荐
- 购物车与结算流程（由 Provider 能力决定）
- 用户登录、注册、退出、当前用户信息

### 3.2 后台管理

- 管理员鉴权与后台布局
- 商品、分类、订单列表与详情
- 表单页面（新建/编辑）
- 上传、分页、批量操作等能力

## 4. Provider 机制

### 4.1 Local Provider

- 适合本地演示与开发调试
- 以前台展示能力为主，不依赖后端

### 4.2 Custom Provider

- 对接自研后端 REST API
- 通过统一 API 客户端与数据转换层适配前端模型

### 4.3 Shopify Provider

- 对接 Shopify Storefront API
- 支持商品与集合相关能力，并支持 webhook revalidate

## 5. API 分层现状

- `lib/api/server-client.ts`：服务端专用 API 客户端（`server-only`）
- `lib/api/client.ts`：浏览器专用 API 客户端
- `lib/api/admin-client.ts`：后台管理接口封装
- `lib/api/transformers.ts`：后端数据 -> 前端模型转换

这套分层避免了 `next/headers` 泄露到客户端 bundle。

### 5.1 前台 / 后台 / 代理 / 真后端 的关系

项目里同时存在 4 层，但它们不是一回事：

- 前台：给普通用户使用的商城页面，如首页、搜索、商品详情、登录注册
- 后台：给管理员使用的管理页面，如 `/admin/products`、`/admin/orders`
- 代理：Next.js 内部的 API Route，如 `app/api/auth/*`、`app/api/admin/*`
- 真后端：仓库外部的自研服务，默认地址为 `CUSTOM_API_BASE_URL`

可以把它理解成下面这张图：

```text
浏览器
  |
  +-- 前台页面: app/[locale]/*, app/search/*, app/product/*
  |
  +-- 后台页面: app/admin/*
          |
          v
      Next.js 应用
          |
          +-- 页面层 / 组件层
          |     |
          |     +-- lib/commerce.ts
          |     +-- lib/api/client.ts
          |     +-- lib/api/admin-client.ts
          |
          +-- 代理层: app/api/*
                |
                +-- /api/auth/*
                +-- /api/admin/*
                +-- /api/revalidate
                      |
                      v
               自研后端 API
               http://localhost:3001/api
```

### 5.2 两条最典型的调用链

#### A. 前台商品列表

```text
浏览器打开前台页面
-> app/[locale]/page.tsx
-> lib/commerce.ts
-> lib/providers/custom/index.ts
-> lib/api/server-client.ts
-> 真后端: GET /products
```

这条链路通常不经过 `app/api/*`，因为页面本身是服务端组件，可以直接通过 Provider 和 server client 拉后端数据。

#### B. 后台商品管理

后台有两种取数方式，需要分开看：

```text
管理员打开 /admin/products
-> app/admin/products/page.tsx
-> lib/api/admin-client.ts
-> 真后端: GET /products
```

这是后台列表页在服务端渲染时的直连模式。

```text
管理员在后台点击保存 / 批量操作 / 上传图片
-> 浏览器中的客户端组件
-> /api/admin/products or /api/admin/upload
-> app/api/admin/*
-> 真后端对应接口
```

这是后台交互动作常见的代理模式。之所以走代理，是为了：

- 统一处理 `admin_token` cookie
- 隔离浏览器与真实后端地址
- 在前端仓库内补充参数校验、错误包装和上传转发

### 5.3 为什么“后台”不等于“后端”

- `app/admin/*` 是后台页面，本质仍然是前端界面
- `app/api/*` 是前端应用内部的 BFF/代理层，不是最终业务服务
- 真正的后端是 `CUSTOM_API_BASE_URL` 指向的独立服务，负责数据库、鉴权、订单、上传等业务

因此：

- 后台 = Admin UI
- 代理 = Next.js Route Handler
- 后端 = 自研 API 服务

### 5.4 联调时应该关注哪一层

如果你要做前后端联调，重点不是 `app/admin/products/page.tsx` 是否存在，而是下面这几层是否都通：

```text
前台/后台页面
-> 是否能拿到 cookie / 参数
-> 是否请求到了 app/api/* 或 lib/api/*
-> 是否最终打到了 CUSTOM_API_BASE_URL
-> 后端是否按约定返回数据
```

只要最后一步没通，前台和后台页面即使都在，也只是“界面在”，不是“后端已经接通”。

## 6. UI 与主题更新摘要

项目已统一为浅色暖色系设计（卡其/米色方向），重点包括：

- 全站色板与边框体系统一
- 首页与导航视觉更新
- 商品展示卡片和交互样式调整
- 图片资源策略统一（见 `LOCAL_IMAGES_GUIDE.md`）

## 7. 当前工程状态

- 已修复构建阻塞项（server/client 依赖混用、缺失导出、revalidate 返回归一化）
- 文档已收敛到主题化核心集合，减少重复维护成本

## 8. 文档索引

- 启动与环境：`QUICKSTART.md`
- API 对接：`API_INTEGRATION.md`
- 功能开关：`FEATURES_GUIDE.md`
- 图片规范：`LOCAL_IMAGES_GUIDE.md`
- 项目入口：`README.md`
