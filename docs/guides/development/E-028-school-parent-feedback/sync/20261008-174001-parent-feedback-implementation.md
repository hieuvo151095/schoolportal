---
id: sync-20261008-174001-parent-feedback-implementation
type: development-sync
parent_epic: E-028-school-parent-feedback
status: approved
owner_skill: marcus-ai-orchestrator
source_trace:
  - docs/tasks.md
verification:
  - node --test tests/unit/feedback.test.mjs
  - npm test
  - npm run build
---

# Development Doc Sync: parent-feedback-implementation

## Source Changes

- `src/types/feedback.ts`
  - Reason: Establish canonical domain types and data contracts for FeedbackStatus, FeedbackPriority, FeedbackType, FeedbackWaitingFor, FeedbackItem, FeedbackComment, FeedbackAttachment, FeedbackSummaryKPI, and mutation payloads.
  - Impacted behavior: Governs data typing across pure validation engine, Redux slice, presentation components, page routes, and unit tests.
- `src/utils/feedbackValidation.ts`
  - Reason: Pure validation engine enforcing BR01 through BR10, K054 through K058 (KPI aggregation, multi-factor filtering, comment validation, closure eligibility, reactive turn-taking state transitions, and profile fallback text formatting).
  - Impacted behavior: Validates input payloads, aggregates card counts, and alternates response expectation between school and parent.
- `src/services/mockFeedbackData.ts`
  - Reason: Seed fixtures with realistic parent feedback tickets across all 8 categories, 4 priorities, 4 lifecycle states, and staff personnel options.
  - Impacted behavior: Populates feedback roster table, detail pane, and assignee dropdown with rich mock data.
- `src/store/slices/feedbackSlice.ts`
  - Reason: Redux Toolkit state machine managing ticket collections, filter state, active KPI card filter, selected feedback ID, closure modal, profile modal, and optimistic mutation reducers.
  - Impacted behavior: Drives instantaneous state transitions across the feedback dashboard.
- `src/store/index.ts`
  - Reason: Mount `feedbackReducer` onto the root Redux application store.
  - Impacted behavior: Enables access to parent feedback state via `useAppSelector((state) => state.feedback)`.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Positioned `Góp ý` navigation item with `faCommentDots` icon strictly between `Sổ tay PH` and `Lịch sự kiện` under `NHÀ TRƯỜNG`.
  - Impacted behavior: Provides direct sidebar access to the feedback module in the required menu position.
- `src/modules/school/feedback/FeedbackKPICards.tsx`
  - Reason: Renders 4 top status metric cards (`Yêu cầu mới`, `Đang xử lý`, `Hoàn tất`, `Mở lại`) displaying school-year totals and acting as clickable table filter toggles with a "Xóa bộ lọc" reset action.
  - Impacted behavior: Provides instant situational awareness and single-click filtering without zeroing out counters.
- `src/modules/school/feedback/FeedbackToolbar.tsx`
  - Reason: Hosts school year selector, keyword search input, and multi-factor dropdown filters (category, priority, assignee, waiting-for, dates) with a reset button.
  - Impacted behavior: Drives real-time client-side roster filtering without page reloads.
- `src/modules/school/feedback/FeedbackRow.tsx`
  - Reason: Renders individual ticket row with code, title, category tag, student, parent, status badge, waiting-for tag, inline assignee select, inline priority select, and action buttons.
  - Impacted behavior: Enables high-velocity inline triage without modal friction.
- `src/modules/school/feedback/FeedbackRoster.tsx`
  - Reason: Responsive table roster container with header sorting, empty search state illustration, and summary footer counts.
  - Impacted behavior: Primary administrative list view for feedback tickets.
- `src/modules/school/feedback/DiscussionStream.tsx`
  - Reason: Renders chronological two-way discussion stream between school and parent, with author role badges, timestamps, and attachment links.
  - Impacted behavior: Provides transparent, auditable communication history.
- `src/modules/school/feedback/DiscussionComposer.tsx`
  - Reason: Textarea composer for school staff replies, with image attachment preview and disabled submit button when text is empty.
  - Impacted behavior: Enforces message non-emptiness before sending and flips turn-taking state to 'parent'.
- `src/modules/school/feedback/ClosureModal.tsx`
  - Reason: Modal dialog enforcing confirmation modal GY-01 ("Vui lòng xác nhận Đóng góp ý {tên góp ý}") before transitioning status to completed.
  - Impacted behavior: Prevents premature or accidental ticket resolution.
- `src/modules/school/feedback/ProfileQuickViewModal.tsx`
  - Reason: Read-only modal displaying student or parent background, demographic, and contact information with `"Chưa có {trường}"` fallback text.
  - Impacted behavior: Adheres to Decree 13/2023/NĐ-CP on personal data protection while providing administrative context.
- `src/modules/school/feedback/FeedbackDetailPane.tsx`
  - Reason: Main 70/30 split detail surface integrating discussion stream, composer, and 3 metadata cards ("Thông tin góp ý", "Thông tin người tạo", "Góp ý gần đây").
  - Impacted behavior: Serves as the primary inquiry resolution surface.
- `src/pages/[schoolCode]/school/feedback/index.tsx`
  - Reason: Canonical page route rendering KPI cards, toolbar, and roster table within `PortalLayout`.
  - Impacted behavior: Primary administrative dashboard mounted at `/[schoolCode]/school/feedback`.
- `src/pages/[schoolCode]/school/feedback/[feedbackId].tsx`
  - Reason: Dynamic detail page route rendering `FeedbackDetailPane` based on URL parameter.
  - Impacted behavior: Allows direct deep-linking to specific feedback tickets.
- `tests/unit/feedback.test.mjs`
  - Reason: Comprehensive automated test suite verifying pure validation functions, Redux state machine, navigation placement, and parent-only inception invariants.
  - Impacted behavior: Guarantees zero regressions and proves 100% boundary rule compliance.

## Docs Before Code

- Pre-code docs read: `.agents/specs/043-school-parent-feedback-gop-y/spec.md`, `plan.md`, `docs_legacy/operating-portal/11. gop-y.md`.
- Pre-code docs updated: Initialized development ledger under `docs/development/E-028-school-parent-feedback/`.
- Relationship map reviewed: Confirmed feature placement within Module 5 (Nhà Trường) strictly between Sổ tay PH and Lịch sự kiện.
- Related features checked: `042-school-parent-handbook-so-tay-ph`, `024-school-announcements`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: no change needed / PRD defines Góp Ý requirements AC-098 through AC-102 under M5 Nhà Trường.
- `docs/tasks.md`: updated because marked T-028-001-001-school-parent-feedback as completed with full implementation evidence and test results.
- `docs/knowledge.md`: no change needed / Knowledge base records K054 (parent-only inception), K055 (KPI cards dual-purpose), K056 (inline priority triage), K057 (reactive turn-taking), and K058 (closure modal GY-01).
- `docs/decisions.md`: no change needed / Decision records document asymmetric friction model, parent-only ticketing, and turn-taking mechanics.
- `docs/memory.md`: no change needed / Memory records project facts and resolved clarification ledger items.
- `docs/planning/flows.md`: no change needed / Interaction flows match implemented ticketing workflows.
- `docs/planning/screens.md`: no change needed / Screen catalog matches implemented views.
- `docs/planning/diagrams.md`: no change needed / Architecture diagrams match implemented boundaries.

### Development Ledger Docs

- Epic notes: `docs/development/E-028-school-parent-feedback/epic.md` updated with full acceptance criteria checkmarks and implementation details.
- Module notes: `docs/development/E-028-school-parent-feedback/modules/M-028-001-school-parent-feedback.md` authored with responsibility, contracts, commentary, and verification.
- Feature notes: `docs/development/E-028-school-parent-feedback/features/F-028-001-school-parent-feedback.md` authored with user value, Jira story, PM notes, and requirements trace.
- Page notes: `docs/development/E-028-school-parent-feedback/pages/P-028-001-school-parent-feedback.md` authored with route surfaces, UI states, interactions, and accessibility.
- Task notes: `docs/development/E-028-school-parent-feedback/tasks/T-028-001-001-school-parent-feedback.md` authored with execution log, write scope, verification results, and handoff.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `node --test tests/unit/feedback.test.mjs` && `npm test` && `npm run build`
- Result: 16/16 unit tests passing in 117ms; 522/522 full suite tests passing across 110 test suites; clean production build with 77/77 static pages prerendered.
- Residual documentation risk: None; all 10 business rules and 5 clarification ledger items (K054 through K058) fully traced and verified.

## PM Summary

- What changed for the POC: Delivered the complete School Parent Feedback (Góp Ý) module positioned in the sidebar between Sổ tay PH and Lịch sự kiện, with 4 dual-purpose status KPI cards, multi-factor toolbar, inline priority and assignee triage, two-way discussion stream, composer with empty-state submit disablement, guarded closure confirmation modal GY-01, and read-only profile modals.
- What the PM can demo now:
  1. Access `/[schoolCode]/school/feedback` from the sidebar navigation.
  2. Click status KPI cards to filter the table roster while retaining global school-year count summaries.
  3. Change priority inline from "Trung bình" to "Khẩn cấp" without confirmation modals.
  4. Assign staff handler directly from table row dropdown.
  5. Deep-link to ticket detail, inspect parent attachments, and submit school responses.
  6. Attempt to close ticket to verify guarded confirmation modal GY-01.
  7. Click student or parent names to inspect read-only profile popups.
- What remains uncertain: None; all functional requirements and acceptance criteria verified.
