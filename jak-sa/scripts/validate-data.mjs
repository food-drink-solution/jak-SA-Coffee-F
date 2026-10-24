/**
 * Quick structural sanity check of generated data (used after crawling).
 * Full schema validation lives in tests/unit/data-validation.test.ts.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function load(p) {
  return JSON.parse(await readFile(path.join(ROOT, p), "utf8"));
}

let failed = 0;
function check(cond, label) {
  if (!cond) {
    console.error("FAIL:", label);
    failed++;
  } else {
    console.log("ok:", label);
  }
}

const products = await load("src/data/products/products.json");
const categories = await load("src/data/categories/categories.json");
const pages = await load("src/data/pages/pages.json");
const company = await load("src/data/company/company.json");

check(Array.isArray(products) && products.length > 0, `products exist (${products.length})`);
check(Array.isArray(categories) && categories.length > 0, `categories exist (${categories.length})`);
check(Array.isArray(pages) && pages.length >= 4, `pages exist (${pages.length})`);
check(
  products.every((p) => p.id && p.slug && p.name?.ar && p.name?.en && Array.isArray(p.attributes)),
  "every product has id, slug, bilingual name, attributes",
);
check(
  products.every((p) => typeof p.price === "undefined" || (typeof p.price.amount === "number" && p.price.currency === "SAR")),
  "product prices are well-formed",
);
check(categories.every((c) => c.id && c.slug && c.name?.ar && c.name?.en), "categories are well-formed");
check(pages.every((p) => p.id && Array.isArray(p.content?.ar) && Array.isArray(p.content?.en)), "pages are well-formed");
check(typeof company === "object" && Array.isArray(company.documents), "company profile is well-formed");

const slugs = new Set();
const dupes = products.filter((p) => slugs.has(p.slug)).length;
products.forEach((p) => slugs.add(p.slug));
check(dupes === 0, "no duplicate product slugs");

if (failed > 0) {
  console.error(`\n${failed} validation check(s) failed`);
  process.exit(1);
}
console.log("\nAll data checks passed.");
