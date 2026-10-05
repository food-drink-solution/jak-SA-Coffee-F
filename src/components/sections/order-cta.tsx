import Link from "next/link";

export function OrderCtaSection({ title, text, cta, locale }: { title: string; text: string; cta: string; locale: "ar" | "en" }) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12">
      <div className="flex flex-col items-start justify-between gap-6 rounded-[var(--radius-xl)] bg-[var(--color-primary)] p-10 text-white md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-extrabold">{title}</h2>
          <p className="mt-3 leading-7 text-white/80">{text}</p>
        </div>
        <Link
          href={`/${locale}/products`}
          className="inline-flex h-12 items-center rounded-[var(--radius-md)] bg-[var(--color-accent)] px-8 font-extrabold text-[var(--color-accent-foreground)] transition-transform hover:scale-[1.03]"
        >
          {cta}
        </Link>
      </div>
    </section>
  );
}

export function ProductSizesSection({ title, text }: { title: string; text: string }) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-12">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-extrabold">{title}</h2>
        <p className="mt-4 leading-8 text-[var(--color-muted)]">{text}</p>
      </div>
    </section>
  );
}
