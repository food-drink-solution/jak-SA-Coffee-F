# JAK Storefront — Architecture Guide

## Overview

JAK Storefront is a production-grade Next.js (App Router, TypeScript strict) reconstruction of [jak.sa.com](https://jak.sa.com) — a Saudi B2B supplier of ready-to-eat foods. The architecture emphasizes scalability, maintainability, and domain-driven design with clear separation of concerns.

---

## Directory Structure

### Monorepo Overview

```
jak-storefront/
├── jak-sa/                     # Frontend Next.js 16 Storefront
│   ├── src/                    # Source code
│   ├── public/                 # Static assets (images, brand assets, favicons)
│   ├── tests/                  # Test suites (Vitest, Playwright)
│   ├── package.json            # Frontend dependencies & scripts
│   ├── tsconfig.json           # TypeScript config
│   ├── next.config.ts          # Next.js config
│   ├── vitest.config.ts        # Unit test config
│   ├── playwright.config.ts    # E2E test config
│   ├── eslint.config.mjs       # Linter config
│   └── postcss.config.mjs      # PostCSS config
├── server-api/                 # ASP.NET Core Backend REST API
│   ├── README.md               # Backend API docs
│   └── .gitkeep                # Reserved for backend implementation
├── docs/                       # Monorepo technical documentation
├── scripts/                    # Workspace migration and utility scripts
├── package.json                # Root convenience scripts
└── README.md                   # Monorepo overview
```

---

## Detailed Frontend Source Structure (`jak-sa/src/`)

### `src/app/` — Next.js App Router

```
src/app/
├── globals.css                 # Design tokens, brand colors, utilities
├── favicon.ico
├── manifest.ts                 # PWA manifest generation
├── robots.ts                   # SEO robots.txt
├── sitemap.ts                  # Dynamic XML sitemap
└── [lang]/                     # Locale dynamic segment (ar, en)
    ├── layout.tsx              # Root layout: fonts, providers, header/footer
    ├── page.tsx                # Homepage
    ├── loading.tsx             # Loading skeleton
    ├── error.tsx               # Error boundary
    ├── not-found.tsx           # 404 page
    ├── about/                  # About page
    ├── contact/                # Contact form page
    ├── terms/                  # Terms of service
    ├── privacy/                # Privacy policy
    ├── profile/                # User profile
    ├── products/
    │   ├── page.tsx            # Product listing with filters
    │   └── [slug]/
    │       └── page.tsx        # Product detail (SSG, JSON-LD)
    ├── categories/
    │   ├── page.tsx            # Category listing
    │   └── [slug]/
    │       └── page.tsx        # Category detail with products
    └── search/
        └── page.tsx            # Search results (query + category filter)
```

**Key Pattern:** All routes are static-generated (SSG) except search and contact (which are static with no parameters). URL negotiation happens in `src/proxy.ts`.

---

### `src/components/` — UI Layer

```
src/components/
├── ui/                         # Primitives (design system)
│   ├── button.tsx              # CVA-driven button component
│   ├── badge.tsx               # Badge / tag component
│   ├── input.tsx               # Form input
│   ├── icons.tsx               # SVG/lucide icon exports
│   └── ...                     # Other primitives
├── layout/
│   ├── site-header.tsx         # Top navigation + logo + lang switcher
│   ├── site-footer.tsx         # Footer with links + social media
│   ├── mobile-nav.tsx          # Mobile menu drawer
│   └── language-switcher.tsx   # Locale selector
├── products/
│   ├── product-card.tsx        # Product grid/list item
│   ├── product-grid.tsx        # Grid container
│   ├── product-detail.tsx      # Detail view
│   └── product-filters.tsx     # Filter sidebar
├── categories/
│   ├── category-card.tsx
│   ├── category-grid.tsx
│   └── category-detail.tsx
├── cart/
│   ├── cart-drawer.tsx         # Slide-out cart panel
│   ├── cart-item.tsx           # Individual cart row
│   ├── cart-summary.tsx        # Subtotal, tax, checkout button
│   └── cart-empty.tsx          # Empty state
├── forms/
│   ├── contact-form.tsx        # Contact/inquiry form
│   ├── newsletter-form.tsx     # Newsletter signup
│   └── search-form.tsx         # Product search
├── sections/                   # Page composition
│   ├── hero-section.tsx
│   ├── featured-products.tsx
│   ├── cta-section.tsx
│   └── stats-section.tsx
├── common/
│   ├── scroll-top-button.tsx   # Floating scroll-to-top button
│   ├── chat-widget.tsx         # Support chat bubble
│   ├── breadcrumb.tsx          # Navigation breadcrumbs
│   └── pagination.tsx          # Result pagination
└── docs/                       # Documentation/help components
    └── legal-content.tsx       # Styled legal text
```

**Design System:** All primitives follow the **shadcn/ui convention** with **CVA (Class Variance Authority)** and use Tailwind v4 semantic tokens from `globals.css`.

---

### `src/lib/` — Business Logic

```
src/lib/
├── data/
│   ├── catalog.ts              # Repository interfaces + LocalXyzRepository
│   │                            # - ProductRepository
│   │                            # - CategoryRepository
│   │                            # - PageRepository
│   └── (generated JSON imported)
├── i18n/
│   ├── dictionaries.ts         # ar/en text + t() helper
│   └── dictionaries.{ar,en}.json
├── seo/
│   ├── metadata.ts             # generateMetadata() helpers
│   └── json-ld.ts             # Structured data generation
├── validation/
│   ├── schemas.ts              # Zod schemas for all data models
│   └── rules.ts                # Custom validation rules
├── utils.ts                    # General utilities
└── hooks/                      # Custom React hooks (useCart, useLocale, etc.)
```

**Repository Pattern:** Domain models are independent of UI; pages consume repository interfaces. Future `ApiProductRepository` can replace `LocalProductRepository` without touching components.

---

### `src/features/cart/` — Domain Feature (Isolated)

```
src/features/cart/
├── cart.types.ts               # Cart domain models
├── cart.provider.tsx           # React Context provider
├── cart.storage.ts             # CartStorage abstraction (swap for API)
├── cart.utils.ts               # Pure utility functions
└── hooks.ts                    # useCart() hook
```

**Isolation:** Cart is entirely isolated in its own feature folder. Storage is abstracted so implementation can swap from localStorage → API without touching components.

---

### `src/config/` — Configuration

```
src/config/
├── locales.ts                  # LOCALES array, locale validation
├── site.ts                     # siteConfig: name, description, contact, URLs
├── routes.ts                   # Route constants (if needed)
└── navigation.ts               # Nav menu structure
```

---

### `src/types/` — Domain Models

```
src/types/
├── product.ts                  # export type Product { ... }
├── category.ts                 # export type Category { ... }
├── page-content.ts             # export type PageContent { ... }
├── localization.ts             # export type Localized<T>, pick() helper
└── index.ts                    # Central export
```

**Philosophy:** Types describe the domain, not the UI. Use `Localized<T>` for i18n-aware fields.

---

### `src/proxy.ts` — Locale Negotiation

```typescript
// Handles:
// - Incoming request locale detection
// - Redirect /products → /ar/products (using Negotiator + intl-localematcher)
// - Fallback to default locale
```

---

### `src/data/` — Generated Content

```
src/data/
├── products.json               # Array of Product objects
├── categories.json             # Array of Category objects
├── pages.json                  # Static page content (about, terms, etc.)
└── README.md                   # Generation instructions
```

Generated by `scripts/crawl/crawl.mjs` from jak.sa.com public endpoints.

---

## Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 + App Router | Modern React with SSG/ISR |
| **Language** | TypeScript (strict) | Type safety |
| **Styling** | Tailwind CSS v4 + CVA | Utility-first, design tokens |
| **State** | React Context | Cart management |
| **Forms** | React Hook Form + Zod | Validation, form state |
| **Icons** | lucide-react | Icon library |
| **i18n** | Custom (Negotiator + intl-localematcher) | Locale routing |
| **Testing** | Vitest + Playwright | Unit + E2E |
| **Package Manager** | pnpm | Fast, reliable |

---

## Key Architectural Decisions

### 1. **SSG with Dynamic Locales**

All routes use `generateStaticParams()` to pre-build `/ar/*` and `/en/*` variants at build time. No runtime locale logic — clean, fast, cacheable.

### 2. **RTL/LTR at the HTML Level**

```html
<html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
```

Logical CSS properties (`ms-`, `me-`, `rtl:`, `ltr:` variants) handle direction without component branching.

### 3. **Design Tokens in CSS Custom Properties**

All colors, spacing, shadows defined in `globals.css` under `@theme`. No TypeScript theme file — keeps Tailwind config minimal and leverages native CSS scalability.

### 4. **Repository Abstraction for Data**

```typescript
interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  // ...
}

class LocalProductRepository implements ProductRepository {
  // Reads from src/data/products.json
}
```

Swappable implementation — enables future API/CMS integration.

### 5. **Isolated Cart Feature**

`CartStorage` abstraction over localStorage — no direct DOM deps in cart logic. Can be replaced with an API call without changing components.

### 6. **Ethical Crawling**

- 350ms delays between requests
- Public endpoints only
- No auth, no checkout, no customer data
- Respects robots.txt

---

## Data Flow

### Page Rendering

```
Route Request
  ↓
[Locale Negotiation in proxy.ts]
  ↓
Next.js Router → /[lang]/products/[slug]
  ↓
generateStaticParams() generates build variants
  ↓
Page component calls repository
  ↓
Repository reads from src/data/products.json
  ↓
Components receive typed data
  ↓
Static HTML generated at build time
```

### Cart State Flow

```
User adds item to cart
  ↓
useCart() hook dispatch action
  ↓
CartProvider state updates
  ↓
CartStorage.set() saves to localStorage
  ↓
All consuming components re-render
  ↓
CartDrawer shows updated cart
```

---

## Build Pipeline

```bash
pnpm install           # Install dependencies
pnpm crawl             # Generate src/data/ + public/images/
pnpm build             # Compile, SSG all routes
pnpm lint              # ESLint check
pnpm typecheck         # TypeScript strict check
pnpm validate:data     # Zod schema validation
pnpm test              # Vitest unit tests
pnpm test:e2e          # Playwright E2E tests
```

---

## Performance Optimizations

1. **Static Generation:** All routes pre-built at deploy time
2. **Image Optimization:** Next.js `<Image>` component with local images
3. **Font Loading:** `next/font/google` with `swap` display strategy
4. **CSS-in-JS:** Zero runtime overhead — Tailwind utility classes
5. **No Runtime Locale Logic:** Locales baked into build
6. **Lazy Components:** React `<Suspense>` for non-critical sections

---

## Scalability Path

### Current (Static + Local Data)
- SSG all pages
- Read from `src/data/*.json`

### Phase 2 (Dynamic + API)
- Replace `LocalProductRepository` → `ApiProductRepository`
- Enable ISR for catalog changes
- No component changes required

### Phase 3 (Admin + CMS)
- Integrate headless CMS (Sanity, Contentful)
- Add admin dashboard
- Content versioning + approval workflow

---

## File Naming Conventions

- **Components:** PascalCase (`ProductCard.tsx`, `SiteHeader.tsx`)
- **Types:** PascalCase (`Product.ts`, `Category.ts`)
- **Hooks:** camelCase + `use` prefix (`useCart.ts`, `useLocale.ts`)
- **Utils:** camelCase (`formatPrice.ts`, `slugify.ts`)
- **Routes:** lowercase + hyphens (`[lang]/products/[slug]/page.tsx`)

---

## Conclusion

JAK Storefront combines modern Next.js patterns with clean domain modeling. The architecture scales from static content to dynamic data fetching without refactoring components — future-proof, maintainable, and performant.

For questions or deeper dives, see:
- `docs/branching-strategy.md` — Git workflow
- `docs/source-audit.md` — Original site audit
- `docs/data-migration-report.md` — Crawl details
