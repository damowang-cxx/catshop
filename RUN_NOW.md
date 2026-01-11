# 立即运行项目

## ✅ 项目已准备就绪，可以直接运行！

### 快速启动（3 步）

#### 1. 安装依赖（如果还没安装）
```bash
pnpm install
```

#### 2. 启动开发服务器
```bash
pnpm dev
```

#### 3. 打开浏览器
访问: **http://localhost:3000**

## 📋 当前状态

### ✅ 可以正常使用的功能
- ✅ 首页展示
- ✅ 产品列表页面 (`/search`)
- ✅ 产品详情页面 (`/product/[handle]`)
- ✅ 搜索功能
- ✅ 产品推荐
- ✅ 导航菜单
- ✅ 响应式布局

### ⚠️ 已禁用的功能（Local Provider 默认）
- ❌ 购物车功能（点击购物车按钮会报错，这是正常的）
- ❌ 用户登录/注册
- ❌ 订单功能

**注意**: 购物车按钮仍然会显示，但点击时会报错。这是预期的行为，因为 Local Provider 使用静态数据，不支持购物车功能。

## 🎯 查看页面效果

即使购物车功能禁用，你仍然可以：

1. **浏览首页** - 查看产品网格和轮播
2. **搜索产品** - 使用顶部搜索框
3. **查看产品详情** - 点击产品进入详情页
4. **浏览分类** - 查看不同分类的产品

## 🔧 配置说明

项目使用 **Local Provider**（默认），无需配置后端即可运行。

### 当前配置
- Provider: `local`（使用静态数据）
- 功能开关: 在 `commerce.config.json` 中配置
- 环境变量: 无需配置（使用默认值）

### 如需启用完整功能

切换到 Custom Provider 并配置后端 API：

1. 创建 `.env.local` 文件：
```bash
COMMERCE_PROVIDER=custom
CUSTOM_API_BASE_URL=http://localhost:3001/api
SITE_NAME=Next.js Commerce
```

2. 确保后端 API 正在运行（参考 `API_INTEGRATION.md`）

## 🐛 常见问题

### 问题 1: 端口被占用
**解决**: Next.js 会自动使用下一个可用端口（如 3001），查看终端输出确认实际端口。

### 问题 2: 购物车报错
**原因**: Local Provider 禁用了购物车功能
**解决**: 这是正常的，要启用购物车需要切换到 Custom Provider

### 问题 3: 页面空白或错误
**解决步骤**:
1. 检查终端是否有错误信息
2. 确认 `commerce.config.json` 文件存在
3. 清除 `.next` 目录并重新启动：
   ```bash
   rm -rf .next
   pnpm dev
   ```

### 问题 4: 类型错误
**解决**: 
```bash
pnpm install
```

## 📁 项目结构

```
commerce/
├── app/                    # Next.js 页面
├── components/             # React 组件
├── lib/                    # 工具函数和 Provider
│   ├── providers/         # Provider 实现
│   │   ├── local/        # 本地 Provider（当前使用）
│   │   ├── custom/       # 自定义 Provider
│   │   └── shopify/      # Shopify Provider
│   └── api/              # API 客户端
├── packages/commerce/     # Commerce 类型定义
└── commerce.config.json   # 功能开关配置
```

## 🚀 下一步

1. **查看页面效果** - 运行项目，浏览各个页面
2. **了解代码结构** - 查看组件和 Provider 实现
3. **配置后端** - 如需完整功能，参考 `API_INTEGRATION.md`
4. **自定义功能** - 修改 `commerce.config.json` 调整功能开关

## 📚 相关文档

- `QUICK_RUN.md` - 详细运行指南
- `API_INTEGRATION.md` - API 接口规范
- `FEATURES_GUIDE.md` - 功能开关配置
- `PROVIDER_SETUP.md` - Provider 配置说明

---

**现在就可以运行了！** 🎉

```bash
pnpm dev
```

然后打开 http://localhost:3000 查看效果。
