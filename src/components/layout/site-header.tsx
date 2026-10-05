import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import type { Locale } from "@/config/locales";
import type { NavItem } from "@/types/navigation";
import { pick } from "@/types/localization";
import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { CartButton } from "@/components/cart/cart-button";

interface SiteHeaderProps {
  locale: Locale;
  items: NavItem[];
  labels: { searchPlaceholder: string; langLabel: string; openMenu: string; closeMenu: string; cart: string };
}

export function SiteHeader({ locale, items, labels }: SiteHeaderProps) {
  const isAr = locale === "ar";
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4">
        <Link href={`/${locale}`} className="flex items-center gap-3" aria-label={siteConfig.name[locale]}>
          <Image src="/images/brand/logo.png" alt={siteConfig.name[locale]} width={40} height={40} className="h-10 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label={isAr ? "التنقل الرئيسي" : "Main navigation"}>
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}${item.href === "/" ? "" : item.href}`}
              className="rounded-lg px-3 py-2 text-sm font-bold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-background)]"
            >
              {pick(item.label, locale)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <form action={`/${locale}/search`} className="hidden sm:block" role="search">
            <label className="relative">
              <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)] ltr:left-3 rtl:right-3" aria-hidden />
              <span className="sr-only">{labels.searchPlaceholder}</span>
              <input
                name="q"
                type="search"
                placeholder={labels.searchPlaceholder}
                className="h-10 w-44 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] px-10 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]/40 md:w-56"
              />
            </label>
          </form>
          <CartButton label={labels.cart} />
          <span className="hidden md:inline">
            <LanguageSwitcher locale={locale} label={labels.langLabel} />
          </span>
          <MobileNav
            locale={locale}
            items={items}
            openLabel={labels.openMenu}
            closeLabel={labels.closeMenu}
            langLabel={labels.langLabel}
          />
        </div>
      </div>
    </header>
  );
}
