import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { productRepository, categoryRepository } from "@/lib/data/catalog";
import { ProductListing } from "@/components/products/product-listing";
import { alternatesFor } from "@/lib/seo/metadata";
import { paginate, parsePageParam, parseSortParam, sortProducts } from "@/lib/listing";
import { getListingLabels } from "@/lib/i18n/labels";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ar");
  return { title: t(dict, "nav.search"), alternates: alternatesFor("/search") };
}

export default async function SearchPage({
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

  let products = q ? await productRepository.searchProducts(q, lang) : [];
  if (category) products = products.filter((p) => p.categoryIds.includes(category));

  const sortKey = parseSortParam(sort);
  const sorted = sortProducts(products, sortKey, lang);
  const slice = paginate(sorted, parsePageParam(page));

  return (
    <section className="container-app py-8 sm:py-12">
      <h1 className="mb-2 text-3xl font-extrabold">{t(dict, "search.title")}</h1>
      {q && (
        <p className="mb-8 text-[var(--color-muted)]">
          {t(dict, "search.resultsFor")} <q className="font-bold text-[var(--color-foreground)]">{q}</q> — {slice.totalItems} {t(dict, "products.count")}
        </p>
      )}

      <ProductListing
        products={q ? slice.items : []}
        locale={lang}
        basePath={`/${lang}/search`}
        q={q}
        category={category}
        sort={sortKey}
        page={slice.page}
        totalPages={slice.totalPages}
        categories={categories.map((c) => ({ id: c.id, name: c.name[lang] }))}
        showSearch
        showCategoryFilter
        empty={
          !q ? (
            <p className="mb-8 text-[var(--color-muted)]">{t(dict, "search.placeholder")}</p>
          ) : (
            <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-16 text-center">
              <p className="text-lg font-extrabold">{t(dict, "search.noResults")}</p>
            </div>
          )
        }
        labels={getListingLabels(dict)}
      />
    </section>
  );
}
