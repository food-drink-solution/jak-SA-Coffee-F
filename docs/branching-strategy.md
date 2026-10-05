# Branching Strategy (PR best practice)

## Branches

| Branch | Purpose | Policy |
| --- | --- | --- |
| `main` | Always production-ready, mirror of the latest verified build. | No direct commits — merges only via PR from `develop` or `release`. |
| `develop` | Daily integration branch. Feature branches open PRs into here. | Small, reviewed, green-CI commits. |
| `release` | Release candidates for UAT/QA. | Freeze-room: only bugfix/CI/chore commits. Merges into `main` when approved (and back to `develop`). |
| `feature/*`, `fix/*`, `refactor/*` | Short-lived work branches. | Open a PR to `develop`; squash-merge after review. |

## Rules

- Every change ships through a PR (no direct pushes to `main` / `release`).
- PR requires passing before merge: `pnpm install && pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
- Conventional-commit message style: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- Tag releases on `release` with `vX.Y.Z` (semver).
