---
id: sync-20261009-134534-academic-year-implementation
type: development-sync
parent_epic: E-029-school-academic-year
status: approved
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
verification:
  - node --test tests/unit/academicYear.test.mjs
  - npm test
  - npm run build
---

# Development Doc Sync: academic-year-implementation

## Source Changes

- `src/types/academicYear.ts`
  - Reason: Establish canonical domain types and data contracts for AcademicYear, AcademicYearFormData, AcademicYearFilterState, CreateAcademicYearPayload, UpdateAcademicYearPayload, and AcademicYearValidationResult.
  - Impacted behavior: Governs data typing across pure validation engine, Redux slice, presentation components, page routes, and unit tests.
- `src/utils/academicYearValidation.ts`
  - Reason: Pure validation engine enforcing BR01 through BR07, K059 through K063 (dynamic current-year calendar evaluation, minimalist 3-field form validation with endDate >= startDate, diacritic-insensitive search, and display formatting).
  - Impacted behavior: Validates input payloads, dynamically tags active school year, and drives client-side keyword search.
- `src/services/mockAcademicYearData.ts`
  - Reason: Seed realistic Vietnamese academic years (2026-2027 active, semester 1 & 2 sub-periods, past years 2025-2026 & 2024-2025, and future year 2027-2028).
  - Impacted behavior: Populates academic year table roster with realistic data.
- `src/store/slices/academicYearSlice.ts`
  - Reason: Redux Toolkit state machine managing academic year collection, search query, modal open/mode states, and optimistic creation/update mutations.
  - Impacted behavior: Drives instantaneous state transitions across the academic year dashboard.
- `src/store/index.ts`
  - Reason: Mount `academicYearReducer` onto the root Redux application store.
  - Impacted behavior: Enables access to academic year state via `useAppSelector((state) => state.academicYear)`.
- `src/modules/school/academic-year/AcademicYearToolbar.tsx`
  - Reason: Hosts real-time keyword search bar and "+ Tạo năm học" action button.
  - Impacted behavior: Drives client-side search filtering and triggers creation modal.
- `src/modules/school/academic-year/AcademicYearTable.tsx`
  - Reason: Responsive table roster displaying STT, Tên năm học (bold blue `#0070CE` with "Hiện tại" badge chip if active), Ngày bắt đầu, Ngày kết thúc, and Edit button (`faEdit`). Strictly omits delete actions (BR03, K060).
  - Impacted behavior: Primary administrative list view with referential integrity protection.
- `src/modules/school/academic-year/AcademicYearModal.tsx`
  - Reason: Minimalist 3-field modal (Tên năm học, Ngày bắt đầu, Ngày kết thúc) enforcing date ordering validation (`endDate >= startDate`) and disabled submit button gating (BR04, NH-01, K062). Strictly omits manual "Hiện tại" toggle (K059).
  - Impacted behavior: Prevents inverted date ranges and eliminates operator oversight during term turnover.
- `src/pages/[schoolCode]/school/academic-year/index.tsx`
  - Reason: Canonical page route rendering toolbar, table roster, and modal within `PortalLayout`.
  - Impacted behavior: Primary administrative dashboard mounted at `/[schoolCode]/school/academic-year`.
- `src/pages/[schoolCode]/school/season/index.tsx`
  - Reason: Backward-compatibility alias route ensuring legacy `/school/season` URLs render the academic year cockpit seamlessly.
  - Impacted behavior: Preserves existing links and bookmarks across tenants.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Positioned `Năm học` navigation item with `faCalendarCheck` icon strictly after `Lịch sự kiện` under `NHÀ TRƯỜNG`.
  - Impacted behavior: Provides direct sidebar access to the academic year module in the required menu position.
- `tests/unit/academicYear.test.mjs`
  - Reason: Comprehensive automated test suite verifying calendar date evaluation, 3-field validation, search filtering, Redux mutations, and delete omission invariants.
  - Impacted behavior: Guarantees zero regressions and proves 100% boundary rule compliance.

## Docs Before Code

- Pre-code docs read: `.agents/specs/044-school-academic-year-nam-hoc/spec.md`, `plan.md`, `docs_legacy/operating-portal/M5-nha-truong/13. nam-hoc.md`.
- Pre-code docs updated: Initialized development ledger under `docs/development/E-029-school-academic-year/` (`epic.md`, `issues.md`, `features/`, `modules/`, `pages/`, `tasks/`).
- Relationship map reviewed: Confirmed feature placement within Module 5 (Nhà Trường) strictly after Lịch sự kiện.
- Related features checked: `043-school-parent-feedback-gop-y`, `021-school-class-management`, `009-finance-invoices`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: no change needed / PRD Section 5 defines FR-AY-001 through FR-AY-007 and Section 7 defines AC-103 through AC-108.
- `docs/tasks.md`: updated because marked TASK-AY-001 through TASK-AY-007 as completed with verification evidence and test results.
- `docs/knowledge.md`: no change needed / Section 23 records K059 (automated current year), K060 (delete omission), K061 (flexible naming), K062 (3-field modal), and K063 (sidebar placement).
- `docs/decisions.md`: no change needed / ADR-029 documents dynamic calendar scoping, referential deletion omission, and minimalist modal architecture.
- `docs/memory.md`: no change needed / Section 19 records project facts and resolved clarification ledger items.
- `docs/planning/flows.md`: no change needed / Section 19 interaction flows match implemented workflows.
- `docs/planning/screens.md`: no change needed / Section 19 screen catalog matches implemented views.
- `docs/planning/diagrams.md`: no change needed / Section 25 architecture diagrams match implemented boundaries.

### Development Ledger Docs

- Epic notes: `docs/development/E-029-school-academic-year/epic.md` updated with full acceptance criteria checkmarks and implementation details.
- Module notes: `docs/development/E-029-school-academic-year/modules/M-029-001-school-academic-year.md` authored with responsibility, contracts, commentary, and verification.
- Feature notes: `docs/development/E-029-school-academic-year/features/F-029-001-school-academic-year.md` authored with user value, Jira story, PM notes, and requirements trace.
- Page notes: `docs/development/E-029-school-academic-year/pages/P-029-001-school-academic-year.md` authored with route surfaces, UI states, interactions, and accessibility.
- Task notes: `docs/development/E-029-school-academic-year/tasks/T-029-001-001-school-academic-year.md` authored with execution log, write scope, verification results, and handoff.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --test tests/unit/academicYear.test.mjs` && `npm test` && `npm run build`
- Result: 24/24 unit tests passing in 10ms; 546/546 full suite tests passing across 117 test suites; clean production build with 79/79 static pages prerendered.
- Residual documentation risk: None; all 7 business rules and 5 clarification ledger items (K059 through K063) fully traced and verified.

## PM Summary

- What changed for the POC: Delivered the complete School Academic Year (Năm Học) module positioned in the sidebar strictly after Lịch sự kiện, with automated current-year calculation, real-time client-side search, a minimalist 3-field create/edit modal with disabled submit button gating (`endDate >= startDate`), and permanent omission of delete actions to safeguard referential integrity across downstream modules.
- What the PM can demo now:
  1. Access `/[schoolCode]/school/academic-year` from the sidebar navigation (positioned strictly after Lịch sự kiện).
  2. Observe that the active year enclosing today's date automatically displays bold blue text and a green "Hiện tại" badge chip without manual user configuration.
  3. Type into the "Tìm kiếm năm học" input to filter the roster table in real-time (<10ms).
  4. Click "+ Tạo năm học" to open the 3-field modal; observe the "Thêm" button remains disabled until valid name and dates are entered, and shows an inline error if end date precedes start date.
  5. Click Edit on any row to modify dates or title in-place.
  6. Audit the table rows to verify that no delete or trash can icons exist anywhere on the screen.
- What remains uncertain: None; all functional requirements and acceptance criteria verified.
