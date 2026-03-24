import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import ProductGridItems from "components/layout/product-grid-items";
import {
  getCommerceFeatures,
  getProduct,
  getProductRecommendations,
} from "lib/commerce";
import type { Locale } from "lib/i18n/config";
import { addLocaleToPath } from "lib/i18n/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ locale: string; handle: string }>;
};

export async function generateMetadata({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProduct(handle);

  return {
    title: product?.seo?.title || product?.title || handle,
    description: product?.seo?.description || product?.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, handle } = await params;
  const features = getCommerceFeatures();
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  const recommendations = features.productRecommendations
    ? await getProductRecommendations(product.id)
    : [];

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <section className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-sm">
            <GridTileImage
              alt={product.featuredImage?.altText || product.title}
              src={product.featuredImage?.url || "/placeholder.svg"}
              width={1200}
              height={1200}
              isInteractive={false}
              sizes="(min-width: 1024px) 60vw, 100vw"
            />
          </div>

          {product.images.length > 1 ? (
            <Grid className="grid-cols-2 gap-4 md:grid-cols-4">
              {product.images.map((image) => (
                <Grid.Item key={image.url}>
                  <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
                    <GridTileImage
                      alt={image.altText || product.title}
                      src={image.url}
                      width={image.width}
                      height={image.height}
                      isInteractive={false}
                    />
                  </div>
                </Grid.Item>
              ))}
            </Grid>
          ) : null}
        </section>

        <section className="space-y-6 rounded-3xl border border-pink-100 bg-white/90 p-8 shadow-sm">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-rose-500">
              Product
            </p>
            <h1 className="text-3xl font-bold text-stone-900 md:text-5xl">
              {product.title}
            </h1>
            <p className="text-2xl font-semibold text-rose-600">
              {product.priceRange.minVariantPrice.currencyCode}{" "}
              {product.priceRange.minVariantPrice.amount}
            </p>
          </div>

          <div className="space-y-3 text-sm leading-7 text-stone-600 md:text-base">
            <p>{product.description}</p>
          </div>

          {product.options.length ? (
            <div className="space-y-4">
              {product.options.map((option) => (
                <div key={option.id} className="space-y-2">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                    {option.name}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {option.values.map((value) => (
                      <span
                        key={`${option.id}-${value}`}
                        className="rounded-full border border-pink-200 bg-pink-50 px-3 py-1 text-sm text-stone-700"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {product.tags.length ? (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-amber-50 px-3 py-1 text-sm text-amber-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <Link
            href={addLocaleToPath("/search", locale as Locale)}
            className="inline-flex rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-rose-600 hover:to-pink-600"
          >
            Back to catalog
          </Link>
        </section>
      </div>

      {recommendations.length ? (
        <section className="mt-16 space-y-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-rose-500">
              More to explore
            </p>
            <h2 className="mt-2 text-2xl font-bold text-stone-900 md:text-3xl">
              Related products
            </h2>
          </div>
          <Grid className="grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <ProductGridItems
              products={recommendations}
              locale={locale as Locale}
            />
          </Grid>
        </section>
      ) : null}
    </div>
  );
}
