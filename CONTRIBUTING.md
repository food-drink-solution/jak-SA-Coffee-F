# Contributing to JAK Storefront

Thank you for your interest in contributing to the **JAK** coffee & food storefront!

## Repository Structure

- `jak-sa/` — Next.js 16 + React 19 Frontend Storefront
- `server-api/` — ASP.NET Core Backend REST API
- `docs/` — Technical and architectural documentation
- `scripts/` — Crawling and data validation utilities

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/food-drink-solution/jak-SA-Coffee-F.git
   cd jak-SA-Coffee-F
   ```

2. **Frontend development:**
   ```bash
   cd jak-sa
   pnpm install
   pnpm dev
   ```

3. **Branching Strategy:**
   - Create a feature branch from `main`: `git checkout -b feature/my-feature`
   - For bug fixes: `git checkout -b fix/issue-description`

4. **Quality Gates:**
   Before opening a PR, ensure all tests and type checks pass:
   ```bash
   cd jak-sa
   pnpm lint
   pnpm typecheck
   pnpm test
   ```

5. **Commit Conventions:**
   Follow Conventional Commits:
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation updates
   - `refactor:` Code restructuring
   - `test:` Adding or updating tests

6. **Submitting a Pull Request:**
   - Push your branch to GitHub.
   - Open a PR against `main` with a clear description of your changes.
