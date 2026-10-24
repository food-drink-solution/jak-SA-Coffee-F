"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { otherLocaleOf } from "@/lib/seo/metadata";
import { switchLocalePath } from "@/lib/seo/metadata";
import type { Locale } from "@/config/locales";

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
  /** "header" = white border/text on purple nav; default = dark */
  variant?: "header" | "default";
}

export function LanguageSwitcher({ locale, label, variant = "default" }: LanguageSwitcherProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const target = otherLocaleOf(locale);
  const isHeader = variant === "header";
  return (
    <Link
      href={switchLocalePath(pathname, target)}
      className={`rounded-full border px-4 py-1.5 text-xs font-extrabold transition-colors ${
        isHeader
          ? "border-[var(--color-header-foreground)]/40 text-[var(--color-header-foreground)] hover:border-[var(--color-header-foreground)] hover:bg-[var(--color-header-foreground)]/15 focus-ring-inverse"
          : "border-[var(--color-border-control)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)] focus-ring"
      }`}
    >
      {label}
    </Link>
  );
}
