---
id: P-013-001-finance-reconciliation
type: page
parent_epic: E-013-finance-reconciliation
status: active
owner_skill: benny-frontend-engineer
source_trace:
  - docs/planning/screens.md
  - docs/BRAND_GUIDELINES.md
  - docs_legacy/operating-portal/tai-chinh/doi-soat.md
verification:
  - tests/unit/reconciliation.test.mjs
jira:
  story: "As a school accountant, I want an intuitive reconciliation sessions table with free date-range filtering and a session detail inspector with an inline expandable invoice accordion so that payment reconciliation is fast and contextual."
  priority: P1
  labels:
    - page
    - ui
    - finance
    - reconciliation
    - gateways
---

# Page: Reconciliation Routes & Interface Layouts (P-013-001)

## Jira Story

- Story: As a school accountant, I want an intuitive reconciliation sessions table with free date-range filtering and a session detail inspector with an inline expandable invoice accordion so that payment reconciliation is fast and contextual.
- Jira issue type: Story
- UX owner: `benny-frontend-engineer`
- Research evidence: Based on legacy screen inventory in `docs_legacy/operating-portal/tai-chinh/doi-soat.md` (`ds-uc01-overview.png`, `ds-uc02-chi-tiet-phien.png`) detailing the sessions table, free date-range picker, and the inline accordion row for linked invoices.

## Priority

- Priority: P1
- Demo impact: High-visibility audit screen proving end-to-end reconciliation between electronic payment gateways and student billing accounts.
- Risk if delayed: Missing audit and reconciliation verification surface for school accountants and auditors.
- Release target: Release 1.0 (Phase 1 MVP)

## Route / Surface

| Route Pattern | View / Screen | Purpose |
| :--- | :--- | :--- |
| `/[schoolCode]/school/reconciliation` | Reconciliation Sessions Overview | Main dashboard displaying automated sync sessions, free date-range picker (BR05), top KPI summary strip, and session table with clickable transaction count links. |
| `/[schoolCode]/school/reconciliation/[sessionId]` | Session Transaction Detail View | Detailed audit screen displaying itemized transactions, student/transaction search, gateway channel filter (Ví FinViet vs QR Ecopay), and inline expandable linked invoice accordion (BR04, NFR01). |

## PM Notes

- Demo path: Navigate to `/demo/school/reconciliation`, review the 12-day window (`2026-08-30` to `2026-09-11`), observe 4 sessions totaling 48.506.000 Đ, click on session `DS-20260910-01`, view transactions for student Cao Ngọc Minh, click "1 Hóa đơn ▾" to expand invoice `2609703607` (Hóa đơn tháng 9/2026, 6.000 Đ, Đã thanh toán), toggle gateway channels, and test Excel export.
- User promise: Clean layout, immediate visual clarity on payment gateways, and contextual linked invoice verification directly in the transaction row without leaving the screen.
- Visual or copy change: High-contrast badges (Emerald for `QR Ecopay`, Blue for `Ví FinViet`, Emerald for `Đã đối soát`), responsive tables, and standard accounting notation with Vietnamese dot thousand separators.
- Risk: Handled via responsive horizontal table scrolling and defensive fallback states when a session is not found.

## Relationship Map

| Relation | Target | Label | Rationale |
| :--- | :--- | :--- | :--- |
| Belongs to | `E-013-finance-reconciliation` | `BELONGS_TO` | User-facing page layouts of Epic 13. |
| Supported by | `M-013-001-finance-reconciliation` | `DEPENDS_ON` | Connects page routes to the Reconciliation service and Redux slice. |
| Implements | `F-013-001-finance-reconciliation` | `IMPLEMENTS` | Implements user-facing pages of the Reconciliation feature. |

## Screen Specifications

### 1. Reconciliation Overview (`/[schoolCode]/school/reconciliation`)
- Layout: Top KPI strip (4 cards), Date-range filter toolbar, Sessions roster table.
- Tokens: ECO 1.0 Brand Blue `#0070CE`, Emerald `#10b981`, Slate `#0f172a` / `#f8fafc`.
- Key Behaviors:
  - Free date-range picker: "Từ ngày" and "Đến ngày" inputs with future date blocking.
  - Quick presets: "12 ngày gần nhất" (default per BR05), "Tháng này", "Tất cả".
  - Clickable transaction count badge navigating directly to `/[schoolCode]/school/reconciliation/[sessionId]`.
  - Excel export button automatically disabled when session count is 0 (BR09).

### 2. Session Detail View (`/[schoolCode]/school/reconciliation/[sessionId]`)
- Layout: Breadcrumb/Back link, Session header with 4-stat metric strip, Search & channel filter toolbar, Transaction table with inline expandable accordion row.
- Key Behaviors:
  - Student & transaction code search input with clear button.
  - Channel filter dropdown: "Tất cả cổng thanh toán", "Ví FinViet", "QR Ecopay" (BR03).
  - Button `[ N Hóa đơn ▾ ]` expands/collapses the linked invoice table immediately beneath the transaction row (BR04, NFR01).
  - Linked invoice table displays invoice title (with link to `/school/fee/[invoiceId]`), invoice code, total invoice amount, and payment status badge.
  - Excel export button automatically disabled when filtered transaction count is 0 (BR09).

## States

1. **Reconciliation Overview States**:
   - `Populated State`: Renders 4 KPI cards and session table with dates, total amounts, and clickable transaction count links.
   - `Empty Date Range State`: Displays friendly empty state icon with instructions to widen the date range; disables "Xuất Báo Cáo" button (BR09).
   - `Preset Quick Filter State`: Instantaneous date range update when clicking "12 ngày gần nhất", "Tháng này", or "Tất cả".

2. **Session Detail States**:
   - `Collapsed Accordion State`: Transaction row shows `[ N Hóa đơn ▾ ]` button.
   - `Expanded Accordion State`: Renders inline table beneath transaction row detailing linked invoices with titles, codes, and statuses without leaving the page (BR04).
   - `Filtered Channel State`: Table filters dynamically when switching between "Tất cả", "Ví FinViet", and "QR Ecopay".
   - `Session Not Found State`: Renders clean 404 card with back link when `sessionId` does not match any known session.

## Mermaid Diagram

```mermaid
flowchart TD
    Overview[Reconciliation Overview /school/reconciliation] -->|Click Session DS-20260910-01| Detail[Session Detail /school/reconciliation/:id]
    Detail -->|Filter Channel: Ví FinViet| FilteredList[Filtered Transactions]
    Detail -->|Click 1 Hóa đơn ▾| InlineAccordion[Inline Accordion Table]
    InlineAccordion -->|Click Mở Hóa Đơn| InvoiceDetail[/school/fee/:id]
```

## Verification

- Automated testing via `tests/unit/reconciliation.test.mjs`.
- Next.js build validation on `/demo/school/reconciliation` and `/demo/school/reconciliation/session-20260910-01`.
- Live HTTP curl check returning code 200 on both routes.

## Work Log

- 2026-09-13:
  - Action: Created Next.js Pages router routes `[schoolCode]/school/reconciliation/index.tsx` and `[sessionId].tsx`, wrapped in `PortalLayout`.
  - Agent/skill: `benny-frontend-engineer`
  - Evidence: Statically prerendered in `npm run build` and HTTP 200 responses verified via curl.
  - Docs updated before code: `docs/development/E-013-finance-reconciliation/pages/P-013-001-finance-reconciliation.md`.

## Change Log

- 2026-09-13:
  - Code change: Implemented page templates and views under `src/modules/finance/reconciliation/`.
  - Documentation update: Authored complete page documentation note.
  - Evidence: Verified all page routes render cleanly.
