// Commerce Provider 抽象接口

import type {
  Cart,
  Collection,
  GetCollectionProductsParams,
  GetProductsParams,
  Menu,
  Order,
  Page,
  Product,
  AddToCartParams,
  UpdateCartParams,
  LoginParams,
  RegisterParams,
  CheckoutParams,
  User,
} from "./types";
import type { CommerceFeatures } from "./features";

/**
 * Commerce Provider 接口
 * 所有电商后端 Provider 必须实现此接口
 */
export interface CommerceProvider {
  /**
   * Provider 支持的功能特性
   * 用于前端根据功能开关条件渲染 UI
   */
  features: CommerceFeatures;
  // 产品相关
  getProduct(handle: string): Promise<Product | undefined>;
  getProducts(params?: GetProductsParams): Promise<Product[]>;
  getProductRecommendations(productId: string): Promise<Product[]>;

  // 分类相关
  getCollection(handle: string): Promise<Collection | undefined>;
  getCollections(): Promise<Collection[]>;
  getCollectionProducts(
    params: GetCollectionProductsParams
  ): Promise<Product[]>;

  // 购物车相关
  getCart(): Promise<Cart | undefined>;
  createCart(): Promise<Cart>;
  addToCart(lines: AddToCartParams[]): Promise<Cart>;
  removeFromCart(lineIds: string[]): Promise<Cart>;
  updateCart(lines: UpdateCartParams[]): Promise<Cart>;

  // 用户相关
  login(params: LoginParams): Promise<User>;
  register(params: RegisterParams): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;

  // 订单相关
  createOrder(params: CheckoutParams): Promise<Order>;
  getOrder(orderId: string): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;

  // 其他
  getMenu(handle: string): Promise<Menu[]>;
  getPage(handle: string): Promise<Page | undefined>;
  getPages(): Promise<Page[]>;

  // Webhook 重新验证（可选）
  revalidate?(req: any): Promise<any>;
}
