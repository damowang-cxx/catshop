// API 数据转换工具 - 将后端 API 数据转换为前端格式

import type {
  Product,
  Collection,
  Cart,
  CartItem,
  Order,
  User,
  Image,
  Money,
} from "@commerce/types";

/**
 * 转换后端产品数据为前端格式
 */
export function transformProduct(apiProduct: any): Product {
  return {
    id: apiProduct.id || apiProduct._id,
    handle: apiProduct.handle || apiProduct.slug,
    availableForSale: apiProduct.availableForSale ?? apiProduct.inStock ?? true,
    title: apiProduct.title || apiProduct.name,
    description: apiProduct.description || "",
    descriptionHtml: apiProduct.descriptionHtml || apiProduct.description || "",
    options: apiProduct.options || [],
    priceRange: {
      minVariantPrice: transformMoney(
        apiProduct.priceRange?.minVariantPrice ||
          apiProduct.minPrice ||
          apiProduct.price ||
          { amount: "0", currencyCode: "CNY" }
      ),
      maxVariantPrice: transformMoney(
        apiProduct.priceRange?.maxVariantPrice ||
          apiProduct.maxPrice ||
          apiProduct.price ||
          { amount: "0", currencyCode: "CNY" }
      ),
    },
    variants: (apiProduct.variants || []).map(transformVariant),
    featuredImage: apiProduct.featuredImage
      ? transformImage(apiProduct.featuredImage)
      : null,
    images: (apiProduct.images || []).map(transformImage),
    seo: {
      title: apiProduct.seo?.title || apiProduct.title || "",
      description: apiProduct.seo?.description || apiProduct.description || "",
    },
    tags: apiProduct.tags || [],
    updatedAt: apiProduct.updatedAt || apiProduct.updated_at || new Date().toISOString(),
  };
}

/**
 * 转换产品变体
 */
function transformVariant(apiVariant: any) {
  return {
    id: apiVariant.id || apiVariant._id,
    title: apiVariant.title || apiVariant.name || "默认",
    availableForSale: apiVariant.availableForSale ?? apiVariant.inStock ?? true,
    selectedOptions: apiVariant.selectedOptions || apiVariant.options || [],
    price: transformMoney(
      apiVariant.price || { amount: "0", currencyCode: "CNY" }
    ),
  };
}

/**
 * 转换分类数据
 */
export function transformCollection(apiCollection: any): Collection {
  return {
    handle: apiCollection.handle || apiCollection.slug || apiCollection.id,
    title: apiCollection.title || apiCollection.name,
    description: apiCollection.description || "",
    seo: {
      title: apiCollection.seo?.title || apiCollection.title || "",
      description:
        apiCollection.seo?.description || apiCollection.description || "",
    },
    path: apiCollection.path || `/search/${apiCollection.handle || apiCollection.slug}`,
    updatedAt:
      apiCollection.updatedAt ||
      apiCollection.updated_at ||
      new Date().toISOString(),
  };
}

/**
 * 转换购物车数据
 */
export function transformCart(apiCart: any): Cart {
  return {
    id: apiCart.id || apiCart._id,
    checkoutUrl: apiCart.checkoutUrl || apiCart.checkout_url || "",
    cost: {
      subtotalAmount: transformMoney(
        apiCart.cost?.subtotalAmount ||
          apiCart.subtotal ||
          { amount: "0", currencyCode: "CNY" }
      ),
      totalAmount: transformMoney(
        apiCart.cost?.totalAmount ||
          apiCart.total ||
          { amount: "0", currencyCode: "CNY" }
      ),
      totalTaxAmount: transformMoney(
        apiCart.cost?.totalTaxAmount ||
          apiCart.tax ||
          { amount: "0", currencyCode: "CNY" }
      ),
    },
    lines: (apiCart.lines || apiCart.items || []).map(transformCartItem),
    totalQuantity:
      apiCart.totalQuantity ||
      apiCart.total_quantity ||
      (apiCart.lines || apiCart.items || []).reduce(
        (sum: number, item: any) => sum + (item.quantity || 0),
        0
      ),
  };
}

/**
 * 转换购物车商品
 */
function transformCartItem(apiItem: any): CartItem {
  return {
    id: apiItem.id || apiItem._id,
    quantity: apiItem.quantity || 0,
    cost: {
      totalAmount: transformMoney(
        apiItem.cost?.totalAmount ||
          apiItem.total ||
          { amount: "0", currencyCode: "CNY" }
      ),
    },
    merchandise: {
      id: apiItem.merchandise?.id || apiItem.variantId || apiItem.variant_id,
      title: apiItem.merchandise?.title || apiItem.variantTitle || "默认",
      selectedOptions: apiItem.merchandise?.selectedOptions || apiItem.options || [],
      product: {
        id: apiItem.product?.id || apiItem.productId || apiItem.product_id,
        handle: apiItem.product?.handle || apiItem.productHandle || apiItem.product_handle,
        title: apiItem.product?.title || apiItem.productTitle || apiItem.product_title,
        featuredImage: apiItem.product?.featuredImage
          ? transformImage(apiItem.product.featuredImage)
          : null,
      },
    },
  };
}

/**
 * 转换订单数据
 */
export function transformOrder(apiOrder: any): Order {
  return {
    id: apiOrder.id || apiOrder._id,
    orderNumber: apiOrder.orderNumber || apiOrder.order_number || apiOrder.id,
    totalPrice: transformMoney(
      apiOrder.totalPrice ||
        apiOrder.total ||
        { amount: "0", currencyCode: "CNY" }
    ),
    status: apiOrder.status || "pending",
    createdAt: apiOrder.createdAt || apiOrder.created_at || new Date().toISOString(),
    lineItems: (apiOrder.lineItems || apiOrder.items || []).map((item: any) => ({
      id: item.id || item._id,
      title: item.title || item.name,
      quantity: item.quantity || 0,
      variant: {
        id: item.variant?.id || item.variantId,
        title: item.variant?.title || item.variantTitle,
        price: transformMoney(item.variant?.price || item.price),
      },
      product: {
        id: item.product?.id || item.productId,
        handle: item.product?.handle || item.productHandle,
        title: item.product?.title || item.productTitle,
        featuredImage: item.product?.featuredImage
          ? transformImage(item.product.featuredImage)
          : null,
      },
    })),
  };
}

/**
 * 转换用户数据
 */
export function transformUser(apiUser: any): User {
  return {
    id: apiUser.id || apiUser._id,
    email: apiUser.email,
    firstName: apiUser.firstName || apiUser.first_name,
    lastName: apiUser.lastName || apiUser.last_name,
    phone: apiUser.phone,
  };
}

/**
 * 转换图片数据
 */
export function transformImage(apiImage: any): Image {
  if (typeof apiImage === "string") {
    return {
      url: apiImage,
      altText: "",
      width: 800,
      height: 800,
    };
  }

  return {
    url: apiImage.url || apiImage.src,
    altText: apiImage.altText || apiImage.alt || "",
    width: apiImage.width || 800,
    height: apiImage.height || 800,
  };
}

/**
 * 转换金额数据
 */
export function transformMoney(apiMoney: any): Money {
  if (typeof apiMoney === "string" || typeof apiMoney === "number") {
    return {
      amount: String(apiMoney),
      currencyCode: "CNY",
    };
  }

  return {
    amount: String(apiMoney.amount || apiMoney.value || "0"),
    currencyCode: apiMoney.currencyCode || apiMoney.currency || "CNY",
  };
}
