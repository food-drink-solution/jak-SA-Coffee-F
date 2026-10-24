import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import type { Locale } from "@/config/locales";
import type { NavItem } from "@/types/navigation";
import { pick } from "@/types/localization";
import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle, type ThemeToggleLabels } from "./theme-toggle";
import { CartButton } from "@/components/cart/cart-button";

interface SiteHeaderProps {
  locale: Locale;
  items: NavItem[];
  labels: {
    searchPlaceholder: string;
    langLabel: string;
    openMenu: string;
    closeMenu: string;
    cart: string;
    theme: string;
    lightMode: string;
    darkMode: string;
    switchToLight: string;
    switchToDark: string;
    loadingTheme: string;
  };
}

export function SiteHeader({ locale, items, labels }: SiteHeaderProps) {
  const isAr = locale === "ar";
  const themeLabels: ThemeToggleLabels = {
    label: labels.theme,
    light: labels.lightMode,
    dark: labels.darkMode,
    switchToLight: labels.switchToLight,
    switchToDark: labels.switchToDark,
    loading: labels.loadingTheme,
  };
  return (
    <header className="sticky top-0 z-30 w-full shadow-md">
      {/* ── JAK Purple Top-bar — brand surface, identical in both themes ── */}
      <div className="bg-[var(--color-jak-primary)] w-full">
        <div className="container-app flex h-14 items-center justify-between gap-2">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex shrink-0 items-center rounded-lg bg-[var(--color-header-foreground)] px-2 py-1 transition-opacity hover:opacity-90 focus-ring-inverse"
            aria-label={siteConfig.name[locale]}
          >
            <Image
              src="/images/brand/logo.png"
              alt={siteConfig.name[locale]}
              width={80}
              height={40}
              className="h-8 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav links — centered */}
          <nav
            className="hidden flex-1 items-center justify-center gap-0.5 md:flex"
            aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}
          >
            {items.map((item) => (
              <Link
                key={item.id}
                href={`/${locale}${item.href === "/" ? "" : item.href}`}
                className="rounded-md px-3 py-1.5 text-sm font-semibold text-[var(--color-header-foreground-muted)] transition-colors hover:bg-[var(--color-header-foreground)]/15 hover:text-[var(--color-header-foreground)] focus-ring-inverse"
              >
                {pick(item.label, locale)}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {/* Search — desktop only */}
            <form action={`/${locale}/search`} className="hidden sm:block" role="search">
              <label className="relative block">
                <Search
                  className="absolute top-1/2 start-3 h-4 w-4 -translate-y-1/2 text-[var(--color-header-foreground-subtle)]"
                  aria-hidden
                />
                <span className="sr-only">{labels.searchPlaceholder}</span>
                <input
                  name="q"
                  type="search"
                  placeholder={labels.searchPlaceholder}
                  className="h-9 w-32 rounded-full border border-[var(--color-header-foreground)]/40 bg-[var(--color-header-foreground)]/10 ps-9 pe-3 text-sm text-[var(--color-header-foreground)] placeholder:text-[var(--color-header-foreground-subtle)] transition-all focus:w-44 focus:border-[var(--color-header-foreground)]/70 focus:bg-[var(--color-header-foreground)]/20 focus:outline-none focus:ring-2 focus:ring-[var(--color-header-ring)]/40 md:w-40 md:focus:w-52 lg:w-44 lg:focus:w-60"
                />
              </label>
            </form>

            {/* Cart */}
            <CartButton label={labels.cart} variant="header" />

            {/* Theme Toggle — desktop only; mobile access lives in the drawer */}
            <span className="hidden md:inline">
              <ThemeToggle labels={themeLabels} />
            </span>

            {/* Language Switcher — desktop */}
            <span className="hidden md:inline">
              <LanguageSwitcher locale={locale} label={labels.langLabel} variant="header" />
            </span>

            {/* Mobile hamburger */}
            <MobileNav
              locale={locale}
              items={items}
              openLabel={labels.openMenu}
              closeLabel={labels.closeMenu}
              langLabel={labels.langLabel}
              themeLabels={themeLabels}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
