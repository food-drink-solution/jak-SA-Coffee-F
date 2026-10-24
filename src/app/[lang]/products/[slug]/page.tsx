import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { productRepository, getRelatedProducts } from "@/lib/data/catalog";
import { pick } from "@/types/localization";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/products/add-to-cart-button";
import { ProductGrid } from "@/components/products/product-grid";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateStaticParams() {
  const products = await productRepository.getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : "ar";
  const product = await productRepository.getProductBySlug(slug);
  if (!product) return {};
  return {
    title: pick(product.name, locale),
    description: pick(product.description, locale).slice(0, 160),
    alternates: alternatesFor(`/products/${product.slug}`),
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const product = await productRepository.getProductBySlug(slug);
  if (!product) notFound();
  const related = getRelatedProducts(product, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name.en,
    description: product.description.en,
    image: product.images.map((i) => `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}${i.src}`),
    offers: product.price
      ? { "@type": "Offer", price: product.price.amount, priceCurrency: "SAR", availability: "https://schema.org/InStock" }
      : undefined,
  };

  return (
    <article className="container-app py-8 sm:py-12">
      <nav aria-label="breadcrumb" className="mb-6 text-sm text-[var(--color-muted)]">
        <Link href={`/${lang}`} className="hover:underline">{t(dict, "nav.home")}</Link>
        <span aria-hidden> / </span>
        <Link href={`/${lang}/products`} className="hover:underline">{t(dict, "nav.products")}</Link>
        <span aria-hidden> / </span>
        <span aria-current="page">{pick(product.name, lang)}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="relative aspect-square rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)]">
          {product.images[0] && (
            <Image
              src={product.images[0].src}
              alt={pick(product.images[0].alt, lang)}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-10"
            />
          )}
        </div>

        <div>
          <p className="text-sm font-extrabold text-[var(--color-primary)]">{pick(product.categoryName, lang)}</p>
          <h1 className="mt-2 text-2xl font-extrabold leading-snug sm:text-3xl">{pick(product.name, lang)}</h1>
          {product.price && (
            <p className="mt-4 text-2xl font-extrabold">
              {formatPrice(product.price.amount, "SAR", lang)}
              <span className="ms-2 text-xs font-normal text-[var(--color-muted)]">{t(dict, "products.priceTax")}</span>
            </p>
          )}
          <p className="mt-6 leading-8 text-[var(--color-muted)]">{pick(product.description, lang)}</p>

          {product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-xs font-bold text-[var(--color-primary)]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <dl className="mt-8 divide-y divide-[var(--color-border)] rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            {product.attributes.map((attr) => (
              <div key={attr.key} className="flex items-center justify-between px-4 py-3">
                <dt className="text-sm text-[var(--color-muted)]">{pick(attr.label, lang)}</dt>
                <dd className="text-sm font-bold">{pick(attr.value, lang)}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 w-full sm:max-w-xs">
            <AddToCartButton product={product} label={t(dict, "products.addToCart")} addedLabel={t(dict, "cart.added")} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-extrabold">{t(dict, "products.related")}</h2>
          <ProductGrid
            products={related}
            locale={lang}
            labels={{ addToCart: t(dict, "products.addToCart"), added: t(dict, "cart.added"), priceTax: t(dict, "products.priceTax") }}
          />
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
