import type { Locale } from "@/config/locales";

export interface LocalizedText {
  ar: string;
  en: string;
}

export function pick(text: LocalizedText | undefined, locale: Locale): string {
  if (!text) return "";
  return text[locale] || text.ar || text.en || "";
}
