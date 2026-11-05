---
id: sync-20261014-144915-notification-settings-implementation
type: development-sync
parent_epic: E-035-settings-notifications
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
verification:
  - tests/unit/notificationSettings.test.mjs
---

# Development Doc Sync: notification-settings-implementation

## Source Changes

- `src/types/notificationSettings.ts`
  - Reason: Defines TypeScript domain contracts for all 5 notification sections, state slice, and extracurricular scope options.
  - Impacted behavior: Enforces strict compile-time types across validation, state, and UI.
- `src/utils/notificationSettingsValidation.ts`
  - Reason: Implements pure business logic, calendar overflow fallback arithmetic (BR03, K097), and deep dirty-state checking (BR01, K095).
  - Impacted behavior: Controls button enabling/disabling and ensures reminders set to days 29–31 trigger correctly on shorter months.
- `src/services/mockNotificationSettingsData.ts`
  - Reason: Provides realistic seed data for Eco School Tân Bình.
  - Impacted behavior: Populates initial school notification settings and extracurricular class options.
- `src/store/slices/notificationSettingsSlice.ts`
  - Reason: Manages interactive form state, working edits, confirmation modal lifecycle, and atomic persistence.
  - Impacted behavior: Provides Redux actions for every switch toggle and input in the form.
- `src/store/index.ts`
  - Reason: Registers `notificationSettingsReducer` in the central Redux store.
  - Impacted behavior: Makes notification state globally accessible to portal components.
- `src/modules/setting/notification/NotificationPolicyBanner.tsx`
  - Reason: Renders top informational banner detailing the 3 core principles (BR03, K097).
  - Impacted behavior: Displays school-wide scope, multi-platform push, and calendar overflow rule.
- `src/modules/setting/notification/AttendanceNotificationCard.tsx`
  - Reason: Implements Section 1 UI with fixed 17:00 time and extracurricular class selector.
  - Impacted behavior: Provides teacher reminder switches and extracurricular parent/teacher notification options.
- `src/modules/setting/notification/BirthdayNotificationCard.tsx`
  - Reason: Implements Section 2 UI with shared parameter row without toggle (BR04, K098).
  - Impacted behavior: Allows configuring day (1–31) and time for teacher and admin birthday alerts.
- `src/modules/setting/notification/TuitionNotificationCard.tsx`
  - Reason: Implements Section 3 UI with tuition modification toggles, grace period, and directional due dates.
  - Impacted behavior: Allows selecting "Trước hạn" vs "Sau hạn" with day count (1–31).
- `src/modules/setting/notification/OtherNotificationCard.tsx`
  - Reason: Implements Section 4 UI with dual Web/Email switches and fixed 20:00 time (BR05, BR06, K099, K100).
  - Impacted behavior: Enables email delivery only for activities awaiting approval and daily journal logs.
- `src/modules/setting/notification/ParentNotificationCard.tsx`
  - Reason: Implements Section 5 UI with orange-highlighted action verbs (BR10, K103).
  - Impacted behavior: Provides toggles for attendance, activity, and media guardian push alerts.
- `src/modules/setting/notification/NotificationActionBar.tsx`
  - Reason: Implements sticky bottom action bar with single "Cập nhật" button and reset action.
  - Impacted behavior: Triggers modal confirmation when dirty state is active.
- `src/modules/setting/notification/NotificationConfirmModal.tsx`
  - Reason: Implements guarded safety dialog prompting *"Vui lòng xác nhận thay đổi cấu hình thông báo của trường!"* (BR02, K096).
  - Impacted behavior: Commits state on confirm; retains working edits on cancel.
- `src/modules/setting/notification/NotificationSettingsShell.tsx`
  - Reason: Container shell assembling breadcrumbs, title, banner, cards 1 to 5, action bar, and modal.
  - Impacted behavior: Provides layout structure and global success toast messaging.
- `src/pages/[schoolCode]/setting/notification/index.tsx`
  - Reason: Canonical page route mounted under Next.js Pages router.
  - Impacted behavior: Resolves `/[schoolCode]/setting/notification` wrapped in PortalLayout.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Adds "Thông báo" navigation item sixth under CẤU HÌNH with `faBell`.
  - Impacted behavior: Enables administrators to access the notification settings page from the sidebar menu.
- `tests/unit/notificationSettings.test.mjs`
  - Reason: Comprehensive automated unit test suite covering BR01–BR10 and K095–K104.
  - Impacted behavior: Asserts 100% test pass rate across leap years, dirty states, and Redux actions.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/M6-cau-hinh/SM6-thong-bao.md`, `docs/prd.md`, `docs/tasks.md`, `docs/knowledge.md`, `docs/decisions.md`.
- Pre-code docs updated: `docs/prd.md` (Phân hệ 5.5), `docs/tasks.md` (Phase 4.5), `docs/knowledge.md` (Section 29), `docs/decisions.md` (ADR-035), `docs/memory.md` (Section 25), `docs/planning/flows.md` (Section 25), `docs/planning/screens.md` (SCR-NOTIF-01), `docs/planning/diagrams.md` (Section 31).
- Relationship map reviewed: Confirmed placement sixth under `CẤU HÌNH` strictly following "Tính năng".
- Related features checked: Confirmed alignment with `048-settings-face-recognition-nhan-dien` and `049-settings-feature-flags-tinh-nang`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated because Phân hệ 5.5 covering FR-NOTIF-001 through FR-NOTIF-009 and AC-146 through AC-154 needed authoritative specification.
- `docs/tasks.md`: updated because marked TASK-NOTIF-001 through TASK-NOTIF-008 as completed with verification evidence and test results.
- `docs/knowledge.md`: updated because Section 29 detailing architectural invariants K095–K104 and "Never Do" list needed explicit operational recording.
- `docs/decisions.md`: updated because ADR-035 detailing monolithic form, modal confirmation, and calendar overflow fallback needed architectural decision recording.
- `docs/memory.md`: updated because Section 25 recording architectural resolutions K095 through K104 needed persistent memory capture.
- `docs/planning/flows.md`: updated because Sequence Flows 1 & 2 for monolithic modal save and multi-channel dispatch needed sequence modeling.
- `docs/planning/screens.md`: updated because screen catalog SCR-NOTIF-01 and modal MODAL-NOTIF-01 needed layout contracts.
- `docs/planning/diagrams.md`: updated because Section 31 container diagram, state machine, and fallback pipeline needed architectural visualization.

### Development Ledger Docs

- Epic notes: Created `docs/development/E-035-settings-notifications/epic.md` documenting outcomes, Jira story, risks, and acceptance criteria.
- Module notes: Created `docs/development/E-035-settings-notifications/modules/M-035-001-settings-notifications.md` defining ownership and contracts.
- Feature notes: Created `docs/development/E-035-settings-notifications/features/F-035-001-settings-notifications.md` detailing user value and business rules.
- Page notes: Created `docs/development/E-035-settings-notifications/pages/P-035-001-settings-notifications.md` detailing canonical routes and sidebar mounting.
- Task notes: Created `docs/development/E-035-settings-notifications/tasks/T-035-001-001-settings-notifications.md` with QA evidence.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test && npm run build`
- Result: 665/665 unit tests pass, static build pre-renders all 93 routes with zero errors.
- Evidence: 19/19 passing tests in tests/unit/notificationSettings.test.mjs and clean Next.js build.
- Decision: Retain monolithic state architecture because atomic saves prevent configuration mismatch.
- Impact: School-wide broadcast rules are completely synchronized with zero side-effects.
- Risk: Handled via adjustDayForMonth arithmetic preventing missed notifications in shorter months.
- Residual documentation risk: None; all specifications and development ledgers are completely synchronized.

## PM Summary

- What changed for the POC: M6 Cấu hình now features a complete, robust Notification Settings cockpit at `/demo/setting/notification`.
- What the PM can demo now: Inspecting the policy banner, toggling multi-channel switches, configuring relative tuition due dates, triggering dirty-state action bar, confirming via modal dialog, and receiving immediate toast feedback.
- What remains uncertain: None; all 10 business rules and regulatory anti-spam/privacy requirements are fully satisfied.
