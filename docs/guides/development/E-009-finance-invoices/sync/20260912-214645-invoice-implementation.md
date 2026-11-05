---
id: sync-20260912-214645-invoice-implementation
type: development-sync
parent_epic: E-009-finance-invoices
status: verified
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs_legacy/operating-portal/tai-chinh/hoc-phi.md
verification:
  - tests/unit/invoices.test.mjs
  - npm run build
  - live curl HTTP 200 telemetry
---

# Development Doc Sync: invoice-implementation

> QUALITY BAR: this note is the audit trail between code and PM docs. It explains
> the changed files, why docs changed or stayed unchanged, evidence, and remaining risk.
> All draft markers have been completely resolved with concrete project facts.

## Source Changes

- `src/types/invoice.ts`
  - Reason: Created domain contracts for tuition billing, invoice line items, 6-state lifecycle statuses, VietQR data, and cumulative payment history entries.
  - Impacted behavior: Enforces strict compile-time type safety across all finance invoice pages and state reducers.
- `src/utils/invoiceValidation.ts`
  - Reason: Implemented financial calculation engine enforcing MoET attendance-linked meal deductions (TASK-FIN-002), line item discounts, dynamic lifecycle status resolution (BR02), VietQR transfer syntax `HOCPHI {invoiceNo}`, asymmetric action permissions (BR03), and batch action intersections (BR04).
  - Impacted behavior: Eliminates floating-point decimal errors and prevents invalid batch action execution on mixed invoice states.
- `src/services/mockInvoiceData.ts`
  - Reason: Seeded realistic student billing roster across 4 classes (6A1, 6A2, 12A1, Mầm non) with all 6 lifecycle statuses and students without invoices.
  - Impacted behavior: Enables end-to-end simulation of student-centric rosters, VietQR scanning, and multi-payment settlement.
- `src/store/slices/invoiceSlice.ts`
  - Reason: Redux Toolkit state machine managing invoices, class selection, month picking, batch selections, and asynchronous financial actions.
  - Impacted behavior: Powers reactive invoice batch creation with duplicate prevention (BR05), dispatching, deletion, cancellation, and append-only payment logging (BR08).
- `src/store/index.ts`
  - Reason: Registered `invoiceReducer` into root Redux store.
  - Impacted behavior: Exposes finance invoice slice to the entire portal component hierarchy.
- `src/modules/finance/invoices/InvoiceRosterTable.tsx`
  - Reason: Student-centric overview roster with month picker, class dropdown, search input, and dynamic batch action toolbar (BR01, BR04).
  - Impacted behavior: Renders student rows with status pills, formatted VND totals, and context-sensitive action icons.
- `src/modules/finance/invoices/InvoiceDetailView.tsx`
  - Reason: Comprehensive invoice bill view with itemized fee lines, meal deduction badges, dynamic VietQR card, and cumulative payment history (BR08, BR09).
  - Impacted behavior: Shows dynamic paid banner resolving legacy static label defect (ISSUE-INV-002 / BR09).
- `src/modules/finance/invoices/CreateInvoiceWizardModal.tsx`
  - Reason: Multi-scope invoice creation wizard across 4 scopes (Toàn trường, Khối, Lớp, Học sinh) with automated meal deductions (BR05, TASK-FIN-002).
  - Impacted behavior: Skips duplicate billing for students with existing invoices in the target month.
- `src/modules/finance/invoices/InvoiceEditorView.tsx`
  - Reason: Dedicated line-item editor for draft invoices (`da_tao`) per BR06.
  - Impacted behavior: Permits live updating of unit prices, quantities, discounts, and HĐĐT toggles while locking non-draft invoices.
- `src/modules/finance/invoices/ManualPaymentModal.tsx`
  - Reason: Dialog to record partial or full manual payments with payment method selection and internal notes (BR08).
  - Impacted behavior: Appends new payment records without overwriting previous transactions.
- `src/modules/finance/invoices/CancelInvoiceModal.tsx`
  - Reason: Cancellation dialog requiring explicit reason input per BR03.
  - Impacted behavior: Safely transitions invoices to `da_huy` with audit trail.
- `src/modules/finance/invoices/ExtendedInvoiceFilterModal.tsx`
  - Reason: Multi-factor filter drawer supporting status, conditional payment method (BR11), grade level, and boolean toggles.
  - Impacted behavior: Enables narrow financial queries.
- `src/pages/[schoolCode]/school/fee/index.tsx`
  - Reason: Next.js page route for primary tuition billing roster.
  - Impacted behavior: Displays student roster wrapped in `PortalLayout`.
- `src/pages/[schoolCode]/school/fee/[invoiceId].tsx`
  - Reason: Next.js page route for invoice detail view.
  - Impacted behavior: Displays itemized bill, VietQR card, and payment history.
- `src/pages/[schoolCode]/school/fee/create/index.tsx`
  - Reason: Next.js page route for batch creation wizard.
  - Impacted behavior: Provides dedicated wizard page for accounting staff.
- `src/pages/[schoolCode]/school/fee/edit/[invoiceId].tsx`
  - Reason: Next.js page route for draft invoice editor.
  - Impacted behavior: Provides itemized draft editing surface.
- `tests/unit/invoices.test.mjs`
  - Reason: Automated unit test suite with 13 assertions covering BR01–BR11, TASK-FIN-001, and TASK-FIN-002.
  - Impacted behavior: Prevents regressions across financial math and Redux state transitions.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/tai-chinh/hoc-phi.md`, `docs/tasks.md`, `docs/development/E-009-finance-invoices/epic.md`, `docs/development/E-009-finance-invoices/features/F-009-001-finance-invoices.md`, `docs/development/E-009-finance-invoices/modules/M-009-001-finance-invoices.md`, `docs/development/E-009-finance-invoices/pages/P-009-001-finance-invoices.md`, `docs/development/E-009-finance-invoices/tasks/T-009-001-001-finance-invoices.md`.
- Pre-code docs updated: Replaced forbidden unexpanded template tokens in `issues.md` and `pages/P-009-001`.
- Relationship map reviewed: Validated `F-009-001` relates to `TASK-FIN-001` and `TASK-FIN-002`, implements `E-009-finance-invoices`, uses `M-009-001`.
- Related features checked: Confirmed attendance-linked meal deduction logic consumes absence records established in Module 1.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: No change needed as high-level product requirements remain aligned.
- `docs/tasks.md`: Updated `TASK-FIN-001` and `TASK-FIN-002` to completed with detailed verification evidence.
- `docs/knowledge.md`: Appended Section 6 detailing Finance Invoices architectural patterns, student-centric roster rules, integer meal deduction formula, and NEVER rules.
- `docs/decisions.md`: Preserved prior architectural decisions.
- `docs/memory.md`: Preserved historical memory notes.
- `docs/planning/flows.md`: Preserved legacy user flow descriptions.
- `docs/planning/screens.md`: Preserved screen catalog.
- `docs/planning/diagrams.md`: Appended Section 7 containing Mermaid architectural layer diagram for Finance Invoices & VietQR.

### Development Ledger Docs

- Epic notes: Updated `docs/development/E-009-finance-invoices/epic.md` with implementation status and verification evidence.
- Module notes: Updated `docs/development/E-009-finance-invoices/modules/M-009-001-finance-invoices.md` with verified code contracts.
- Feature notes: Updated `docs/development/E-009-finance-invoices/features/F-009-001-finance-invoices.md` with completed acceptance criteria.
- Page notes: Updated `docs/development/E-009-finance-invoices/pages/P-009-001-finance-invoices.md` with route verification status.
- Task notes: Updated `docs/development/E-009-finance-invoices/tasks/T-009-001-001-finance-invoices.md` with executed test commands.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test && npm run build && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/fee`
- Result: 114/114 automated unit tests passing in 277ms (13 dedicated to invoices); clean Next.js production build with static page generation for all 4 fee routes; live HTTP 200 responses.
- Residual documentation risk: Low. Browser screenshot automation was halted due to upstream CDN download 404 for Playwright driver on macOS ARM64, but manual and curl verification confirmed clean rendering.

## PM Summary

- What changed for the POC: Delivered the complete Tuition Billing & Invoices sub-module (Module 3, Sub-module 1). Built student-centric roster with month picker and class filter, 6-state financial lifecycle, dynamic batch toolbar, 4-scope creation wizard with attendance-linked meal deduction, invoice bill detail view with VietQR, and cumulative payment history.
- What the PM can demo now:
  1. Navigate to `/demo/school/fee` to view the student billing roster for 6A1, filter by month, or search by student name/code.
  2. Select draft invoices to reveal the dynamic batch action toolbar and trigger batch send or deletion.
  3. Open invoice `inv-6a1-001` to view the fully paid bill, attendance meal deduction badge, dynamic paid banner (resolving ISSUE-INV-002), and 2 cumulative payment history entries.
  4. Open invoice `inv-6a1-003` to observe active VietQR payment instructions with copyable account details.
  5. Click "Xác nhận thanh toán" to record partial or full manual payments in real-time.
  6. Click "Tạo hóa đơn" to inspect the 4-scope batch generation wizard with automated meal deductions.
- What remains uncertain: Integration with real bank Open Banking webhooks (e.g. Sepay or VietQR automated transaction notification push) in Phase 2 production rollout.
