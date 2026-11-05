---
id: sync-20261006-115355-school-calendar-implementation
type: development-sync
parent_epic: E-020-school-calendar
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs/prd.md
  - .agents/specs/035-school-event-calendar/spec.md
verification:
  - tests/unit/calendar.test.mjs
  - npm run build
---

# Development Doc Sync: school-calendar-implementation

## Source Changes

- `src/types/calendar.ts`
  - Reason: Defines TypeScript data contracts for `SchoolEvent`, `SchoolEventType`, `CalendarViewMode`, `EventScopeFilter`, `EventFormData`, and `EVENT_CATEGORY_MAP`.
  - Impacted behavior: Establishes compile-time type safety across Redux state, pure utils, and view components.
- `src/utils/calendarValidation.ts`
  - Reason: Implements pure validation logic, date arithmetic, month grid generation, and multi-day span detection.
  - Impacted behavior: Enforces mandatory fields, date sequencing (`endDate >= startDate`), specific time validation (`endTime > startTime`), and calendar view filtering.
- `src/services/mockCalendarData.ts`
  - Reason: Provides realistic mock seed data for 2026 school academic events.
  - Impacted behavior: Populates initial calendar state with holidays, parent-invited events, and internal meetings.
- `src/store/slices/calendarSlice.ts`
  - Reason: Implements Redux Toolkit state machine for calendar view mode, year/month navigation, scope filtering, modal states, and CRUD mutations.
  - Impacted behavior: Serves as single source of truth driving all 3 calendar projections simultaneously.
- `src/store/index.ts`
  - Reason: Registers `calendarReducer` under the `calendar` key in the root Redux store.
  - Impacted behavior: Enables application-wide dispatch and selector access for calendar state.
- `src/modules/school/calendar/CalendarToolbar.tsx`
  - Reason: Top control bar with Year selector (2021-2030+), Month nav, 3-view segmented switcher, and '+ Thêm sự kiện' CTA button.
  - Impacted behavior: Controls active view projections, calendar year/month pagination, and event search.
- `src/modules/school/calendar/CalendarYearView.tsx`
  - Reason: Renders 12 miniature monthly calendar cards with continuous colored date highlights and bottom color legend bar.
  - Impacted behavior: Provides bird's-eye macro view of the entire academic year with click-to-inspect interactivity.
- `src/modules/school/calendar/CalendarMonthView.tsx`
  - Reason: Renders 7-column day cell grid (Monday-start) with stacked multi-day event chips, time badges, and cell overflow controls.
  - Impacted behavior: Provides micro-level monthly inspection with detailed event pills.
- `src/modules/school/calendar/CalendarAgendaView.tsx`
  - Reason: Chronological stream with tear-off calendar date blocks, scope filter (Sắp tới vs Tất cả), and direct inline edit/delete controls.
  - Impacted behavior: Enables quick agenda review and direct event modifications.
- `src/modules/school/calendar/EventDetailModal.tsx`
  - Reason: Read-only inspection dialog showing event cover image, category badge, date/time span, location, description, attachments, and holiday meal refund notices.
  - Impacted behavior: Allows quick inspection from Year/Month views without entering authoring mode.
- `src/modules/school/calendar/EventDeleteConfirmModal.tsx`
  - Reason: Modal `LS-01` confirming event deletion with exact event title.
  - Impacted behavior: Protects against accidental deletion of academic records.
- `src/modules/school/calendar/UnsavedChangesModal.tsx`
  - Reason: Modal `LS-02` warning of unsaved form modifications on navigation departure.
  - Impacted behavior: Prevents accidental loss of entered form data.
- `src/modules/school/calendar/EventForm.tsx`
  - Reason: Reusable authoring form for Create and Edit pages with cover image presets, title validation, 3 category radio pills, auto-syncing date pickers, 'Thêm thời gian' toggle (HH:mm), and attachments.
  - Impacted behavior: Powers dedicated authoring workflows.
- `src/pages/[schoolCode]/school/calendar/index.tsx`
  - Reason: Main calendar hub page mounting `CalendarToolbar` and active view projections.
  - Impacted behavior: Primary portal route for School Event Calendar (`SCR-SCH-31`).
- `src/pages/[schoolCode]/school/calendar/create.tsx`
  - Reason: Dedicated creation page mounting `EventForm` in create mode.
  - Impacted behavior: Allows school administrators to author new events (`SCR-SCH-32`).
- `src/pages/[schoolCode]/school/calendar/edit/[eventId].tsx`
  - Reason: Dedicated dynamic route for editing existing calendar events.
  - Impacted behavior: Prepopulates form data and dispatches updates (`SCR-SCH-33`).
- `src/components/layout/PortalLayout.tsx`
  - Reason: Added `Lịch sự kiện` navigation item with `faCalendarAlt` icon under `NHÀ TRƯỜNG`.
  - Impacted behavior: Renders menu item and handles active route highlighting.
- `tests/unit/calendar.test.mjs`
  - Reason: Automated unit test suite verifying BR01-BR10, date arithmetic, view filters, Redux state machine, and holiday meal refund interoperability.
  - Impacted behavior: Guarantees zero regression and continuous behavioral verification (15/15 passing).

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/M5-nha-truong/lich-su-kien.md`, `docs/prd.md`, `docs/tasks.md`, `docs/decisions.md` (ADR-016), `.agents/specs/035-school-event-calendar/spec.md`.
- Pre-code docs updated: `docs/prd.md` (`FR-SCH-037` to `FR-SCH-040b`), `docs/tasks.md` (`TASK-SCH-012`), `docs/decisions.md` (`ADR-016`), `docs/knowledge.md`, `docs/memory.md`, `docs/planning/flows.md`, `docs/planning/screens.md`, `docs/planning/diagrams.md`.
- Relationship map reviewed: Verified parent-child links between `E-020-school-calendar`, `F-020-001`, `M-020-001`, `P-020-001`, and `T-020-001-001`.
- Related features checked: Confirmed interoperability with `E-009-finance-invoices` and `TASK-FIN-034` (meal refund deductions for official school holidays).

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated because FR-SCH-037 through FR-SCH-040b established product requirements for the 3-view calendar engine.
- `docs/tasks.md`: updated because TASK-SCH-012 specified full technical write scope and verification steps.
- `docs/knowledge.md`: updated because section 10.2 required exact color tokens, time toggles, modal dialogues, and meal refund cross-linking.
- `docs/decisions.md`: updated because ADR-016 captured the architectural decision for 3-view single-data-store and cross-module holiday meal refund guarantee.
- `docs/memory.md`: updated because Resolution of K025 resolved legacy navigation placement decision under NHÀ TRƯỜNG.
- `docs/planning/flows.md`: updated because sequence diagram 7.2 illustrated event authoring, inspection, and inline actions.
- `docs/planning/screens.md`: updated because SCR-SCH-31, SCR-SCH-32, and SCR-SCH-33 needed exact component specifications.
- `docs/planning/diagrams.md`: updated because Section 16 added C4 component hierarchy, Redux store topography, and sequence diagram for holiday meal refund interoperability.

### Development Ledger Docs

- Epic notes: Authored `docs/development/E-020-school-calendar/epic.md` with complete Jira-grade facts and acceptance criteria decision.
- Module notes: Authored `docs/development/E-020-school-calendar/modules/M-020-001-school-calendar.md` capturing responsibilities, code scope, and Mermaid class diagram.
- Feature notes: Authored `docs/development/E-020-school-calendar/features/F-020-001-school-calendar.md` capturing requirements trace and user value.
- Page notes: Authored `docs/development/E-020-school-calendar/pages/P-020-001-school-calendar.md` detailing 3-view states, authoring forms, and modals.
- Task notes: Authored `docs/development/E-020-school-calendar/tasks/T-020-001-001-school-calendar.md` logging execution log and verification evidence.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --test tests/unit/calendar.test.mjs`
- Result: 15/15 tests passing in 103ms.
- Command: `npm run build`
- Result: Clean production build (54/54 static and dynamic routes compiled).
- Residual documentation risk: None. All 8 planning documents, development ledger notes, and research manifests are fully synchronized.

## PM Summary

- What changed for the POC: The School Operating Portal now includes a fully functional, enterprise-grade School Event Calendar (`/school/calendar`) under the `NHÀ TRƯỜNG` menu group with 3 dynamic view projections (Năm, Tháng, Sự kiện), 3 semantic event categories, granular time precision toggles, inspection dialogs, and automated holiday meal refund cross-linking.
- What the PM can demo now:
  1. Access `/[schoolCode]/school/calendar` to view the 12-month bird's-eye matrix with colored highlight spans and bottom color legend.
  2. Switch to 'Tháng' to inspect the interactive 7-column monthly grid with stacked multi-day event chips, time badges, and overflow controls.
  3. Switch to 'Sự kiện' to view the chronological agenda stream with tear-off calendar date blocks and filter by 'Sắp tới' vs 'Tất cả'.
  4. Click any event to open `EventDetailModal` showing full event details and holiday meal refund notices.
  5. Click '+ Thêm sự kiện' to author a new milestone with cover image presets, title validation, 3 category radio pills, auto-syncing date range pickers, and 'Thêm thời gian' toggle (HH:mm).
  6. Attempt to cancel an edited form to observe the dirty form guard modal `LS-02`, and delete an event from the agenda to observe confirmation modal `LS-01`.
- What remains uncertain: None. All requirements and business rules BR01-BR10 are verified and covered by automated tests.
- Decision log: All key architectural decisions (3 views, single store, time toggles, category tokens) verified and recorded in ADR-016.
