import Link from "next/link";
import CollectionForm from "components/admin/forms/collection-form";
import { adminApiClient } from "lib/api/admin-client";
import type { CollectionFormValues } from "lib/admin/types";

interface BackendCollection {
  id: string;
  title?: string;
  handle?: string;
  description?: string;
  status?: string;
  image?: string;
}

function mapToFormValues(collection: BackendCollection): CollectionFormValues {
  return {
    title: collection.title ?? "",
    handle: collection.handle ?? "",
    description: collection.description ?? "",
    status: collection.status === "hidden" ? "hidden" : "active",
    image: collection.image ?? "",
  };
}

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const payload = await adminApiClient.get<
      BackendCollection | { data: BackendCollection }
    >(`/admin/collections/${id}`);
    const collection =
      payload && typeof payload === "object" && "data" in payload
        ? payload.data
        : payload;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Collection</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update collection metadata and visibility.
          </p>
        </div>
        <CollectionForm
          mode="edit"
          collectionId={id}
          initialValues={mapToFormValues(collection)}
        />
      </div>
    );
  } catch (error) {
    console.error("Failed to load collection:", error);
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          Failed to load collection details.
        </div>
        <Link
          href="/admin/collections"
          className="text-sm text-amber-700 hover:underline"
        >
          Back to collection list
        </Link>
      </div>
    );
  }
}


