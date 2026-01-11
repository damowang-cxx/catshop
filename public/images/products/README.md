# 产品图片目录

请将产品图片放在此目录下。

## 图片命名规范

建议使用以下命名规范：
- `teddy-bear-classic.jpg` - 经典泰迪熊
- `bunny-plush.jpg` - 可爱兔子玩偶
- `panda-plush.jpg` - 大熊猫玩偶
- `unicorn-plush.jpg` - 梦幻独角兽
- `dinosaur-plush.jpg` - 小恐龙玩偶
- `elephant-plush.jpg` - 小象玩偶

## 图片要求

- 格式：JPG、PNG、WebP
- 尺寸：建议 800x800 像素或更高
- 文件大小：建议小于 500KB

## 使用方法

1. 将图片文件放在此目录下
2. 在 `lib/providers/local/index.ts` 中更新图片路径
3. 图片路径格式：`/images/products/图片文件名`

## 示例

如果图片文件名为 `teddy-bear-classic.jpg`，则在代码中使用：
```typescript
url: "/images/products/teddy-bear-classic.jpg"
```
