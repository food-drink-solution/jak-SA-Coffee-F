import { t, type Dictionary } from "@/lib/i18n/dictionaries";
import type { SortKey } from "@/lib/listing";

export interface ListingLabels {
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
}

/** Assemble every label the product listing UI needs from the dictionary. */
export function getListingLabels(dict: Dictionary): ListingLabels {
  return {
    searchPlaceholder: t(dict, "search.placeholder"),
    searchSubmit: t(dict, "nav.search"),
    categoryLabel: t(dict, "products.filterCategory"),
    allCategories: t(dict, "products.allCategories"),
    sortLabel: t(dict, "listing.sortLabel"),
    sortOptions: {
      default: t(dict, "listing.sortDefault"),
      "name-asc": t(dict, "listing.sortNameAsc"),
      "name-desc": t(dict, "listing.sortNameDesc"),
      "price-asc": t(dict, "listing.sortPriceAsc"),
      "price-desc": t(dict, "listing.sortPriceDesc"),
    },
    viewLabel: t(dict, "listing.viewLabel"),
    viewGrid: t(dict, "listing.viewGrid"),
    viewList: t(dict, "listing.viewList"),
    addToCart: t(dict, "products.addToCart"),
    added: t(dict, "cart.added"),
    priceTax: t(dict, "products.priceTax"),
    pagination: {
      previous: t(dict, "listing.previous"),
      next: t(dict, "listing.next"),
      pageLabel: t(dict, "listing.pageLabel"),
      navLabel: t(dict, "listing.paginationLabel"),
    },
  };
}
