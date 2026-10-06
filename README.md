# 🎉 JAK Storefront

Production-grade **Next.js + TypeScript** reconstruction of [jak.sa.com](https://jak.sa.com) — Saudi B2B ready-to-eat foods supplier.

**Arabic-first (RTL) + English (LTR) • SSG • SEO • Accessibility • Cart • Contact Form**

---

## ⚡ Quick Start

```bash
# Install dependencies
pnpm install

# Generate product data
pnpm crawl

# Start development
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) → Auto-redirects to `/ar`

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 16 + React 19 | App Router, SSG, fast |
| **Language** | TypeScript (strict) | Type safety |
| **Styling** | Tailwind CSS v4 | Design tokens, utilities |
| **State** | React Context | Cart management |
| **Forms** | React Hook Form + Zod | Validation |
| **i18n** | Negotiator + intl-localematcher | Locale routing |
| **Testing** | Vitest + Playwright | Unit + E2E |
| **Package Mgr** | pnpm | Fast, reliable |

---

## 📂 Project Structure

```
src/
├── app/[lang]/              # Localized routes (ar, en)
│   ├── layout.tsx           # Root layout, providers
│   ├── page.tsx             # Homepage
│   ├── products/            # Product pages (SSG)
│   ├── categories/          # Category pages (SSG)
│   ├── search/              # Search results
│   └── about/ contact/ ...
├── components/              # React components
│   ├── ui/                  # Primitives (button, badge, input)
│   ├── layout/              # Header, footer, nav
│   ├── products/            # Product components
│   └── cart/ forms/ ...
├── lib/                     # Business logic
│   ├── data/catalog.ts      # Repository pattern
│   ├── i18n/                # Translations (ar, en)
│   ├── seo/                 # Metadata helpers
│   └── validation/          # Zod schemas
├── features/cart/           # Isolated cart domain
└── types/                   # TypeScript models
```

---

## 🚀 Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production server |
| `pnpm lint` | Lint code |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | E2E tests (Playwright) |
| `pnpm validate:data` | Validate dataset |
| `pnpm crawl` | Refresh data from source |

---

## 🎨 Design System

**Brand Colors** (defined in `src/app/globals.css`):
- **Purple** `#4e0161` — Primary actions
- **Gold** `#b88539` — Accents & highlights
- **Pink** `#e83e8c` — Secondary accents

All colors as CSS custom properties for easy theming.

---

## 🌍 Localization

- **Dual-locale:** Arabic (RTL) + English (LTR)
- **Single route tree:** `/[lang]/...` generates `/ar/...` and `/en/...`
- **Translations:** `src/lib/i18n/dictionaries.*.json`
- **Helper:** `t(dict, "key.path")` for type-safe strings

---

## 📊 Key Features

✅ **Static Site Generation (SSG)** — All pages pre-built at deploy time  
✅ **RTL/LTR Support** — Full Arabic + English from day one  
✅ **Accessible** — WCAG AA standards, keyboard navigation  
✅ **SEO** — JSON-LD, canonical URLs, hreflang tags  
✅ **Shopping Cart** — localStorage-backed with Context API  
✅ **Contact Form** — Validated with React Hook Form + Zod  
✅ **Ethical Crawling** — 350ms delays, public endpoints only  
✅ **Type-Safe Data** — Zod validation for all models  

---

## 🔧 Architecture Highlights

### Repository Pattern
Domain models independent of UI — swap `LocalProductRepository` for `ApiProductRepository` without touching components.

### Localization at Build Time
No runtime locale logic — locales baked into SSG. Fast, cacheable, predictable.

### Isolated Cart Feature
`CartStorage` abstraction over localStorage — swappable with API without refactoring.

### Design Tokens
Tailwind v4 + CSS custom properties in `globals.css` — scale themes without code changes.

---

## 📚 Documentation

Complete guides in `docs/`:
- **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** — Setup & workflow
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — System design
- **[COMPONENTS.md](./docs/COMPONENTS.md)** — Component patterns
- **[STYLES.md](./docs/STYLES.md)** — Design system reference

---

## 🧪 Testing

```bash
# Unit tests (Vitest)
pnpm test

# E2E tests (Playwright)
pnpm test:e2e

# Full quality check
pnpm lint && pnpm typecheck && pnpm test && pnpm validate:data
```

---

## 🌐 Environment

Optional `.env.local` for canonical URLs:

```env
NEXT_PUBLIC_SITE_URL=https://jak.sa.com
```

Used for OpenGraph, sitemap, and JSON-LD.

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes & test: `pnpm lint && pnpm typecheck && pnpm test`
3. Commit: `git commit -m "feat: description"`
4. Push: `git push -u origin feature/my-feature`

See [docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md) for full workflow.

---

## 📄 License

Private project — All rights reserved

---

**Repository:** https://github.com/we3ds-solution/jak-SA-Coffee-F  
**Built with ❤️ for JAK Storefront**
