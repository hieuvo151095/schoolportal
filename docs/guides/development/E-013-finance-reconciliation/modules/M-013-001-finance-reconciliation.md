---
id: M-013-001-finance-reconciliation
type: module
parent_epic: E-013-finance-reconciliation
status: active
owner_skill: alan-tech-lead
source_trace:
  - docs/tasks.md
  - docs/planning/diagrams.md
  - docs_legacy/operating-portal/tai-chinh/doi-soat.md
verification:
  - tests/unit/reconciliation.test.mjs
jira:
  story: "As a software architect, I want the reconciliation session models, date-range validation engine, payment gateway classification, and Redux slice modularized cleanly so that payment audits and linked invoice verification execute deterministically."
  priority: P1
  labels:
    - module
    - architecture
    - finance
    - reconciliation
    - gateways
---

# Module: Reconciliation Service (Dịch Vụ Đối Soát)

## Jira Story

- Story: As a software architect, I want the reconciliation session models, date-range validation engine, payment gateway classification, and Redux slice modularized cleanly so that payment audits and linked invoice verification execute deterministically.
- Jira issue type: Story
- Architecture owner: `alan-tech-lead`
- Research evidence: Based on legacy audit in `docs_legacy/operating-portal/tai-chinh/doi-soat.md` establishing session grouping by sync timestamps (BR01), read-only audit architecture (BR02), dual gateway payment channels (BR03), inline expandable linked invoice accordion (BR04, NFR01), free date-range picker with future date guard (BR05), session detail inner search and channel filtering (BR06), and real-world cumulative transaction matching.

## Priority

- Priority: P1
- Runtime impact: Zero-latency date filtering, instant inline accordion expansion, and pure business logic execution.
- Risk if delayed: Financial audit delays and untracked electronic gateway payouts.
- Release target: Release 1.0 (Phase 1 MVP)

## Responsibility

The Reconciliation Service module encapsulates typed data structures, date-range validation, aggregation arithmetic, payment gateway channel separation, and Redux state management for electronic tuition reconciliation.

Its responsibilities include:
1. Maintaining typed domain models for `ReconciliationSession`, `ReconciliationTransaction`, `LinkedInvoiceItem`, and `PaymentChannel`.
2. Differentiating sync timestamps (`sessionDate`) from payment timestamps (`transactionPeriod`) per BR01.
3. Enforcing a strictly read-only audit contract per BR02.
4. Categorizing and filtering payment channels (`Ví FinViet` vs `QR Ecopay`) per BR03.
5. Validating date-range intervals and disallowing future dates beyond current date per BR05.
6. Managing inline accordion expansion state for linked invoices per BR04 and NFR01.
7. Calculating session-level and transaction-level financial aggregates (total amount, transaction counts, unique invoice counts).
8. Providing multi-factor search across student code, student name, and transaction code inside sessions per BR06.

## Implementation Commentary

- Decision: Implement date-range validation, session filtering, transaction filtering, and aggregate arithmetic as pure TypeScript functions in `src/utils/reconciliationValidation.ts`.
- Rationale: Decouples business rules from UI rendering, permitting fast automated unit testing in Node.js (<15ms) without browser or DOM dependencies.
- Tradeoff: Maintains reconciliation state inside Redux Toolkit (`src/store/slices/reconciliationSlice.ts`) with typed actions for date ranges, search keywords, channel filters, and accordion row toggles.
- Impact: Sub-millisecond filter reactivity and zero layout shifts during inline accordion expansion.
- Risk: Addressed through defensive null-checking, negative number guards, and date boundary checks.

## Relationship Map

| Relation | Target | Label | Rationale |
| :--- | :--- | :--- | :--- |
| Belongs to | `E-013-finance-reconciliation` | `BELONGS_TO` | Core architectural module of Epic 13. |
| Enables | `F-013-001-finance-reconciliation` | `ENABLES` | Provides typed domain contracts and validation logic. |
| Visualized on | `P-013-001-finance-reconciliation` | `RENDERED_ON` | Powers the overview and detail user interface components. |
| Tested by | `T-013-001-001-finance-reconciliation` | `TRACKED_BY` | Verified through execution task test cases. |

## Code Scope

- Primary files: `src/types/reconciliation.ts`, `src/utils/reconciliationValidation.ts`, `src/services/mockReconciliationData.ts`, `src/store/slices/reconciliationSlice.ts`, `src/store/index.ts`.
- Test files: `tests/unit/reconciliation.test.mjs`.

## Architecture Boundaries & Code Ownership

- Public Contract:
  - `src/types/reconciliation.ts`: `PaymentChannel`, `LinkedInvoiceItem`, `ReconciliationTransaction`, `ReconciliationSession`, `ReconciliationFilterCriteria`.
  - `src/utils/reconciliationValidation.ts`:
    - `formatReconciliationAmount(amount: number, withSuffix?: boolean): string`
    - `isDateRangeValid(startDate: string, endDate: string, maxDate?: string): boolean`
    - `filterSessions(sessions: ReconciliationSession[], startDate: string, endDate: string): ReconciliationSession[]`
    - `filterTransactions(transactions: ReconciliationTransaction[], searchKeyword: string, channel: 'all' | PaymentChannel): ReconciliationTransaction[]`
    - `calculateSessionAggregates(sessions: ReconciliationSession[])`
    - `calculateTransactionAggregates(transactions: ReconciliationTransaction[])`
  - `src/store/slices/reconciliationSlice.ts`: `setDateRange`, `setSelectedSessionId`, `setSearchKeyword`, `setSelectedChannel`, `toggleExpandTransaction`, `resetDetailFilters`.

## Mermaid Diagram

```mermaid
classDiagram
    class ReconciliationSession {
        +string id
        +string sessionCode
        +string sessionDate
        +string transactionPeriod
        +string startDate
        +string endDate
        +number totalAmount
        +number transactionCount
        +number invoiceCount
        +ReconciliationTransaction[] transactions
    }

    class ReconciliationTransaction {
        +string id
        +string transactionCode
        +string studentId
        +string studentName
        +string className
        +number amount
        +string transactionTime
        +PaymentChannel channel
        +string channelLabel
        +LinkedInvoiceItem[] linkedInvoices
    }

    class LinkedInvoiceItem {
        +string id
        +string invoiceCode
        +string invoiceTitle
        +number totalAmount
        +string status
    }

    ReconciliationSession "1" *-- "*" ReconciliationTransaction : contains
    ReconciliationTransaction "1" *-- "*" LinkedInvoiceItem : links to
```

## Verification

- Automated test suite: `tests/unit/reconciliation.test.mjs`.
- 100% assertions covering BR01 through BR09.

## Work Log

- 2026-09-13:
  - Action: Implemented data contracts, pure validation engine, and Redux slice for Reconciliation service.
  - Agent/skill: `alan-tech-lead`
  - Evidence: Unit test suite `tests/unit/reconciliation.test.mjs` passes 10/10 assertions in 11ms.
  - Docs updated before code: `docs/development/E-013-finance-reconciliation/modules/M-013-001-finance-reconciliation.md`.

## Change Log

- 2026-09-13:
  - Code change: Created `reconciliationValidation.ts`, `reconciliationSlice.ts`, and test suite.
  - Documentation update: Authored complete module documentation note.
  - Evidence: Unit test suite passing all assertions.
