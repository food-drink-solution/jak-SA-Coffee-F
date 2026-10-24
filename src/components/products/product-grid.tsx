import type { Product } from "@/types/product";
import type { Locale } from "@/config/locales";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  locale: Locale;
  view?: "grid" | "list";
  labels: { addToCart: string; added: string; priceTax: string };
}

export function ProductGrid({ products, locale, view = "grid", labels }: ProductGridProps) {
  if (view === "list") {
    return (
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            locale={locale}
            view="list"
            addToCartLabel={labels.addToCart}
            addedLabel={labels.added}
            priceTaxNote={labels.priceTax}
          />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          locale={locale}
          addToCartLabel={labels.addToCart}
          addedLabel={labels.added}
          priceTaxNote={labels.priceTax}
        />
      ))}
    </div>
  );
}
