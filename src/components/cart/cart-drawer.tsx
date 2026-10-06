"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/features/cart/cart.provider";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Locale } from "@/config/locales";

interface CartDrawerProps {
  locale: Locale;
  labels: {
    title: string;
    empty: string;
    emptyDesc: string;
    subtotal: string;
    taxNote: string;
    checkout: string;
    clear: string;
    items: string;
  };
}

export function CartDrawer({ locale, labels }: CartDrawerProps) {
  const { state, subtotal, open, setOpen, remove, setQty, clear } = useCart();
  const isAr = locale === "ar";

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} aria-hidden />}
      <aside
        role="dialog"
        aria-label={labels.title}
        aria-hidden={!open}
        className={`fixed top-0 bottom-0 z-50 flex w-96 max-w-[90vw] flex-col bg-[var(--color-surface)] shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : isAr ? "translate-x-full" : "-translate-x-full"
        } ${isAr ? "right-0" : "left-0"}`}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4">
          <h2 className="text-lg font-extrabold">{labels.title}</h2>
          <button type="button" onClick={() => setOpen(false)} aria-label={isAr ? "إغلاق" : "Close"} className="rounded-md p-2 hover:bg-black/5">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {state.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-[var(--color-muted-foreground)]" aria-hidden />
            <p className="font-extrabold">{labels.empty}</p>
            <p className="text-sm text-[var(--color-muted)]">{labels.emptyDesc}</p>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[var(--color-border)] overflow-y-auto p-4">
              {state.items.map((item) => (
                <li key={item.productId} className="flex gap-3 py-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-md bg-[var(--color-background)]">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-1" />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link href={`/${locale}/products/${item.slug}`} onClick={() => setOpen(false)} className="text-sm font-bold">
                      {item.name}
                    </Link>
                    <span className="text-xs text-[var(--color-muted)]">
                      {item.price !== null ? formatPrice(item.price, "SAR", locale) : "—"}
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <button type="button" aria-label="-" onClick={() => setQty(item.productId, item.quantity - 1)} className="rounded border border-[var(--color-border)] p-1">
                        <Minus className="h-3 w-3" aria-hidden />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button type="button" aria-label="+" onClick={() => setQty(item.productId, item.quantity + 1)} className="rounded border border-[var(--color-border)] p-1">
                        <Plus className="h-3 w-3" aria-hidden />
                      </button>
                      <button type="button" aria-label={isAr ? "حذف" : "Remove"} onClick={() => remove(item.productId)} className="ms-auto rounded p-1 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/5">
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-[var(--color-border)] p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-bold">{labels.subtotal}</span>
                <span className="text-lg font-extrabold">{formatPrice(subtotal, "SAR", locale)}</span>
              </div>
              <p className="mb-4 text-[11px] text-[var(--color-muted-foreground)]">{labels.taxNote}</p>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => {}}>
                  {labels.checkout}
                </Button>
                <Button variant="secondary" onClick={clear}>
                  {labels.clear}
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
