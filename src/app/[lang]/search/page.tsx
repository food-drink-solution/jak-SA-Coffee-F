import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { productRepository, categoryRepository } from "@/lib/data/catalog";
import { ProductGrid } from "@/components/products/product-grid";
import { alternatesFor } from "@/lib/seo/metadata";

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
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { q, category } = await searchParams;
  const dict = getDictionary(lang);
  const categories = await categoryRepository.getCategories();

  let products = q ? await productRepository.searchProducts(q, lang) : [];
  if (category) products = products.filter((p) => p.categoryIds.includes(category));

  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
      <h1 className="mb-2 text-3xl font-extrabold">{t(dict, "search.title")}</h1>
      {q && (
        <p className="mb-8 text-[var(--color-muted)]">
          {t(dict, "search.resultsFor")} <q className="font-bold text-[var(--color-foreground)]">{q}</q> — {products.length} {t(dict, "products.count")}
        </p>
      )}

      <form action={`/${lang}/search`} method="get" className="mb-8 flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">{t(dict, "search.placeholder")}</span>
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder={t(dict, "search.placeholder")}
            className="h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/40"
          />
        </label>
        <label>
          <span className="sr-only">{t(dict, "search.categoryFilter")}</span>
          <select
            name="category"
            defaultValue={category ?? ""}
            className="h-11 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm"
          >
            <option value="">{t(dict, "products.allCategories")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name[lang]}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="h-11 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 text-sm font-extrabold text-white">
          {t(dict, "nav.search")}
        </button>
      </form>

      {q === undefined || q === "" ? (
        <p className="text-[var(--color-muted)]">{t(dict, "search.placeholder")}</p>
      ) : products.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--color-border)] p-16 text-center">
          <p className="text-lg font-extrabold">{t(dict, "search.noResults")}</p>
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
