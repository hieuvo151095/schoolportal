---
id: sync-20260921-130258-finance-discount-implementation
type: development-sync
parent_epic: E-017-finance-discount
status: published
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
  - docs/development/E-017-finance-discount/epic.md
  - docs/development/E-017-finance-discount/features/F-017-001-finance-discount.md
verification:
  - npm test
  - npm run build
---

# Development Doc Sync: finance-discount-implementation

> QUALITY BAR: this note is the audit trail between code and PM docs. It must
> explain the changed files, why docs changed or stayed unchanged, evidence, and
> remaining risk. Do not leave placeholders, generic decisions, or unchecked
> policy items.

## Source Changes

- `src/types/discount.ts`
  - Reason: Defines complete TypeScript data contracts for tuition exemption and discount policy management.
  - Impacted behavior: Governs `DiscountPolicy`, `DiscountTarget`, `InvoiceDiscountLine`, `DiscountFilterState`, and creation/edit payloads across the finance domain.
- `src/utils/discountValidation.ts`
  - Reason: Core business rules, calculation engine, and formatting utilities.
  - Impacted behavior: Implements percentage/fixed deduction arithmetic, non-negative clamping, temporal state machine (K017), Scope Specificity (student overrides class), disjoint line-item independence, and payload validation.
- `src/services/mockDiscountData.ts`
  - Reason: Seed data for discount policies, available fee items, classes, and students.
  - Impacted behavior: Provides realistic Vietnamese K-12 fee catalog items and student records for demo and testing.
- `src/store/slices/discountSlice.ts`
  - Reason: Redux state machine for discount policy management.
  - Impacted behavior: Manages state for policies, active search/status filters, modal view models, creation, editing, pausing/resuming, and deleting.
- `src/store/index.ts`
  - Reason: Registers `discountReducer` in the root Redux store.
  - Impacted behavior: Exposes `state.discount` across the portal application.
- `src/modules/finance/discount/discountExport.ts`
  - Reason: Client-side spreadsheet export generator.
  - Impacted behavior: Generates Excel-compatible UTF-8 BOM CSV exports with full Vietnamese diacritics and formatted policy metadata.
- `src/modules/finance/discount/StudentPickerModal.tsx`
  - Reason: Modal for searching and selecting individual student beneficiaries across classes.
  - Impacted behavior: Provides search, class filtering, select all / clear all, and selection counter.
- `src/modules/finance/discount/BeneficiaryModal.tsx`
  - Reason: Modal for inspecting policy recipients.
  - Impacted behavior: Renders classes or students with homeroom details and active status.
- `src/modules/finance/discount/CreateDiscountPolicyModal.tsx`
  - Reason: Main creation and editing modal for discount policies.
  - Impacted behavior: Implements dual calculation controls (% vs fixed), dual scope selectors, period configuration, quick reason chips, and form validation.
- `src/modules/finance/discount/DiscountToolbar.tsx`
  - Reason: Filter and action toolbar.
  - Impacted behavior: Integrates multi-factor search, status filter tabs (Tất cả, Đang hoạt động, Ngừng áp dụng, Hết hạn), fee item dropdown, Excel export, and create modal trigger.
- `src/modules/finance/discount/DiscountTable.tsx`
  - Reason: Full-width responsive table for policy roster.
  - Impacted behavior: Sentence-case headers, status badges, beneficiary count buttons, action icons (edit, pause/resume, delete), and delete confirmation modal.
- `src/modules/finance/invoices/CreateInvoiceWizardModal.tsx`
  - Reason: Invoicing integration with automatic discount deduction evaluation.
  - Impacted behavior: Step 1 administrative toggle ("Tự động áp dụng chính sách miễn giảm", default ON) and Step 3 itemized deduction lines (`Miễn giảm: {policyName} (-X đ)`).
- `src/components/layout/PortalLayout.tsx`
  - Reason: Portal sidebar navigation update.
  - Impacted behavior: Adds "Miễn giảm" link with `faPercent` icon under "TÀI CHÍNH" pointing to `/[schoolCode]/school/discount`.
- `src/pages/[schoolCode]/school/discount/index.tsx`
  - Reason: Next.js page route for the Miễn giảm sub-module.
  - Impacted behavior: Full-width layout `w-full space-y-6` with summary metric cards, toolbar, table, and modals.
- `tests/unit/discount.test.mjs`
  - Reason: Comprehensive unit test suite with 10 test vectors.
  - Impacted behavior: Verifies calculation arithmetic, clamping, temporal expiration, scope specificity, independence, form validation, filter matching, and Redux mutations.

## Docs Before Code

- Pre-code docs read: `.agents/specs/031-finance-tuition-exemption-and-discount-management/`, `docs/development/E-017-finance-discount/`
- Pre-code docs updated: `docs/development/E-017-finance-discount/features/F-017-001-finance-discount.md`, `modules/M-017-001-finance-discount.md`, `pages/P-017-001-finance-discount.md`, `tasks/T-017-001-001-finance-discount.md`
- Relationship map reviewed: Verified integration with `src/modules/finance/invoices` and `src/components/layout/PortalLayout.tsx`.
- Related features checked: Checked interaction with fee catalog (`src/types/schoolFee.ts`) and billing rosters (`src/types/invoice.ts`).

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated because active scope for Tuition Exemption & Fee Discount Management is completed.
- `docs/tasks.md`: updated because `TASK-FIN-006` through `TASK-FIN-009` are marked complete.
- `docs/knowledge.md`: no change needed / preserved ADR-012, Resolution K016, Resolution K017, and Resolution K018.
- `docs/decisions.md`: no change needed / ADR-012 architecture decision record is retained.
- `docs/memory.md`: no change needed / synced via AGENTS.md.
- `docs/planning/flows.md`: no change needed / flows aligned with user specification.
- `docs/planning/screens.md`: no change needed / screen definitions aligned with P-017-001.
- `docs/planning/diagrams.md`: no change needed / sequence and state machine captured in ledger.

### Development Ledger Docs

- Epic notes: `docs/development/E-017-finance-discount/epic.md` updated to reflect completed tasks.
- Module notes: `docs/development/E-017-finance-discount/modules/M-017-001-finance-discount.md` updated with implementation details.
- Feature notes: `docs/development/E-017-finance-discount/features/F-017-001-finance-discount.md` updated with completed status.
- Page notes: `docs/development/E-017-finance-discount/pages/P-017-001-finance-discount.md` verified full-width frame layout.
- Task notes: `docs/development/E-017-finance-discount/tasks/T-017-001-001-finance-discount.md` marked completed with test verification evidence.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test && npm run build`
- Result: 253/253 unit tests passing (10/10 discount test vectors in 5.2ms). Next.js production build succeeded with static prerendering on 45/45 pages.
- Residual documentation risk: None. All development docs and sync logs match active codebase.

## PM Summary

- What changed for the POC: The new "Miễn giảm" sub-module under Finance ("Tài chính -> Miễn giảm") is fully operational at `/[schoolCode]/school/discount` with complete policy CRUD, beneficiary management, Excel export, full-width frame styling, and automatic deduction integration into invoice creation.
- What the PM can demo now:
  1. Accessing `Tài chính` -> `Miễn giảm` from the main sidebar.
  2. Viewing the policy roster with active summary statistics and filter tabs (Tất cả, Đang hoạt động, Ngừng áp dụng, Hết hạn).
  3. Clicking on beneficiary counts to inspect assigned classes or student rosters.
  4. Creating a new policy with percentage or fixed VND discounts, multi-class selection or student picker modal, academic year or month range validity, and quick-insert reason chips.
  5. Pausing and resuming policies with live status re-evaluation (Resolution K017).
  6. Exporting policies to Excel-compatible CSV with UTF-8 BOM.
  7. Opening invoice creation (`/school/fee/create`) to demonstrate the "Tự động áp dụng chính sách miễn giảm" toggle and itemized deduction lines.
- What remains uncertain: None. All requirements from the user request and ADR-012/K016-K018 are implemented and verified.
