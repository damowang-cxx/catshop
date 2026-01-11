# 本地图片使用指南

## 概述

项目已配置为使用本地图片，所有产品图片应放在 `public/images/products/` 目录下。

## 目录结构

```
public/
  images/
    products/
      teddy-bear-classic.jpg      # 经典泰迪熊
      teddy-bear-classic-2.jpg    # 经典泰迪熊 - 侧面
      bunny-plush.jpg             # 可爱兔子玩偶
      panda-plush.jpg             # 大熊猫玩偶
      unicorn-plush.jpg           # 梦幻独角兽
      dinosaur-plush.jpg          # 小恐龙玩偶
      elephant-plush.jpg          # 小象玩偶
```

## 如何添加图片

### 1. 准备图片文件

- **格式**: JPG、PNG、WebP
- **尺寸**: 建议 800x800 像素或更高（正方形）
- **文件大小**: 建议小于 500KB（可使用图片压缩工具优化）

### 2. 放置图片

将图片文件复制到 `public/images/products/` 目录下，使用对应的文件名：

- `teddy-bear-classic.jpg` - 经典泰迪熊主图
- `teddy-bear-classic-2.jpg` - 经典泰迪熊侧面图（可选）
- `bunny-plush.jpg` - 可爱兔子玩偶
- `panda-plush.jpg` - 大熊猫玩偶
- `unicorn-plush.jpg` - 梦幻独角兽
- `dinosaur-plush.jpg` - 小恐龙玩偶
- `elephant-plush.jpg` - 小象玩偶

### 3. 图片路径说明

在代码中，图片路径使用相对路径：
- 本地路径格式：`/images/products/文件名.jpg`
- Next.js 会自动从 `public` 目录提供静态文件

### 4. 添加新产品的图片

如果要添加新产品：

1. 在 `public/images/products/` 目录下添加图片文件
2. 在 `lib/providers/local/index.ts` 中添加产品数据
3. 使用 `/images/products/你的文件名.jpg` 作为图片路径

示例：
```typescript
featuredImage: {
  url: "/images/products/your-product-name.jpg",
  altText: "产品名称",
  width: 800,
  height: 800,
},
```

## 图片优化建议

### 使用工具压缩图片

推荐工具：
- **在线工具**: TinyPNG (https://tinypng.com/)
- **命令行**: `sharp` 或 `imagemin`
- **桌面软件**: ImageOptim, Squoosh

### 图片格式选择

- **JPG**: 适合照片类图片，文件较小
- **PNG**: 适合需要透明背景的图片
- **WebP**: 现代格式，文件最小，但需要浏览器支持

### 多尺寸图片（可选）

如果需要响应式图片，可以创建多个尺寸：
- `product-name-800.jpg` - 800x800
- `product-name-1200.jpg` - 1200x1200
- `product-name-1600.jpg` - 1600x1600

然后在代码中使用 Next.js 的 `srcSet` 功能。

## 注意事项

1. **文件命名**: 使用小写字母和连字符，避免空格和特殊字符
2. **文件大小**: 大图片会影响页面加载速度，建议压缩
3. **图片质量**: 平衡文件大小和图片质量
4. **备份**: 建议保留原始图片文件的备份

## 故障排除

### 图片不显示

1. 检查文件路径是否正确
2. 确认文件在 `public/images/products/` 目录下
3. 检查文件名是否匹配（区分大小写）
4. 确认文件格式是否支持（JPG、PNG、WebP）

### 图片加载慢

1. 压缩图片文件大小
2. 使用 WebP 格式
3. 考虑使用 CDN（如果部署到生产环境）

## 下一步

1. 将你的产品图片放到 `public/images/products/` 目录
2. 确保文件名与代码中的路径匹配
3. 刷新页面查看效果
