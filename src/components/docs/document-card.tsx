import { FileText } from "lucide-react";
import type { DocumentResource } from "@/types/navigation";
import { pick } from "@/types/localization";
import type { Locale } from "@/config/locales";

export function DocumentCard({ doc, locale, downloadLabel }: { doc: DocumentResource; locale: Locale; downloadLabel: string }) {
  return (
    <a
      href={doc.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-shadow hover:shadow-[var(--shadow-card-hover)]"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
        <FileText className="h-6 w-6" aria-hidden />
      </span>
      <span className="flex-1">
        <span className="block font-extrabold">{pick(doc.title, locale)}</span>
        <span className="block text-xs uppercase tracking-wide text-[var(--color-muted)]">{doc.type} · {doc.locale.toUpperCase()}</span>
      </span>
      <span className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-xs font-extrabold text-[var(--color-primary)]">{downloadLabel}</span>
    </a>
  );
}
