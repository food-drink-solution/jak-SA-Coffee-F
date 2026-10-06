"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/types/product";
import type { Locale } from "@/config/locales";
import type { SortKey } from "@/lib/listing";
import { ProductGrid } from "./product-grid";
import { ProductToolbar, type ListingView } from "./product-toolbar";
import { Pagination } from "@/components/ui/pagination";
import { listingHref } from "@/lib/listing";

interface ProductListingProps {
  products: Product[];
  locale: Locale;
  basePath: string;
  q?: string;
  category?: string;
  sort: SortKey;
  page: number;
  totalPages: number;
  categories: Array<{ id: string; name: string }>;
  showSearch: boolean;
  showCategoryFilter: boolean;
  empty?: ReactNode;
  labels: {
    searchPlaceholder: string;
    searchSubmit: string;
    categoryLabel: string;
    allCategories: string;
    sortLabel: string;
    sortOptions: Record<SortKey, string>;
    viewLabel: string;
    viewGrid: string;
    viewList: string;
    addToCart: string;
    added: string;
    priceTax: string;
    pagination: {
      previous: string;
      next: string;
      pageLabel: string;
      navLabel: string;
    };
  };
}

/**
 * Client composition of the listing controls (toolbar), the product grid and
 * pagination. Owns the grid/list view preference; filter/sort/page changes
 * are URL-driven (see ProductToolbar).
 */
export function ProductListing({
  products,
  locale,
  basePath,
  q,
  category,
  sort,
  page,
  totalPages,
  categories,
  showSearch,
  showCategoryFilter,
  empty,
  labels,
}: ProductListingProps) {
  const [view, setView] = useState<ListingView>("grid");

  return (
    <>
      <ProductToolbar
        basePath={basePath}
        locale={locale}
        q={q}
        category={category}
        sort={sort}
        view={view}
        onViewChange={setView}
        categories={categories}
        showSearch={showSearch}
        showCategoryFilter={showCategoryFilter}
        labels={{
          searchPlaceholder: labels.searchPlaceholder,
          searchSubmit: labels.searchSubmit,
          categoryLabel: labels.categoryLabel,
          allCategories: labels.allCategories,
          sortLabel: labels.sortLabel,
          sortOptions: labels.sortOptions,
          viewLabel: labels.viewLabel,
          viewGrid: labels.viewGrid,
          viewList: labels.viewList,
        }}
      />
      {products.length === 0 && empty ? (
        empty
      ) : (
        <ProductGrid
          products={products}
          locale={locale}
          view={view}
          labels={{ addToCart: labels.addToCart, added: labels.added, priceTax: labels.priceTax }}
        />
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        locale={locale}
        hrefForPage={(p) => listingHref(basePath, { q, category, sort }, p)}
        labels={labels.pagination}
      />
    </>
  );
}
