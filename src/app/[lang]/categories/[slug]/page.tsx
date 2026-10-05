import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { categoryRepository, productRepository } from "@/lib/data/catalog";
import { ProductGrid } from "@/components/products/product-grid";
import { pick } from "@/types/localization";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateStaticParams() {
  const categories = await categoryRepository.getCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : "ar";
  const category = await categoryRepository.getCategoryBySlug(slug);
  if (!category) return {};
  return { title: pick(category.name, locale), alternates: alternatesFor(`/categories/${category.slug}`) };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const category = await categoryRepository.getCategoryBySlug(slug);
  if (!category) notFound();
  const products = await productRepository.getProductsByCategory(category.id);

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
      <h1 className="mb-8 text-3xl font-extrabold">{pick(category.name, lang)}</h1>
      {products.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-16 text-center">
          <p className="text-lg font-extrabold">{t(dict, "products.empty")}</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">{t(dict, "products.emptyDesc")}</p>
        </div>
      ) : (
        <ProductGrid
          products={products}
          locale={lang}
          labels={{ addToCart: t(dict, "products.addToCart"), added: t(dict, "cart.added"), priceTax: t(dict, "products.priceTax") }}
        />
      )}
    </section>
  );
}
