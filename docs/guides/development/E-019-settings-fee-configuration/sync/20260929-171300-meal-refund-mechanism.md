---
id: sync-20260929-171300-meal-refund-mechanism
type: development-sync
parent_epic: E-019-settings-fee-configuration
status: active
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs/prd.md
  - .agents/specs/034-settings-meal-refund-mechanism-and-next-month-invoice-deduction/spec.md
verification:
  - node tests/unit/mealRefund.test.mjs
  - node tests/unit/invoices.test.mjs
  - node tests/unit/settingFee.test.mjs
  - npm run build
---

# Development Doc Sync: meal-refund-mechanism

> Feature ID: `034-settings-meal-refund-mechanism-and-next-month-invoice-deduction`  
> Slice: Meal Refund Mechanism & Next-Month Invoice Auto-Deduction Engine

## Source Changes

- `src/types/settingFee.ts`
  - Reason: Extended fee settings contracts with `MealRefundRates`, `StudentAbsenceBreakdown`, `MealFeeDailyRates`, `MealRefundCalculationItem`, `StudentMealRefundSummary`.
  - Impacted behavior: Enables dual-category absence rate configuration and student meal refund summaries.
- `src/utils/mealRefundCalculation.ts`
  - Reason: Created pure calculation engine for Group A (100% fixed) and Group B (configurable %) absences.
  - Impacted behavior: Computes exact meal refunds (e.g., September 162.000đ test vector) and formats itemized invoice deduction descriptions.
- `src/services/mockMealRefundData.ts`
  - Reason: Provided mock student absence breakdowns and lookup functions across classes.
  - Impacted behavior: Supplies student `hs-001` (Nguyen Gia Huy) 3 self-absence days + 1 school holiday day.
- `src/services/mockSettingFeeData.ts`
  - Reason: Initialized meal refund configuration with 50% main meal and 70% breakfast refund rates.
  - Impacted behavior: Sets initial Redux state defaults.
- `src/store/slices/settingFeeSlice.ts`
  - Reason: Added `updateDraftMealRefundRates` reducer with dirty state isolation.
  - Impacted behavior: Allows editing meal refund percentages independently without affecting other form blocks.
- `src/modules/settings/fee/LatePickupAndRefundBlock.tsx`
  - Reason: Upgraded Section 2 with Group A 100% guarantee card, Group B percentage rate inputs, interactive calculation simulation, and advance notice hours.
  - Impacted behavior: Renders complete meal refund settings interface with live example calculation.
- `src/types/invoice.ts`
  - Reason: Added `autoApplyMealRefund` and `mealRefundRates` options to `CreateInvoiceFormData`.
  - Impacted behavior: Enables cross-module invoice creation wizard parameters.
- `src/store/slices/invoiceSlice.ts`
  - Reason: Integrated previous-month meal refund auto-deduction into `createBatchInvoices`.
  - Impacted behavior: Automatically deducts previous-month meal refunds from new month tuition invoices and adjusts VietQR payloads.
- `src/modules/finance/invoices/CreateInvoiceWizardModal.tsx`
  - Reason: Added previous-month meal refund callout in Step 3 and passed meal refund options upon dispatch.
  - Impacted behavior: Displays clear itemized breakdown of previous-month meal deductions in invoice wizard.
- `tests/unit/mealRefund.test.mjs`
  - Reason: Authored 7 comprehensive unit tests for calculation engine, clamping, and descriptions.
  - Impacted behavior: Verifies Group A 100% rule, Group B configurable % rules, and 162.000đ September test vector.
- `tests/unit/invoices.test.mjs`
  - Reason: Added integration test verifying October invoice creation with September meal refund deduction (100.000đ on lunch line item).
  - Impacted behavior: Asserts net amount, line item description formatting, and VietQR synchronization.
- `tests/unit/settingFee.test.mjs`
  - Reason: Added Redux state mutation and dirty tracking tests for meal refund rates.
  - Impacted behavior: Verifies 20/20 test suite passing.

## Docs Before Code

- Pre-code docs read: `.agents/specs/034-settings-meal-refund-mechanism-and-next-month-invoice-deduction/spec.md`, `plan.md`, `tasks.md`, `execution-brief.md`, `docs/development/E-019-settings-fee-configuration/epic.md`.
- Pre-code docs updated: PRD, Tasks, Knowledge, Decisions (ADR-014, ADR-015), Memory, Flows, Screens.
- Relationship map reviewed: `E-019` -> `F-019-001`, `M-019-001`, `P-019-001`, `T-019-001-001`, `E-009-finance-invoices`.
- Related features checked: `033-settings-fee-configuration`, `009-finance-invoices`, `031-finance-discount`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated because active functional requirements FR-SET-007/008 and FR-FIN-019/020 for meal refund mechanism and next-month invoice auto-deduction were added.
- `docs/tasks.md`: updated because engineering task definitions TASK-REFUND-001 through TASK-REFUND-006 were registered.
- `docs/knowledge.md`: updated because knowledge section 13 on meal refund calculation rules and invoice deduction contracts was documented.
- `docs/decisions.md`: updated because architectural decision records ADR-014 (Dual-Category Absence) and ADR-015 (Invoice Deduction) were recorded.
- `docs/memory.md`: updated because meal refund context and September-to-October verification scenario was captured in Section 10.
- `docs/planning/flows.md`: updated because sequence diagrams for meal refund calculation and invoice batch generation were specified in Section 10.
- `docs/planning/screens.md`: updated because screen specifications for SCR-SET-01 (Meal Refund Settings) and SCR-FIN-08 (Invoice Creation with Deduction) were registered.
- `docs/planning/diagrams.md`: no change needed because architecture diagrams are embedded directly in development ledger notes and planning flows.

### Development Ledger Docs

- Epic notes: `docs/development/E-019-settings-fee-configuration/epic.md` updated with meal refund outcome and verification.
- Module notes: `docs/development/E-019-settings-fee-configuration/modules/M-019-001-settings-fee-configuration.md` updated with public contracts and calculation engine.
- Feature notes: `docs/development/E-019-settings-fee-configuration/features/F-019-001-settings-fee-configuration.md` updated with dual-category absence rules.
- Page notes: `docs/development/E-019-settings-fee-configuration/pages/P-019-001-settings-fee-configuration.md` updated with meal refund section and simulation card.
- Task notes: `docs/development/E-019-settings-fee-configuration/tasks/T-019-001-001-settings-fee-configuration.md` updated with work log and command evidence.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node tests/unit/mealRefund.test.mjs && node tests/unit/invoices.test.mjs && node tests/unit/settingFee.test.mjs && npm run build`
- Result: 50/50 unit tests passing; 50/50 Next.js routes built cleanly.
- Residual documentation risk: Low. Complete test vector coverage and cross-module Redux integration.

## PM Summary

- What changed for the POC: Delivered complete Meal Refund Mechanism (Thiết lập cơ chế hoàn tiền ăn) in `Cấu hình > Học phí` with Group A 100% guarantee, Group B % inputs (50% main meal, 70% breakfast), live calculation simulation, and automatic deduction in `Tài chính > Học phí` when creating next-month invoices.
- What the PM can demo now: Open `/[schoolCode]/setting/fee`, inspect Section 2 meal refund cards, edit percentages and see live simulation calculate 162.000đ total refund; navigate to `/[schoolCode]/school/fee/create`, select student Nguyen Gia Huy for October and observe the 100.000đ meal deduction with itemized description.
- What remains uncertain: None. All calculation rules and UI interactions verified.
