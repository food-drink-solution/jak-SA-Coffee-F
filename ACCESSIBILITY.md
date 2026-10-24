# ♿ Accessibility Statement — JAK Storefront

At **JAK**, we believe digital experiences should be accessible, intuitive, and welcoming to all users, regardless of ability or technology.

## Commitments & Standards

The JAK storefront targets **WCAG 2.1 Level AA** compliance across both Arabic (RTL) and English (LTR) interfaces:

1. **Bidirectional Typography & Readability**:
   - High contrast ratios: primary text on white **13.99:1**, body copy **11.51:1**, and muted copy **4.83:1** on white (**4.59:1** on muted surfaces) in the light theme. Dark theme pairs range from **6.65:1** (primary button label) to **16.82:1** (body copy).
   - Legible Arabic fonts (`PingARLT`, `Almarai`) with natural letter-spacing adjustments in RTL.

2. **Keyboard Navigation & Focus Management**:
   - Visible, high-contrast 2px focus rings via `.focus-ring` on neutral surfaces and `.focus-ring-inverse` (white) on the purple header, hero and drawer header.
   - Logical tab ordering following DOM structure in both RTL and LTR modes.
   - Escape key dismisses modals and drawers (e.g., Cart Drawer, Floating Quick-Contact Widget).
   - The closed mobile drawer is `inert`, so its links and theme control are not reachable by keyboard.

3. **Touch Targets & Mobile Usability**:
   - Minimum 44x44px touch targets on all buttons, selectors, and navigation controls.
   - Safe-area inset padding (`env(safe-area-inset-bottom)`) for fixed action bars on iOS/Android devices.

4. **Screen Reader Optimization**:
   - Semantic HTML5 landmarks (`<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`).
   - Descriptive `aria-label`, `aria-expanded`, and `aria-hidden` attributes on icons, drawers, and buttons.
   - Meaningful alt text on all product images and promotional media.

5. **Theme & Color Preferences**:
   - Light and dark themes are both supported and measured against WCAG AA.
   - The site follows `prefers-color-scheme` by default; the header (desktop) and mobile drawer expose a labelled theme toggle.
   - The chosen theme persists in `localStorage` and is applied before first paint, avoiding a flash of the wrong theme.
   - Focus, hover and control-border states have theme-specific tokens rather than relying on a single hardcoded color.

## Reporting Accessibility Issues

If you encounter an accessibility barrier or have suggestions for improvement:
- **Email:** [support@jak.sa.com](mailto:support@jak.sa.com)
- **GitHub Issues:** Open an issue with the `accessibility` label.
- Please mention the page URL, assistive technology (if applicable), and description of the barrier.
