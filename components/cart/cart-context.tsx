/**
 * 购物车上下文组件
 * 提供购物车状态管理和乐观更新功能
 * 注意：必须是客户端组件（"use client"）
 */

"use client";

import type {
  Cart,
  CartItem,
  Product,
  ProductVariant,
} from "lib/types";
import React, {
  createContext,
  use,
  useContext,
  useMemo,
  useOptimistic,
} from "react";

// 更新类型：增加、减少、删除
type UpdateType = "plus" | "minus" | "delete";

// 购物车操作类型
type CartAction =
  | {
      type: "UPDATE_ITEM";
      payload: { merchandiseId: string; updateType: UpdateType };
    }
  | {
      type: "ADD_ITEM";
      payload: { variant: ProductVariant; product: Product };
    };

// 购物车上下文类型
type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
};

// 创建购物车上下文
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * 计算商品总价
 * @param quantity - 数量
 * @param price - 单价
 * @returns 总价字符串
 */
function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

/**
 * 更新购物车商品
 * @param item - 购物车商品项
 * @param updateType - 更新类型
 * @returns 更新后的商品项或 null（如果删除或数量为 0）
 */
function updateCartItem(
  item: CartItem,
  updateType: UpdateType,
): CartItem | null {
  if (updateType === "delete") return null;

  // 计算新数量
  const newQuantity =
    updateType === "plus" ? item.quantity + 1 : item.quantity - 1;
  // 如果数量为 0，返回 null（删除商品）
  if (newQuantity === 0) return null;

  // 计算单价
  const singleItemAmount = Number(item.cost.totalAmount.amount) / item.quantity;
  // 计算新总价
  const newTotalAmount = calculateItemCost(
    newQuantity,
    singleItemAmount.toString(),
  );

  return {
    ...item,
    quantity: newQuantity,
    cost: {
      ...item.cost,
      totalAmount: {
        ...item.cost.totalAmount,
        amount: newTotalAmount,
      },
    },
  };
}

/**
 * 创建或更新购物车商品
 * 如果商品已存在，增加数量；否则创建新商品项
 * @param existingItem - 已存在的商品项（可选）
 * @param variant - 产品变体
 * @param product - 产品对象
 * @returns 购物车商品项
 */
function createOrUpdateCartItem(
  existingItem: CartItem | undefined,
  variant: ProductVariant,
  product: Product,
): CartItem {
  // 如果商品已存在，数量加 1；否则数量为 1
  const quantity = existingItem ? existingItem.quantity + 1 : 1;
  // 计算总价
  const totalAmount = calculateItemCost(quantity, variant.price.amount);

  return {
    id: existingItem?.id,
    quantity,
    cost: {
      totalAmount: {
        amount: totalAmount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

/**
 * 更新购物车总计
 * 计算总数量和总金额
 * @param lines - 购物车商品列表
 * @returns 包含总数量和费用的对象
 */
function updateCartTotals(
  lines: CartItem[],
): Pick<Cart, "totalQuantity" | "cost"> {
  // 计算总数量
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  // 计算总金额
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  // 获取货币代码（默认 USD）
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

/**
 * 创建空购物车
 * @returns 空的购物车对象
 */
function createEmptyCart(): Cart {
  return {
    id: undefined,
    checkoutUrl: "",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: "USD" },
      totalAmount: { amount: "0", currencyCode: "USD" },
      totalTaxAmount: { amount: "0", currencyCode: "USD" },
    },
  };
}

/**
 * 购物车状态更新器（Reducer）
 * 处理购物车的各种操作（更新商品、添加商品）
 * @param state - 当前购物车状态
 * @param action - 操作类型和载荷
 * @returns 更新后的购物车状态
 */
function cartReducer(state: Cart | undefined, action: CartAction): Cart {
  const currentCart = state || createEmptyCart();

  switch (action.type) {
    case "UPDATE_ITEM": {
      const { merchandiseId, updateType } = action.payload;
      const updatedLines = currentCart.lines
        .map((item) =>
          item.merchandise.id === merchandiseId
            ? updateCartItem(item, updateType)
            : item,
        )
        .filter(Boolean) as CartItem[];

      if (updatedLines.length === 0) {
        return {
          ...currentCart,
          lines: [],
          totalQuantity: 0,
          cost: {
            ...currentCart.cost,
            totalAmount: { ...currentCart.cost.totalAmount, amount: "0" },
          },
        };
      }

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    case "ADD_ITEM": {
      const { variant, product } = action.payload;
      const existingItem = currentCart.lines.find(
        (item) => item.merchandise.id === variant.id,
      );
      const updatedItem = createOrUpdateCartItem(
        existingItem,
        variant,
        product,
      );

      const updatedLines = existingItem
        ? currentCart.lines.map((item) =>
            item.merchandise.id === variant.id ? updatedItem : item,
          )
        : [...currentCart.lines, updatedItem];

      return {
        ...currentCart,
        ...updateCartTotals(updatedLines),
        lines: updatedLines,
      };
    }
    default:
      return currentCart;
  }
}

/**
 * 购物车提供者组件
 * 为子组件提供购物车上下文
 * @param children - 子组件
 * @param cartPromise - 购物车数据的 Promise
 * @returns 购物车上下文提供者
 */
export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  return (
    <CartContext.Provider value={{ cartPromise }}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * 购物车 Hook
 * 提供购物车状态和操作方法，使用乐观更新优化用户体验
 * @returns 购物车对象、更新商品方法、添加商品方法
 */
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  // 获取初始购物车数据
  const initialCart = use(context.cartPromise);
  // 使用乐观更新，立即更新 UI，然后等待服务器响应
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer,
  );

  const updateCartItem = (merchandiseId: string, updateType: UpdateType) => {
    updateOptimisticCart({
      type: "UPDATE_ITEM",
      payload: { merchandiseId, updateType },
    });
  };

  const addCartItem = (variant: ProductVariant, product: Product) => {
    updateOptimisticCart({ type: "ADD_ITEM", payload: { variant, product } });
  };

  return useMemo(
    () => ({
      cart: optimisticCart,
      updateCartItem,
      addCartItem,
    }),
    [optimisticCart],
  );
}
