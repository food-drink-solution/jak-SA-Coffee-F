"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
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

  return (
    <>
      <button
        type="button"
        className="rounded-md p-2 text-[var(--color-foreground)] md:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <nav
        id="mobile-nav"
        aria-hidden={!open}
        className={`fixed top-0 bottom-0 z-50 w-72 max-w-[80vw] bg-[var(--color-surface)] p-6 shadow-xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : locale === "ar" ? "translate-x-full" : "-translate-x-full"
        } ${locale === "ar" ? "right-0" : "left-0"}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-lg font-extrabold">{locale === "ar" ? "القائمة" : "Menu"}</span>
          <button type="button" onClick={() => setOpen(false)} aria-label={closeLabel} className="rounded-md p-2">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/${locale}${item.href === "/" ? "" : item.href}`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 font-bold text-[var(--color-foreground)] hover:bg-[var(--color-background)]"
              >
                {pick(item.label, locale)}
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6 border-t border-[var(--color-border)] pt-4">
          <LanguageSwitcher locale={locale} label={langLabel} />
        </div>
      </nav>
    </>
  );
}
