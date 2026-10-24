<!-- Pick the title in conventional format: <type>(<scope>)?: <summary> -->
<!-- Types: feat | fix | bug | chore | refactor | perf | docs | test | ci | build | style | update | release | hotfix -->

## Summary
<!-- What does this change do, in 2–4 sentences? -->

## Path check (auto-enforced by "PR Guardrails")
<!-- This PR must come from and go to the right branches. Delete what does not apply. -->
- Work branch (`feat/*`, `fix/*`, `bug/*`, `chore/*`, `refactor/*`, `perf/*`, `docs/*`, `test/*`, `ci/*`, `build/*`, `style/*`, `update/*`) → targets **`develop`**
- `release/x.y.z` → targets **`main`** (cut from `develop`; tag `vX.Y.Z` on `main` after merge)
- `hotfix/*` → targets **`main`** (then a back-merge PR into `develop`)

Fixes #<issue-number> <!-- keep the "Fixes #N" line so the issue closes on merge -->

## Quality gates
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes (CI will re-run everything anyway)
- [ ] No secrets/.env/node_modules committed

## Release labels (maintainer, applies to the release-facing PR)
<!-- Labels drive release-drafter version resolution on `release/* → main` and `develop → main` PRs -->
- [ ] Bump type labeled: `major` / `minor` / `patch` (delete two)
- [ ] Category labels present: `feature` / `fix` / `bug` / `chore` / `performance` / `documentation` / `ui`
