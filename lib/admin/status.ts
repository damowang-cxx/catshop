import type {
  CollectionStatus,
  OrderStatus,
  ProductStatus,
} from "lib/admin/types";

export const PRODUCT_STATUS_OPTIONS: Array<{
  value: ProductStatus;
  label: string;
}> = [
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
];

export const COLLECTION_STATUS_OPTIONS: Array<{
  value: CollectionStatus;
  label: string;
}> = [
  { value: "active", label: "Visible" },
  { value: "hidden", label: "Hidden" },
];

export const ORDER_STATUS_OPTIONS: Array<{
  value: OrderStatus;
  label: string;
}> = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export const ORDER_STATUS_BADGES: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const ORDER_STATUS_SET = new Set<OrderStatus>(
  ORDER_STATUS_OPTIONS.map((option) => option.value)
);

export function isOrderStatus(value: string): value is OrderStatus {
  return ORDER_STATUS_SET.has(value as OrderStatus);
}

