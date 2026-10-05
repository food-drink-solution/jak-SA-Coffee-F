# JAK Storefront — Next.js Reconstruction

Production-grade Next.js (App Router, TypeScript strict) reconstruction of
[jak.sa.com](https://jak.sa.com) — a Saudi B2B supplier of ready-to-eat foods.

Arabic-first (RTL) with full English (LTR) support, static catalog, SEO,
accessibility, cart (localStorage), contact form, and a repeatable migration
crawler that produces the normalized local dataset.

## Quick start

This project uses **pnpm** (package manager going forward; `package-lock.json` removed in favor of `pnpm-lock.yaml`).
If pnpm is not on your PATH, run it via `npx pnpm` (pnpm 12.x).

```bash
pnpm install           # or: npx pnpm install
pnpm crawl             # refresh src/data + public/images from jak.sa.com (throttled, public endpoints)
pnpm dev               # http://localhost:3000 -> redirects to /ar
```

Production:

```bash
pnpm build
pnpm start
```

Quality gates:

```bash
pnpm lint
pnpm typecheck
pnpm test            # Vitest unit tests
pnpm test:e2e        # Playwright E2E (chromium)
pnpm validate:data   # dataset sanity checks
```

## Architecture

```
src/
  app/[lang]/            # localized App Router pages (ar, en)
    layout.tsx           # root layout: fonts, providers, header/footer, cart drawer
    page.tsx             # homepage sections
    products/            # listing + [slug] detail (SSG, JSON-LD)
    categories/          # listing + [slug]
    search/              # query + category filter, URL-synced
    about/ contact/ terms/ privacy/ profile/
    not-found.tsx error.tsx loading.tsx
  app/{sitemap,robots,manifest}.ts
  src/app/... => see above; static assets in public/
  components/
    ui/                  # button, badge, input (cva-driven design system)
    layout/              # site header, mobile nav, footer, language switcher
    products/ categories/ cart/ forms/ docs/ sections/ common/
  features/cart/         # cart.types, provider (React Context), storage abstraction, utils
  lib/
    data/catalog.ts      # ProductRepository/CategoryRepository/PageRepository (Local* impls)
    i18n/dictionaries.ts # ar/en dictionaries + t()
    seo/metadata.ts      # canonical, hreflang, locale path helpers
    validation/schemas.ts# Zod schemas for every dataset
    utils.ts
  config/                # locales, site metadata
  types/                 # domain models (Product, Category, PageContent, ...)
  proxy.ts               # locale negotiation + redirect (Next 16 "proxy")
data/: src/data/ (generated JSON)
scripts/crawl/crawl.mjs  # public-endpoint, throttled migration crawler
scripts/validate-data.mjs
docs/                    # source-audit.md, data-migration-report.md, migration-report.json
tests/{unit,e2e}
```

Domain models are independent of UI; pages consume repository interfaces, so a future
`ApiProductRepository` can replace `LocalProductRepository` without touching components.

## Key decisions

- **Next.js 16 App Router + Turbopack**, React 19, Tailwind CSS v4 design tokens in `globals.css`.
- **Design system**: Tailwind v4 with centralized semantic tokens in `src/app/globals.css`;
  primitives use the shadcn/ui convention (`components/ui/*` with CVA + `cn()`),
  icons via **lucide-react**. A modern slim scrollbar (no arrow buttons at top/bottom)
  is applied globally via `::-webkit-scrollbar` rules.
- **i18n**: `[lang]` dynamic segment + `proxy.ts` negotiation (Negotiator +
  intl-localematcher). A single `[lang]` route tree serves both locales — no duplicated pages.
- **RTL/LTR**: `dir` set on `<html>` per locale; logical properties in CSS (`ms-`, `me-`, `rtl:`/`ltr:` variants).
- **Data**: no runtime calls to the source site. The crawler paginates the public
  JSON feed and writes normalized, Zod-validated JSON + local images.
- **Crawling ethics**: 350 ms delays, retries with backoff, no auth, no checkout/cart
  mutations, no customer data. Only publicly reachable assets are mirrored.
- **Cart**: isolated `features/cart` domain, `CartStorage` abstraction over localStorage,
  cleared of any direct DOM dependencies so it can be swapped with an API later.

## Environment

`.env` (optional): `NEXT_PUBLIC_SITE_URL=https://your-domain.tld` — used for canonical
URLs, OpenGraph, sitemap, and JSON-LD.

## Testing

- Unit: catalog repositories, cart utils, i18n dictionary parity, SEO helpers, Zod
  dataset validation, ProductCard interaction (Vitest + Testing Library).
- E2E: homepage RTL/LTR, locale switch, category/product browse, search, contact
  validation, legal pages, mobile drawer (Playwright).
