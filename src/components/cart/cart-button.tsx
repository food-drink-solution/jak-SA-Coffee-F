"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/cart/cart.provider";

export function CartButton({ label }: { label: string }) {
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="relative rounded-md p-2 text-[var(--color-foreground)] hover:bg-black/5"
      aria-label={`${label} (${count})`}
    >
      <ShoppingCart className="h-6 w-6" aria-hidden />
      {count > 0 && (
        <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[11px] font-extrabold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
