const CART_KEY = "jak-cart-v1";

import type { CartState } from "./cart.utils";

export interface CartStorage {
  load(): CartState;
  save(state: CartState): void;
  clear(): void;
}

export class LocalStorageCartStorage implements CartStorage {
  load(): CartState {
    if (typeof window === "undefined") return { items: [] };
    try {
      const raw = window.localStorage.getItem(CART_KEY);
      if (!raw) return { items: [] };
      const parsed = JSON.parse(raw) as CartState;
      if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
      return parsed;
    } catch {
      return { items: [] };
    }
  }

  save(state: CartState): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(state));
    } catch {
      // storage unavailable (private mode, quota) — cart stays in memory
    }
  }

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(CART_KEY);
    } catch {
      // ignore
    }
  }
}

export const cartStorage = new LocalStorageCartStorage();
