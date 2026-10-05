import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { categoryRepository, getBestSellers } from "@/lib/data/catalog";
import { HeroSection } from "@/components/sections/hero-section";
import { ValuePropositionSection, TrustFeatures, StatsBar } from "@/components/sections/value-sections";
import { OrderCtaSection, ProductSizesSection } from "@/components/sections/order-cta";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductGrid } from "@/components/products/product-grid";
import { CategoryCard } from "@/components/categories/category-card";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "ar";
  return {
    title: t(getDictionary(locale), "meta.siteTitle"),
    description: t(getDictionary(locale), "meta.siteDescription"),
    alternates: alternatesFor("/"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const bestSellers = getBestSellers(8);
  const categories = await categoryRepository.getCategories();

  const features: Record<string, string> = {
    quality: t(dict, "home.features.quality"),
    size: t(dict, "home.features.size"),
    source: t(dict, "home.features.source"),
    date: t(dict, "home.features.date"),
    support: t(dict, "home.features.support"),
    delivery: t(dict, "home.features.delivery"),
    count: t(dict, "home.features.count"),
    deliveryTime: t(dict, "home.features.deliveryTime"),
  };

  return (
    <>
      <HeroSection
        locale={lang}
        badge={t(dict, "home.heroBadge")}
        title={t(dict, "home.heroTitle")}
        subtitle={t(dict, "home.heroSubtitle")}
        cta={t(dict, "home.heroCta")}
        secondary={t(dict, "home.heroSecondary")}
      />

      <section className="mx-auto w-full max-w-[1200px] px-4 py-4">
        <ValuePropositionSection title={t(dict, "home.valuesTitle")} text={t(dict, "home.valuesText")} />
      </section>

      <TrustFeatures features={features} />

      <StatsBar
        items={[
          { value: t(dict, "home.statsProductsValue"), label: t(dict, "home.statsProducts") },
          { value: t(dict, "home.statsCoverageValue"), label: t(dict, "home.statsCoverage") },
          { value: "6", label: t(dict, "home.categoriesTitle") },
          { value: "24/7", label: t(dict, "home.features.support") },
        ]}
      />

      <section className="mx-auto w-full max-w-[1200px] px-4 py-6">
        <SectionHeading
          title={t(dict, "home.bestSellers")}
          action={
            <Link href={`/${lang}/products`} className="text-sm font-extrabold text-[var(--color-primary)]">
              {t(dict, "common.viewAll")}
            </Link>
          }
        />
        <ProductGrid
          products={bestSellers}
          locale={lang}
          labels={{ addToCart: t(dict, "products.addToCart"), added: t(dict, "cart.added"), priceTax: t(dict, "products.priceTax") }}
        />
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
        <SectionHeading title={t(dict, "home.categoriesTitle")} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} locale={lang} cta={t(dict, "categories.products")} />
          ))}
        </div>
      </section>

      <ProductSizesSection title={t(dict, "home.sizesTitle")} text={t(dict, "home.sizesText")} />
      <OrderCtaSection title={t(dict, "home.orderTitle")} text={t(dict, "home.orderText")} cta={t(dict, "home.orderButton")} locale={lang} />
    </>
  );
}
