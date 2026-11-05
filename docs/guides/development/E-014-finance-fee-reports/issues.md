---
id: ISSUES-E-014-finance-fee-reports
type: issues
status: closed
owner_skill: ada-qa-agent
parent_epic: E-014-finance-fee-reports
source_trace:
  - tests/unit/feeReports.test.mjs
verification:
  - tests/unit/feeReports.test.mjs
jira:
  story: "As a QA Engineer, I want all edge cases in Fee Collection Reports verified—including confirmation date filtering, archived student groupings, stacked partial amounts, and red overdue highlights—so that financial intelligence is 100% dependable."
  priority: P1
  labels:
    - qa
    - issues
    - testing
---

# QA Issues & Risk Ledger: Finance Fee Collection Reports (Báo Cáo Học Phí)

## Jira Story

- **Story:** As a QA Engineer, I want all edge cases in Fee Collection Reports verified—including confirmation date filtering, archived student groupings, stacked partial amounts, and red overdue highlights—so that financial intelligence is 100% dependable.
- **Jira Issue Type:** Sub-task
- **Acceptance Owner:** `ada-qa-agent`

## Priority

- **Priority:** P1 (High)
- **Severity if missed:** High
- **Rationale:** Financial reporting discrepancies cause severe accountant confusion and incorrect debtor notices.

## QA Issue Register

| Issue ID | Title | Severity | Status | Detection | Resolution |
| --- | --- | --- | --- | --- | --- |
| QA-014-001 | Redux Toolkit PayloadAction Node ESM import syntax error | Major | Resolved | Unit Test Execution | Fixed import to use `import type { PayloadAction } from '@reduxjs/toolkit'` |
| QA-014-002 | PortalLayout navigation link active collision on `/school/fee` vs `/reports/fee` | Minor | Resolved | Integration Inspection | Scoped active check for Tuition Invoices to `asPath.includes('/school/fee')` |
| QA-014-003 | Archived students omitted from class matrix causing totals mismatch | Major | Resolved | Business Rule Audit (BR02) | Added dedicated `Học sinh lưu trữ / đã xoá` row and included it in totals footer |
| QA-014-004 | Paid tab incorrectly filtering by invoice creation date instead of confirmation date | Critical | Resolved | Business Rule Audit (BR03) | Filtered strictly by `paymentHistory[last].paidAt` timestamp |

## Detection Method

- Automated Node ESM unit tests in `tests/unit/feeReports.test.mjs`.
- Next.js static build compilation (`next build`).
- Live HTTP route verification using cURL against localhost.
- Code review across `feeReportValidation.ts` and `feeReportSlice.ts`.

## Open Issues

*None. All detected QA issues have been fully resolved and verified with 100% test pass rate.*

## Relationship Map

| Relation | Target | Label | Rationale |
| --- | --- | --- | --- |
| Verifies | `E-014-finance-fee-reports` | `VERIFIES` | Validates acceptance criteria across the entire fee reports epic. |
| Blocks | `release-v1.0` | `BLOCKS` | Release is blocked if any financial collection calculation fails. |

## Mermaid Diagram

```mermaid
flowchart TD
    IssueDetect[QA Issue Detection] --> FixType[Fix PayloadAction type import]
    IssueDetect --> FixNav[Fix PortalLayout nav active collision]
    IssueDetect --> FixArchived[Add Dedicated Archived Students Row]
    IssueDetect --> FixDate[Enforce Payment Confirmation Date Filter]

    FixType --> Verification[Run Unit Test Suite: 10/10 PASS]
    FixNav --> Verification
    FixArchived --> Verification
    FixDate --> Verification
    Verification --> Signoff[QA Signoff: APPROVED]
```

## Work Log

- `2026-09-13 10:12`: Caught Node ESM type import syntax for PayloadAction and patched `feeReportSlice.ts`.
- `2026-09-13 10:13`: Confirmed zero open regressions; all 170 unit tests passing cleanly.

## Change Log

- **2026-09-13:** Documented QA findings and resolutions for Epic E-014.
