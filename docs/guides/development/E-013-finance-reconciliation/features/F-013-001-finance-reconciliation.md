---
id: F-013-001-finance-reconciliation
type: feature
parent_epic: E-013-finance-reconciliation
status: active
owner_skill: benny-frontend-engineer
source_trace:
  - docs/development/E-013-finance-reconciliation/epic.md
  - docs_legacy/operating-portal/tai-chinh/doi-soat.md
verification:
  - tests/unit/reconciliation.test.mjs
jira:
  story: "As a school accountant, I want to audit electronic payment reconciliation sessions, inspect transaction itemization across payment channels (Ví FinViet and QR Ecopay), and expand linked invoices inline so that I can verify that digital tuition collections reconcile with invoices."
  priority: P1
  labels:
    - frontend
    - reconciliation
    - payment-gateways
    - finviet
    - ecopay
    - audit
---

# Feature: Finance Reconciliation & Gateway Settlement (Đối Soát)

## Jira Story

- Story: As a school accountant, I want to audit electronic payment reconciliation sessions, inspect transaction itemization across payment channels (Ví FinViet and QR Ecopay), and expand linked invoices inline so that I can verify that digital tuition collections reconcile with invoices.
- Jira issue type: Story
- Story points: 5
- Acceptance owner: `sophia-product-manager`
- Research evidence: Based on legacy audit in `docs_legacy/operating-portal/tai-chinh/doi-soat.md` covering automated session grouping by sync timestamp (BR01), read-only audit architecture (BR02), payment channel classification (BR03), inline expandable linked invoice accordion (BR04, NFR01), free date-range picker with future date guard (BR05), session detail inner search and channel filtering (BR06), and real-world cumulative transaction matching (1.000 + 2.000 + 3.000 = 6.000 VNĐ).

## Priority

- Priority: P1
- User/business impact: Critical financial verification module ensuring digital tuition payments received via payment gateways (Ví FinViet and QR Ecopay) correctly extinguish parent tuition invoices.
- Risk if delayed: Lack of visibility into gateway settlements, inability to audit automated daily syncs, and accounting discrepancy risks between bank payouts and invoice balances.
- Release target: Release 1.0 (Phase 1 MVP)

## User Value

The Finance Reconciliation feature provides school accountants with an intuitive, trustworthy audit console for gateway settlements.

Key capabilities include:
1. **Reconciliation Sessions Overview (`/school/reconciliation`)**:
   - Table of reconciliation sessions grouped by automated synchronization batches.
   - Dual timestamp display: "Ngày tạo phiên" (`sessionDate`, e.g. `10/09/2026 01:00`) and "Khoảng thời gian giao dịch" (`transactionPeriod`, e.g. `09/09/2026 14:18 - 14:21`) per BR01.
   - Clickable transaction count badge navigating directly to session detail view.
2. **Top Operational KPI Summary Cards**:
   - Tổng tiền thanh toán trong kỳ (VND formatted).
   - Tổng số giao dịch thanh toán.
   - Tổng số phiên đối soát hoàn thành.
   - Tỷ lệ khớp đúng hóa đơn (100% Khớp đúng).
3. **Date-Range Filter Toolbar (BR05)**:
   - Free date-range picker (Từ ngày - Đến ngày), defaulting to the last 12 days.
   - Future date guard preventing selection of dates after the current date.
   - Quick preset buttons: "12 ngày gần nhất", "Tháng này", "Tất cả".
4. **Session Transaction Detail (`/school/reconciliation/[sessionId]`)**:
   - Session Header with back navigation, session code, sync date, transaction interval, and 4-stat metric strip.
   - Inner toolbar with student code/name search and gateway channel filter (Ví FinViet vs QR Ecopay).
5. **Inline Expandable Linked Invoice Accordion (BR04, NFR01)**:
   - Button `[ N Hóa đơn ▾ ]` opens an inline table directly underneath the transaction row without leaving the page.
   - Displays invoice title, invoice code (linking to `/school/fee/[invoiceId]`), total invoice amount, and payment status.
   - Verifies real-world partial payment accumulation (e.g. 1.000 + 2.000 + 3.000 = 6.000 VNĐ).
6. **Strict Read-Only Enforcement (BR02)**:
   - Zero manual create, edit, or delete actions, guaranteeing audit integrity.
7. **Export Protection (BR09)**:
   - Excel export buttons are disabled when filtered session or transaction count is 0.

## PM Notes

- Demo scenario: The accountant navigates to `/demo/school/reconciliation`, checks the 12-day window (2026-08-30 to 2026-09-11), reviews 4 sessions totaling 48.506.000 Đ, clicks on session `DS-20260910-01` (3 transactions), views transactions for student Cao Ngọc Minh, clicks "1 Hóa đơn ▾" on transaction `TX-20260909-001` to expand invoice `2609703607` (6.000 Đ, Đã thanh toán), filters transactions by channel (Ví FinViet vs QR Ecopay), and tests Excel export.
- Business value: Guarantees 100% transparent reconciliation between electronic payment gateways and student billing accounts.

## Requirements Trace

- BR01: Session grouping by sync date vs transaction window trace verified.
- BR02: Strict read-only audit architecture trace verified.
- BR03: Dual gateway channels (Ví FinViet vs QR Ecopay) trace verified.
- BR04: Inline expandable linked invoice accordion row trace verified.
- BR05: Free date-range picker with future date guard trace verified.
- BR06: Session detail search and channel filtering trace verified.
- BR07: Cross-module invoice routing trace verified.
- BR08: Vietnamese currency dot formatting standard trace verified.
- BR09: Export Excel button disablement on zero records trace verified.

## Scope

- Included: Roster table of sessions, date-range picker, KPI cards, session detail view, transaction table with inline expandable accordion row, gateway channel badges, search and channel filters, cross-module invoice link, and export controls.
- Excluded: Manual transaction tampering, dispute arbitration workflows, or direct bank transfer execution.

## Relationship Map

| Relation | Target | Label | Rationale |
| :--- | :--- | :--- | :--- |
| Belongs to | `E-013-finance-reconciliation` | `BELONGS_TO` | Core user-facing feature of Epic 13. |
| Implements | `M-013-001-finance-reconciliation` | `IMPLEMENTS` | Connects UI components to Redux slice and validation engine. |
| Visualized on | `P-013-001-finance-reconciliation` | `RENDERED_ON` | Rendered across overview and session detail routes. |
| Traced by | `T-013-001-001-finance-reconciliation` | `TRACKED_BY` | Work tracked in implementation task. |

## Code Scope

- Primary files: `src/types/reconciliation.ts`, `src/utils/reconciliationValidation.ts`, `src/services/mockReconciliationData.ts`, `src/store/slices/reconciliationSlice.ts`, `src/modules/finance/reconciliation/ReconciliationSummaryCards.tsx`, `src/modules/finance/reconciliation/ReconciliationToolbar.tsx`, `src/modules/finance/reconciliation/ReconciliationSessionTable.tsx`, `src/modules/finance/reconciliation/SessionDetailHeader.tsx`, `src/modules/finance/reconciliation/SessionDetailToolbar.tsx`, `src/modules/finance/reconciliation/TransactionRosterTable.tsx`, `src/pages/[schoolCode]/school/reconciliation/index.tsx`, `src/pages/[schoolCode]/school/reconciliation/[sessionId].tsx`.
- Test files: `tests/unit/reconciliation.test.mjs`.

## Mermaid Diagram

```mermaid
flowchart TD
    Accountant[Kế Toán Trường] --> OverviewUI[/school/reconciliation]
    OverviewUI -->|Chọn khoảng ngày| SessionList[Danh sách phiên đối soát]
    SessionList -->|Bấm vào phiên| DetailUI[/school/reconciliation/:id]
    DetailUI -->|Lọc kênh / Tìm kiếm| TxList[Danh sách giao dịch chi tiết]
    TxList -->|Bấm N hóa đơn| Accordion[Accordion Hóa đơn liên kết]
    Accordion -->|Mở hóa đơn| InvoicePage[/school/fee/:id]
```

## Verification

- Automated unit testing via `tests/unit/reconciliation.test.mjs` asserting all 10 business rules.
- Next.js production build `npm run build` validating all static route generations.
- Live HTTP curl checks verifying HTTP 200 on reconciliation overview and detail routes.

## Work Log

- Date: 2026-09-13
  - Action: Built complete UI component hierarchy and verified all 7 feature criteria against legacy operational requirements.
  - Agent/skill: `benny-frontend-engineer`
  - Evidence: Unit tests, build verification, and live HTTP 200 responses.
  - Docs updated before code: `docs/development/E-013-finance-reconciliation/features/F-013-001-finance-reconciliation.md`.

## Change Log

- Date: 2026-09-13
  - Code change: Implemented data contracts, validation engine, Redux state slice, and UI components.
  - Documentation update: Authored complete feature documentation note.
  - Evidence: Passed all required docs validation gates.
