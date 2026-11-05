---
id: E-002-operations-activity
type: epic
status: completed
owner_skill: sophia-product-manager
source_trace:
  - docs/prd.md
  - docs_legacy/operating-portal/van-hanh/hoat-dong.md
verification:
  - tests/unit/activity.test.mjs
jira:
  story: "As a school principal and homeroom teacher, I want a class activity timeline and composer to share classroom moments with parents."
  priority: P0
  labels:
    - operations
    - activities
    - social-feed
---

# Epic: Operations Class Activity Feed (Hoạt Động)

## Jira Story

- Story: As a homeroom teacher, I want to compose daily classroom activity updates with attached photos, student `@mentions`, lesson `#hashtags`, and preset template sentences, so that parents can track their child's learning journey and interact with class events.
- Jira issue type: Epic
- Acceptance owner: `sophia-product-manager`
- Product hypothesis: Providing teachers with a one-click rich activity composer with preset templates ($) and auto-tagging will boost daily parent engagement by over 60%.
- Research evidence: Legacy operating portal audit (`docs_legacy/operating-portal/van-hanh/hoat-dong.md`) verifies teacher demand for multi-media posts, audience selection (Current Class vs Whole School), and engagement counters (Likes, Views, Comments).

## Priority

- Priority: P0 (Blocker)
- Severity if missed: Critical — Operational social feed is a core deliverable of Module 1: Vận Hành.
- Rationale: Required for daily parent-school engagement alongside per-class attendance.
- Target release: Phase 1 MVP

## Outcome

The **Class Activity Feed (Hoạt Động)** establishes a social-style communication timeline for each classroom (`/demo/class/[classId]/activity/`). Homeroom and subject teachers publish daily educational highlights, photos, videos, learning achievements, and announcements. Parents receive instant transparency into their children's daily experiences at school.

This epic is critical for Phase 1 because it transforms the school portal from a pure administrative attendance logger into an engaging communication hub between teachers, students, and families. The feed tightly integrates with the Academic module via hashtag `#` curriculum lesson linking and bridges to the media gallery.

Content published in the feed adheres to a formal approval workflow (BR06), defaulting to a "Chờ duyệt" (Unapproved review) status that reflects upon the school's central moderation dashboard before public distribution to parent mobile applications.

## PM Notes

- PM-visible status: Active implementation of composer, media attachments, approval queue, and interactive feed.
- Demo narrative: Teacher accesses Lớp 1A1 activity page, writes an update using preset sentence `$`, tags students `@` and lesson `#`, attaches photos, submits post to review queue, and demonstrates moderation approval and post interactions.
- Acceptance impact: Unlocks the second core sub-module of Vận Hành.
- Scope change since planning: Includes quick approval simulation toggle to facilitate testing without requiring a separate Admin moderation panel.
- Risk or open decision: In Phase 1, parent comments and likes are tracked as counters; full threaded commenting will be expanded in parent mobile app integration.

## Relationship Map

| Relation | Target | Label | Rationale |
| --- | --- | --- | --- |
| Enables | `F-002-001-operations-activity` | `ENABLES` | Enables the core class activity timeline feature. |
| Extends | `E-001-operations-attendance` | `EXTENDS` | Builds on top of class and student roster established in attendance. |
| Relates to | `docs/prd.md` | `DEPENDS_ON` | Derived from Phase 1 Vận Hành scope. |

## Issues

| Issue ID | Source | Priority | Status | Owner | Evidence | Resolution |
| --- | --- | --- | --- | --- | --- | --- |
| `ISSUE-ACT-001` | Legacy audit | P1 | Closed | `benny-frontend-engineer` | Legacy BR02 | Disable save button when post text is empty and no attachments |
| `ISSUE-ACT-002` | Moderation queue | P0 | Closed | `benny-frontend-engineer` | Legacy BR06 | Initialize newly published posts with `cho_duyet` status |

## Acceptance Criteria

- [x] Criterion 1: Activity composer provides textarea and disables save button when content is empty (BR02).
- [x] Criterion 2: Audience selector supports Lớp hiện tại, Toàn trường, and Nhiều lớp (BR01).
- [x] Criterion 3: Quick triggers chèn `@` (học sinh/giáo viên), `#` (bài học), and `$` (mẫu câu) vào bài đăng (BR03).
- [x] Criterion 4: Newly submitted posts initialize with status `Chờ duyệt` (Unapproved review) (BR06).
- [x] Criterion 5: Feed cards display 3 engagement metrics (Likes, Views, Comments) and hover actions for Pin, Edit, Delete (BR04, BR07).
- [x] Criterion 6: Filter bar supports tabs for Tất cả, Đã duyệt, and Chờ duyệt (BR09).

## Mermaid Diagram

```mermaid
flowchart TD
    Teacher([Giáo Viên / Admin]) --> Composer[Activity Composer]
    Composer --> SetScope[Chọn Đối Tượng: Lớp / Toàn Trường]
    Composer --> SetTags[Gắn Thẻ: @Học sinh, #Bài học, $Mẫu câu]
    Composer --> AttachMedia[Đính Kèm: Ảnh, Video, Tài liệu]
    Composer --> SubmitPost[Bấm 'Lưu Hoạt Động']
    
    SubmitPost --> ReviewQueue[Hàng Đợi: Chờ Duyệt (BR06)]
    ReviewQueue --> AdminApproval{Kiểm Duyệt Nội Dung}
    AdminApproval -- Duyệt --> ApprovedFeed[Bảng Tin: Đã Được Duyệt]
    AdminApproval -- Trả lại --> DraftQueue[Yêu Cầu Chỉnh Sửa]
    
    ApprovedFeed --> ParentApp([Phụ Huynh Xem / Thả Tim / Bình Luận])
    ParentApp --> Metrics[Cập Nhật: ❤️ Lượt Thích / 👁️ Lượt Xem / 💬 Bình Luận]
```

## Evidence

- Tests: Automated unit tests under `tests/unit/activity.test.mjs` asserting all state transitions and validation rules.
- Build/lint: Zero TypeScript build errors and clean Next.js bundle compilation.
- Review notes: Verified by `sophia-product-manager` against Phase 1 operational scope.

## Work Log

- Date: 2026-09-12
  - Action: Initialized Epic E-002 and mapped all business rules from legacy PRD.
  - Agent/skill: `sophia-product-manager`
  - Evidence: Verified BR01 through BR09 in `docs_legacy/operating-portal/van-hanh/hoat-dong.md`.

## Change Log

- Date: 2026-09-12
  - Code change: Created activity feed and composer components.
  - Documentation update: Authored epic specification for class activity feed.
  - Evidence: Verified with strict development docs gate.
