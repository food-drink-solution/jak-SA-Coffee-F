import type { Locale } from "@/config/locales";
import { pick } from "@/types/localization";
import type { Product } from "@/types/product";

export const PRODUCTS_PER_PAGE = 24;

export const SORT_KEYS = ["default", "name-asc", "name-desc", "price-asc", "price-desc"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export function isSortKey(value: string | undefined | null): value is SortKey {
  return typeof value === "string" && (SORT_KEYS as readonly string[]).includes(value);
}

export function parseSortParam(value: string | undefined | null): SortKey {
  return isSortKey(value) ? value : "default";
}

export function parsePageParam(value: string | undefined | null): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.floor(n);
}

/**
 * Sort a copy of the product list. Products without a price are always
 * pushed to the end for price sorts; the default order is preserved.
 */
export function sortProducts(products: Product[], sort: SortKey, locale: Locale): Product[] {
  if (sort === "default") return [...products];
  const sorted = [...products];
  switch (sort) {
    case "name-asc":
      sorted.sort((a, b) => pick(a.name, locale).localeCompare(pick(b.name, locale), locale === "ar" ? "ar" : "en"));
      break;
    case "name-desc":
      sorted.sort((a, b) => pick(b.name, locale).localeCompare(pick(a.name, locale), locale === "ar" ? "ar" : "en"));
      break;
    case "price-asc":
      sorted.sort((a, b) => comparePrices(a, b, "asc"));
      break;
    case "price-desc":
      sorted.sort((a, b) => comparePrices(a, b, "desc"));
      break;
  }
  return sorted;
}

function comparePrices(a: Product, b: Product, direction: "asc" | "desc"): number {
  // Products without a price always sort last.
  if (!a.price && !b.price) return 0;
  if (!a.price) return 1;
  if (!b.price) return -1;
  return direction === "asc" ? a.price.amount - b.price.amount : b.price.amount - a.price.amount;
}

export interface PageSlice<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export function paginate<T>(items: T[], page: number, perPage: number = PRODUCTS_PER_PAGE): PageSlice<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  return { items: items.slice(start, start + perPage), page: safePage, totalPages, totalItems };
}

/** Build a listing URL keeping every active filter/sort param and overriding the page. */
export function listingHref(
  basePath: string,
  params: { q?: string; category?: string; sort?: string },
  page: number,
): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.category) search.set("category", params.category);
  if (params.sort && params.sort !== "default") search.set("sort", params.sort);
  if (page > 1) search.set("page", String(page));
  const qs = search.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
