"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { otherLocaleOf } from "@/lib/seo/metadata";
import { switchLocalePath } from "@/lib/seo/metadata";
import type { Locale } from "@/config/locales";

export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const target = otherLocaleOf(locale);
  return (
    <Link
      href={switchLocalePath(pathname, target)}
      className="rounded-full border border-[var(--color-border)] px-4 py-1.5 text-xs font-extrabold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-background)]"
    >
      {label}
    </Link>
  );
}
