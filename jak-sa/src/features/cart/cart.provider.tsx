"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/types/product";
import { addToCart, cartCount, cartSubtotal, removeFromCart, setQuantity, type CartState } from "./cart.utils";
import { cartStorage } from "./cart.storage";

interface CartContextValue {
  state: CartState;
  count: number;
  subtotal: number;
  itemCount: number;
  hydrated: boolean;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, quantity: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [] });
  const [hydrated, setHydrated] = useState(false);
  const [open, setOpen] = useState(false);

  // Hydrate the cart from localStorage after mount (SSR renders an empty cart
  // to avoid hydration mismatches). Loading external state once on mount is the
  // documented useEffect use-case, hence the targeted eslint suppression.
  useEffect(() => {
    const stored = cartStorage.load();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(stored);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) cartStorage.save(state);
  }, [state, hydrated]);

  const add = useCallback((product: Product, quantity = 1) => setState((s) => addToCart(s, product, quantity)), []);
  const remove = useCallback((productId: string) => setState((s) => removeFromCart(s, productId)), []);
  const setQty = useCallback((productId: string, quantity: number) => setState((s) => setQuantity(s, productId, quantity)), []);
  const clear = useCallback(() => setState({ items: [] }), []);

  const value = useMemo<CartContextValue>(
    () => ({
      state,
      count: cartCount(state),
      subtotal: cartSubtotal(state),
      itemCount: state.items.length,
      hydrated,
      add,
      remove,
      setQty,
      clear,
      open,
      setOpen,
    }),
    [state, hydrated, add, remove, setQty, clear, open],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
