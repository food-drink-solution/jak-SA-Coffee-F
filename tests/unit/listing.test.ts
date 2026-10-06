import { describe, expect, it } from "vitest";
import {
  PRODUCTS_PER_PAGE,
  isSortKey,
  listingHref,
  paginate,
  parsePageParam,
  parseSortParam,
  sortProducts,
} from "@/lib/listing";
import type { Product } from "@/types/product";

function makeProduct(id: string, nameAr: string, nameEn: string, amount?: number): Product {
  return {
    id,
    slug: id,
    name: { ar: nameAr, en: nameEn },
    description: { ar: "", en: "" },
    categoryIds: [],
    categoryName: { ar: "", en: "" },
    subcategoryName: { ar: "", en: "" },
    images: [],
    price: amount === undefined ? undefined : { amount, currency: "SAR" },
    attributes: [],
    tags: [],
  };
}

describe("parseSortParam / isSortKey", () => {
  it("accepts known keys and falls back to default", () => {
    expect(parseSortParam("name-asc")).toBe("name-asc");
    expect(parseSortParam("price-desc")).toBe("price-desc");
    expect(parseSortParam("nonsense")).toBe("default");
    expect(parseSortParam(undefined)).toBe("default");
    expect(parseSortParam("")).toBe("default");
    expect(isSortKey("price-asc")).toBe(true);
    expect(isSortKey("bogus")).toBe(false);
  });
});

describe("parsePageParam", () => {
  it("clamps to a positive integer", () => {
    expect(parsePageParam("1")).toBe(1);
    expect(parsePageParam("3")).toBe(3);
    expect(parsePageParam("0")).toBe(1);
    expect(parsePageParam("-4")).toBe(1);
    expect(parsePageParam("abc")).toBe(1);
    expect(parsePageParam(undefined)).toBe(1);
    expect(parsePageParam("2.9")).toBe(2);
  });
});

describe("sortProducts", () => {
  const list = [
    makeProduct("a", "تين", "Fig", 3),
    makeProduct("b", "تفاح", "Apple", 1),
    makeProduct("c", "موز", "Banana"),
  ];

  it("keeps the default order untouched", () => {
    expect(sortProducts(list, "default", "ar").map((p) => p.id)).toEqual(["a", "b", "c"]);
  });

  it("sorts by English name ascending and descending", () => {
    expect(sortProducts(list, "name-asc", "en").map((p) => p.id)).toEqual(["b", "c", "a"]);
    expect(sortProducts(list, "name-desc", "en").map((p) => p.id)).toEqual(["a", "c", "b"]);
  });

  it("sorts by price ascending with unpriced items last", () => {
    expect(sortProducts(list, "price-asc", "en").map((p) => p.id)).toEqual(["b", "a", "c"]);
  });

  it("sorts by price descending with unpriced items last", () => {
    expect(sortProducts(list, "price-desc", "en").map((p) => p.id)).toEqual(["a", "b", "c"]);
  });

  it("does not mutate the input array", () => {
    const copy = [...list];
    sortProducts(list, "price-desc", "en");
    expect(list).toEqual(copy);
  });
});

describe("paginate", () => {
  const items = Array.from({ length: 50 }, (_, i) => i + 1);

  it("slices the requested page", () => {
    const slice = paginate(items, 2, 24);
    expect(slice.items).toHaveLength(24);
    expect(slice.items[0]).toBe(25);
    expect(slice.totalPages).toBe(3);
    expect(slice.totalItems).toBe(50);
  });

  it("clamps out-of-range pages", () => {
    expect(paginate(items, 0).page).toBe(1);
    expect(paginate(items, 99, 24).page).toBe(3);
  });

  it("handles the empty list", () => {
    const slice = paginate([], 1);
    expect(slice.items).toEqual([]);
    expect(slice.totalPages).toBe(1);
    expect(slice.page).toBe(1);
  });

  it("uses PRODUCTS_PER_PAGE by default", () => {
    const slice = paginate(Array.from({ length: 60 }, (_, i) => i), 1);
    expect(slice.items).toHaveLength(PRODUCTS_PER_PAGE);
  });
});

describe("listingHref", () => {
  it("keeps active filters and sets the page", () => {
    expect(listingHref("/ar/products", { q: "k", category: "37", sort: "price-asc" }, 2)).toBe(
      "/ar/products?q=k&category=37&sort=price-asc&page=2",
    );
  });

  it("omits the default sort and the first page", () => {
    expect(listingHref("/ar/products", { sort: "default" }, 1)).toBe("/ar/products");
  });

  it("omits empty params", () => {
    expect(listingHref("/ar/search", {}, 1)).toBe("/ar/search");
  });
});
