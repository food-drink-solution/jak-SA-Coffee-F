import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { productRepository, categoryRepository } from "@/lib/data/catalog";
import { ProductListing } from "@/components/products/product-listing";
import { SectionHeading } from "@/components/common/section-heading";
import { alternatesFor } from "@/lib/seo/metadata";
import { paginate, parsePageParam, parseSortParam, sortProducts } from "@/lib/listing";
import { getListingLabels } from "@/lib/i18n/labels";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ar");
  return { title: t(dict, "products.title"), alternates: alternatesFor("/products") };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { q, category, sort, page } = await searchParams;
  const dict = getDictionary(lang);
  const categories = await categoryRepository.getCategories();

  let products = q ? await productRepository.searchProducts(q, lang) : await productRepository.getProducts();
  if (category) {
    products = products.filter((p) => p.categoryIds.includes(category));
  }

  const sortKey = parseSortParam(sort);
  const sorted = sortProducts(products, sortKey, lang);
  const slice = paginate(sorted, parsePageParam(page));

  const labels = getListingLabels(dict);

  return (
    <section className="container-app py-8 sm:py-12">
      <SectionHeading
        title={t(dict, "products.title")}
        action={<span className="text-sm text-[var(--color-muted)]">{slice.totalItems} {t(dict, "products.count")}</span>}
      />

      <ProductListing
        products={slice.items}
        locale={lang}
        basePath={`/${lang}/products`}
        q={q}
        category={category}
        sort={sortKey}
        page={slice.page}
        totalPages={slice.totalPages}
        categories={categories.map((c) => ({ id: c.id, name: c.name[lang] }))}
        showSearch
        showCategoryFilter
        empty={
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-16 text-center">
            <p className="text-lg font-extrabold">{t(dict, "products.empty")}</p>
            <p className="mt-2 text-sm text-[var(--color-muted)]">{t(dict, "products.emptyDesc")}</p>
          </div>
        }
        labels={labels}
      />
    </section>
  );
}
