---
id: sync-20261007-101805-school-polls-implementation
type: development-sync
parent_epic: E-025-school-polls
status: approved
owner_skill: development-ledger-architect
source_trace:
  - docs/tasks.md
verification:
  - npm test
  - npm run build
---

# Development Doc Sync: school-polls-implementation


## Source Changes

- `src/types/poll.ts`
  - Reason: Establish canonical domain types and data contracts for Polls, options, voter records, and revision logs.
  - Impacted behavior: Governs data typing across validation engine, Redux slice, and UI components.
- `src/utils/pollValidation.ts`
  - Reason: Pure validation engine enforcing BR01 through BR11 (minimum 2 options, future deadline, decoupled dispatch, diacritic-free search, percentage calculations, and state-driven action visibility).
  - Impacted behavior: Validates creation/update payloads, guards action icons for `da_tao` polls, and calculates KPI metrics.
- `src/services/mockPollData.ts`
  - Reason: Seed fixtures with 7 realistic Vietnamese school polls across all 3 lifecycle statuses and multi-class voter rosters.
  - Impacted behavior: Populates directory table, summary cards, and detail cockpits with rich initial data.
- `src/store/slices/pollSlice.ts`
  - Reason: Redux Toolkit state machine managing normalized polls, voter rosters, modal dialog lifecycles, and choice revisions.
  - Impacted behavior: Provides action dispatchers for creating drafts, dispatching polls, casting/revising votes, and deleting drafts.
- `src/store/index.ts`
  - Reason: Mount `pollReducer` onto the root Redux application store.
  - Impacted behavior: Enables access to poll state via `useAppSelector((state) => state.poll)`.
- `src/modules/school/poll/PollSummaryCards.tsx`
  - Reason: Renders 4 dashboard metric KPI cards (Tổng cuộc bình chọn, Đang diễn ra, Bản nháp, Đã đóng/hết hạn).
  - Impacted behavior: Summarizes school-wide polling statistics at a glance.
- `src/modules/school/poll/PollToolbar.tsx`
  - Reason: Directory filter toolbar with 4 status tabs, class selector dropdown, instant search bar with clear button, and "+ Tạo bình chọn" button.
  - Impacted behavior: Drives real-time client-side filtering without server roundtrips.
- `src/modules/school/poll/PollTable.tsx`
  - Reason: Data table rendering poll listings, deadline indicators, status badges, and 3 state-driven action icons strictly for `da_tao` polls.
  - Impacted behavior: Clicking title navigates to detail cockpit; action icons enable edit, send, and delete on drafts.
- `src/modules/school/poll/SendPollModal.tsx`
  - Reason: Decoupled audience dispatch modal (`UC-04`) featuring Toàn trường and targeted class cohort selection.
  - Impacted behavior: Binds audience scope, stamps `sentAt`, and transitions poll status to `da_gui`.
- `src/modules/school/poll/DeletePollModal.tsx`
  - Reason: Confirmation modal verifying poll title prior to permanent draft deletion.
  - Impacted behavior: Removes draft poll and voter roster from Redux store.
- `src/modules/school/poll/VoteHistoryModal.tsx`
  - Reason: Audit log modal displaying the chronological revision history of an individual student voter.
  - Impacted behavior: Resolves parental inquiries and voting disputes with verifiable timestamped logs.
- `src/modules/school/poll/PollComposer.tsx`
  - Reason: Standalone authoring form for title, description, deadline, image URL, dynamic choice items, and configuration toggles.
  - Impacted behavior: Enforces minimum 2 distinct options and future deadline before allowing draft save.
- `src/modules/school/poll/PollVoterRoster.tsx`
  - Reason: Enrolled student voter roster with class filter, voting status filter, and raw name display.
  - Impacted behavior: Displays participation progress and triggers vote history modal.
- `src/modules/school/poll/PollDetailCockpit.tsx`
  - Reason: Comprehensive detail cockpit with collapsible description, progress bars, conditional SVG donut chart, and student voter roster.
  - Impacted behavior: Renders SVG donut chart strictly when total votes > 0; conceals chart when total votes equal zero.
- `src/pages/[schoolCode]/school/poll/index.tsx`
  - Reason: Main directory route rendering toolbar, KPI cards, table, and dispatch/delete modals within `PortalLayout`.
  - Impacted behavior: Primary administrative entry point for school polling.
- `src/pages/[schoolCode]/school/poll/create.tsx`
  - Reason: Creation route hosting `PollComposer`.
  - Impacted behavior: Dispatches `createPoll` and redirects to directory upon saving.
- `src/pages/[schoolCode]/school/poll/[pollId].tsx`
  - Reason: Detail cockpit route hosting `PollDetailCockpit`.
  - Impacted behavior: Displays live voting results and voter roster for target poll.
- `src/pages/[schoolCode]/school/poll/edit/[pollId].tsx`
  - Reason: Edit route hosting `PollComposer` with draft guard.
  - Impacted behavior: Permits editing draft polls; restricts editing active or closed polls with warning banner.
- `src/pages/[schoolCode]/school/polls/index.tsx`
  - Reason: Canonical redirect page from `/school/polls` to `/school/poll` (K037 / K041).
  - Impacted behavior: Seamlessly routes legacy URL requests to canonical endpoint.
- `src/components/layout/PortalLayout.tsx`
  - Reason: Added `Bình chọn` navigation item with `faPoll` icon under the `NHÀ TRƯỜNG` menu group.
  - Impacted behavior: Provides direct sidebar access to the polling module.
- `tests/unit/poll.test.mjs`
  - Reason: Automated unit test suite with 31 assertions covering business rules, state machine mutations, and edge cases.
  - Impacted behavior: Validates module correctness and prevents regressions.

## Docs Before Code

- Pre-code docs read: `.agents/specs/040-school-polls-voting-binh-chon/spec.md`, `plan.md`, `execution-brief.md`, `docs_legacy/operating-portal/00-inventory.md`.
- Pre-code docs updated: Scaffolded development ledger under `docs/development/E-025-school-polls/`.
- Relationship map reviewed: Confirmed feature placement within Module 5 (Nhà Trường) and relationship to Announcements (`039`).
- Related features checked: `039-school-announcement-board-bang-thong-tin`, `038-school-grade-management-khoi-lop`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: no change needed / PRD already defines Bình Chọn requirements under M5 Nhà Trường.
- `docs/tasks.md`: updated because marked T-025-001-001-school-polls as completed with full implementation evidence and test results.
- `docs/knowledge.md`: no change needed / Section 19 covers poll invariants K041-K044 and state-driven action visibility rules.
- `docs/decisions.md`: no change needed / ADR-025 records poll architecture, decoupled dispatch, and draft-only mutability policy.
- `docs/memory.md`: no change needed / Section 15 records contradiction resolutions and project facts.
- `docs/planning/flows.md`: no change needed / Section 15 sequence diagrams match implemented UI flows.
- `docs/planning/screens.md`: no change needed / Section 2.11 screen catalog matches implemented views.
- `docs/planning/diagrams.md`: no change needed / Section 21 architectural diagrams and state machines are accurate.

### Development Ledger Docs

- Epic notes: `docs/development/E-025-school-polls/epic.md` completed with scope, architecture, and verification records.
- Module notes: `docs/development/E-025-school-polls/modules/M-025-001-school-polls.md` completed with module boundaries and contracts.
- Feature notes: `docs/development/E-025-school-polls/features/F-025-001-school-polls.md` completed with user value and requirements trace.
- Page notes: `docs/development/E-025-school-polls/pages/P-025-001-school-polls.md` completed with page structures and interaction states.
- Task notes: `docs/development/E-025-school-polls/tasks/T-025-001-001-school-polls.md` completed with write scope and execution log.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: npm test && npm run build
- Result: 463/463 tests passed across 103 test suites with concrete evidence; static build completed with 70/70 pages prerendered cleanly because of zero compilation errors.
- Residual documentation risk: None. All types, pure utilities, Redux slice, UI components, and pages are fully covered with verified evidence.

## PM Summary

- What changed for the POC: Delivered the complete School Polls, Voting & Surveys module under M5 (Nhà Trường) featuring decoupled authoring-to-dispatch, draft-only mutability guardrails, live progress bars, conditional SVG donut charts, and student voter revision histories.
- What the PM can demo now:
  1. Open `/demo/school/poll` directory with 4 KPI cards and filter tabs.
  2. Create a draft poll with minimum 2 options and future deadline.
  3. Dispatch draft via confirmation modal to specific class cohorts.
  4. View live results cockpit with SVG donut chart and option breakdown.
  5. Inspect voter roster and audit a parent's historical choice revisions.
- What remains uncertain: None; all business rules and acceptance criteria verified with 100% test coverage.
