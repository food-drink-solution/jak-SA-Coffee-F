import type { LocalizedText } from "./localization";

export interface NavItem {
  id: string;
  label: LocalizedText;
  href: string;
}

export interface PageContent {
  id: string;
  slug: string;
  title: LocalizedText;
  content: { ar: string[]; en: string[] };
  images?: { ar?: string; en?: string };
}

export interface DocumentResource {
  id: string;
  title: LocalizedText;
  type: "pdf" | "image" | "external";
  url: string;
  locale: "ar" | "en" | "both";
}

export interface CompanyProfile {
  phone?: string | null;
  email?: string | null;
  appStore?: string | null;
  googlePlay?: string | null;
  social: Record<string, string | null>;
  documents: DocumentResource[];
}
