# Data Migration Report

Generated from `scripts/crawl/crawl.mjs` (see `docs/migration-report.json` for the raw run log).

## Extracted records

| Dataset | Records | File |
| --- | --- | --- |
| Products (normalized, bilingual) | 107 | `src/data/products/products.json` |
| Products AR (flattened) | 107 | `src/data/products/products.ar.json` |
| Products EN (flattened) | 107 | `src/data/products/products.en.json` |
| Categories | 6 | `src/data/categories/categories.json` |
| Content pages | 4 (about, contact, terms, privacy) | `src/data/pages/pages.json` |
| Company profile | 1 | `src/data/company/company.json` |
| Product images (photo + thumb) | 214 | `public/images/products/` |
| Category photos | 5 | `public/images/categories/` |
| Page content images | 1 (about, AR) | `public/images/pages/` |
| Brand assets | 2 | `public/images/brand/` |

## Failed records

- 6 PDF documents referenced on `/ar/profile` return HTTP 404 from the source
  (`jak_profile_arabic.pdf`, `jak_profile_english.pdf`, `jak_products_arabic.pdf`,
  `jak_products_english.pdf`, `united_food_profile_english.pdf`, `united_food_services_english.pdf`).
  They were intentionally excluded rather than mirrored.

## Duplicates

- `:item=` props are repeated across add-to-cart / wishlist / quick-view components.
  Normalization deduplicates products by `id` (and slugs by suffixing the numeric id).
- Category nav cards duplicate the category link markup; pairing was made deterministic
  by joining each card image to the next category link.

## Missing translations

- "مشروبات" (beverages) has Arabic-only coverage: no products in the feed, English
  name derived from the EN homepage card alt text ("BEVERAGE").
- EN feed product titles/descriptions are fully populated; EN category names use
  the source's English strings (e.g. "CROSSONITE" for الكروسان, "PRETZEL").

## Invalid URLs

- All product/category/image URLs in the migrated catalog resolve locally.
- The 6 PDFs above remain dead on the source.

## Normalization decisions

- **prices**: kept `undefined` when the feed reports 0/negative or missing values;
  `priceIncludesTax: true` reflects the site-wide "شاملة الضريبة" note.
- **availability**: assumed `in_stock`; the feed's negative `quantity` values are
  treated as unbounded rather than negative stock.
- **slugs**: `{latin-or-arabic-title-slug}-{id}` guarantees uniqueness and stability.
- **calories**: preserved inside `attributes` (key `calories`).
- **base64 page copy**: `/page/about-us` ships its copy as embedded images; these were
  decoded and stored under `public/images/pages/` and referenced from `pages.images`.
- **pagination/search**: the crawler paginates the public JSON feed
  (`GET /{locale}/search?ajax=1&page=N`) with a 350 ms inter-request delay, retries
  with exponential backoff, a 30 s timeout, and no authentication — no private APIs,
  no customer data, and no protected routes were touched.
