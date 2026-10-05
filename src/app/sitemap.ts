import type { MetadataRoute } from "next";
import { LOCALES } from "@/config/locales";
import { siteConfig } from "@/config/site";
import { productRepository, categoryRepository, pageRepository } from "@/lib/data/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await productRepository.getProducts();
  const categories = await categoryRepository.getCategories();
  const pages = await pageRepository.getPages();

  const staticRoutes = ["", "/products", "/categories", "/search", "/about", "/contact", "/terms", "/privacy", "/profile"];

  const entries: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const route of staticRoutes) {
      entries.push({ url: `${siteConfig.url}/${locale}${route}`, changeFrequency: route === "" ? "daily" : "weekly", priority: route === "" ? 1 : 0.7 });
    }
    for (const product of products) {
      entries.push({ url: `${siteConfig.url}/${locale}/products/${product.slug}`, changeFrequency: "weekly", priority: 0.8 });
    }
    for (const category of categories) {
      entries.push({ url: `${siteConfig.url}/${locale}/categories/${category.slug}`, changeFrequency: "weekly", priority: 0.6 });
    }
    for (const page of pages) {
      entries.push({ url: `${siteConfig.url}/${locale}/${page.slug === "contact" ? "contact" : page.slug === "about" ? "about" : page.slug === "terms" ? "terms" : "privacy"}`, changeFrequency: "monthly", priority: 0.4 });
    }
  }
  return entries;
}
