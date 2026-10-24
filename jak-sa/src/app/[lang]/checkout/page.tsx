import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/config/locales";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { CheckoutSummary } from "@/components/cart/checkout-summary";
import { alternatesFor } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "ar");
  return { title: t(dict, "checkout.title"), alternates: alternatesFor("/checkout") };
}

export default async function CheckoutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <section className="container-app py-8 sm:py-12">
      <h1 className="mb-3 text-2xl font-extrabold text-[var(--color-foreground)] sm:text-3xl">{t(dict, "checkout.title")}</h1>
      <p className="mb-8 max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:mb-10">{t(dict, "checkout.subtitle")}</p>

      <div className="max-w-2xl">
        <CheckoutSummary
          locale={lang}
          labels={{
            empty: t(dict, "checkout.empty"),
            emptyDesc: t(dict, "checkout.emptyDesc"),
            items: t(dict, "checkout.items"),
            subtotal: t(dict, "checkout.subtotal"),
            orderViaWhatsApp: t(dict, "checkout.orderViaWhatsApp"),
            orderViaContact: t(dict, "checkout.orderViaContact"),
            continueShopping: t(dict, "checkout.continueShopping"),
            orderMessageTitle: t(dict, "checkout.orderMessageTitle"),
            note: t(dict, "checkout.note"),
          }}
        />
      </div>
    </section>
  );
}
