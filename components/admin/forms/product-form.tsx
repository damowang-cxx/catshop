"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import UploadInput from "components/admin/forms/upload-input";
import { PRODUCT_STATUS_OPTIONS } from "lib/admin/status";
import type { ProductFormValues } from "lib/admin/types";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  initialValues?: Partial<ProductFormValues>;
}

type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

const defaultValues: ProductFormValues = {
  title: "",
  handle: "",
  description: "",
  price: "",
  compareAtPrice: "",
  inventory: "0",
  status: "active",
  images: [],
  primaryImageIndex: 0,
};

function isValidImageUrl(value: string): boolean {
  return /^(https?:\/\/|\/)/.test(value);
}

function normalizePrimaryImageIndex(
  requestedIndex: number,
  imageCount: number
): number {
  if (imageCount <= 0) {
    return 0;
  }

  if (requestedIndex < 0) {
    return 0;
  }

  if (requestedIndex >= imageCount) {
    return imageCount - 1;
  }

  return requestedIndex;
}

function buildInitialValues(
  initialValues: Partial<ProductFormValues> | undefined
): ProductFormValues {
  const merged = {
    ...defaultValues,
    ...initialValues,
  };

  const images = Array.isArray(merged.images)
    ? merged.images.filter((image) => typeof image === "string" && image.length > 0)
    : [];

  return {
    ...merged,
    images,
    primaryImageIndex: normalizePrimaryImageIndex(
      merged.primaryImageIndex,
      images.length
    ),
  };
}

export default function ProductForm({
  mode,
  productId,
  initialValues,
}: ProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(
    buildInitialValues(initialValues)
  );
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const primaryImage = useMemo(
    () => values.images[values.primaryImageIndex] ?? values.images[0] ?? "",
    [values.images, values.primaryImageIndex]
  );

  const validate = (): ProductFormErrors => {
    const nextErrors: ProductFormErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!values.handle.trim()) {
      nextErrors.handle = "Handle is required.";
    }

    if (!values.price.trim()) {
      nextErrors.price = "Price is required.";
    } else {
      const parsedPrice = Number.parseFloat(values.price);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        nextErrors.price = "Price must be a valid non-negative number.";
      }
    }

    if (values.compareAtPrice.trim()) {
      const parsedCompareAt = Number.parseFloat(values.compareAtPrice);
      if (!Number.isFinite(parsedCompareAt) || parsedCompareAt < 0) {
        nextErrors.compareAtPrice =
          "Compare-at price must be a valid non-negative number.";
      }
    }

    if (!values.inventory.trim()) {
      nextErrors.inventory = "Inventory is required.";
    } else {
      const parsedInventory = Number.parseInt(values.inventory, 10);
      if (!Number.isFinite(parsedInventory) || parsedInventory < 0) {
        nextErrors.inventory = "Inventory must be a non-negative integer.";
      }
    }

    if (!PRODUCT_STATUS_OPTIONS.some((status) => status.value === values.status)) {
      nextErrors.status = "Invalid product status.";
    }

    const invalidImage = values.images.find((image) => !isValidImageUrl(image));
    if (invalidImage) {
      nextErrors.images = "Image URLs must be absolute URLs or root-relative URLs.";
    }

    return nextErrors;
  };

  const updateField = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => {
    setValues((previous) => ({
      ...previous,
      [key]: value,
    }));
    setErrors((previous) => ({
      ...previous,
      [key]: undefined,
    }));
  };

  const addUploadedImages = (urls: string[]) => {
    setValues((previous) => {
      const nextImages = [...previous.images, ...urls];
      return {
        ...previous,
        images: nextImages,
        primaryImageIndex: normalizePrimaryImageIndex(
          previous.primaryImageIndex,
          nextImages.length
        ),
      };
    });
  };

  const removeImage = (index: number) => {
    setValues((previous) => {
      const nextImages = previous.images.filter((_, current) => current !== index);
      let nextPrimaryIndex = previous.primaryImageIndex;

      if (index < previous.primaryImageIndex) {
        nextPrimaryIndex -= 1;
      } else if (index === previous.primaryImageIndex) {
        nextPrimaryIndex = 0;
      }

      return {
        ...previous,
        images: nextImages,
        primaryImageIndex: normalizePrimaryImageIndex(
          nextPrimaryIndex,
          nextImages.length
        ),
      };
    });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setValues((previous) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= previous.images.length) {
        return previous;
      }

      const nextImages = [...previous.images];
      const currentImage = nextImages[index];
      const nextImage = nextImages[nextIndex];
      if (typeof currentImage !== "string" || typeof nextImage !== "string") {
        return previous;
      }
      nextImages[index] = nextImage;
      nextImages[nextIndex] = currentImage;

      let nextPrimaryIndex = previous.primaryImageIndex;
      if (previous.primaryImageIndex === index) {
        nextPrimaryIndex = nextIndex;
      } else if (previous.primaryImageIndex === nextIndex) {
        nextPrimaryIndex = index;
      }

      return {
        ...previous,
        images: nextImages,
        primaryImageIndex: nextPrimaryIndex,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const endpoint =
      mode === "create" ? "/api/admin/products" : `/api/admin/products/${productId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const payload = {
      title: values.title.trim(),
      handle: values.handle.trim(),
      description: values.description.trim(),
      price: Number.parseFloat(values.price),
      compareAtPrice: values.compareAtPrice
        ? Number.parseFloat(values.compareAtPrice)
        : undefined,
      inventory: Number.parseInt(values.inventory, 10),
      status: values.status,
      images: values.images,
      primaryImageIndex: values.primaryImageIndex,
      featuredImage: primaryImage || undefined,
    };

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error || "Failed to save product.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (submitError) {
      setFormError(
        submitError instanceof Error ? submitError.message : "Failed to save product."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      ) : null}

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              id="title"
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            {errors.title ? (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="handle" className="block text-sm font-medium text-gray-700">
              Handle *
            </label>
            <input
              id="handle"
              value={values.handle}
              onChange={(event) => updateField("handle", event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="product-handle"
            />
            {errors.handle ? (
              <p className="mt-1 text-sm text-red-600">{errors.handle}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={values.description}
              onChange={(event) => updateField("description", event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={values.price}
              onChange={(event) => updateField("price", event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            {errors.price ? (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="compareAtPrice"
              className="block text-sm font-medium text-gray-700"
            >
              Compare At Price
            </label>
            <input
              id="compareAtPrice"
              type="number"
              step="0.01"
              value={values.compareAtPrice}
              onChange={(event) => updateField("compareAtPrice", event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            {errors.compareAtPrice ? (
              <p className="mt-1 text-sm text-red-600">{errors.compareAtPrice}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="inventory"
              className="block text-sm font-medium text-gray-700"
            >
              Inventory *
            </label>
            <input
              id="inventory"
              type="number"
              value={values.inventory}
              onChange={(event) => updateField("inventory", event.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            {errors.inventory ? (
              <p className="mt-1 text-sm text-red-600">{errors.inventory}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status *
            </label>
            <select
              id="status"
              value={values.status}
              onChange={(event) =>
                updateField("status", event.target.value as ProductFormValues["status"])
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {PRODUCT_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            {errors.status ? (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="text-lg font-semibold text-gray-900">Images</h2>
        <div className="mt-4 space-y-4">
          <UploadInput multiple onUploaded={addUploadedImages} disabled={isSubmitting} />
          {errors.images ? (
            <p className="text-sm text-red-600">{errors.images}</p>
          ) : null}

          {values.images.length === 0 ? (
            <p className="text-sm text-gray-500">No images uploaded yet.</p>
          ) : (
            <div className="space-y-3">
              {values.images.map((image, index) => (
                <div
                  key={`${image}-${index}`}
                  className="flex flex-col gap-2 rounded-md border border-gray-200 p-3 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="h-16 w-16 rounded object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm text-gray-700">{image}</p>
                      <button
                        type="button"
                        onClick={() => updateField("primaryImageIndex", index)}
                        className={`mt-1 rounded px-2 py-1 text-xs ${
                          values.primaryImageIndex === index
                            ? "bg-amber-100 text-amber-800"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {values.primaryImageIndex === index
                          ? "Primary Image"
                          : "Set as Primary"}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => moveImage(index, -1)}
                      disabled={index === 0}
                      className="rounded border border-gray-300 px-2 py-1 text-sm disabled:opacity-50"
                    >
                      Up
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(index, 1)}
                      disabled={index === values.images.length - 1}
                      className="rounded border border-gray-300 px-2 py-1 text-sm disabled:opacity-50"
                    >
                      Down
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="rounded border border-red-300 px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link
          href="/admin/products"
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-amber-700 px-4 py-2 text-sm font-medium text-white hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
              ? "Create Product"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
