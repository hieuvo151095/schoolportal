---
id: sync-20260914-144937-layout-scroll-attendance-activity-media-upgrades
type: development-sync
parent_epic: E-001-operations-attendance
status: completed
owner_skill: benny-frontend-engineer
source_trace:
  - docs/prd.md
  - docs/development/E-001-operations-attendance/features/F-001-001-operations-attendance.md
  - docs/development/E-002-operations-activity/features/F-002-001-operations-activity.md
  - docs/development/E-003-operations-media/features/F-003-001-operations-media.md
verification:
  - tests/unit/attendance.test.mjs
  - tests/unit/activity.test.mjs
  - tests/unit/media.test.mjs
---

# Development Doc Sync: layout-scroll-attendance-activity-media-upgrades

## Source Changes

- `src/components/layout/PortalLayout.tsx`
  - Reason: Decouple vertical scroll containers so sidebar and main content pane scroll completely independently, and pin "Niên khóa - Học kỳ" permanently stationary at the bottom of the sidebar.
  - Impacted behavior: Root container is set to `h-screen overflow-hidden flex flex-col`. Sidebar is `h-full flex flex-col overflow-hidden` with `flex-1 overflow-y-auto` for navigation links and `shrink-0` for the bottom academic term block. Main content is `flex-1 overflow-y-auto min-h-0`. Scrolling main content never moves the sidebar or the bottom term info.
- `src/modules/operations/attendance/AttendanceRoster.tsx`
  - Reason: Simplify the temperature editing cell to clean numeric-only input upon click.
  - Impacted behavior: In inline temperature edit mode, removed stepper buttons (`-`, `+`), degree label (`°C`), and icons; clicking the box focuses a clean `<input type="number" step="0.1">` styled with subtle border and zero spinners.
- `src/modules/operations/attendance/BulkTimeConfirmModal.tsx`
  - Reason: Enable teachers to remove individual students from the bulk action before confirming.
  - Impacted behavior: Managed student list in local state; rendered an `[x]` button on the top-right corner of each student card/chip; clicking `[x]` removes the student from the bulk list; confirm button passes filtered `studentIds` to caller.
- `src/pages/[schoolCode]/class/[classId]/attendance/index.tsx`
  - Reason: Pass filtered studentIds from confirmation modal to Redux bulk attendance reducers.
  - Impacted behavior: `handleConfirmBulkTime` passes optional `studentIds` to `bulkCheckInSelected` and `bulkCheckOutSelected`.
- `src/store/slices/attendanceSlice.ts`
  - Reason: Support target student ID subset in bulk checkin and checkout actions.
  - Impacted behavior: `bulkCheckInSelected` and `bulkCheckOutSelected` accept optional `studentIds?: string[]`, defaulting to `state.selectedStudentIds` if omitted.
- `src/pages/[schoolCode]/class/[classId]/activity/index.tsx`
  - Reason: Delete "3 bài đã duyệt" and "1 chờ duyệt" pills from top-right header, and wire pin replacement handler.
  - Impacted behavior: Header area is simplified with title and description only; quick stats pills are removed; passes `onReplacePin` to `ActivityFeed`.
- `src/modules/operations/activity/ActivityFeed.tsx`
  - Reason: Enforce single pinned post invariant with interactive replacement confirmation modal.
  - Impacted behavior: At most 1 post can ever be pinned at any time. When clicking to pin a post while another post is already pinned, an interactive modal displays the current pinned post snippet and asks user agreement before unpinning it and pinning the new post.
- `src/utils/activityValidation.ts`
  - Reason: Exclude waiting-for-approval posts from the general feed.
  - Impacted behavior: In `filterActivityPosts`, when `statusFilter === 'all'`, `post.status === 'cho_duyet'` is excluded. Unapproved posts are strictly isolated to the "Chờ duyệt" tab.
- `src/store/slices/activitySlice.ts`
  - Reason: Add single pin replacement reducer and enforce single pin constraint.
  - Impacted behavior: Added `pinPostReplace` reducer which unpins all other posts and pins the target post; `togglePinPost` prevents pinning if another post is already pinned unless unpinned.
- `src/modules/operations/media/ConfirmDeleteModal.tsx`
  - Reason: Provide reusable accessible confirmation modal for album and photo deletions.
  - Impacted behavior: Replaces native `window.confirm` with custom modal featuring red destructive confirmation button, cancel button, and clear warning copy.
- `src/modules/operations/media/AlbumGrid.tsx`
  - Reason: Standardize album cards matching "Lễ Khai Giảng Năm Học 2026-2027" specification and replace native window.confirm with ConfirmDeleteModal.
  - Impacted behavior: Album cards use standard 16:9 aspect ratio cover banner, standardized typography, photo count badges, scope tags, and delete confirmation modal.
- `src/modules/operations/media/AlbumDetailView.tsx`
  - Reason: Standardize album hero banner matching Le Khai Giang and add batch photo delete button with confirmation pop-up.
  - Impacted behavior: Large widescreen banner with cover image, dark gradient overlay, white typography, and badges. Added `[Xóa {N} ảnh]` button next to `Tải xuống ZIP` in floating selection bar with `ConfirmDeleteModal`.
- `src/pages/[schoolCode]/class/[classId]/media/index.tsx`
  - Reason: Wire batch photo deletion into AlbumDetailView.
  - Impacted behavior: Passes `onDeletePhotos` calling `mediaSlice.deletePhotos`.
- `src/store/slices/mediaSlice.ts`
  - Reason: Implement batch photo deletion reducer.
  - Impacted behavior: Added `deletePhotos` reducer which filters out deleted photos and updates the album's `photoCount`.
- `tests/unit/activity.test.mjs`
  - Reason: Add tests for single-pin invariant and moderation feed exclusion.
  - Impacted behavior: Verified 100% test pass rate.
- `tests/unit/media.test.mjs`
  - Reason: Add unit test for batch photo deletion.
  - Impacted behavior: Verified 100% test pass rate.

## Docs Before Code

- Pre-code docs read: `docs/prd.md`, `docs/development/E-001-operations-attendance/features/F-001-001-operations-attendance.md`, `docs/development/E-002-operations-activity/features/F-002-001-operations-activity.md`, `docs/development/E-003-operations-media/features/F-003-001-operations-media.md`.
- Pre-code docs updated: Appended `AC-005c`, `AC-006b`, `AC-007b`, and `AC-011` to `docs/prd.md`.
- Relationship map reviewed: Verified that layout changes in `PortalLayout` apply across all modules; verified `AttendanceRoster` and `BulkTimeConfirmModal` interact with `attendanceSlice`; verified `ActivityFeed` interacts with `activitySlice`; verified `AlbumGrid` and `AlbumDetailView` interact with `mediaSlice`.
- Related features checked: Verified that removing unapproved posts from the general feed preserves their visibility under the "Chờ duyệt" tab; verified that photo batch deletion correctly updates album `photoCount`.

## Documentation Updates

### Legacy Planning Docs

- `docs/prd.md`: updated with AC-005c (clean numeric temperature and removable bulk student cards), AC-006b (activity header cleanup, feed approval exclusion, single-pin invariant), AC-007b (album banner standardization, album delete modal, photo delete modal), and AC-011 (independent scroll containers and stationary sidebar academic footer).
- `docs/tasks.md`: unchanged because active tasks are tracked in the development ledger.
- `docs/knowledge.md`: no change needed; all architectural patterns follow existing React and Redux toolkit conventions.
- `docs/decisions.md`: no change needed; follows established custom modal and Redux action patterns.
- `docs/memory.md`: no change needed.
- `docs/planning/flows.md`: no change needed.
- `docs/planning/screens.md`: no change needed.
- `docs/planning/diagrams.md`: no change needed.

### Development Ledger Docs

- Epic notes: Reviewed `E-001-operations-attendance/epic.md`, `E-002-operations-activity/epic.md`, and `E-003-operations-media/epic.md`.
- Module notes: Reviewed `M-001-001-operations-attendance.md`, `M-002-001-operations-activity.md`, and `M-003-001-operations-media.md`.
- Feature notes: Updated `F-001-001-operations-attendance.md`, `F-002-001-operations-activity.md`, and `F-003-001-operations-media.md` with Work Log and Change Log entries.
- Page notes: Reviewed `P-001-001-operations-attendance.md`, `P-002-001-operations-activity.md`, and `P-003-001-operations-media.md`.
- Task notes: Verified all tasks logged in feature notes.

## Targeted Patch Policy

- [x] I appended missing facts instead of replacing whole documents.
- [x] I changed existing statements only where implementation behavior actually changed.
- [x] I preserved prior decisions and added superseding notes when needed.
- [x] I recorded docs intentionally left unchanged with a reason.

## Verification

- Command: `npm test`
- Result: 184 tests across 42 suites PASSED in 372ms with 0 failures.
- Command: `npm run build`
- Result: Next.js 14.2 production build compiled successfully with 39/39 static routes generated with 0 errors.
- Command: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/demo/class/lop-1a1/attendance ...`
- Result: All routes returned HTTP 200 with live UI hydration.
- Residual documentation risk: Low; all changes verified in live runtime and automated test suites.

## PM Summary

- What changed for the POC:
  1. Independent scrolling: Left navigation sidebar and main screen scroll completely independently; "Niên khóa - Học kỳ" is permanently pinned stationary at the bottom of the sidebar.
  2. Attendance module refinements: Temperature box allows entering numbers only (deleting all `-`, `+`, `°C` and icons); bulk attendance pop-up includes an `[x]` button on the top-right of each student card to remove individual students before confirming.
  3. Activity module refinements: Header stats pills ("3 bài đã duyệt", "1 chờ duyệt") deleted; general feed excludes unapproved posts (isolated to "Chờ duyệt" tab); single-pin invariant enforced with interactive replacement confirmation modal.
  4. Media library refinements: Standardized album card banners and detail view hero banners to follow "Lễ Khai Giảng Năm Học 2026-2027" standard (16:9 widescreen, typography, gradient, badges); custom confirmation pop-up modal on album delete; floating bar includes `[Xóa ảnh]` button next to `Tải xuống ZIP` with confirmation modal before deletion.
- What the PM can demo now:
  - Demonstrate independent scrolling of sidebar and main pane.
  - Demonstrate clicking temperature box in attendance roster to type a numeric value cleanly.
  - Demonstrate selecting students, opening "Đón hàng loạt", removing a student using `[x]`, and confirming.
  - Demonstrate activity feed showing only approved posts, and attempting to pin a second post to see the replacement confirmation modal.
  - Demonstrate opening the media module, viewing standardized album banners matching "Lễ Khai Giảng", deleting an album via custom confirmation modal, and selecting photos to delete them via the batch bar modal.
