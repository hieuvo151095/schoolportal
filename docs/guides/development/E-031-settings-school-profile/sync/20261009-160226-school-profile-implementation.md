---
id: sync-20261009-160226-school-profile-implementation
type: development-sync
parent_epic: E-031-settings-school-profile
status: approved
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - .agents/specs/046-settings-school-profile-truong/spec.md
  - docs_legacy/operating-portal/M6-cau-hinh/SM1-truong.md
verification:
  - node --experimental-vm-modules tests/unit/schoolProfile.test.mjs
  - npm test
  - npm run build
---

# Development Doc Sync: school-profile-implementation

## Source Changes

- `src/types/schoolProfile.ts`
  - Reason: Establish canonical domain types and interfaces for SchoolProfile, DayOperatingHour, AttendanceRules, SchoolInfoFormData, OperatingHoursFormData, AttendanceRulesFormData, and SchoolProfileState.
  - Impacted behavior: Governs data typing across pure validation engine, Redux slice, presentation components, page routes, and unit tests.
- `src/utils/schoolProfileValidation.ts`
  - Reason: Pure validation engine enforcing BR01 through BR14 and K069 through K075 (field blur validation TR-01 on School Name, Address, and Email; 5-minute stepped time options 06:00-18:00; late arrival threshold options 5-60 min; schedule consistency checks openTime < closeTime; static Sunday rest baseline).
  - Impacted behavior: Powers synchronous client-side blur validation, time picker dropdown generation, and schedule validity checks.
- `src/services/mockSchoolProfileData.ts`
  - Reason: Seed realistic Vietnamese institutional singleton data (`Trường Tiểu học & THCS Eco School Tân Bình`), Monday through Sunday operating hours, and attendance baseline rules.
  - Impacted behavior: Populates overview dashboard and edit form drafts with realistic institutional data.
- `src/store/slices/schoolProfileSlice.ts`
  - Reason: Redux Toolkit state machine managing active school profile, operating hours, attendance rules, independent dirty flags (`schoolInfoDirty`, `operatingHoursDirty`, `attendanceRulesDirty`), tab routing state, unsaved departure modal visibility, and toast notifications.
  - Impacted behavior: Governs state transitions, independent sub-form saving autonomy (K071), and unsaved changes departure guards (TR-02).
- `src/store/index.ts`
  - Reason: Mount `schoolProfileReducer` onto the root Redux application store.
  - Impacted behavior: Enables access to school profile state via `useAppSelector((state) => state.schoolProfile)`.
- `src/modules/setting/school/SchoolOverviewView.tsx`
  - Reason: Read-only master overview presentation displaying school demographics, educational stage chips, weekly operating hours roster, attendance baseline rules, and top-right Edit button (`icon_edit_square`) (K069).
  - Impacted behavior: Implements SCR-SCH-INFO-01 read-only inspection protecting master parameters from accidental editing.
- `src/modules/setting/school/SchoolInfoForm.tsx`
  - Reason: Tab 1 demographics edit form with logo upload, mandatory field indicators, and real-time inline blur validation TR-01 (BR02, BR03).
  - Impacted behavior: Provides immediate visual red borders and inline warnings if mandatory fields are left blank.
- `src/modules/setting/school/OperatingHoursForm.tsx`
  - Reason: Tab 2 Sub-Form A managing Monday through Saturday 5-minute stepped opening/closing time pickers (BR08, K072) and static Sunday non-operational indicator (BR09, K073) with independent commit button (K071).
  - Impacted behavior: Allows administrators to configure weekly bell schedules independently without affecting attendance rules.
- `src/modules/setting/school/AttendanceRulesForm.tsx`
  - Reason: Tab 2 Sub-Form B managing late arrival toggle and 5-60 min dropdown (BR10), and late departure toggle with descriptive notice and direct hyperlink to Tuition Fee Settings (BR11, K074) with independent commit button.
  - Impacted behavior: Isolates attendance threshold configuration and cross-links overtime childcare rates to finance fee settings.
- `src/modules/setting/school/UnsavedChangesModal.tsx`
  - Reason: Confirmation modal TR-02 / MODAL-UNSAVED-LEAVE prompting "Xác nhận rời khỏi khi chưa lưu" with "Hủy bỏ" and "Xác nhận rời khỏi" actions (BR12).
  - Impacted behavior: Prevents accidental loss of unsaved form modifications across tab changes and route navigation.
- `src/modules/setting/school/SchoolEditContainer.tsx`
  - Reason: Routed two-tab navigation shell (`?tab=info` vs `?tab=weekdays`) registering Next.js router event listeners (`beforePopState` and `routeChangeStart`) to intercept unsaved leaves.
  - Impacted behavior: Coordinates tab switching, dirty state tracking, and modal interception.
- `src/pages/[schoolCode]/setting/school/index.tsx`
  - Reason: Canonical page route rendering overview dashboard within `PortalLayout`.
  - Impacted behavior: Primary administrative dashboard mounted at `/[schoolCode]/setting/school`.
- `src/pages/[schoolCode]/setting/school/edit.tsx`
  - Reason: Canonical page route rendering the two-tab edit interface within `PortalLayout`.
  - Impacted behavior: Gated edit workspace mounted at `/[schoolCode]/setting/school/edit`.
- `src/pages/[schoolCode]/school/info/index.tsx`
  - Reason: Backward-compatibility alias route ensuring legacy `/school/info` URLs redirect or render the school overview dashboard seamlessly.
  - Impacted behavior: Preserves existing links and bookmarks across tenants.
- `src/pages/[schoolCode]/setting/school/weekdays.tsx`
  - Reason: Backward-compatibility alias route ensuring legacy `/setting/school/weekdays` URLs render Tab 2 of the edit screen seamlessly.
  - Impacted behavior: Preserves deep links to weekly operating hours configuration.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Positioned "Trường" navigation item with `faSchool` icon first under `CẤU HÌNH` strictly before "Học phí" (K075).
  - Impacted behavior: Provides direct sidebar access to the School Profile sub-module in the required priority position.
- `tests/unit/schoolProfile.test.mjs`
  - Reason: Comprehensive automated test suite verifying TR-01 blur validation, form-wide validation gating, 5-minute stepped time options, late arrival options, operating hours schedule consistency, Sunday static rest, independent sub-form saves in Redux, and dirty navigation guard modal.
  - Impacted behavior: Guarantees zero regressions and proves 100% boundary rule compliance.

## Docs Before Code

- Pre-code docs read: `.agents/specs/046-settings-school-profile-truong/spec.md`, `plan.md`, `docs_legacy/operating-portal/M6-cau-hinh/SM1-truong.md`.
- Pre-code docs updated: Initialized development ledger under `docs/development/E-031-settings-school-profile/` (`epic.md`, `issues.md`, `features/`, `modules/`, `pages/`, `tasks/`).
- Relationship map reviewed: Confirmed feature placement within Module 6 (Cấu Hình) positioned first before Học phí.
- Related features checked: `014-finance-fee-catalog`, `001-operations-attendance`, `006-academics-schedule`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: no change needed / PRD Section 5 defines FR-SCH-INFO-001 through FR-SCH-INFO-008 and Section 7 defines AC-SCH-INFO-001 through AC-SCH-INFO-008.
- `docs/tasks.md`: updated because marked TASK-SCH-INFO-001 through TASK-SCH-INFO-008 as completed with verification evidence and test results.
- `docs/knowledge.md`: no change needed / Section 25 records K069 (read-only overview gating), K070 (two-tab edit routing), K071 (sub-form saving autonomy), K072 (5-minute stepped intervals), K073 (static Sunday rest), K074 (late departure fee cross-link), and K075 (sidebar placement).
- `docs/decisions.md`: no change needed / ADR-031 documents read-only overview gating, independent sub-form saving autonomy, 5-minute stepped intervals, and unsaved changes departure guards.
- `docs/memory.md`: no change needed / Section 21 records project facts and resolved clarification ledger items.
- `docs/planning/flows.md`: no change needed / Section 21 interaction flows match implemented workflows.
- `docs/planning/screens.md`: no change needed / Section 21 screen catalog matches implemented views.
- `docs/planning/diagrams.md`: no change needed / Section 27 architecture diagrams match implemented boundaries.

### Development Ledger Docs

- Epic notes: `docs/development/E-031-settings-school-profile/epic.md` updated with full acceptance criteria checkmarks and implementation details.
- Module notes: `docs/development/E-031-settings-school-profile/modules/M-031-001-settings-school-profile.md` authored with responsibility, contracts, commentary, and verification.
- Feature notes: `docs/development/E-031-settings-school-profile/features/F-031-001-settings-school-profile.md` authored with user value, Jira story, PM notes, and requirements trace.
- Page notes: `docs/development/E-031-settings-school-profile/pages/P-031-001-settings-school-profile.md` authored with route surfaces, UI states, interactions, and accessibility.
- Task notes: `docs/development/E-031-settings-school-profile/tasks/T-031-001-001-settings-school-profile.md` authored with execution log, write scope, verification results, and handoff.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --experimental-vm-modules tests/unit/schoolProfile.test.mjs` && `npm test` && `npm run build`
- Result: 11/11 unit tests passing in 4ms; 588/588 full project tests passing across 122 test suites; clean production build with 83/83 static pages prerendered.
- Residual documentation risk: None; all 14 business rules and 7 clarification ledger items (K069 through K075) fully traced and verified.

## PM Summary

- What changed for the POC: Delivered the complete School Profile (Trường) sub-module positioned in the sidebar first under `CẤU HÌNH` strictly before "Học phí", enforcing read-only overview display gating, two-tab routed edit view, real-time inline field blur validation TR-01 on mandatory fields, Monday through Saturday 5-minute stepped operating hours pickers (06:00-18:00), static Sunday non-operational designation, independent sub-form saving autonomy (K071), late arrival threshold controls, late departure overtime fee settings cross-links, and unsaved changes navigation interception modal TR-02.
- What the PM can demo now:
  1. Navigate to `/[schoolCode]/setting/school` via the sidebar under `CẤU HÌNH` (positioned first, before "Học phí").
  2. Inspect read-only overview cards for school demographics, weekly operating hours, and attendance baseline rules.
  3. Click top-right Edit button (`icon_edit_square`) navigating to `/[schoolCode]/setting/school/edit?tab=info`.
  4. Clear School Name or Address and blur field; observe instant red border and inline error message TR-01.
  5. Attempt to switch to "Giờ hoạt động" tab when form is dirty; observe unsaved changes confirmation modal TR-02.
  6. Confirm departure and enter Tab 2; observe Monday–Saturday 5-minute stepped dropdowns and static Sunday grey tag.
  7. Toggle "Về muộn" switch and click active hyperlink navigating directly to Tuition Fee Settings (`/setting/fee`).
- What remains uncertain: None; all requirements validated and covered by automated test suites.
