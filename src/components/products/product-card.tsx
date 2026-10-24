import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { pick } from "@/types/localization";
import type { Locale } from "@/config/locales";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "./add-to-cart-button";

interface ProductCardProps {
  product: Product;
  locale: Locale;
  addToCartLabel: string;
  addedLabel: string;
  priceTaxNote: string;
  view?: "grid" | "list";
}

export function ProductCard({ product, locale, addToCartLabel, addedLabel, priceTaxNote, view = "grid" }: ProductCardProps) {
  const name = pick(product.name, locale);
  const category = pick(product.categoryName, locale);

  if (view === "list") {
    return (
      <article className="group flex overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition-all duration-200 hover:shadow-[var(--shadow-card-hover)]">
        <Link
          href={`/${locale}/products/${product.slug}`}
          className="relative block w-24 shrink-0 bg-[var(--color-background)] sm:w-36"
        >
          {product.images[0] ? (
            <Image
              src={product.images[0].src}
              alt={pick(product.images[0].alt, locale)}
              fill
              sizes="(max-width: 640px) 96px, 144px"
              className="object-contain p-2 sm:p-3 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-muted-foreground)]">—</div>
          )}
        </Link>
        <div className="flex flex-1 flex-col justify-between gap-3 p-3 sm:flex-row sm:items-center sm:gap-6 sm:p-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-xs font-bold text-[var(--color-primary)]">{category}</span>
            <Link href={`/${locale}/products/${product.slug}`}>
              <h3 className="line-clamp-2 text-sm font-bold text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-primary)] sm:text-base">
                {name}
              </h3>
            </Link>
            <p className="text-[11px] text-[var(--color-muted-foreground)]">{priceTaxNote}</p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end sm:justify-center">
            <div className="flex items-baseline gap-1">
              {product.price ? (
                <span className="whitespace-nowrap text-base font-extrabold text-[var(--color-foreground)]">
                  {formatPrice(product.price.amount, "SAR", locale)}
                </span>
              ) : (
                <span className="text-sm text-[var(--color-muted)]">—</span>
              )}
            </div>
            <div className="w-full sm:w-36 shrink-0">
              <AddToCartButton product={product} label={addToCartLabel} addedLabel={addedLabel} locale={locale} />
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]">
      <Link href={`/${locale}/products/${product.slug}`} className="relative block aspect-square bg-[var(--color-background)]">
        {product.images[0] ? (
          <Image
            src={product.images[0].src}
            alt={pick(product.images[0].alt, locale)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-3 sm:p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--color-muted-foreground)]">—</div>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-4">
        <span className="text-xs font-bold text-[var(--color-primary)]">{category}</span>
        <Link href={`/${locale}/products/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-bold text-[var(--color-foreground)] transition-colors group-hover:text-[var(--color-primary)]">
            {name}
          </h3>
        </Link>
        <div className="mt-auto flex items-baseline gap-1 pt-1">
          {product.price ? (
            <span className="whitespace-nowrap text-base font-extrabold text-[var(--color-foreground)]">
              {formatPrice(product.price.amount, "SAR", locale)}
            </span>
          ) : (
            <span className="text-sm text-[var(--color-muted)]">—</span>
          )}
        </div>
        <p className="text-[11px] text-[var(--color-muted-foreground)]">{priceTaxNote}</p>
        <div className="mt-1">
          <AddToCartButton product={product} label={addToCartLabel} addedLabel={addedLabel} locale={locale} />
        </div>
      </div>
    </article>
  );
}
