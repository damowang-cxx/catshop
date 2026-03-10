import Link from "next/link";
import ProductForm from "components/admin/forms/product-form";
import { adminApiClient } from "lib/api/admin-client";
import type { ProductFormValues } from "lib/admin/types";

interface BackendProduct {
  id: string;
  title?: string;
  handle?: string;
  description?: string;
  price?: number | string;
  compareAtPrice?: number | string;
  status?: string;
  inventory?: number | string;
  images?: Array<string | { url?: string }>;
  featuredImage?: string | { url?: string };
  primaryImageIndex?: number;
}

function toImageUrls(product: BackendProduct): string[] {
  const urls: string[] = [];
  if (Array.isArray(product.images)) {
    product.images.forEach((image) => {
      if (typeof image === "string" && image.length > 0) {
        urls.push(image);
      } else if (
        image &&
        typeof image === "object" &&
        typeof image.url === "string" &&
        image.url.length > 0
      ) {
        urls.push(image.url);
      }
    });
  }

  if (urls.length > 0) {
    return urls;
  }

  if (
    typeof product.featuredImage === "string" &&
    product.featuredImage.length > 0
  ) {
    return [product.featuredImage];
  }

  if (
    product.featuredImage &&
    typeof product.featuredImage === "object" &&
    typeof product.featuredImage.url === "string" &&
    product.featuredImage.url.length > 0
  ) {
    return [product.featuredImage.url];
  }

  return [];
}

function mapToFormValues(product: BackendProduct): ProductFormValues {
  const images = toImageUrls(product);
  const primaryImageIndex =
    typeof product.primaryImageIndex === "number" &&
    product.primaryImageIndex >= 0 &&
    product.primaryImageIndex < images.length
      ? product.primaryImageIndex
      : 0;

  return {
    title: product.title ?? "",
    handle: product.handle ?? "",
    description: product.description ?? "",
    price:
      typeof product.price === "number" || typeof product.price === "string"
        ? String(product.price)
        : "",
    compareAtPrice:
      typeof product.compareAtPrice === "number" ||
      typeof product.compareAtPrice === "string"
        ? String(product.compareAtPrice)
        : "",
    inventory:
      typeof product.inventory === "number" || typeof product.inventory === "string"
        ? String(product.inventory)
        : "0",
    status: product.status === "draft" ? "draft" : "active",
    images,
    primaryImageIndex,
  };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const payload = await adminApiClient.get<BackendProduct | { data: BackendProduct }>(
      `/products/${id}`
    );
    const product =
      payload && typeof payload === "object" && "data" in payload
        ? payload.data
        : payload;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update product details and media.
          </p>
        </div>
        <ProductForm mode="edit" productId={id} initialValues={mapToFormValues(product)} />
      </div>
    );
  } catch (error) {
    console.error("Failed to load product:", error);
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          Failed to load product details.
        </div>
        <Link href="/admin/products" className="text-sm text-amber-700 hover:underline">
          Back to product list
        </Link>
      </div>
    );
  }
}

