"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/features/cart/cart.provider";
import { Button } from "@/components/ui/button";

export function AddToCartButton({
  product,
  label,
  addedLabel,
  locale = "ar",
}: {
  product: Product;
  label: string;
  addedLabel: string;
  locale?: "ar" | "en";
}) {
  const { add, setOpen } = useCart();
  const [added, setAdded] = useState(false);
  const productName = locale === "en" ? (product.name.en || product.name.ar) : product.name.ar;

  return (
    <Button
      size="sm"
      className="w-full font-bold shadow-sm"
      aria-label={`${label}: ${productName}`}
      onClick={() => {
        add(product);
        setOpen(true);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? <Check className="h-4 w-4 shrink-0" aria-hidden /> : <ShoppingCart className="h-4 w-4 shrink-0" aria-hidden />}
      <span>{added ? addedLabel : label}</span>
    </Button>
  );
}
