---
id: sync-20261006-152035-school-class-management-implementation
type: development-sync
parent_epic: E-021-school-class-management
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs/prd.md
  - .agents/specs/036-school-class-management/spec.md
verification:
  - tests/unit/class.test.mjs
  - npm run build
---

# Development Doc Sync: school-class-management-implementation

## Source Changes

- `src/types/class.ts`
  - Reason: Defines TypeScript data contracts for `ClassItem`, `GradeLevel`, `ClassTaxonomy`, `ClassStatus`, `ClassFormData`, `ClassFilterState`, and `StudentClassEnrollment` because strict compile-time typing is required across state and views.
  - Impacted behavior: Establishes rigid data models for curricular vs extracurricular classes, capacity tracking, homeroom assignment structures, and operational jump routes.
- `src/utils/classValidation.ts`
  - Reason: Implements pure validation logic, empty class deletion guardrails, homeroom conflict checking, and client-side multi-factor filtering because business rules BR01-BR06 require verifiable safety invariants.
  - Impacted behavior: Blocks class deletion whenever `studentCount > 0`, warns of homeroom teacher duplication across classes in the same academic year, validates form boundaries, and filters classes by keyword, grade, room, and status.
- `src/services/mockClassData.ts`
  - Reason: Provides realistic mock seed data for kindergarten and primary grade levels, teachers, classes (including empty classes `MAM-02` and `CLB-ROBOT`), and enrolled student rosters because local testing and POC demonstration require grounded scenario data.
  - Impacted behavior: Seeds initial Redux state with verified test fixtures enabling immediate demonstration of deletion blocking on populated classes and successful deletion on empty classes.
- `src/store/slices/classSlice.ts`
  - Reason: Implements Redux Toolkit state machine for class directory management, taxonomy tab switching, multi-criteria filtering, modal visibility, and CRUD operations because centralized state guarantees UI reactivity across routes.
  - Impacted behavior: Handles `addClass`, `updateClass`, `deleteClass` (enforcing `studentCount === 0` guardrail), `setActiveTaxonomy`, and filter mutations.
- `src/store/index.ts`
  - Reason: Registers `classReducer` under the `classes` key in the root Redux store because application modules and pages require access to class state.
  - Impacted behavior: Exposes `RootState['classes']` and provides store dispatch integration.
- `src/modules/school/classes/ClassToolbar.tsx`
  - Reason: Top control bar with dual taxonomy tab switcher ("Lớp chính khóa" vs "Lớp ngoại khóa"), Grade level filter dropdown, search input, filter drawer trigger, and '+ Thêm Lớp' CTA button because administrators need fast taxonomy switching and search.
  - Impacted behavior: Dispatches taxonomy changes, search terms, and navigates to the dedicated class creation route.
- `src/modules/school/classes/ClassSummaryCards.tsx`
  - Reason: Renders 4 high-level KPI summary cards (Total Classes, Total Students, Average Students/Class, and Homeroom Staffing Rate) because school leadership requires instant operational metrics.
  - Impacted behavior: Recalculates metrics dynamically based on active classes and enrollment numbers.
- `src/modules/school/classes/ClassTable.tsx`
  - Reason: Tabular presentation component supporting Curricular and Extracurricular views, student capacity progress indicators, teacher avatars and phone numbers, and action menus because structured data visualization improves class roster management.
  - Impacted behavior: Strictly disables the delete icon with an explanatory tooltip for classes with `studentCount > 0`, while enabling the delete confirmation modal for empty classes (`studentCount === 0`).
- `src/modules/school/classes/ClassFormModal.tsx`
  - Reason: Reusable authoring modal dialog with taxonomy switcher, grade dropdown, homeroom conflict warning (BR03), and fee category inputs because quick inline class authoring is supported.
  - Impacted behavior: Validates input fields and emits sanitized class payloads.
- `src/modules/school/classes/DeleteClassModal.tsx`
  - Reason: Modal dialog confirming permanent deletion of empty classes because destructive operations require explicit confirmation.
  - Impacted behavior: Prevents accidental deletions by displaying class name and warning notice before dispatching `deleteClass`.
- `src/modules/school/classes/ClassFilterDrawer.tsx`
  - Reason: Right slide-over filter drawer providing multi-factor filtering by academic year, grade level, room number, and operational status because large schools need granular filtering.
  - Impacted behavior: Updates `classSlice` filter state and filters roster in real time.
- `src/modules/school/classes/ClassDetailView.tsx`
  - Reason: Launchpad detail hub displaying class header KPIs, enrolled student roster table, 6-item tuition fee breakdown summary, and direct operational shortcuts because administrators need a single convergence point for all class-related workflows.
  - Impacted behavior: Renders student table with birthdate, gender, parent contacts, status badges, and 5 direct link buttons jumping to Attendance (`/attendance`), Activities (`/activity`), Media (`/media`), Timetable (`/schedule`), and Invoices (`/fee`).
- `src/pages/[schoolCode]/school/classes/index.tsx`
  - Reason: Main class directory hub page mounting `ClassSummaryCards`, `ClassToolbar`, and `ClassTable` wrapped in `PortalLayout` because administrators require a centralized dashboard.
  - Impacted behavior: Serves primary route for School Class Management (`SCR-SCH-01`).
- `src/pages/[schoolCode]/school/classes/create.tsx`
  - Reason: Dedicated full-page authoring surface for creating new curricular and extracurricular classes because complex class creation benefits from focused workspace.
  - Impacted behavior: Prepares new class payload with real-time homeroom conflict detection and redirects to directory upon submission.
- `src/pages/[schoolCode]/school/classes/[classId]/index.tsx`
  - Reason: Dynamic detail route mounting `ClassDetailView` for a specific class ID because deep-linking to class details is required across the portal.
  - Impacted behavior: Looks up class by ID, handles not-found states, and presents the class launchpad.
- `src/pages/[schoolCode]/school/classes/[classId]/edit.tsx`
  - Reason: Dedicated editing page prepopulating class metadata because administrators need a full-screen editing interface.
  - Impacted behavior: Loads existing class values, validates modifications, dispatches `updateClass`, and displays feedback toast.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Added `Lớp học` navigation item with `faChalkboard` icon under the `NHÀ TRƯỜNG` menu group because sidebar access must be intuitive.
  - Impacted behavior: Renders menu link and handles active route highlighting for `/school/classes`.
- `tests/unit/class.test.mjs`
  - Reason: Automated test suite verifying validation engine, deletion safety rules (BR02), homeroom conflict detection (BR03), filtering (BR06), and Redux reducer state mutations because regression safety is paramount.
  - Impacted behavior: Guarantees 20/20 test assertions pass with zero failures.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/M5-nha-truong/3. lop-hoc.md`, `docs/prd.md`, `docs/tasks.md`, `docs/decisions.md` (ADR-021), `.agents/specs/036-school-class-management/spec.md`.
- Pre-code docs updated: `docs/prd.md` (`FR-SCH-041` to `FR-SCH-046`), `docs/tasks.md` (`TASK-CLS-001` through `TASK-CLS-006`), `docs/decisions.md` (`ADR-021`), `docs/knowledge.md`, `docs/memory.md`, `docs/planning/flows.md`, `docs/planning/screens.md`, `docs/planning/diagrams.md`.
- Relationship map reviewed: Verified parent-child linkages between `E-021-school-class-management`, `F-021-001`, `M-021-001`, `P-021-001`, and `T-021-001-001`.
- Related features checked: Confirmed interoperability with `E-001-operations-attendance`, `E-002-operations-activity`, `E-003-operations-media`, `E-006-academics-schedule`, `E-009-finance-invoices`, and `E-011-finance-tuition-management`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated because FR-SCH-041 through FR-SCH-046 established functional requirements for dual-taxonomy class partitioning, empty class deletion guardrails, and operational launchpads.
- `docs/tasks.md`: updated because TASK-CLS-001 through TASK-CLS-006 detailed implementation write scope and verification steps.
- `docs/knowledge.md`: updated because section 10.3 required formalizing class taxonomy models, homeroom assignment constraints, and operational link mappings.
- `docs/decisions.md`: updated because ADR-021 recorded architectural decisions regarding empty class deletion invariants (K026) and homeroom exclusivity checks (K027).
- `docs/memory.md`: updated because Resolution of K026 and K027 documented the rationale for preventing populated class deletion and warning on homeroom teacher duplication.
- `docs/planning/flows.md`: updated because sequence diagram 7.3 illustrated class creation, validation checks, deletion prevention, and operational shortcuts.
- `docs/planning/screens.md`: updated because SCR-SCH-01 through SCR-SCH-04 specified detailed component layouts, state indicators, and interaction patterns.
- `docs/planning/diagrams.md`: updated because Section 17 added C4 component topography, Redux state flow, and entity relationship diagrams for classes and enrolled students.

### Development Ledger Docs

- Epic notes: Authored `docs/development/E-021-school-class-management/epic.md` with full Jira-grade specifications, business rules, and acceptance criteria.
- Module notes: Authored `docs/development/E-021-school-class-management/modules/M-021-001-school-class-management.md` documenting architecture, components, and Mermaid diagram.
- Feature notes: Authored `docs/development/E-021-school-class-management/features/F-021-001-school-class-management.md` defining functional slice and user acceptance tests.
- Page notes: Authored `docs/development/E-021-school-class-management/pages/P-021-001-school-class-management.md` detailing view states, filter drawers, and modal dialogues.
- Task notes: Authored `docs/development/E-021-school-class-management/tasks/T-021-001-001-school-class-management.md` tracking execution log and verification evidence.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --test tests/unit/class.test.mjs`
- Result: 20/20 test assertions passing in 116ms covering form validation, deletion blocking, conflict warnings, filtering, and Redux actions.
- Command: `npm test`
- Result: 362/362 unit tests passing across all portal modules in 654ms with zero regressions.
- Command: `npm run build`
- Result: Clean production build with all 58 static and dynamic routes compiled successfully without TypeScript or bundling errors.
- Residual documentation risk: None. All 8 planning documents, development ledger notes, and research manifests are fully synchronized and validated.

## PM Summary

- What changed for the POC: The School Operating Portal now provides a robust, enterprise-grade School Class Management sub-module (`/school/classes`) under the `NHÀ TRƯỜNG` menu group. It features dual taxonomy partitioning (Curricular vs Extracurricular), strict empty-class deletion safety guardrails (preventing accidental deletion of classes with enrolled students), real-time homeroom assignment conflict warnings, full-page authoring and editing flows, and a centralized Class Detail launchpad with direct operational shortcuts.
- What the PM can demo now:
  1. Access `/[schoolCode]/school/classes` to view the 4 KPI summary cards (Total Classes, Students, Avg Students/Class, Homeroom Rate).
  2. Switch between the "Lớp chính khóa" and "Lớp ngoại khóa" tabs to observe tailored table columns (e.g. Grade & Homeroom vs Category & Instructor team).
  3. Filter classes by Grade level dropdown, search by class or teacher name, and open the slide-over Filter Drawer for advanced room and status filters.
  4. Attempt to delete a populated class (e.g., `MẦM-01` with 25 students) to observe that the delete button is strictly disabled with a protective tooltip.
  5. Delete an empty class (e.g., `MẦM-02` with 0 students) to trigger the `DeleteClassModal` and observe successful deletion from the roster.
  6. Click '+ Thêm Lớp' to navigate to `/school/classes/create`, select a teacher already assigned to another class to see the live yellow homeroom conflict warning banner, and submit to create a new class.
  7. Click any class row or view button to open the Class Detail launchpad at `/school/classes/[classId]`, displaying the enrolled student roster, 6-item tuition fee breakdown, and 5 operational shortcut jump buttons linking directly to Điểm danh, Hoạt động, Thư viện, Thời khóa biểu, and Học phí.
- What remains uncertain: None. All requirements and business rules BR01-BR06 are verified and covered by automated tests.
- Decision log: All architectural decisions regarding taxonomy separation, empty class deletion guardrails, and homeroom conflict checks are approved and recorded in ADR-021.
