---
id: sync-20261014-142211-feature-flags-implementation
type: development-sync
parent_epic: E-034-settings-features
status: complete
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - .agents/specs/049-settings-feature-flags-tinh-nang/spec.md
  - docs_legacy/operating-portal/M6-cau-hinh/SM5-tinh-nang.md
verification:
  - node --experimental-strip-types --test tests/unit/featureFlags.test.mjs
  - npm test
  - npm run build
---

# Development Doc Sync: feature-flags-implementation

## Source Changes

- `src/types/featureFlags.ts`
  - Reason: Define complete TypeScript domain types and contracts.
  - Impacted behavior: Exports `ActivityFeatureSettings`, `AcademicTerm`, `AcademicYearOption`, `InlineTermDraft`, `InlineTermEditState`, and `FeatureFlagsState`.
- `src/utils/featureFlagsValidation.ts`
  - Reason: Pure validation engine enforcing BR01 through BR10 and K089 through K094.
  - Impacted behavior: Dirty state tracking (`isActivitySettingsDirty`), 2-term capacity checking (`canAddTerm`, `isAddTermLocked`), single-row edit locking (`isTermEditingLocked`), date formatting (`formatDateDisplay`, `normalizeDateForInput`), and draft validation (`validateTermDraft`).
- `src/services/mockFeatureFlagsData.ts`
  - Reason: Realistic seed fixtures across academic years and semester terms.
  - Impacted behavior: Supplies 4 academic year options (current 2026-2027, past 2025-2026 and 2024-2025, upcoming 2027-2028 with 0 terms) and initial activity settings.
- `src/store/slices/featureFlagsSlice.ts`
  - Reason: Redux state machine for toggles, academic year selection, and inline term CRUD operations.
  - Impacted behavior: Manages activity comment toggle divergence, academic year selection, inline term draft mutations, term persistence, and toast feedback.
- `src/store/index.ts`
  - Reason: Mount `featureFlagsReducer` in root store.
  - Impacted behavior: Exposes `featureFlags` state to `useAppSelector` and `useAppDispatch`.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Sidebar menu integration according to K089.
  - Impacted behavior: Adds "Tính năng" fifth under `CẤU HÌNH` with `faToggleOn` strictly following "Nhận diện".
- `src/modules/setting/features/FeatureFlagsTabs.tsx`
  - Reason: Tab navigation bar linking Tab Hoạt Động and Tab Học Kỳ.
  - Impacted behavior: Highlights active tab with blue underline indicator and badges based on URL pathname.
- `src/modules/setting/features/ActivitySettingsTab.tsx`
  - Reason: Presentation component for interactive activity feed settings.
  - Impacted behavior: Provides decoupled toggles for "Bình luận" and "Duyệt bình luận", enforces dirty-state "Cập nhật" button invariant, and triggers toast notification.
- `src/modules/setting/features/PeriodSettingsTab.tsx`
  - Reason: Presentation component for academic year and term schedule management.
  - Impacted behavior: Selects school years with `(Hiện tại)` indicator, disables "+ Thêm học kỳ" at 2 terms, renders clean empty state row for empty years, and coordinates inline row editing.
- `src/modules/setting/features/InlineTermRow.tsx`
  - Reason: Inline table row component supporting read-only and editable modes.
  - Impacted behavior: Switches to input fields on edit, provides green tick (Save) and gray X (Cancel) action buttons, and disables edit buttons on sibling rows while one row is editing.
- `src/pages/[schoolCode]/setting/activity/index.tsx`
  - Reason: Canonical Next.js page route for Tab Hoạt Động.
  - Impacted behavior: Serves `/[schoolCode]/setting/activity` wrapped in `PortalLayout`.
- `src/pages/[schoolCode]/setting/period/index.tsx`
  - Reason: Canonical Next.js page route for Tab Học Kỳ.
  - Impacted behavior: Serves `/[schoolCode]/setting/period` wrapped in `PortalLayout`.
- `src/pages/[schoolCode]/setting/features/index.tsx`
  - Reason: Redirect alias to preserve backward compatibility.
  - Impacted behavior: Automatically redirects `/setting/features` to `/setting/activity`.
- `tests/unit/featureFlags.test.mjs`
  - Reason: Automated unit test suite verifying BR01–BR10 and K089–K094.
  - Impacted behavior: 17 unit tests passing with 100% assertion success.

## Docs Before Code

- Pre-code docs read: `.agents/specs/049-settings-feature-flags-tinh-nang/spec.md`, `docs_legacy/operating-portal/M6-cau-hinh/SM5-tinh-nang.md`, `docs/tasks.md`.
- Pre-code docs updated: `docs/tasks.md` (all tasks marked complete), `docs/development/development_manifest.json` (registered E-034).
- Relationship map reviewed: Checked `E-033-settings-face-recognition`, `E-002-operations-activity`, `E-006-academics-schedule`.
- Related features checked: Comment toggles in `E-002-operations-activity` and term dates in `E-006-academics-schedule`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: no change needed / PRD Section 5 defines administrative settings and configuration scope.
- `docs/tasks.md`: updated because marked TASK-FEAT-001 through TASK-FEAT-008 as completed with verification evidence and test results.
- `docs/knowledge.md`: no change needed / Decisions K089 through K094 record Feature Flags & Academic Terms architectural boundaries.
- `docs/decisions.md`: no change needed / Decisions K089 through K094 recorded in feature specification and epic ledger.
- `docs/memory.md`: no change needed / Session memory tracks active feature progress and verification facts.
- `docs/planning/flows.md`: no change needed / Feature flags and term management flows match implemented workflows.
- `docs/planning/screens.md`: no change needed / Screen catalog matches implemented views at setting/activity and setting/period.
- `docs/planning/diagrams.md`: no change needed / Architecture diagrams match implemented boundaries.

### Development Ledger Docs

- Epic notes: Created `docs/development/E-034-settings-features/epic.md` documenting outcomes, Jira story, risks, and acceptance criteria.
- Module notes: Created `docs/development/E-034-settings-features/modules/M-034-001-settings-features.md` defining ownership and contracts.
- Feature notes: Created `docs/development/E-034-settings-features/features/F-034-001-settings-features.md` detailing user value and business rules.
- Page notes: Created `docs/development/E-034-settings-features/pages/P-034-001-settings-features.md` detailing canonical routes and sidebar mounting.
- Task notes: Created `docs/development/E-034-settings-features/tasks/T-034-001-001-settings-features.md` with QA evidence.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --experimental-strip-types --test tests/unit/featureFlags.test.mjs && npm test && npm run build`
- Result: 17/17 feature flags tests passing; 646/646 project tests passing across 122 suites; Next.js build exits with 0 and generates 92 static pages.
- Residual documentation risk: None.

## PM Summary

- What changed for the POC: Delivered the feature flags & academic term configuration sub-module under `CẤU HÌNH > Tính năng` allowing administrators to configure activity comment toggles and establish semester term calendars.
- What the PM can demo now: Open `http://localhost:3000/demo/setting/activity`, toggle "Bình luận" to activate "Cập nhật", save changes to view toast feedback, switch to `http://localhost:3000/demo/setting/period`, select school years, view the 2-term capacity limit disable adding on 2026-2027, edit terms inline with tick/cancel buttons, and observe empty state on 2027-2028.
- What remains uncertain: None; all specifications and business rules are verified.
