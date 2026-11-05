---
id: sync-20261007-090116-school-subject-management-implementation
type: development-sync
parent_epic: E-022-school-subject-management
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs/prd.md
  - docs_legacy/operating-portal/M5-nha-truong/4. mon-hoc.md
verification:
  - tests/unit/subject.test.mjs
  - npm run build
---

# Development Doc Sync: school-subject-management-implementation

## Source Changes

- `src/types/subject.ts`
  - Reason: Defines TypeScript data contracts for `EducationStage`, `SubjectClassification`, `SubjectType`, `EvaluationType`, `TermEvaluationMatrix`, `SubjectTeacherAssignment`, `SchoolSubject`, `SubjectFilterState`, `SubjectSummaryKPI`, and mutation payloads because strong type checking is required across state and UI.
  - Impacted behavior: Establishes rigid data models for 4-stage educational partitioning, MoET standard subject protection flags, 4-term evaluation matrices, and teacher assignment rosters.
- `src/utils/subjectValidation.ts`
  - Reason: Implements pure validation logic, Vietnamese accent-insensitive text normalization, client-side filtering, unassigned teacher filtering, summary KPI calculation, and deletion guardrails because business rules BR01-BR11 require verifiable pure domain logic.
  - Impacted behavior: Normalizes search queries, filters subjects by stage/grade/classification/type, strictly isolates unassigned teachers, calculates metric counters, and blocks deletion of standard MoET subjects.
- `src/services/mockSubjectData.ts`
  - Reason: Provides realistic mock seed data for standard MoET 2018 General Education Program subjects across Tiểu học (12 subjects), THCS (12 subjects), THPT (13 subjects), and GDTX (6 subjects) with authentic circular-based evaluation matrices and teacher assignments because testing and demonstration require realistic educational fixtures.
  - Impacted behavior: Seeds initial Redux state with verified curriculum fixtures across all 4 stages, enabling immediate validation of assessment matrices and teacher rosters.
- `src/store/slices/subjectSlice.ts`
  - Reason: Implements Redux Toolkit state machine for stage tab switching, academic year selection, search queries, drawer/modal view states, and teacher assignment/unassignment actions because predictable unidirectional state flow prevents view desynchronization.
  - Impacted behavior: Handles `assignTeacherToSubject`, `unassignTeacherFromSubject`, `setActiveStage`, `setSearchQuery`, `setGradeFilter`, and modal view toggles.
- `src/modules/school/subjects/SubjectToolbar.tsx`
  - Reason: Top control bar with 4 stage tabs ("Tiểu học (TH)", "THCS", "THPT", "GDTX"), Academic Year dropdown, Grade dropdown filter, and search input because administrators need fast stage switching and filtering.
  - Impacted behavior: Dispatches active stage changes, academic year selections, grade filters, and search queries.
- `src/modules/school/subjects/SubjectSummaryCards.tsx`
  - Reason: Renders 4 high-level KPI summary cards (Tổng số môn, Môn tính điểm, Môn nhận xét, Giáo viên phân công) because school leadership requires instant curriculum overview.
  - Impacted behavior: Recalculates metrics dynamically based on active stage subjects and teacher assignments.
- `src/modules/school/subjects/SubjectTable.tsx`
  - Reason: Tabular directory component displaying subject code, name, classification badge, type badge, applicable grades, GPA status, teacher avatar chips (up to 3 + N remainder badge), and action buttons because structured data visualization is essential.
  - Impacted behavior: Renders catalog rows, opens detail drawer on click, and triggers assign teacher modal.
- `src/modules/school/subjects/SubjectDetailDrawer.tsx`
  - Reason: Slide-over drawer presenting comprehensive subject metadata, full assigned teacher roster, and read-only 4-term assessment matrix because detailed curriculum inspection is required.
  - Impacted behavior: Displays evaluation types (Score, Level, Comment, Score & Comment) for all 4 terms and provides unassign actions for assigned teachers.
- `src/modules/school/subjects/AssignTeacherModal.tsx`
  - Reason: Searchable teacher picker listing only unassigned teachers for the subject because administrators must not double-assign teachers.
  - Impacted behavior: Filters teachers in real time and dispatches `assignTeacherToSubject` with feedback notification.
- `src/modules/school/subjects/UnassignTeacherModal.tsx`
  - Reason: Warning confirmation modal displaying teacher name, subject name, class count, and reassures historical scoreboard data preservation because accidental unassignments must be prevented.
  - Impacted behavior: Confirms destructive unassignment and dispatches `unassignTeacherFromSubject`.
- `src/pages/[schoolCode]/school/subjects/index.tsx`
  - Reason: Main subject directory page mounting `SubjectSummaryCards`, `SubjectToolbar`, `SubjectTable`, `SubjectDetailDrawer`, and modals wrapped in `PortalLayout` because administrators need a central console.
  - Impacted behavior: Serves primary route for School Subject Management (`SCR-SUB-01`).
- `tests/unit/subject.test.mjs`
  - Reason: Automated test suite verifying validation engine, catalog protection rules (BR06), unassigned teacher filtering (BR09), unassignment confirmation (BR10), accent-insensitive search (BR05), and 4-term assessment matrices (BR08) because regression safety is paramount.
  - Impacted behavior: Guarantees 21/21 test assertions pass with zero failures.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/M5-nha-truong/4. mon-hoc.md`, `docs/prd.md`, `docs/tasks.md`, `docs/decisions.md` (ADR-022), `.agents/specs/037-school-subject-management-mon-hoc/spec.md`.
- Pre-code docs updated: `docs/prd.md` (`FR-SCH-047` to `FR-SCH-052`), `docs/tasks.md` (`TASK-SUB-001` through `TASK-SUB-006`), `docs/decisions.md` (`ADR-022`), `docs/knowledge.md`, `docs/memory.md`, `docs/planning/flows.md`, `docs/planning/screens.md`, `docs/planning/diagrams.md`.
- Relationship map reviewed: Verified parent-child linkages between `E-022-school-subject-management`, `F-022-001`, `M-022-001`, `P-022-001`, and `T-022-001-001`.
- Related features checked: Confirmed interoperability with `E-016-school-teacher`, `E-006-academics-schedule`, and `E-008-academics-gradebook`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated because FR-SCH-047 through FR-SCH-052 established functional requirements for 4-stage educational partitioning, MoET curriculum protection, and teacher allocation governance.
- `docs/tasks.md`: updated because TASK-SUB-001 through TASK-SUB-006 detailed implementation write scope and verification steps.
- `docs/knowledge.md`: updated because section 10.4 formalized subject data contracts, 4-term assessment matrices, and teacher assignment schemas.
- `docs/decisions.md`: updated because ADR-022 recorded architectural decisions regarding MoET 2018 curriculum protection (K029) and unassigned-only teacher allocation (K032).
- `docs/memory.md`: updated because Resolution of K029 and K032 documented the rationale for protecting statutory subjects and guarding teacher unassignments.
- `docs/planning/flows.md`: updated because sequence diagram 7.4 illustrated stage switching, search, detail inspection, teacher assignment, and unassignment confirmation flows.
- `docs/planning/screens.md`: updated because SCR-SUB-01 through SCR-SUB-04 specified detailed component layouts, state indicators, and interaction patterns.
- `docs/planning/diagrams.md`: updated because Section 18 added component topography, Redux state flow, and entity relationship diagrams for subjects and teacher assignments.

### Development Ledger Docs

- Epic notes: Authored `docs/development/E-022-school-subject-management/epic.md` with full Jira-grade specifications, business rules, and acceptance criteria.
- Module notes: Authored `docs/development/E-022-school-subject-management/modules/M-022-001-school-subject-management.md` documenting architecture, components, and Mermaid diagram.
- Feature notes: Authored `docs/development/E-022-school-subject-management/features/F-022-001-school-subject-management.md` defining functional slice and user acceptance tests.
- Page notes: Authored `docs/development/E-022-school-subject-management/pages/P-022-001-school-subject-management.md` detailing view states, drawers, and modal dialogues.
- Task notes: Authored `docs/development/E-022-school-subject-management/tasks/T-022-001-001-school-subject-management.md` tracking execution log and verification evidence.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --test tests/unit/subject.test.mjs`
- Result: 21/21 test assertions passing in 90ms covering stage partitioning, MoET protection, accent-insensitive search, teacher dropdown filtering, and unassignment confirmation.
- Command: `npm test`
- Result: 385/385 unit tests passing across all portal modules in 656ms with zero regressions.
- Command: `npm run build`
- Result: Clean production build with all 59 static and dynamic routes compiled successfully without TypeScript or bundling errors.
- Residual documentation risk: None. All 8 planning documents, development ledger notes, and research manifests are fully synchronized and validated.

## PM Summary

- What changed for the POC: The School Operating Portal now provides a dedicated School Subject Management sub-module (`/school/subjects`) under the `NHÀ TRƯỜNG` menu group. It features 4-stage educational partitioning (Tiểu học, THCS, THPT, GDTX), standardized MoET 2018 General Education Program curriculum protections, read-only 4-term assessment matrix inspection, unassigned-only teacher allocation, and safe unassignment confirmation guardrails.
- What the PM can demo now:
  1. Access `/[schoolCode]/school/subjects` to view the 4 KPI summary cards (Tổng số môn, Môn tính điểm, Môn nhận xét, Giáo viên phân công).
  2. Switch between the 4 stage tabs ("Tiểu học (TH)", "THCS", "THPT", "GDTX") to observe stage-specific subject catalogs and grading frameworks.
  3. Filter subjects by Academic Year and Grade level dropdown, or search by subject name or code without diacritic friction (e.g. typing "toan" matches "Toán học").
  4. Click on any subject row (e.g. "Toán học") to slide open the Subject Detail Drawer, inspecting general properties, assigned teachers, and the read-only 4-term assessment matrix (Giữa Kỳ 1, Cuối Kỳ 1, Giữa Kỳ 2, Cuối Kỳ 2).
  5. Click '+ Phân công' on a subject to open the `AssignTeacherModal`, observing that only unassigned teachers appear in the dropdown list, and assign a teacher with live feedback.
  6. Click the unassign icon next to a teacher in the drawer to trigger the `UnassignTeacherModal`, confirming teacher and subject details while reassuring historical scoreboard data preservation.
- What remains uncertain: None. All requirements and business rules BR01-BR11 are verified and covered by automated tests.
