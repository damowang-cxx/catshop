// 本地 Provider - 使用静态文件模拟数据
// 禁用购物车、登录等功能

import type {
  CommerceProvider,
  Product,
  Collection,
  Cart,
  Menu,
  Page,
  Order,
  User,
  GetProductsParams,
  GetCollectionProductsParams,
  AddToCartParams,
  UpdateCartParams,
  LoginParams,
  RegisterParams,
  CheckoutParams,
  CommerceFeatures,
} from "@commerce/types";
import { defaultFeatures } from "@commerce/features";

// 静态产品数据 - 玩偶相关
const mockProducts: Product[] = [
  {
    id: "1",
    handle: "teddy-bear-classic",
    availableForSale: true,
    title: "经典泰迪熊",
    description: "柔软舒适的经典泰迪熊，采用优质毛绒面料制作，是完美的陪伴玩偶。",
    descriptionHtml: "<p>柔软舒适的经典泰迪熊，采用优质毛绒面料制作，是完美的陪伴玩偶。适合所有年龄段，是送礼的绝佳选择。</p>",
    options: [
      {
        id: "size",
        name: "尺寸",
        values: ["小号", "中号", "大号"],
      },
    ],
    priceRange: {
      maxVariantPrice: { amount: "299.00", currencyCode: "CNY" },
      minVariantPrice: { amount: "199.00", currencyCode: "CNY" },
    },
    variants: [
      {
        id: "variant-1",
        title: "小号",
        availableForSale: true,
        selectedOptions: [{ name: "尺寸", value: "小号" }],
        price: { amount: "199.00", currencyCode: "CNY" },
      },
      {
        id: "variant-2",
        title: "中号",
        availableForSale: true,
        selectedOptions: [{ name: "尺寸", value: "中号" }],
        price: { amount: "249.00", currencyCode: "CNY" },
      },
      {
        id: "variant-3",
        title: "大号",
        availableForSale: true,
        selectedOptions: [{ name: "尺寸", value: "大号" }],
        price: { amount: "299.00", currencyCode: "CNY" },
      },
    ],
    featuredImage: {
      url: "/images/products/teddy-bear-classic.jpg",
      altText: "经典泰迪熊",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: "/images/products/teddy-bear-classic.jpg",
        altText: "经典泰迪熊",
        width: 800,
        height: 800,
      },
      {
        url: "/images/products/teddy-bear-classic-2.jpg",
        altText: "经典泰迪熊 - 侧面",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "经典泰迪熊 - 柔软舒适的陪伴玩偶",
      description: "优质毛绒面料制作的经典泰迪熊，多种尺寸可选",
    },
    tags: ["泰迪熊", "毛绒玩具", "经典"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    handle: "bunny-plush",
    availableForSale: true,
    title: "可爱兔子玩偶",
    description: "超可爱的长耳兔子玩偶，粉嫩的颜色，柔软的手感，是孩子们的最爱。",
    descriptionHtml: "<p>超可爱的长耳兔子玩偶，粉嫩的颜色，柔软的手感，是孩子们的最爱。采用安全环保材料制作，适合3岁以上儿童。</p>",
    options: [
      {
        id: "color",
        name: "颜色",
        values: ["粉色", "白色", "灰色"],
      },
    ],
    priceRange: {
      maxVariantPrice: { amount: "189.00", currencyCode: "CNY" },
      minVariantPrice: { amount: "189.00", currencyCode: "CNY" },
    },
    variants: [
      {
        id: "variant-4",
        title: "粉色",
        availableForSale: true,
        selectedOptions: [{ name: "颜色", value: "粉色" }],
        price: { amount: "189.00", currencyCode: "CNY" },
      },
      {
        id: "variant-5",
        title: "白色",
        availableForSale: true,
        selectedOptions: [{ name: "颜色", value: "白色" }],
        price: { amount: "189.00", currencyCode: "CNY" },
      },
      {
        id: "variant-6",
        title: "灰色",
        availableForSale: true,
        selectedOptions: [{ name: "颜色", value: "灰色" }],
        price: { amount: "189.00", currencyCode: "CNY" },
      },
    ],
    featuredImage: {
      url: "/images/products/bunny-plush.jpg",
      altText: "可爱兔子玩偶",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: "/images/products/bunny-plush.jpg",
        altText: "可爱兔子玩偶",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "可爱兔子玩偶 - 粉嫩长耳兔",
      description: "超可爱的长耳兔子玩偶，多种颜色可选",
    },
    tags: ["兔子", "毛绒玩具", "可爱"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    handle: "panda-plush",
    availableForSale: true,
    title: "大熊猫玩偶",
    description: "憨态可掬的大熊猫玩偶，黑白配色经典，手感柔软，是收藏和送礼的佳品。",
    descriptionHtml: "<p>憨态可掬的大熊猫玩偶，黑白配色经典，手感柔软，是收藏和送礼的佳品。采用高品质毛绒面料，细节精致。</p>",
    options: [],
    priceRange: {
      maxVariantPrice: { amount: "259.00", currencyCode: "CNY" },
      minVariantPrice: { amount: "259.00", currencyCode: "CNY" },
    },
    variants: [
      {
        id: "variant-7",
        title: "默认",
        availableForSale: true,
        selectedOptions: [],
        price: { amount: "259.00", currencyCode: "CNY" },
      },
    ],
    featuredImage: {
      url: "/images/products/panda-plush.jpg",
      altText: "大熊猫玩偶",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: "/images/products/panda-plush.jpg",
        altText: "大熊猫玩偶",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "大熊猫玩偶 - 憨态可掬的国宝",
      description: "经典黑白配色的大熊猫玩偶，高品质制作",
    },
    tags: ["熊猫", "毛绒玩具", "国宝"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    handle: "unicorn-plush",
    availableForSale: true,
    title: "梦幻独角兽",
    description: "充满魔法色彩的独角兽玩偶，彩虹色的鬃毛，闪闪发光的角，是每个女孩的梦想。",
    descriptionHtml: "<p>充满魔法色彩的独角兽玩偶，彩虹色的鬃毛，闪闪发光的角，是每个女孩的梦想。采用优质材料，安全环保。</p>",
    options: [],
    priceRange: {
      maxVariantPrice: { amount: "229.00", currencyCode: "CNY" },
      minVariantPrice: { amount: "229.00", currencyCode: "CNY" },
    },
    variants: [
      {
        id: "variant-8",
        title: "默认",
        availableForSale: true,
        selectedOptions: [],
        price: { amount: "229.00", currencyCode: "CNY" },
      },
    ],
    featuredImage: {
      url: "/images/products/unicorn-plush.jpg",
      altText: "梦幻独角兽",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: "/images/products/unicorn-plush.jpg",
        altText: "梦幻独角兽",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "梦幻独角兽 - 魔法主题玩偶",
      description: "彩虹色鬃毛的独角兽玩偶，充满魔法色彩",
    },
    tags: ["独角兽", "毛绒玩具", "魔法"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    handle: "dinosaur-plush",
    availableForSale: true,
    title: "小恐龙玩偶",
    description: "可爱的小恐龙玩偶，绿色皮肤，大眼睛，是孩子们探索恐龙世界的好伙伴。",
    descriptionHtml: "<p>可爱的小恐龙玩偶，绿色皮肤，大眼睛，是孩子们探索恐龙世界的好伙伴。适合作为睡前陪伴。</p>",
    options: [],
    priceRange: {
      maxVariantPrice: { amount: "179.00", currencyCode: "CNY" },
      minVariantPrice: { amount: "179.00", currencyCode: "CNY" },
    },
    variants: [
      {
        id: "variant-9",
        title: "默认",
        availableForSale: true,
        selectedOptions: [],
        price: { amount: "179.00", currencyCode: "CNY" },
      },
    ],
    featuredImage: {
      url: "/images/products/dinosaur-plush.jpg",
      altText: "小恐龙玩偶",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: "/images/products/dinosaur-plush.jpg",
        altText: "小恐龙玩偶",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "小恐龙玩偶 - 可爱的绿色小恐龙",
      description: "大眼睛的绿色小恐龙玩偶，适合儿童",
    },
    tags: ["恐龙", "毛绒玩具", "儿童"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    handle: "elephant-plush",
    availableForSale: true,
    title: "小象玩偶",
    description: "温顺可爱的小象玩偶，灰色皮肤，长鼻子，是孩子们的好朋友。",
    descriptionHtml: "<p>温顺可爱的小象玩偶，灰色皮肤，长鼻子，是孩子们的好朋友。采用柔软面料，安全无害。</p>",
    options: [],
    priceRange: {
      maxVariantPrice: { amount: "219.00", currencyCode: "CNY" },
      minVariantPrice: { amount: "219.00", currencyCode: "CNY" },
    },
    variants: [
      {
        id: "variant-10",
        title: "默认",
        availableForSale: true,
        selectedOptions: [],
        price: { amount: "219.00", currencyCode: "CNY" },
      },
    ],
    featuredImage: {
      url: "/images/products/elephant-plush.jpg",
      altText: "小象玩偶",
      width: 800,
      height: 800,
    },
    images: [
      {
        url: "/images/products/elephant-plush.jpg",
        altText: "小象玩偶",
        width: 800,
        height: 800,
      },
    ],
    seo: {
      title: "小象玩偶 - 温顺可爱的小象",
      description: "灰色小象玩偶，长鼻子设计",
    },
    tags: ["大象", "毛绒玩具", "可爱"],
    updatedAt: new Date().toISOString(),
  },
];

const mockCollections: Collection[] = [
  {
    handle: "",
    title: "全部",
    description: "所有产品",
    seo: {
      title: "全部",
      description: "所有产品",
    },
    path: "/search",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "hidden-homepage-featured-items",
    title: "精选推荐",
    description: "首页精选推荐产品",
    seo: {
      title: "精选推荐",
      description: "首页精选推荐产品",
    },
    path: "/search/hidden-homepage-featured-items",
    updatedAt: new Date().toISOString(),
  },
  {
    handle: "hidden-homepage-carousel",
    title: "热门商品",
    description: "热门商品轮播",
    seo: {
      title: "热门商品",
      description: "热门商品轮播",
    },
    path: "/search/hidden-homepage-carousel",
    updatedAt: new Date().toISOString(),
  },
];

export class LocalProvider implements CommerceProvider {
  // 功能特性声明
  features: CommerceFeatures = {
    ...defaultFeatures,
    search: true,
    productRecommendations: true,
    collections: true,
    // 购物车、用户认证等功能默认禁用
    cart: false,
    customerAuth: false,
    wishlist: false,
    orders: false,
    menus: false,
    pages: false,
  };

  // 产品相关
  async getProduct(handle: string): Promise<Product | undefined> {
    return mockProducts.find((p) => p.handle === handle);
  }

  async getProducts(params?: GetProductsParams): Promise<Product[]> {
    let products = [...mockProducts];

    // 搜索过滤
    if (params?.query) {
      const query = params.query.toLowerCase();
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // 排序
    if (params?.sortKey) {
      products.sort((a, b) => {
        if (params.sortKey === "PRICE") {
          const priceA = parseFloat(a.priceRange.minVariantPrice.amount);
          const priceB = parseFloat(b.priceRange.minVariantPrice.amount);
          return params.reverse ? priceB - priceA : priceA - priceB;
        }
        return 0;
      });
    }

    return products;
  }

  async getProductRecommendations(productId: string): Promise<Product[]> {
    // 返回除当前产品外的其他产品
    return mockProducts.filter((p) => p.id !== productId).slice(0, 4);
  }

  // 分类相关
  async getCollection(handle: string): Promise<Collection | undefined> {
    return mockCollections.find((c) => c.handle === handle);
  }

  async getCollections(): Promise<Collection[]> {
    return mockCollections;
  }

  async getCollectionProducts(
    params: GetCollectionProductsParams
  ): Promise<Product[]> {
    // 根据分类返回对应产品
    if (params.collection === "hidden-homepage-featured-items") {
      // 返回前3个产品作为首页推荐
      return mockProducts.slice(0, 3);
    }
    if (params.collection === "hidden-homepage-carousel") {
      // 返回所有产品作为轮播
      return mockProducts;
    }
    // 其他分类返回所有产品
    return this.getProducts({ sortKey: params.sortKey, reverse: params.reverse });
  }

  // 购物车相关 - 禁用
  async getCart(): Promise<Cart | undefined> {
    throw new Error("购物车功能在本地 Provider 中已禁用");
  }

  async createCart(): Promise<Cart> {
    throw new Error("购物车功能在本地 Provider 中已禁用");
  }

  async addToCart(lines: AddToCartParams[]): Promise<Cart> {
    throw new Error("购物车功能在本地 Provider 中已禁用");
  }

  async removeFromCart(lineIds: string[]): Promise<Cart> {
    throw new Error("购物车功能在本地 Provider 中已禁用");
  }

  async updateCart(lines: UpdateCartParams[]): Promise<Cart> {
    throw new Error("购物车功能在本地 Provider 中已禁用");
  }

  // 用户相关 - 禁用
  async login(params: LoginParams): Promise<User> {
    throw new Error("登录功能在本地 Provider 中已禁用");
  }

  async register(params: RegisterParams): Promise<User> {
    throw new Error("注册功能在本地 Provider 中已禁用");
  }

  async logout(): Promise<void> {
    throw new Error("登出功能在本地 Provider 中已禁用");
  }

  async getCurrentUser(): Promise<User | null> {
    return null;
  }

  // 订单相关 - 禁用
  async createOrder(params: CheckoutParams): Promise<Order> {
    throw new Error("订单功能在本地 Provider 中已禁用");
  }

  async getOrder(orderId: string): Promise<Order | undefined> {
    throw new Error("订单功能在本地 Provider 中已禁用");
  }

  async getOrders(): Promise<Order[]> {
    throw new Error("订单功能在本地 Provider 中已禁用");
  }

  // 其他
  async getMenu(handle: string): Promise<Menu[]> {
    // 返回导航菜单
    if (handle === "next-js-frontend-header-menu") {
      return [
        { title: "首页", path: "/" },
        { title: "全部商品", path: "/search" },
        { title: "关于我们", path: "/about" },
        { title: "联系我们", path: "/contact" },
      ];
    }
    if (handle === "next-js-frontend-footer-menu") {
      return [
        { title: "关于我们", path: "/about" },
        { title: "联系我们", path: "/contact" },
        { title: "隐私政策", path: "/privacy" },
        { title: "服务条款", path: "/terms" },
      ];
    }
    return [];
  }

  async getPage(handle: string): Promise<Page | undefined> {
    return undefined;
  }

  async getPages(): Promise<Page[]> {
    return [];
  }
}
