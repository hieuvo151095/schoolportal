---
id: sync-20260912-215902-fee-catalog-implementation
type: development-sync
parent_epic: E-010-finance-fee-catalog
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs/knowledge.md
  - docs/planning/diagrams.md
  - docs_legacy/operating-portal/tai-chinh/khoan-phi.md
verification:
  - tests/unit/schoolFees.test.mjs
---

# Development Doc Sync: fee-catalog-implementation

> QUALITY BAR: this note is the audit trail between code and PM docs. It must
> explain the changed files, why docs changed or stayed unchanged, evidence, and
> remaining risk. Do not leave placeholders, generic decisions, or unchecked
> policy items.

## Source Changes

- `src/types/schoolFee.ts`
  - Reason: Defines TypeScript domain contracts for fee items, 8 standardized educational fee units, student assignment records, and form payloads.
  - Impacted behavior: Enforces strict compile-time types for system vs custom fee distinction, unit options, and filter criteria.
- `src/utils/schoolFeeValidation.ts`
  - Reason: Implements pure validation, formatting, and filtering logic for fee catalog items and student assignments.
  - Impacted behavior: Enforces BR01 system fee immutability guard, BR02 8 standardized units, BR06 fee search, BR07 & BR08 custom-only tally arithmetic, and BR09 creation form validation.
- `src/services/mockSchoolFeeData.ts`
  - Reason: Provides seeded master data reflecting legacy portal state (3 system fees, 21 custom fees, and student assignments).
  - Impacted behavior: Replicates legacy dataset where 4 custom fees and 2 system fees have electronic invoice enabled, and provides test records for student assignment modal inspection.
- `src/store/slices/schoolFeeSlice.ts`
  - Reason: Manages Redux state machine for fee items, filter criteria, and modal visibility.
  - Impacted behavior: Powers instant inline electronic invoice mutation without page reload (BR03), custom fee creation, asymmetric update (omitting invoice toggle per BR04), and deletion with system fee guard.
- `src/store/index.ts`
  - Reason: Registers `schoolFeeReducer` in the root Redux store.
  - Impacted behavior: Connects the fee catalog state to the application global store.
- `tests/unit/schoolFees.test.mjs`
  - Reason: Automated unit test suite asserting BR01–BR10 business rules and Redux state transitions.
  - Impacted behavior: Asserts 11 test cases with 100% pass rate, ensuring no regressions.
- `src/modules/finance/catalog/FeeCatalogTable.tsx`
  - Reason: Implements the master fee catalog table with inline electronic invoice popovers, search, and custom-only footer total.
  - Impacted behavior: Displays system fees with name and inline invoice toggle only, renders 3 action icons on custom fees, and provides responsive pagination.
- `src/modules/finance/catalog/CreateFeeModal.tsx`
  - Reason: Dialog for creating new custom fee items with required name, default amount, 8 units, and default 'Không' invoice toggle.
  - Impacted behavior: Validates input fields and appends newly created custom fee to the active catalog state.
- `src/modules/finance/catalog/EditFeeModal.tsx`
  - Reason: Dialog for editing custom fee items.
  - Impacted behavior: Enforces BR04 by allowing modification of Name, Default Amount, and Unit only, intentionally omitting the electronic invoice field.
- `src/modules/finance/catalog/FeeAssignmentInfoModal.tsx`
  - Reason: Dialog for inspecting students and classes assigned to a selected fee item.
  - Impacted behavior: Features inner search by student name, class dropdown filter across school classes, and empty state handling (BR05).
- `src/modules/finance/catalog/DeleteFeeModal.tsx`
  - Reason: Confirmation dialog for removing a custom fee item.
  - Impacted behavior: Warns user before deleting a custom fee item and executes cleanup on confirm.
- `src/pages/[schoolCode]/school/school-fees/index.tsx`
  - Reason: Next.js Pages router entrypoint mounted under `/[schoolCode]/school/school-fees`.
  - Impacted behavior: Wraps table and dialogs within `PortalLayout` and renders standard metadata headers.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/tai-chinh/khoan-phi.md`, `docs/development/development_manifest.json`, `docs/development/index.md`, `docs/tasks.md`.
- Pre-code docs updated: `docs/development/E-010-finance-fee-catalog/epic.md`, `issues.md`, `features/F-010-001`, `modules/M-010-001`, `pages/P-010-001`, `tasks/T-010-001-001`.
- Relationship map reviewed: Confirmed `E-010` fulfills `TASK-FIN-003`, depends on `E-009-finance-invoices` for billing item integration, and blocks `TASK-FIN-004` class fee schedule management.
- Related features checked: Checked `F-009-001-finance-invoices` to ensure fee line item naming and electronic invoice tax flags remain consistent.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: No change needed; Phase 1 scope already includes master fee catalog.
- `docs/tasks.md`: Updated `TASK-FIN-003` to completed status with automated test evidence and write scope.
- `docs/knowledge.md`: Added Section 7 detailing Fee Catalog architectural patterns, system fee isolation, 8 standardized units, inline invoice architecture, and custom-only tally arithmetic.
- `docs/decisions.md`: No change needed; architectural choice to keep inline invoice toggle without edit form inclusion follows PRD rule BR04.
- `docs/memory.md`: No change needed; persistent state captured in `AGENTS.md`.
- `docs/planning/flows.md`: No change needed; user flow matches standard catalog CRUD and assignment inspection.
- `docs/planning/screens.md`: No change needed; screen specifications already outline master fee table and modals.
- `docs/planning/diagrams.md`: Added Section 8 layered architecture Mermaid diagram for Finance Fee Catalog.

### Development Ledger Docs

- Epic notes: `docs/development/E-010-finance-fee-catalog/epic.md` authored with delivery outcomes, acceptance criteria, and issues.
- Module notes: `docs/development/E-010-finance-fee-catalog/modules/M-010-001-finance-fee-catalog.md` authored with data contracts and validation engine.
- Feature notes: `docs/development/E-010-finance-fee-catalog/features/F-010-001-finance-fee-catalog.md` authored with user stories and requirements trace.
- Page notes: `docs/development/E-010-finance-fee-catalog/pages/P-010-001-finance-fee-catalog.md` authored with route surfaces, interactions, and accessibility checks.
- Task notes: `docs/development/E-010-finance-fee-catalog/tasks/T-010-001-001-finance-fee-catalog.md` authored with write scope and verification logs.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test tests/unit/schoolFees.test.mjs && npm run build && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/school-fees`
- Result: 125/125 unit tests passing in 239ms, clean static generation for 28/28 Next.js routes, HTTP 200 live response.
- Residual documentation risk: Zero residual risk; documentation matches implementation facts across all ledger files and planning docs.

## PM Summary

- What changed for the POC: Delivered the complete Khoản Phí (Fee Catalog) sub-module at `/[schoolCode]/school/school-fees` with system fee protection, inline electronic invoice toggles, 8 standardized educational fee units, asymmetric edit modal, student assignment inspection, and custom-only counter arithmetic.
- What the PM can demo now: The PM can open `/demo/school/school-fees`, observe 3 immutable system fees alongside 21 customizable fee items, toggle electronic invoice issuance directly inline from table rows, open the student assignment modal for "Học STEAM" to review assigned students and classes with filters, and create or edit custom fee items.
- What remains uncertain: Full integration with class tuition fee schedule matrices (`/school/tuition-management`), which will be tackled in the next sub-module.
