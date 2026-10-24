import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/config/locales";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  locale: Locale;
  hrefForPage: (page: number) => string;
  labels: {
    previous: string;
    next: string;
    pageLabel: string;
    navLabel: string;
  };
}

function pageNumbers(current: number, total: number): Array<number | "ellipsis"> {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: Array<number | "ellipsis"> = [1];
  const windowStart = Math.max(2, current - 1);
  const windowEnd = Math.min(total - 1, current + 1);
  if (windowStart > 2) pages.push("ellipsis");
  for (let n = windowStart; n <= windowEnd; n += 1) pages.push(n);
  if (windowEnd < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

/**
 * Server-renderable pagination control. Page changes are real links so the
 * URLs are crawlable and work without client-side JS.
 */
export function Pagination({ page, totalPages, locale, hrefForPage, labels }: PaginationProps) {
  if (totalPages <= 1) return null;
  const numbers = pageNumbers(page, totalPages);
  return (
    <nav aria-label={labels.navLabel} className="mt-10 flex flex-wrap items-center justify-center gap-1 sm:gap-1.5">
      <PageNavButton
        href={hrefForPage(page - 1)}
        disabled={page <= 1}
        ariaLabel={labels.previous}
        locale={locale}
        direction="previous"
      />
      {numbers.map((n, index) =>
        n === "ellipsis" ? (
          <span key={`ellipsis-${index}`} aria-hidden className="px-1.5 sm:px-2 text-[var(--color-muted)]">
            …
          </span>
        ) : (
          <Link
            key={n}
            href={hrefForPage(n)}
            aria-label={`${labels.pageLabel} ${n}`}
            aria-current={n === page ? "page" : undefined}
            className={cn(
              "inline-flex h-9 min-w-9 sm:h-10 sm:min-w-10 items-center justify-center rounded-[var(--radius-md)] border px-2 sm:px-3 text-xs sm:text-sm font-bold transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]",
              n === page
                ? "border-transparent bg-[var(--color-primary)] text-white shadow-sm"
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]",
            )}
          >
            {n}
          </Link>
        ),
      )}
      <PageNavButton
        href={hrefForPage(page + 1)}
        disabled={page >= totalPages}
        ariaLabel={labels.next}
        locale={locale}
        direction="next"
      />
    </nav>
  );
}

function PageNavButton({
  href,
  disabled,
  ariaLabel,
  direction,
}: {
  href: string;
  disabled: boolean;
  ariaLabel: string;
  locale: Locale;
  direction: "previous" | "next";
}) {
  const base = cn(
    "inline-flex h-9 min-w-9 sm:h-10 sm:min-w-10 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-2 sm:px-3 text-[var(--color-foreground)] transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]",
    disabled ? "pointer-events-none opacity-40" : "hover:bg-[var(--color-surface-muted)]",
  );
  // In RTL the visual direction of "next"/"previous" is mirrored.
  const icon =
    direction === "previous" ? (
      <ChevronLeft className="h-4 w-4 rtl:rotate-180" aria-hidden />
    ) : (
      <ChevronRight className="h-4 w-4 rtl:rotate-180" aria-hidden />
    );
  if (disabled) {
    return (
      <span aria-disabled="true" aria-label={ariaLabel} className={base}>
        {icon}
      </span>
    );
  }
  return (
    <Link href={href} aria-label={ariaLabel} className={base}>
      {icon}
    </Link>
  );
}
