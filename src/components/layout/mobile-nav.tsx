"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import type { Locale } from "@/config/locales";
import type { NavItem } from "@/types/navigation";
import { pick } from "@/types/localization";
import { LanguageSwitcher } from "./language-switcher";

interface MobileNavProps {
  locale: Locale;
  items: NavItem[];
  openLabel: string;
  closeLabel: string;
  langLabel: string;
}

export function MobileNav({ locale, items, openLabel, closeLabel, langLabel }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-md text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-muted)] focus-ring md:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <nav
        id="mobile-nav"
        aria-hidden={!open}
        className={`fixed top-0 bottom-0 start-0 z-50 flex w-72 max-w-[85vw] flex-col bg-[var(--color-surface)] p-6 shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <span className="text-lg font-extrabold text-[var(--color-foreground)]">{locale === "ar" ? "القائمة" : "Menu"}</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={closeLabel}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-foreground)] focus-ring"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Mobile Search */}
        <form action={`/${locale}/search`} onSubmit={() => setOpen(false)} className="mb-4" role="search">
          <label className="relative block">
            <Search className="absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" aria-hidden />
            <input
              name="q"
              type="search"
              placeholder={locale === "ar" ? "ابحث عن قهوة أو منتج..." : "Search coffee or product..."}
              className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] ps-9 pe-3 text-sm focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/30"
            />
          </label>
        </form>

        <ul className="flex-1 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/${locale}${item.href === "/" ? "" : item.href}`}
                onClick={() => setOpen(false)}
                className="flex min-h-[44px] items-center rounded-lg px-3 py-2.5 font-bold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-primary)] focus-ring"
              >
                {pick(item.label, locale)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-auto border-t border-[var(--color-border)] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[var(--color-muted)]">{langLabel}</span>
            <LanguageSwitcher locale={locale} label={langLabel} />
          </div>
        </div>
      </nav>
    </>
  );
}
