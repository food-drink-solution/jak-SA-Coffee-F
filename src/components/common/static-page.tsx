import Image from "next/image";
import type { PageContent } from "@/types/navigation";

export function StaticPage({ page, locale, heading }: { page: PageContent | null; locale: "ar" | "en"; heading: string }) {
  if (!page) {
    return (
      <section className="mx-auto w-full max-w-[1200px] px-4 py-16">
        <p className="text-[var(--color-muted)]">No content available.</p>
      </section>
    );
  }
  const paragraphs = page.content[locale]?.length ? page.content[locale] : page.content.ar;
  const image = page.images?.[locale] ?? page.images?.ar;

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-12">
      {heading ? <h1 className="mb-8 text-3xl font-extrabold">{heading}</h1> : null}
      {image && (
        <figure className="mb-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <Image src={image} alt={heading} width={900} height={600} className="h-auto w-full" unoptimized />
        </figure>
      )}
      <div className="space-y-4 leading-8 text-[var(--color-foreground)]/90">
        {paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </article>
  );
}
