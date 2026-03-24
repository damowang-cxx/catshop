import { getCollections, getPages, getProducts } from "lib/commerce";
import { locales } from "lib/i18n/config";
import { addLocaleToPath } from "lib/i18n/utils";
import { baseUrl, validateEnvironmentVariables } from "lib/utils";
import { MetadataRoute } from "next";
import type { Collection, Page, Product } from "@commerce/types";

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const buildLocalizedRoutes = (path: string, lastModified: string): Route[] =>
    locales.map((locale) => ({
      url: `${baseUrl}${addLocaleToPath(path, locale)}`,
      lastModified,
    }));

  const routesMap = buildLocalizedRoutes("/", new Date().toISOString());

  const collectionsPromise = getCollections().then(
    (collections: Collection[]) =>
      collections.flatMap((collection) =>
        buildLocalizedRoutes(collection.path, collection.updatedAt),
      ),
  );

  const productsPromise = getProducts({}).then((products: Product[]) =>
    products.flatMap((product) =>
      buildLocalizedRoutes(`/product/${product.handle}`, product.updatedAt),
    ),
  );

  const pagesPromise = getPages().then((pages: Page[]) =>
    pages.flatMap((page) =>
      buildLocalizedRoutes(`/${page.handle}`, page.updatedAt),
    ),
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise, pagesPromise])
    ).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  return [...routesMap, ...fetchedRoutes];
}
