---
id: sync-20261008-160311-parent-handbook-implementation
type: development-sync
parent_epic: E-027-school-parent-handbook
status: approved
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
verification:
  - npm test
  - npm run build
---

# Development Doc Sync: parent-handbook-implementation

## Source Changes

- `src/types/parentHandbook.ts`
  - Reason: Establish canonical domain types and data contracts for HandbookCategory, HandbookArticle, HandbookCategoryNode, FilterState, and mutation payloads.
  - Impacted behavior: Governs data typing across pure validation engine, Redux slice, presentation components, page routes, and unit tests.
- `src/utils/parentHandbookValidation.ts`
  - Reason: Pure validation engine enforcing BR01 through BR12 (strict 2-tier depth cap VR-HNB-01, single-active accordion expansion VR-HNB-02, category note styling BR03, sibling-only drag handles BR04, 1-click status transitions BR05 & BR12, locked destination category breadcrumbs BR07, cascading deletion targets BR09, and article-centric search pruning BR10).
  - Impacted behavior: Validates input payloads, prunes category branches with 0 matching articles, and resolves cascading deletion targets.
- `src/services/mockParentHandbookData.ts`
  - Reason: Seed fixtures with realistic Vietnamese institutional policies across 3 root categories, 6 sub-categories, and 12 rich text articles with attachments.
  - Impacted behavior: Populates handbook tree, article inspection panel, and composer with rich mock data.
- `src/store/slices/parentHandbookSlice.ts`
  - Reason: Redux Toolkit state machine managing normalized categories, articles, expanded accordion category IDs, active article ID, search/filter criteria, and mutation reducers.
  - Impacted behavior: Drives instantaneous state transitions across the parent handbook dashboard.
- `src/store/index.ts`
  - Reason: Mount `parentHandbookReducer` onto the root Redux application store.
  - Impacted behavior: Enables access to parent handbook state via `useAppSelector((state) => state.parentHandbook)`.
- `src/modules/school/handbook/HandbookToolbar.tsx`
  - Reason: Hosts status filter dropdown ("Tất cả", "Đã phát hành", "Bản nháp"), article search input, summary counts, and "+ Thêm danh mục" button.
  - Impacted behavior: Drives real-time client-side tree filtering without page reloads.
- `src/modules/school/handbook/HandbookAccordionTree.tsx`
  - Reason: Renders 2-tier category tree with single-active accordion expansion, sub-category drag handles, draft vs published badging, action menus, and empty state ST-03.
  - Impacted behavior: Primary interactive navigation surface for parent handbook categories and articles.
- `src/modules/school/handbook/HandbookDetailPanel.tsx`
  - Reason: Right-side article reader rendering breadcrumbs, metadata, rich text HTML content, attachments download tiles, and quick edit/status action buttons.
  - Impacted behavior: Delivers full readability of institutional guidelines.
- `src/modules/school/handbook/CategoryModal.tsx`
  - Reason: Context-aware modal for creating/editing categories, enforcing locked parent category name for sub-categories and omitting it for root categories.
  - Impacted behavior: Enforces 2-tier depth cap at category creation time.
- `src/modules/school/handbook/HandbookDeleteModal.tsx`
  - Reason: Modal dialog enforcing high-severity cascading warning ST-01 for categories vs simple confirmation ST-02 for articles.
  - Impacted behavior: Prevents accidental permanent data loss of policy documents.
- `src/pages/[schoolCode]/school/handbook/index.tsx`
  - Reason: Canonical page route rendering toolbar, 2-column split workspace (accordion tree and detail panel), and modals within `PortalLayout`.
  - Impacted behavior: Primary administrative cockpit for parent handbook management.
- `src/pages/[schoolCode]/school/handbook/create.tsx`
  - Reason: Full-page article composer with locked destination category breadcrumbs, rich text textarea, attachments uploader, and dual save buttons ("Lưu nháp" vs "Lưu & Xuất bản").
  - Impacted behavior: Allows authoring new institutional policy articles.
- `src/pages/[schoolCode]/school/handbook/edit/[articleId].tsx`
  - Reason: Full-page article editor allowing updating title, content, attachments, and publishing status.
  - Impacted behavior: Enables administrative updates to existing handbook articles.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Positioned `Sổ tay PH` navigation item with `faBookBookmark` icon strictly between `Điểm danh NV` and `Lịch sự kiện` under `NHÀ TRƯỜNG`.
  - Impacted behavior: Provides direct sidebar access to the handbook module in the required menu position.
- `tests/unit/parentHandbook.test.mjs`
  - Reason: Automated unit test suite with 13 assertions covering 2-tier depth, single-active accordion, drag reordering, status toggling, article-centric search pruning, cascading deletion, and Redux slice mutations.
  - Impacted behavior: Validates module correctness and guarantees zero regressions.

## Docs Before Code

- Pre-code docs read: `.agents/specs/042-school-parent-handbook-so-tay-ph/spec.md`, `plan.md`, `docs_legacy/operating-portal/10. so-tay-ph.md`.
- Pre-code docs updated: Initialized development ledger under `docs/development/E-027-school-parent-handbook/`.
- Relationship map reviewed: Confirmed feature placement within Module 5 (Nhà Trường) between Điểm danh NV and Lịch sự kiện.
- Related features checked: `024-school-announcements`, `041-school-staff-attendance-diem-danh-nv`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: no change needed / PRD defines Sổ Tay PH requirements AC-093 through AC-097 under M5 Nhà Trường.
- `docs/tasks.md`: updated because marked T-027-001-001-school-parent-handbook as completed with full implementation evidence and test results.
- `docs/knowledge.md`: no change needed / Knowledge base records K049 (2-tier depth cap), K050 (single-active accordion), K051 (article-centric search pruning), K052 (draft vs published lifecycles), and K053 (sibling-only drag handles).
- `docs/decisions.md`: no change needed / Decision records document 2-tier taxonomy and cascading deletion guardrails.
- `docs/memory.md`: no change needed / Memory records project facts and resolved clarification ledger items.
- `docs/planning/flows.md`: no change needed / Sequence diagrams match implemented UI flows.
- `docs/planning/screens.md`: no change needed / Screen catalog matches implemented views.
- `docs/planning/diagrams.md`: no change needed / Architecture diagrams match implemented boundaries.

### Development Ledger Docs

- Epic notes: `docs/development/E-027-school-parent-handbook/epic.md` updated with full acceptance criteria checkmarks and implementation details.
- Module notes: `docs/development/E-027-school-parent-handbook/modules/M-027-001-school-parent-handbook.md` authored with responsibility, contracts, commentary, and verification.
- Feature notes: `docs/development/E-027-school-parent-handbook/features/F-027-001-school-parent-handbook.md` authored with user value, Jira story, PM notes, and requirements trace.
- Page notes: `docs/development/E-027-school-parent-handbook/pages/P-027-001-school-parent-handbook.md` authored with route surfaces, UI states, interactions, and accessibility.
- Task notes: `docs/development/E-027-school-parent-handbook/tasks/T-027-001-001-school-parent-handbook.md` authored with execution log, write scope, verification results, and handoff.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --test tests/unit/parentHandbook.test.mjs` && `npm test` && `npm run build`
- Result: 13/13 unit tests passing in 99ms; 506/506 full suite tests passing across 107 test suites; clean production build with 75/75 static pages prerendered.
- Residual documentation risk: None; all 12 business rules and 5 clarification ledger items (K049 through K053) fully traced and verified.

## PM Summary

- What changed for the POC: Delivered the complete School Parent Handbook (Sổ Tay PH) module positioned in the sidebar between Điểm danh NV and Lịch sự kiện, with 2-tier category accordion navigation, article-centric search pruning, rich text article reading, composer with locked breadcrumbs and dual save actions, and cascading deletion modal ST-01.
- What the PM can demo now:
  1. Access `/[schoolCode]/school/handbook` from the sidebar navigation.
  2. Expand/collapse categories to observe single-active accordion behavior and dashed callout notes.
  3. Perform 1-click status transitions ("Xuất bản bài viết" / "Ẩn bài viết") via article menus.
  4. Search for keywords (e.g. "đưa đón", "bảo hiểm") to see dynamic branch pruning and auto-expansion.
  5. Author and publish a new policy article with file attachments at `/[schoolCode]/school/handbook/create`.
  6. Trigger category deletion to review cascading warning modal ST-01 detailing sub-categories and articles to be deleted.
- What remains uncertain: None; all functional requirements and acceptance criteria verified.
