"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/features/cart/cart.provider";
import { Button } from "@/components/ui/button";

export function AddToCartButton({ product, label, addedLabel }: { product: Product; label: string; addedLabel: string }) {
  const { add, setOpen } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      size="sm"
      className="w-full"
      aria-label={`${label}: ${product.name.ar}`}
      onClick={() => {
        add(product);
        setOpen(true);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? <Check className="h-4 w-4" aria-hidden /> : <ShoppingCart className="h-4 w-4" aria-hidden />}
      {added ? addedLabel : label}
    </Button>
  );
}
