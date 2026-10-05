import { BadgeCheck, Clock4, Layers, PhoneCall, Snowflake, Truck, CalendarCheck } from "lucide-react";

export function ValuePropositionSection({ title, text }: { title: string; text: string }) {
  return (
    <section className="mx-auto w-full max-w-[1200px] px-4 py-16">
      <div className="max-w-3xl">
        <h2 className="text-3xl font-extrabold leading-snug">{title}</h2>
        <p className="mt-4 leading-8 text-[var(--color-muted)]">{text}</p>
      </div>
    </section>
  );
}

export function TrustFeatures({ features }: { features: Record<string, string> }) {
  const icons = [BadgeCheck, Layers, Snowflake, CalendarCheck, PhoneCall, Truck, Clock4, Truck];
  const entries = Object.values(features);
  return (
    <section aria-label="features" className="bg-[var(--color-surface)] border-y border-[var(--color-border)]">
      <div className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-6 px-4 py-12 md:grid-cols-4">
        {entries.map((label, i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={label} className="flex flex-col items-start gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-sm font-bold leading-6">{label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function StatsBar({ items }: { items: { value: string; label: string }[] }) {
  return (
    <section className="mx-auto grid w-full max-w-[1200px] grid-cols-2 gap-4 px-4 py-12 md:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
          <p className="text-3xl font-extrabold text-[var(--color-primary)]">{item.value}</p>
          <p className="mt-1 text-sm text-[var(--color-muted)]">{item.label}</p>
        </div>
      ))}
    </section>
  );
}
