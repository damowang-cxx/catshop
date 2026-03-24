import type {
  AddToCartParams,
  Cart,
  CheckoutParams,
  Collection,
  CommerceFeatures,
  CommerceProvider,
  GetCollectionProductsParams,
  GetProductsParams,
  LoginParams,
  Menu,
  Order,
  Page,
  Product,
  RegisterParams,
  UpdateCartParams,
  User,
} from "@commerce/types";
import * as shopify from "lib/shopify";
import { setCartCookie } from "lib/cart/cookies";
import { NextRequest } from "next/server";

export class ShopifyProvider implements CommerceProvider {
  features: CommerceFeatures = {
    cart: true,
    search: true,
    productRecommendations: true,
    collections: true,
    menus: true,
    pages: true,
    customerAuth: false,
    wishlist: false,
    orders: false,
  } as CommerceFeatures;

  async getProduct(handle: string): Promise<Product | undefined> {
    return shopify.getProduct(handle);
  }

  async getProducts(params?: GetProductsParams): Promise<Product[]> {
    return shopify.getProducts({
      query: params?.query,
      reverse: params?.reverse,
      sortKey: params?.sortKey,
    });
  }

  async getProductRecommendations(productId: string): Promise<Product[]> {
    return shopify.getProductRecommendations(productId);
  }

  async getCollection(handle: string): Promise<Collection | undefined> {
    return shopify.getCollection(handle);
  }

  async getCollections(): Promise<Collection[]> {
    return shopify.getCollections();
  }

  async getCollectionProducts(
    params: GetCollectionProductsParams
  ): Promise<Product[]> {
    return shopify.getCollectionProducts({
      collection: params.collection,
      reverse: params.reverse,
      sortKey: params.sortKey,
    });
  }

  async getCart(): Promise<Cart | undefined> {
    return shopify.getCart();
  }

  async createCart(): Promise<Cart> {
    const cart = await shopify.createCart();

    if (cart.id) {
      await setCartCookie(cart.id);
    }

    return cart;
  }

  async addToCart(lines: AddToCartParams[]): Promise<Cart> {
    return shopify.addToCart(
      lines.map((line) => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
      }))
    );
  }

  async removeFromCart(lineIds: string[]): Promise<Cart> {
    return shopify.removeFromCart(lineIds);
  }

  async updateCart(lines: UpdateCartParams[]): Promise<Cart> {
    return shopify.updateCart(
      lines.map((line) => ({
        id: line.id,
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
      }))
    );
  }

  async login(_params: LoginParams): Promise<User> {
    throw new Error("Shopify Storefront API does not support customer login.");
  }

  async register(_params: RegisterParams): Promise<User> {
    throw new Error(
      "Shopify Storefront API does not support customer registration."
    );
  }

  async logout(): Promise<void> {
    throw new Error("Shopify Storefront API does not support customer logout.");
  }

  async getCurrentUser(): Promise<User | null> {
    return null;
  }

  async createOrder(_params: CheckoutParams): Promise<Order> {
    const cart = await this.getCart();
    if (!cart) {
      throw new Error("Cart not found");
    }

    throw new Error(
      "Use the Shopify checkoutUrl to complete checkout for Storefront carts."
    );
  }

  async getOrder(_orderId: string): Promise<Order | undefined> {
    throw new Error("Shopify Storefront API does not support order lookup.");
  }

  async getOrders(): Promise<Order[]> {
    throw new Error("Shopify Storefront API does not support order listing.");
  }

  async getMenu(handle: string): Promise<Menu[]> {
    return shopify.getMenu(handle);
  }

  async getPage(handle: string): Promise<Page | undefined> {
    return shopify.getPage(handle);
  }

  async getPages(): Promise<Page[]> {
    return shopify.getPages();
  }

  async revalidate(req: NextRequest) {
    return shopify.revalidate(req);
  }
}

export const shopifyProvider = new ShopifyProvider();
