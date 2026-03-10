import ProductForm from "components/admin/forms/product-form";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Product</h1>
        <p className="mt-2 text-sm text-gray-600">
          Add a new product to your catalog.
        </p>
      </div>
      <ProductForm mode="create" />
    </div>
  );
}

