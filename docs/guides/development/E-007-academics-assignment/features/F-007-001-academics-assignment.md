---
id: F-007-001-academics-assignment
type: feature
parent_epic: E-007-academics-assignment
status: active
owner_skill: benny-frontend-engineer
source_trace:
  - docs/prd.md
  - docs_legacy/operating-portal/hoc-tap/bai-tap.md
  - docs/tasks.md
verification:
  - tests/unit/assignment.test.mjs
jira:
  story: "As a teacher or school admin, I want to create, assign, monitor, submit on behalf, grade, and discuss homework assignments so that student independent study is reinforced."
  priority: P0
  labels:
    - academics
    - homework
    - assignment
    - grading
    - submissions
---

# Feature: Academics Homework Management (Bài Tập)

## Jira Story

- Story: As a homeroom teacher, subject teacher, or school administrator, I want to create, assign, schedule, monitor, submit on behalf, grade, and discuss homework assignments for an entire class or specific students, so that learning tasks are reinforced, late submissions are flagged, and communication with parents is clear.
- Jira issue type: Feature
- Acceptance owner: `sophia-product-manager`
- Business value: Eliminates homework coordination friction, enables submission tracking, resolves legacy empty subject defects, and provides transparent grading feedback to students and parents.

## Priority

- Priority: P0 (Blocker)
- Severity if missed: Critical — Homework management is a mandatory daily academic activity connecting classroom instruction with at-home learning.
- Rationale: Second sub-module of Module 2: Học Tập (Academics).
- Target release: Phase 1 Core

## User Value

For subject and homeroom teachers, this feature enables quick assignment creation with rich instruction text, mandatory due dates, syllabus attachments, and flexible audience scoping (whole class vs specific targeted students). Teachers can review real-time submission rosters, record paper submissions on behalf of students, evaluate numeric grades (0.0 - 10.0), and leave individualized feedback notes.

For school administrators and academic directors, it provides school-wide visibility into assignment distribution across grades and subjects, tracking submission and grading completion rates.

For students and parents, it provides clear expectations regarding upcoming homework, scheduled due dates, and actionable teacher evaluations.

## PM Notes

- PM-visible status: Active implementation of homework catalog, assignment creation form, detail view with dual submission roster and discussion tabs, submit-on-behalf grading modal, student roster modal, and extended filter drawer.
- Demo narrative: The teacher opens `/demo/school/assignment`, inspects homework for Class 1A1, filters by subject "Toán", creates a new homework assignment with subject and due date, opens an existing assignment detail view, records a paper submission with a numeric grade and feedback comment, and posts a discussion note.
- Acceptance impact: Full parity with legacy specifications BR01-BR13 and fixes for legacy bugs because both empty subject dropdown and false empty catalog when due dates have passed are resolved.
- Risk & Decision: A known risk was accidental modification of titles after notifications had been dispatched. As a decision, the title field is strictly immutable in edit mode (BR11), and assignment deletion is restricted to drafts, scheduled items, or dispatched items with zero submissions (BR06).

## Requirements Trace

- `BR01`: 4 Mandatory Fields on Create/Edit — Requires Class, Subject, Title, and Due Date ("Hạn nộp bài"). Content, Send Date, Student selection, and Attachments are optional.
- `BR02`: Dynamic Subject Resolution — Resolves the legacy demo defect where "Môn học" was empty ("Chưa có môn học"). Subjects are populated dynamically based on selected class.
- `BR03`: Audience Scope — Defaults to "Cả lớp" (Whole class); can be toggled to select one or more specific students in the class. Reflected directly in the "Giao cho" catalog column.
- `BR04`: Scheduled Send vs Instant Dispatch — If "Ngày gửi" is set to a future datetime, status becomes "Chưa gửi" with schedule notice; if left blank or now, status becomes "Đã gửi" immediately upon dispatch.
- `BR05`: 4 Lifecycle Statuses — "Đã tạo" (Draft), "Chưa gửi" (Scheduled), "Đã gửi" (Dispatched), "Đã thu hồi" (Recalled/Revoked).
- `BR06`: Action Permissions Matrix:
  - "Đã tạo" / "Chưa gửi": Edit, Send, Delete.
  - "Đã gửi" (with 0 submissions): Edit, Send, Delete.
  - "Đã gửi" (with submissions > 0): Edit, Send (Delete forbidden).
  - Unassigned (no students): Edit, Delete (Send forbidden).
- `BR07`: Detail View Structure — Overview card (Subject, Created date, Class, Status, Attachments, Due date, Description) and two tabs: "Danh Sách Học Sinh" and "Thảo Luận (n)".
- `BR08`: Submission Roster — Table of enrolled students with Full Name, Student Code, Submission Status ("Đã nộp bài" vs "Chưa nộp bài"), Attached Submission File, Score / Evaluation, "Nộp bài" action button, and "Xóa học sinh" menu item.
- `BR09`: Submit-on-Behalf & Grading Modal — Auto-fills submission timestamp; displays red "Bài nộp này được ghi nhận là trễ hạn" warning if timestamp is after due date; toggle "Đánh giá" reveals Score input and mandatory Feedback comment.
- `BR10`: Discussion Tab — Dedicated comment thread per assignment with message input, timestamps, and author tags.
- `BR11`: Edit Mode Title Lock — "Tên bài tập" is locked and disabled in edit mode. Provides "Hủy bỏ", "Cập nhật", and "Cập nhật và gửi".
- `BR12`: Extended Filters — Drawer supports "Giao cho" (Cả lớp), "Hạn nộp bài" (Đang tiến hành, Hết hạn nộp, Tất cả), and "Trạng thái".
- `BR13`: Default Due Filter Handling — Provides graceful handling so teachers can toggle between active and expired homework without seeing an unexpected empty screen.

## Code Scope

- TypeScript contracts: `src/types/assignment.ts`
- Mock data seed: `src/services/mockAssignmentData.ts`
- Domain validation & algorithms: `src/utils/assignmentValidation.ts`
- Redux Toolkit state machine: `src/store/slices/assignmentSlice.ts`
- UI Components in `src/modules/academics/assignment/`:
  - `AssignmentToolbar.tsx`
  - `AssignmentTable.tsx`
  - `AssignmentSummaryCards.tsx`
  - `SubmissionRosterTable.tsx`
  - `SubmitGradingModal.tsx`
  - `ManageStudentsModal.tsx`
  - `ExtendedAssignmentFilterModal.tsx`
  - `AssignmentDiscussionTab.tsx`
- Next.js Page Routes:
  - `src/pages/[schoolCode]/school/assignment/index.tsx`
  - `src/pages/[schoolCode]/school/assignment/[assignmentId].tsx`
  - `src/pages/[schoolCode]/school/assignment/create/index.tsx`
  - `src/pages/[schoolCode]/school/assignment/edit/[assignmentId].tsx`
- Automated Tests: `tests/unit/assignment.test.mjs`

## Relationship Map

| Relation | Target | Label | Rationale |
| --- | --- | --- | --- |
| Implements | `E-007-academics-assignment` | `IMPLEMENTS` | Core user-facing feature implementing Epic 7. |
| Uses | `M-007-001-academics-assignment` | `USES` | Consumes assignment Redux store slice and pure validation utilities. |
| Rendered by | `P-007-001-academics-assignment` | `RENDERED_BY` | Main page views hosting homework catalog, roster, and modals. |

## Mermaid Diagram

```mermaid
flowchart TD
    Catalog[Assignment Catalog /school/assignment] --> Actions{User Action}
    Actions -->|Create| Form[Create Assignment /create]
    Actions -->|Detail| DetailView[Assignment Detail /[assignmentId]]
    Actions -->|Edit| EditForm[Edit Assignment /edit/[assignmentId]]
    
    Form --> BR01[Validate 4 Mandatory Fields]
    BR01 --> BR02[Dynamic Subject Selection]
    BR02 --> BR04{Scheduled Send Date?}
    BR04 -->|Yes| SetScheduled[Status: Chưa gửi]
    BR04 -->|No| SetDispatched[Status: Đã gửi]
    
    DetailView --> Tab1[Tab 1: Danh Sách Học Sinh]
    DetailView --> Tab2[Tab 2: Thảo Luận]
    
    Tab1 --> SubmitModal[Submit-on-Behalf Modal]
    SubmitModal --> BR09a{Past Due Date?}
    BR09a -->|Yes| LateWarning[Red Late Warning Badge]
    BR09a -->|No| NormalSubmit[On-time Submission]
    SubmitModal --> BR09b{Grading Enabled?}
    BR09b -->|Yes| ReqFeedback[Require Score & Feedback Note]
    
    EditForm --> BR11[Lock Title Field]
```

## Verification

- Command: `node --experimental-strip-types --test tests/unit/assignment.test.mjs`
- Expected: All unit test assertions pass validating 4 mandatory fields, dynamic subjects, late arrival warning, submit-on-behalf grading, and BR06 action permissions.
- Result: Verification evidence recorded during GREEN execution.

## Work Log

- Date: 2026-09-12
  - Action: Initialized feature specifications and mapped requirements for homework assignments.
  - Agent/skill: `benny-frontend-engineer`
  - Evidence: Verified legacy specifications in `bai-tap.md`.

## Change Log

- Date: 2026-09-12
  - Code change: Implemented core architecture for assignment validation, submit-on-behalf grading, and catalog filtering.
  - Documentation update: Authored feature note with detailed requirement trace.
  - Evidence: Passing unit tests in `assignment.test.mjs`.
