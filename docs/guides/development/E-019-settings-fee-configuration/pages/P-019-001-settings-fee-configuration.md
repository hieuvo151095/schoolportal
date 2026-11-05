---
id: P-019-001-settings-fee-configuration
type: page
status: implemented
parent_epic: E-019-settings-fee-configuration
owner_skill: maya-ui-ux-designer
source_trace:
  - docs_legacy/operating-portal/M6-cau-hinh/SM3-hoc-phi.md
  - docs/development/E-019-settings-fee-configuration/epic.md
verification:
  - tests/unit/settingFee.test.mjs
jira:
  story: "As a UI/UX designer, I want clear, ergonomic page layouts for Settings Fee Configuration and Sepay Payment History that follow ECO Design System 1.0 tokens, provide inline feedback, and prevent accidental data loss with navigation guards."
  priority: P1
  labels:
    - ui-ux
    - pages
    - eco-design-system
---

# Page: Settings Fee Configuration & Payment History (Cấu Hình — Học Phí)

## Jira Story

- Story: As a UI/UX designer, I want clear, ergonomic page layouts for Settings Fee Configuration and Sepay Payment History that follow ECO Design System 1.0 tokens, provide inline feedback, and prevent accidental data loss with navigation guards.
- Jira issue type: Page
- Acceptance owner: `maya-ui-ux-designer`

## Priority

- Priority: P1
- UX Criticality: High. Primary operational administrative surface for tuition billing rules and gateway history.

## Route / Surface

- Primary Dashboard: `/[schoolCode]/setting/fee/`
- Payment History Sub-page: `/[schoolCode]/setting/fee/payment-history/`
- Layout Container: `src/components/layout/PortalLayout.tsx` (Under `CẤU HÌNH > Học phí`)

## PM Notes

- All 5 form cards adhere strictly to ECO Design System 1.0 color tokens (`#0070CE` Primary Blue, `#FEC020` Accent Yellow, `#10B981` Emerald Success).
- Independent Save buttons only highlight when the respective block's draft state differs from persisted values.
- Navigation guard modal pops up automatically if user attempts to leave the dashboard while any block has unsaved edits.

## States

1. **Clean Initial State:** All blocks load with persisted values from Redux; Save buttons are disabled; no dirty badges are visible.
2. **Block Dirty State:** When a user types into an input or toggles a switch, that block displays an amber "Chưa lưu" pill badge and activates its "Lưu thay đổi" / "Hoàn tác" buttons.
3. **Validation Error State:** If required fields (e.g. SInvoice MST, account, password) are empty or malformed upon save, red inline error notices appear under the invalid inputs.
4. **Unsaved Route Guard State:** If navigation occurs while `isAnyBlockDirty` is true, `UnsavedChangesModal` appears with the list of modified blocks and options to "Rời khỏi không lưu" or "Ở lại lưu thay đổi".
5. **Payment History Filtered State:** Supports real-time filtering by Month, Status tabs (Tất cả, Thành công, Đang xử lý, Thất bại), and free-text search across student names and transaction codes.
6. **Meal Refund Dual Absence & Simulation State:** Section 2 renders Group A (100% guarantee card), Group B (% rate inputs for main meal & breakfast), and live calculation simulation card computing September 162.000đ test vector. Invoicing Step 3 displays previous-month deduction callout.

## Code Scope

- `src/pages/[schoolCode]/setting/fee/index.tsx`
- `src/pages/[schoolCode]/setting/fee/payment-history/index.tsx`
- `src/pages/[schoolCode]/school/fee/create.tsx`
- `src/modules/settings/fee/InvoiceNoteBlock.tsx`
- `src/modules/settings/fee/SepayIntegrationBlock.tsx`
- `src/modules/settings/fee/SInvoiceBlock.tsx`
- `src/modules/settings/fee/LatePickupAndRefundBlock.tsx`
- `src/modules/settings/fee/ReconciliationEmailBlock.tsx`
- `src/modules/settings/fee/UnsavedChangesModal.tsx`
- `src/modules/finance/invoices/CreateInvoiceWizardModal.tsx`
- `src/modules/settings/fee/LatePickupAndRefundBlock.tsx`
- `src/modules/settings/fee/ReconciliationEmailBlock.tsx`
- `src/modules/settings/fee/UnsavedChangesModal.tsx`

## Relationship Map

| Relation | Target | Label | Rationale |
| --- | --- | --- | --- |
| IMPLEMENTS | `E-019-settings-fee-configuration` | `IMPLEMENTS` | Page surface realization for Settings Fee Configuration. |
| DEPENDS_ON | `F-019-001-settings-fee-configuration` | `DEPENDS_ON` | Driven by feature requirements and validation rules. |
| USES | `M-019-001-settings-fee-configuration` | `USES` | Consumes Redux state and action dispatches. |

## Mermaid Diagram

```mermaid
flowchart TD
    Nav["Sidebar: Cấu hình > Học phí"] --> FeePage["Page: /[schoolCode]/setting/fee"]
    FeePage --> Block1["InvoiceNoteBlock"]
    FeePage --> Block2["SepayIntegrationBlock"]
    FeePage --> Block3["SInvoiceBlock"]
    FeePage --> Block4["LatePickupAndRefundBlock"]
    FeePage --> Block5["ReconciliationEmailBlock"]
    
    Block2 -->|Click 'Lịch sử thanh toán'| HistPage["Page: /[schoolCode]/setting/fee/payment-history"]
    HistPage --> Filter["Month & Status Filters + Search"]
    HistPage --> Table["Transaction Data Table"]
    
    FeePage -->|Route Change Start (Dirty)| Modal["UnsavedChangesModal (Route Guard)"]
    Modal -->|Confirm Leave| Discard["Discard All & Navigate"]
    Modal -->|Stay| Remain["Stay on Current Page"]
```

## Verification

- Verified via Next.js build: Static pre-rendering for `/[schoolCode]/setting/fee` and `/[schoolCode]/setting/fee/payment-history` successful.
- Tested route guard transitions and discrete form block interactions.

## Work Log

- Date: 2026-09-29
  - Action: Built responsive layouts for settings fee dashboard and Sepay transaction history.
  - Agent/skill: `maya-ui-ux-designer`
  - Evidence: Verified via static page pre-rendering in `npm run build`.

## Change Log

- Date: 2026-09-29
  - Code change: Implemented contracts, validation, Redux slice, 5 form blocks, modal guard, and 2 page routes.
  - Documentation update: Authored page note P-019.
  - Evidence: `tests/unit/settingFee.test.mjs`.
