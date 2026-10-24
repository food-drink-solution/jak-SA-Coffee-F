# Branching Strategy (enforced)

> This document describes the **enforced** path. The rules below are not style
> recommendations — they are validated on every pull request by the
> **PR Guardrails** workflow (`.github/workflows/pr-path-guard.yml`) and locked
> in by GitHub branch protections.

## Branches

| Branch | Purpose | Policy |
| --- | --- | --- |
| `main` | Production-ready. Tagged with `vX.Y.Z`, drafts releases, served by CI. | PR-only. No direct commits, no force pushes, no deletions (branch protection). |
| `develop` | Daily integration branch. All work lands here first. | PR-only, same checks as `main`. |
| `release/x.y.z` | Release candidates cut from `develop` (freeze room). | Open a PR into `main`; only bugfix/CI/chore commits allowed while open. |
| `feat/*`, `fix/*`, `bug/*`, `chore/*`, `refactor/*`, `perf/*`, `docs/*`, `test/*`, `ci/*`, `build/*`, `style/*`, `update/*` | Short-lived work branches. | Open a PR into `develop`; squash-merge after CI green. |
| `hotfix/*` | Urgent production fixes. | PR into `main` **and** a back-merge PR into `develop` so the fix is not lost. |

## The path map (validated on every PR)

| Head branch | Allowed base |
| --- | --- |
| `feat/*`, `feature/*`, `fix/*`, `bug/*`, `bugfix/*`, `chore/*`, `refactor/*`, `perf/*`, `docs/*`, `test/*`, `ci/*`, `build/*`, `style/*`, `update/*` | `develop` |
| `release/*` | `main` |
| `hotfix/*` | `main`, `develop` |
| `develop` | `main` (periodic release sync / release cut) |
| `dependabot/*` | `develop` or `main` |

Anything else is rejected by CI with an explanation.

## Workflows

| Workflow | Role |
| --- | --- |
| `CI Quality Gates` (`ci.yml`) | Lint + typecheck + tests + build. Runs on pushes to `main`, `develop`, `release/**` and PRs into all three. Only commits when its own files/paths change. |
| `PR Guardrails` (`pr-path-guard.yml`) | Fails a PR whose head name, target base, or title breaks the conventions above. Titles follow `<type>(<scope>)?: <summary>`. |
| `PR Labeler` (`pr-labeler.yml`) | Auto-labels PRs by head-branch prefix (`feat/* → feature`, `fix/* → fix`, `perf/* → performance`, …) so release-drafter categories and version bumps work. |
| `Release Drafter` (`release-drafter.yml`) | Maintains the draft release notes from PRs merged to `main`. |
| `Automated Release` (`release.yml`) | Triggered by `v*.*.*` tag pushes (tags are cut on `main`): runs quality gates, builds, archives and publishes the release. |

## Release flow

1. Work flows into `develop` through PRs (one `feat`/`fix`/`chore` PR = one unit).
2. When a batch is ready: cut `release/x.y.z` from `develop`, UAT it. Found bugs?
   PR back into `release/x.y.z` as `bug/*`/`chore/*`.
3. Open `release/x.y.z → main`, label the PR `major` / `minor` / `patch`,
   merge → the tag-drafter resolves `vX.Y.Z`.
4. `git tag vX.Y.Z <main-commit>` and push the tag — **Automated Release**
   publishes the full release with the storefront archive.
5. Back-merge `main` (or the release head) into `develop` if the release
   branch took fixes.

## Hotfix flow

`main` is on fire → branch `hotfix/x.y.z` from `main` → PR into `main` → tag
the patch release → immediately PR the same fix into `develop`.

## Rules

- Every change ships through a PR — direct pushes to `main` and `develop` are
  blocked by branch protection (including for admins).
- Required checks before merge: **CI Quality Gates (Lint, Test & Build
  Frontend)** and **PR Guardrails (Path & Title Check)**.
- Conventional commit titles: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`,
  `perf:`, … — same vocabulary as the branch prefixes.
- Never commit secrets, `.env`, or `node_modules`. The contact-inbox runtime
  data (`jak-sa/data/`) is git-ignored.
