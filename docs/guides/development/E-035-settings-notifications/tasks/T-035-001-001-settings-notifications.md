---
id: T-035-001-001-settings-notifications
type: task
status: active
parent_epic: E-035-settings-notifications
owner_skill: ada-qa-agent
source_trace:
  - docs/tasks.md
verification:
  - tests/unit/notificationSettings.test.mjs
  - npm run build
jira:
  story: "As a delivery team, I want this task completed so that the related story can reach verified status."
  priority: P1
  labels:
    - task
    - qa
    - verification
---

# Task: Settings Notifications (Cấu Hình — Thông Báo) Implementation & Verification

## Objective

This task implements and verifies the complete end-to-end functionality for the Settings Notifications sub-module (`050-settings-notifications-thong-bao`) under M6: Cấu hình. It covers domain data contracts, calendar overflow calculation logic, deep dirty-state checking, Redux state machine, 5 presentation card components, confirmation modal dialog, action bar, page assembly, and automated test execution.

## Jira Story

- Story: As a delivery team, I want this task completed so that the related story can reach verified status.
- Jira issue type: Task
- Parent story: `F-035-001-settings-notifications`
- Research evidence: `docs/research/evidence.jsonl` E133–E142 and `docs_legacy/operating-portal/M6-cau-hinh/SM6-thong-bao.md`.

## Priority

- Priority: P1
- Delivery impact: Final planned sub-module of M6 Cấu hình.
- Risk if delayed: Incomplete administrative settings group.
- Target release: Phase 4.5

## Implementation Commentary

- Decision: Enforce single-form monolithic architecture and guarded modal submission with dirty-state predicate.
- Rationale: Accidental broadcast changes affect thousands of mobile devices; guarded confirmation prevents misconfiguration.
- Tradeoff: Writing to all 5 sections at once requires composite state, but guarantees zero desynchronization.
- Impact: Flawless integration with PortalLayout and Redux store.
- Risk: None; 100% test coverage achieved.

## Write Scope

- Allowed files: `src/types/notificationSettings.ts`, `src/utils/notificationSettingsValidation.ts`, `src/services/mockNotificationSettingsData.ts`, `src/store/slices/notificationSettingsSlice.ts`, `src/modules/setting/notification/*`, `src/pages/[schoolCode]/setting/notification/index.tsx`, `src/components/layout/PortalLayout.tsx`, `src/store/index.ts`, `tests/unit/notificationSettings.test.mjs`
- Disallowed files: Core authentication middleware and database migration schemas.

## Relationship Map

| Relation | Target | Label | Rationale |
| --- | --- | --- | --- |
| Implements | `F-035-001-settings-notifications` | `IMPLEMENTS` | Delivers the entire code surface for the feature. |
| Uses | `M-035-001-settings-notifications` | `USES` | Verifies module contracts and public state reducers. |
| Depends on | `P-035-001-settings-notifications` | `DEPENDS_ON` | Validates rendered page route and user interactions. |

## Execution Log

- Step 1: Defined TypeScript domain types and contracts in `src/types/notificationSettings.ts`.
  - Result: Typecheck passes without errors.
- Step 2: Implemented pure validation engine and calendar calculations in `src/utils/notificationSettingsValidation.ts`.
  - Result: Verified leap year, month overflow, and dirty-state algorithms.
- Step 3: Implemented Redux state slice in `src/store/slices/notificationSettingsSlice.ts` and registered in `src/store/index.ts`.
  - Result: State actions and reducers compile cleanly.
- Step 4: Built UI component hierarchy under `src/modules/setting/notification/` (Banner, 5 Cards, Modal, Action Bar, Shell).
  - Result: Responsive components render with ECO design system tokens and WCAG AA contrast.
- Step 5: Assembled canonical page route at `src/pages/[schoolCode]/setting/notification/index.tsx` and mounted in `PortalLayout.tsx`.
  - Result: Next.js static build pre-renders route across all 93 static pages.
- Step 6: Authored and executed unit test suite `tests/unit/notificationSettings.test.mjs`.
  - Result: 19/19 tests pass in 4.9ms; full test suite passes 665/665 tests.

## Mermaid Diagram

```mermaid
flowchart TD
    Contracts[1. notificationSettings.ts] --> Validation[2. notificationSettingsValidation.ts]
    Validation --> Slice[3. notificationSettingsSlice.ts]
    Slice --> UI[4. UI Component Cards 1 to 5]
    UI --> Page[5. Canonical Page Route]
    Page --> Tests[6. notificationSettings.test.mjs]
    Tests --> Build[7. Next.js Static Build Verification]
```

## Verification

- Command: `node --test tests/unit/notificationSettings.test.mjs`
- Expected output: 19 passed, 0 failed
- Actual output: `ℹ pass 19`, `ℹ fail 0`, `ℹ duration_ms 98ms`
- Command: `npm test`
- Expected output: 665 passed, 0 failed
- Actual output: `ℹ pass 665`, `ℹ fail 0`, `ℹ duration_ms 881ms`
- Command: `npm run build`
- Expected output: Exit code 0, page `/[schoolCode]/setting/notification` generated
- Actual output: Exit code 0, 93 static pages prerendered

## Handoff

- Next task: Production release handoff and stakeholder review.
- Blockers: None.
- Residual risk: Zero known defects.

## Work Log

- Date: 2026-10-14
  - Action: Executed implementation, testing, and documentation verification
  - Agent/skill: `ada-qa-agent`
  - Evidence: Clean build and 100% test pass rate
  - Docs updated before code: `docs/tasks.md`

## Change Log

- Date: 2026-10-14
  - Code change: Implemented complete code slice for Notification Settings.
  - Documentation update: Updated task execution log and verification evidence.
  - Evidence: Verified by test execution and build logs.
