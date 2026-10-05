import { DEFAULT_LOCALE } from "./locales";

export const siteConfig = {
  name: { ar: "جاك", en: "JAK" },
  tagline: {
    ar: "مورد واحد، مكان واحد — يوفر جميع احتياجات عملك",
    en: "One supplier, one place for all your business needs",
  },
  legalName: {
    ar: "شركة الأطعمة المتحدة",
    en: "United Foods Company",
  },
  description: {
    ar: "جاك — مورد سعودي للأطعمة الخفيفة والجاهزة للأكل لمقاهيك وفروعك في جميع أنحاء المملكة.",
    en: "JAK — a Saudi supplier of ready-to-eat light foods for your cafes and branches across the kingdom.",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://jak.local",
  defaultLocale: DEFAULT_LOCALE,
  contact: {
    phone: "+966 55 080 3012",
    phoneHref: "+966550803012",
    email: "support@jak.sa.com",
    country: { ar: "المملكة العربية السعودية", en: "Saudi Arabia" },
  },
} as const;
