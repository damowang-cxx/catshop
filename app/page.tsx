import { Suspense } from "react";
import { getCommerceProvider } from "lib/commerce";
import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { getProducts } from "lib/commerce";

export const metadata = {
  description: "一个现代化的电商平台",
};

export default async function HomePage() {
  const provider = getCommerceProvider();
  const products = await getProducts({ limit: 12 });

  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4">
        <div className="mb-8 mt-8 flex flex-col gap-8">
          <h1 className="text-2xl font-bold">欢迎来到我们的商店</h1>
        </div>
        <Suspense>
          <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ProductGridItems products={products} />
          </Grid>
        </Suspense>
      </div>
    </>
  );
}
