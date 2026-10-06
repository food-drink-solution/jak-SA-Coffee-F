# JAK Storefront — Development Guide

## Quick Start

### Prerequisites

- Node.js 18+ (verify: `node --version`)
- pnpm 9+ (verify: `pnpm --version` or install via `npm install -g pnpm`)
- Git

### Initial Setup

```bash
# Clone repository
git clone https://github.com/we3ds-solution/jak-SA-Coffee-F.git
cd jak-SA-Coffee-F

# Install dependencies
pnpm install

# Set up environment (optional)
# Create .env.local if deploying (see Environment section below)

# Generate data from source site
pnpm crawl

# Start development server
pnpm dev
```

Visit `http://localhost:3000` — redirects to `/ar` by default.

---

## Development Commands

### Running the App

```bash
# Development server (hot reload)
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

### Quality Gates

```bash
# Lint code
pnpm lint

# Type check
pnpm typecheck

# Run unit tests (Vitest)
pnpm test

# Run E2E tests (Playwright)
pnpm test:e2e

# Validate dataset integrity
pnpm validate:data

# Data refresh (pulls from jak.sa.com)
pnpm crawl
```

### Useful Combinations

```bash
# Full quality check (before pushing)
pnpm lint && pnpm typecheck && pnpm test && pnpm validate:data

# Development with tests in watch mode
pnpm dev &
pnpm test:watch  # (if available in future)

# Build for staging/preview
pnpm build && pnpm start
```

---

## File Organization

### Adding a New Page

1. **Create the route folder:**

```
src/app/[lang]/products/new-page/
└── page.tsx
```

2. **Implement the page with metadata:**

```typescript
import type { Metadata } from "next";
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/config/locales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);

  return {
    title: "Page Title",
    description: t(dict, "meta.pageDescription"),
  };
}

export default async function NewPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = getDictionary(locale);

  return (
    <main>
      <h1>{t(dict, "page.title")}</h1>
      {/* Content */}
    </main>
  );
}
```

3. **Add i18n strings** to `src/lib/i18n/dictionaries.*.json`:

```json
{
  "page": {
    "title": "صفحتي الجديدة" // Arabic
  }
}
```

### Adding a New Component

1. **Create component file** in appropriate subdirectory:

```
src/components/products/new-component.tsx
```

2. **Define props with TypeScript:**

```typescript
import type { ReactNode } from "react";
import type { Product } from "@/types/product";

interface NewComponentProps {
  product: Product;
  onSelect?: (product: Product) => void;
  children?: ReactNode;
}

export function NewComponent({ product, onSelect, children }: NewComponentProps) {
  return (
    <div>
      {/* Implementation */}
    </div>
  );
}
```

3. **Use the component:**

```typescript
import { NewComponent } from "@/components/products/new-component";

export default function ProductPage() {
  return <NewComponent product={myProduct} />;
}
```

### Adding a New Type

```typescript
// src/types/my-model.ts
import type { Localized } from "@/types/localization";

export interface MyModel {
  id: string;
  name: Localized<string>;
  description: Localized<string>;
  createdAt: Date;
}
```

Export from `src/types/index.ts`:

```typescript
export type { MyModel } from "./my-model";
```

### Adding a New Route

1. **Define in repository:**

```typescript
// src/lib/data/catalog.ts
export interface MyRepository {
  getMyItems(): Promise<MyItem[]>;
  getMyItemBySlug(slug: string): Promise<MyItem | null>;
}

export const myRepository: MyRepository = new LocalMyItemRepository();
```

2. **Create page:**

```typescript
// src/app/[lang]/my-items/page.tsx
import { myRepository } from "@/lib/data/catalog";

export default async function MyItemsPage() {
  const items = await myRepository.getMyItems();
  return <MyGrid items={items} />;
}
```

3. **Add to navigation** in `src/config/navigation.ts` or `src/app/[lang]/layout.tsx`.

---

## Localization (i18n)

### Adding Translation Strings

All strings live in `src/lib/i18n/dictionaries.*.json`:

```json
{
  "nav": {
    "home": "الرئيسية",
    "products": "المنتجات"
  },
  "footer": {
    "social": "تابعنا على وسائل التواصل"
  }
}
```

### Using Translations in Components

```typescript
import { getDictionary, t } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/config/locales";

export function MyComponent({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return <h1>{t(dict, "nav.home")}</h1>;
}
```

### RTL/LTR Handling

```jsx
<div className={`${locale === "ar" ? "text-right" : "text-left"}`}>
  {/* Content */}
</div>

// Or use Tailwind variants:
<div className="rtl:text-right ltr:text-left">
  {/* Content */}
</div>
```

---

## Styling & Design System

### Using Design Tokens

All colors defined in `src/app/globals.css`. Use CSS custom properties:

```jsx
<button className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]">
  Action
</button>
```

### Creating a New Component with CVA

```typescript
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const componentVariants = cva("base-classes", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
    color: {
      primary: "text-[var(--color-primary)]",
      accent: "text-[var(--color-accent)]",
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

export function MyComponent({ size, color }: Props) {
  return <div className={cn(componentVariants({ size, color }))} />;
}
```

### Responsive Design

Use Tailwind breakpoints:

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

---

## Data & Validation

### Validating Data with Zod

```typescript
// src/lib/validation/schemas.ts
import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.object({
    ar: z.string(),
    en: z.string(),
  }),
  price: z.number().positive(),
  images: z.array(z.object({
    url: z.string().url(),
    alt: z.string(),
  })),
});

export type Product = z.infer<typeof ProductSchema>;
```

### Using Validated Data

```typescript
import { ProductSchema } from "@/lib/validation/schemas";

const data = await fetch("...").then(r => r.json());
const product = ProductSchema.parse(data); // Throws if invalid
```

---

## Forms & Validation

### React Hook Form + Zod

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} />
      {errors.email && <span>{errors.email.message}</span>}
      <input type="password" {...register("password")} />
      {errors.password && <span>{errors.password.message}</span>}
      <button type="submit">Sign In</button>
    </form>
  );
}
```

---

## Testing

### Unit Tests (Vitest + React Testing Library)

Create a test file alongside component:

```typescript
// src/components/ui/button.test.tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("calls onClick handler", async () => {
    const handler = vi.fn();
    render(<Button onClick={handler}>Click</Button>);
    await userEvent.click(screen.getByText("Click"));
    expect(handler).toHaveBeenCalled();
  });

  it("applies variant classes", () => {
    render(<Button variant="secondary">Click</Button>);
    expect(screen.getByText("Click")).toHaveClass("bg-[var(--color-surface)]");
  });
});
```

### E2E Tests (Playwright)

Create test in `tests/e2e/`:

```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from "@playwright/test";

test("homepage loads and locale switch works", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Verify Arabic locale
  await expect(page).toHaveTitle(/JAK/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");

  // Switch to English
  await page.click("[data-test='lang-switcher']");
  await page.click("[data-test='lang-en']");

  // Verify English locale
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
```

Run tests:

```bash
pnpm test              # Unit tests
pnpm test:e2e         # E2E tests
```

---

## Cart State Management

### Using the Cart Hook

```typescript
import { useCart } from "@/features/cart/hooks";

export function ProductCard({ product }: Props) {
  const { addItem, removeItem, cart } = useCart();

  return (
    <button
      onClick={() => addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.images[0]?.url,
      })}
    >
      Add to Cart ({cart.items.length})
    </button>
  );
}
```

### Cart Hook API

```typescript
const { 
  cart,                // Current cart state
  addItem,            // Add item to cart
  removeItem,         // Remove item by ID
  updateQuantity,     // Update item quantity
  clearCart,          // Clear all items
  isLoading,          // Loading state
} = useCart();
```

---

## Environment Variables

### Development (.env.local)

Optional, used for canonical URLs in SEO:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (.env.production)

Required for deployment:

```env
NEXT_PUBLIC_SITE_URL=https://jak.sa.com
```

---

## Git Workflow

### Branching Strategy

- `main` — Production-ready code
- `develop` — Integration branch for features
- `feature/*` — Feature branches (e.g., `feature/product-filter`)
- `fix/*` — Bug fixes
- `docs/*` — Documentation updates

### Creating a Feature

```bash
# Update develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/my-feature

# Make changes, commit regularly
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push -u origin feature/my-feature

# (Create PR on GitHub)
```

### Commit Message Format

Follow conventional commits:

```
feat: add product filtering
fix: resolve cart state bug
docs: update architecture guide
style: format component exports
refactor: simplify locale negotiation
test: add product card tests
chore: update dependencies
```

---

## Deployment

### Build for Production

```bash
pnpm build
pnpm start
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Other Platforms

**Next.js supports:** AWS, Azure, Netlify, self-hosted, etc.

For self-hosted:
```bash
pnpm build
pnpm start  # Listens on port 3000
```

---

## Troubleshooting

### Port 3000 Already in Use

```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Build Fails

```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Rebuild
pnpm build
```

### Type Errors After Changes

```bash
# Type check
pnpm typecheck

# Check ESLint
pnpm lint
```

### Crawl Data Issues

```bash
# Validate dataset
pnpm validate:data

# Full refresh (caution: ~5 minutes)
pnpm crawl
```

---

## Performance Tips

1. **Use `next/image`** for all product/category images
2. **Lazy load** non-critical components with `React.lazy()` + `Suspense`
3. **Minimize JS** — avoid inline scripts, use Tailwind for styles
4. **Cache static content** — JAK products updated daily via crawl
5. **Monitor CLS** — avoid layout shifts with fixed image dimensions

---

## Useful Resources

- **Next.js Docs:** https://nextjs.org/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **Tailwind CSS Docs:** https://tailwindcss.com/docs
- **React Hook Form Docs:** https://react-hook-form.com/
- **Zod Validation:** https://zod.dev/
- **Playwright Testing:** https://playwright.dev/
- **Vitest:** https://vitest.dev/

---

## Architecture References

For deeper understanding, see:
- `docs/ARCHITECTURE.md` — System design
- `docs/STYLES.md` — Design tokens & component styling
- `docs/COMPONENTS.md` — Component patterns & examples
- `docs/branching-strategy.md` — Detailed git workflow

---

## Getting Help

1. **Check existing issues** on GitHub
2. **Review documentation** in `docs/` folder
3. **Ask in Discord/Slack** (if team channel exists)
4. **Create a detailed issue** with:
   - What you were trying to do
   - What happened (error message, screenshot)
   - Reproduction steps
   - Your environment (Node version, OS, etc.)

---

## Quick Reference: Common Tasks

| Task | Command |
|------|---------|
| Start dev server | `pnpm dev` |
| Build for production | `pnpm build` |
| Run tests | `pnpm test` |
| Run E2E tests | `pnpm test:e2e` |
| Type check | `pnpm typecheck` |
| Lint code | `pnpm lint` |
| Validate data | `pnpm validate:data` |
| Refresh data | `pnpm crawl` |
| Full check | `pnpm lint && pnpm typecheck && pnpm test` |

---

Happy coding! 🎉
