import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface HeroProps {
  locale: "ar" | "en";
  badge: string;
  title: string;
  subtitle: string;
  cta: string;
  secondary: string;
}

export function HeroSection({ locale, badge, title, subtitle, cta, secondary }: HeroProps) {
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-[var(--color-primary)]/10 via-[var(--color-background)] to-[var(--color-accent)]/10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 px-4 py-20 sm:py-28">
        <span className="inline-flex w-fit items-center rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-xs font-extrabold text-[var(--color-primary)]">{badge}</span>
        <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-[var(--color-foreground)] sm:text-5xl">{title}</h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)]">{subtitle}</p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/${locale}/products`}
            className="inline-flex h-12 items-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-7 text-sm font-extrabold text-white transition-colors hover:bg-[var(--color-primary-dark)]"
          >
            {cta}
            <Arrow className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            href={`/${locale}/categories`}
            className="inline-flex h-12 items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-7 text-sm font-extrabold transition-colors hover:bg-[var(--color-background)]"
          >
            {secondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
