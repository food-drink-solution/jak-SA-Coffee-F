# 🤝 Contributing to JAK Platform

<div align="center">

  <img src="https://raw.githubusercontent.com/food-drink-solution/jak-SA-Coffee-F/main/jak-sa/public/images/brand/logo.png" alt="JAK Logo" width="120" height="auto" />

  ### Building the premier B2B Food & Coffee Supply Platform for Saudi Arabia

  <p align="center">
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
    <img src="https://img.shields.io/badge/Code_Style-TypeScript_Strict-blue?style=flat-square" alt="Code Style" />
    <img src="https://img.shields.io/badge/Accessibility-WCAG_AA-4e0161?style=flat-square" alt="WCAG AA" />
    <img src="https://img.shields.io/badge/Tests-Vitest-28a745?style=flat-square" alt="Vitest Tests" />
  </p>

</div>

---

Thank you for your interest in contributing to **JAK**! Whether you are implementing new features, optimizing performance, refining accessibility, or documenting components, your contributions are highly valued.

---

## 🏛️ Monorepo Architecture Overview

This project is organized as a modular monorepo:

| Directory | Purpose | Primary Tech Stack |
|-----------|---------|-------------------|
| `jak-sa/` | Frontend Storefront | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4 |
| `server-api/` | Backend REST API | ASP.NET Core 8/9, C# |
| `docs/` | System Documentation | Architecture, Styles, Components, and Workflow guides |
| `scripts/` | Data & Tooling | Catalog crawler, dataset schema validator |

---

## 🚀 Development Setup

### 1. Prerequisites
- **Node.js**: `v18.17+` or `v20+`
- **pnpm**: `v9+` or `v12+` (recommended package manager)
- **Git**: Latest version

### 2. Fork & Clone
```bash
# Clone the repository
git clone https://github.com/food-drink-solution/jak-SA-Coffee-F.git
cd jak-SA-Coffee-F

# Navigate to the storefront
cd jak-sa

# Install dependencies (isolated in jak-sa/)
pnpm install

# Start development server
pnpm dev
```

The app will be accessible at [http://localhost:3000](http://localhost:3000).

---

## 🌿 Git Branching Strategy

We follow a structured branching workflow. Branch names should reflect the work being completed:

| Branch Prefix | Example | Description |
|:-------------:|---------|-------------|
| `feature/` | `feature/quick-quote-modal` | New user-facing or technical capabilities |
| `fix/` | `fix/cart-drawer-mobile-scroll` | Bug fixes and defect corrections |
| `refactor/` | `refactor/catalog-repository` | Restructuring without changing external behavior |
| `docs/` | `docs/update-component-api` | Documentation improvements |
| `perf/` | `perf/optimize-hero-images` | Performance and Core Web Vitals improvements |

### Branch Flow
1. Branch off `main`: `git checkout -b feature/your-feature-name`
2. Keep commits atomic and informative.
3. Keep your branch synced with upstream: `git fetch origin && git rebase origin/main`

---

## ✍️ Commit Conventions

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

[optional body]
```

### Examples:
- `feat(catalog): add subcategory filter pills`
- `fix(cart): resolve quantity decrement on iOS touch screens`
- `docs(readme): add responsive layout architecture diagrams`
- `refactor(styles): centralize typography tokens in globals.css`

---

## 🧪 Quality Gates & Checklist

Before opening a pull request, verify all automated checks pass locally inside `jak-sa/`:

```bash
# Run unit test suites (Vitest)
pnpm test

# Run strict TypeScript compiler verification
pnpm typecheck

# Run ESLint linting
pnpm lint

# Validate bilingual data schema
pnpm validate:data
```

### Pull Request Checklist
- [ ] Code strictly follows TypeScript types without `any`.
- [ ] Tested on both Arabic (RTL) and English (LTR) locales.
- [ ] Meets WCAG 2.1 AA accessibility guidelines (keyboard navigable, semantic HTML, high contrast).
- [ ] No layout shifts, horizontal overflow, or rogue empty spaces on mobile or desktop viewports.
- [ ] All tests pass without warnings or failures.

---

## 📬 Submitting a Pull Request

1. **Push** your branch to GitHub.
2. **Open a PR** against the `main` branch.
3. Fill out the PR template with:
   - Summary of changes
   - Linked issues or tickets
   - Screenshots or recordings for visual changes
4. Request review from maintainers. Once approved and checks pass, your changes will be merged!

---

*Thank you for helping build a world-class supply platform for Saudi Arabia! ☕*
