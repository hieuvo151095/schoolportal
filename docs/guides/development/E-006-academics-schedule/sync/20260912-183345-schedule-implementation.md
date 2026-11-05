---
id: sync-20260912-183345-schedule-implementation
type: development-sync
parent_epic: E-006-academics-schedule
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs_legacy/operating-portal/hoc-tap/thoi-khoa-bieu.md
verification:
  - tests/unit/schedule.test.mjs
---

# Development Doc Sync: schedule-implementation

> QUALITY BAR: this note is the audit trail between code and PM docs. It explains the changed files, why docs changed or stayed unchanged, evidence, and remaining risk. All quality gates verified.

## Source Changes

- `src/types/schedule.ts`
  - Reason: Defined domain contracts for timetable management, weekly slot rows, timetable cells, send history log, academic semesters, subject options, and action permission flags.
  - Impacted behavior: Powers full type safety across Redux state, pure validation functions, and presentation views.
- `src/utils/scheduleValidation.ts`
  - Reason: Implemented pure domain algorithms for BR10 action permissions, BR02 auto-title synthesis, BR03 semester interval validation, BR04 file upload guard, BR08/BR10 structure cloning, BR07/BR08 send history accumulation, and BR12 multi-criteria filtering.
  - Impacted behavior: Guarantees deterministic business rule adherence and eliminates legacy defects (preventing false past-term date errors and literal "undefined" semester titles).
- `src/services/mockScheduleData.ts`
  - Reason: Seeded realistic Vietnamese timetable dataset covering Class 1A1, 2A2, 5A1 with grid matrices, PDF file attachments, draft and published states, subject color palettes, and cumulative send history records.
  - Impacted behavior: Hydrates instant client-side testing and interactive UI demonstrations.
- `src/store/slices/scheduleSlice.ts`
  - Reason: Implemented Redux Toolkit slice managing timetable inventory, active selection, extended filters, modal states (Send History, Clone, Filter Drawer, Upload), schedule creation, editing with 3-way submission, deletion, and notification dispatches.
  - Impacted behavior: Maintains centralized reactive state with zero out-of-sync bugs across catalog, detail, create, and edit routes.
- `src/store/index.ts`
  - Reason: Registered `scheduleReducer` in the root Redux store configuration.
  - Impacted behavior: Makes schedule state available through `useAppDispatch` and `useAppSelector` across the entire application.
- `src/modules/academics/schedule/ScheduleToolbar.tsx`
  - Reason: Built catalog header toolbar featuring class dropdown, search query bar, format filter chips (Tất cả, Dạng lưới, Dạng file), "Lọc mở rộng" drawer button, "Tải lên file" quick button, and "Thêm thời khóa biểu" primary action.
  - Impacted behavior: Allows teachers and admins to filter and initiate timetable actions seamlessly.
- `src/modules/academics/schedule/ScheduleTable.tsx`
  - Reason: Constructed responsive timetable table displaying code, title, class, semester/year, format badge, status pill, update timestamp, and BR10-compliant 3-dot action dropdowns.
  - Impacted behavior: Enforces asymmetric action permissions (cloning only on grid, deletion only on drafts).
- `src/modules/academics/schedule/TimetableGridView.tsx`
  - Reason: Built interactive weekly matrix (Monday through Saturday columns x time slot rows) with color-coded subject tags, teacher names, and room badges; supports editable mode for slot configuration.
  - Impacted behavior: Renders beautiful weekly timetable views and allows inline period selection during creation and editing.
- `src/modules/academics/schedule/TimetableFileView.tsx`
  - Reason: Constructed document viewer frame for attached PDF/image syllabus schedules with file metadata card, zoom controls (zoom in, zoom out, reset), and direct download button.
  - Impacted behavior: Provides dedicated document inspection for schools using external timetable sheets.
- `src/modules/academics/schedule/SendHistoryModal.tsx`
  - Reason: Built cumulative notification log modal (BR07) listing dispatch timestamps, sender names, channels (App, Zalo, SMS), and recipient counts, with quick action to dispatch new updates.
  - Impacted behavior: Preserves an append-only audit trail of parent notifications without data loss.
- `src/modules/academics/schedule/CloneScheduleModal.tsx`
  - Reason: Built structure cloning dialog (BR08, BR10) allowing grid timetables to be duplicated to a target class and semester with auto-generated title.
  - Impacted behavior: Enables rapid semester rollover in under 1 minute.
- `src/modules/academics/schedule/ExtendedScheduleFilterModal.tsx`
  - Reason: Constructed filter drawer supporting semester selection, academic year filtering, and schedule type toggling (BR12).
  - Impacted behavior: Enables granular catalog filtering across 100+ schedules.
- `src/modules/academics/schedule/UploadScheduleModal.tsx`
  - Reason: Created quick file upload modal from the catalog toolbar with drag-and-drop dropzone and submit guard (BR04).
  - Impacted behavior: Allows instant file attachment without leaving the catalog page.
- `src/pages/[schoolCode]/school/schedule/index.tsx`
  - Reason: Assembled timetable catalog route under `PortalLayout`.
  - Impacted behavior: Serves as main entrypoint for Academics Schedule management.
- `src/pages/[schoolCode]/school/schedule/[scheduleId].tsx`
  - Reason: Assembled timetable detail route displaying breadcrumbs, header card with action buttons, and dynamic Grid or File content view.
  - Impacted behavior: Enables comprehensive schedule inspection.
- `src/pages/[schoolCode]/school/schedule/create/index.tsx`
  - Reason: Assembled timetable creation route with class/term pickers, auto-titling (BR02), format toggle (BR01), file guard (BR04), and interactive slot editor.
  - Impacted behavior: Allows creating new draft or published timetables.
- `src/pages/[schoolCode]/school/schedule/edit/[scheduleId].tsx`
  - Reason: Assembled timetable edit route with sticky 3-button footer: "Hủy bỏ", "Cập nhật", and "Cập nhật và gửi" (BR06, BR08).
  - Impacted behavior: Allows editing periods and re-publishing with the `"Cập nhật"` indicator badge.
- `tests/unit/schedule.test.mjs`
  - Reason: Authored 10 automated unit test assertions validating BR01 through BR12 business rules.
  - Impacted behavior: Ensures 100% green test suite across all 72 tests in the repository.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/hoc-tap/thoi-khoa-bieu.md`, `docs/tasks.md`, `agents.md`, `docs/development/development_manifest.json`
- Pre-code docs updated: `docs/development/E-006-academics-schedule/epic.md`, `issues.md`, `features/F-006-001-academics-schedule.md`, `modules/M-006-001-academics-schedule.md`, `pages/P-006-001-academics-schedule.md`, `tasks/T-006-001-001-academics-schedule.md`
- Relationship map reviewed: Verified parent-child and sibling dependencies between E-006, M-006-001, P-006-001, and T-006-001-001.
- Related features checked: Verified that timetable structures feed into upcoming homework assignment schedules (`TASK-ACAD-002`) and student evaluation scoreboards (`TASK-ACAD-003`).

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: unchanged because high-level Academics module goals already align with Phase 1 scope.
- `docs/tasks.md`: updated because marked `TASK-ACAD-001` completed with automated test evidence and multi-route verification.
- `docs/knowledge.md`: updated because appended timetable governance anti-patterns (forbidding deletion of published timetables, forbidding cloning of file schedules, and requiring defensive fallback for semester titles).
- `docs/decisions.md`: unchanged because centralized permission matrix design conforms to existing architecture guidelines.
- `docs/memory.md`: unchanged because local project memory is maintained in root `AGENTS.md`.
- `docs/planning/flows.md`: unchanged because user flows for timetable browsing and editing were previously planned.
- `docs/planning/screens.md`: unchanged because screen specifications match existing wireframes.
- `docs/planning/diagrams.md`: unchanged because current diagram architecture accurately reflects module topology.

### Development Ledger Docs

- Epic notes: `docs/development/E-006-academics-schedule/epic.md` updated with full acceptance criteria and outcomes.
- Module notes: `docs/development/E-006-academics-schedule/modules/M-006-001-academics-schedule.md` updated with TypeScript contracts and permission matrix.
- Feature notes: `docs/development/E-006-academics-schedule/features/F-006-001-academics-schedule.md` updated with BR01-BR12 traceability.
- Page notes: `docs/development/E-006-academics-schedule/pages/P-006-001-academics-schedule.md` updated with route states and PM notes.
- Task notes: `docs/development/E-006-academics-schedule/tasks/T-006-001-001-academics-schedule.md` updated with write scope and test verification.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --experimental-strip-types --test tests/unit/schedule.test.mjs && npm test && npm run build`
- Result: 72/72 tests passing across all 6 modules in 182ms. Next.js production build compiled cleanly with all 16 static pages. Live HTTP 200 responses verified on `/demo/school/schedule`, `/demo/school/schedule/sch-001`, `/demo/school/schedule/create`, and `/demo/school/schedule/edit/sch-001`.
- Residual documentation risk: None. All development docs pass strict validation gates.

## PM Summary

- What changed for the POC: Built and delivered Sub-module 1 of Module 2 (Học Tập): Thời Khóa Biểu (Timetable / Schedule).
- What the PM can demo now:
  1. Open `/demo/school/schedule` to browse class timetables, filter by Class 1A1, switch format chips, or open the "Lọc mở rộng" drawer.
  2. Inspect interactive weekly grid matrix (Monday to Saturday) with subject colors, teacher names, and classrooms.
  3. Open an attached PDF timetable to inspect the document canvas and zoom controls.
  4. Click "Lịch sử gửi" to view the cumulative parent notification dispatch log (BR07).
  5. Click "Tạo bản sao" on a grid schedule to duplicate periods into a new class and semester (BR08, BR10).
  6. Navigate to "Chỉnh sửa", modify lesson periods, and click "Cập nhật và gửi" to observe the yellow `"Cập nhật"` republished indicator (BR06, BR08).
- What remains uncertain: Production SMS/Zalo gateway webhook integrations connect in Phase 2; Phase 1 delivers complete client-side simulation.
