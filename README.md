# ☕ JAK — Coffee & Food Storefront Workspace

Full-stack repository structure for **JAK** (Saudi B2B Food & Coffee Supply).

## 📂 Repository Structure

```
.
├── docs/                 # System architecture, design system, and component guides
├── scripts/              # Migration, crawling, and dataset validation utilities
│
├── jak-sa/               # Next.js 16 + React 19 Frontend Storefront
│   ├── src/              # Application source code (App Router, components, features)
│   ├── public/           # Static assets, brand logos, product images
│   ├── tests/            # Unit & E2E tests (Vitest, Playwright)
│   ├── package.json      # Frontend dependencies & scripts
│   └── tsconfig.json     # TypeScript configuration
│
└── server-api/           # ASP.NET Core Backend REST API
    ├── README.md         # Backend API documentation
    └── .gitkeep          # Reserved for upcoming ASP.NET backend implementation
```

---

## ⚡ Quick Start (Frontend)

To run the frontend storefront:

```bash
# Navigate to the frontend directory
cd jak-sa

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Or from the root directory using pnpm workspace:

```bash
# Install all workspace dependencies
pnpm install

# Start the frontend
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the storefront (auto-redirects to `/ar`).

---

## 🛠️ Technology Stack

| Domain | Technology | Status |
|--------|------------|--------|
| **Frontend (`jak-sa`)** | Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript | Active / Production-Ready |
| **Backend (`server-api`)** | ASP.NET Core (.NET 8/9), C# | Planned / Reserved |
| **Package Manager** | pnpm workspaces | Active |

---

## 📚 Documentation

For in-depth guides on the storefront and architecture, refer to the documentation inside `docs/`:
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Design System & Styles](./docs/STYLES.md)
- [Component Guide](./docs/COMPONENTS.md)
- [Development Workflow](./docs/DEVELOPMENT.md)
