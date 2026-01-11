// Commerce Provider 抽象类型定义

export type Maybe<T> = T | null;

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type SEO = {
  title: string;
  description: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type Product = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: ProductVariant[];
  featuredImage: Image | null;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  path: string;
  updatedAt: string;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: Image | null;
    };
  };
};

export type Cart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: CartItem[];
  totalQuantity: number;
};

export type Menu = {
  title: string;
  path: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  totalPrice: Money;
  status: string;
  createdAt: string;
  lineItems: {
    id: string;
    title: string;
    quantity: number;
    variant: {
      id: string;
      title: string;
      price: Money;
    };
    product: {
      id: string;
      handle: string;
      title: string;
      featuredImage: Image | null;
    };
  }[];
};

export type GetProductsParams = {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
};

export type GetCollectionProductsParams = {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
};

export type AddToCartParams = {
  merchandiseId: string;
  quantity: number;
};

export type UpdateCartParams = {
  id: string;
  merchandiseId: string;
  quantity: number;
};

export type LoginParams = {
  email: string;
  password: string;
};

export type RegisterParams = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export type CheckoutParams = {
  cartId: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    country: string;
    phone?: string;
  };
};
