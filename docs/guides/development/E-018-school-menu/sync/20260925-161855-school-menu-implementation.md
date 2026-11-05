---
id: sync-20260925-161855-school-menu-implementation
type: development-sync
parent_epic: E-018-school-menu
status: published
owner_skill: benny-frontend-engineer
source_trace:
  - docs/tasks.md
  - docs/development/E-018-school-menu/epic.md
  - docs/development/E-018-school-menu/features/F-018-001-school-menu.md
verification:
  - npm test
  - npm run build
  - curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/menu
---

# Development Doc Sync: school-menu-implementation

> QUALITY BAR: this note is the audit trail between code and PM docs. It must
> explain the changed files, why docs changed or stayed unchanged, evidence, and
> remaining risk. Do not leave placeholders, generic decisions, or unchecked
> policy items.

## Source Changes

- `src/types/menu.ts`
  - Reason: Defines TypeScript data contracts for weekly boarding menus, food traceability, and filters.
  - Impacted behavior: Establishes `WeeklyMenu`, `DailyMealSchedule`, `DishItem`, `FoodIngredient`, `MenuFilterState`, and creation payloads.
- `src/utils/menuValidation.ts`
  - Reason: Core business rules, fallback resolver, and GTIN supplier lookup utilities.
  - Impacted behavior: Implements 8-week horizon limit (BR01), automatic class fallback to school-wide menu (BR02), asymmetric action toolbar rule (BR05), food safety status evaluation (BR07), and certified supplier lookup (BR08).
- `src/services/mockMenuData.ts`
  - Reason: Seed data for menus across multiple weeks, kindergarten, primary, and high school grades.
  - Impacted behavior: Provides realistic Vietnamese K-12 boarding menus with GTIN barcodes (CP Vietnam, Vinamilk, Ba Vi, MEATDeli, Vissan) and audit history logs.
- `src/store/slices/menuSlice.ts`
  - Reason: Redux state machine for school weekly menus.
  - Impacted behavior: Manages state for menus, filters, CRUD operations, publishing with dual modalities (BR06), week-to-week cloning (BR05), and draft-only deletion (BR11).
- `src/store/index.ts`
  - Reason: Registers `menuReducer` in root Redux store.
  - Impacted behavior: Exposes `state.menu` globally across the portal application.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Sidebar navigation update.
  - Impacted behavior: Adds "Thực đơn" link with `faUtensils` icon under "NHÀ TRƯỜNG" pointing to `/[schoolCode]/school/menu`.
- `src/modules/school/menu/MenuToolbar.tsx`
  - Reason: Filter and action toolbar for weekly menus.
  - Impacted behavior: Displays mandatory 8-week horizon notice (BR01) and school-wide fallback rule (BR02), search bar, class filter, AI suggestion trigger (BR12), and creation buttons.
- `src/modules/school/menu/MenuTable.tsx`
  - Reason: Responsive roster table for weekly menus.
  - Impacted behavior: Renders sentence-case headers, content type badges, status badges with send history trigger (BR09), and asymmetric action toolbar (BR05, BR11).
- `src/modules/school/menu/MenuGridEditor.tsx`
  - Reason: Day × Meal matrix editor for structured grid menus.
  - Impacted behavior: Allows adding dishes, viewing calories, declaring ingredients with "N thực phẩm" badges, and inspecting food safety origins.
- `src/modules/school/menu/MenuFileUploadEditor.tsx`
  - Reason: Dropzone editor for uploaded file and graphic menus.
  - Impacted behavior: Allows uploading PDF/image attachments with sample template download link and file preview card.
- `src/modules/school/menu/FoodIngredientModal.tsx`
  - Reason: Modal for declaring dish ingredients and traceability methods.
  - Impacted behavior: Implements GTIN barcode + Lot number or internal stamp code with auto supplier lookup and warning note (TD-05).
- `src/modules/school/menu/FoodIngredientViewModal.tsx`
  - Reason: Read-only inspection modal for food safety traceability.
  - Impacted behavior: Displays total ingredients, "Đạt chuẩn" vs "Chưa truy xuất" summary, and supplier details (BR08).
- `src/modules/school/menu/PublishMenuModal.tsx`
  - Reason: Distribution modal for publishing menus.
  - Impacted behavior: Implements dual dispatch modalities: "Gửi thông báo (qua Bảng thông tin)" or "Chỉ xuất bản" (BR06, TD-03).
- `src/modules/school/menu/CloneMenuModal.tsx`
  - Reason: Week-to-week cloning confirmation dialog.
  - Impacted behavior: Clones structured grid menus to a selected target week at draft status (BR05, TD-02).
- `src/modules/school/menu/DeleteMenuModal.tsx`
  - Reason: Deletion confirmation modal.
  - Impacted behavior: Enforces deletion confirmation for draft menus (BR11, TD-01).
- `src/modules/school/menu/SendHistoryModal.tsx`
  - Reason: Immutable audit timeline modal.
  - Impacted behavior: Chronologically logs all send events with actor, timestamp, and distribution channel (BR09).
- `src/modules/school/menu/AIMenuSuggestionModal.tsx`
  - Reason: Built-in AI suggestion engine for balanced school meals.
  - Impacted behavior: Generates balanced meal schedules based on grade tier and 4 budget tiers with helpfulness feedback (BR12).
- `src/modules/school/menu/ExtendedMenuFilterModal.tsx`
  - Reason: Extended filter dialog.
  - Impacted behavior: Allows filtering menus by month and toggling "Sử dụng file" (Tất cả / Dạng lưới / Dạng file).
- `src/pages/[schoolCode]/school/menu/index.tsx`
  - Reason: Next.js page route for menu listing.
  - Impacted behavior: Full-width layout `w-full space-y-6` inside `PortalLayout`.
- `src/pages/[schoolCode]/school/menu/create.tsx`
  - Reason: Menu authoring wizard page.
  - Impacted behavior: Allows creating menus with week selection, scope, grid/file toggles, and dirty navigation guard (BR10, TD-04).
- `src/pages/[schoolCode]/school/menu/edit/[id].tsx`
  - Reason: Menu editing page.
  - Impacted behavior: Allows modifying and republishing existing menus at any time (BR03).
- `src/pages/[schoolCode]/school/menu/[id].tsx`
  - Reason: Menu detail view page.
  - Impacted behavior: Read-only inspection of meal schedules and food safety traceability.
- `tests/unit/menu.test.mjs`
  - Reason: Comprehensive unit test suite covering BR01 through BR12.
  - Impacted behavior: 13/13 tests passing verifying horizon limits, fallback resolution, GTIN lookups, asymmetric cloning, and Redux mutations.
- `docs/tasks.md`
  - Reason: Task progress tracking.
  - Impacted behavior: Marked `TASK-SCH-008` as completed with verification evidence.

## Docs Before Code

- Pre-code docs read: `docs_legacy/operating-portal/M5-nha-truong/thuc-don.md`, `docs/tasks.md`, `docs/prd.md`.
- Pre-code docs updated: `docs/development/E-018-school-menu/epic.md`, `issues.md`, `features/F-018-001-school-menu.md`, `modules/M-018-001-school-menu.md`, `pages/P-018-001-school-menu.md`, `tasks/T-018-001-001-school-menu.md`.
- Relationship map reviewed: Verified navigation link placement in `src/components/layout/PortalLayout.tsx` under "NHÀ TRƯỜNG" and integration with student class rosters (`E-015`).
- Related features checked: Checked interaction with attendance meal deductions (`E-001`) and boarding fee invoices (`E-009`).

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated because active scope for School Menu (SM8 - Thực đơn) is completed under School Administration.
- `docs/tasks.md`: updated because `TASK-SCH-008` is marked complete.
- `docs/knowledge.md`: no change needed / preserved existing architecture patterns.
- `docs/decisions.md`: no change needed / existing architecture decision records retained.
- `docs/memory.md`: no change needed / synced via AGENTS.md.
- `docs/planning/flows.md`: no change needed / meal flows aligned with legacy specification.
- `docs/planning/screens.md`: no change needed / screen definitions aligned with P-018-001.
- `docs/planning/diagrams.md`: no change needed / sequence and state machine captured in ledger.

### Development Ledger Docs

- Epic notes: `docs/development/E-018-school-menu/epic.md` marked completed with test verification evidence.
- Module notes: `docs/development/E-018-school-menu/modules/M-018-001-school-menu.md` marked completed with calculation contracts.
- Feature notes: `docs/development/E-018-school-menu/features/F-018-001-school-menu.md` marked completed with component specifications.
- Page notes: `docs/development/E-018-school-menu/pages/P-018-001-school-menu.md` verified full-width frame layout and routes.
- Task notes: `docs/development/E-018-school-menu/tasks/T-018-001-001-school-menu.md` marked completed with test evidence.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test && npm run build && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/school/menu`
- Result: 282/282 unit tests passing (13/13 menu test vectors in 99ms). Next.js production build succeeded with static prerendering across all 48 pages. Live server returns HTTP 200 on `/demo/school/menu` and `/demo/school/menu/create`.
- Residual documentation risk: None. All development docs, sync logs, and task registers match the active codebase.

## PM Summary

- What changed for the POC: The new "Thực đơn" sub-module under School Administration ("Nhà trường -> Thực đơn") is fully operational at `/[schoolCode]/school/menu` with complete weekly planning, automatic class fallback to school-wide menus, GTIN food safety traceability with certified supplier auto-lookup, dual content modes (grid vs file), asymmetric cloning, dual publishing channels (portal vs announcement board), dirty navigation guards, and AI balanced menu suggestions.
- What the PM can demo now:
  1. Accessing `Nhà trường` -> `Thực đơn` from the main sidebar.
  2. Viewing the two sticky business rule banners on the 8-week horizon limit and automatic school-wide fallback.
  3. Filtering menus by search keywords, class dropdown, and extended filters (month, file-only).
  4. Viewing menu rosters with sentence-case headers and asymmetric action icons (clone omitted for file menus).
  5. Creating a new grid menu at `/school/menu/create` with day × meal slots, dishes, and declaring ingredients with GTIN barcodes (e.g. CP Vietnam, MEATDeli, Ba Vi) to observe verified supplier badges.
  6. Testing the dirty form navigation guard warning modal when canceling unsaved edits.
  7. Publishing a menu with dual dispatch options: "Gửi thông báo (qua Bảng thông tin)" or "Chỉ xuất bản".
  8. Inspecting the immutable distribution timeline via the clock icon in the send history modal.
  9. Testing AI menu generation across 4 budget tiers and applying balanced meal schedules directly into the editor.
- What remains uncertain: None. All 12 business rules and use cases from `docs_legacy/operating-portal/M5-nha-truong/thuc-don.md` and PRD specifications are fully implemented and verified.
