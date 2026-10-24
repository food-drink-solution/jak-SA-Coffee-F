import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { categoryRepository } from "@/lib/data/catalog";
import { CategoryCard } from "@/components/categories/category-card";
import { SectionHeading } from "@/components/common/section-heading";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ar");
  return { title: t(dict, "categories.title"), alternates: alternatesFor("/categories") };
}

export default async function CategoriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const categories = await categoryRepository.getCategories();

  return (
    <section className="container-app py-8 sm:py-12">
      <SectionHeading title={t(dict, "categories.title")} />
      {categories.length === 0 ? (
        <p className="text-[var(--color-muted)]">{t(dict, "categories.empty")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} locale={lang} cta={t(dict, "categories.products")} />
          ))}
        </div>
      )}
    </section>
  );
}
