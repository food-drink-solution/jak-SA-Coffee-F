"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Croissant,
  House,
  LifeBuoy,
  RefreshCw,
  SearchX,
  ShoppingBag,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import type { Locale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";

type FailureKind = "not-found" | "error";

interface FailureStateProps {
  kind: FailureKind;
  /** Next.js error digest, surfaced to help support match server logs. */
  digest?: string;
  /** Retry handler supplied by an error boundary. */
  onRetry?: () => void;
  /** Full-screen layout used by the root `global-error` boundary. */
  standalone?: boolean;
}

const primaryAction =
  "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-6 py-3 text-sm font-extrabold text-[var(--color-primary-foreground)] shadow-[var(--shadow-card)] transition hover:bg-[var(--color-primary-hover)] hover:shadow-[var(--shadow-card-hover)] focus-ring";

const secondaryAction =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-3 text-sm font-extrabold text-[var(--color-foreground)] transition hover:border-[var(--color-primary)] hover:bg-[var(--color-ghost-hover)] focus-ring";

export function FailureState({ kind, digest, onRetry, standalone = false }: FailureStateProps) {
  const pathname = usePathname() ?? "/ar";
  const locale: Locale = pathname.startsWith("/en") ? "en" : "ar";
  const dict = getDictionary(locale);
  const isNotFound = kind === "not-found";

  const homeHref = `/${locale}`;
  const productsHref = `/${locale}/products`;
  const contactHref = `/${locale}/contact`;
  const titleId = isNotFound ? "not-found-title" : "error-title";

  return (
    <section
      aria-labelledby={titleId}
      role={isNotFound ? undefined : "alert"}
      className={`relative isolate flex flex-col justify-center overflow-hidden py-16 sm:py-20 ${
        standalone ? "min-h-svh" : "min-h-[calc(100svh-var(--header-h))]"
      }`}
    >
      {/* Ambient brand backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="failure-grid absolute inset-0" />
        <div className="absolute -top-32 left-1/2 size-72 -translate-x-1/2 rounded-full bg-[var(--color-jak-primary)]/10 blur-3xl sm:size-[26rem]" />
        <div className="absolute -bottom-40 left-[8%] size-72 rounded-full bg-[var(--color-jak-accent-pink)]/10 blur-3xl sm:size-96" />
        <div className="absolute -bottom-24 right-[6%] size-64 rounded-full bg-[var(--color-jak-accent-gold)]/10 blur-3xl sm:size-80" />
      </div>

      <div className="container-app relative flex flex-col items-center text-center">
        <p className="failure-rise inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/85 px-4 py-1.5 text-xs font-extrabold text-[var(--color-primary-text)] shadow-[var(--shadow-sm)] backdrop-blur">
          <span aria-hidden="true" className="relative flex size-2">
            <span
              className={`failure-ping absolute inline-flex size-full rounded-full ${
                isNotFound ? "bg-[var(--color-jak-accent-pink)]" : "bg-[var(--color-danger)]"
              }`}
            />
            <span
              className={`relative inline-flex size-2 rounded-full ${
                isNotFound ? "bg-[var(--color-jak-accent-pink)]" : "bg-[var(--color-danger)]"
              }`}
            />
          </span>
          {t(dict, isNotFound ? "common.notFoundBadge" : "common.errorBadge")}
        </p>

        {isNotFound ? (
          <div aria-hidden="true" className="failure-rise failure-delay-1 relative mt-4 select-none">
            <div className="absolute inset-x-10 bottom-3 h-16 rounded-[100%] bg-[var(--color-jak-primary)]/15 blur-2xl" />
            <div className="relative flex items-center justify-center gap-1.5 sm:gap-4">
              <span className="failure-digit text-[clamp(5rem,18vw,10.5rem)] font-extrabold">4</span>

              <div className="relative flex size-[clamp(5.5rem,17vw,9.5rem)] items-center justify-center">
                <span className="failure-orbit absolute inset-0 rounded-full border-2 border-dashed border-[var(--color-jak-primary)]/25" />
                <span className="failure-orbit-reverse absolute inset-2 rounded-full border border-[var(--color-jak-accent-pink)]/20" />
                <span className="failure-ping absolute inset-4 rounded-full border border-[var(--color-jak-accent-gold)]/40" />

                <span className="failure-float relative flex size-[78%] items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-xl)]">
                  <Croissant
                    className="size-[46%] text-[var(--color-accent)]"
                    strokeWidth={1.5}
                  />
                  <span className="failure-steam absolute -top-3 start-[36%] h-3.5 w-1 rounded-full bg-[var(--color-jak-accent-gold)]/60" />
                  <span className="failure-steam absolute -top-4 start-[50%] h-4 w-1 rounded-full bg-[var(--color-jak-accent-gold)]/40 [animation-delay:0.7s]" />
                  <span className="failure-steam absolute -top-2 end-[28%] h-3 w-1 rounded-full bg-[var(--color-jak-accent-gold)]/50 [animation-delay:1.3s]" />
                  <span className="absolute -bottom-1 -end-1 flex size-10 items-center justify-center rounded-full bg-[var(--color-jak-accent-pink)] text-[var(--color-jak-accent-pink-foreground)] shadow-[var(--shadow-lg)] ring-4 ring-[var(--color-background)] sm:size-11">
                    <SearchX className="size-5" strokeWidth={2} />
                  </span>
                </span>
              </div>

              <span className="failure-digit text-[clamp(5rem,18vw,10.5rem)] font-extrabold">4</span>

              <Sparkles className="failure-twinkle absolute -top-4 start-[9%] size-5 text-[var(--color-jak-accent-gold)] sm:size-6" />
              <Sparkles className="failure-twinkle absolute bottom-2 end-[7%] size-4 text-[var(--color-jak-accent-pink)] [animation-delay:1.1s] sm:size-5" />
              <span className="absolute -bottom-1 start-[21%] size-2 rounded-full bg-[var(--color-jak-primary)]/35" />
              <span className="absolute end-[23%] top-1 size-1.5 rounded-full bg-[var(--color-jak-accent-gold)]/60" />
            </div>
          </div>
        ) : (
          <div aria-hidden="true" className="failure-rise failure-delay-1 relative mt-8 select-none">
            <div className="absolute -inset-8 -z-10 rounded-full bg-[var(--color-danger)]/10 blur-2xl" />
            <div className="failure-orbit absolute -inset-4 rounded-[2.75rem] border-2 border-dashed border-[var(--color-jak-primary)]/20" />

            <div className="failure-float relative flex size-[clamp(7.5rem,28vw,11rem)] items-center justify-center rounded-[2rem] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-xl)]">
              <span className="absolute inset-2.5 rounded-[1.6rem] border border-dashed border-[var(--color-border)]" />
              <span className="failure-ping absolute inset-6 rounded-[1.5rem] border border-[var(--color-danger)]/30" />
              <TriangleAlert
                className="relative size-[40%] text-[var(--color-danger)]"
                strokeWidth={1.5}
              />
              <span className="absolute -end-3 -top-3 flex size-10 items-center justify-center rounded-full bg-[var(--color-jak-primary)] text-[var(--color-jak-primary-foreground)] shadow-[var(--shadow-lg)] ring-4 ring-[var(--color-background)] sm:size-11">
                <RefreshCw className="size-5" strokeWidth={2} />
              </span>
            </div>

            <Sparkles className="failure-twinkle absolute -start-5 -top-5 size-5 text-[var(--color-jak-accent-gold)] sm:size-6" />
            <Sparkles className="failure-twinkle absolute -bottom-4 -end-6 size-4 text-[var(--color-jak-accent-pink)] [animation-delay:1.2s] sm:size-5" />
            <span className="absolute -start-2 bottom-5 size-2 rounded-full bg-[var(--color-jak-primary)]/35" />
            <span className="absolute -end-1 top-4 size-1.5 rounded-full bg-[var(--color-jak-accent-gold)]/60" />
          </div>
        )}

        <h1
          id={titleId}
          className="failure-rise failure-delay-2 mt-7 text-balance text-3xl font-extrabold text-[var(--color-foreground)] sm:text-4xl md:text-[2.75rem] md:leading-[1.15]"
        >
          {t(dict, isNotFound ? "common.notFoundTitle" : "common.errorTitle")}
        </h1>

        <p className="failure-rise failure-delay-2 mt-3 max-w-xl text-pretty text-base leading-8 text-[var(--color-muted)]">
          {t(dict, isNotFound ? "common.notFoundDesc" : "common.errorDesc")}
        </p>

        <p className="failure-rise failure-delay-3 mt-2 max-w-lg text-sm leading-6 text-[var(--color-muted)]">
          {t(dict, isNotFound ? "common.notFoundHint" : "common.errorHint")}
        </p>

        <div className="failure-rise failure-delay-3 mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          {isNotFound ? (
            <>
              <Link href={homeHref} className={primaryAction}>
                <House className="size-5" aria-hidden="true" />
                {t(dict, "common.goHome")}
              </Link>
              <Link href={productsHref} className={secondaryAction}>
                <ShoppingBag className="size-5" aria-hidden="true" />
                {t(dict, "common.browseProducts")}
                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <button type="button" onClick={onRetry} className={primaryAction}>
                <RefreshCw className="size-5" aria-hidden="true" />
                {t(dict, "common.retry")}
              </button>
              <Link href={homeHref} className={secondaryAction}>
                <House className="size-5" aria-hidden="true" />
                {t(dict, "common.goHome")}
              </Link>
            </>
          )}
        </div>

        <Link
          href={contactHref}
          className="failure-rise failure-delay-4 mt-6 inline-flex items-center gap-2 rounded-sm text-sm font-bold text-[var(--color-primary-text)] underline-offset-4 hover:underline focus-ring"
        >
          <LifeBuoy className="size-4" aria-hidden="true" />
          {t(dict, "common.contactHelp")}{" "}
          <span className="underline decoration-[var(--color-primary-text)]/40 decoration-1 underline-offset-4">
            {t(dict, "common.contactCta")}
          </span>
        </Link>

        {!isNotFound && digest ? (
          <p className="failure-rise failure-delay-4 mt-5 text-xs text-[var(--color-muted)]">
            {t(dict, "common.errorRef")}:{" "}
            <code className="rounded-[var(--radius-sm)] bg-[var(--color-surface-muted)] px-1.5 py-0.5 font-mono text-[11px] text-[var(--color-foreground-muted)]">
              {digest}
            </code>
          </p>
        ) : null}
      </div>
    </section>
  );
}
