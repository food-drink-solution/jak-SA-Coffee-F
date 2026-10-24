import productsData from "@/data/products/products.json";
import categoriesData from "@/data/categories/categories.json";
import pagesData from "@/data/pages/pages.json";
import companyData from "@/data/company/company.json";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";
import type { CompanyProfile, PageContent } from "@/types/navigation";
import type { Locale } from "@/config/locales";

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  searchProducts(query: string, locale: Locale): Promise<Product[]>;
}

const products = productsData as unknown as Product[];
const categories = categoriesData as unknown as Category[];
const pages = pagesData as unknown as PageContent[];
const company = companyData as unknown as CompanyProfile;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/\s+/g, " ")
    .trim();
}

export class LocalProductRepository implements ProductRepository {
  async getProducts(): Promise<Product[]> {
    return products;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return products.find((p) => p.slug === slug || p.id === slug) ?? null;
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return products.filter((p) => p.categoryIds.includes(categoryId));
  }

  async searchProducts(query: string, locale: Locale): Promise<Product[]> {
    const q = normalize(query);
    if (!q) return products;
    const matches = products.filter((p) => {
      const haystack = [p.name.ar, p.name.en, p.description.ar, p.description.en, p.categoryName.ar, p.categoryName.en, ...p.tags]
        .map(normalize)
        .join(" ");
      return haystack.includes(q);
    });
    // Prefer products whose localized name matches the query in the requested locale.
    return matches.sort((a, b) => {
      const aScore = normalize(a.name[locale]).includes(q) ? 0 : 1;
      const bScore = normalize(b.name[locale]).includes(q) ? 0 : 1;
      return aScore - bScore;
    });
  }
}

export class LocalCategoryRepository {
  async getCategories(): Promise<Category[]> {
    return categories;
  }
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return categories.find((c) => c.slug === slug || c.id === slug) ?? null;
  }
}

export class LocalPageRepository {
  async getPages(): Promise<PageContent[]> {
    return pages;
  }
  async getPageBySlug(slug: string): Promise<PageContent | null> {
    return pages.find((p) => p.slug === slug || p.id === slug) ?? null;
  }
}

export function getCompany(): CompanyProfile {
  return company;
}

export function getRelatedProducts(product: Product, limit = 8): Product[] {
  return products.filter((p) => p.id !== product.id && p.categoryIds.some((c) => product.categoryIds.includes(c))).slice(0, limit);
}

export function getBestSellers(limit = 12): Product[] {
  // The source highlights these IDs as bestsellers on its homepage.
  const featuredIds = ["91", "92", "114", "115", "119", "37", "45", "47", "48", "49", "54", "68", "69", "79", "80", "8", "6", "4"];
  const byId = new Map(products.map((p) => [p.id, p]));
  const picked = featuredIds.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
  return picked.slice(0, limit);
}

export const productRepository = new LocalProductRepository();
export const categoryRepository = new LocalCategoryRepository();
export const pageRepository = new LocalPageRepository();
