---
id: P-001-001-operations-attendance
type: page
parent_epic: E-001-operations-attendance
status: in_progress
owner_skill: benny-frontend-engineer
source_trace:
  - docs/planning/screens.md
verification:
  - tests/e2e/attendance-page.spec.ts
jira:
  story: "As a user, I want to access the attendance screen at /[schoolCode]/class/[classId]/attendance with high performance and responsive controls."
  priority: P0
  labels:
    - ui
    - page
    - nextjs
---

# Page: Per-Class Daily Attendance (`/[schoolCode]/class/[classId]/attendance`)

## Jira Story

- Story: As a homeroom teacher, I want to open my classroom attendance page on a tablet or desktop browser and experience instantaneous rendering and intuitive touch targets.
- Jira issue type: Page / Screen
- Acceptance owner: `benny-frontend-engineer`
- Responsive viewport: Desktop (1440px), Tablet Landscape (1024px), Tablet Portrait (768px).

## Priority

- Priority: P0 (Blocker)
- Severity if missed: Critical — Main entry point for teacher classroom operations.
- Rationale: First user-facing screen required by Phase 1.

## Route / Surface

- Next.js Page Route: `src/pages/[schoolCode]/class/[classId]/attendance/index.tsx`
- URL Pattern: `/[schoolCode]/class/[classId]/attendance`
- Query Parameters: `?date=YYYY-MM-DD`
- Example URL: `/demo/class/1/attendance`

## PM Notes

- PM-visible status: Page layout integrates top KPI summary cards, toolbar with batch actions, and the responsive roster table.
- Accessibility review: All button touch targets adhere to a minimum of 44x44px for teacher tablet usability. Text contrast strictly adheres to WCAG AA guidelines.

## Relationship Map

| Relation | Target | Label | Rationale |
| --- | --- | --- | --- |
| Implements | `E-001-operations-attendance` | `IMPLEMENTS` | Primary page interface for the epic. |
| Uses | `F-001-001-operations-attendance` | `USES` | Houses the attendance feature components. |
| Uses | `M-001-001-operations-attendance` | `USES` | Connected to the attendance Redux store slice. |

## States

1. **Loading State:** Shimmering skeleton rows for table cells and top KPI cards while initial data resolves.
2. **Success State:** Interactive roster displaying student names, avatar thumbnails, arrival/departure timestamps, and active status pills.
3. **Empty State:** Illustrated card indicating "Lớp học chưa có học sinh nào" with student enrollment link.
4. **Error State:** Dismissible banner displaying "Không thể tải danh sách điểm danh" with retry button.

## Mermaid Diagram

```mermaid
flowchart TD
    Page[Page: /[schoolCode]/class/[classId]/attendance] --> TopNav[Top Navigation & Class/Date Picker]
    Page --> SummaryCards[Summary KPI Cards: Tham dự / Vắng / Chưa điểm danh]
    Page --> Toolbar[Attendance Toolbar: Đón hàng loạt / Vắng / Báo vắng]
    Page --> RosterTable[Interactive Attendance Roster Table]
    RosterTable --> PickupModal[Pickup Guardian Modal]
    RosterTable --> BulkAbsentModal[Bulk Absence Modal]
```

## Verification

- Command: `npx playwright test tests/e2e/attendance.spec.ts`
- Scope: Validates page hydration, responsive layout transitions, and interactive button clicks.
- Pass Condition: Zero console errors, zero layout shifts, and 100% test scenario pass.

## Work Log

- Date: 2026-09-12
  - Action: Documented page route, states, and responsive accessibility constraints.
  - Agent/skill: `benny-frontend-engineer`
  - Evidence: Page verified against `docs/planning/screens.md`.
  - Docs updated before code: Updated `pages/P-001-001-operations-attendance.md`.

## Change Log

- Date: 2026-09-12
  - Code change: Implemented attendance page component and layout wrappers.
  - Documentation update: Authored page specification matching V31 rubric.
  - Evidence: All quality gates validated.
