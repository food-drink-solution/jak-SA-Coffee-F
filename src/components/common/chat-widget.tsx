"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import type { Locale } from "@/config/locales";
import { siteConfig } from "@/config/site";

interface ChatWidgetProps {
  locale: Locale;
  labels: {
    open: string;
    close: string;
    title: string;
    call: string;
    email: string;
    contactPage: string;
  };
}

/**
 * Floating quick-contact widget on the opposite side of the viewport from the
 * scroll-to-top button. Opens a small panel with phone / email / contact links.
 */
export function ChatWidget({ locale, labels }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="fixed bottom-6 end-6 z-30 flex flex-col items-end gap-3">
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label={labels.title}
          className="w-64 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card-hover)]"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <h2 className="text-sm font-extrabold text-[var(--color-foreground)]">{labels.title}</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={labels.close}
              className="-m-1 rounded p-1 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--color-ring)]"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <ul className="flex flex-col gap-1">
            <li>
              <a
                href={`tel:${siteConfig.contact.phoneHref}`}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--color-ring)]"
              >
                <Phone className="h-4 w-4 text-[var(--color-jak-primary)]" aria-hidden />
                {labels.call}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--color-ring)]"
              >
                <Mail className="h-4 w-4 text-[var(--color-jak-primary)]" aria-hidden />
                {labels.email}
              </a>
            </li>
            <li>
              <Link
                href={`/${locale}/contact`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-muted)] focus-visible:outline-2 focus-visible:outline-[var(--color-ring)]"
              >
                <MessageCircle className="h-4 w-4 text-[var(--color-jak-primary)]" aria-hidden />
                {labels.contactPage}
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? labels.close : labels.open}
        className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-[var(--shadow-card-hover)] transition-colors hover:bg-[var(--color-primary-dark)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-ring)]"
      >
        {open ? <X className="h-5 w-5" aria-hidden /> : <MessageCircle className="h-5 w-5" aria-hidden />}
      </button>
    </div>
  );
}
