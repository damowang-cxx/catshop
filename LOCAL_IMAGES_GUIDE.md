# 本地图资源使用指南

最后更新：2026-03-09

## 1. 目录规范

本地图资源统一放置在：

```text
public/images/products/
```

建议按商品语义命名，例如：

- `teddy-bear-classic.jpg`
- `teddy-bear-classic-2.jpg`
- `bunny-plush.jpg`

## 2. 图片要求

- 格式：`jpg` / `png` / `webp`
- 推荐尺寸：`800x800` 及以上（正方形优先）
- 建议大小：单图小于 `500KB`

## 3. 在数据中引用

商品数据使用站点绝对路径或相对路径：

```json
{
  "images": [
    { "url": "/images/products/teddy-bear-classic.jpg", "altText": "Teddy Bear" }
  ]
}
```

## 4. 与 Next/Image 配合

- 本地图不需要额外配置域名白名单
- 如果使用外链图，请在 `next.config.ts` 补充远程域名配置

## 5. 常见问题

- 图片不显示：先确认文件实际位于 `public/images/products/`
- 路径 404：检查文件名大小写与后缀是否一致
- 首屏慢：压缩图片并优先使用 webp
