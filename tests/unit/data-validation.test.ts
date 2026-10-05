import { describe, expect, it } from "vitest";
import { z } from "zod";
import { CompanyProfileSchema, CategorySchema, PageContentSchema, ProductSchema } from "@/lib/validation/schemas";
import productsData from "@/data/products/products.json";
import categoriesData from "@/data/categories/categories.json";
import pagesData from "@/data/pages/pages.json";
import companyData from "@/data/company/company.json";

describe("dataset validation", () => {
  it("products conform to ProductSchema", () => {
    const result = z.array(ProductSchema).safeParse(productsData);
    if (!result.success) console.error(result.error.issues.slice(0, 5));
    expect(result.success).toBe(true);
  });

  it("categories conform to CategorySchema", () => {
    const result = z.array(CategorySchema).safeParse(categoriesData);
    expect(result.success).toBe(true);
  });

  it("pages conform to PageContentSchema", () => {
    const result = z.array(PageContentSchema).safeParse(pagesData);
    expect(result.success).toBe(true);
  });

  it("company profile conforms to CompanyProfileSchema", () => {
    const result = CompanyProfileSchema.safeParse(companyData);
    expect(result.success).toBe(true);
  });

  it("product slugs are unique", () => {
    const slugs = (productsData as { slug: string }[]).map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
