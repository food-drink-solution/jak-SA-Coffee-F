import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "@/components/products/product-card";
import { CartProvider } from "@/features/cart/cart.provider";
import type { Product } from "@/types/product";
import React from "react";

// next/image renders a plain img in tests; next/link renders an anchor
vi.mock("next/image", () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => <a href={href} {...rest}>{children}</a>,
}));

const product: Product = {
  id: "91",
  slug: "chocolate-marble-large-91",
  name: { ar: "كيك لوف الشوكولاتة ماربيل", en: "Chocolate Marble Loaf" },
  description: { ar: "", en: "" },
  categoryIds: ["37"],
  categoryName: { ar: "الحلويات", en: "Desserts" },
  subcategoryName: { ar: "", en: "" },
  images: [{ src: "/images/products/p.webp", alt: { ar: "كيك", en: "cake" } }],
  price: { amount: 4.03, currency: "SAR" },
  attributes: [],
  tags: [],
};

describe("ProductCard", () => {
  it("renders localized name, category and price", () => {
    render(
      <CartProvider>
        <ProductCard product={product} locale="ar" addToCartLabel="أضف إلى السلة" addedLabel="تمت الإضافة" priceTaxNote="الأسعار شاملة الضريبة" />
      </CartProvider>,
    );
    expect(screen.getByText("كيك لوف الشوكولاتة ماربيل")).toBeInTheDocument();
    expect(screen.getByText("الحلويات")).toBeInTheDocument();
    expect(screen.getByText(/4.03/)).toBeInTheDocument();
  });

  it("adds the product to the cart on click", async () => {
    const user = userEvent.setup();
    render(
      <CartProvider>
        <ProductCard product={product} locale="en" addToCartLabel="Add to cart" addedLabel="Added" priceTaxNote="Prices include tax" />
      </CartProvider>,
    );
    await user.click(screen.getByRole("button", { name: /add to cart/i }));
    expect(window.localStorage.getItem("jak-cart-v1")).toContain("91");
  });
});
