---
id: T-014-001-001-finance-fee-reports
type: task
status: completed
owner_skill: benny-frontend-engineer
parent_epic: E-014-finance-fee-reports
source_trace:
  - src/modules/finance/reports/
verification:
  - tests/unit/feeReports.test.mjs
jira:
  story: "As an Engineer, I want to execute the end-to-end implementation of Báo Cáo Học Phí across contracts, validation, Redux, UI components, and Next.js routes."
  priority: P1
  labels:
    - execution
    - task
---

# Task: End-to-End Implementation of Fee Collection Reports & Analytics

## Jira Story

- **Story:** As an Engineer, I want to execute the end-to-end implementation of Báo Cáo Học Phí across contracts, validation, Redux, UI components, and Next.js routes.
- **Jira Issue Type:** Sub-task
- **Acceptance Owner:** `benny-frontend-engineer`

## Priority

- **Priority:** P1 (High)
- **Severity if missed:** High
- **Rationale:** Delivers the final sub-module in Module 3 (Tài Chính).

## Objective

Build the end-to-end fee collection reporting and analytics sub-module across 4 dedicated URL routes (`/overview`, `/fee`, `/fee/partial`, `/fee/unpaid`) with class breakdown matrices, confirmation date filtering, stacked partial amounts, overdue status highlighting, and an automated zero-record Excel export guard.

## Implementation Commentary

- Decision: Implement calculation arithmetic in pure TypeScript utility functions (`feeReportValidation.ts`) and global view model state in Redux Toolkit (`feeReportSlice.ts`).
- Rationale: Ensures sub-millisecond tab switching, eliminates visual flickering, and permits rapid deterministic unit testing in Node.js.
- Tradeoff: Kept 4 separate page route entrypoints while sharing standard layout and filter toolbars, ensuring alignment with legacy URL design patterns (BR01).

## Execution Log

1. **Requirements & Legacy Analysis:** Reviewed `docs_legacy/operating-portal/tai-chinh/bao-cao-hoc-phi.md` and distilled BR01-BR09.
2. **Contracts & Validation Engine:** Created `src/types/feeReport.ts` and `src/utils/feeReportValidation.ts`.
3. **Mock Data Seed:** Implemented `src/services/mockFeeReportData.ts` with multi-class and archived student records.
4. **State Machine:** Built `src/store/slices/feeReportSlice.ts` and registered into root Redux store.
5. **Layout Navigation:** Updated `src/components/layout/PortalLayout.tsx` to include Báo Cáo Học Phí and avoid `/school/fee` route collision.
6. **UI Component Hierarchy:** Created 8 modular components in `src/modules/finance/reports/`.
7. **Page Routes:** Implemented 4 Next.js Page routes under `src/pages/[schoolCode]/reports/fee/`.
8. **Automated Testing:** Authored `tests/unit/feeReports.test.mjs` verifying 10 assertions (170/170 tests passing project-wide).
9. **Build & Live Verification:** Compiled clean production bundle via `next build` (39/39 static pages) and verified HTTP 200 on all endpoints.

## Write Scope

- `src/types/feeReport.ts`
- `src/utils/feeReportValidation.ts`
- `src/services/mockFeeReportData.ts`
- `src/store/slices/feeReportSlice.ts`
- `src/store/index.ts`
- `src/components/layout/PortalLayout.tsx`
- `src/modules/finance/reports/FeeReportTabsNav.tsx`
- `src/modules/finance/reports/FeeReportSummaryCards.tsx`
- `src/modules/finance/reports/FeeReportToolbar.tsx`
- `src/modules/finance/reports/FeeOverviewTable.tsx`
- `src/modules/finance/reports/PaidInvoicesTable.tsx`
- `src/modules/finance/reports/PartialInvoicesTable.tsx`
- `src/modules/finance/reports/UnpaidInvoicesTable.tsx`
- `src/modules/finance/reports/PaymentHistoryModal.tsx`
- `src/pages/[schoolCode]/reports/fee/overview/index.tsx`
- `src/pages/[schoolCode]/reports/fee/index.tsx`
- `src/pages/[schoolCode]/reports/fee/partial/index.tsx`
- `src/pages/[schoolCode]/reports/fee/unpaid/index.tsx`
- `tests/unit/feeReports.test.mjs`

## Commands Executed

```bash
node --test tests/unit/feeReports.test.mjs
npm test
npm run build
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/reports/fee/overview
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/reports/fee
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/reports/fee/partial
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/reports/fee/unpaid
```

## Verification

- Unit tests: 10/10 passing in 3.8ms. Overall suite: 170/170 passing in 344ms.
- Next.js build: 39/39 static pages generated cleanly with 0 type errors.
- Live HTTP status: 200 OK across all 4 routes.

## Blockers & Resolutions

- **Blocker:** Node ESM rejected `import { PayloadAction } from '@reduxjs/toolkit'` as a runtime named export.
- **Resolution:** Updated to `import type { PayloadAction } from '@reduxjs/toolkit'`.
- **Blocker:** Navigation active indicator collision between `/school/fee` and `/reports/fee`.
- **Resolution:** Scoped active check for Tuition Invoices to `asPath.includes('/school/fee')`.

## Handoff Checklist

- [x] All 10 business rules (BR01-BR09) implemented and verified.
- [x] Dedicated archived students row rendered and included in totals (BR02).
- [x] Paid invoices filtered by confirmation date (BR03).
- [x] Partial invoices render stacked amounts (BR04) and open payment history modal (BR06).
- [x] Unpaid invoices highlight overdue bills in red (BR05).
- [x] Excel export button dynamically disabled when record count is 0 (BR08).
- [x] Automated unit test suite passing 100%.

## Relationship Map

| Relation | Target | Label | Rationale |
| --- | --- | --- | --- |
| Implements | `F-014-001-finance-fee-reports` | `IMPLEMENTS` | Completes the execution task for Feature F-014-001. |

## Mermaid Diagram

```mermaid
flowchart TD
    TaskStart[Start Task T-014-001-001] --> Contracts[Create feeReport.ts]
    Contracts --> Engine[Create feeReportValidation.ts]
    Engine --> Redux[Create feeReportSlice.ts]
    Redux --> UI[Build 8 UI Components]
    UI --> Pages[Build 4 Next.js Routes]
    Pages --> Tests[Author feeReports.test.mjs]
    Tests --> Build[next build: 39/39 Pages Static Prerendered]
    Build --> LiveVerify[cURL Live HTTP 200 Verification]
    LiveVerify --> TaskDone[Task Completed]
```

## Work Log

- `2026-09-13 10:09`: Bootstrapped development ledger and implemented contracts/engine.
- `2026-09-13 10:12`: Finished Redux integration, UI components, routes, and unit tests.

## Change Log

- **2026-09-13:** Initialized and completed Task T-014-001-001.
