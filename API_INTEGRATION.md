# API 对接说明

最后更新：2026-03-09

## 1. 架构概览

项目通过 `Commerce Provider` 抽象对接后端能力，主要路径如下：

- 前台/后台页面 -> `lib/commerce.ts` 或 `lib/api/*`
- Provider 层 -> `lib/providers/*`
- API Route 代理层 -> `app/api/*`
- 自研后端或 Shopify -> 最终数据源

当前仓库默认运行在 `custom` Provider 模式，目标后端地址为 `http://localhost:3001/api`。
如果你同时启动了相邻目录的 `catshop-api`，前端会直接进入联调模式。

## 2. API 客户端分层

### 2.1 服务端客户端（Server-only）

文件：`lib/api/server-client.ts`

- 导出 `apiClient`
- 使用 `next/headers` 读取 `auth_token`
- 仅用于服务端上下文（Provider、Route Handler、Server Action）

### 2.2 客户端客户端（Browser-only）

文件：`lib/api/client.ts`

- 导出 `clientApi`
- 从浏览器 `document.cookie` 读取 token
- 用于 `use client` 组件与 hooks

### 2.3 管理端客户端

文件：`lib/api/admin-client.ts`

- 面向后台管理接口
- 包含统一错误处理、token 注入与请求封装

## 3. 数据转换层

文件：`lib/api/transformers.ts`

用于将后端字段适配到前端统一模型，例如：

- `id / _id` -> `id`
- `slug` -> `handle`
- 金额字段 -> `{ amount, currencyCode }`

## 4. 通用响应约定

- 常规响应：`{ data: T, message?: string }`
- 分页响应：`{ items: T[]; total: number; page: number; pageSize: number }`
- 批量操作：`{ action, ids, status? }`
- 上传响应：`{ url: string }`

## 5. 鉴权与 Cookie

- 用户态 token：`auth_token`
- 管理态 token：`admin_token`
- API Route 代理会将 token 转发至后端，前端不直接持久化敏感凭据

## 6. Revalidate 流程

- 入口：`POST /api/revalidate?secret=...`
- 转发到 `lib/commerce.ts` 的 `revalidate`
- 若 provider 返回非 `Response`，Route 层统一包装为 `NextResponse.json(...)`

## 7. 新增接口的建议流程

1. 在 `app/api/*` 新建代理路由（鉴权、参数校验、错误透传）
2. 在 `lib/api/*` 增加对应客户端方法
3. 在 `lib/providers/custom` 或后台模块中接入
4. 必要时补充 `transformers` 映射
5. 加入页面或 hooks 并补全错误反馈
