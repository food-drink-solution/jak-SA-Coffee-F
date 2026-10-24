# JAK Storefront — Design System & Styles Guide

## Overview

JAK Storefront uses **Tailwind CSS v4** with a centralized design token system defined in `src/app/globals.css`. All colors, typography, spacing, and effects follow a cohesive brand language rooted in the JAK brand identity (Saudi coffee retailer).

The colour system supports **light and dark themes**. Brand surfaces stay JAK purple in both; neutral surfaces, text and action colours adapt through semantic tokens (see [Light & Dark Themes](#light--dark-themes)).

---

## Color System

### Brand Colors

All colors are defined as CSS custom properties in `src/app/globals.css` and mapped through semantic names.

#### JAK Primary Purple

The dominant brand color. Brand surfaces (header, mobile drawer) always use `--color-jak-primary`; adaptive buttons, links and focus rings use the semantic `--color-primary*` tokens, which switch to a light lavender in dark mode.

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
/* Primary (uses JAK purple in light; lavender action colour in dark) */
--color-primary: #4e0161;              /* fills, buttons, active states */
--color-primary-hover: #5a0272;
--color-primary-light: #6b2a85;
--color-primary-dark: #3a0148;
--color-primary-foreground: #ffffff;   /* text on a primary fill */
--color-primary-text: #4e0161;         /* text/icons on neutral surfaces */
--color-primary-soft: rgba(78, 1, 97, 0.08); /* tinted chips and row hovers */

/* Accent (uses gold by default; cart badge) */
--color-accent: #b88539;
--color-accent-hover: #a07231;
--color-accent-light: #d4a55a;
--color-accent-foreground: #1f2937;

/* Neutral background & text */
--color-background: #ffffff;
--color-surface: #ffffff;
--color-surface-muted: #f8f9fa;
--color-foreground: #343a40;
--color-foreground-muted: #5f6368;
--color-muted-foreground: #5f6368;
--color-muted: #6b7280;

/* Borders and interaction tints */
--color-border: #eeeeee;            /* dividers and card outlines */
--color-border-strong: #d4d4da;
--color-border-control: #8a8f98;    /* inputs and controls (3:1 on surfaces) */
--color-ghost-hover: rgba(78, 1, 97, 0.06);

/* Focus & rings */
--color-ring: #4e0161;
--color-header-ring: #ffffff;       /* focus ring on purple brand surfaces */

/* Brand surface colours (identical in both themes) */
--color-header-foreground: #ffffff;
--color-header-foreground-muted: rgba(255, 255, 255, 0.90);
--color-header-foreground-subtle: rgba(255, 255, 255, 0.75);
--color-header-foreground-faint: rgba(255, 255, 255, 0.60);

/* Scrollbar */
--color-scrollbar: #4e0161;
--color-scrollbar-hover: #5a0272;

/* Status colors (AA text on light surfaces) */
--color-success: #1e7e34;
--color-warning: #b45309;
--color-danger: #bc4f38;
--color-info: #0f6f7f;
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

/* White focus ring for purple brand surfaces (header, hero, drawer header) */
.focus-ring-inverse:focus-visible {
  outline: 2px solid var(--color-header-ring);
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

Interactive elements use `--color-ring` (purple in light, lavender in dark) for focus rings:

```css
:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}
```

On deep purple brand surfaces, use `.focus-ring-inverse` so the ring is white (`--color-header-ring`) and remains visible. Components on neutral surfaces use `.focus-ring`.

**Result:** A 2px ring with 2px offset that stays visible in both themes and on brand surfaces.

---

## Scrollbar Styling

Modern, premium scrollbar (no arrow buttons) using JAK brand colors:

```css
* {
  scrollbar-width: thin;
  scrollbar-color: var(--color-scrollbar) transparent;
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
  background: var(--color-scrollbar);
  border-radius: 999px;
  border: 2px solid var(--color-surface-muted);
}

*::-webkit-scrollbar-thumb:hover {
  background: var(--color-scrollbar-hover);
}
```

**Features:**
- 8px width (mobile & desktop)
- Rounded track & thumb
- JAK purple thumb in light, lavender thumb in dark
- Track follows `--color-surface-muted` in both themes
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

// Secondary (uses surface with a control-strength border)
<button className="px-4 py-2 bg-[var(--color-surface)] border border-[var(--color-border-control)] text-[var(--color-foreground)] rounded-md hover:bg-[var(--color-surface-muted)] transition-colors">
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
// Primary badge (soft tint reads well in both themes)
<span className="inline-block px-3 py-1 bg-[var(--color-primary-soft)] text-[var(--color-primary-text)] rounded-full text-xs font-bold">
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
  className="w-full px-4 py-2 border border-[var(--color-border-control)] rounded-md text-[var(--color-foreground)] placeholder-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] focus:border-[var(--color-ring)] transition-all"
  placeholder="Enter text..."
/>
```

---

## Light & Dark Themes

The theme is selected in this order:

1. A stored choice in `localStorage` under the key `theme` (`"light"` or `"dark"`).
2. The operating-system preference (`prefers-color-scheme`).
3. Light, as the server-rendered default.

`src/lib/theme.ts` owns the storage key, the inline pre-paint script and the
`applyThemeToDocument` helper. The root layout renders the script in `<head>`
so the correct theme is applied before first paint — no light flash on reload.
The script sets both `data-theme` and the legacy `.dark` class on `<html>`;
`ThemeToggle` keeps them in sync.

```html
<!-- Rendered before any content by src/app/[lang]/layout.tsx -->
<html data-theme="light" suppressHydrationWarning>…</html>
<!-- The inline script replaces "light" with the stored/system theme -->
```

### Token overrides

Dark values are declared twice in `globals.css` — once inside
`@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }`
and once in `[data-theme="dark"] { … }` — so both the system fallback and an
explicit choice work, and an explicit light choice wins over a dark system.

| Token | Light | Dark |
| --- | --- | --- |
| `--color-background` | `#ffffff` | `#0f0f0f` |
| `--color-surface` | `#ffffff` | `#1a1a1a` |
| `--color-surface-muted` | `#f8f9fa` | `#2a2a2a` |
| `--color-foreground` | `#343a40` | `#f0f0f0` |
| `--color-foreground-muted` / `--color-muted-foreground` | `#5f6368` | `#c3c3c9` |
| `--color-muted` | `#6b7280` | `#a7a7b0` |
| `--color-border` / `--color-border-strong` | `#eeeeee` / `#d4d4da` | `#333333` / `#4a4a52` |
| `--color-border-control` | `#8a8f98` | `#7a808c` |
| `--color-primary` | `#4e0161` | `#b98ac7` |
| `--color-primary-foreground` | `#ffffff` | `#1a0f1e` |
| `--color-primary-text` | `#4e0161` | `#d9b8e6` |
| `--color-primary-soft` | `rgba(78,1,97,.08)` | `rgba(217,184,230,.14)` |
| `--color-ring` | `#4e0161` | `#d9b8e6` |
| `--color-success` / `--color-warning` | `#1e7e34` / `#b45309` | `#4ade80` / `#fbbf24` |
| `--color-danger` / `--color-info` | `#bc4f38` / `#0f6f7f` | `#f08a72` / `#67e8f9` |
| `--shadow-*` | Purple-tinted | Black |

Brand tokens (`--color-jak-primary`, `--color-jak-accent-*`, header foregrounds)
do **not** change. The header, mobile drawer header, hero overlays and the footer
logo keep the same brand appearance in both themes.

### Choosing the right primary token

- `--color-primary` — filled actions: buttons, active pagination, chat bubble,
  social-icon hover. In dark mode this is lavender with dark foreground text.
- `--color-primary-text` — text and icons on **neutral** surfaces (product
  category labels, links, chips, icon buttons). In dark mode this is a light
  lavender that passes contrast on `--color-surface`.
- `--color-primary-soft` — tinted chip/row backgrounds paired with
  `--color-primary-text`.
- `--color-jak-primary` — brand surfaces that must stay deep purple in both
  themes (header/drawer backgrounds, hero image overlays, white CTA label).

Never use `--color-primary` as text on a neutral surface in dark mode, and never
use `--color-primary-text` as a fill for filled buttons.

---

## Accessibility

### Color Contrast

Measured against the tokens in this document (WCAG 2.1 relative luminance):

Light theme:
- Primary text on white: **13.99:1** (AAA)
- Body foreground on white: **11.51:1** (AAA)
- Muted foreground on white: **6.05:1** (AA)
- Muted text on white: **4.83:1**; on `--color-surface-muted`: **4.59:1** (AA)
- Control borders (`--color-border-control`) on white: **3.25:1**; on surface-muted: **3.08:1** (AA non-text)
- Status text on white: success **5.14:1**, warning **5.02:1**, danger **4.87:1**, info **5.83:1** (AA)
- Accent-foreground on gold: **4.51:1** (AA)

Dark theme:
- Foreground on background: **16.82:1**; on surface: **~14.8:1**
- Primary text on surface: **9.90:1**; muted on surface: **7.29:1**
- Primary button foreground on fill: **6.65:1** (hover **8.60:1**)
- Control borders on surface: **4.39:1**; on surface-muted: **3.62:1**
- Status text on surface: **7.1–12.0:1**
- White focus ring on brand purple: **13.99:1**

The theme toggle and other icon buttons use a 44×44px target. Re-run contrast
checks if tokens change; the ratios above are tied to the current values.

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
--color-primary-text
--color-primary-soft
--color-accent
--color-accent-hover
--color-accent-light
--color-accent-foreground
--color-header-foreground
--color-header-foreground-muted
--color-header-foreground-subtle
--color-header-foreground-faint
--color-header-ring
--color-background
--color-surface
--color-surface-muted
--color-foreground
--color-foreground-muted
--color-muted-foreground
--color-muted
--color-border
--color-border-strong
--color-border-control
--color-ring
--color-ghost-hover
--color-scrollbar
--color-scrollbar-hover

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

The JAK design system combines brand identity (purple, gold, pink) with accessibility and modern best practices. All tokens are centralized in `src/app/globals.css`, enabling light/dark theme switching without component rewrites. Components use Tailwind v4 utilities and CSS custom properties for consistency, performance, and scalability. Brand surfaces remain deep purple; semantic tokens carry the theme adaptation.

For implementation questions, see component examples in `src/components/ui/` and `src/components/layout/`.
