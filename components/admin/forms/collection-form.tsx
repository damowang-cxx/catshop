"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import UploadInput from "components/admin/forms/upload-input";
import { COLLECTION_STATUS_OPTIONS } from "lib/admin/status";
import type { CollectionFormValues } from "lib/admin/types";

interface CollectionFormProps {
  mode: "create" | "edit";
  collectionId?: string;
  initialValues?: Partial<CollectionFormValues>;
}

type CollectionFormErrors = Partial<Record<keyof CollectionFormValues, string>>;

const defaultValues: CollectionFormValues = {
  title: "",
  handle: "",
  description: "",
  status: "active",
  image: "",
};

function isValidImageUrl(value: string): boolean {
  return /^(https?:\/\/|\/)/.test(value);
}

export default function CollectionForm({
  mode,
  collectionId,
  initialValues,
}: CollectionFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<CollectionFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [errors, setErrors] = useState<CollectionFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): CollectionFormErrors => {
    const nextErrors: CollectionFormErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!values.handle.trim()) {
      nextErrors.handle = "Handle is required.";
    }

    if (
      !COLLECTION_STATUS_OPTIONS.some((status) => status.value === values.status)
    ) {
      nextErrors.status = "Invalid collection status.";
    }

    if (values.image && !isValidImageUrl(values.image)) {
      nextErrors.image =
        "Image URL must be an absolute URL or root-relative URL.";
    }

    return nextErrors;
  };

  const updateField = <K extends keyof CollectionFormValues>(
    key: K,
    value: CollectionFormValues[K]
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
      mode === "create"
        ? "/api/admin/collections"
        : `/api/admin/collections/${collectionId}`;
    const method = mode === "create" ? "POST" : "PUT";

    const payload = {
      title: values.title.trim(),
      handle: values.handle.trim(),
      description: values.description.trim(),
      status: values.status,
      image: values.image || undefined,
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
        throw new Error(data.error || "Failed to save collection.");
      }

      router.push("/admin/collections");
      router.refresh();
    } catch (submitError) {
      setFormError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to save collection."
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
        <h2 className="text-lg font-semibold text-gray-900">Collection Information</h2>
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
              placeholder="collection-handle"
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

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Visibility *
            </label>
            <select
              id="status"
              value={values.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value as CollectionFormValues["status"]
                )
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              {COLLECTION_STATUS_OPTIONS.map((status) => (
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
        <h2 className="text-lg font-semibold text-gray-900">Collection Image</h2>
        <div className="mt-4 space-y-4">
          <UploadInput
            onUploaded={(urls) => {
              const [firstUrl] = urls;
              if (firstUrl) {
                updateField("image", firstUrl);
              }
            }}
            disabled={isSubmitting}
          />

          {values.image ? (
            <div className="rounded-md border border-gray-200 p-3">
              <img
                src={values.image}
                alt="Collection preview"
                className="h-32 w-32 rounded object-cover"
              />
              <p className="mt-2 truncate text-sm text-gray-700">{values.image}</p>
              <button
                type="button"
                onClick={() => updateField("image", "")}
                className="mt-2 rounded border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
              >
                Remove image
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No image selected.</p>
          )}

          {errors.image ? <p className="text-sm text-red-600">{errors.image}</p> : null}
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Link
          href="/admin/collections"
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
              ? "Create Collection"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

