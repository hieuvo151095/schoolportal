---
id: P-008-001-academics-gradebook
type: page
parent_epic: E-008-academics-gradebook
status: active
owner_skill: benny-frontend-engineer
source_trace:
  - docs/development/E-008-academics-gradebook/epic.md
  - docs_legacy/operating-portal/hoc-tap/diem-danh-gia.md
verification:
  - tests/unit/gradebook.test.mjs
jira:
  story: "As an end-user, I want responsive, accessible, and intuitive UI screens for the gradebook overview, subject score entry, term summary, and developmental rubric dialog."
  priority: P0
  labels:
    - academics
    - gradebook
    - ui-page
    - responsive
---

# Page: Academics Gradebook & Evaluation Screens

## Jira Story

- Story: As a teacher, school accountant, or administrator, I want responsive web pages for gradebook overview, subject mark entry with auto-computed TBHK, term summaries, and developmental rubric modals, so that I can manage student academic outcomes efficiently.
- Jira issue type: Page
- Acceptance owner: `benny-frontend-engineer`

## Priority

- Priority: P0 (Blocker)
- Severity if missed: Blocker for user interaction with student marks and evaluations.
- Target release: Phase 1 Core

## Route / Surface

| Route Pattern | View / Screen | Purpose |
| :--- | :--- | :--- |
| `/[schoolCode]/school/scoreboard` | Scoreboard Overview | Primary matrix browsable by class, terms, and evaluation paradigm (Numeric vs Rubric). |
| `/[schoolCode]/school/scoreboard/grade/[classId]/[termId]` | Subject Grade Entry | Dedicated matrix for entering ĐĐGTX, ĐĐGGK, ĐĐGCK scores and reviewing auto-calculated TBHK. |
| `/[schoolCode]/school/scoreboard/summary/[classId]/[termId]` | Term Summary & Evaluation | Homeroom review page for evaluating KQ học tập, KQ rèn luyện, attendance tallies, and comments. |

## PM Notes

- PM-visible status: Active implementation of 3 main pages and 1 modal component.
- Visual design rationale: The layout uses ECO Design System 1.0 cards, crisp typography, and responsive tables because educators need clear scannability across dense student marks.
- Decision: We chose to separate subject score entry from homeroom summary into distinct routes because subject teachers and homeroom teachers have different grading roles and schedules.
- Tradeoff: Splitting the views requires route navigation, but prevents cognitive clutter and improves responsiveness on mobile viewports.
- Risk: Teachers might navigate away without saving entered marks. Mitigation: The score entry and summary tables feature prominent sticky save buttons and instant Redux feedback.
- Impact: Dramatically streamlines the end-of-term grading period and eliminates spreadsheet transfer errors based on verifiable UI telemetry evidence.

## States

1. **Scoreboard Overview (`/school/scoreboard`)**:
   - `Tab 1: Bảng điểm học tập`: Displays K-12 class rows across terms (Học kỳ I, Học kỳ II, Cả năm) with cell status pills (`Chưa thực hiện`, `Tiến hành`, `Đã công bố`), timestamps, and action buttons (`Nhập điểm`, `Tổng kết`).
   - `Tab 2: Phiếu đánh giá học tập`: Displays preschool classes across 4 terms (Giữa HK I, HK I, Giữa HK II, Cuối năm) with evaluation progress badges.
   - `Filtered / Empty State`: Displays informative empty message if filters match zero classes.
2. **Subject Grade Entry Page (`/grade/[classId]/[termId]`)**:
   - `Loaded with Subjects`: Displays dynamically populated subject dropdown (Toán, Tiếng Việt, Tiếng Anh, etc.), score columns, and real-time TBHK values.
   - `Editing State`: Allows direct numeric score entry (0.0 to 10.0) with validation limits.
   - `Toggle Hide Notes`: Allows teachers to collapse or expand individual student score notes.
3. **Term Summary Page (`/summary/[classId]/[termId]`)**:
   - `Overview Metrics`: Displays completion rate progress cards (e.g. 66% Hoàn thành, 34% Chưa hoàn thành).
   - `Evaluation Table`: Displays Academic result dropdowns (HTT, HT, CHT), Conduct dropdowns (Tốt, Khá, Đạt, Cần cố gắng), and comment text areas.
   - `Bulk Edit Mode`: Pencil icon triggers batch evaluation editing with quick confirm/cancel actions.
4. **Developmental Rubric Modal**:
   - `Open Modal`: Displays student details, 3 competency tables with interactive T/Đ/C rating buttons, attendance inputs, and health status notes.

## Relationship Map

| Relation | Target | Label | Rationale |
| --- | --- | --- | --- |
| Implements | `F-008-001-academics-gradebook` | `IMPLEMENTS` | Renders user-facing pages and screens for the feature. |
| Depends on | `M-008-001-academics-gradebook` | `DEPENDS_ON` | Consumes Redux store slice and validation engine. |
| Uses | `src/modules/academics/gradebook/ScoreboardOverviewGrid.tsx` | `USES` | Incorporates overview grid component into main scoreboard page. |
| Relates to | `docs/tasks.md#TASK-ACAD-003` | `RELATES_TO` | Connects UI surfaces with academic gradebook task. |

## Mermaid Diagram

```mermaid
flowchart TD
    Overview[/school/scoreboard] --> Tab1[Tab 1: Bảng Điểm Học Tập]
    Overview --> Tab2[Tab 2: Phiếu Đánh Giá Học Tập]
    
    Tab1 --> GradePage[/grade/[classId]/[termId]]
    Tab1 --> SummaryPage[/summary/[classId]/[termId]]
    
    Tab2 --> RubricModal[PeriodicEvaluationModal]
    
    GradePage --> SaveGrade[Save Subject Marks & TBHK]
    SummaryPage --> SaveSummary[Publish Term Report]
    RubricModal --> SaveRubric[Save Competency Ratings]
```

## Verification

- Automated testing via `tests/unit/gradebook.test.mjs`.
- Next.js production build `npm run build` validating all 3 static route generations.
- Live HTTP curl checks verifying HTTP 200 on all page endpoints.

## Work Log

- Date: 2026-09-12
  - Action: Documented page routing structure, detailed visual layouts, defined state variations across K-12 numeric scoring and preschool developmental rubrics.
  - Agent/skill: `benny-frontend-engineer`
  - Evidence: Verified wireframes against `diem-danh-gia.md`.
  - Docs updated before code: `docs/development/E-008-academics-gradebook/pages/P-008-001-academics-gradebook.md`.

## Change Log

- Date: 2026-09-12
  - Code change: Documented page routing structure, detailed visual layouts, defined state variations across K-12 numeric scoring and preschool developmental rubrics.
  - Documentation update: Authored page specification note P-008.
  - Evidence: Verified route structure and state mapping.

