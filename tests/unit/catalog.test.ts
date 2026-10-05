import { describe, expect, it } from "vitest";
import { productRepository, categoryRepository, pageRepository, getBestSellers, getRelatedProducts } from "@/lib/data/catalog";
import type { Product } from "@/types/product";

describe("LocalProductRepository", () => {
  it("returns all products", async () => {
    const products = await productRepository.getProducts();
    expect(products.length).toBeGreaterThan(50);
  });

  it("finds a product by slug and returns null for unknown slugs", async () => {
    const products = await productRepository.getProducts();
    const hit = await productRepository.getProductBySlug(products[0].slug);
    expect(hit?.id).toBe(products[0].id);
    expect(await productRepository.getProductBySlug("no-such-slug")).toBeNull();
  });

  it("filters by category", async () => {
    const categories = await categoryRepository.getCategories();
    const products = await productRepository.getProductsByCategory(categories[0].id);
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.categoryIds.includes(categories[0].id))).toBe(true);
  });

  it("searches by Arabic and English queries", async () => {
    const ar = await productRepository.searchProducts("كرواسان", "ar");
    const en = await productRepository.searchProducts("croissant", "en");
    expect(ar.length).toBeGreaterThan(0);
    expect(en.length).toBeGreaterThan(0);
  });
});

describe("LocalCategoryRepository", () => {
  it("returns categories with bilingual names", async () => {
    const categories = await categoryRepository.getCategories();
    expect(categories.length).toBeGreaterThan(0);
    for (const c of categories) {
      expect(c.name.ar).toBeTruthy();
      expect(c.name.en).toBeTruthy();
      expect(c.slug).toBeTruthy();
    }
  });
});

describe("LocalPageRepository", () => {
  it("returns the legal/content pages", async () => {
    const pages = await pageRepository.getPages();
    const ids = pages.map((p) => p.id);
    expect(ids).toEqual(expect.arrayContaining(["about", "contact", "terms", "privacy"]));
  });
});

describe("derived collections", () => {
  it("best sellers are real products", async () => {
    const best = getBestSellers(8);
    expect(best.length).toBeGreaterThan(0);
    expect(best.length).toBeLessThanOrEqual(8);
  });

  it("related products share a category and exclude the product itself", async () => {
    const products = await productRepository.getProducts();
    const withCategory = products.find((p) => p.categoryIds.length > 0) as Product;
    const related = getRelatedProducts(withCategory, 4);
    expect(related.every((p) => p.id !== withCategory.id)).toBe(true);
  });
});
