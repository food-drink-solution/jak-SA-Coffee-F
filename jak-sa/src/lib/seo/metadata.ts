import type { Locale } from "@/config/locales";
import { getDirection, OTHER_LOCALE } from "@/config/locales";
import { siteConfig } from "@/config/site";

export function localizedUrl(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.replace(/\/+$/, "");
  return `${siteConfig.url}/${locale}${clean}`;
}

export function alternatesFor(path: string): { canonical: string; languages: Record<string, string> } {
  return {
    canonical: localizedUrl("ar", path),
    languages: {
      ar: localizedUrl("ar", path),
      en: localizedUrl("en", path),
      "x-default": localizedUrl("ar", path),
    },
  };
}

export function dirFromLocale(locale: Locale): "rtl" | "ltr" {
  return getDirection(locale);
}

export function switchLocalePath(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && (segments[0] === "ar" || segments[0] === "en")) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }
  return "/" + segments.join("/");
}

export function otherLocaleOf(locale: Locale): Locale {
  return OTHER_LOCALE[locale];
}
