---
id: sync-20260913-084024-finance-tuition-management-implementation
type: development-sync
parent_epic: E-011-finance-tuition-management
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs/planning/diagrams.md
  - docs_legacy/operating-portal/tai-chinh/quan-ly-hoc-phi.md
verification:
  - tests/unit/tuitionManagement.test.mjs
---

# Development Doc Sync: finance-tuition-management-implementation

## Source Changes

- `src/types/tuitionManagement.ts`
  - Reason: Defines TypeScript domain contracts for class fee schedules, student-by-fee matrix cells, batch update payloads, and filter criteria.
  - Impacted behavior: Establishes type safety across state slices, validation utilities, and UI table components.
- `src/utils/tuitionManagementValidation.ts`
  - Reason: Encapsulates pure business rules for price divergence hints (BR04), unassigned fee deduplication (BR06), active student count arithmetic (BR03), and batch update validation (BR05).
  - Impacted behavior: Powers in-cell green hints, column header counters, and modal submission validation without side effects.
- `src/services/mockTuitionManagementData.ts`
  - Reason: Provides mock data for 12 configured classes and class 12A1 2D matrix with 4 students and 9 fees.
  - Impacted behavior: Enables realistic offline demonstration with Nguyen Nguyen Thu's tuition override and STEAM assignment.
- `src/store/slices/tuitionManagementSlice.ts`
  - Reason: Manages client-side Redux state for class schedules, matrix cell overrides, optional fee toggles, batch updates, add fee modal, and unsaved changes dirty state.
  - Impacted behavior: Supports optimistic instant updates and triggers the persistent unsaved changes banner.
- `src/store/index.ts`
  - Reason: Registers `tuitionManagementReducer` into the root application store.
  - Impacted behavior: Exposes tuition management state to all components and pages.
- `src/modules/finance/tuition/ClassFeeScheduleTable.tsx`
  - Reason: Overview table component for class fee schedules with search, grade filter, fee summaries, and dual action icons.
  - Impacted behavior: Enables accountants to inspect class fee configurations and navigate to either matrix view or filtered invoices.
- `src/modules/finance/tuition/ClassFeeMatrixTable.tsx`
  - Reason: High-performance 2D matrix component displaying enrolled students by assigned fee items with mandatory inputs, optional toggles, green hints, and unsaved banner.
  - Impacted behavior: Delivers the core interaction surface for per-student fee overrides and optional service enrollment.
- `src/modules/finance/tuition/BatchUpdateFeeModal.tsx`
  - Reason: Column-wide batch fee update dialog triggered by column header pencil icon.
  - Impacted behavior: Allows adjusting fees for the entire class or tagged students with disabled controls on empty selection.
- `src/modules/finance/tuition/AddClassFeeModal.tsx`
  - Reason: Dialog for attaching new fee items from the master catalog into a class.
  - Impacted behavior: Strictly deduplicates master catalog items, showing only unassigned fees for the target class.
- `src/pages/[schoolCode]/school/tuition-management/index.tsx`
  - Reason: Primary overview route mounted under `PortalLayout`.
  - Impacted behavior: Renders the class fee schedule roster at `/[schoolCode]/school/tuition-management`.
- `src/pages/[schoolCode]/school/tuition-management/[classId].tsx`
  - Reason: Detail matrix route mounted under `PortalLayout`.
  - Impacted behavior: Renders the 2D student fee matrix at `/[schoolCode]/school/tuition-management/[classId]`.
- `tests/unit/tuitionManagement.test.mjs`
  - Reason: Automated unit test suite asserting BR01 through BR10.
  - Impacted behavior: Guarantees zero regression and 100% adherence to legacy specifications.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/tai-chinh/quan-ly-hoc-phi.md`, `docs/tasks.md`, `docs/prd.md`, `docs/development/E-010-finance-fee-catalog/epic.md`.
- Pre-code docs updated: `docs/development/E-011-finance-tuition-management/epic.md`, `issues.md`, `features/F-011-001`, `modules/M-011-001`, `pages/P-011-001`, `tasks/T-011-001-001`, `docs/development/development_manifest.json`, `docs/development/index.md`.
- Relationship map reviewed: Verified relationships `IMPLEMENTS TASK-FIN-003`, `DEPENDS_ON E-010-finance-fee-catalog`, `ENABLES E-009-finance-invoices`.
- Related features checked: Confirmed that student Nguyen Nguyen Thu in Class 12A1 matches the STEAM assignment from `E-010-finance-fee-catalog` and that Action Icon 2 routes directly to `E-009-finance-invoices` with `?classId=12A1`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: No change needed; PRD already covers Module 3: Tài Chính high-level requirements.
- `docs/tasks.md`: Updated `TASK-FIN-003` write scope and verification evidence to include tuition management contracts, validation, and test suite.
- `docs/knowledge.md`: No change needed; knowledge architecture remains consistent.
- `docs/decisions.md`: No change needed; architecture decisions remain aligned.
- `docs/memory.md`: No change needed; covered in session history.
- `docs/planning/flows.md`: No change needed; flow covered in diagrams.
- `docs/planning/screens.md`: No change needed; screens cataloged in P-011-001.
- `docs/planning/diagrams.md`: Updated Section 9 to append the complete Tuition Management 2D Matrix & Class Fee Schedule Architecture diagram.

### Development Ledger Docs

- Epic notes: `docs/development/E-011-finance-tuition-management/epic.md` authored and validated.
- Module notes: `docs/development/E-011-finance-tuition-management/modules/M-011-001-finance-tuition-management.md` authored and validated.
- Feature notes: `docs/development/E-011-finance-tuition-management/features/F-011-001-finance-tuition-management.md` authored and validated.
- Page notes: `docs/development/E-011-finance-tuition-management/pages/P-011-001-finance-tuition-management.md` authored and validated.
- Task notes: `docs/development/E-011-finance-tuition-management/tasks/T-011-001-001-finance-tuition-management.md` authored and validated.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test` and `node --test tests/unit/tuitionManagement.test.mjs`
- Result: 140/140 tests passing across all 11 sub-modules in 240ms.
- Command: `npm run build`
- Result: Clean Next.js Pages router build generating static HTML routes.
- Command: `curl -s http://localhost:3000/demo/school/tuition-management` & `curl -s http://localhost:3000/demo/school/tuition-management/12A1`
- Result: HTTP 200 response with rendered student names, cells, toggles, and green hints.
- Residual documentation risk: None. All acceptance criteria and quality gates verified.

## PM Summary

- What changed for the POC: Built the complete Class Fee Schedule & 2D Student Fee Matrix sub-module (`/school/tuition-management` and `/[classId]`).
- What the PM can demo now:
  1. Navigate to `/demo/school/tuition-management` to see 12 configured classes across grade levels with fee summaries and two distinct action navigation icons.
  2. Click action icon 2 (invoice document) to verify immediate jump to `/demo/school/fee?classId=12A1`.
  3. Click action icon 1 (`$`) to enter the 2D student fee matrix for Class 12A1.
  4. Observe Nguyen Nguyen Thu's tuition override with green hint `"Phí mặc định: 5.000.000 Đ/Tháng"`.
  5. Toggle optional fees like STEAM with instant active student count increments `(N Học sinh)`.
  6. Click column header pencil icon to open the batch update modal and apply adjustments to tagged students.
  7. Observe the floating bottom unsaved changes banner with Save and Discard actions.
- What remains uncertain: None. All requirements from legacy specification `quan-ly-hoc-phi.md` (BR01 through BR10) are fully satisfied and verified.
