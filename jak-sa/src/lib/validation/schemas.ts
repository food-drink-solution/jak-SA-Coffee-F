import { z } from "zod";

const LocalizedTextSchema = z.object({ ar: z.string(), en: z.string() });

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  name: LocalizedTextSchema,
  description: LocalizedTextSchema,
  categoryIds: z.array(z.string()),
  categoryName: LocalizedTextSchema,
  subcategoryName: LocalizedTextSchema,
  images: z.array(z.object({ src: z.string(), alt: LocalizedTextSchema })),
  thumb: z.string().optional(),
  price: z.object({ amount: z.number().nonnegative(), currency: z.literal("SAR") }).optional(),
  priceIncludesTax: z.boolean().optional(),
  availability: z.enum(["in_stock", "out_of_stock", "limited", "unknown"]).optional(),
  attributes: z.array(z.object({ key: z.string(), label: LocalizedTextSchema, value: LocalizedTextSchema })),
  tags: z.array(z.string()),
  requiresCooling: z.boolean().optional(),
  deliveryTemperature: z.string().optional(),
  shelfLife: z.string().optional(),
  weightGrams: z.number().optional(),
  packageSize: z.string().optional(),
});

export const CategorySchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  name: LocalizedTextSchema,
  image: z.string().optional(),
  description: LocalizedTextSchema.optional(),
});

export const PageContentSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: LocalizedTextSchema,
  content: z.object({ ar: z.array(z.string()), en: z.array(z.string()) }),
  images: z.object({ ar: z.string().optional(), en: z.string().optional() }).optional(),
});

export const CompanyProfileSchema = z.object({
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  appStore: z.string().nullable().optional(),
  googlePlay: z.string().nullable().optional(),
  social: z.record(z.string(), z.string().nullable()),
  documents: z.array(
    z.object({
      id: z.string(),
      title: LocalizedTextSchema,
      type: z.enum(["pdf", "image", "external"]),
      url: z.string(),
      locale: z.enum(["ar", "en", "both"]),
    }),
  ),
});

export function validateDataset<T>(schema: z.ZodType<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(`Invalid ${label} data: ${result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ")}`);
  }
  return result.data;
}
