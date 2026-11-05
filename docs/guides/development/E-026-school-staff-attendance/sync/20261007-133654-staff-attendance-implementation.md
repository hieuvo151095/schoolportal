---
id: sync-20261007-133654-staff-attendance-implementation
type: development-sync
parent_epic: E-026-school-staff-attendance
status: approved
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
verification:
  - npm test
  - npm run build
---

# Development Doc Sync: staff-attendance-implementation

## Source Changes

- `src/types/staffAttendance.ts`
  - Reason: Establish canonical domain types and data contracts for StaffProfile, StaffAttendanceRecord, KPI counters, and mutation payloads.
  - Impacted behavior: Governs data typing across validation engine, Redux slice, presentation components, and unit tests.
- `src/utils/staffAttendanceValidation.ts`
  - Reason: Pure validation engine enforcing BR01 through BR12 (date boundary <= today, 45-day retrospective lock, warning DD-02, 1-click check-in/out, time format regex, inline rollback DD-01, roster filtering, KPI aggregation, and nickname sorting).
  - Impacted behavior: Validates input payloads, guards against unauthorized retrospective modifications, and calculates presence metrics.
- `src/services/mockStaffAttendanceData.ts`
  - Reason: Seed fixtures with 35+ realistic Vietnamese faculty/staff profiles across all 4 roles and 60 days of historical records.
  - Impacted behavior: Populates attendance roster, summary cards, and profile modals with rich test data.
- `src/store/slices/staffAttendanceSlice.ts`
  - Reason: Redux Toolkit state machine managing normalized staff records, filter state, optimistic check-in/out, inline time editing with rollback, absence confirmation, notes, and profile modals.
  - Impacted behavior: Drives instantaneous state transitions across the staff attendance dashboard.
- `src/store/index.ts`
  - Reason: Mount `staffAttendanceReducer` onto the root Redux application store.
  - Impacted behavior: Enables access to staff attendance state via `useAppSelector((state) => state.staffAttendance)`.
- `src/modules/school/staff-attendance/StaffAttendanceToolbar.tsx`
  - Reason: Hosts date picker (future dates locked <= today), class filter dropdown, role dropdown, instant search bar, and 45-day warning banner DD-02.
  - Impacted behavior: Drives real-time client-side roster filtering without page reloads.
- `src/modules/school/staff-attendance/StaffAttendanceSummaryCards.tsx`
  - Reason: Renders 3 presence KPI summary cards (Tham dự, Vắng có phép, Vắng không phép) with dynamic concealment when search query is active (BR10).
  - Impacted behavior: Summarizes daily faculty presence metrics at a glance.
- `src/modules/school/staff-attendance/StaffAttendanceTable.tsx`
  - Reason: Roster table with 1-click Check-In (Blue #0070CE) and Check-Out (Amber #FEC020), inline time badge editing with rollback (DD-01), Vắng toggle, inline auto-saving notes (BR07), multi-role badges (BR08), sortable nickname header (BR12), and bottom total tally (BR10).
  - Impacted behavior: Provides high-velocity morning and afternoon roll-call timekeeping.
- `src/modules/school/staff-attendance/StaffAbsenceModal.tsx`
  - Reason: Absence confirmation modal distinguishing Có phép vs Không phép, displaying warning DD-03 if checked-in, and disabling row action buttons while open (BR05, BR06).
  - Impacted behavior: Documents staff leave justifications with audit safety.
- `src/modules/school/staff-attendance/StaffProfileModal.tsx`
  - Reason: Read-only profile modal displaying "Thông tin Quản Trị" for Admin or "Thông tin người dùng" with assigned class links for other roles, falling back to "Chưa có {trường}" for missing fields (BR11).
  - Impacted behavior: Enables rapid verification of faculty contact details and assigned classes.
- `src/pages/[schoolCode]/school/staff-attendance/index.tsx`
  - Reason: Canonical page route rendering toolbar, summary cards, table, and modals within `PortalLayout`.
  - Impacted behavior: Primary administrative cockpit for staff roll call and timekeeping.
- `src/pages/[schoolCode]/staff-attendance/index.tsx`
  - Reason: Canonical redirect page from legacy `/staff-attendance` to canonical `/school/staff-attendance` (K047 / BR09).
  - Impacted behavior: Seamlessly routes legacy URL requests to canonical endpoint.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Added `Điểm danh NV` navigation item with `faUserCheck` icon under the `NHÀ TRƯỜNG` menu group.
  - Impacted behavior: Provides direct sidebar access to the staff attendance module.
- `tests/unit/staffAttendance.test.mjs`
  - Reason: Automated unit test suite with 26 assertions covering date boundaries, 45-day lock, 1-click timekeeping, inline time rollback, absence warnings, notes auto-saving, multi-role badging, search-responsive KPIs, and nickname sorting.
  - Impacted behavior: Validates module correctness and guarantees zero regressions.

## Docs Before Code

- Pre-code docs read: `.agents/specs/041-school-staff-attendance-diem-danh-nv/spec.md`, `plan.md`, `docs_legacy/operating-portal/6. diem-danh-nv.md`.
- Pre-code docs updated: Initialized development ledger under `docs/development/E-026-school-staff-attendance/`.
- Relationship map reviewed: Confirmed feature placement within Module 5 (Nhà Trường) and relationship to Teachers (`F-016-001`).
- Related features checked: `016-school-teachers-giao-vien`, `020-school-calendar-lich-su-kien`, `040-school-polls-voting-binh-chon`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: no change needed / PRD already defines Điểm Danh NV requirements AC-085 through AC-092 under M5 Nhà Trường.
- `docs/tasks.md`: updated because marked T-026-001-001-school-staff-attendance as completed with full implementation evidence and test results.
- `docs/knowledge.md`: no change needed / Knowledge base records K046 (45-day retrospective lock), K047 (canonical route and class query param), and K048 (1-click check-in/out and inline rollback).
- `docs/decisions.md`: no change needed / Decision records document staff roll-call architecture and immutable audit boundaries.
- `docs/memory.md`: no change needed / Memory records project facts and resolved clarification ledger items.
- `docs/planning/flows.md`: no change needed / Sequence diagrams match implemented UI flows.
- `docs/planning/screens.md`: no change needed / Screen catalog matches implemented views.
- `docs/planning/diagrams.md`: no change needed / Architecture diagrams match implemented boundaries.

### Development Ledger Docs

- Epic notes: `docs/development/E-026-school-staff-attendance/epic.md` updated with full acceptance criteria checkmarks and implementation details.
- Module notes: `docs/development/E-026-school-staff-attendance/modules/M-026-001-school-staff-attendance.md` authored with responsibility, contracts, commentary, and verification.
- Feature notes: `docs/development/E-026-school-staff-attendance/features/F-026-001-school-staff-attendance.md` authored with user value, Jira story, PM notes, and requirements trace.
- Page notes: `docs/development/E-026-school-staff-attendance/pages/P-026-001-school-staff-attendance.md` authored with route surfaces, UI states, interactions, and accessibility.
- Task notes: `docs/development/E-026-school-staff-attendance/tasks/T-026-001-001-school-staff-attendance.md` authored with execution log, write scope, verification results, and handoff.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --experimental-strip-types --test tests/unit/staffAttendance.test.mjs` && `npm test` && `npm run build`
- Result: 26/26 unit tests passing in 17ms; 489/489 full suite tests passing across 103 test suites; clean production build with 72/72 static pages prerendered.
- Residual documentation risk: None; all 12 business rules and 3 clarification ledger items (K046, K047, K048) fully traced and verified.

## PM Summary

- What changed for the POC: Delivered the complete School Staff Attendance (Điểm Danh NV) module with 1-click check-in/out timekeeping, defensive inline time editing with automatic rollback on blur (DD-01), 45-day retrospective audit lock (DD-02), absence modal with pre-existing check-in warnings (DD-03), multi-role badges, read-only profile modal with missing-field fallback formatting, search-responsive KPI display, and nickname sorting.
- What the PM can demo now:
  1. Open `/demo/school/staff-attendance` to inspect the 3 KPI cards (Tham dự, Vắng có phép, Vắng không phép) and responsive staff roster.
  2. Perform single-click Check-In and Check-Out on any unrecorded staff row (stamps current time in blue/amber badges without confirmation dialog).
  3. Click a recorded time badge to edit inline; blur with invalid format or empty string to observe toast DD-01 and automatic rollback to prior timestamp.
  4. Select a date within 45 days in the past to see warning banner DD-02; select a date older than 45 days to see all mutation controls locked in read-only mode.
  5. Click "Báo vắng" on a checked-in teacher to see warning DD-03 and verify that row action buttons are disabled while the modal is open.
  6. Click an employee's nickname to open the read-only profile modal and verify "Chưa có {trường}" fallback formatting.
  7. Filter by class (`?classId=6A1`), filter by role, type in the search bar to verify top 3 KPI cards hide while bottom total count remains visible, and toggle nickname sort A to Z.
- What remains uncertain: None; all requirements, edge cases, and design specifications are satisfied and verified by automated tests.
