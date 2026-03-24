import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import { type Locale } from "lib/i18n/config";
import { addLocaleToPath } from "lib/i18n/utils";
import { Product } from "lib/types";
import Link from "next/link";

export default function ProductGridItems({
  products,
  locale,
}: {
  products: Product[];
  locale: Locale;
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <Link
            className="relative inline-block h-full w-full"
            href={addLocaleToPath(`/product/${product.handle}`, locale)}
            prefetch={true}
          >
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
              }}
              src={product.featuredImage?.url || "/placeholder.svg"}
              fill
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </Link>
        </Grid.Item>
      ))}
    </>
  );
}
