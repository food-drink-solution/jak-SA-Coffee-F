import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/category";
import { pick } from "@/types/localization";
import type { Locale } from "@/config/locales";

export function CategoryCard({ category, locale, cta }: { category: Category; locale: Locale; cta: string }) {
  const name = pick(category.name, locale);
  return (
    <Link
      href={`/${locale}/categories/${category.slug}`}
      className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] text-center shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-card-hover)]"
    >
      <div className="relative aspect-[4/3] bg-[var(--color-background)]">
        {category.image ? (
          <Image src={category.image} alt={name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl" aria-hidden>
            🥐
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-extrabold text-[var(--color-foreground)]">{name}</h3>
        <p className="mt-1 text-xs font-bold text-[var(--color-primary)]">{cta}</p>
      </div>
    </Link>
  );
}
