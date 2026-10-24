"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FailureState } from "@/components/common/failure-state";
import type { Locale } from "@/config/locales";
import { siteConfig } from "@/config/site";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { applyThemeToDocument, isTheme, THEME_STORAGE_KEY } from "@/lib/theme";
import "./globals.css";

/**
 * Last-resort boundary: catches failures in the root layout itself, so it must
 * render its own <html>/<body> shell. It is intentionally self-contained —
 * no header, footer, fonts or providers that could have caused the failure.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  // The root layout's pre-paint theme script is gone with the layout. The CSS
  // already follows the system preference here; restore an explicit choice once
  // React mounts. This boundary is rare enough that a brief flash is acceptable.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (isTheme(stored)) applyThemeToDocument(stored);
    } catch {
      // Storage can be unavailable in privacy modes; system preference applies.
    }
  }, []);

  const pathname = usePathname() ?? "/ar";
  const locale: Locale = pathname.startsWith("/en") ? "en" : "ar";
  const pageTitle = `${t(getDictionary(locale), "common.errorTitle")} | ${siteConfig.name[locale]}`;

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        {/* The root layout's document metadata is unavailable here. */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex" />
        <title>{pageTitle}</title>
      </head>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] antialiased">
        <main id="main-content">
          <FailureState kind="error" digest={error.digest} onRetry={reset} standalone />
        </main>
      </body>
    </html>
  );
}
