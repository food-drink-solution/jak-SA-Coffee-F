import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { categoryRepository, productRepository } from "@/lib/data/catalog";
import { ProductListing } from "@/components/products/product-listing";
import { pick } from "@/types/localization";
import { alternatesFor } from "@/lib/seo/metadata";
import { paginate, parsePageParam, parseSortParam, sortProducts } from "@/lib/listing";
import { getListingLabels } from "@/lib/i18n/labels";

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

export default async function CategoryDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ sort?: string; page?: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const { sort, page } = await searchParams;
  const dict = getDictionary(lang);
  const category = await categoryRepository.getCategoryBySlug(slug);
  if (!category) notFound();
  const products = await productRepository.getProductsByCategory(category.id);

  const sortKey = parseSortParam(sort);
  const sorted = sortProducts(products, sortKey, lang);
  const slice = paginate(sorted, parsePageParam(page));

  return (
    <section className="container-app py-8 sm:py-12">
      <h1 className="mb-8 text-2xl font-extrabold sm:text-3xl">{pick(category.name, lang)}</h1>
      <ProductListing
        products={slice.items}
        locale={lang}
        basePath={`/${lang}/categories/${category.slug}`}
        sort={sortKey}
        page={slice.page}
        totalPages={slice.totalPages}
        categories={[]}
        showSearch={false}
        showCategoryFilter={false}
        empty={
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
            <p className="text-lg font-extrabold">{t(dict, "products.empty")}</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{t(dict, "products.emptyDesc")}</p>
          </div>
        }
        labels={getListingLabels(dict)}
      />
    </section>
  );
}
