import type { Product } from "@commerce/types";
import type { SortFilterItem } from "lib/constants";

export const defaultSort: SortFilterItem = {
  title: "Featured",
  slug: null,
  sortKey: "RELEVANCE",
  reverse: false,
};

export const sorting: SortFilterItem[] = [
  defaultSort,
  {
    title: "Newest",
    slug: "latest-desc",
    sortKey: "CREATED_AT",
    reverse: true,
  },
  {
    title: "Price: Low to High",
    slug: "price-asc",
    sortKey: "PRICE",
    reverse: false,
  },
  {
    title: "Price: High to Low",
    slug: "price-desc",
    sortKey: "PRICE",
    reverse: true,
  },
];

export function getSortFromSlug(
  slug?: string | null,
): Pick<SortFilterItem, "sortKey" | "reverse"> {
  const selectedSort =
    sorting.find((item) => item.slug === slug) || defaultSort;

  return {
    sortKey: selectedSort.sortKey,
    reverse: selectedSort.reverse,
  };
}

export function filterProductsByQuery(
  products: Product[],
  query?: string | null,
) {
  if (!query?.trim()) {
    return products;
  }

  const normalizedQuery = query.trim().toLowerCase();

  return products.filter((product) => {
    const searchableContent = [
      product.title,
      product.description,
      product.tags.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return searchableContent.includes(normalizedQuery);
  });
}
