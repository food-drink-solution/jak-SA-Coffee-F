"use client";

import { useEffect } from "react";
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

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [open, setOpen]);

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
      <aside
        role="dialog"
        aria-label={labels.title}
        aria-hidden={!open}
        className={`fixed top-0 bottom-0 end-0 z-50 flex w-full max-w-[90vw] sm:max-w-md flex-col bg-[var(--color-surface)] shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[var(--color-primary)]" aria-hidden />
            <h2 className="text-lg font-extrabold text-[var(--color-foreground)]">{labels.title}</h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={isAr ? "إغلاق" : "Close"}
            className="flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-muted)] hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-foreground)] focus-ring cursor-pointer"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        {state.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-surface-muted)]">
              <ShoppingBag className="h-8 w-8 text-[var(--color-muted)]" aria-hidden />
            </div>
            <p className="text-base font-extrabold text-[var(--color-foreground)]">{labels.empty}</p>
            <p className="max-w-xs text-sm text-[var(--color-muted)]">{labels.emptyDesc}</p>
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
                      <button
                        type="button"
                        aria-label="-"
                        onClick={() => setQty(item.productId, item.quantity - 1)}
                      className="flex h-11 w-11 items-center justify-center rounded border border-[var(--color-border)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-muted)] focus-ring cursor-pointer"
                      >
                        <Minus className="h-3 w-3" aria-hidden />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        aria-label="+"
                        onClick={() => setQty(item.productId, item.quantity + 1)}
                        className="flex h-11 w-11 items-center justify-center rounded border border-[var(--color-border)] text-[var(--color-foreground)] transition-colors hover:bg-[var(--color-surface-muted)] focus-ring cursor-pointer"
                      >
                        <Plus className="h-3 w-3" aria-hidden />
                      </button>
                      <button
                        type="button"
                        aria-label={isAr ? "حذف" : "Remove"}
                        onClick={() => remove(item.productId)}
                        className="ms-auto flex h-11 w-11 items-center justify-center rounded text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger)]/10 focus-ring cursor-pointer"
                      >
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
