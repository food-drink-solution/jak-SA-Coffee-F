"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, MessageSquareText, ShoppingBag, Store } from "lucide-react";
import { useCart } from "@/features/cart/cart.provider";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/config/locales";

interface CheckoutSummaryProps {
  locale: Locale;
  labels: {
    empty: string;
    emptyDesc: string;
    items: string;
    subtotal: string;
    orderViaWhatsApp: string;
    orderViaContact: string;
    continueShopping: string;
    orderMessageTitle: string;
    note: string;
  };
}

/**
 * Order review step: renders the cart contents and hands the customer a real
 * next step — a prefilled WhatsApp order (primary B2B channel in SA) or the
 * contact form. No fabricated backend: the site currently closes orders via
 * its official channels (phone/WhatsApp/contact form).
 */
export function CheckoutSummary({ locale, labels }: CheckoutSummaryProps) {
  const { state, subtotal, hydrated } = useCart();

  if (!hydrated) {
    return <p className="text-sm text-[var(--color-muted)]">{labels.items}: …</p>;
  }

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-muted)]">
          <ShoppingBag className="h-8 w-8 text-[var(--color-muted)]" aria-hidden />
        </div>
        <p className="text-base font-extrabold text-[var(--color-foreground)]">{labels.empty}</p>
        <p className="max-w-xs text-sm text-[var(--color-muted)]">{labels.emptyDesc}</p>
        <Link
          href={`/${locale}/products`}
          className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-bold text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)] focus-ring"
        >
          {labels.continueShopping}
        </Link>
      </div>
    );
  }

  const phoneDigits = siteConfig.contact.phoneHref.replace(/\D/g, "");
  const message = [
    labels.orderMessageTitle,
    ...state.items.map((item) => `• ${item.name} × ${item.quantity}`),
    `${labels.subtotal}: ${formatPrice(subtotal, "SAR", locale)}`,
  ].join("\n");
  const whatsappHref = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm sm:p-8">
      <ul className="divide-y divide-[var(--color-border)]">
        {state.items.map((item) => (
          <li key={item.productId} className="flex items-center gap-3 py-3 first:pt-0">
            <div className="relative h-14 w-14 overflow-hidden rounded-md bg-[var(--color-background)]">
              {item.image ? (
                <Image src={item.image} alt={item.name} fill sizes="56px" className="object-contain p-1" />
              ) : null}
            </div>
            <Link href={`/${locale}/products/${item.slug}`} className="flex-1 text-sm font-bold">
              {item.name}
            </Link>
            <span className="text-sm text-[var(--color-muted)]" dir="ltr">
              × {item.quantity}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        <span className="font-bold">{labels.subtotal}</span>
        <span className="text-lg font-extrabold">{formatPrice(subtotal, "SAR", locale)}</span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 text-sm font-bold text-[var(--color-primary-foreground)] transition-colors hover:bg-[var(--color-primary-hover)] active:scale-[0.98] focus-ring"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          {labels.orderViaWhatsApp}
        </a>
        <Link
          href={`/${locale}/contact`}
          className="inline-flex h-11 min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border-control)] bg-[var(--color-surface)] px-5 text-sm font-bold text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-muted)] active:scale-[0.98] focus-ring"
        >
          <MessageSquareText className="h-4 w-4" aria-hidden />
          {labels.orderViaContact}
        </Link>
      </div>
      <p className="mt-4 text-xs leading-6 text-[var(--color-muted-foreground)]">{labels.note}</p>

      <Link
        href={`/${locale}/products`}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--color-primary-text)] hover:underline focus-ring rounded"
      >
        <Store className="h-4 w-4" aria-hidden />
        {labels.continueShopping}
      </Link>
    </div>
  );
}
