---
id: sync-20260914-114057-attendance-bulk-timer-and-activity-mentions
type: development-sync
parent_epic: E-001-operations-attendance
status: completed
owner_skill: benny-frontend-engineer
source_trace:
  - docs/prd.md
  - docs/development/E-001-operations-attendance/features/F-001-001-operations-attendance.md
  - docs/development/E-002-operations-activity/features/F-002-001-operations-activity.md
verification:
  - tests/unit/attendance.test.mjs
  - tests/unit/activity.test.mjs
  - scripts/test_feature_verification.mjs
---

# Development Doc Sync: attendance-bulk-timer-and-activity-mentions

## Source Changes

- `src/pages/[schoolCode]/class/[classId]/attendance/index.tsx`
  - Reason: Fix class switcher bug where useEffect was overriding the user's selected class with routerClassId, integrate BulkTimeConfirmModal for bulk checkin and checkout actions, and remove obsolete header buttons.
  - Impacted behavior: Selecting another class in the toolbar dropdown now invokes shallow router push and updates Redux state, smoothly loading that class's student roster. Clicking "Đón hàng loạt" or "Trả hàng loạt" opens the confirmation modal with adjustable timer steppers. The buttons "In sổ điểm danh" and "Đồng bộ dữ liệu" are deleted from the top-right header.
- `src/modules/operations/attendance/BulkTimeConfirmModal.tsx`
  - Reason: Deliver the confirmation pop-up modal allowing teachers to review selected students and adjust arrival/departure timestamps before executing bulk attendance.
  - Impacted behavior: Modal renders chips of selected students, displays a time input with quick steppers (`-15p`, `-5p`, `Hiện tại`, `+5p`, `+15p`), and fires `onConfirm(time)` on submit.
- `src/store/slices/attendanceSlice.ts`
  - Reason: Make bulk checkout robust when selecting all students even if some students have missing arrival times.
  - Impacted behavior: In `bulkCheckOutSelected`, if a selected student has no recorded arrival time, the slice sets a safe default `arrivalTime = '07:30'` and status `'present'` before assigning the departure time.
- `src/modules/operations/activity/ActivityFeed.tsx`
  - Reason: Remove comment counter and sharing icons per user request, and enhance `@` mention highlighting to span the student's full name.
  - Impacted behavior: Post footer displays only Likes ❤️ and Views 👁️ counters. Content renderer tokenizes full student names (e.g., `@Nguyễn Minh Khang`) into blue rounded badge pills.
- `src/modules/operations/activity/ActivityComposer.tsx`
  - Reason: Provide inline `@` mention autocomplete popup as user types `@` in the textarea, with keyboard and mouse selection.
  - Impacted behavior: Typing `@` opens an inline floating card listing students from the active class with avatars, names, and IDs. Typing filters the list. Pressing Arrow Up/Down navigates, and pressing Enter/Tab or clicking inserts `@Student Name ` and focuses the textarea.
- `src/pages/[schoolCode]/class/[classId]/activity/index.tsx`
  - Reason: Provide active class student roster to the composer for dynamic `@` autocomplete and bind dynamic class name in page title.
  - Impacted behavior: Mentionable students are populated from `CLASS_STUDENTS_REGISTRY[classId]`, ensuring all students in the active class are available for tagging.
- `tests/unit/attendance.test.mjs`
  - Reason: Add automated tests for class switching and bulk timer check-in/out.
  - Impacted behavior: Verifies `setSelectedClassId` switches student rosters, and `bulkCheckInSelected` / `bulkCheckOutSelected` apply custom timestamps correctly.
- `tests/unit/activity.test.mjs`
  - Reason: Add automated unit tests for `@` mention trigger regex detection, student tag extraction, and tokenized mention rendering.
  - Impacted behavior: 100% test pass rate across 182 unit test cases.

## Docs Before Code

- Pre-code docs read: `docs/prd.md`, `docs/development/E-001-operations-attendance/features/F-001-001-operations-attendance.md`, `docs/development/E-002-operations-activity/features/F-002-001-operations-activity.md`.
- Pre-code docs updated: Appended AC-005b and refined AC-006 in `docs/prd.md`.
- Relationship map reviewed: Verified that `AttendancePage` depends on `AttendanceToolbar`, `attendanceSlice`, and `BulkTimeConfirmModal`; verified `ActivityComposer` interacts with `activitySlice` and `mockAttendanceData`.
- Related features checked: Checked that removing comment and share icons does not affect the Like toggle or Post approval workflow.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated with AC-005b (bulk attendance confirmation with timer adjustment) and AC-006 (inline `@` mention autocomplete and comment/share icon removal).
- `docs/tasks.md`: unchanged because active tasks are tracked in the development ledger.
- `docs/knowledge.md`: no change needed because no external architectural dependencies were introduced.
- `docs/decisions.md`: no change needed; changes follow existing Redux toolkit and Tailwind modal patterns.
- `docs/memory.md`: no change needed.
- `docs/planning/flows.md`: no change needed.
- `docs/planning/screens.md`: no change needed.
- `docs/planning/diagrams.md`: no change needed.

### Development Ledger Docs

- Epic notes: Reviewed `E-001-operations-attendance/epic.md` and `E-002-operations-activity/epic.md`.
- Module notes: Reviewed `M-001-001-operations-attendance.md` and `M-002-001-operations-activity.md`.
- Feature notes: Updated `F-001-001-operations-attendance.md` and `F-002-001-operations-activity.md` with new Code Scope, Mermaid diagrams, Work Log, and Change Log.
- Page notes: Reviewed `P-001-001-operations-attendance.md` and `P-002-001-operations-activity.md`.
- Task notes: Verified all tasks logged in feature notes.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test`
- Result: 182 tests across 42 suites PASSED in 332ms with 0 failures.
- Command: `npm run build`
- Result: Next.js 14.2 production build compiled successfully with 39/39 static routes generated with 0 errors.
- Command: `node scripts/test_feature_verification.mjs`
- Result: Passed all DOM assertions verifying button deletion, bulk modal controls, and activity mention prompt hint.
- Residual documentation risk: Low; all changes verified in live runtime and automated test suites.

## PM Summary

- What changed for the POC:
  1. Attendance class switcher fixed: Teachers can switch between classes, and the student roster dynamically updates to the chosen class.
  2. Bulk attendance confirmation: Selecting students (or "Chọn tất cả") and clicking "Đón hàng loạt" or "Trả hàng loạt" opens a confirmation modal allowing timer adjustments before confirming.
  3. Header decluttered: The "In sổ điểm danh" and "Đồng bộ dữ liệu" buttons have been completely removed from the top-right header.
  4. Activity post card cleanup: The "Comment" counter and "Sharing" button have been removed from all post cards.
  5. Inline `@` mention autocomplete: In the composer, typing `@` opens an autocomplete dropdown displaying class students with avatars, full names, and IDs, with keyboard navigation and mention badge formatting.
- What the PM can demo now:
  - Demonstrate switching from Lớp 1A1 to Lớp 1A2 or Lớp 2A1 and seeing the student roster change immediately.
  - Demonstrate clicking "Chọn tất cả" -> "Đón hàng loạt" / "Trả hàng loạt", adjusting the time with stepper buttons (`-15p`, `-5p`, `Hiện tại`, `+5p`, `+15p`), and confirming.
  - Demonstrate composing a post, typing `@`, choosing a student from the popup using Arrow keys or click, and seeing the student highlighted as `@Student Name` in the feed.
- What remains uncertain:
  - Phase 2 backend integration with Laravel Sanctum API endpoints for persistence.
