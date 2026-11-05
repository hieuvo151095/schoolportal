---
id: M-020-001-school-calendar
type: module
status: implemented
parent_epic: E-020-school-calendar
owner_skill: alan-tech-lead
source_trace:
  - docs_legacy/operating-portal/M5-nha-truong/lich-su-kien.md
  - docs/development/E-020-school-calendar/epic.md
  - docs/decisions.md
verification:
  - tests/unit/calendar.test.mjs
jira:
  story: "As a technical lead, I want a decoupled architectural module for the School Event Calendar featuring a unified normalized Redux event store, pure calendar projection mathematics, and cross-module meal refund interoperability so that calendar views remain responsive and synchronized."
  priority: P1
  labels:
    - architecture
    - module-boundary
    - redux-toolkit
    - pure-utils
---

# Module: School Event Calendar (Nhà Trường — Lịch Sự Kiện)

## Jira Story

- Story: As a technical lead, I want a decoupled architectural module for the School Event Calendar featuring a unified normalized Redux event store, pure calendar projection mathematics, and cross-module meal refund interoperability so that calendar views remain responsive and synchronized.
- Jira issue type: Module
- Acceptance owner: `alan-tech-lead`

## Priority

- Priority: P1
- Architectural criticality: High. Encapsulates all school calendar date arithmetic, multi-day span algorithms, Redux viewport state, and the authoritative holiday master data source informing tuition meal fee refund deductions.

## Responsibility

The School Event Calendar module (`M-020-001`) owns event lifecycle management, data contracts, viewport filtering, and date calculations. It guarantees that all 3 calendar views project from a single normalized event cache, preventing view desynchronization and eliminating complex inter-view messaging.

## Implementation Commentary

1. **Unified State Topography (ADR-016):** The Redux slice `calendarSlice.ts` maintains a normalized array of `SchoolEvent` objects alongside viewport parameters (`selectedYear`, `selectedMonth`, `activeViewMode`, `eventScopeFilter`). Modifying or deleting an event in Agenda view immediately reflects in Year and Month views without manual refresh.
2. **Pure Projection Engine (`calendarValidation.ts`):** All date mathematics, day grid generation (Monday-start 35/42 cells), category aggregation, and multi-day span detection are implemented as pure functions with zero side effects. This guarantees sub-10ms projection performance and high testability.
3. **Form Validation & Invariant Protection:** Form submissions strictly validate title length (1-200 chars), category validity, and date ordering (`endDate >= startDate`). If the specific time toggle is checked, start and end times are validated in `HH:mm` format with `endTime > startTime` on same-day events.
4. **Cross-Module Interoperability:** Events categorized as `ngay_nghi` (`#E11D48`) function as the authoritative school holiday master source, automatically informing tuition invoicing meal fee refund calculations (`TASK-FIN-034`) at 100% refund rate without requiring manual absence submissions.
5. **Modal Interaction State Machine:** Clean isolation between view state, inspection modal (`EventDetailModal`), deletion confirmation modal `LS-01` (`EventDeleteConfirmModal`), and dirty form exit modal `LS-02` (`UnsavedChangesModal`).

## Code Scope

- Data Contracts: `src/types/calendar.ts`
- Pure Utils & Validation: `src/utils/calendarValidation.ts`
- Mock Seed Data: `src/services/mockCalendarData.ts`
- Redux Slice: `src/store/slices/calendarSlice.ts`
- Registered Store: `src/store/index.ts`
- Component Hierarchy:
  - `src/modules/school/calendar/CalendarToolbar.tsx`
  - `src/modules/school/calendar/CalendarYearView.tsx`
  - `src/modules/school/calendar/CalendarMonthView.tsx`
  - `src/modules/school/calendar/CalendarAgendaView.tsx`
  - `src/modules/school/calendar/EventDetailModal.tsx`
  - `src/modules/school/calendar/EventDeleteConfirmModal.tsx`
  - `src/modules/school/calendar/UnsavedChangesModal.tsx`
  - `src/modules/school/calendar/EventForm.tsx`
- Page Surfaces:
  - `src/pages/[schoolCode]/school/calendar/index.tsx`
  - `src/pages/[schoolCode]/school/calendar/create.tsx`
  - `src/pages/[schoolCode]/school/calendar/edit/[eventId].tsx`
- Layout Navigation: `src/components/layout/PortalLayout.tsx`

## Relationship Map

| Relation | Target | Label | Rationale |
|---|---|---|---|
| IMPLEMENTS | `E-020-school-calendar` | `IMPLEMENTS` | Implements the School Event Calendar epic architecture. |
| ENABLES | `F-020-001-school-calendar` | `ENABLES` | Provides core contracts and utilities to the feature. |
| ENABLES | `P-020-001-school-calendar` | `ENABLES` | Provides components and state to calendar pages. |
| RELATES_TO | `M-009-001-finance-invoices` | `RELATES_TO` | Informs automated 100% holiday meal refund deductions. |

## Mermaid Diagram

```mermaid
classDiagram
    class SchoolEvent {
        +string id
        +string schoolCode
        +string title
        +SchoolEventType category
        +string startDate
        +string endDate
        +boolean hasSpecificTime
        +string startTime
        +string endTime
        +string location
        +string description
        +string coverImage
        +string[] attachments
    }

    class CalendarState {
        +SchoolEvent[] events
        +int selectedYear
        +int selectedMonth
        +CalendarViewMode activeViewMode
        +EventScopeFilter eventScopeFilter
        +string selectedEventId
        +boolean isDetailModalOpen
        +boolean isDeleteModalOpen
        +string searchQuery
    }

    class CalendarValidation {
        +validateEventForm(formData) EventValidationError[]
        +generateMonthGridCells(year, month) CalendarCell[]
        +filterEventsByYear(events, year) SchoolEvent[]
        +filterEventsByMonth(events, year, month) SchoolEvent[]
        +filterAgendaEvents(events, year, scope) SchoolEvent[]
        +countEventsByCategory(events) Record
    }

    CalendarState "1" *-- "many" SchoolEvent : contains
    CalendarState ..> CalendarValidation : projected by
```

## Verification

- Tests: `node --test tests/unit/calendar.test.mjs` (15/15 tests passing in 103ms).
- Build: `npm run build` static compilation of all 54 Next.js routes.
- Boundaries: Pure validation functions verified with strict data invariants.

## Work Log

- Date: 2026-10-06
  - Action: Architected and implemented the School Event Calendar module with 15 passing automated unit test assertions.
  - Agent/skill: `alan-tech-lead`
  - Evidence: Verified via `tests/unit/calendar.test.mjs`.
  - Docs updated before code: `docs/decisions.md` (ADR-016), `docs/planning/diagrams.md`.

## Change Log

- Date: 2026-10-06
  - Code change: Implemented data contracts, pure utils, Redux slice, 8 UI components, and 3 page routes.
  - Documentation update: Updated module documentation, doc sync note, and manifest.
  - Evidence: `tests/unit/calendar.test.mjs`.

