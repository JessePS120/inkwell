# docs/process/SCM-POLICY.md

## Branching Strategy (Section 5.1)

Inkwell uses GitHub Flow:

- `main` is always deployable.
- All work happens on short-lived branches named `<type>/<short-description>`,
  e.g. `feature/tag-search`, `fix/authorid-spoofing`.
- Branches merge via pull request, requiring:
  - All automated tests passing
  - At least one review approval
- Branches are deleted after merge.

## Commit Message Conventions (Section 4.3's "commit," made disciplined)

Inkwell follows Conventional Commits:
  <type>(<scope>): <short summary>

Types: feat, fix, test, docs, refactor, chore, security
Examples:
  feat(posts): add tag-based search
  security(auth): fix authorId spoofing vulnerability

## CI Enforcement (Lecture 20)

`main` is now a protected branch:

- Required status checks: dependency-audit, server-tests, client-tests,
  e2e-tests, docker-build
- No direct pushes to main; all changes via pull request
- Branches must be up to date with main before merging
- The rule applies to administrators too
- This turns Lecture 17's "main is always deployable" policy from a
  documented intention into a mechanically enforced guarantee — a
  pull request cannot merge until every required check passes.