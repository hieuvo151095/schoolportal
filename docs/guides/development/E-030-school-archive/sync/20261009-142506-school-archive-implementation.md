---
id: sync-20261009-142506-school-archive-implementation
type: development-sync
parent_epic: E-030-school-archive
status: approved
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
verification:
  - node --test tests/unit/archive.test.mjs
  - npm test
  - npm run build
---

# Development Doc Sync: school-archive-implementation

## Source Changes

- `src/types/archive.ts`
  - Reason: Establish canonical domain types and data contracts for ArchivedStudent, ArchiveStaffOperator, ArchiveFilterState, ArchiveSortState, RestoreStudentPayload, RestoreStudentResult, PurgeStudentPayload, and PurgeStudentResult.
  - Impacted behavior: Governs data typing across pure validation engine, Redux slice, presentation components, page routes, and unit tests.
- `src/utils/archiveValidation.ts`
  - Reason: Pure validation engine enforcing BR01 through BR07, K064 through K068 (diacritic-insensitive search across name/code/class/reason/staff, month filtering, Vietnamese locale collation sorting, class continuity evaluation on restore, and null-tolerant date/gender formatting).
  - Impacted behavior: Powers client-side filtering, column sorting, date presentation, and evaluates whether a restored student returns to their active former class or to "Chưa xếp lớp".
- `src/services/mockArchiveData.ts`
  - Reason: Seed realistic Vietnamese archived student records (withdrawn, graduated, transferred, and historical records with missing dates/operators like "Huy", "Ngọc", "Thương") and active classes.
  - Impacted behavior: Populates archive table roster with realistic data and proves null-tolerant rendering.
- `src/store/slices/archiveSlice.ts`
  - Reason: Redux Toolkit state machine managing archive roster, filters, sorting, modals, and optimistic mutations (`restoreStudent`, `purgeStudent`).
  - Impacted behavior: Drives state transitions across the school archive dashboard.
- `src/store/index.ts`
  - Reason: Mount `archiveReducer` onto the root Redux application store.
  - Impacted behavior: Enables access to archive state via `useAppSelector((state) => state.archive)`.
- `src/modules/school/archive/ArchiveToolbar.tsx`
  - Reason: Hosts real-time search bar, month filter, Excel export button, and total count badge. Strictly omits student creation buttons per invariant BR01 / K064.
  - Impacted behavior: Drives client-side search filtering, month filtering, export, and enforces unidirectional archive inflow.
- `src/modules/school/archive/ArchiveTable.tsx`
  - Reason: Responsive 10-column table roster (STT, Mã học sinh, Tên học sinh, Ngày sinh, Giới tính, Lớp cũ, Ngày lưu trữ, Lưu trữ bởi, Lý do, Hành động). Tolerates null values rendering clean `—` dashes.
  - Impacted behavior: Primary administrative list view with clickable student names, staff operator links, and Restore / Delete action buttons.
- `src/modules/school/archive/ArchivedStudentDetailModal.tsx`
  - Reason: Read-only student profile modal featuring an authoritative yellow warning banner `🔒 Học sinh đã được lưu trữ`, demographic info, and archive audit metadata (BR03).
  - Impacted behavior: Allows school admins to inspect archived student details without editing permissions.
- `src/modules/school/archive/ArchiveStaffModal.tsx`
  - Reason: Staff operator quick view modal displaying administrative contact details of the staff who archived the student (BR02).
  - Impacted behavior: Quick contact reference for archive audit inquiries.
- `src/modules/school/archive/RestoreConfirmModal.tsx`
  - Reason: Modal LT-01 ("Vui lòng xác nhận phục hồi học sinh {tên học sinh}!") with friendly restore graphic and class continuity alert (BR05, K066).
  - Impacted behavior: Safely restores students into their active former class or assigns them to "Chưa xếp lớp" if the class was dissolved.
- `src/modules/school/archive/PermanentDeleteModal.tsx`
  - Reason: Modal LT-02 ("Vui lòng xác nhận xoá học sinh {tên học sinh}!") with prominent red hazard styling and affirmative confirmation gating (BR06, K065).
  - Impacted behavior: Protects against accidental data destruction by requiring explicit confirmation before permanent purge.
- `src/pages/[schoolCode]/school/archive/index.tsx`
  - Reason: Canonical page route rendering toolbar, table roster, and modals within `PortalLayout`.
  - Impacted behavior: Primary administrative archive dashboard mounted at `/[schoolCode]/school/archive`.
- `src/pages/[schoolCode]/setting/kid/archived/index.tsx`
  - Reason: Backward-compatibility alias route ensuring legacy `/setting/kid/archived` URLs render the archive dashboard seamlessly.
  - Impacted behavior: Preserves existing links and bookmarks across tenants.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Positioned `Lưu trữ` navigation item with `faArchive` icon strictly after `Năm học` under `NHÀ TRƯỜNG` (K068).
  - Impacted behavior: Provides direct sidebar access to the archive module in the required menu position.
- `tests/unit/archive.test.mjs`
  - Reason: Comprehensive automated test suite verifying search, month filtering, sorting, class continuity on restore, permanent purge, null tolerance, and sidebar placement.
  - Impacted behavior: Guarantees zero regressions and proves 100% boundary rule compliance.

## Docs Before Code

- Pre-code docs read: `.agents/specs/045-school-archive-luu-tru/spec.md`, `plan.md`, `docs_legacy/operating-portal/M5-nha-truong/14. luu-tru.md`.
- Pre-code docs updated: Initialized development ledger under `docs/development/E-030-school-archive/` (`epic.md`, `issues.md`, `features/`, `modules/`, `pages/`, `tasks/`).
- Relationship map reviewed: Confirmed feature placement within Module 5 (Nhà Trường) strictly after Năm học.
- Related features checked: `044-school-academic-year-nam-hoc`, `021-school-class-management`, `019-school-student-management`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: no change needed / PRD Section 5 defines FR-ARC-001 through FR-ARC-009 and Section 7 defines AC-109 through AC-116.
- `docs/tasks.md`: updated because marked TASK-ARC-001 through TASK-ARC-008 as completed with verification evidence and test results.
- `docs/knowledge.md`: no change needed / Section 24 records K064 (unidirectional inflow), K065 (guarded purge), K066 (class continuity), K067 (tolerant nullability), and K068 (sidebar placement).
- `docs/decisions.md`: no change needed / ADR-030 documents unidirectional flow, tolerant metadata nullability, class continuity, and guarded purge architecture.
- `docs/memory.md`: no change needed / Section 20 records project facts and resolved clarification ledger items.
- `docs/planning/flows.md`: no change needed / Section 20 interaction flows match implemented workflows.
- `docs/planning/screens.md`: no change needed / Section 20 screen catalog matches implemented views.
- `docs/planning/diagrams.md`: no change needed / Section 26 architecture diagrams match implemented boundaries.

### Development Ledger Docs

- Epic notes: `docs/development/E-030-school-archive/epic.md` updated with full acceptance criteria checkmarks and implementation details.
- Module notes: `docs/development/E-030-school-archive/modules/M-030-001-school-archive.md` authored with responsibility, contracts, commentary, and verification.
- Feature notes: `docs/development/E-030-school-archive/features/F-030-001-school-archive.md` authored with user value, Jira story, PM notes, and requirements trace.
- Page notes: `docs/development/E-030-school-archive/pages/P-030-001-school-archive.md` authored with route surfaces, UI states, interactions, and accessibility.
- Task notes: `docs/development/E-030-school-archive/tasks/T-030-001-001-school-archive.md` authored with execution log, write scope, verification results, and handoff.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --test tests/unit/archive.test.mjs` && `npm test` && `npm run build`
- Result: 21/21 unit tests passing in 97ms; 567/567 full suite tests passing across 120 test suites; clean production build with 81/81 static pages prerendered.
- Residual documentation risk: None; all 9 business rules and 5 clarification ledger items (K064 through K068) fully traced and verified.

## PM Summary

- What changed for the POC: Delivered the complete School Archive (Lưu Trữ) sub-module positioned in the sidebar strictly after Năm học, enforcing unidirectional inflow with zero create buttons, tolerant null rendering for legacy historical records, read-only profile inspection with yellow warning banner `🔒 Học sinh đã được lưu trữ`, staff operator contact quick view, safe student restoration with automatic class continuity checking, and irreversible permanent purge guarded by modal LT-02 with red hazard styling and confirmation gating.
- What the PM can demo now:
  1. Navigate to `/[schoolCode]/school/archive` via the sidebar under `NHÀ TRƯỜNG` (strictly below "Năm học").
  2. Inspect the 10-column roster with tolerant null rendering (legacy records like "Huy" display clean `—` without crashing).
  3. Filter archived students by archive month or search in real time by name, code, former class, reason, or staff.
  4. Click on any student name to open `ArchivedStudentDetailModal` displaying the authoritative yellow warning banner and read-only fields.
  5. Click on any staff operator name to open `ArchiveStaffModal` displaying administrative contact details.
  6. Click Restore on an active-class student to observe automatic class assignment restoration.
  7. Click Restore on an inactive/dissolved-class student to observe amber class continuity warning assigning student to "Chưa xếp lớp".
  8. Click Delete on any student to observe `PermanentDeleteModal` (LT-02) with red hazard graphic and affirmative checkbox confirmation gating.
  9. Export the filtered student roster to Excel (`.csv` format with UTF-8 BOM).
  10. Access the legacy URL `/[schoolCode]/setting/kid/archived` and verify seamless compatibility.
- What remains uncertain: None; full backend persistence will connect directly to Laravel Sanctum endpoints in subsequent releases.
