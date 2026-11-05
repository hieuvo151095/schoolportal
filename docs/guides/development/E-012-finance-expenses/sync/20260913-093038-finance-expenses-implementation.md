---
id: sync-20260913-093038-finance-expenses-implementation
type: development-sync
parent_epic: E-012-finance-expenses
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs/planning/diagrams.md
  - docs_legacy/operating-portal/tai-chinh/khoan-chi.md
verification:
  - tests/unit/expenses.test.mjs
---

# Development Doc Sync: finance-expenses-implementation

## Source Changes

- `src/types/expense.ts`
  - Reason: Defines TypeScript domain contracts for expense vouchers, accounting line items, expense categories, filter criteria, and form inputs.
  - Impacted behavior: Establishes complete type safety across state slices, validation utilities, and UI table components.
- `src/utils/expenseValidation.ts`
  - Reason: Encapsulates pure business rules for accounting line calculation (BR04), lifecycle permissions (BR05), category deletion protection (BR08), single-month filtering (BR07), and form validations.
  - Impacted behavior: Powers instant row total calculations, status badges, cancel guards, and modal submission validation without side effects.
- `src/services/mockExpenseData.ts`
  - Reason: Provides realistic mock data for December 2025 and September 2026 expense vouchers and master categories.
  - Impacted behavior: Enables realistic offline demonstration including voucher `PC-202512-001` (tuition refund for student Cao Ngọc Minh with guardian recipient Nguyễn Văn Toàn).
- `src/store/slices/expenseSlice.ts`
  - Reason: Manages client-side Redux state for vouchers, categories, active month/search filters, creation with 2-way entrypoints ("Lưu nháp" vs "Lưu & Duyệt chi" - BR06), disbursement confirmation, approval, cancellation, and modal dialogs.
  - Impacted behavior: Supports optimistic instant updates and triggers state transitions.
- `src/store/index.ts`
  - Reason: Registers `expenseReducer` into the root application store.
  - Impacted behavior: Exposes expense state to all components and pages.
- `src/modules/finance/expenses/ExpenseToolbar.tsx`
  - Reason: Toolbar component with mandatory single-month picker (BR07), search bar, type and status filters, category button, and conditional export button (BR09).
  - Impacted behavior: Enables accountants to filter vouchers and disables export on empty months.
- `src/modules/finance/expenses/ExpenseSummaryCards.tsx`
  - Reason: Top KPI cards summarizing total expenditures, disbursed amounts, awaiting approvals, and draft/cancelled vouchers.
  - Impacted behavior: Provides high-level operational metrics at a glance.
- `src/modules/finance/expenses/ExpenseOverviewTable.tsx`
  - Reason: Responsive table listing expense vouchers with status badges, recipient information, and contextual actions.
  - Impacted behavior: Renders the primary expense roster with quick confirmation and cancel triggers.
- `src/modules/finance/expenses/ExpenseDetailView.tsx`
  - Reason: Comprehensive voucher inspection view with dynamic beneficiary card (Student vs Staff - BR03), accounting matrix (BR04), audit trail (NFR03), and state-dependent action bar (BR05).
  - Impacted behavior: Enforces lifecycle action permissions (hiding cancel/confirm on disbursed vouchers).
- `src/modules/finance/expenses/CreateExpenseView.tsx`
  - Reason: Full voucher creation wizard with dynamic beneficiary fields, tuition refund notification alert (BR01), accounting matrix row editor (BR04), and 2-way submission (BR06).
  - Impacted behavior: Supports creating drafts or immediately approving vouchers.
- `src/modules/finance/expenses/CancelVoucherModal.tsx`
  - Reason: Modal dialog enforcing mandatory cancellation reason notes prior to marking vouchers as `Đã hủy` (BR05).
  - Impacted behavior: Records cancel reasons and timestamps in the audit trail.
- `src/modules/finance/expenses/ExpenseCategoryModal.tsx`
  - Reason: Drawer/modal managing categories with applied counts; locks "Mặc định" category from deletion (BR08).
  - Impacted behavior: Prevents deletion of system default category while allowing custom category creation and editing.
- `src/pages/[schoolCode]/school/expenses/index.tsx`
  - Reason: Primary overview route mounted under `PortalLayout`.
  - Impacted behavior: Renders the expense voucher overview dashboard at `/[schoolCode]/school/expenses`.
- `src/pages/[schoolCode]/school/expenses/[expenseId].tsx`
  - Reason: Detail route mounted under `PortalLayout` with SSR fallback.
  - Impacted behavior: Renders voucher detail view at `/[schoolCode]/school/expenses/[expenseId]`.
- `src/pages/[schoolCode]/school/expenses/create/index.tsx`
  - Reason: Creation wizard route mounted under `PortalLayout`.
  - Impacted behavior: Renders creation form at `/[schoolCode]/school/expenses/create`.
- `tests/unit/expenses.test.mjs`
  - Reason: Automated unit test suite asserting BR01 through BR10.
  - Impacted behavior: Guarantees zero regression and 100% adherence to legacy specifications.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/tai-chinh/khoan-chi.md`, `docs/tasks.md`, `docs/prd.md`, `docs/development/E-011-finance-tuition-management/epic.md`.
- Pre-code docs updated: `docs/development/E-012-finance-expenses/epic.md`, `issues.md`, `features/F-012-001`, `modules/M-012-001`, `pages/P-012-001`, `tasks/T-012-001-001`, `docs/development/development_manifest.json`, `docs/development/index.md`.
- Relationship map reviewed: Verified relationships `IMPLEMENTS TASK-FIN-004`, `DEPENDS_ON E-009-finance-invoices`, `ENABLES TASK-FIN-005`.
- Related features checked: Confirmed that student Cao Ngọc Minh matches the tuition refund scenario observed in legacy demo data and connects to parent billing balances.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: No change needed; PRD already covers Module 3: Tài Chính high-level requirements.
- `docs/tasks.md`: Checked off `TASK-FIN-004` and recorded verification evidence for expense vouchers, accounting calculation, cancellation flow, and category management.
- `docs/knowledge.md`: No change needed; knowledge architecture remains consistent.
- `docs/decisions.md`: No change needed; architecture decisions remain aligned.
- `docs/memory.md`: No change needed; covered in session history.
- `docs/planning/flows.md`: No change needed; flow covered in diagrams.
- `docs/planning/screens.md`: No change needed; screens cataloged in P-012-001.
- `docs/planning/diagrams.md`: Appended Section 11 detailing Finance Expenses & Disbursements Architecture with full Mermaid flowchart.

### Development Ledger Docs

- Epic notes: `docs/development/E-012-finance-expenses/epic.md` authored and validated.
- Module notes: `docs/development/E-012-finance-expenses/modules/M-012-001-finance-expenses.md` authored and validated.
- Feature notes: `docs/development/E-012-finance-expenses/features/F-012-001-finance-expenses.md` authored and validated.
- Page notes: `docs/development/E-012-finance-expenses/pages/P-012-001-finance-expenses.md` authored and validated.
- Task notes: `docs/development/E-012-finance-expenses/tasks/T-012-001-001-finance-expenses.md` authored and validated.
- Issues register: `docs/development/E-012-finance-expenses/issues.md` authored and validated.

## Strict Policy Checklist

- [x] All changed files are mapped to an entry under Source Changes.
- [x] Every doc update has a substantive, concrete reason.
- [x] All unchanged legacy docs are listed with explicit reasons.
- [x] Manifest and index were reconciled when new docs were added.
- [x] Required docs-before-code evidence is recorded.
- [x] At least one global planning doc (`docs/tasks.md` and `docs/planning/diagrams.md`) was updated.
- [x] Verified zero regressions across existing unit test suites (150/150 passing).

## Verification Evidence

- Command: `npm test`
- Result: 150/150 tests passing (10 tests in `tests/unit/expenses.test.mjs`, duration 283ms).
- Command: `npm run build`
- Result: Clean Next.js static build compiling 33/33 routes successfully.
- Command: `curl -s http://localhost:3000/demo/school/expenses/PC-202512-001`
- Result: HTTP 200 OK with rendered student, recipient, and accounting matrix totals.

## Residual Risk

- None identified. Client-side state transitions guard against cancelling disbursed vouchers, locking default categories, and preventing invalid calculations.
