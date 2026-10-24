import type { Product } from "@/types/product";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image?: string;
  price: number | null;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export function addToCart(state: CartState, product: Product, quantity = 1): CartState {
  const existing = state.items.find((i) => i.productId === product.id);
  if (existing) {
    return {
      items: state.items.map((i) => (i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i)),
    };
  }
  return {
    items: [
      ...state.items,
      {
        productId: product.id,
        slug: product.slug,
        name: product.name.ar,
        image: product.images[0]?.src,
        price: product.price ? product.price.amount : null,
        quantity,
      },
    ],
  };
}

export function removeFromCart(state: CartState, productId: string): CartState {
  return { items: state.items.filter((i) => i.productId !== productId) };
}

export function setQuantity(state: CartState, productId: string, quantity: number): CartState {
  if (quantity <= 0) return removeFromCart(state, productId);
  return { items: state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)) };
}

export function cartSubtotal(state: CartState): number {
  return state.items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);
}

export function cartCount(state: CartState): number {
  return state.items.reduce((sum, i) => sum + i.quantity, 0);
}
