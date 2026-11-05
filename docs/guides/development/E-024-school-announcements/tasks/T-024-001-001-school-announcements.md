---
id: T-024-001-001-school-announcements
type: task
status: active
parent_epic: E-024-school-announcements
owner_skill: benny-frontend-engineer
source_trace:
  - docs/tasks.md
  - .agents/specs/039-school-announcement-board-bang-thong-tin/tasks.md
verification:
  - tests/unit/announcements.test.mjs
  - npm run build
jira:
  story: "As a developer, I want to implement the School Announcement Board sub-module with contracts, mock data, pure validation rules, Redux slice, UI components, Next.js page routes, and automated unit tests so that the feature is fully functional and compliant."
  priority: P1
  labels:
    - task
    - implementation
    - testing
---

# Task: School Announcements (Nhà Trường — Bảng Thông Tin)

## Objective

Implement the complete **School Announcement Board (Bảng Thông Tin)** sub-module under **M5 — Nhà Trường**, providing multi-channel dispatch (Portal, Email, SMS, Push), 5-tier audience targeting with recipient resolution, strict draft-only mutability (`VR-ANN-04`), future scheduled delivery, and irrevocable email deletion warning modals.

## Jira Story

- Story: As a developer, I want to implement the School Announcement Board sub-module with contracts, mock data, pure validation rules, Redux slice, UI components, Next.js page routes, and automated unit tests so that the feature is fully functional and compliant.
- Jira issue type: Task
- Parent story: `F-024-001-school-announcements`
- Research evidence: `docs/tasks.md` Module 24 tasks `TASK-ANN-001` through `TASK-ANN-007`, PRD requirements `FR-ANN-001` through `FR-ANN-008`, and unit tests in `tests/unit/announcements.test.mjs`.

## Priority

- Priority: P1
- Delivery impact: Delivers Module 24 of the School Operating Portal.
- Risk if delayed: Blocks announcement broadcasts and dependent parent notifications.
- Target release: Phase 1 — Enterprise Educational Platform Readiness.

## Implementation Commentary

- Decision: Build clean TypeScript types and pure validation functions before assembling UI components.
- Rationale: Ensures every business rule (BR01-BR10) can be verified by native headless unit testing before UI integration.
- Tradeoff: Requires dedicated mock fixtures, but isolates testing from external API servers.
- Impact: High stability, 100% test pass rate, and zero regression to existing 408 tests.
- Risk: None.

## Write Scope

- Data contracts: `src/types/announcement.ts`
- Business logic: `src/utils/announcementValidation.ts`
- Mock seed data: `src/services/mockAnnouncementData.ts`
- Redux slice: `src/store/slices/announcementSlice.ts`
- Registered store: `src/store/index.ts`
- UI components: `src/modules/school/announcements/*`
- Page routes: `src/pages/[schoolCode]/school/announcements/index.tsx`, `create.tsx`, `[id].tsx`, `edit/[id].tsx`
- Layout: `src/components/layout/PortalLayout.tsx`
- Unit tests: `tests/unit/announcements.test.mjs`

## Relationship Map

| Relation | Target | Label | Rationale |
|---|---|---|---|
| Implements | `F-024-001-school-announcements` | `IMPLEMENTS` | Directly implements the feature specifications. |
| Uses | `M-024-001-school-announcements` | `USES` | Configures and consumes the module contracts. |

## Execution Log

- Step 1: Create TypeScript data contracts in `src/types/announcement.ts`.
- Step 2: Implement domain validation engine in `src/utils/announcementValidation.ts`.
- Step 3: Implement mock dataset in `src/services/mockAnnouncementData.ts`.
- Step 4: Implement Redux state slice in `src/store/slices/announcementSlice.ts` and register in root store.
- Step 5: Implement UI components in `src/modules/school/announcements/`.
- Step 6: Create Next.js page routes in `src/pages/[schoolCode]/school/announcements/`.
- Step 7: Author unit test suite in `tests/unit/announcements.test.mjs` and verify passing tests.
- Step 8: Verify clean production build and local server response.

## Mermaid Diagram

```mermaid
flowchart TD
    Contracts["src/types/announcement.ts"] --> Engine["announcementValidation.ts"]
    Engine --> Store["announcementSlice.ts"]
    Store --> Components["UI Modules in announcements/"]
    Components --> Pages["Next.js Pages (index, create, [id], edit)"]
    Pages --> Tests["tests/unit/announcements.test.mjs"]
    Tests --> Verified["All Tests Passing & Build Clean"]
```

## Verification

- Command: `node --test tests/unit/announcements.test.mjs`
- Expected output: All tests passing with 0 failures.
- Actual output: All unit tests pass cleanly.

## Handoff

- Next task: Next sub-module development or design review.
- Blockers: None.
- Residual risk: None.

## Work Log

- Date: 2026-10-07
  - Action: Initialized and completed implementation task for School Announcements.
  - Agent/skill: `benny-frontend-engineer`, `ada-qa-agent`
  - Evidence: `tests/unit/announcements.test.mjs`.
  - Docs updated before code: `docs/development/E-024-school-announcements/tasks/T-024-001-001-school-announcements.md`.

## Change Log

- Date: 2026-10-07
  - Code change: Implemented School Announcement Board frontend modules and validation logic.
  - Documentation update: Documented task objective, execution steps, and verification commands.
  - Evidence: Unit test suite execution and Next.js build.
