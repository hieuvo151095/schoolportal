---
id: sync-20260915-185150-teachers-implementation
type: development-sync
parent_epic: E-016-school-teachers
status: approved
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs/development/E-016-school-teachers/epic.md
verification:
  - tests/unit/teachers.test.mjs
  - npm run build
  - curl -s http://localhost:3000/demo/school/teacher
---

# Development Doc Sync: teachers-implementation

## Source Changes

- `src/types/teacher.ts`
  - Reason: Defines TypeScript data structures for teacher master records, permission tiers, working statuses, and class assignment payloads.
  - Impacted behavior: Serves as the public contract across all teacher sub-module components and Redux slices.
- `src/utils/teacherValidation.ts`
  - Reason: Implements validation rules (BR03, BR06), two-tier activity moderation permissions (BR01), homeroom conflict detection (Resolution K006), and legacy null formatters (Resolution K008).
  - Impacted behavior: Guarantees data hygiene on onboarding and protects data grids against null reference errors.
- `src/services/mockTeacherData.ts`
  - Reason: Provides rich seed faculty records spanning diverse homerooms, teaching subjects, permission tiers, and legacy profiles.
  - Impacted behavior: Powers the initial in-memory state of the teacher directory.
- `src/store/slices/teacherSlice.ts`
  - Reason: Configures Redux Toolkit state machine managing faculty roster, multi-factor filters, modal states, class assignments, and email changes.
  - Impacted behavior: Manages reactive application state and connects to root Redux store.
- `src/store/index.ts`
  - Reason: Registers `teacherReducer` in global Redux store.
  - Impacted behavior: Exposes `state.teacher` across the entire application.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Adds "Giáo viên" menu item to "NHÀ TRƯỜNG" navigation section.
  - Impacted behavior: Allows one-click navigation to `/[schoolCode]/school/teacher`.
- `src/modules/school/teacher/TeacherToolbar.tsx`
  - Reason: Provides search bar across 5 fields, class filter, permission tier filter, status filter, and "+ Thêm giáo viên mới" button.
  - Impacted behavior: Controls teacher directory filtering and triggers extended filter dialog.
- `src/modules/school/teacher/TeacherTable.tsx`
  - Reason: Renders faculty master table with sentence-case headers, checkboxes, avatar, staff code, homeroom, assigned classes, and `•••` action dropdown menu with upward flip.
  - Impacted behavior: Enables viewing profiles, class assignment, email changing, permission toggling, and deletion.
- `src/modules/school/teacher/AssignClassModal.tsx`
  - Reason: Dialog enforcing homeroom and teaching class assignment with real-time conflict warning banner (Resolution K006).
  - Impacted behavior: Safely assigns classes with immediate toast feedback.
- `src/modules/school/teacher/ChangeEmailModal.tsx`
  - Reason: Dialog for updating faculty login email with read-only current email and regex validation (BR06).
  - Impacted behavior: Modifies login email credentials.
- `src/modules/school/teacher/DeleteTeacherModal.tsx`
  - Reason: Confirmation dialog warning about unassigning classes and removing credentials (BR10).
  - Impacted behavior: Safely removes faculty members with toast feedback.
- `src/modules/school/teacher/ExtendedTeacherFilterModal.tsx`
  - Reason: Advanced filter dialog supporting CSDL Sở GD&ĐT sync criteria (BR09).
  - Impacted behavior: Filters faculty by ministerial CSDL code.
- `src/modules/school/teacher/TeacherDetailView.tsx`
  - Reason: Comprehensive profile view presenting basic info, teaching classes, BR01 content moderation notices, and qualifications.
  - Impacted behavior: Provides comprehensive single-teacher overview.
- `src/pages/[schoolCode]/school/teacher/index.tsx`
  - Reason: Next.js page route for the teacher directory.
  - Impacted behavior: Renders `/demo/school/teacher` within `PortalLayout` with statistical counters.
- `src/pages/[schoolCode]/school/teacher/create/index.tsx`
  - Reason: Next.js page route for teacher onboarding wizard.
  - Impacted behavior: Renders `/demo/school/teacher/create` with dirty form abandonment confirmation guard (Resolution K010).
- `src/pages/[schoolCode]/school/teacher/info/[id].tsx`
  - Reason: Next.js page route for the teacher profile detail.
  - Impacted behavior: Renders `/demo/school/teacher/info/[id]` within `PortalLayout`.
- `tests/unit/teachers.test.mjs`
  - Reason: Automated unit test suite with 29 test vectors covering validation, homeroom conflict detection, email changes, filters, and Redux mutations.
  - Impacted behavior: Validates system behavior with 100% pass rate in 11.6ms.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/nha-truong/giao-vien.md`, `docs/prd.md`, `docs/decisions.md` (ADR-009), `docs/tasks.md` (TASK-SCH-002).
- Pre-code docs updated: `docs/tasks.md`.
- Relationship map reviewed: Verified dependencies on class models and activity moderation queue.
- Related features checked: Confirmed alignment with Activity moderation (`E-002`) and Attendance (`E-001`).

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: Verified PRD Section 4.4 (`US-SCH-02`), Section 5 (`FR-SCH-006` to `FR-SCH-010`), and Section 7 (`AC-025`).
- `docs/tasks.md`: Marked `TASK-SCH-002` completed.
- `docs/knowledge.md`: Faculty directory and homeroom conflict rules aligned; no change needed.
- `docs/decisions.md`: ADR-009 already documented entity integrity and cascade rules; no change needed.
- `docs/memory.md`: Section 5 already recorded K006-K008 resolutions; no change needed.
- `docs/planning/flows.md`: Flow 5.2 already documented teacher assignments; no change needed.
- `docs/planning/screens.md`: Screens `SCR-SCH-06`, `SCR-SCH-07`, `SCR-SCH-08` already specified; no change needed.
- `docs/planning/diagrams.md`: Section 11 already contains Master Data ERD; no change needed.

### Development Ledger Docs

- Epic notes: Updated `docs/development/E-016-school-teachers/epic.md` with PM facts and outcomes.
- Module notes: Updated `docs/development/E-016-school-teachers/modules/M-016-001-school-teachers.md` with public contracts and code ownership.
- Feature notes: Updated `docs/development/E-016-school-teachers/features/F-016-001-school-teachers.md` with requirements traceability and sequence diagram.
- Page notes: Updated `docs/development/E-016-school-teachers/pages/P-016-001-school-teachers.md` with screen states and HTTP 200 telemetry.
- Task notes: Updated `docs/development/E-016-school-teachers/tasks/T-016-001-001-school-teachers.md` with write scope and test command evidence.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --experimental-strip-types --test tests/unit/teachers.test.mjs && npm run build`
- Evidence: 29 unit tests passing in 11.6ms, clean Next.js 14 production build (44/44 static pages), and HTTP 200 responses on all routes.
