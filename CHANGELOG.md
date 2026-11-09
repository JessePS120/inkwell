# CHANGELOG.md

## [1.0.0] - 2026-10-29

### Added

-Containerized server and Docker Compose development stack (Lecture 18)
-CI pipeline: dependency audit, unit, integration, component and E2E tests,
  and image publishing to GHCR (Lectures 19-20)
-Continuous delivery to Render: automatic staging, manually approved
  production (Lecture 21)
-Registration, logout, and post authors in the UI (Lecture 22)
-Metrics program, project plan, risk register and support strategy
  (Lectures 23-24)

### Fixed

-Failed logins crashed the server instead of returning 401 (Lecture 22)
-Registration and login responses included the password hash (Lecture 22)

## [0.5.0] - 2026-07-12

### Added

- User registration and login (Lecture 6)
- Post creation and feed browsing (Lecture 6)
- Tag-based search (Lecture 9)

### Fixed

- Broken access control, weak JWT secret, misconfigured errors (Lecture 16)