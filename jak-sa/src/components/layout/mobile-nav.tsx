"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Search, X } from "lucide-react";
import type { Locale } from "@/config/locales";
import type { NavItem } from "@/types/navigation";
import { pick } from "@/types/localization";
import { siteConfig } from "@/config/site";
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
      {/* Hamburger toggle — only visible on mobile */}
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/15 focus-ring md:hidden"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? closeLabel : openLabel}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer */}
      <nav
        id="mobile-nav"
        aria-hidden={!open}
        className={`fixed top-0 bottom-0 start-0 z-50 flex w-72 max-w-[85vw] flex-col shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
        }`}
      >
        {/* Drawer Header — JAK purple */}
        <div className="flex items-center justify-between bg-[#4e0161] px-5 py-4">
          <Link
            href={`/${locale}`}
            onClick={() => setOpen(false)}
            aria-label={siteConfig.name[locale]}
          >
            <Image
              src="/images/brand/logo.png"
              alt={siteConfig.name[locale]}
              width={70}
              height={35}
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={closeLabel}
            className="flex h-9 w-9 items-center justify-center rounded-md text-white/70 hover:bg-white/15 hover:text-white focus-ring"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex flex-1 flex-col overflow-hidden bg-[var(--color-surface)]">
          {/* Search */}
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <form action={`/${locale}/search`} onSubmit={() => setOpen(false)} role="search">
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
          </div>

          {/* Nav links */}
          <ul className="flex-1 overflow-y-auto px-3 py-2">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/${locale}${item.href === "/" ? "" : item.href}`}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center rounded-lg px-3 py-2.5 font-semibold text-[var(--color-foreground)] transition-colors hover:bg-[#4e0161]/8 hover:text-[#4e0161] focus-ring"
                >
                  {pick(item.label, locale)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer — language switcher */}
          <div className="border-t border-[var(--color-border)] px-4 py-4 safe-bottom">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-muted)]">{langLabel}</span>
              <LanguageSwitcher locale={locale} label={langLabel} />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
