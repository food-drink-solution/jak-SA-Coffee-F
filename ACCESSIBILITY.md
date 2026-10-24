# ♿ Accessibility Statement — JAK Storefront

At **JAK**, we believe digital experiences should be accessible, intuitive, and welcoming to all users, regardless of ability or technology.

## Commitments & Standards

The JAK storefront targets **WCAG 2.1 Level AA** compliance across both Arabic (RTL) and English (LTR) interfaces:

1. **Bidirectional Typography & Readability**:
   - High contrast ratios (exceeding 7:1 for primary headings and 4.5:1 for body copy).
   - Legible Arabic fonts (`PingARLT`, `Almarai`) with natural letter-spacing adjustments in RTL.

2. **Keyboard Navigation & Focus Management**:
   - Visible, high-contrast 2px focus rings (`focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]`) on all interactive buttons, links, inputs, and dropdowns.
   - Logical tab ordering following DOM structure in both RTL and LTR modes.
   - Escape key dismisses modals and drawers (e.g., Cart Drawer, Floating Quick-Contact Widget).

3. **Touch Targets & Mobile Usability**:
   - Minimum 44x44px touch targets on all buttons, selectors, and navigation controls.
   - Safe-area inset padding (`env(safe-area-inset-bottom)`) for fixed action bars on iOS/Android devices.

4. **Screen Reader Optimization**:
   - Semantic HTML5 landmarks (`<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`).
   - Descriptive `aria-label`, `aria-expanded`, and `aria-hidden` attributes on icons, drawers, and buttons.
   - Meaningful alt text on all product images and promotional media.

## Reporting Accessibility Issues

If you encounter an accessibility barrier or have suggestions for improvement:
- **Email:** [support@jak.sa.com](mailto:support@jak.sa.com)
- **GitHub Issues:** Open an issue with the `accessibility` label.
- Please mention the page URL, assistive technology (if applicable), and description of the barrier.
