# 📋 Changelog

<div align="center">

  <img src="https://raw.githubusercontent.com/food-drink-solution/jak-SA-Coffee-F/main/jak-sa/public/images/brand/logo.png" alt="JAK Logo" width="120" height="auto" />

  ### Release Notes & Version History for JAK Platform

  <p align="center">
    <a href="https://github.com/food-drink-solution/jak-SA-Coffee-F/releases"><img src="https://img.shields.io/github/v/release/food-drink-solution/jak-SA-Coffee-F?style=flat-square&color=4e0161" alt="Latest Release" /></a>
    <a href="https://semver.org/"><img src="https://img.shields.io/badge/SemVer-2.0.0-b88539?style=flat-square" alt="SemVer 2.0.0" /></a>
    <a href="https://keepachangelog.com/"><img src="https://img.shields.io/badge/Changelog-Keep%20a%20Changelog-28a745?style=flat-square" alt="Keep a Changelog" /></a>
  </p>

</div>

---

All notable changes to the **JAK** coffee & food supply storefront platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## 🏷️ Release & Tagging Workflow

Releases are automatically triggered and packaged via GitHub Actions:
- **Tags**: Pushing a tag formatted as `vMAJOR.MINOR.PATCH` (e.g. `v1.0.0`) triggers the automated release pipeline.
- **Workflow**: Runs Vitest suites (44 tests), strict TypeScript compilation, data schema validation, builds the production Next.js application, creates a release tarball, and publishes GitHub Release notes.
- **Manual Trigger**: Can also be dispatched manually via the GitHub Actions UI (*Actions ➔ Automated Release ➔ Run workflow*).

```bash
# How to cut a new release tag locally:
git checkout main
git pull origin main
git tag -a v1.0.0 -m "Release v1.0.0: Monorepo architecture & responsive storefront"
git push origin v1.0.0
```

---

## [1.0.0] - 2026-10-24

### 🚀 Added
- **Monorepo Architecture**: Clean separation between frontend storefront (`jak-sa/`), future backend API (`server-api/`), tooling (`scripts/`), and documentation (`docs/`).
- **Automated CI/CD Workflows**:
  - Continuous Integration (`.github/workflows/ci.yml`): Runs tests, typecheck, lint, and build on all PRs and pushes to `main`.
  - Automated Release (`.github/workflows/release.yml`): Automatically packages production assets and publishes GitHub Releases upon tag creation.
  - Release Drafter (`.github/workflows/release-drafter.yml` & `.github/release-drafter.yml`): Automatically groups incoming commits into structured release notes.
  - GitHub Native Release Categories (`.github/release.yml`): Native changelog section grouping by commit/PR type.
- **Data Validation Suite**: `scripts/validate-data.mjs` running 9 automated integrity checks across categories, products, and bilingual schemas.
- **Comprehensive Documentation Suite**:
  - `docs/ARCHITECTURE.md`: Monorepo design, data flow, and domain isolation.
  - `docs/STYLES.md`: Design tokens, typography scales, and CSS variable guide.
  - `docs/COMPONENTS.md`: CVA component patterns, variants, and composition examples.
  - `docs/DEVELOPMENT.md`: Environment setup, quality gates, and git conventions.

### 🎨 Changed
- **Root Directory Cleanup**: Completely removed root-level `node_modules` pollution; dependencies are strictly isolated inside `jak-sa/node_modules`.
- **Root Markdown Modernization**: Redesigned `README.md`, `ACCESSIBILITY.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, and `SECURITY.md` with modern badges, tables, and brand assets.
- **Workspace Runner**: Configured root `package.json` with workspace runner commands (`pnpm dev`, `pnpm build`, `pnpm test`, `pnpm typecheck`).

### 🐛 Fixed
- **Fluid 4-Tier Responsiveness**: Fixed horizontal overflow, rogue negative margins, and empty void spaces on mobile viewports (320px–480px) and wide desktop screens.
- **Hero & Toolbar Layout**: Eliminated empty white spaces on the right side of the hero section and balanced toolbar view toggle spacing on the left side.
- **Bilingual RTL Support**: Resolved alignment and directional bugs in RTL mode (`/ar`), ensuring correct padding, icon positioning, and font rendering.

---

## [0.2.0] - 2026-10-24

### 🚀 Added
- **Official Brand Identity**: Implemented authentic JAK deep royal purple (`#4e0161`) brand theme, official SVG vector logo, and authentic favicon.
- **Interactive Cart Experience**: Slide-out drawer with optimistic quantity controls, empty-state messaging, and local storage synchronization.
- **Catalog Navigation**: Sorting dropdown, category filter pills, list/grid view toggle, and pagination controls.
- **Floating Quick Contact**: WhatsApp direct chat widget and smooth scroll-to-top button.

### 🎨 Changed
- **Header Redesign**: Deep purple header with mobile search trigger, language switcher, cart badge counter, and responsive navigation drawer.
- **Footer Modernization**: Social media channels, Saudi commercial registry details, WE3DS accreditation, and payment method badges.
- **Typography**: Upgraded Arabic fonts to `PingARLT` and `Almarai` with automatic font swapping based on locale route.

---

## [0.1.0] - 2026-10-01

### 🚀 Added
- **Initial Reconstruction**: Rebuilt [jak.sa.com](https://jak.sa.com) from legacy platform into modern Next.js 16 (App Router) + React 19 architecture.
- **Catalog Dataset**: Scraped and structured 400+ verified Saudi coffee and bakery products across 10 major wholesale categories.
- **Bilingual i18n**: Subpath routing for Arabic (`/ar`) and English (`/en`) with localized dictionary strings.
- **Testing Foundation**: Configured Vitest test runner with JSDOM and initial unit test suites.

---

[1.0.0]: https://github.com/food-drink-solution/jak-SA-Coffee-F/releases/tag/v1.0.0
[0.2.0]: https://github.com/food-drink-solution/jak-SA-Coffee-F/commits/v0.2.0
[0.1.0]: https://github.com/food-drink-solution/jak-SA-Coffee-F/commits/v0.1.0
