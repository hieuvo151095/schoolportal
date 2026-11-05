---
id: sync-20260929-162811-setting-fee-implementation
type: development-sync
parent_epic: E-019-settings-fee-configuration
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
verification:
  - node --test tests/unit/settingFee.test.mjs
  - npm test
  - npm run build
---

# Development Doc Sync: setting-fee-implementation

> QUALITY BAR: this note is the audit trail between code and PM docs. It explains all changed files, reasons, evidence, and verification without placeholders.

## Source Changes

- `src/types/settingFee.ts`
  - Reason: Author TypeScript data contracts for all 5 settings blocks, Sepay transactions, operating hours, and Redux state.
  - Impacted behavior: Full type safety for `InvoiceNoteConfig`, `SepayConfig`, `SInvoiceConfig`, `LatePickupConfig`, `MealRefundConfig`, and `ReconciliationEmailConfig`.
- `src/utils/settingFeeValidation.ts`
  - Reason: Implement business validation logic (BR01-BR16, RFC 5322 email checking, bracket table tier invariant, mandatory SInvoice fields).
  - Impacted behavior: Pure validation functions for form submission and dirty block checks.
- `src/services/mockSettingFeeData.ts`
  - Reason: Seed realistic school configuration data and sample Sepay online transactions.
  - Impacted behavior: Initial state population and payment history table data.
- `src/store/slices/settingFeeSlice.ts`
  - Reason: Redux state machine managing isolated dirty flags per block and transaction lists.
  - Impacted behavior: Independent saving/discarding per block, atomic draft mutations.
- `src/store/index.ts`
  - Reason: Register `settingFee` reducer in global store.
  - Impacted behavior: Availability of `state.settingFee` across all components.
- `src/modules/settings/fee/InvoiceNoteBlock.tsx`
  - Reason: Build invoice note configuration card with multiline textarea and save actions.
  - Impacted behavior: UC-01 editable invoice footer note with dirty tracking.
- `src/modules/settings/fee/SepayIntegrationBlock.tsx`
  - Reason: Build Sepay integration card with masked token, eye reveal toggle, and history link.
  - Impacted behavior: UC-02 read-only API secret and webhook callback credentials.
- `src/modules/settings/fee/SInvoiceBlock.tsx`
  - Reason: Build electronic invoice Viettel SInvoice card with 6 mandatory fields and permanently masked password.
  - Impacted behavior: UC-03 collapsible SInvoice configuration with inline validation.
- `src/modules/settings/fee/LatePickupAndRefundBlock.tsx`
  - Reason: Build late pickup fee mode switcher (Fixed vs Tiered) and meal refund rule card.
  - Impacted behavior: UC-04 late pickup billing table and conditional advance-notice meal refund.
- `src/modules/settings/fee/ReconciliationEmailBlock.tsx`
  - Reason: Build reconciliation email recipient list with 3-email cap and duplicate prevention.
  - Impacted behavior: UC-05 reconciliation email tags and deletion.
- `src/modules/settings/fee/UnsavedChangesModal.tsx`
  - Reason: Build unsaved changes route guard confirmation modal.
  - Impacted behavior: Warning dialog on route change when any block is dirty.
- `src/modules/settings/fee/index.ts`
  - Reason: Barrel export for settings fee components.
  - Impacted behavior: Neater component imports.
- `src/pages/[schoolCode]/setting/fee/index.tsx`
  - Reason: Assemble main settings dashboard page with route guard and 5 blocks.
  - Impacted behavior: Full UI for `/[schoolCode]/setting/fee`.
- `src/pages/[schoolCode]/setting/fee/payment-history/index.tsx`
  - Reason: Assemble Sepay payment transaction history page with month filter and search.
  - Impacted behavior: Transaction log view at `/[schoolCode]/setting/fee/payment-history`.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Add CẤU HÌNH navigation section with Học phí menu item.
  - Impacted behavior: Left sidebar navigation to fee configuration.
- `tests/unit/settingFee.test.mjs`
  - Reason: Author 19 automated unit tests verifying business rules and Redux state machine.
  - Impacted behavior: Regression protection and automated test validation.

## Docs Before Code

- Pre-code docs read: `.agents/specs/033-settings-fee-configuration/` specification and acceptance criteria.
- Pre-code docs updated: `docs/development/E-019-settings-fee-configuration/` epic, issues, feature, module, page, and task ledgers.
- Relationship map reviewed: Verified integration with `SM1-truong` operating hours and `SM2-hocphi` billing.
- Related features checked: Verified consistency with `027-finance-invoices` and `029-tuition-management`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated because active scope for Settings Fee Configuration (SM3 - Học Phí) is completed under Module 6 Cấu Hình.
- `docs/tasks.md`: updated because `TASK-SET-001` through `TASK-SET-006` are marked complete with verification evidence.
- `docs/knowledge.md`: updated because K019-K022 rules for SInvoice password masking and late pickup invariants were recorded.
- `docs/decisions.md`: updated because ADR-013 on isolated discrete per-block dirty flags was established.
- `docs/memory.md`: no change needed because active memory is maintained in root AGENTS.md.
- `docs/planning/flows.md`: no change needed because configuration flows align with legacy specifications.
- `docs/planning/screens.md`: updated because screen entries for settings fee and payment history were registered.
- `docs/planning/diagrams.md`: no change needed because architecture diagrams are embedded in development ledger notes.

### Development Ledger Docs

- Epic notes: `docs/development/E-019-settings-fee-configuration/epic.md`
- Module notes: `docs/development/E-019-settings-fee-configuration/modules/M-019-001-settings-fee-configuration.md`
- Feature notes: `docs/development/E-019-settings-fee-configuration/features/F-019-001-settings-fee-configuration.md`
- Page notes: `docs/development/E-019-settings-fee-configuration/pages/P-019-001-settings-fee-configuration.md`
- Task notes: `docs/development/E-019-settings-fee-configuration/tasks/T-019-001-001-settings-fee-configuration.md`

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --test tests/unit/settingFee.test.mjs && npm test && npm run build`
- Result: 19/19 setting fee unit tests passed, 302/302 total repository tests passed, Next.js build compiled 50/50 static pages successfully.
- Residual documentation risk: None. All requirements and edge cases are verified by automated tests and mapped to canonical IDs.

## PM Summary

- What changed for the POC: Built full sub-module Cấu hình Học phí including Ghi chú hóa đơn, Thanh toán tự động Sepay, Hóa đơn điện tử SInvoice, Trả trễ & Báo vắng, Cấu hình đối soát, and Lịch sử thanh toán Sepay.
- What the PM can demo now:
  1. Edit and save invoice footer note with dirty tracking.
  2. Reveal/copy Sepay API secret key and webhook URL, and inspect payment transaction history.
  3. Toggle SInvoice, validate 6 mandatory fields, and verify password masking.
  4. Switch between Fixed and Tiered late pickup calculation modes, manage dynamic bracket tiers with non-deletable Row 1.
  5. Toggle meal refund condition with hours combobox, view read-only Mon-Sat operating schedule, and manage up to 3 reconciliation recipient emails with duplicate validation.
- What remains uncertain: None.
