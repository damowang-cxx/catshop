import CollectionForm from "components/admin/forms/collection-form";

export default function NewCollectionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Collection</h1>
        <p className="mt-2 text-sm text-gray-600">
          Add a new collection for catalog organization.
        </p>
      </div>
      <CollectionForm mode="create" />
    </div>
  );
}

