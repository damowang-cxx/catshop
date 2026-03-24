import { Suspense } from "react";
import { getCommerceProvider } from "lib/commerce";
import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { getProducts } from "lib/commerce";
import HeroSection from "components/home/hero-section";
import { t } from "lib/i18n";
import { type Locale } from "lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    description: t(locale as Locale, "common", "subtitle"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const provider = getCommerceProvider();
  const products = await getProducts({ limit: 12 });

  return (
    <>
      {/* Hero Section */}
      <HeroSection locale={locale as Locale} />

      {/* 产品展示区域 */}
      <div className="mx-auto max-w-screen-2xl px-4 py-12 md:py-16">
        {/* 标题区域 */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-rose-600 md:text-4xl">
            <span className="inline-block animate-bounce delay-100">✨</span>
            <span className="mx-2">
              {t(locale as Locale, "common", "featuredProducts")}
            </span>
            <span className="inline-block animate-bounce delay-200">✨</span>
          </h2>
          <p className="text-lg text-stone-600">
            {t(locale as Locale, "common", "featuredProductsDesc")}
          </p>
        </div>

        {/* 产品网格 */}
        <Suspense
          fallback={
            <div className="text-center py-12">
              {t(locale as Locale, "common", "loading")}
            </div>
          }
        >
          <Grid className="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <ProductGridItems products={products} locale={locale as Locale} />
          </Grid>
        </Suspense>

        {/* 底部装饰 */}
        <div className="mt-16 flex justify-center gap-4">
          {["💕", "🌟", "🎀", "💝", "🎁"].map((emoji, i) => (
            <span
              key={i}
              className="text-3xl animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
