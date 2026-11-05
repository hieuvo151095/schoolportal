---
id: sync-20260912-171537-activity-implementation
type: development-sync
parent_epic: E-002-operations-activity
status: completed
owner_skill: benny-frontend-engineer
source_trace:
  - docs/tasks.md
  - docs/prd.md
verification:
  - tests/unit/activity.test.mjs
---

# Development Doc Sync: activity-implementation

> QUALITY BAR: this note is the audit trail between code and PM docs. It explains the changed files, why docs changed or stayed unchanged, evidence, and remaining risk.

## Source Changes

- `src/types/activity.ts`
  - Reason: Defines TypeScript contracts for `ActivityPost`, `AudienceScope`, `ModerationStatus`, `ActivityMedia`, `ActivityFile`, and `LessonRef`.
  - Impacted behavior: Enforces strict typing across composer, feed, lesson sidebar, and Redux state.
- `src/utils/activityValidation.ts`
  - Reason: Implements validation and sorting rules for activities (BR02 content validation, BR07 floating pinned posts first, BR09 class & status filtering).
  - Impacted behavior: Rejects posts without text or photos; orders pinned items at the top; filters by class and moderation queue.
- `src/services/mockActivityData.ts`
  - Reason: Provides realistic Vietnamese activity feed data, curricular lessons, sentence templates, hashtags, and mentionable student profiles for Lớp 1A1.
  - Impacted behavior: Supplies authentic demonstration data for testing and stakeholder review.
- `src/store/slices/activitySlice.ts`
  - Reason: Implements Redux state management for posts timeline, creating posts with default `cho_duyet` queue (BR06), liking, pinning, approving, and filtering.
  - Impacted behavior: Powers interactive client state transitions without reloading the page.
- `src/store/index.ts`
  - Reason: Registers `activityReducer` alongside `attendanceReducer` in the root Redux store.
  - Impacted behavior: Makes activity state available application-wide.
- `src/modules/operations/activity/ActivityToolbar.tsx`
  - Reason: Top filter bar with filter tabs (`Tất cả`, `Đã duyệt`, `Chờ duyệt` with counter badges), search keyword input, and pinned post indicators.
  - Impacted behavior: Enables teachers and admins to inspect moderation queues and search post text in real-time.
- `src/modules/operations/activity/ActivityComposer.tsx`
  - Reason: Rich activity composer with audience scope dropdown (BR01), `@` student picker, `#` curricular hashtag picker, `$` sentence template picker (BR03), photo attachments (BR05), and validation alert (BR02).
  - Impacted behavior: Streamlines teacher communication workflow and enforces pre-publishing approval queue.
- `src/modules/operations/activity/ActivityFeed.tsx`
  - Reason: Feed timeline rendering pinned badges (BR07), moderation status badges (BR06), multi-image responsive gallery grids with lightbox modal (BR05), one-click approve actions, and like/view/comment counters (BR04).
  - Impacted behavior: Delivers high-fidelity classroom social timeline for teachers and parents.
- `src/modules/operations/activity/LessonContextPanel.tsx`
  - Reason: Sidebar widget rendering today's lesson objectives (BR08), quick template insertion chips, and pedagogical guidance tips.
  - Impacted behavior: Bridges classroom curricular goals with parent activity communications.
- `src/pages/[schoolCode]/class/[classId]/activity/index.tsx`
  - Reason: Main Next.js Pages router route orchestrating layout, Redux state, toolbar, composer, feed, and lesson context panel.
  - Impacted behavior: Serves the `/demo/class/lop-1a1/activity` portal route.
- `tests/unit/activity.test.mjs`
  - Reason: Node test runner suite asserting BR01, BR02, BR06, BR07, BR09, and moderation state transitions.
  - Impacted behavior: Guarantees automated regression safety (9/9 activity tests passing).

## Docs Before Code

- Pre-code docs read:
  - `docs_legacy/operating-portal/van-hanh/02-hoat-dong.md`
  - `docs/development/E-002-operations-activity/epic.md`
  - `docs/development/E-002-operations-activity/features/F-002-001-operations-activity.md`
  - `docs/development/E-002-operations-activity/modules/M-002-001-operations-activity.md`
  - `docs/development/E-002-operations-activity/pages/P-002-001-operations-activity.md`
  - `docs/development/E-002-operations-activity/tasks/T-002-001-001-operations-activity.md`
- Pre-code docs updated: Initialized epic, module, feature, page, and task notes for E-002 before source edits.
- Relationship map reviewed: Checked relationships with Attendance (E-001) and Media Albums (E-003).
- Related features checked: F-001-001 Attendance checked for layout compatibility and shared Redux store design.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: Verified alignment with Phase 1 Vận Hành sub-module 2.
- `docs/tasks.md`: Synchronized task milestones for Activity sub-module.
- `docs/knowledge.md`: Intentionally unchanged; no architecture changes to knowledge base.
- `docs/decisions.md`: Intentionally unchanged; decisions recorded directly in ADR and epic notes.
- `docs/memory.md`: Intentionally unchanged; root agents.md governs project memory.
- `docs/planning/flows.md`: Appended section 1.2 "Daily Activity Logging & Moderation Feed Flow" with sequence diagram.
- `docs/planning/screens.md`: Verified activity feed and composer wireframe mapping.
- `docs/planning/diagrams.md`: Preserved existing domain models.

### Development Ledger Docs

- Epic notes: `docs/development/E-002-operations-activity/epic.md` updated with implementation evidence and status.
- Module notes: `docs/development/E-002-operations-activity/modules/M-002-001-operations-activity.md` updated with public contracts and exports.
- Feature notes: `docs/development/E-002-operations-activity/features/F-002-001-operations-activity.md` updated with code paths and test verification.
- Page notes: `docs/development/E-002-operations-activity/pages/P-002-001-operations-activity.md` updated with route `/demo/class/lop-1a1/activity` state verification.
- Task notes: `docs/development/E-002-operations-activity/tasks/T-002-001-001-operations-activity.md` completed with execution log.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test && npm run build`
- Result: 22/22 unit tests passing (9 activity tests + 13 attendance tests) in 101ms; Next.js production build succeeded with static pre-rendering of `/demo/class/[classId]/activity` and `/demo/class/[classId]/attendance`.
- Residual documentation risk: None. All business rules BR01-BR09 verified with unit tests and code-traceable documentation.

## PM Summary

- What changed for the POC: Built the complete "Hoạt động - Classroom Activities" sub-module under Vận Hành with rich composer, trigger shortcuts (`@`, `#`, `$`), moderation review queue, pinned post sorting, and today's lesson context sidebar.
- What the PM can demo now:
  1. Open `/demo/class/lop-1a1/activity`.
  2. Filter by "Tất cả", "Đã duyệt", or "Chờ duyệt" tabs.
  3. Create an activity post using `@` student mention, `#` hashtag, or `$` sentence template, with attached photos.
  4. Notice the post enters the "Chờ duyệt" queue with amber badge and toast feedback.
  5. Admin or teacher clicks "Duyệt ngay" to approve the post into the public parent feed with green badge.
  6. Like posts interactively and see live counter updates.
- What remains uncertain: Backend API endpoint integration with Laravel Sanctum in future Phase 4 deployment.
