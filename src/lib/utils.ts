import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: "SAR" = "SAR", locale: "ar" | "en" = "ar"): string {
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-SA-u-nu-latn" : "en-SA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} ${currency === "SAR" ? (locale === "ar" ? "ر.س" : "SAR") : currency}`;
}
