import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import FilterList from "components/layout/search/filter";
import { getCollections, getCommerceFeatures, getProducts } from "lib/commerce";
import { t } from "lib/i18n";
import type { Locale } from "lib/i18n/config";
import { getSortFromSlug, sorting } from "lib/search";
import { notFound } from "next/navigation";

type SearchPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    q?: string;
    sort?: string;
  }>;
};

export async function generateMetadata({ params }: SearchPageProps) {
  const { locale } = await params;

  return {
    title: `${t(locale as Locale, "common", "search")} | ${
      process.env.SITE_NAME || t(locale as Locale, "common", "store")
    }`,
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const features = getCommerceFeatures();

  if (!features.search) {
    notFound();
  }

  const { sortKey, reverse } = getSortFromSlug(resolvedSearchParams.sort);
  const [collections, products] = await Promise.all([
    getCollections(),
    getProducts({
      query: resolvedSearchParams.q,
      sortKey,
      reverse,
    }),
  ]);

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12 md:py-16">
      <div className="mb-10 flex flex-col gap-4">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-rose-500">
          {t(locale as Locale, "common", "search")}
        </p>
        <h1 className="text-3xl font-bold text-stone-900 md:text-5xl">
          {resolvedSearchParams.q?.trim()
            ? `"${resolvedSearchParams.q.trim()}"`
            : t(locale as Locale, "common", "allProducts")}
        </h1>
        <p className="max-w-2xl text-sm text-stone-600 md:text-base">
          {resolvedSearchParams.q?.trim()
            ? `${products.length} result(s)`
            : "Browse the catalog by collection or sort order."}
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="space-y-8 rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-sm">
          <FilterList list={collections} title="Collections" />
        </aside>
        <section className="space-y-8">
          <div className="rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-sm">
            <FilterList title="Sort" list={sorting} />
          </div>

          {products.length ? (
            <Grid className="grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <ProductGridItems products={products} locale={locale as Locale} />
            </Grid>
          ) : (
            <div className="rounded-3xl border border-dashed border-pink-200 bg-white/70 px-6 py-16 text-center text-stone-600 shadow-sm">
              No products found for the current search.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

