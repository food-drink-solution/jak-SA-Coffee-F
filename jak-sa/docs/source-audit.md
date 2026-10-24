# Source Audit — jak.sa.com

Audit performed: 2026-10-06. Base URL inspected: `https://jak.sa.com` (Arabic default, English under `/en`).

## Stack observation

The source is a Salla-like storefront with a custom theme (`/new-front`) and a Vue SPA bundle (`/js/app.js`).
The public catalog is exposed through an AJAX JSON endpoint:

- `GET /{ar|en}/search?ajax=1&page=N` → paginated JSON: `{ status, url, data: { current_page, data[], total, last_page, per_page, links, ... } }`
- Category filter: `GET /{locale}/search?ajax=1&page=N&category_id=[{id}]` (JSON-encoded array)
- Search keyword + sort params are supported client-side (see `app.js` search component)

## Discovered routes

- `/` — Arabic homepage (server-rendered sections incl. best sellers, categories, values)
- `/en` — English homepage
- `/search` — client-rendered catalog (AR/EN via `/ar`, `/en` prefixes)
- `/product/{id}` — product detail (server-rendered, embeds `:item='{"..."}'` JSON props, incl. related products)
- `/page/about-us`, `/page/conditions`, `/page/privacy` — static content pages (AR + `/en` variants)
- `/contact-us` — contact info page (AR + `/en` variants)
- `/ar/profile`, `/en/profile` — company profile landing page; links six PDF documents (currently 404 upstream)

## Product fields (from the JSON feed)

id, sku, title, description, price, calorie, dimensions, client_price, has_cover,
measurement_unit, min_quantity, quantity, category_id, subcategory_id,
delivery_status, category_name, expiry, temperature, weight, photo, thumb,
deliver_status, photos[], is_liked/is_fav/is_carted, purchase_count,
subcategory_name, offer_* fields.

Prices are shown with the note "الأسعار شاملة الضريبة" (prices include tax).

## Catalog size

- 107 products total (AR and EN feeds identical in count and ids)
- 6 categories: الساندويش (31), بريتزل (46), الكروسان (29), الحلويات (37), السلطات (33), مشروبات (43)
- Category "مشروبات" has no products in the feed

## Assets discovered

- 214 product images (`/uploads/product-*.webp` + thumbs) — migrated locally
- 5 category photos + 5 category icons — migrated locally
- Brand logos (`/images/logo.png`, `/images/footer_logo.png`) — migrated locally
- 4 embedded base64 page images on `/page/about-us` (AR+EN content)
- 6 PDF documents on `/ar/profile` — all return HTTP 404 on the live site (dead links), so they are NOT redistributed; `company.json` records this

## SEO observations

- No sitemap.xml (404)
- OG tags present (`og:title`, `og:description`, `og:image`)
- JSON-LD structured data absent on product pages
- Mixed content: about page content is embedded as an image (poor for SEO/a11y)

## Missing / inaccessible data

- PDFs linked from `/ar/profile` are 404
- Product stock counts are negative in the feed (interpreted as unbounded)
- `sku`, `offer_*`, `photos[]` fields are empty/null across products

## Social & app links

- `https://play.google.com/store/apps/details?id=com.entlq.jak`
- `https://apps.apple.com/us/app/jak-f-b-جاك/id6455428264`

## Contact

- Phone: +966 55 080 3012
- Email: support@jak.sa.com
