---
id: sync-20260930-161338-reconciliation-school-group-year-red-frame-removal
type: development-sync
parent_epic: E-019-settings-fee-configuration
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs/prd.md
  - docs_legacy/operating-portal/M6-cau-hinh/SM3-hoc-phi.md
verification:
  - node --test tests/unit/settingFee.test.mjs
  - node --test tests/unit/*.test.mjs
  - npm run build
---

# Development Doc Sync: reconciliation-school-group-year-red-frame-removal

> Feature Context: School Group Reconciliation Configuration (`Cấu hình đối soát & Nhóm trường`)  
> Focus: Sub-period removal for "Đối soát theo năm" & Mock Data Synchronization across all school groups.

## Source Changes

- `src/types/settingFee.ts`
  - Reason: Added contracts for `ReconciliationUnit`, `ReconciliationScheduleType`, `ReconciliationTermItem`, `ReconciliationThresholdConfig`, `SchoolGroupReconciliationConfig`, and updated `SettingFeeState`.
  - Impacted behavior: Enables structured school group reconciliation state modeling with `terms: []` empty invariant for year mode.
- `src/services/mockSettingFeeData.ts`
  - Reason: Seeded mock school groups (`UATTEST2`, `nhomtruonghethong`, `Tuantest1`, `truongthuanthoi`) with `scheduleType: 'year'` and `terms: []` (empty array, zero sub-periods).
  - Impacted behavior: Default mock records now reflect the verified business rule where annual packages have no term breakdowns.
- `src/utils/settingFeeValidation.ts`
  - Reason: Implemented `generateTermsForSchedule` and `validateSchoolGroupConfig`.
  - Impacted behavior: `generateTermsForSchedule` returns `[]` when `scheduleType === 'year'` and generates term slices only when `scheduleType === 'term'`.
- `src/store/slices/settingFeeSlice.ts`
  - Reason: Added modal controls (`openSchoolGroupModal`, `closeSchoolGroupModal`), draft mutators, and automatic term purging when switching `scheduleType` to `'year'`.
  - Impacted behavior: Switching to "1. Đối soát theo năm" immediately clears the sub-periods array and locks `termCount` to 1.
- `src/modules/settings/fee/SchoolGroupReconciliationModal.tsx`
  - Reason: Created slide-over drawer modal for School Group Reconciliation settings (Sections 2, 3, 4).
  - Impacted behavior: Section 3 renders an informational alert for "Đối soát theo năm" and completely omits/deletes the sub-periods table (the red frame). Renders sub-periods table only for "Đối soát theo kỳ".
- `src/modules/settings/fee/ReconciliationEmailBlock.tsx`
  - Reason: Upgraded Block 5 to show the School Group Roster Table with "Chỉnh sửa" actions and drawer trigger.
  - Impacted behavior: Displays list of school groups and opens group update modal on click.
- `src/modules/settings/fee/index.ts`
  - Reason: Exported `SchoolGroupReconciliationModal`.
  - Impacted behavior: Clean component public interface.
- `tests/unit/settingFee.test.mjs`
  - Reason: Authored 5 new unit tests verifying mock data defaults, modal state isolation, schedule mode toggling with red frame deletion, and validation invariants.
  - Impacted behavior: Ensures regression coverage (25/25 settingFee tests and 316/316 repo-wide tests passing).

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/M6-cau-hinh/SM3-hoc-phi.md`, `docs/development/E-019-settings-fee-configuration/epic.md`, `.agents/specs/033-settings-fee-configuration/spec.md`.
- Pre-code docs updated: `docs/prd.md`, `docs/tasks.md`, `docs/knowledge.md`, `docs/decisions.md`.
- Relationship map reviewed: Verified integration between `E-019` settings fee, `E-013` reconciliation, and `SM3-hoc-phi`.
- Related features checked: `033-settings-fee-configuration`, `034-settings-meal-refund-mechanism-and-next-month-invoice-deduction`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated because School Group Reconciliation schedule modes (Year vs Term) and sub-period deletion rules were specified.
- `docs/tasks.md`: updated because task for school group reconciliation sub-period removal was logged.
- `docs/knowledge.md`: updated because knowledge entry on annual reconciliation single-package invariant (K023) was recorded.
- `docs/decisions.md`: updated because ADR-016 (Annual Reconciliation Single-Package Invariant) was added.
- `docs/memory.md`: no change needed because active session log is maintained in root AGENTS.md.
- `docs/planning/flows.md`: no change needed because configuration modal flows match standard drawer interactions.
- `docs/planning/screens.md`: updated because screen SCR-SET-04 for School Group Reconciliation drawer was registered.
- `docs/planning/diagrams.md`: no change needed because architecture topology remains consistent.

### Development Ledger Docs

- Epic notes: `docs/development/E-019-settings-fee-configuration/epic.md` updated with school group reconciliation verification.
- Module notes: `docs/development/E-019-settings-fee-configuration/modules/M-019-001-settings-fee-configuration.md` updated with `SchoolGroupReconciliationConfig` contracts.
- Feature notes: `docs/development/E-019-settings-fee-configuration/features/F-019-001-settings-fee-configuration.md` updated with sub-period removal behavior.
- Page notes: `docs/development/E-019-settings-fee-configuration/pages/P-019-001-settings-fee-configuration.md` updated with School Group Roster and Drawer modal.
- Task notes: `docs/development/E-019-settings-fee-configuration/tasks/T-019-001-001-settings-fee-configuration.md` updated with latest test verification.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --test tests/unit/settingFee.test.mjs && node --test tests/unit/*.test.mjs && npm run build`
- Result: 25/25 settingFee tests passed; 316/316 repo tests passed; Next.js 50/50 static routes compiled cleanly.
- Evidence: Concrete verification evidence recorded in automated tests `tests/unit/settingFee.test.mjs` and Next.js static build report.
- Residual documentation risk: None; all types, mock datasets, UI components, and unit tests are synchronized.

## PM Summary

- What changed for the POC: In `Cấu hình > Học phí`, Section 5 now displays the School Group Reconciliation Roster ("Danh sách nhóm trường đối soát"). In the "Cập nhật nhóm trường" modal, when "1. Đối soát theo năm" is active, the sub-periods table (the red frame) is completely deleted/hidden and all mock data reflects `terms: []`.
- What the PM can demo now: Open `http://localhost:3000/demo/setting/fee`, inspect the school groups table, click "Chỉnh sửa" on `UATTEST2` or `nhomtruonghethong`, see "1. Đối soát theo năm" with no sub-periods table, switch to "2. Đối soát theo kỳ" to see "Sinh lịch kỳ" generate terms, and switch back to see terms automatically deleted.
- What remains uncertain: None.
