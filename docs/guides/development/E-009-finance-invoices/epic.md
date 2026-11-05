---
id: E-009-finance-invoices
type: epic
parent_epic: root
status: active
owner_skill: sophia-product-manager
source_trace:
  - docs/prd.md
  - docs/tasks.md
  - docs_legacy/operating-portal/tai-chinh/hoc-phi.md
verification:
  - tests/unit/invoices.test.mjs
jira:
  story: "As a school accountant, I want an end-to-end tuition billing roster and invoice lifecycle manager with VietQR payment codes and automated meal deductions so that parents can pay easily and reconciliation is accurate."
  priority: P1
  labels:
    - finance
    - tuition-billing
    - vietqr
    - meal-deduction
---

# Epic: Finance Invoices (Học Phí & Hóa Đơn)

## Jira Story

- Story: As a school accountant, I want an end-to-end tuition billing roster and invoice lifecycle manager with VietQR payment codes and automated meal deductions so that parents can pay easily and reconciliation is accurate.
- Jira issue type: Epic
- Acceptance owner: `sophia-product-manager`
- Product hypothesis: Providing automated meal deductions and individual VietQR codes per invoice will decrease fee collection delays by 60% and reduce reconciliation discrepancies by 90%.
- Research evidence: Legacy operating portal audit in `docs_legacy/operating-portal/tai-chinh/hoc-phi.md` confirmed that schools require flexible billing scopes (Whole School, Grade Level, Specific Class, or Individual Student), automatic overdue state transitions after 2 days, and cumulative payment recording.

## Priority

- Priority: P1
- Severity if missed: Blocker for school revenue operations and parent fee collection.
- Rationale: Core monetization and cash flow module for the operating platform.
- Target release: School Operating Portal Phase 1 Core

## Outcome

The Finance Invoices sub-module delivers enterprise-grade tuition billing operations for Vietnamese schools. It manages student fee collections across diverse cost structures: standard tuition, meal fees, late pickup surcharges, extracurricular clubs, facility upkeep, and miscellaneous line items. The module supports a full 6-state financial lifecycle: Draft (`da_tao`), Dispatched (`da_gui`), Paid (`da_thanh_toan`), Partially Paid (`thanh_toan_mot_phan`), Overdue (`qua_han`), and Cancelled (`da_huy`).

Every invoice dynamically synthesizes VietQR payment codes containing exact bank transfer amounts and structured narrative tags (`HOCPHI {invoiceNo}`). By integrating attendance records from Module 1, the invoice creation wizard automatically deducts daily meal charges for recorded excused absences, eliminating manual reconciliation errors. Furthermore, the system records an immutable, cumulative payment history supporting both automated payment gateway confirmations and manual receipt vouchers.

## PM Notes

- PM-visible status: Production-ready financial billing interface with real-time payment status tracking.
- Demo narrative: The accountant opens the fee catalog for September 2026, generates batch invoices for Class 6A1 with automatic meal deductions calculated from student absence logs, views a student invoice detail with an active VietQR code, logs an automated payment installment, and observes the cumulative payment ledger update in real time.
- Acceptance impact: Validates TASK-FIN-001 and TASK-FIN-002 requirements.
- Scope change since planning: Clarified VietQR payment reference syntax and ensured published terms switch from destructive overrides to cumulative payment logging.
- Risk or open decision: Ensuring automated payment webhooks and manual cash receipts share the identical payment history ledger without race conditions.

## Scope

- Included: Student-centric tuition roster, 6-state lifecycle tracking, asymmetric action matrix, batch toolbar, multi-scope creation wizard, automated meal deduction engine, 6 line item categories, VietQR generation, and extended filter modal.
- Excluded: Live third-party bank settlement webhooks and physical receipt printer hardware drivers.

## Feature Boundaries

- `F-009-001-finance-invoices`

## Relationship Map

| Relation | Target | Label | Rationale |
| :--- | :--- | :--- | :--- |
| Enables | `F-009-001-finance-invoices` | `ENABLES` | Unlocks user-facing invoice rosters, generation wizards, and payment logs. |
| Depends on | `E-001-operations-attendance` | `DEPENDS_ON` | Pulls excused absence tallies for automated meal fee deduction calculations. |
| Relates to | `docs/tasks.md#TASK-FIN-001` | `IMPLEMENTS` | Fulfills tuition invoice catalog and lifecycle management task. |
| Relates to | `docs/tasks.md#TASK-FIN-002` | `IMPLEMENTS` | Fulfills automated meal deduction logic integration task. |
| Blocks | `docs/tasks.md#TASK-FIN-005` | `BLOCKS` | Invoicing roster is required before payment reconciliation and collection reporting. |

## Issues

| Issue ID | Source | Priority | Status | Owner | Evidence | Resolution |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `ISSUE-E-009-001` | QA review | P1 | Closed | `alan-tech-lead` | Duplicate invoice creation risk for students already fully paid for the month. | Pre-check filter skips students who already possess an invoice in the selected month. |
| `ISSUE-E-009-002` | BA review | P2 | Closed | `benny-frontend-engineer` | Legacy static label defect on paid invoices ("THANH TOÁN: Chưa có thông tin thanh toán"). | Dynamic status banner displays "Đã thanh toán đủ" and hides unsettled transfer prompt. |
| `ISSUE-E-009-003` | Tech review | P2 | Closed | `alan-tech-lead` | Meal deduction arithmetic could generate decimal fractions if calculated via floating points. | Math rounded to exact integer VND units: deduction = excusedAbsence * mealDailyRate. |
| `ISSUE-E-009-004` | QA review | P2 | Closed | `ada-qa-agent` | Selecting mixed-state invoices in batch mode could allow invalid actions. | Action dropdown filters options dynamically to intersection of valid operations. |

## Acceptance Criteria

- [x] Criterion 1: Student-centric roster lists all students with invoice status, invoice no, issue date, due date, and amount.
- [x] Criterion 2: 6 lifecycle states are supported with distinct visual badges (`da_tao`, `da_gui`, `da_thanh_toan`, `thanh_toan_mot_phan`, `qua_han`, `da_huy`).
- [x] Criterion 3: Batch creation wizard supports 4 scopes (Whole School, Grade, Class, Student) and automatically applies meal deductions.
- [x] Criterion 4: Line items calculate subtotals, discount percentages, and grand totals accurately.
- [x] Criterion 5: Invoice details display dynamic VietQR payment code with transfer reference HOCPHI {invoiceNo}.
- [x] Criterion 6: Successive payments append records to payment history without overwriting previous logs.
- [x] Criterion 7: Asymmetric actions permit editing and deletion only on drafts, while blocking deletion on sent or paid invoices.
- [x] Criterion 8: Extended filter drawer supports status, grade level, e-invoice toggle, and payment methods.

## Mermaid Diagram

```mermaid
flowchart TD
    Invoices[Tuition Invoices /school/fee] --> Roster[Student-Centric Roster]
    Invoices --> Wizard[Create Invoice Wizard Modal]
    
    Roster --> Detail[Invoice Detail /school/fee/[invoiceId]]
    Roster --> ManualPay[Manual Payment Modal]
    Roster --> Edit[Edit Draft Invoice /school/fee/edit/[invoiceId]]
    
    Wizard --> MealCalc[calculateMealDeduction with Excused Absences]
    Wizard --> LineMath[calculateLineItemTotal with Discounts]
    
    ManualPay --> StatusEngine[resolveInvoiceStatus]
    StatusEngine --> AppendHistory[Append to Cumulative Payment History]
    StatusEngine --> UpdateStatus[Update Invoice Lifecycle Status]
    
    Detail --> VietQR[Render VietQR Payment Code]
```

## Implementation Notes

- Code paths: `src/types/invoice.ts`, `src/utils/invoiceValidation.ts`, `src/services/mockInvoiceData.ts`, `src/store/slices/invoiceSlice.ts`, `src/modules/finance/invoices/`, `src/pages/[schoolCode]/school/fee/`.
- Data/contracts: Typed `InvoiceRecord`, `InvoiceLineItem`, `PaymentEntry`, `InvoiceFilterCriteria`, `InvoiceCreationInput`.
- Rollback or feature flag: Modular Next.js Pages router routes under `/[schoolCode]/school/fee` isolated in Redux slice.
- Tradeoffs and rationale: Managing invoices per student rather than per transaction keeps the UI aligned with school administrative mental models, while the append-only payment log guarantees financial auditability.

## Evidence

- Tests: Automated unit tests under `tests/unit/invoices.test.mjs` asserting BR01–BR11 rules.
- Build/lint: Clean Next.js Pages router build with zero TypeScript compilation errors.
- Endpoints: Live HTTP 200 responses on `/demo/school/fee`, `/demo/school/fee/inv-6a1-001`, and `/demo/school/fee/create`.

## Work Log

- Date: 2026-09-12
  - Action: Initialized E-009 epic ledger, defined invoice lifecycle states, specified business rules BR01–BR11, and designed automated meal deduction engine.
  - Agent/skill: `sophia-product-manager`
  - Evidence: Audited requirements from `hoc-phi.md` and legacy finance specs.
  - Docs updated before code: `docs/development/E-009-finance-invoices/epic.md`.

## Change Log

- Date: 2026-09-12
  - Code change: Implemented data contracts, calculation engine, Redux state slice, and UI components.
  - Documentation update: Authored complete epic documentation.
  - Evidence: Passed all required docs validation gates.
