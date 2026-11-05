---
id: sync-20260915-134815-action-dropdown-and-fee-redesign
type: development-sync
parent_epic: E-009-finance-invoices
status: verified
owner_skill: benny-frontend-engineer
source_trace:
  - docs/tasks.md
  - docs/prd.md
  - docs/decisions.md
verification:
  - tests/unit/invoices.test.mjs
  - tests/unit/assignment.test.mjs
  - tests/unit/media.test.mjs
  - tests/unit/schedule.test.mjs
---

# Development Doc Sync: action-dropdown-and-fee-redesign

> QUALITY BAR: this note is the audit trail between code and PM docs. It explains the changed files, why docs changed or stayed unchanged, evidence, and remaining risk.

## Source Changes

- `src/types/invoice.ts`
  - Reason: Added `'qr_ecopay'` and `'vi_finviet'` to `PaymentMethod` union type; added `isPaid?: boolean` to `InvoiceLineItem`; added `dateFilterType?: 'createdAt' | 'dueDate'` to `InvoiceFilterCriteria`.
  - Impacted behavior: Allows strict payment method typing and dual date filter mode in the invoice state machine.
- `src/utils/invoiceValidation.ts`
  - Reason: Extended `filterInvoices` logic to support dual-mode date range filtering (`createdAt` vs `dueDate`).
  - Impacted behavior: Correctly filters invoice rosters against either creation date or due date formatted as `DD/MM/YYYY`.
- `src/store/slices/invoiceSlice.ts`
  - Reason: Added `setDateFilterType` reducer action and initialized `dateFilterType: 'createdAt'`.
  - Impacted behavior: Supports dynamic toggling between "Thời gian tạo HĐ" and "Hạn đóng HĐ" in Redux store.
- `src/modules/finance/invoices/ManualPaymentModal.tsx`
  - Reason: Restricted payment methods to strictly 3 allowed channels (`Tiền mặt`, `QR ECOPay`, `Ví Finviet`) and replaced native `alert()` with Redux `addToast`.
  - Impacted behavior: Clean modal interaction triggering standard platform success notification toast upon payment confirmation.
- `src/modules/finance/invoices/InvoiceDetailView.tsx`
  - Reason: Rendered line-item payment status badges under `Thành tiền` (`Đã thanh toán` in green for settled fees, `Chưa thanh toán` in red for unsettled fees).
  - Impacted behavior: Visual clarity per stakeholder Image 2 design specification.
- `src/modules/finance/invoices/InvoiceRosterTable.tsx`
  - Reason: Redesigned time filter toolbar to match Image 1 (composite `"Lọc theo:"` dropdown + single date range popover); converted "Thao tác" column to standardized `•••` action dropdown menu.
  - Impacted behavior: Aligns with platform standard and provides flexible invoice discovery.
- `src/modules/academics/assignment/AssignmentTable.tsx`
  - Reason: Standardized "Thao tác" column button from `Thao tác ▾` text button to `•••` (three dots) action menu button.
  - Impacted behavior: Unified UI aesthetic consistent with `ScheduleTable.tsx`.
- `src/modules/finance/catalog/FeeCatalogTable.tsx`
  - Reason: Converted inline action icon buttons (Eye, Edit, Trash) to standardized `•••` action dropdown menu with `isNearBottom` flip.
  - Impacted behavior: Clean tabular layout without cluttering icon clusters.
- `src/modules/finance/expenses/ExpenseOverviewTable.tsx`
  - Reason: Converted inline action icon buttons (Eye, Check, Ban) to standardized `•••` action dropdown menu with upward flip when near table bottom.
  - Impacted behavior: Consistent table interaction and protection against dropdown clipping.
- `src/modules/finance/tuition/ClassFeeScheduleTable.tsx`
  - Reason: Converted inline action buttons (Dollar, Document) to standardized `•••` action dropdown menu with upward flip.
  - Impacted behavior: Cleaner table columns and standard action discovery.
- `src/modules/finance/reconciliation/ReconciliationSessionTable.tsx`
  - Reason: Converted inline action buttons (Excel export, Detail eye) to standardized `•••` action dropdown menu with upward flip.
  - Impacted behavior: Unified reconciliation actions under standard menu.
- `src/modules/operations/media/AlbumGrid.tsx`
  - Reason: Converted list-view trash icon to standardized `•••` action dropdown menu (`Mở album`, `Xóa album`) with upward flip.
  - Impacted behavior: Consistent album row interaction in list mode.
- `src/pages/[schoolCode]/school/fee/[invoiceId].tsx`
  - Reason: Added `getServerSideProps` to provide `initialInvoiceId` directly during SSR.
  - Impacted behavior: Instant SSR hydration without trailing-slash redirect delays.
- `tests/unit/invoices.test.mjs`
  - Reason: Added unit test cases for `setDateFilterType`, `dueDate` range filtering, and restricted payment methods (`qr_ecopay`, `vi_finviet`).
  - Impacted behavior: Verified 100% test pass rate (198/198 passing across all modules).

## Docs Before Code

- Pre-code docs read: `docs/prd.md`, `docs/decisions.md`, `docs/development/E-009-finance-invoices/tasks/T-009-001-001-finance-invoices.md`, `ScheduleTable.tsx`.
- Pre-code docs updated: `docs/decisions.md` (ADR-007), `docs/prd.md` (AC-020, AC-021), `T-009-001-001-finance-invoices.md`.
- Relationship map reviewed: Verified that `ScheduleTable.tsx` action pattern is the canonical standard across all tabular UI views.
- Related features checked: Confirmed non-breaking changes across assignment, fee catalog, expenses, tuition schedule, reconciliation, and media modules.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: Updated with `AC-020` (Universal "Thao tác" three-dots action dropdown standardization) and `AC-021` (Học Phí time filter composite, manual payment restrictions, and line item payment badges).
- `docs/tasks.md`: Confirmed tasks `TASK-FIN-001` and `TASK-FIN-002` align with updated filter and payment capabilities.
- `docs/knowledge.md`: No change needed; patterns conform to existing state machines.
- `docs/decisions.md`: Appended `ADR-007: Universal Table Action Dropdown Standardization and Invoicing UX Enhancements`.
- `docs/memory.md`: Preserved historical memory.
- `docs/planning/flows.md`: No change needed; user journeys remain aligned.
- `docs/planning/screens.md`: No change needed.
- `docs/planning/diagrams.md`: Preserved existing flow diagrams.

### Development Ledger Docs

- Epic notes: `docs/development/E-009-finance-invoices/epic.md` reviewed.
- Module notes: `docs/development/E-009-finance-invoices/modules/M-009-001-finance-invoices.md` reviewed.
- Feature notes: `docs/development/E-009-finance-invoices/features/F-009-001-finance-invoices.md` reviewed.
- Task notes: `docs/development/E-009-finance-invoices/tasks/T-009-001-001-finance-invoices.md` updated with Work Log and Change Log entries.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test`
- Result: 198 passed, 0 failed across all 14 unit test suites (invoices, assignment, reports, media, schedule, activity, attendance, etc.).
- Command: `npx tsc --noEmit`
- Result: Zero TypeScript compiler errors.
- Residual documentation risk: None. All table actions and invoice workflows strictly conform to user instructions and evidence images.

## PM Summary

- What changed for the POC:
  1. Universal "Thao tác" column standardization across the entire portal: every table row uses a clean `•••` action dropdown menu that opens upward when near the bottom.
  2. "Học phí" invoice roster time filter matches Image 1 with composite `"Lọc theo:"` dropdown (`Thời gian tạo HĐ` vs `Hạn đóng HĐ`) and date range popover.
  3. "Xác nhận thanh toán học phí" modal strictly offers 3 options (`Tiền mặt`, `QR ECOPay`, `Ví Finviet`) and triggers standard success toast.
  4. Detailed invoice view highlights line item payment status badges (`Đã thanh toán` in green vs `Chưa thanh toán` in red, matching Image 2).
- What the PM can demo now:
  - Navigate to `/demo/school/fee/`: observe redesigned filter bar and `•••` action dropdown.
  - Click "Xác nhận thanh toán" from action dropdown: verify 3 payment methods and standard toast feedback.
  - Navigate to `/demo/school/fee/inv-6a1-001/`: observe green `Đã thanh toán` badges on paid line items.
  - Browse `/demo/school/assignment/`, `/demo/school/school-fees/`, `/demo/school/expenses/`, `/demo/school/tuition-management/`, `/demo/school/reconciliation/`: observe identical `•••` action dropdown behavior matching Thời khóa biểu.
- What remains uncertain: None. All requirements fulfilled.

