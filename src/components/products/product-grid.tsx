import type { Product } from "@/types/product";
import type { Locale } from "@/config/locales";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  locale: Locale;
  labels: { addToCart: string; added: string; priceTax: string };
}

export function ProductGrid({ products, locale, labels }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
