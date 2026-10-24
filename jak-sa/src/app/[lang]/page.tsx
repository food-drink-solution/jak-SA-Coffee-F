import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { categoryRepository, getBestSellers } from "@/lib/data/catalog";
import { HeroSection } from "@/components/sections/hero-section";
import { ValuePropositionSection, TrustFeatures } from "@/components/sections/value-sections";
import { DownloadSection, ProductSizesSection } from "@/components/sections/order-cta";
import { SectionHeading } from "@/components/common/section-heading";
import { ProductGrid } from "@/components/products/product-grid";
import { CategoryCard } from "@/components/categories/category-card";
import { alternatesFor } from "@/lib/seo/metadata";
import Image from "next/image";
import { pick } from "@/types/localization";

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

  const features = [
    { label: t(dict, "home.features.quality"), image: "/images/home/feature-quality.webp" },
    { label: t(dict, "home.features.count"), image: "/images/home/feature-count.webp" },
    { label: t(dict, "home.features.source"), image: "/images/home/feature-source.webp" },
    { label: t(dict, "home.features.support"), image: "/images/home/feature-support.webp" },
    { label: t(dict, "home.features.size"), image: "/images/home/feature-size.webp" },
    { label: t(dict, "home.features.date"), image: "/images/home/feature-date.webp" },
    { label: t(dict, "home.features.delivery"), image: "/images/home/feature-delivery.webp" },
    { label: t(dict, "home.features.deliveryTime"), image: "/images/home/feature-delivery-time.webp" },
  ];

  const heroSlides = [
    { image: "/images/home/hero-slide-1.webp", title: t(dict, "home.heroSlide1") },
    { image: "/images/home/hero-slide-2.webp", title: t(dict, "home.heroSlide2") },
    { image: "/images/home/hero-slide-3.webp", title: t(dict, "home.heroSlide3") },
    { image: "/images/home/hero-slide-4.webp", title: t(dict, "home.heroSlide4") },
  ];

  const iconMap: Record<string, string> = {
    sandwiches: "/images/home/icons/sandwiches.png",
    crossonite: "/images/home/icons/croissant.png",
    pretzel: "/images/home/icons/pretzel.png",
    salad: "/images/home/icons/salads.png",
    desserts: "/images/home/icons/desserts.png",
    beverage: "/images/home/icons/beverages.png",
  };

  return (
    <>
      <HeroSection locale={lang} cta={t(dict, "home.heroCta")} slides={heroSlides} />

      <ValuePropositionSection title={t(dict, "home.valuesTitle")} text={t(dict, "home.valuesText")} />

      <TrustFeatures items={features} />

      <section className="container-app py-8 sm:py-12">
        <SectionHeading
          title={t(dict, "home.bestSellers")}
          action={
            <Link href={`/${lang}/products`} className="text-sm font-extrabold text-[var(--color-primary-text)] transition-colors hover:underline focus-ring rounded">
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

      <section className="container-app py-8 sm:py-12">
        <SectionHeading title={t(dict, "home.categoriesTitle")} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-5">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} locale={lang} cta={t(dict, "categories.shopNow")} />
          ))}
        </div>
      </section>

      <ProductSizesSection title={t(dict, "home.sizesTitle")} text={t(dict, "home.sizesText")} image="/images/home/sizes-background.jpg" />

      <section className="container-app py-8 sm:py-12">
        <div className="mb-6">
          <h3 className="text-xl font-extrabold text-[var(--color-foreground)] sm:text-2xl">{t(dict, "home.ourCategories")}</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
          {categories.map((c) => {
            const name = pick(c.name, lang);
            const icon = iconMap[c.slug];
            return (
              <Link
                key={c.id}
                href={`/${lang}/categories/${c.slug}`}
                className="group flex flex-col items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-primary-text)]/30 hover:shadow-md focus-ring"
              >
                <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-header-foreground)] p-2 shadow-sm transition-transform duration-300 group-hover:scale-110">
                  {icon || c.image ? (
                    <Image src={icon ?? c.image!} alt={name} width={64} height={64} className="h-full w-full object-contain" />
                  ) : null}
                </span>
                <span className="text-sm font-bold text-[var(--color-foreground)] group-hover:text-[var(--color-primary-text)]">{name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <DownloadSection title={t(dict, "home.orderTitle")} text={t(dict, "home.orderText")} />
    </>
  );
}
