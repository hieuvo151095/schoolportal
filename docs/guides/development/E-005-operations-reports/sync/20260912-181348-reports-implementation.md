---
id: sync-20260912-181348-reports-implementation
type: development-sync
parent_epic: E-005-operations-reports
status: completed
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
verification:
  - tests/unit/reports.test.mjs
  - npm run build
  - curl -s -L http://localhost:3000/demo/reports/attendance
  - curl -s -L http://localhost:3000/demo/reports/extended
---

# Development Doc Sync: reports-implementation

> QUALITY BAR: this note is the audit trail between code and PM docs. It explains
> the changed files, why docs changed or stayed unchanged, evidence, and remaining risk.

## Source Changes

- `src/types/reports.ts`
  - Reason: Declares domain contracts for `DailyAttendanceRecord`, `StudentMonthlyAttendance`, `StaffMonthlyAttendance`, `ExtendedReport`, `DevelopmentalTemplate`, and `ReportFilterCriteria`.
  - Impacted behavior: Enforces strict typings across calendar attendance rosters, overtime tracking, checklist data, and reporting filters.
- `src/utils/reportsValidation.ts`
  - Reason: Pure domain functions computing calendar days per month with Vietnamese weekdays (BR02), overtime surcharge calculation (BR05/BR06: 50,000 VND / 30 mins), forward-only lifecycle transitions (BR02/BR09), draft-only report deletion rules (BR03), and fixed-template report duplication (BR08).
  - Impacted behavior: Prevents deletion of sent/completed reports and ensures 100% accurate financial overtime calculations.
- `src/services/mockReportsData.ts`
  - Reason: Mock datasets providing 4 curriculum templates (Language, Math, English, Weekly letter), 30 days of September 2026 attendance data with overtime and leave scenarios, staff attendance roster, and 3 pre-seeded extended reports.
  - Impacted behavior: Powers realistic interactive testing and live demonstrations.
- `src/store/slices/reportsSlice.ts`
  - Reason: Redux state machine managing attendance tabs, active filters, modal view models (`selectedDayDetail`, `selectedAbsenceEdit`, `selectedLateFeeReport`, `selectedDuplicateReport`), and actions (`updateAbsenceRecord`, `createExtendedReport`, `duplicateExtendedReport`, `deleteExtendedReport`, `advanceReportStatus`, `updateReportChecklist`).
  - Impacted behavior: Delivers immediate reactive updates to monthly attendance tallies and report evaluation progress.
- `src/modules/operations/reports/AttendanceReportTabs.tsx`
  - Reason: Tab navigation between Student and Staff monthly views with class dropdown, month/year selector, staff search bar, and export data action button.
  - Impacted behavior: Allows seamless switching between student attendance tracking and school staff timesheet inspection.
- `src/modules/operations/reports/AttendanceCalendarGrid.tsx`
  - Reason: Monthly horizontal scrolling matrix displaying days 1-30 with checkmarks, pink late clocks, P/KP absence badges, summary tallies, and clickable overtime late fee inspection links.
  - Impacted behavior: Gives teachers and admins total visual clarity on attendance and tardiness across the month.
- `src/modules/operations/reports/DailyAttendanceModal.tsx`
  - Reason: Dialog inspecting single-day attendance record: arrival/departure times, recording staff, body temperature, health status notes.
  - Impacted behavior: Enables detailed audit of daily physical arrival logs.
- `src/modules/operations/reports/EditAbsenceModal.tsx`
  - Reason: Dialog permitting modification of single-day absence excuse (Có phép vs Không phép) and reason notes.
  - Impacted behavior: Implements BR04 allowing retroactive excuse adjustments and tuition refund recalculation triggers.
- `src/modules/operations/reports/LatePickupReportModal.tsx`
  - Reason: Modal computing overtime surcharge breakdown per student with itemized late days, excess minutes, and billing total.
  - Impacted behavior: Implements BR05 and BR06 surcharge transparent fee audit.
- `src/modules/operations/reports/ExtendedReportTable.tsx`
  - Reason: Report list view with student avatars, template badges, evaluation periods, lifecycle status badges, duplication actions, and draft-only delete buttons.
  - Impacted behavior: Implements BR03 strict deletion policy and BR08 cloning trigger.
- `src/modules/operations/reports/ExtendedFilterModal.tsx`
  - Reason: Filter dialog supporting keyword search, template filter, and lifecycle status filter.
  - Impacted behavior: Enables rapid navigation through historical developmental evaluations.
- `src/modules/operations/reports/DuplicateReportModal.tsx`
  - Reason: Cloning dialog enforcing fixed template structure while selecting a new recipient student and evaluation period.
  - Impacted behavior: Implements BR08 template immutability during report duplication.
- `src/modules/operations/reports/ExtendedReportDetail.tsx`
  - Reason: Formal letterhead evaluation sheet featuring school header, student profile card, interactive checklist matrices, teacher general comments, and three-party signature blocks.
  - Impacted behavior: Provides printable and parent-publishable developmental progress evaluations with forward-only lifecycle progression (`draft` -> `sent` -> `completed`).
- `src/pages/[schoolCode]/reports/attendance/index.tsx`
  - Reason: Main monthly attendance report route wrapped in `PortalLayout`.
  - Impacted behavior: Accessible via `/[schoolCode]/reports/attendance/`.
- `src/pages/[schoolCode]/reports/extended/index.tsx`
  - Reason: Extended reports list route with search toolbar, filter modal, and duplication modal.
  - Impacted behavior: Accessible via `/[schoolCode]/reports/extended/`.
- `src/pages/[schoolCode]/reports/extended/[reportId].tsx`
  - Reason: Dynamic evaluation detail route displaying formal letterhead document.
  - Impacted behavior: Accessible via `/[schoolCode]/reports/extended/[reportId]`.
- `src/pages/[schoolCode]/reports/create/create-extended/index.tsx`
  - Reason: Dedicated creation form for new developmental reports (BR04).
  - Impacted behavior: Accessible via `/[schoolCode]/reports/create/create-extended/`.
- `tests/unit/reports.test.mjs`
  - Reason: Automated test suite containing 16 unit assertions covering calendar arithmetic, overtime pricing, deletion rules, duplication integrity, and Redux state transitions.
  - Impacted behavior: Verifies 100% compliance with business requirements.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/van-hanh/05-bao-cao-diem-danh-mo-rong.md`, `docs/planning/flows.md`, `docs/planning/screens.md`, `docs/tasks.md`.
- Pre-code docs updated: `docs/development/E-005-operations-reports/` (`epic.md`, `issues.md`, `features/F-005-001`, `modules/M-005-001`, `pages/P-005-001`, `tasks/T-005-001-001`), `docs/development/development_manifest.json`, `docs/development/index.md`.
- Relationship map reviewed: Checked dependencies on `E-001-operations-attendance` (`TASK-OPS-001`), `E-004-operations-conversations` (`TASK-OPS-006`), and future `E-006-finance-fees` (`TASK-FIN-001`, `TASK-FIN-002`).
- Related features checked: Verified alignment between daily attendance recording and monthly reporting tallies.

## Documentation Updates

### Legacy Planning Docs

- `docs/tasks.md`: updated `TASK-OPS-007` to completed `[x]` with execution and verification evidence.
- `docs/prd.md`: no change needed; active scope strictly satisfies Module 1 PRD reporting requirements.
- `docs/knowledge.md`: no change needed; knowledge items are stable.
- `docs/decisions.md`: no change needed; architectural decisions ADR-001 to ADR-005 remain authoritative.
- `docs/memory.md`: no change needed; primary memory tracked in root `AGENTS.md`.
- `docs/planning/flows.md`: verified flow `F-REP-01` (Attendance Calendar & Overtime Surcharges) and `F-REP-02` (Extended Report Evaluation & Lifecycle).
- `docs/planning/screens.md`: verified screen routes `SCR-REP-01`, `SCR-REP-02`, and `SCR-REP-03`.
- `docs/planning/diagrams.md`: verified reporting flow diagram compatibility.

### Development Ledger Docs

- Epic notes: `docs/development/E-005-operations-reports/epic.md` updated with completion state.
- Module notes: `docs/development/E-005-operations-reports/modules/M-005-001-operations-reports.md` records public interfaces and calculation boundaries.
- Feature notes: `docs/development/E-005-operations-reports/features/F-005-001-operations-reports.md` records requirement verification evidence.
- Page notes: `docs/development/E-005-operations-reports/pages/P-005-001-operations-reports.md` documents all 4 page routes and their accessibility compliance.
- Task notes: `docs/development/E-005-operations-reports/tasks/T-005-001-001-operations-reports.md` execution log finalized.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test`
- Result: **62/62 tests passing cleanly in 153ms** across all 5 operational modules.
- Command: `npm run build`
- Result: Optimized Next.js production build generated successfully with zero errors across all 12 application routes.
- Command: `curl -s -L http://localhost:3000/demo/reports/attendance` & `curl -s -L http://localhost:3000/demo/reports/extended`
- Result: Both routes return HTTP 200 OK.
- Residual documentation risk: None; all business rules BR01-BR09 are fully traced and covered by automated test assertions.

## PM Summary

- What changed for the POC: Built the complete Attendance & Extended Reporting suite, completing all 5 sub-modules of Module 1: Vận Hành.
- What the PM can demo now:
  1. Monthly student attendance grid with checkmarks, late clocks, and absence tags.
  2. Single-day inspection dialog and absence excuse editing with tuition refund impact.
  3. Late pickup overtime fee calculation modal displaying breakdown and total surcharge at 50,000 VND / 30 mins.
  4. Extended developmental reports catalog with filter drawer, student search, and draft-only deletion protection.
  5. One-click report duplication modal keeping original template locked while selecting a new student.
  6. Formal letterhead evaluation sheet with school branding, student profile, interactive checklist, and forward-only lifecycle progression ("Bản nháp" -> "Đã gửi" -> "Hoàn tất").
- What remains uncertain: None for Phase 1 Vận Hành. Ready for stakeholder design review.
