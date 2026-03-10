# 功能开关指南

最后更新：2026-03-09

项目支持通过 `commerce.config.json` 配置功能开关，结合 Provider 声明能力决定最终可用功能。

## 1. 配置示例

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

## 2. 合并规则

- Provider 自身声明一份默认能力集
- `commerce.config.json.features` 会覆盖默认值
- 运行时通过 `getCommerceFeatures()` 输出最终结果

## 3. 主要开关说明

- `cart`：购物车入口、加入购物车、购物车弹层
- `customerAuth`：登录、注册、用户菜单
- `orders`：下单与订单相关页面
- `search`：搜索框与检索页
- `productRecommendations`：商品推荐区块
- `collections`：分类导航与分类页
- `menus`：菜单数据加载
- `pages`：内容页加载
- `wishlist`：收藏相关能力（如有实现）

## 4. 前端使用方式

- 客户端：`lib/hooks/use-features.ts` 中 `useFeature(...)`
- 服务端：`lib/commerce.ts` 中 `getCommerceFeatures()`
- 组件层建议使用 Feature Gate 控制渲染，避免展示不可用交互

## 5. 排查建议

- 开关不生效时先检查 `COMMERCE_PROVIDER`
- 再确认 `commerce.config.json` 是否在根目录且 JSON 格式合法
- 最后检查对应 Provider 是否实现了相关能力
