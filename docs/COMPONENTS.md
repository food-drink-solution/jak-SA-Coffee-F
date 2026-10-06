# JAK Storefront — Component Development Guide

## Overview

JAK components follow a **shadcn/ui + CVA pattern** with strict TypeScript and prop-driven composition. All components are located in `src/components/` organized by domain, with reusable primitives in `src/components/ui/`.

---

## Directory Structure

```
src/components/
├── ui/                  # Primitives (design system)
│   ├── button.tsx       # Base button with CVA variants
│   ├── badge.tsx        # Badge/tag component
│   ├── input.tsx        # Form input with validation states
│   ├── icons.tsx        # Icon exports & wrapper
│   ├── card.tsx         # Card container
│   └── types.ts         # Shared types (ButtonVariant, etc.)
├── layout/              # Global layout components
│   ├── site-header.tsx  # Top navigation & branding
│   ├── site-footer.tsx  # Footer with links & social media
│   ├── mobile-nav.tsx   # Mobile menu drawer
│   └── language-switcher.tsx
├── products/            # Product-related components
│   ├── product-card.tsx
│   ├── product-grid.tsx
│   ├── product-detail.tsx
│   └── product-filters.tsx
├── categories/          # Category-related components
│   ├── category-card.tsx
│   ├── category-grid.tsx
│   └── category-detail.tsx
├── cart/                # Shopping cart UI
│   ├── cart-drawer.tsx  # Slide-out cart panel
│   ├── cart-item.tsx    # Individual item row
│   ├── cart-summary.tsx
│   └── cart-empty.tsx
├── forms/               # Form components
│   ├── contact-form.tsx
│   ├── newsletter-form.tsx
│   └── search-form.tsx
├── sections/            # Page composition components
│   ├── hero-section.tsx
│   ├── featured-products.tsx
│   └── cta-section.tsx
├── common/              # Shared utility components
│   ├── breadcrumb.tsx
│   ├── pagination.tsx
│   ├── scroll-top-button.tsx
│   ├── chat-widget.tsx
│   └── loading-skeleton.tsx
└── docs/                # Documentation helpers
    └── legal-content.tsx
```

---

## Primitive Components (ui/)

### Button Component

**File:** `src/components/ui/button.tsx`

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles applied to all buttons
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)]",
        secondary:
          "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)] hover:bg-[var(--color-surface-muted)]",
        accent:
          "bg-[var(--color-accent)] text-[var(--color-accent-foreground)] hover:bg-[var(--color-accent-hover)]",
        ghost: "hover:bg-[var(--color-surface-muted)] text-[var(--color-foreground)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";
```

**Usage:**

```jsx
// Default primary button
<Button>Click me</Button>

// Secondary
<Button variant="secondary">Cancel</Button>

// Large accent
<Button size="lg" variant="accent">
  Checkout
</Button>

// Icon button
<Button size="icon" variant="ghost">
  <MenuIcon />
</Button>

// Link button
<Button variant="link">
  Learn more
</Button>
```

### Badge Component

**File:** `src/components/ui/badge.tsx`

```typescript
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]",
        secondary:
          "bg-[var(--color-surface-muted)] text-[var(--color-foreground)]",
        accent: "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]",
        gold: "bg-[var(--color-jak-accent-gold)] text-[var(--color-jak-accent-gold-foreground)]",
        pink: "bg-[var(--color-jak-accent-pink)] text-[var(--color-jak-accent-pink-foreground)]",
        success: "bg-[var(--color-success)] text-white",
        warning: "bg-[var(--color-warning)] text-[var(--color-foreground)]",
        danger: "bg-[var(--color-danger)] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  )
);
Badge.displayName = "Badge";
```

**Usage:**

```jsx
// Primary badge
<Badge>New</Badge>

// Accent badge
<Badge variant="accent">Sale</Badge>

// Gold badge
<Badge variant="gold">Premium</Badge>

// Status badge
<Badge variant="success">In Stock</Badge>
```

---

## Layout Components

### SiteHeader Component

**File:** `src/components/layout/site-header.tsx`

```typescript
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/config/locales";
import { SearchForm } from "@/components/forms/search-form";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { CartButton } from "@/components/cart/cart-button";
import { MobileNav } from "@/components/layout/mobile-nav";

interface NavItem {
  id: string;
  label: { ar: string; en: string };
  href: string;
}

interface SiteHeaderProps {
  locale: Locale;
  items: NavItem[];
  labels: {
    searchPlaceholder: string;
    langLabel: string;
    openMenu: string;
    closeMenu: string;
    cart: string;
  };
}

export function SiteHeader({ locale, items, labels }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex-shrink-0">
          <Image
            src="/images/brand/logo.png"
            alt="JAK Logo"
            width={40}
            height={40}
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden flex-1 md:flex md:gap-8 md:justify-center">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}${item.href}`}
              className="text-sm font-medium text-[var(--color-foreground)] transition-colors hover:text-[var(--color-primary)]"
            >
              {locale === "ar" ? item.label.ar : item.label.en}
            </Link>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <SearchForm locale={locale} placeholder={labels.searchPlaceholder} />
          <LanguageSwitcher
            locale={locale}
            label={labels.langLabel}
          />
          <CartButton label={labels.cart} />
          <MobileNav
            locale={locale}
            items={items}
            labels={{ open: labels.openMenu, close: labels.closeMenu }}
          />
        </div>
      </div>
    </header>
  );
}
```

---

## Product Components

### ProductCard Component

**File:** `src/components/products/product-card.tsx`

```typescript
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types/product";
import type { Locale } from "@/config/locales";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/hooks";
import { pick } from "@/types/localization";

interface ProductCardProps {
  product: Product;
  locale: Locale;
  variant?: "grid" | "list";
}

export function ProductCard({
  product,
  locale,
  variant = "grid",
}: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: pick(product.name, locale),
      price: product.price,
      quantity: 1,
      image: product.images[0]?.url || "/placeholder.jpg",
    });
  };

  if (variant === "list") {
    return (
      <div className="flex gap-4 border border-[var(--color-border)] rounded-lg p-4">
        <Image
          src={product.images[0]?.url || "/placeholder.jpg"}
          alt={pick(product.name, locale)}
          width={120}
          height={120}
          className="h-30 w-30 rounded-md object-cover"
        />
        <div className="flex-1">
          <h3 className="font-bold text-[var(--color-foreground)]">
            {pick(product.name, locale)}
          </h3>
          <p className="text-sm text-[var(--color-muted)] mt-1">
            {pick(product.description, locale)}
          </p>
          <div className="flex items-center justify-between mt-4">
            <span className="text-lg font-bold text-[var(--color-primary)]">
              {product.price} SAR
            </span>
            <Button size="sm" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className="group relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] transition-shadow hover:shadow-card-hover">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-[var(--color-surface-muted)]">
        <Image
          src={product.images[0]?.url || "/placeholder.jpg"}
          alt={pick(product.name, locale)}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {product.isNew && (
          <Badge className="absolute top-3 right-3 z-10">New</Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-[var(--color-foreground)] line-clamp-2 group-hover:text-[var(--color-primary)] transition-colors">
          {pick(product.name, locale)}
        </h3>

        <p className="text-sm text-[var(--color-muted)] mt-2 line-clamp-2">
          {pick(product.description, locale)}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[var(--color-primary)]">
            {product.price} SAR
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            aria-label={`Add ${pick(product.name, locale)} to cart`}
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## Form Components

### ContactForm Component

**File:** `src/components/forms/contact-form.tsx`

```typescript
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Locale } from "@/config/locales";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Phone must be at least 7 digits"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  locale: Locale;
  onSubmit?: (data: ContactFormData) => Promise<void>;
  labels: {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    submit: string;
    sending: string;
  };
}

export function ContactForm({
  locale,
  onSubmit,
  labels,
}: ContactFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmitHandler = async (data: ContactFormData) => {
    try {
      if (onSubmit) {
        await onSubmit(data);
      }
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmitHandler)}
      className={`space-y-4 w-full max-w-2xl ${
        locale === "ar" ? "text-right" : "text-left"
      }`}
    >
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
          {labels.name}
        </label>
        <Input {...register("name")} placeholder={labels.name} />
        {errors.name && (
          <p className="text-sm text-[var(--color-danger)] mt-1">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
          {labels.email}
        </label>
        <Input
          type="email"
          {...register("email")}
          placeholder={labels.email}
        />
        {errors.email && (
          <p className="text-sm text-[var(--color-danger)] mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
          {labels.phone}
        </label>
        <Input
          type="tel"
          {...register("phone")}
          placeholder={labels.phone}
        />
        {errors.phone && (
          <p className="text-sm text-[var(--color-danger)] mt-1">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Subject */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
          {labels.subject}
        </label>
        <Input {...register("subject")} placeholder={labels.subject} />
        {errors.subject && (
          <p className="text-sm text-[var(--color-danger)] mt-1">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
          {labels.message}
        </label>
        <textarea
          {...register("message")}
          placeholder={labels.message}
          rows={6}
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-md text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-transparent transition-all"
        />
        {errors.message && (
          <p className="text-sm text-[var(--color-danger)] mt-1">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? labels.sending : labels.submit}
      </Button>
    </form>
  );
}
```

---

## Component Best Practices

### 1. **Type-First Design**

Always start with types, not implementation:

```typescript
// ✅ Good
interface ProductCardProps {
  product: Product;
  locale: Locale;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard(props: ProductCardProps) {
  // Implementation follows types
}

// ❌ Bad
export function ProductCard(props: any) {
  // Weak typing, hard to use
}
```

### 2. **Use React.forwardRef for Complex Components**

```typescript
export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(...)} {...props} />
));
```

### 3. **Localization with pick() Helper**

```typescript
import { pick } from "@/types/localization";

// Type-safe field selection
<h3>{pick(product.name, locale)}</h3>

// Instead of:
<h3>{locale === "ar" ? product.name.ar : product.name.en}</h3>
```

### 4. **Use React Context for Global State**

```typescript
// ✅ Good: CartProvider wraps app, useCart() hook
const { addItem, removeItem } = useCart();

// ❌ Avoid: Prop drilling
<ProductCard onAddToCart={onAddToCart} />
```

### 5. **Server vs Client Components**

```typescript
// Server component (default, no "use client")
export async function ProductList() {
  const products = await getProducts(); // Direct DB access
  return <ProductGrid products={products} />;
}

// Client component (forms, interactive)
"use client";
export function SearchForm() {
  const [query, setQuery] = useState("");
  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### 6. **Prop Documentation with JSDoc**

```typescript
/**
 * ProductCard displays a product in a grid or list layout.
 *
 * @param product - The product to display
 * @param locale - The current locale (ar or en)
 * @param variant - Layout variant: "grid" (default) or "list"
 *
 * @example
 * ```tsx
 * <ProductCard product={product} locale="ar" variant="grid" />
 * ```
 */
export function ProductCard(props: ProductCardProps) {
  // ...
}
```

### 7. **Handle Loading & Error States**

```typescript
export function ProductList({ products, isLoading, error }: Props) {
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage message={error} />;
  if (!products.length) return <EmptyState />;

  return <Grid>{/* content */}</Grid>;
}
```

### 8. **Accessibility First**

```typescript
<button
  onClick={() => addToCart(product)}
  aria-label={`Add ${product.name} to cart`}
  className="focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
>
  Add to Cart
</button>
```

---

## Common Component Patterns

### Loading Skeleton

```typescript
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-48 rounded-lg bg-[var(--color-surface-muted)]" />
      <div className="mt-4 space-y-2">
        <div className="h-4 rounded bg-[var(--color-surface-muted)] w-3/4" />
        <div className="h-4 rounded bg-[var(--color-surface-muted)] w-1/2" />
      </div>
    </div>
  );
}
```

### Empty State

```typescript
export function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <h3 className="text-lg font-bold text-[var(--color-foreground)]">
        {title}
      </h3>
      <p className="text-[var(--color-muted)] mt-2">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
```

### Error Boundary

```typescript
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: (error: Error) => ReactNode;
}

export class ErrorBoundary extends Component<Props> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback?.(this.state.error) || (
          <div className="p-4 bg-[var(--color-danger)] text-white rounded-lg">
            Something went wrong
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

---

## Conclusion

JAK components prioritize **type safety, accessibility, and reusability**. All primitives use CVA for consistent variant management, and all components follow a localization-first approach. For new components, start with props/types, then implement, then test.

For examples, see the full implementations in `src/components/`.
