import { describe, expect, it } from "vitest";
import { addToCart, cartCount, cartSubtotal, removeFromCart, setQuantity, type CartState } from "@/features/cart/cart.utils";
import type { Product } from "@/types/product";

const product: Product = {
  id: "1",
  slug: "croissant-1",
  name: { ar: "كرواسان", en: "Croissant" },
  description: { ar: "", en: "" },
  categoryIds: ["29"],
  categoryName: { ar: "الكروسان", en: "Croissant" },
  subcategoryName: { ar: "", en: "" },
  images: [],
  price: { amount: 5, currency: "SAR" },
  attributes: [],
  tags: [],
};

describe("cart utils", () => {
  it("adds a product and merges quantities", () => {
    let state: CartState = { items: [] };
    state = addToCart(state, product, 2);
    state = addToCart(state, product, 3);
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(5);
    expect(cartCount(state)).toBe(5);
    expect(cartSubtotal(state)).toBe(25);
  });

  it("sets quantity and removes on zero", () => {
    let state = addToCart({ items: [] }, product, 1);
    state = setQuantity(state, "1", 4);
    expect(state.items[0].quantity).toBe(4);
    state = setQuantity(state, "1", 0);
    expect(state.items).toHaveLength(0);
  });

  it("removes items", () => {
    let state = addToCart({ items: [] }, product, 1);
    state = removeFromCart(state, "1");
    expect(state.items).toHaveLength(0);
  });

  it("treats missing price as zero in subtotal", () => {
    const free = { ...product, id: "2", slug: "free-2", price: undefined };
    const state = addToCart({ items: [] }, free, 3);
    expect(cartSubtotal(state)).toBe(0);
  });
});
