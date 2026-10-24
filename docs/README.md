# JAK Storefront Documentation

Welcome to the JAK Storefront project documentation. This folder contains comprehensive guides for understanding, developing, and maintaining the codebase.

---

## 📚 Documentation Files

### [ARCHITECTURE.md](./ARCHITECTURE.md)
**Complete system design and project structure**

- Directory structure breakdown
- Technology stack overview
- Repository pattern explanation
- Data flow diagrams
- Key architectural decisions
- Build pipeline description
- Performance optimizations
- Scalability roadmap

*Start here to understand how the project is organized and designed.*

---

### [STYLES.md](./STYLES.md)
**Design system, color palette, and styling guide**

- Complete color system (brand colors + semantic colors)
- Typography system (fonts, weights, RTL handling)
- Spacing system (margin, padding, gap scale)
- Border radius tokens
- Shadow system
- Focus states and accessibility
- Scrollbar styling
- Component styling examples
- Best practices for styling

*Reference this when building UI components or styling features.*

---

### [COMPONENTS.md](./COMPONENTS.md)
**Component development patterns and best practices**

- Component directory structure
- Primitive components (UI layer) with CVA patterns
- Layout components
- Product/Category components
- Form components with validation
- Component best practices
- Common patterns (loading skeletons, empty states, error boundaries)
- Localization in components
- Accessibility guidelines

*Use this guide when creating or modifying components.*

---

### [DEVELOPMENT.md](./DEVELOPMENT.md)
**Development workflow and environment setup**

- Quick start guide
- All available commands
- File organization patterns
- Adding new pages, components, and routes
- Localization (i18n) guide
- Styling with design tokens
- Data validation with Zod
- Forms with React Hook Form
- Testing with Vitest and Playwright
- Cart state management
- Environment variables
- Git workflow and branching strategy
- Deployment instructions
- Troubleshooting guide
- Quick reference table

*Refer to this when setting up development, creating features, or deploying.*

---

### [branching-strategy.md](./branching-strategy.md)
**Git branching and collaboration workflow**

Contains the team's branching strategy, commit conventions, and PR process.

---

### [source-audit.md](./source-audit.md)
**Original jak.sa.com site audit**

Documents the source website structure, features, and data models used as reference for this reconstruction.

---

### [data-migration-report.md](./data-migration-report.md)
**Data crawling and migration process**

Details how product data is extracted, validated, and stored locally.

---

## 🚀 Getting Started

1. **New to the project?** Start with [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Setting up development?** Follow [DEVELOPMENT.md](./DEVELOPMENT.md) → Quick Start section
3. **Building a component?** Read [COMPONENTS.md](./COMPONENTS.md)
4. **Styling elements?** Reference [STYLES.md](./STYLES.md)
5. **Contributing code?** Check [DEVELOPMENT.md](./DEVELOPMENT.md) → Git Workflow section

---

## 🏗️ Quick Reference

### Project Structure
```
src/
├── app/[lang]/          # Next.js App Router (localized routes)
├── components/          # React components (UI, layout, features)
├── features/            # Domain features (e.g., cart)
├── lib/                 # Business logic (data, i18n, utils)
├── config/              # Configuration
├── types/               # TypeScript domain models
└── proxy.ts             # Locale negotiation
```

### Technology Stack
- **Framework:** Next.js 16 + App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + CVA
- **Forms:** React Hook Form + Zod
- **State:** React Context (cart)
- **Testing:** Vitest + Playwright
- **Package Manager:** pnpm

### Key Commands
```bash
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm lint          # Run linter
pnpm typecheck     # Type check
pnpm test          # Run unit tests
pnpm test:e2e      # Run E2E tests
pnpm validate:data # Validate dataset
pnpm crawl         # Refresh data from source
```

---

## 📋 Common Tasks

| Task | Documentation |
|------|-----------------|
| Add a new page | [DEVELOPMENT.md → Adding a New Page](./DEVELOPMENT.md#adding-a-new-page) |
| Create a component | [COMPONENTS.md → Component Best Practices](./COMPONENTS.md#component-best-practices) |
| Update styling | [STYLES.md → Best Practices](./STYLES.md#best-practices) |
| Add translations | [DEVELOPMENT.md → Localization](./DEVELOPMENT.md#localization-i18n) |
| Setup development | [DEVELOPMENT.md → Quick Start](./DEVELOPMENT.md#quick-start) |
| Deploy to production | [DEVELOPMENT.md → Deployment](./DEVELOPMENT.md#deployment) |
| Create a PR | [DEVELOPMENT.md → Git Workflow](./DEVELOPMENT.md#git-workflow) |
| Fix bugs | [DEVELOPMENT.md → Troubleshooting](./DEVELOPMENT.md#troubleshooting) |

---

## 🎨 Design System

The project uses a **JAK Brand Color System** with semantic tokens:

- **Primary:** JAK Purple (#4e0161) — used for primary actions
- **Accent:** Gold/Amber (#b88539) — special highlights
- **Secondary:** Pink/Magenta (#e83e8c) — controlled accent
- **Neutral:** White background with gray text

All colors are defined as CSS custom properties in `src/app/globals.css` for easy theming.

See [STYLES.md](./STYLES.md) for complete token reference.

---

## 🧪 Testing

- **Unit Tests:** `pnpm test` (Vitest)
- **E2E Tests:** `pnpm test:e2e` (Playwright)

See [DEVELOPMENT.md → Testing](./DEVELOPMENT.md#testing) for examples.

---

## 🌍 Localization

Project supports **Arabic (RTL) and English (LTR)** out of the box.

- Translations in `src/lib/i18n/dictionaries.*.json`
- Use `t(dict, "key.path")` helper in components
- See [DEVELOPMENT.md → Localization](./DEVELOPMENT.md#localization-i18n)

---

## 📊 Data Flow

```
Source (jak.sa.com)
    ↓ [pnpm crawl]
src/data/*.json (validated with Zod)
    ↓ [Repository Pattern]
React Components (type-safe)
    ↓
Static HTML (SSG at build time)
```

Learn more in [ARCHITECTURE.md → Data Flow](./ARCHITECTURE.md#data-flow).

---

## 🛠️ Troubleshooting

Common issues and solutions are documented in [DEVELOPMENT.md → Troubleshooting](./DEVELOPMENT.md#troubleshooting).

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test: `pnpm test && pnpm typecheck`
3. Commit with conventional format: `git commit -m "feat: add feature"`
4. Push and create a PR: `git push -u origin feature/my-feature`

See [DEVELOPMENT.md → Git Workflow](./DEVELOPMENT.md#git-workflow) for details.

---

## 📖 Additional Resources

- **Next.js Docs:** https://nextjs.org/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React Hook Form:** https://react-hook-form.com/
- **Zod Validation:** https://zod.dev/
- **Playwright Testing:** https://playwright.dev/

---

## ❓ Questions?

1. Check the relevant documentation file (links above)
2. Search existing GitHub issues
3. Review code examples in the `src/` folder
4. Ask in team chat/Discord

---

**Last Updated:** October 2026  
**Project:** JAK Storefront — Next.js Reconstruction  
**Repository:** https://github.com/food-drink-solution/jak-SA-Coffee-F
