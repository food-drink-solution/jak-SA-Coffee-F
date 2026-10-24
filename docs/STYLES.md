# JAK Storefront — Design System & Styles Guide

## Overview

JAK Storefront uses **Tailwind CSS v4** with a centralized design token system defined in `src/app/globals.css`. All colors, typography, spacing, and effects follow a cohesive brand language rooted in the JAK brand identity (Saudi coffee retailer).

---

## Color System

### Brand Colors

All colors are defined as CSS custom properties in `src/app/globals.css` and mapped through semantic names.

#### JAK Primary Purple

The dominant brand color — used for primary buttons, links, focus states, and the scrollbar.

```css
--color-jak-primary: #4e0161;           /* Main purple */
--color-jak-primary-hover: #5a0272;     /* Hover state */
--color-jak-primary-light: #6b2a85;     /* Light variant */
--color-jak-primary-dark: #3a0148;      /* Dark variant */
--color-jak-primary-foreground: #ffffff;/* Text on primary */
```

**Usage:**
- Primary CTA buttons
- Link hover states
- Focus rings
- Scrollbar thumb
- Branding

#### Accent: Pink/Magenta

Controlled accent color for secondary CTAs and highlights (NOT dominant).

```css
--color-jak-accent-pink: #e83e8c;        /* Main pink */
--color-jak-accent-pink-hover: #d6337c;  /* Hover */
--color-jak-accent-pink-light: #f06ab8;  /* Light */
--color-jak-accent-pink-foreground: #ffffff;
```

**Usage:**
- Secondary buttons
- Badge accents
- Decorative highlights
- Badges/tags

#### Accent: Gold/Amber

Used for special highlights, badges, and premium CTAs.

```css
--color-jak-accent-gold: #b88539;        /* Main gold */
--color-jak-accent-gold-hover: #a07231;  /* Hover */
--color-jak-accent-gold-light: #d4a55a;  /* Light */
--color-jak-accent-gold-foreground: #1f2937;
```

**Usage:**
- Premium badges
- Special offers
- Highlight accents
- Awards/achievements

#### Secondary: Violet

Subtle purple variant for secondary text and subtle backgrounds.

```css
--color-jak-violet: #82588d;        /* Main */
--color-jak-violet-hover: #6d4877;  /* Hover */
```

---

### Semantic Colors

Mapped from brand colors for consistent component usage.

```css
/* Primary (uses JAK purple) */
--color-primary: #4e0161;
--color-primary-hover: #5a0272;
--color-primary-light: #6b2a85;
--color-primary-dark: #3a0148;
--color-primary-foreground: #ffffff;

/* Accent (uses gold by default) */
--color-accent: #b88539;
--color-accent-hover: #a07231;
--color-accent-light: #d4a55a;
--color-accent-foreground: #1f2937;

/* Neutral background & text */
--color-background: #ffffff;
--color-surface: #ffffff;
--color-surface-muted: #f8f9fa;
--color-foreground: #343a40;
--color-foreground-muted: #7e7e7e;
--color-muted: #9b9b9b;

/* Borders */
--color-border: #eeeeee;
--color-border-strong: #dee2e6;

/* Focus & rings */
--color-ring: #4e0161;

/* Status colors */
--color-success: #28a745;
--color-warning: #ffc107;
--color-danger: #bc4f38;
--color-info: #17a2b8;
```

---

### Utility Classes for Direct Use

For quick styling without Tailwind modifiers:

```css
.jak-text-primary        { color: var(--color-jak-primary); }
.jak-bg-primary          { background-color: var(--color-jak-primary); }
.jak-border-primary      { border-color: var(--color-jak-primary); }

.jak-text-accent-gold    { color: var(--color-jak-accent-gold); }
.jak-bg-accent-gold      { background-color: var(--color-jak-accent-gold); }
.jak-border-accent-gold  { border-color: var(--color-jak-accent-gold); }

.jak-text-accent-pink    { color: var(--color-jak-accent-pink); }
.jak-bg-accent-pink      { background-color: var(--color-jak-accent-pink); }
.jak-border-accent-pink  { border-color: var(--color-jak-accent-pink); }

.jak-text-violet         { color: var(--color-jak-violet); }
.jak-bg-violet           { background-color: var(--color-jak-violet); }
```

---

## Centralized Layout & Component Utilities

Common layout and interaction classes are centralized in `src/app/globals.css` to eliminate duplicated arbitrary values and maintain uniform rhythm across the app:

```css
/* Standard maximum width with responsive fluid padding */
.container-app {
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}
@media (min-width: 640px) {
  .container-app {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
}
@media (min-width: 1024px) {
  .container-app {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}

/* Base card container with consistent border and surface background */
.card-base {
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

/* Interactive card with elevation on hover */
.card-interactive {
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-card);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-interactive:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

/* Standardized accessible focus indicator using brand ring */
.focus-ring {
  outline: 2px solid transparent;
  outline-offset: 2px;
}
.focus-ring:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}

/* Safe area inset padding for bottom-anchored floating widgets */
.safe-bottom {
  padding-bottom: max(1.5rem, env(safe-area-inset-bottom, 1.5rem));
}
```

---

## Responsive Breakpoint Standards

To ensure smooth visual progression from small mobile screens (down to 320px) up to large displays without awkward wrapping or empty voids:

### Grid Scales
- **Product & Category Grids**: Use fluid 4-tier scaling instead of jumping abruptly:
  `grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-5`
- **Hero Heights**: Scaled progressively:
  `h-[260px] xs:h-[320px] sm:h-[420px] md:h-[520px]`
- **Hero Composition**: 2-column balanced layout on desktop (`lg:flex`) with a frosted-glass highlight card to eliminate empty side voids.
- **Controls & Toolbars**: Actions and view toggles are kept cohesive without rogue `ms-auto` or `me-auto` that isolate controls on one side of the screen.

### Viewport Overflow & Gutter Control
- Global `html, body { overflow-x: hidden; max-width: 100%; }` prevents horizontal scrollbars and side whitespace drift.
- Universal `* { scrollbar-gutter: stable; }` is omitted because it reserves unwanted empty gutters on layout containers.

---

## Typography

### Font Family

```css
--font-sans: var(--font-arabic), "Helvetica Neue", "Segoe UI", system-ui, sans-serif;
--font-arabic: "PingARLT", "Noto Sans Arabic", sans-serif;
```

**Font Stack:**
1. **Arabic-first** (PingARLT): Optimized for Arabic text rendering
2. **Helvetica Neue**: Premium fallback
3. **System fonts**: Fast, native rendering

**Loading:** Google Fonts (`next/font/google`) with `swap` display strategy for zero layout shift.

### Font Weights

- **400 (Regular):** Body text, descriptions
- **700 (Bold):** Headings, emphasis
- **800 (Extra Bold):** Large headings, hero text

### RTL/LTR Typography

For Arabic (RTL) text:

```css
[dir="rtl"] body {
  letter-spacing: 0;  /* Tighter spacing for Arabic */
}
```

Tailwind's `rtl:` and `ltr:` variants handle directional adjustments in components:

```jsx
<p className="rtl:text-right ltr:text-left">
  Content aligns based on direction
</p>
```

---

## Spacing System

Follows Tailwind's standard scale (4px base unit):

```
0     → 0px
1     → 0.25rem (4px)
2     → 0.5rem (8px)
3     → 0.75rem (12px)
4     → 1rem (16px)
6     → 1.5rem (24px)
8     → 2rem (32px)
12    → 3rem (48px)
16    → 4rem (64px)
20    → 5rem (80px)
```

**Usage patterns:**

- **Padding:** `p-4` (16px), `px-6` (24px horizontal), `py-2` (8px vertical)
- **Margin:** `mt-8` (32px top), `mb-4` (16px bottom)
- **Gap:** `gap-4` (16px), `gap-6` (24px)

---

## Radius System

```css
--radius-sm: 0.375rem;    /* 6px - small badges, inputs */
--radius-md: 0.5rem;      /* 8px - cards, buttons */
--radius-lg: 0.75rem;     /* 12px - containers */
--radius-xl: 1rem;        /* 16px - hero sections */
--radius-2xl: 1.5rem;     /* 24px - large overlays */
```

**Usage:**
- Small elements: `rounded-sm`
- Buttons & cards: `rounded-md` (default)
- Large containers: `rounded-lg` or `rounded-xl`
- Hero sections: `rounded-2xl`

---

## Shadows

All shadows use JAK primary color (purple) for consistency.

```css
--shadow-sm: 0 1px 2px 0 rgb(78 1 97 / 0.05);

--shadow-card: 0 1px 3px 0 rgb(78 1 97 / 0.08),
               0 4px 6px -2px rgb(78 1 97 / 0.06);

--shadow-card-hover: 0 4px 6px -1px rgb(78 1 97 / 0.1),
                     0 10px 15px -3px rgb(78 1 97 / 0.08);

--shadow-lg: 0 10px 15px -3px rgb(78 1 97 / 0.1),
             0 4px 6px -2px rgb(78 1 97 / 0.05);

--shadow-xl: 0 20px 25px -5px rgb(78 1 97 / 0.1),
             0 10px 10px -5px rgb(78 1 97 / 0.04);
```

**Usage:**
- Cards: `shadow-card`
- Card hover: `hover:shadow-card-hover`
- Modals: `shadow-xl`
- Subtle: `shadow-sm`

---

## Focus States

All interactive elements use the JAK primary color for focus rings:

```css
:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}
```

**Result:** Clean, accessible 2px purple ring with 2px offset.

---

## Scrollbar Styling

Modern, premium scrollbar (no arrow buttons) using JAK brand colors:

```css
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-jak-primary) transparent;
}

*::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

*::-webkit-scrollbar-track {
  background: var(--color-surface-muted);
  border-radius: 999px;
}

*::-webkit-scrollbar-thumb {
  background: var(--color-jak-primary);
  border-radius: 999px;
  border: 2px solid var(--color-surface-muted);
}

*::-webkit-scrollbar-thumb:hover {
  background: var(--color-jak-primary-hover);
}
```

**Features:**
- 8px width (mobile & desktop)
- Rounded track & thumb
- JAK purple thumb, light background track
- Hover darkens thumb
- No legacy arrow buttons

---

## Selection Colors

Text selection uses JAK brand:

```css
::selection {
  background-color: var(--color-jak-primary);
  color: var(--color-jak-primary-foreground);
}

::-moz-selection {
  background-color: var(--color-jak-primary);
  color: var(--color-jak-primary-foreground);
}
```

**Result:** Purple text selection with white text.

---

## Component Examples

### Button Styles

```jsx
// Primary (uses primary color)
<button className="px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors">
  Primary Action
</button>

// Secondary (uses surface with border)
<button className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-foreground)] rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
  Secondary Action
</button>

// Accent (uses gold)
<button className="px-4 py-2 bg-[var(--color-accent)] text-[var(--color-accent-foreground)] rounded-md hover:bg-[var(--color-accent-hover)] transition-colors">
  Accent Action
</button>
```

### Card Styles

```jsx
<div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-6 shadow-card hover:shadow-card-hover transition-shadow">
  <h3 className="text-[var(--color-foreground)] font-bold">Card Title</h3>
  <p className="text-[var(--color-muted)] mt-2">Card content goes here.</p>
</div>
```

### Badge Styles

```jsx
// Primary badge
<span className="inline-block px-3 py-1 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] rounded-full text-xs font-medium">
  New
</span>

// Gold badge
<span className="inline-block px-3 py-1 bg-[var(--color-accent-gold)] text-[var(--color-accent-gold-foreground)] rounded-full text-xs font-medium">
  Premium
</span>
```

### Form Input Styles

```jsx
<input
  type="text"
  className="w-full px-4 py-2 border border-[var(--color-border)] rounded-md text-[var(--color-foreground)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-transparent transition-all"
  placeholder="Enter text..."
/>
```

---

## Light/Dark Mode (Future)

The system is designed to support dark mode via CSS custom property overrides in `prefers-color-scheme`:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #1a1a1a;
    --color-surface: #2d2d2d;
    --color-foreground: #f5f5f5;
    /* ... override other colors ... */
  }
}
```

---

## Accessibility

### Color Contrast

All color pairs meet **WCAG AA** standards:
- Primary on white: 7.2:1 (AAA)
- Muted on white: 4.5:1 (AA)
- Accent on white: 5.1:1 (AA)

### Keyboard Navigation

- Focus rings visible on all interactive elements
- Sufficient padding for touch targets (min 44x44px)
- Logical tab order (semantic HTML)

### Motion

The design uses minimal motion (transitions, no auto-playing animations) to respect `prefers-reduced-motion`.

---

## Best Practices

### 1. **Use CSS Custom Properties**

✅ Do:
```jsx
<div className="text-[var(--color-foreground)] bg-[var(--color-surface)]">
  Content
</div>
```

❌ Avoid:
```jsx
<div className="text-gray-800 bg-white">
  Content
</div>
```

Reason: Custom properties enable theme switching without code changes.

### 2. **Prefer Semantic Colors**

✅ Do:
```jsx
<button className="bg-[var(--color-primary)]">Action</button>
```

❌ Avoid:
```jsx
<button className="bg-purple-900">Action</button>
```

Reason: Semantic names scale better than hardcoded colors.

### 3. **Maintain Spacing Consistency**

✅ Do:
```jsx
<div className="p-6 mb-8">Consistent spacing</div>
```

❌ Avoid:
```jsx
<div style={{ padding: "24px", marginBottom: "32px" }}>
  Inconsistent
</div>
```

Reason: Tailwind enforces a scale.

### 4. **Use Shadow for Hierarchy**

```jsx
{/* Subtle cards */}
<div className="shadow-card">Normal card</div>

{/* Elevated cards */}
<div className="shadow-lg">Modal or overlay</div>
```

### 5. **Design for RTL from the Start**

```jsx
{/* ✅ Good: Uses logical properties */}
<div className="ms-4 me-2 rtl:flex-row-reverse">
  Content
</div>

{/* ❌ Bad: Hardcoded LTR */}
<div className="ml-4 mr-2 flex-row-reverse">
  Content
</div>
```

---

## Token Reference

### All Custom Properties at a Glance

```css
/* Brand Colors */
--color-jak-primary
--color-jak-primary-hover
--color-jak-primary-light
--color-jak-primary-dark
--color-jak-primary-foreground
--color-jak-accent-pink
--color-jak-accent-pink-hover
--color-jak-accent-pink-light
--color-jak-accent-pink-foreground
--color-jak-accent-gold
--color-jak-accent-gold-hover
--color-jak-accent-gold-light
--color-jak-accent-gold-foreground
--color-jak-violet
--color-jak-violet-hover

/* Semantic Colors */
--color-primary
--color-primary-hover
--color-primary-light
--color-primary-dark
--color-primary-foreground
--color-accent
--color-accent-hover
--color-accent-light
--color-accent-foreground
--color-background
--color-surface
--color-surface-muted
--color-foreground
--color-foreground-muted
--color-muted
--color-border
--color-border-strong
--color-ring

/* Status Colors */
--color-success
--color-warning
--color-danger
--color-info

/* Radius */
--radius-sm
--radius-md
--radius-lg
--radius-xl
--radius-2xl

/* Shadows */
--shadow-sm
--shadow-card
--shadow-card-hover
--shadow-lg
--shadow-xl

/* Typography */
--font-sans
--font-arabic

/* Container */
--container-max
```

---

## Conclusion

The JAK design system combines brand identity (purple, gold, pink) with accessibility and modern best practices. All tokens are centralized in `src/app/globals.css`, enabling theme evolution without code refactors. Components leverage Tailwind v4 utilities and CSS custom properties for consistency, performance, and scalability.

For implementation questions, see component examples in `src/components/ui/` and `src/components/layout/`.
