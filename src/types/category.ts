import type { LocalizedText } from "./localization";

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  image?: string;
  description?: LocalizedText;
}
