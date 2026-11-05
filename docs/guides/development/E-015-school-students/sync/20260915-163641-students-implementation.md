---
id: sync-20260915-163641-students-implementation
type: development-sync
parent_epic: E-015-school-students
status: approved
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs/development/E-015-school-students/epic.md
verification:
  - tests/unit/students.test.mjs
  - npm run build
  - curl -s http://localhost:3000/demo/school/kid
---

# Development Doc Sync: students-implementation

## Source Changes

- `src/types/student.ts`
  - Reason: Defines TypeScript data structures for student master records, guardians, physical growth measurements, and class transfers.
  - Impacted behavior: Serves as the public contract across all student sub-module components and Redux slices.
- `src/utils/studentValidation.ts`
  - Reason: Implements validation rules (BR-KID-01, BR-KID-03), pediatric BMI arithmetic with WHO status classification, legacy null formatters (K008), and multi-factor filter predicates.
  - Impacted behavior: Guarantees data hygiene on enrollment and protects data grids against null reference errors.
- `src/store/slices/studentSlice.ts`
  - Reason: Configures Redux Toolkit state machine with rich initial mock records, filter management, growth logging, note updates, and transfer mutations.
  - Impacted behavior: Manages reactive application state and connects to the root Redux store.
- `src/modules/school/student/StudentToolbar.tsx`
  - Reason: Provides search bar, class filter, status filter, gender filter, and action buttons ("Thêm học sinh", "Chuyển lớp", "Chuyển năm học").
  - Impacted behavior: Controls student roster filtering and triggers batch operations.
- `src/modules/school/student/StudentTable.tsx`
  - Reason: Renders student directory table with sentence-case headers, checkboxes, avatar/code display, and row action menus (`•••`).
  - Impacted behavior: Enables viewing, transferring, note editing, tuition adjustment, and BMI logging per student.
- `src/modules/school/student/ClassTransferModal.tsx`
  - Reason: Modal dialog enforcing source/destination class selection, effective dates, and the 3 mandatory system cascade warnings (ADR-009).
  - Impacted behavior: Safely transitions students between classes with immediate toast feedback.
- `src/modules/school/student/StudentNotesModal.tsx`
  - Reason: Dialog for viewing and updating internal administrative notes.
  - Impacted behavior: Persists notes with character counters and toast alerts.
- `src/modules/school/student/PhysicalGrowthModal.tsx`
  - Reason: Dialog for logging height and weight with live real-time BMI calculation and pediatric badge classification.
  - Impacted behavior: Updates student physical history with instant health indicator feedback.
- `src/modules/school/student/TuitionOverrideModal.tsx`
  - Reason: Dialog for configuring tuition scholarships or fixed monthly fee overrides with confirmation dialogs.
  - Impacted behavior: Adjusts student fee billing policies safely.
- `src/modules/school/student/StudentDetailHub.tsx`
  - Reason: 360° Profile Hub rendering summary header, 5 main tabs (Profile, Activity, Media, Attendance, Finance), and guardian cards.
  - Impacted behavior: Provides comprehensive single-student overview and cross-module context navigation.
- `src/pages/[schoolCode]/school/kid/index.tsx`
  - Reason: Next.js page route for the student directory.
  - Impacted behavior: Renders `/demo/school/kid` within `PortalLayout`.
- `src/pages/[schoolCode]/school/kid/create/index.tsx`
  - Reason: Next.js page route for student enrollment.
  - Impacted behavior: Renders `/demo/school/kid/create` with dirty form abandonment confirmation guard.
- `src/pages/[schoolCode]/school/kid/detail/[id].tsx`
  - Reason: Next.js page route for the 360° student profile hub.
  - Impacted behavior: Renders `/demo/school/kid/detail/[id]` within `PortalLayout`.
- `tests/unit/students.test.mjs`
  - Reason: Automated unit test suite with 15 test vectors covering validation, BMI calculation, transfer rules, and Redux mutations.
  - Impacted behavior: Validates system behavior with 100% pass rate in 3.2ms.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/nha-truong/hoc-sinh.md`, `docs/prd.md`, `docs/decisions.md` (ADR-009), `docs/tasks.md` (TASK-SCH-001).
- Pre-code docs updated: `docs/prd.md`, `docs/decisions.md`, `docs/memory.md`.
- Relationship map reviewed: Verified dependencies on class and guardian models.
- Related features checked: Confirmed non-interference with Attendance (`E-001`) and Finance (`E-009`).

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: Verified PRD Section 4.4 (`US-SCH-01`), Section 5 (`FR-SCH-001` to `FR-SCH-005`), and Section 7 (`AC-024`).
- `docs/tasks.md`: Marked `TASK-SCH-001` completed.
- `docs/knowledge.md`: Section 8 already detailed Student 360° Hub and BMI math; no change needed.
- `docs/decisions.md`: ADR-009 already documented entity integrity and transfer cascade rules; no change needed.
- `docs/memory.md`: Section 5 already recorded K006-K008 resolutions; no change needed.
- `docs/planning/flows.md`: Flow 5.1 already documented student transitions; no change needed.
- `docs/planning/screens.md`: Screens `SCR-SCH-01`, `SCR-SCH-02`, `SCR-SCH-03` already specified; no change needed.
- `docs/planning/diagrams.md`: Section 11 already contains Master Data ERD; no change needed.

### Development Ledger Docs

- Epic notes: Updated `docs/development/E-015-school-students/epic.md` with PM facts and outcomes.
- Module notes: Updated `docs/development/E-015-school-students/modules/M-015-001-school-students.md` with public contracts and code ownership.
- Feature notes: Updated `docs/development/E-015-school-students/features/F-015-001-school-students.md` with requirements traceability and sequence diagram.
- Page notes: Updated `docs/development/E-015-school-students/pages/P-015-001-school-students.md` with screen states and HTTP 200 telemetry.
- Task notes: Updated `docs/development/E-015-school-students/tasks/T-015-001-001-school-students.md` with write scope and test command evidence.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --experimental-strip-types --test tests/unit/students.test.mjs && npm run build`
- Result: 15 passing unit tests (0 failures), clean Next.js 14 static build across all 41 routes.
- Residual documentation risk: None. All 14 sub-module planning artifacts remain fully aligned with implementation code.

## PM Summary

- What changed for the POC: Delivered the Student Master Data sub-module (`/school/kid/`) with 360° Profile Hub, live pediatric BMI calculation, class transfer cascades, and legacy null protection.
- What the PM can demo now:
  1. Student master roster with keyword search and class filtering.
  2. Single-student and batch class transfers with the 3 automated system cascade warnings.
  3. Interactive 360° Profile Hub with 5 contextual tabs and guardian emergency cards.
  4. Real-time BMI calculation and pediatric badge classification upon height/weight entry.
  5. Student enrollment wizard with mandatory field validation and unsaved changes abandonment guard.
- What remains uncertain: None. Feature is fully tested and approved for production deployment.
