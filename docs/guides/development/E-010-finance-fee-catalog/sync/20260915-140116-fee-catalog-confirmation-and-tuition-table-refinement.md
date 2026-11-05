---
id: sync-20260915-140116-fee-catalog-confirmation-and-tuition-table-refinement
type: development-sync
parent_epic: E-010-finance-fee-catalog
status: completed
owner_skill: benny-frontend-engineer
source_trace:
  - docs/tasks.md
  - docs/prd.md
  - docs/decisions.md
verification:
  - npm test
  - npx tsc --noEmit
  - curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/school-fees http://localhost:3000/demo/school/tuition-management
---

# Development Doc Sync: fee-catalog-confirmation-and-tuition-table-refinement

> QUALITY BAR: this note is the audit trail between code and PM docs. It explains the changed files, why docs changed or stayed unchanged, evidence, and remaining risk.

## Source Changes

- `src/types/schoolFee.ts`
  - Reason: Extended fee filter criteria data contracts to support unit-specific filtering and column sorting states.
  - Impacted behavior: Added `unitFilter` and `sortUnit` properties to `FeeFilterCriteria`.
- `src/store/slices/schoolFeeSlice.ts`
  - Reason: Initialized default unit filter and sorting values in Redux fee catalog state.
  - Impacted behavior: Set default `unitFilter: 'all'` and `sortUnit: 'none'` in initial filter criteria state.
- `src/utils/schoolFeeValidation.ts`
  - Reason: Implemented filtering and localized Vietnamese alphabetical sorting on the "Đơn vị" property.
  - Impacted behavior: `filterFeeItems` filters by fee unit and sorts alphabetically ascending or descending.
- `src/modules/finance/catalog/FeeCatalogTable.tsx`
  - Reason: Added unit filter dropdown in toolbar, clickable sort indicator in header, and confirmation modal on Xuất HĐĐT toggle.
  - Impacted behavior: Toggling electronic invoice now requires user confirmation via a modal before mutating state, and dispatches a standard success toast.
- `src/modules/finance/catalog/CreateFeeModal.tsx`
  - Reason: Applied enterprise standard toast notification upon successful fee creation.
  - Impacted behavior: Users receive a green success toast when a fee catalog item is created.
- `src/modules/finance/catalog/EditFeeModal.tsx`
  - Reason: Applied enterprise standard toast notification upon fee update.
  - Impacted behavior: Users receive a green success toast when a fee catalog item is saved.
- `src/modules/finance/catalog/DeleteFeeModal.tsx`
  - Reason: Applied enterprise standard toast notification upon fee deletion.
  - Impacted behavior: Users receive a green success toast when a fee catalog item is deleted.
- `src/modules/finance/tuition/ClassFeeScheduleTable.tsx`
  - Reason: Streamlined tuition management table from 9 to 6 columns by removing redundant columns and replacing fee list with count badge and modal.
  - Impacted behavior: Removed columns `Học phí`, `Tiền ăn`, and `Xuất HĐĐT`; renamed `Các khoản khác` to `Các khoản phí`; added eye icon triggering 3-column fee portfolio modal.
- `src/modules/finance/tuition/AddClassFeeModal.tsx`
  - Reason: Applied enterprise standard toast notification on assigning a fee to a class.
  - Impacted behavior: Users receive a success toast when a fee item is assigned to a class schedule.
- `src/modules/finance/tuition/BatchUpdateFeeModal.tsx`
  - Reason: Applied enterprise standard toast notification on batch-updating class fee amounts.
  - Impacted behavior: Users receive a success toast when batch fee adjustments are submitted.
- `tests/unit/schoolFees.test.mjs`
  - Reason: Added automated verification for fee unit filtering and ascending/descending unit sorting.
  - Impacted behavior: Asserts unit test coverage for new filter and sorting functions.

## Docs Before Code

- Pre-code docs read: `docs/prd.md`, `docs/decisions.md`, `docs_legacy/operating-portal/tai-chinh/khoan-phi.md`, `docs_legacy/operating-portal/tai-chinh/quan-ly-hoc-phi.md`
- Pre-code docs updated: `docs/decisions.md` (ADR-008), `docs/prd.md` (AC-022, AC-023), `docs/tasks.md` (TASK-FIN-003)
- Relationship map reviewed: `E-010-finance-fee-catalog` establishes master fee catalog items; `E-011-finance-tuition-management` consumes fee items for class schedules.
- Related features checked: `F-010-001-finance-fee-catalog`, `F-011-001-finance-tuition-management`, `F-009-001-finance-invoicing`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated with AC-022 (fee catalog confirmation pop-up on invoice toggle and unit filtering/sorting) and AC-023 (streamlined class fee table and 3-column fee portfolio modal).
- `docs/tasks.md`: updated TASK-FIN-003 verification text with confirmation modal, unit filter/sort, and 6-column tuition schedule table.
- `docs/knowledge.md`: no change needed because fee calculation formulas and data schemas remain backward-compatible.
- `docs/decisions.md`: updated with ADR-008 formalizing universal logic change confirmation pop-ups, toast feedback standard, and class fee schedule simplification.
- `docs/memory.md`: no change needed because architectural memory log is updated natively in root AGENTS.md.
- `docs/planning/flows.md`: no change needed because user interaction journeys flow along existing routing paths.
- `docs/planning/screens.md`: no change needed because screen routes remain identical with streamlined column layouts.
- `docs/planning/diagrams.md`: no change needed because module boundary topology remains consistent.

### Development Ledger Docs

- Epic notes: `docs/development/E-010-finance-fee-catalog/epic.md`, `docs/development/E-011-finance-tuition-management/epic.md`
- Module notes: `docs/development/E-010-finance-fee-catalog/modules/M-010-001-finance-fee-catalog.md`, `docs/development/E-011-finance-tuition-management/modules/M-011-001-finance-tuition-management.md`
- Feature notes: `docs/development/E-010-finance-fee-catalog/features/F-010-001-finance-fee-catalog.md`, `docs/development/E-011-finance-tuition-management/features/F-011-001-finance-tuition-management.md`
- Page notes: `docs/development/E-010-finance-fee-catalog/pages/P-010-001-finance-fee-catalog.md`, `docs/development/E-011-finance-tuition-management/pages/P-011-001-finance-tuition-management.md`
- Task notes: `docs/development/E-010-finance-fee-catalog/tasks/T-010-001-001-finance-fee-catalog.md`, `docs/development/E-011-finance-tuition-management/tasks/T-011-001-001-finance-tuition-management.md`

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test && npx tsc --noEmit && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/school-fees http://localhost:3000/demo/school/tuition-management`
- Result: 199/199 automated unit tests passing across all 14 test suites in 368ms, zero TypeScript compilation errors, and HTTP 200 telemetry on both routes.
- Residual documentation risk: None. All legacy and development ledger documents are strictly aligned with code implementation.

## PM Summary

- What changed for the POC: Electronic invoice toggling in fee catalog now presents an explicit confirmation dialog before committing; unit filtering and interactive column sorting are added; tuition management table has been simplified from 9 to 6 columns with a dedicated 3-column fee portfolio modal (`Tên khoản phí`, `Số tiền`, `Xuất HĐĐT`); standardized logic-change confirmation dialogs and feedback toasts applied across both modules.
- What the PM can demo now: Click "Xuất HĐĐT" to see the confirmation dialog, filter/sort by "Đơn vị", and in "Quản lý học phí" click the eye icon next to the fee count badge to view the itemized fee portfolio modal.
- What remains uncertain: None. All business rules and UI requirements are verified by automated tests and browser telemetry.
