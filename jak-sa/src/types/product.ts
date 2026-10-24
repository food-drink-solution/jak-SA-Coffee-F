import type { LocalizedText } from "./localization";

export interface ProductImage {
  src: string;
  alt: LocalizedText;
}

export interface Money {
  amount: number;
  currency: "SAR";
}

export type ProductAvailability = "in_stock" | "out_of_stock" | "limited" | "unknown";

export interface ProductAttribute {
  key: string;
  label: LocalizedText;
  value: LocalizedText;
}

export interface Product {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  categoryIds: string[];
  categoryName: LocalizedText;
  subcategoryName: LocalizedText;
  images: ProductImage[];
  thumb?: string;
  price?: Money;
  priceIncludesTax?: boolean;
  availability?: ProductAvailability;
  attributes: ProductAttribute[];
  tags: string[];
  requiresCooling?: boolean;
  deliveryTemperature?: string;
  shelfLife?: string;
  weightGrams?: number;
  packageSize?: string;
  calories?: number;
}
