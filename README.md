# CatShop

最后更新：2026-03-09

CatShop 是一个基于 Next.js App Router 的电商项目，包含前台商城与后台管理两套能力。

## 快速开始

```bash
pnpm install
```

推荐从 `shop` 根目录统一启动：

```bash
cd ..
pnpm install
pnpm dev
```

默认使用 `custom` Provider，并连接 `http://127.0.0.1:3001/api` 的自研后端。
统一启动后，前端运行在 `http://localhost:3000`，后端运行在 `http://127.0.0.1:3001`。

## 文档导航

- [QUICKSTART.md](./QUICKSTART.md)：环境配置、Provider 切换、启动与构建
- [PROJECT_ANALYSIS.md](./PROJECT_ANALYSIS.md)：项目结构、功能模块与实现现状
- [API_INTEGRATION.md](./API_INTEGRATION.md)：前后端 API 对接方式与数据契约
- [FEATURES_GUIDE.md](./FEATURES_GUIDE.md)：`commerce.config.json` 功能开关说明
- [LOCAL_IMAGES_GUIDE.md](./LOCAL_IMAGES_GUIDE.md)：本地图资源使用规范
- [license.md](./license.md)：许可证

## 技术栈

- Next.js 15（App Router）
- React 19 + TypeScript
- Tailwind CSS 4
- Provider 架构：`local` / `custom` / `shopify`

## 常用命令

```bash
pnpm dev      # 开发模式
pnpm build    # 生产构建
pnpm start    # 启动生产服务
pnpm test     # 当前为 prettier 检查
```

## 说明

- 后台管理路由位于 `/admin/*`。
- 也可以在 `shop` 根目录运行 `pnpm dev:web` 或 `pnpm dev:api` 单独启动某一侧。
- 当前仓库默认按“前端 + 自研后端”联调模式运行。
- 若需要调整后端地址或切回其他 Provider，请先修改 `.env.local`，详见 [QUICKSTART.md](./QUICKSTART.md)。

