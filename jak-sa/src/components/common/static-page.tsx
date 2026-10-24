import Image from "next/image";
import type { PageContent } from "@/types/navigation";

export function StaticPage({ page, locale, heading }: { page: PageContent | null; locale: "ar" | "en"; heading: string }) {
  if (!page) {
    return (
      <section className="container-app py-12 sm:py-16">
        <p className="text-[var(--color-muted)]">No content available.</p>
      </section>
    );
  }
  const paragraphs = page.content[locale]?.length ? page.content[locale] : page.content.ar;
  const image = page.images?.[locale] ?? page.images?.ar;

  return (
    <article className="container-app max-w-3xl py-8 sm:py-12">
      {heading ? <h1 className="mb-8 text-3xl font-extrabold">{heading}</h1> : null}
      {image && (
        <figure className="mb-8 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <Image
            src={image}
            alt={heading}
            width={1200}
            height={849}
            sizes="(max-width: 768px) 100vw, 768px"
            quality={75}
            className="h-auto w-full"
          />
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
