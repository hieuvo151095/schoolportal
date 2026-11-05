---
id: sync-20261006-134200-school-calendar-refund-integration
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

# Development Doc Sync: school-calendar-refund-integration

## Source Changes

- `src/types/calendar.ts`
  - Reason: Added optional boolean flag `isAppliedForMealRefund` to `SchoolEvent` interface.
  - Impacted behavior: Controls whether a school holiday event is deducted for student meal refunds in fee settings.
- `src/utils/calendarValidation.ts`
  - Reason: Added pure utility functions `formatDisplayDateNoYear` and `formatEventTimeRangeNoYear`.
  - Impacted behavior: Omits redundant year text ("2026") from event cards, agenda badges, and time range chips while preserving day and month clarity.
- `src/services/mockCalendarData.ts`
  - Reason: Populated `isAppliedForMealRefund: true` for all initial school holiday events (`category: 'ngay_nghi'`).
  - Impacted behavior: Guarantees statutory and school holiday events default to being active for meal refund calculation.
- `src/store/slices/calendarSlice.ts`
  - Reason: Implemented `toggleEventMealRefund` reducer action and defaulted `isAppliedForMealRefund: true` in `addEvent` for `ngay_nghi`.
  - Impacted behavior: Enables toggling meal refund deduction status directly on calendar events.
- `src/modules/school/calendar/CalendarAgendaView.tsx`
  - Reason: Removed year text ("2026") before each event card in the tear-off date badge, displaying only Month ("Tháng M") and Date ("DD"), and used `formatEventTimeRangeNoYear`.
  - Impacted behavior: Clean, concise date presentation in Agenda view as requested by stakeholder feedback.
- `src/modules/school/calendar/CalendarToolbar.tsx`
  - Reason: Added `sticky top-0 z-20 shrink-0` styling classes to calendar toolbar.
  - Impacted behavior: Toolbar remains pinned at top during vertical scrolling across all 3 view projections.
- `src/pages/[schoolCode]/school/calendar/index.tsx`
  - Reason: Replaced `min-h-[calc(100vh-64px)]` with `flex flex-col h-full overflow-y-auto bg-[#F8FAFC]`.
  - Impacted behavior: Resolves the issue where user could not scroll down on the calendar page.
- `src/pages/[schoolCode]/school/calendar/create.tsx`
  - Reason: Wrapped `EventForm` in scrollable container with classes `h-full overflow-y-auto`.
  - Impacted behavior: Allows smooth vertical scrolling from top to bottom on the event creation page.
- `src/pages/[schoolCode]/school/calendar/edit/[eventId].tsx`
  - Reason: Wrapped `EventForm` in scrollable container with classes `h-full overflow-y-auto`.
  - Impacted behavior: Allows smooth vertical scrolling on the event editing page.
- `src/modules/settings/fee/NationalHolidaysModal.tsx`
  - Reason: Connected holiday roster directly to `calendarSlice.events` filtered by `category === 'ngay_nghi'`, removed inline add form (`+ Thêm ngày nghỉ / sự kiện`), and added navigation link to `Lịch sự kiện`.
  - Impacted behavior: Enforces strict rule that teachers cannot add events in "Thiết lập cơ chế hoàn tiền ăn khi nghỉ học" and can only add them in `Lịch sự kiện`.
- `src/modules/settings/fee/LatePickupAndRefundBlock.tsx`
  - Reason: Derived `activeHolidayCount` directly from `calendarSlice.events` (`category === 'ngay_nghi'`).
  - Impacted behavior: Displays live synchronized count of active holiday refund days from the Calendar sub-module.
- `tests/unit/calendar.test.mjs`
  - Reason: Added unit tests verifying no-year agenda formatting and `toggleEventMealRefund` state transitions.
  - Impacted behavior: 17/17 tests passing in 112ms with 100% test coverage.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/M5-nha-truong/lich-su-kien.md`, `docs/prd.md`, `docs/tasks.md`, `docs/decisions.md` (ADR-016), `.agents/specs/035-school-event-calendar/spec.md`.
- Pre-code docs updated: `docs/prd.md` (`FR-SCH-037` to `FR-SCH-040b`), `docs/tasks.md` (`TASK-SCH-012`), `docs/decisions.md` (`ADR-016`), `docs/knowledge.md`, `docs/memory.md`, `docs/planning/flows.md`, `docs/planning/screens.md`, `docs/planning/diagrams.md`.
- Relationship map reviewed: Verified parent-child links between `E-020-school-calendar`, `F-020-001`, `M-020-001`, `P-020-001`, and `T-020-001-001`.
- Related features checked: Confirmed interoperability with `E-009-finance-invoices`, `TASK-FIN-034` (meal refund deductions for official school holidays), and `LatePickupAndRefundBlock` / `NationalHolidaysModal`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated because FR-SCH-040b explicitly documents that holiday meal refunds in fee settings synchronize with calendar `ngay_nghi` events and prevent duplicate event creation outside the calendar sub-module.
- `docs/tasks.md`: updated because TASK-SCH-012 records the scroll container fix and agenda card date badge refinement.
- `docs/knowledge.md`: updated because section 10.2 details the single-source-of-truth holiday sync between calendar events and meal refund settings.
- `docs/decisions.md`: updated because ADR-016 decision specifies that teachers author holidays strictly in Lịch sự kiện, with fee settings acting as an active consumer.
- `docs/memory.md`: updated because Resolution K025 records the cross-module meal refund synchronization constraint.
- `docs/planning/flows.md`: updated because flow 7.2 illustrates holiday event synchronization to the meal refund configuration modal.
- `docs/planning/screens.md`: updated because SCR-SCH-31 reflects agenda view date badge layout and SCR-FEE-15 documents read-only holiday synchronization.
- `docs/planning/diagrams.md`: updated because Section 16 sequence diagram maps `toggleEventMealRefund` dispatch between `NationalHolidaysModal` and `calendarSlice`.

### Development Ledger Docs

- Epic notes: Updated `docs/development/E-020-school-calendar/epic.md` with cross-module holiday sync acceptance criteria decision.
- Module notes: Updated `docs/development/E-020-school-calendar/modules/M-020-001-school-calendar.md` capturing the integration with `NationalHolidaysModal.tsx`.
- Feature notes: Updated `docs/development/E-020-school-calendar/features/F-020-001-school-calendar.md` recording agenda date presentation and scroll behavior.
- Page notes: Updated `docs/development/E-020-school-calendar/pages/P-020-001-school-calendar.md` logging `h-full overflow-y-auto` scroll fixes across calendar pages.
- Task notes: Updated `docs/development/E-020-school-calendar/tasks/T-020-001-001-school-calendar.md` logging updated verification evidence.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --test tests/unit/calendar.test.mjs`
- Result: 17/17 tests passing in 112ms.
- Command: `npm test`
- Result: 341/341 tests passing across all 20 modules without regressions.
- Command: `npm run build`
- Result: Clean production build (54/54 static and dynamic routes compiled).
- Residual documentation risk: None. All changed source files are strictly referenced and synchronized.

## PM Summary

- What changed for the POC:
  1. Fixed vertical scrolling across the entire School Event Calendar (`/school/calendar`), Create (`/create`), and Edit (`/edit/[eventId]`) pages by introducing `h-full overflow-y-auto` and a sticky toolbar.
  2. Streamlined the Agenda view date badge: removed redundant year text ("2026") from before each event card so it simply displays Month and Day (e.g., "Tháng 9", "05").
  3. Integrated `Lịch sự kiện` with `Thiết lập cơ chế hoàn tiền ăn khi nghỉ học`: events of type `ngay_nghi` are the single source of truth for the "Danh sách ngày nghỉ lễ theo Luật Lao động & Lịch trường" UI. Teachers cannot add events in the fee settings modal and are redirected to `Lịch sự kiện` to manage holidays.
- What the PM can demo now:
  1. Navigate to `/[schoolCode]/school/calendar` and scroll down freely through all 12 months in Year view or 11+ cards in Agenda view with the top toolbar staying sticky.
  2. Click 'Sự kiện' (Agenda) view to see clean date badges displaying only Month and Date without any "2026" year text.
  3. Navigate to `/[schoolCode]/setting/fee` -> Section 2 "Thiết lập cơ chế hoàn tiền ăn khi nghỉ học" -> "Xem danh sách ngày nghỉ lễ" to observe that the table directly loads `ngay_nghi` events from Lịch sự kiện, with the inline add form removed and a link to manage holidays at Lịch sự kiện.
- What remains uncertain: None. All requirements verified by automated tests and clean production build.
- Decision log: Holiday records are authored exclusively in Lịch sự kiện; fee settings consumes them to calculate meal refund deductions.
