import Image from "next/image";

export function ValuePropositionSection({ title, text }: { title: string; text: string }) {
  return (
    <section className="container-app py-12 sm:py-16">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-extrabold leading-snug text-[var(--color-foreground)] sm:text-3xl">{title}</h2>
        <p className="mt-4 text-base leading-7 text-[var(--color-muted)] sm:text-lg sm:leading-8">{text}</p>
      </div>
    </section>
  );
}

export function TrustFeatures({ items }: { items: { label: string; image: string }[] }) {
  return (
    <section aria-label="features" className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container-app grid grid-cols-2 gap-4 sm:gap-6 py-12 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-3 rounded-[var(--radius-md)] p-3 text-center transition-colors hover:bg-[var(--color-surface-muted)]">
            <span className="flex h-12 w-12 items-center justify-center">
              <Image src={item.image} alt={item.label} width={50} height={50} className="h-[50px] w-[50px] object-contain transition-transform hover:scale-105" />
            </span>
            <p className="text-sm font-bold leading-6 text-[var(--color-foreground)]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function StatsBar({ items }: { items: { value: string; label: string }[] }) {
  return (
    <section className="container-app grid grid-cols-2 gap-3 py-10 sm:gap-4 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center shadow-sm transition-all hover:shadow-[var(--shadow-card-hover)] hover:-translate-y-0.5 sm:p-6">
          <p className="text-2xl font-extrabold text-[var(--color-primary)] sm:text-3xl">{item.value}</p>
          <p className="mt-1 text-xs font-bold text-[var(--color-muted)] sm:text-sm">{item.label}</p>
        </div>
      ))}
    </section>
  );
}
