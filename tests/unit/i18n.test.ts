import { describe, expect, it } from "vitest";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import { switchLocalePath } from "@/lib/seo/metadata";
import { LOCALES } from "@/config/locales";

describe("i18n dictionaries", () => {
  it("has identical key trees for ar and en", () => {
    function keys(obj: unknown, prefix = ""): string[] {
      if (typeof obj !== "object" || obj === null) return [prefix];
      return Object.entries(obj as Record<string, unknown>).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
    }
    const arKeys = keys(getDictionary("ar")).sort();
    const enKeys = keys(getDictionary("en")).sort();
    expect(arKeys).toEqual(enKeys);
  });

  it("t() resolves nested paths and falls back to the path", () => {
    const dict = getDictionary("ar");
    expect(t(dict, "nav.home")).toBe("الرئيسية");
    expect(t(dict, "missing.key")).toBe("missing.key");
  });

  it("exposes a dictionary for every locale", () => {
    for (const locale of LOCALES) {
      expect(t(getDictionary(locale), "nav.home")).toBeTruthy();
    }
  });
});

describe("switchLocalePath", () => {
  it("replaces the locale prefix", () => {
    expect(switchLocalePath("/ar/products/abc", "en")).toBe("/en/products/abc");
    expect(switchLocalePath("/en", "ar")).toBe("/ar");
  });

  it("adds a locale prefix when missing", () => {
    expect(switchLocalePath("/products", "ar")).toBe("/ar/products");
  });
});
