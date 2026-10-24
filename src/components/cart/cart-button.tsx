"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/features/cart/cart.provider";

interface CartButtonProps {
  label: string;
  /** "header" = white icon on purple nav; default = dark icon */
  variant?: "header" | "default";
}

export function CartButton({ label, variant = "default" }: CartButtonProps) {
  const { count, setOpen } = useCart();
  const isHeader = variant === "header";
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={`relative rounded-md p-2 transition-colors focus-ring ${
        isHeader
          ? "text-white hover:bg-white/15"
          : "text-[var(--color-foreground)] hover:bg-black/5"
      }`}
      aria-label={`${label} (${count})`}
    >
      <ShoppingCart className="h-6 w-6" aria-hidden />
      {count > 0 && (
        <span className="absolute -top-1 -end-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-jak-accent-gold)] px-1 text-[11px] font-extrabold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
