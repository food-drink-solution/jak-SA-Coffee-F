import type { Metadata } from "next";
import { Almarai } from "next/font/google";
import { notFound } from "next/navigation";
import { CartProvider } from "@/features/cart/cart.provider";
import { isLocale, type Locale, LOCALES } from "@/config/locales";
import { siteConfig } from "@/config/site";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { categoryRepository } from "@/lib/data/catalog";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import "../globals.css";

const almarai = Almarai({
  subsets: ["arabic", "latin"],
  weight: ["400", "700", "800"],
  variable: "--font-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "ar";
  return {
    metadataBase: new URL(siteConfig.url),
    title: { default: t(getDictionary(locale), "meta.siteTitle"), template: `%s | ${siteConfig.name[locale]}` },
    description: t(getDictionary(locale), "meta.siteDescription"),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang;
  const dict = getDictionary(locale);
  const categories = await categoryRepository.getCategories();
  const navItems = [
    { id: "home", label: { ar: t(getDictionary("ar"), "nav.home"), en: t(getDictionary("en"), "nav.home") }, href: "/" },
    { id: "products", label: { ar: t(getDictionary("ar"), "nav.products"), en: t(getDictionary("en"), "nav.products") }, href: "/products" },
    { id: "categories", label: { ar: t(getDictionary("ar"), "nav.categories"), en: t(getDictionary("en"), "nav.categories") }, href: "/categories" },
    { id: "about", label: { ar: t(getDictionary("ar"), "nav.about"), en: t(getDictionary("en"), "nav.about") }, href: "/about" },
    { id: "contact", label: { ar: t(getDictionary("ar"), "nav.contact"), en: t(getDictionary("en"), "nav.contact") }, href: "/contact" },
  ];

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={almarai.variable}>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)] antialiased">
        <CartProvider>
          <SiteHeader
            locale={locale}
            items={navItems}
            labels={{
              searchPlaceholder: t(dict, "header.searchPlaceholder"),
              langLabel: t(dict, "header.language"),
              openMenu: t(dict, "header.openMenu"),
              closeMenu: t(dict, "header.closeMenu"),
              cart: t(dict, "header.cart"),
            }}
          />
          <main id="main-content">{children}</main>
          <SiteFooter locale={locale} categories={categories} />
          <CartDrawer
            locale={locale}
            labels={{
              title: t(dict, "cart.title"),
              empty: t(dict, "cart.empty"),
              emptyDesc: t(dict, "cart.emptyDesc"),
              subtotal: t(dict, "cart.subtotal"),
              taxNote: t(dict, "cart.taxNote"),
              checkout: t(dict, "cart.checkout"),
              clear: t(dict, "cart.clear"),
              items: t(dict, "cart.items"),
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
