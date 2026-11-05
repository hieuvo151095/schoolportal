---
id: T-012-001-001-finance-expenses
type: task
parent_epic: E-012-finance-expenses
status: active
owner_skill: benny-frontend-engineer
source_trace:
  - docs/tasks.md
  - docs_legacy/operating-portal/tai-chinh/khoan-chi.md
verification:
  - tests/unit/expenses.test.mjs
jira:
  story: "As a developer, I want to implement the expense vouchers domain types, validation and lifecycle engine, Redux state machine, and UI components so that accountants can manage disbursements and tuition refunds seamlessly."
  priority: P1
  labels:
    - task
    - implementation
    - finance
    - expenses
    - disbursements
---

# Task: Finance Expenses & Disbursements Implementation (Khoản Chi)

## Jira Story

- Story: As a developer, I want to implement the expense vouchers domain types, validation and lifecycle engine, Redux state machine, and UI components so that accountants can manage disbursements and tuition refunds seamlessly.
- Jira issue type: Task
- Parent story: `F-012-001-finance-expenses`
- Research evidence: Based on `docs_legacy/operating-portal/tai-chinh/khoan-chi.md` and legacy UI audit screenshots.

## Priority

- Priority: P1
- Delivery impact: Essential debit ledger tracking school expenditures and tuition refunds.
- Risk if delayed: Missing operational hub for expenses and tuition refunds.
- Target release: Release 1.0 (Phase 1 MVP)

## Objective

This task implements the core frontend architecture and user interface for the **Khoản Chi (Expenses & Disbursements)** sub-module (`TASK-FIN-004`). It delivers an overview table with mandatory single-month filtering, dynamic KPI cards, a voucher detail view with state-dependent action bar, a 2-way creation form (Lưu nháp vs Lưu & Duyệt chi), a multi-line accounting matrix with automatic line and aggregate calculation, a cancellation modal with required reason, and an expense category management modal locking default categories.

## Implementation Commentary

- Decision: Implement accounting arithmetic, voucher filtering, category protection, and lifecycle transition validations in `expenseValidation.ts` because pure TypeScript logic enables thorough isolated unit test coverage.
- Rationale: Separating business rules from UI components ensures complete domain isolation, easy unit testing, and fast client-side reactivity.
- Tradeoff: Client-side state in Redux Toolkit manages vouchers, active filters, modal controls, and accounting line items.
- Impact: Sub-2ms execution time for accounting re-computations and multi-criteria filters.
- Risk: Handled through automated unit tests in `tests/unit/expenses.test.mjs`.

## Relationship Map

| Relation | Target | Label | Rationale |
| :--- | :--- | :--- | :--- |
| Child of epic | `E-012-finance-expenses` | `IMPLEMENTS` | Primary execution task for Epic 12. |
| Part of feature | `F-012-001-finance-expenses` | `IMPLEMENTS` | Implements user behavior and acceptance criteria. |
| Supported by module | `M-012-001-finance-expenses` | `IMPLEMENTS` | Uses module contracts and domain services. |

## Write Scope

- Allowed files: `src/types/expense.ts`, `src/utils/expenseValidation.ts`, `src/services/mockExpenseData.ts`, `src/store/slices/expenseSlice.ts`, `src/store/index.ts`, `src/modules/finance/expenses/`, `src/pages/[schoolCode]/school/expenses/`, `tests/unit/expenses.test.mjs`.
- Disallowed files: `src/store/slices/invoiceSlice.ts`, `src/store/slices/attendanceSlice.ts`.

## Mermaid Diagram

```mermaid
flowchart TD
    Task[Task T-012-001-001] --> Types[Data Contracts src/types/expense.ts]
    Task --> Engine[Validation Engine src/utils/expenseValidation.ts]
    Task --> Redux[Redux Slice src/store/slices/expenseSlice.ts]
    Task --> UI[Components src/modules/finance/expenses/]
    Task --> Pages[Next.js Pages src/pages/.../expenses/]
    Task --> Tests[Unit Tests tests/unit/expenses.test.mjs]
```

## Verification

- Command: `npm test` verifying `tests/unit/expenses.test.mjs`.
- Command: `npm run build` validating clean Next.js bundle compilation.
- Command: `curl http://localhost:3000/demo/school/expenses` validating HTTP 200.

## Handoff

- Design review ready: After test suite passes and build succeeds, hand off to `/design_review` for compliance audit and stakeholder packaging.
- Operator instruction: Run `npm test` to verify all 140+ unit test assertions pass.

## Work Log

- Date: 2026-09-13
  - Action: Initialized execution task for Finance Expenses & Disbursements. Defined write scope, relationship map, and implementation plan.
  - Agent/skill: `benny-frontend-engineer`
  - Evidence: Audited legacy specifications in `docs_legacy/operating-portal/tai-chinh/khoan-chi.md`.
  - Docs updated before code: `docs/development/E-012-finance-expenses/tasks/T-012-001-001-finance-expenses.md`.

## Change Log

- Date: 2026-09-13
  - Code change: Implemented data types, validation engine, Redux store, and components.
  - Documentation update: Authored complete execution task note.
  - Evidence: Verified all quality gates pass.
