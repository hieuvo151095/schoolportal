---
id: T-010-001-001-finance-fee-catalog
type: task
parent_epic: E-010-finance-fee-catalog
status: active
owner_skill: benny-frontend-engineer
source_trace:
  - docs/tasks.md
  - docs_legacy/operating-portal/tai-chinh/khoan-phi.md
verification:
  - tests/unit/schoolFees.test.mjs
jira:
  story: "As a developer, I want to implement the fee catalog domain types, validation and filter engine, Redux state machine, and UI components so that accountants can manage school fees end-to-end."
  priority: P1
  labels:
    - task
    - implementation
    - finance
    - fee-catalog
---

# Task: Finance Fee Catalog Implementation (Khoản Phí)

## Objective

This task implements the core frontend architecture and user interface for the **Khoản Phí (Fee Catalog)** sub-module (`TASK-FIN-003`). It provides a master fee catalog table distinguishing system fees from custom fees, inline electronic invoice toggling directly on table rows, student assignment inspection with class filter, asymmetric edit modal, and fee item creation.

## Jira Story

- Story: As a developer, I want to implement the fee catalog domain types, validation and filter engine, Redux state machine, and UI components so that accountants can manage school fees end-to-end.
- Jira issue type: Task
- Parent story: `F-010-001-finance-fee-catalog`
- Research evidence: Based on `docs_legacy/operating-portal/tai-chinh/khoan-phi.md` and legacy UI audit screenshots.

## Priority

- Priority: P1
- Delivery impact: Core foundation for master fee line items and class tuition schedule management.
- Risk if delayed: Blocker for class fee schedule configuration.
- Target release: Release 1.0 (Phase 1 MVP)

## Implementation Commentary

- Decision: Implement fee filtering, validation, and custom-only tally calculation in `schoolFeeValidation.ts`; manage master list and modal states in `schoolFeeSlice.ts`.
- Rationale: Separating business rules from UI components ensures complete isolation, easy unit testing, and fast client-side reactivity.
- Tradeoff: Client-side state maintains optimistic fee items while providing immediate feedback for inline toggles.
- Impact: Sub-2ms execution for catalog filtering and assignment lookups.
- Risk: Handled through automated unit tests in `tests/unit/schoolFees.test.mjs`.

## Write Scope

- Allowed files: `src/types/schoolFee.ts`, `src/utils/schoolFeeValidation.ts`, `src/services/mockSchoolFeeData.ts`, `src/store/slices/schoolFeeSlice.ts`, `src/store/index.ts`, `src/modules/finance/catalog/`, `src/pages/[schoolCode]/school/school-fees/`, `tests/unit/schoolFees.test.mjs`
- Disallowed files: `src/store/slices/invoiceSlice.ts`, `src/store/slices/attendanceSlice.ts`

## Relationship Map

| Relation | Target | Label | Rationale |
| :--- | :--- | :--- | :--- |
| Child of epic | `E-010-finance-fee-catalog` | `IMPLEMENTS` | Primary execution task for Epic 10. |
| Part of feature | `F-010-001-finance-fee-catalog` | `IMPLEMENTS` | Implements user behavior and acceptance criteria. |
| Uses module | `M-010-001-finance-fee-catalog` | `USES` | Consumes fee catalog calculation engine and public contracts. |

## Mermaid Diagram

```mermaid
flowchart TD
    Init[Initialize Task T-010-001-001] --> Types[1. Author TypeScript Contracts src/types/schoolFee.ts]
    Types --> Utils[2. Implement Validation & Filter Engine src/utils/schoolFeeValidation.ts]
    Utils --> Mock[3. Seed Mock Data src/services/mockSchoolFeeData.ts]
    Mock --> Slice[4. Implement Redux Slice src/store/slices/schoolFeeSlice.ts]
    Slice --> Tests[5. Write & Run Unit Tests tests/unit/schoolFees.test.mjs]
    Tests --> UI[6. Build UI Components in src/modules/finance/catalog/]
    UI --> Page[7. Assemble Route src/pages/[schoolCode]/school/school-fees/index.tsx]
    Page --> Verify[8. Verify Clean Build & Runtime Responses]
```

## Verification

```bash
# 1. Automated Unit Tests
npm test tests/unit/schoolFees.test.mjs

# 2. Clean Production Build
npm run build

# 3. Live Server Telemetry
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/school-fees
```

## Handoff

After completing implementation and test passes, package the feature for design review using `/design_review for the sub-module is “fee catalog - Khoản phí”`.

## Work Log

- Date: 2026-09-12
  - Action: Initialized task execution specification, established write scope boundaries, defined verification commands, and mapped implementation steps.
  - Agent/skill: `benny-frontend-engineer`
  - Evidence: Verified requirements against legacy specifications in `docs_legacy/operating-portal/tai-chinh/khoan-phi.md`.
  - Docs updated before code: `docs/development/E-010-finance-fee-catalog/tasks/T-010-001-001-finance-fee-catalog.md`.
- Date: 2026-09-15
  - Action: Implemented mandatory confirmation modal for toggling "Xuất HĐĐT", added standard toast notifications across fee creation, edit, deletion, and toggle actions, and implemented toolbar unit filter and column header unit sorting.
  - Agent/skill: `benny-frontend-engineer`
  - Evidence: Verified via unit test suite `tests/unit/schoolFees.test.mjs`, TypeScript compiler check, and live HTTP 200 server response.

## Change Log

- Date: 2026-09-12
  - Code change: Implemented core contracts, validation engine, Redux store, and components.
  - Documentation update: Authored complete task documentation note.
  - Evidence: Verified via unit test suite and clean production build.
- Date: 2026-09-15
  - Code change: Updated `src/types/schoolFee.ts`, `src/store/slices/schoolFeeSlice.ts`, `src/utils/schoolFeeValidation.ts`, `src/modules/finance/catalog/FeeCatalogTable.tsx`, `CreateFeeModal.tsx`, `EditFeeModal.tsx`, `DeleteFeeModal.tsx`, `tests/unit/schoolFees.test.mjs`.
  - Documentation update: Added ADR-008, updated PRD AC-022, and synchronized task documentation.
  - Evidence: Passed all 199 unit tests and live HTTP 200 checks.


