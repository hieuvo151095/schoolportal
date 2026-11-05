---
id: P-011-001-finance-tuition-management
type: page
parent_epic: E-011-finance-tuition-management
status: active
owner_skill: benny-frontend-engineer
source_trace:
  - docs/planning/screens.md
  - docs/BRAND_GUIDELINES.md
  - docs_legacy/operating-portal/tai-chinh/quan-ly-hoc-phi.md
verification:
  - tests/unit/tuitionManagement.test.mjs
jira:
  story: "As a school accountant, I want an interactive fee schedule overview table and a 2D class fee matrix with per-student inputs, optional fee toggles, and modal dialogs so that fee configuration is seamless."
  priority: P1
  labels:
    - page
    - ui
    - finance
    - tuition-management
---

# Page: Tuition Management Routes & Interface Layouts (P-011-001)

## Jira Story

- Story: As a school accountant, I want an interactive fee schedule overview table and a 2D class fee matrix with per-student inputs, optional fee toggles, and modal dialogs so that fee configuration is seamless.
- Jira issue type: Story
- UX owner: `benny-frontend-engineer`
- Research evidence: Based on legacy screen inventory (`ql-uc01-overview.png`, `ql-uc02-danh-sach-lop.png`, `ql-uc03-cap-nhat-hoc-phi.png`, `ql-uc04-them-khoan-phi.png`).

## Priority

- Priority: P1
- Demo impact: High-visibility operational bridge connecting fee catalog items to classes and enrolled students.
- Risk if delayed: Inability to populate or configure tuition billing lines.
- Release target: Release 1.0 (Phase 1 MVP)

## Route / Surface

| Route Pattern | View / Screen | Purpose |
| :--- | :--- | :--- |
| `/[schoolCode]/school/tuition-management` | Overview Class Fee Roster | Primary table listing 12 configured classes with search, grade level filtering, fee overviews, and dual action icons. |
| `/[schoolCode]/school/tuition-management/[classId]` | Class 2D Student-by-Fee Matrix | Interactive matrix table of enrolled students by assigned fee items with mandatory inputs, optional toggles, and divergence hints. |
| Modal Surface | Batch Update Fee Modal ("Cập nhật học phí lớp học") | Dialog triggered by column header pencil icon to apply amounts to whole class or tagged students. |
| Modal Surface | Add Fee Modal ("Thêm khoản phí") | Dialog to attach a new fee item from deduplicated catalog items to the class. |

## PM Notes

- Demo path: Navigate to `/demo/school/tuition-management`, observe 12 classes with fee summaries, click action icon 2 to jump to filtered invoices, click icon `$` to open 2D matrix for class 12A1, edit an input to verify green hint `"Phí mặc định: 5.000.000 Đ"`, toggle "Học STEAM" for Nguyen Nguyen Thu, open batch update modal, and test the floating unsaved changes banner.
- User promise: Fast 2D matrix navigation with clear price override feedback and batch updates.
- Acceptance impact: Fulfills all UI requirements in `TASK-FIN-003` and `TASK-FIN-004`.
- Visual or copy change: High-contrast inputs, distinct green divergence hint text (`#059669`), prominent toggle switches, and a persistent floating bottom banner for unsaved modifications.
- Risk: Handled via confirmation handlers and non-destructive demo safeguards.

## States

1. **Overview Class Fee Roster (`/school/tuition-management`)**:
   - `Default State`: Displays 12 configured classes, showing grade level, total students, fee items summary, and dual action icons.
   - `Filtered State`: Searching class name or selecting a grade level from the 28 available blocks immediately updates table rows.
   - `Empty State`: Displays "Chưa có dữ liệu" when no class matches filter criteria.

2. **Class 2D Fee Matrix (`/school/tuition-management/[classId]`)**:
   - `Default Matrix State`: Displays enrolled students as rows and assigned fees as columns with mandatory inputs and optional toggles.
   - `Diverged Cell State`: When student amount differs from class default fee, renders small green text `"Phí mặc định: X Đ"` below the input.
   - `Unsaved Changes State`: Floating bottom banner appears with "Thay đổi của bạn chưa được lưu" and Save/Discard buttons.
   - `Batch Update Open State`: Pencil icon opens modal with amount input and radio options ("Cả lớp" or "Học sinh được chọn").
   - `Add Fee Open State`: Button opens modal with dropdown showing only fees not yet assigned to this class.

## Interactions

- **Action Icon 1 (`$` icon)**: Navigates to the 2D class matrix route `/[schoolCode]/school/tuition-management/[classId]`.
- **Action Icon 2 (Document icon)**: Navigates directly to `/[schoolCode]/school/fee?classId={classId}` pre-filtered for that class (BR09).
- **Mandatory Fee Input**: Numeric input always editable for all students without toggles.
- **Optional Fee Toggle**: Switch toggles fee for student; when ON, reveals numeric amount input and increments column header count `(N Học sinh)`.
- **Column Header Pencil Icon**: Opens batch update modal to update amounts for tagged students.
- **Add Fee Button**: Opens modal to attach a new fee from the master catalog.
- **Unsaved Changes Banner**: Provides "Lưu thay đổi" and "Hủy bỏ" actions.

## Accessibility

- All buttons feature descriptive `aria-label` attributes (e.g. `aria-label="Quản lý học phí lớp"`, `aria-label="Xem hóa đơn lớp"`).
- Numeric inputs include `aria-label` specifying student name and fee item.
- Toggle switches use accessible checkbox roles with `aria-checked` attributes.
- Modal dialogs trap focus and support keyboard dismissal via `Escape` key.
- Color contrast meets WCAG AA standards: Green hint text `#059669` on `#ffffff` background (contrast ratio > 4.5:1).

## Verification Evidence

- Automated unit tests in `tests/unit/tuitionManagement.test.mjs` verifying rendering contracts, filtering logic, and divergence hints.
- Clean Next.js Pages router build with zero hydration discrepancies.
- Live HTTP 200 responses on both tuition management overview and detail routes.

## Relationship Map

| Relation | Target | Label | Rationale |
| :--- | :--- | :--- | :--- |
| Implements | `F-011-001-finance-tuition-management` | `IMPLEMENTS` | Renders user interface and interaction flows for tuition management feature. |
| Uses | `M-011-001-finance-tuition-management` | `USES` | Consumes tuition management types, validation functions, and Redux state. |

## Mermaid Diagram

```mermaid
flowchart TD
    User([School Accountant]) --> Nav[Navigate to /school/tuition-management]
    Nav --> Overview[Overview Class Roster]

    Overview --> ActionInvoice[Click Action Icon 2: Document]
    ActionInvoice --> Invoices[Navigate to /school/fee?classId=12A1]

    Overview --> ActionMatrix[Click Action Icon 1: $]
    ActionMatrix --> Matrix[2D Student-by-Fee Matrix]

    Matrix --> EditCell[Edit Numeric Cell Input]
    EditCell --> CheckHint{Amount !== Default?}
    CheckHint -->|Yes| ShowHint[Render Green Hint: Phí mặc định: X Đ]
    CheckHint -->|No| HideHint[Hide Hint]

    Matrix --> ToggleOpt[Toggle Optional Fee Switch]
    ToggleOpt --> UpdateCount[Update Column Header (N Học sinh)]

    Matrix --> ClickPencil[Click Header Pencil Icon]
    ClickPencil --> BatchModal[Batch Update Modal: Tagged Students]

    Matrix --> ClickAdd[Click Thêm khoản phí]
    ClickAdd --> AddModal[Add Fee Modal: Filtered Catalog]
```

## Work Log

- Date: 2026-09-13
  - Action: Initialized page specification, mapped UI states, modal flows, and accessibility requirements based on legacy screenshots.
  - Agent/skill: `benny-frontend-engineer`
  - Evidence: Verified against screens `ql-uc01` through `ql-uc04`.
  - Docs updated before code: `docs/development/E-011-finance-tuition-management/pages/P-011-001-finance-tuition-management.md`.

## Change Log

- Date: 2026-09-13
  - Code change: Implemented responsive table, 2D matrix table, batch update modal, and add fee modal.
  - Documentation update: Authored complete page specification note.
  - Evidence: Verified via automated unit tests and Next.js page generation.
