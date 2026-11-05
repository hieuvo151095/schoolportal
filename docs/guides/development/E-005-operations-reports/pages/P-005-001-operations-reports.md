---
id: P-005-001-operations-reports
type: page
parent_epic: E-005-operations-reports
status: active
owner_skill: benny-frontend-engineer
source_trace:
  - docs/prd.md
  - docs/planning/screens.md
  - docs_legacy/operating-portal/van-hanh/bao-cao-diem-danh.md
  - docs_legacy/operating-portal/van-hanh/bao-cao-mo-rong.md
verification:
  - tests/unit/reports.test.mjs
jira:
  story: "As a teacher or admin, I want to navigate to attendance and extended reporting routes to inspect monthly rosters, manage evaluation sheets, and compute late fees."
  priority: P0
  labels:
    - pages
    - frontend
    - route
    - reports
    - attendance
---

# Page: Reports UI Routes (`/[schoolCode]/reports/attendance` & `extended/`)

## Jira Story

- Story: As a teacher or school administrator, I want to access `/[schoolCode]/reports/attendance` and `/[schoolCode]/reports/extended`, view the monthly student/staff attendance calendar, inspect daily check-in details, modify absence excuses, view late-pickup fee calculations, create and duplicate developmental reports, and transition report lifecycles to completed, so that institutional reporting is transparent and reliable.
- Jira issue type: Page
- Acceptance owner: `benny-frontend-engineer`

## Priority

- Priority: P0 (Blocker)
- Severity if missed: Critical — Reporting dashboards cannot be browsed by users.
- Rationale: Core user-facing routes for Sub-module 5: Báo Cáo Điểm Danh & Mở Rộng.
- Target release: Phase 1 Core

## Route / Surface

- **URL Patterns:**
  - `/[schoolCode]/reports/attendance/`
  - `/[schoolCode]/reports/extended/`
  - `/[schoolCode]/reports/extended/[reportId]/`
  - `/[schoolCode]/reports/create/create-extended/`
- **Default Routes:**
  - `/demo/reports/attendance/`
  - `/demo/reports/extended/`
  - `/demo/reports/extended/rep-001/`
  - `/demo/reports/create/create-extended/`
- **Container:** Wrapped in `PortalLayout` providing header brand context and sidebar navigation.

## PM Notes

- PM-visible status: Active implementation of attendance calendar matrices and developmental report sheets.
- Demo narrative: Open attendance reports, switch between Student and Staff tabs, click a late arrival cell to view temperature and timestamps, open the late fee modal to inspect overtime charges, navigate to extended reports, use the filter drawer, clone a report for a classmate, and view the printable evaluation sheet.
- Acceptance impact: Verifies interactive frontend routing for Vận Hành Báo Cáo.

## States

1. **Attendance Calendar Grid (`/reports/attendance`):**
   - **Student Tab:** Class selector, month picker (`09/2026`), export button, calendar matrix with weekday headers, summary columns for present, excused, unexcused, and late minutes.
   - **Staff Tab:** Staff search bar, class/department selector, role dropdown, month picker, check-in and check-out logs per day.
2. **Extended Reports Roster (`/reports/extended`):**
   - Roster table with student avatars, titles, template tags, date period, status pills (`Bản nháp`, `Đã gửi`, `Hoàn tất`), and row actions.
   - Delete icon dynamically visible only for draft reports.
3. **Report Detail & Milestone Evaluation (`/reports/extended/[reportId]`):**
   - Official letterhead formatting with school brand and address.
   - Student info card with age calculation ("5 tuổi 3 tháng") and parent link.
   - Skill checklist matrices for language, math, and motor skills.
   - Contextual CTA button transitioning from "Gửi báo cáo" to "Hoàn tất".
4. **Modal Dialog States:**
   - `DailyAttendanceModal`: Inspection dialog for temperature, health notes, and arrival/departure timestamps.
   - `EditAbsenceModal`: Dialog to edit single-day absence excuse and note.
   - `LatePickupReportModal`: Dialog calculating overtime pickup fees per student.
   - `DuplicateReportModal`: Modal to clone report for another student while locking template.
   - `ExtendedFilterModal`: Drawer for template, status, and date range filters.

## Relationship Map

| Relation | Target | Label | Rationale |
| --- | --- | --- | --- |
| Implements | `E-005-operations-reports` | `IMPLEMENTS` | Page deliverable for Epic 5. |
| Uses | `M-005-001-operations-reports` | `USES` | Consumes state machine and calendar utilities. |

## Mermaid Diagram

```mermaid
flowchart TD
    RouteReports[Route: /demo/reports] --> SubRoutes{Select Sub-Route}
    SubRoutes --> AttendanceRoute[/reports/attendance/]
    SubRoutes --> ExtendedRoute[/reports/extended/]

    AttendanceRoute --> TabStudent[Tab: Học Sinh Calendar Grid]
    AttendanceRoute --> TabStaff[Tab: Nhân Viên Calendar Grid]
    TabStudent --> ModalDetail[Daily Detail Modal]
    TabStudent --> ModalAbsence[Edit Absence Modal]
    TabStudent --> ModalLateFee[Late Fee Modal]

    ExtendedRoute --> TableList[Report Roster Table]
    ExtendedRoute --> FilterDrawer[Extended Filter Drawer]
    ExtendedRoute --> ModalDuplicate[Duplicate Report Modal]
    ExtendedRoute --> DetailView[/reports/extended/:id/ Letterhead Evaluation]
    ExtendedRoute --> CreatePage[/reports/create/create-extended/ Form]
```

## Verification

- Command: `node --experimental-strip-types --test tests/unit/reports.test.mjs`
- Expected: All unit tests pass, and routes compile cleanly via `npm run build`.
- Result: 100% test pass rate with zero regression errors.

## Work Log

- Date: 2026-09-12
  - Action: Initialized reports page routes and calendar grid specifications.
  - Agent/skill: `benny-frontend-engineer`
  - Evidence: Designed responsive attendance calendar and evaluation layouts.

## Change Log

- Date: 2026-09-12
  - Code change: Implemented Next.js Pages router routes for attendance and extended reports.
  - Documentation update: Authored page specification matching V31 rubric.
  - Evidence: All quality gates validated.
