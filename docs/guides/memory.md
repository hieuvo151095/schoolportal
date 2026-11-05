# Project Memory Ledger & Context Preservation

> **Project:** School Operating Portal (Finviet / SOHA)  
> **Governance:** Marcus Fleet V34 Enterprise Architecture  
> **Memory Root:** Preserved from `agents.md` and `docs_legacy`

---

## 1. Historical Constraints Inherited from `agents.md`

- **Tenant Routing Contract:** Every tenant path must conform to the structure `/{schoolCode}/...` for frontend navigation and `/{schoolCode}/api/1.0/...` for backend API interactions. Single codebase deployment across all schools is non-negotiable.
- **Session Cookie Encryption:** Client sessions must not store raw unencrypted JWTs in local storage. All session tokens must be stored in secure HTTP-only JWE encrypted cookies governed by NextAuth.js.
- **Design Foundations:** The visual cortex is bound to `ECO Design System 1.0` with Yellow `#FEC020` brand accent, Blue `#0070CE` primary, and Vietnamese typography defaults (`Baloo Chettan 2`, `Quicksand`, `Inter`).
- **Telemetry Boundaries:** Observability must run Sentry at ~10% trace sampling rate to avoid performance degradation, paired with Google Analytics 4 and Microsoft Clarity.

---

## 2. Accepted Assumptions & Operating Boundaries

1. **Teacher Access Model:** In the legacy audit (`docs_legacy/operating-portal/00-inventory.md`), testing was performed via a super-admin account. It is formally accepted that while admins can view all classes, teachers have role-scoped access restricted to their assigned homeroom and subject classes.
2. **Face Recognition Model Latency:** It is assumed that face recognition model inference runs asynchronously in the cloud rather than locally on client devices. Real-time video stream facial recognition at school turnstiles sends events directly to the backend ingestion queue.
3. **VietQR Payment Automation:** It is assumed that online tuition payments are facilitated via dynamic VietQR codes with automated webhook confirmation from payment gateways (such as Sepay or commercial bank APIs).
4. **Attendance-Tuition Integration:** Verified excused absences in attendance directly generate meal allowance deduction credit lines on the subsequent billing cycle invoice.

---

## 3. Known Blockers & Risk Mitigation

- **Blocker B-001 (Figma Live Sync Token):** The bundled `.mcp.json` reported a minor warning for `figma` due to missing `FIGMA_ACCESS_TOKEN`. This does not block execution because complete design tokens and component primitives are already materialized locally under `ECO Design System/`.
- **Blocker B-002 (Camera Hardware Protocol):** School physical gate camera hardware integration is out-of-scope for the web portal. The web portal consumes ready-made detection events via the REST API endpoint `/{schoolCode}/api/1.0/attendance/face-events`.

---

## 4. TrustGraph & System Governance Notes

- TrustGraph context was ingested during `/init_brain` and recorded into project memory.
- All subsequent slash commands (`/marcus_specify`, `/marcus_plan`, `/design`, `/develop`) must read `docs/prd.md`, `docs/knowledge.md`, and `docs/decisions.md` before generating code or modifying system contracts.
- Code generation remains strictly disabled until the operator completes the planning review gate and issues explicit authorization.

---

## 5. School Administration (Nhà Trường) Domain Memory & Legacy Ambiguity Resolutions

- **Resolution of K006 (Homeroom Teacher Assignment):** The class edit form permits selecting any active teacher, but will display an amber status tag if the selected teacher already homerooms another class, permitting multi-class homeroom edge cases while preventing accidental double-assignment.
- **Resolution of K007 (Grade Level Search Defect):** Rather than depending on a broken server endpoint (`GET /grades?q=...`), search is handled client-side in Redux with immediate sub-millisecond filtering and automatic full list restoration when input is cleared.
- **Resolution of K008 (Student Required Fields & Legacy Nulls):** The creation form `/kid/create/` strictly requires Mã học sinh and CCCD. Existing legacy records lacking these values render a graceful italic badge `Chưa có mã học sinh` without throwing errors or breaking data grids.
- **Extracurricular Class Boundaries:** Extracurricular classes strictly omit financial invoicing, MOET gradebooks, and subject allocation; they only participate in attendance, activity feeds, and photo albums.
- **Contextual Profile Hub Tab Reuse:** In `/school/kid/detail/[id]/`, tabs "Hoạt Động", "Thư Viện", "Điểm Danh", "Học Phí" wrap the respective module feeds with `kidId` pre-filtered in Redux state, guaranteeing 100% feature parity with zero code duplication.

---

## 6. School Administration Phase 2 (Nhà Trường) Operational Boundaries & Ambiguity Resolutions

- **Resolution of K009 (Staff Attendance Rapid Clock-In vs Modals):** Routine morning check-in and check-out actions are classified as high-throughput transactions executed with a single click and an immediate standard toast notification (`addToast`), bypassing confirmation modal friction. Destructive and evaluative actions (marking staff Absent with permission or retroactively editing past hours) strictly enforce modal confirmations.
- **Resolution of K010 (Form Abandonment Guardrail Standardization):** Form cancellation behavior is standardized across all School Administration modules: if the form is dirty (user has modified fields), clicking "Hủy bỏ" prompts a modal confirmation warning of unsaved changes. If the form remains pristine, navigation back to the list proceeds immediately without modal friction.
- **Resolution of K011 (Cross-Module Menu Announcement Sync):** Menus published with "Gửi thông báo" author a corresponding notice in Bảng Thông Tin and store `linkedAnnouncementId`. Updates to menu schedules modify the linked notice payload in Redux. Deleting an announcement from Bảng Thông Tin detaches the link without corrupting the menu schedule; deleting a menu prompts whether to remove the linked announcement.
- **Meal Menu Inheritance Fallback:** If a class lacks a custom weekly menu override, the application automatically resolves and renders the school-wide (`Toàn trường`) weekly menu to prevent blank student meal calendars.
- **Parent Handbook 2-Tier Depth Limit:** The handbook category hierarchy is strictly bounded to Root Categories and Sub-Categories, with Articles as leaf nodes. Nested sub-category creation beyond tier 2 is disabled to prevent UI collapse.

---

## 7. School Administration Phase 3 (Nhà Trường) Operational Boundaries & Ambiguity Resolutions

- **Resolution of K012 (Feedback Status Cards Decoupling):** The 4 status cards at the head of the Góp Ý inbox ("Yêu cầu mới", "Đang xử lý", "Hoàn tất", "Mở lại") function as clickable filters while persistently displaying independent global totals across the school year dataset. Filtering by any status narrows the table roster without zeroing out counters, fixing the legacy visual defect.
- **Resolution of K013 (Student Archive Restoration Continuity):** Restoring a student from Lưu Trữ preserves complete historical academic records. If the student's `formerClassId` is currently active in the current academic year, they are restored directly to that class roster. If the former class is inactive or archived, their status defaults to unassigned ("Chưa xếp lớp") with an amber system warning prompting the administrator to assign an active class.
- **Resolution of K014 (Event Calendar Single-Day Date Population):** In Lịch Sự Kiện event creation, selecting `Từ ngày` auto-populates `Đến ngày` with the identical date if empty, eliminating repetitive input friction for single-day school events while allowing multi-day adjustments.
- **Resolution of K025 (School Event Calendar Route & Architecture Standardization):** Standardizes Lịch Sự Kiện under the `NHÀ TRƯỜNG` menu group at `/[schoolCode]/school/calendar` (with dedicated authoring routes `create` and `edit/[eventId]`), superseding the legacy `/setting/holidays` route. State transitions are governed by an isolated Redux slice (`calendarSlice.ts`) with pure date math in `calendarValidation.ts`. Events of type `ngay_nghi` automatically synchronize with the meal refund holiday calendar (`TASK-FIN-034`) to ensure accurate 100% attendance-based meal deductions.
- **Resolution of K015 (Academic Year Overlap Guard & Temporal Resolution):** The system strictly forbids overlapping date intervals between full academic years (`NH-03`). Sub-terms/semesters are validated to fall strictly within parent boundaries. The active academic year is resolved dynamically against the system clock (`new Date()`) and awarded the green `Hiện tại` badge. Hard deletion of academic years from the UI is permanently blocked to prevent data corruption.
- **Support Ticket Discussion Waiting State:** Feedback threads maintain an active `waitingOn: 'parent' | 'school'` indicator. Admin replies switch the waiting state to 'parent', while parent messages switch it to 'school', ensuring transparent SLA tracking across parent communication.
- **Archive Permanent Purge Safeguards:** Permanently deleting a student from Lưu Trữ enforces a two-step confirmation modal with a red visual warning, verifying that all financial dues are reconciled before records are permanently erased.

---

## 8. Finance (Tài Chính) Miễn Giảm Operational Boundaries & Ambiguity Resolutions

- **Resolution of K016 (Discount Stacking & Conflict Resolution Policy):** When multiple discount policies target the same student and fee line item, the engine resolves conflicts via Highest Discount Priority (`Math.max(rate_1, rate_2)`). Scope Specificity gives individual student-targeted discounts precedence over cohort class-wide discounts on the same fee item. Disjoint fee item discounts (e.g., tuition vs meals vs bus transportation) evaluate independently without cross-item contamination. All deductions are clamped to $[0, \text{grossItemAmount}]$, guaranteeing that line-item balances cannot become negative.
- **Resolution of K017 (Temporal Expiration & Historical Invoice Immutability):** Discount policies whose validity period (`toMonth` or academic year end date) is in the past automatically evaluate to `Hết hạn` (Expired) and are excluded from subsequent invoice generation runs. Modifying, pausing, or expiring a policy strictly governs *future* invoice generation runs; previously generated, sent, or settled invoices (`da_tao`, `da_gui`, `da_thanh_toan`) permanently preserve their historical discount records and audit integrity.
- **Resolution of K018 (Invoice Creation Wizard Discount Override Scope):** Step 1 of the tuition invoice creation wizard (`/school/fee/create`) features an administrative toggle "Tự động áp dụng chính sách miễn giảm" (default ON). Toggling it OFF bypasses discount deductions for that specific batch generation session only, without mutating the master active status of policies in the catalog.
- **Universal Layout Compliance:** The `/school/discount` interface enforces the standard full-width frame layout (`w-full space-y-6`) inside `PortalLayout` with zero artificial container constraints or double padding, standard sentence-case headers, `•••` action dropdowns, modal confirmations for destructive actions, and Excel export (`.xlsx`).

---

## 9. Settings (Cấu Hình) — Học Phí Operational Boundaries & Ambiguity Resolutions

- **Resolution of K019 (SInvoice Password Masking):** SInvoice password remains permanently masked (`type="password"`) with no unmask toggle to prevent shoulder-surfing credential exposure in open school administrative office environments, while Sepay API Secret & Webhook provide toggleable eye icons.
- **Resolution of K020 (Late Pickup Mode Switching & Draft Preservation):** Switching between fixed rate ("Theo giờ cố định") and tiered brackets ("Theo khung giờ") preserves both calculation sub-configurations in Redux draft memory. The active mode flag determines which is submitted upon clicking Save, avoiding data loss during user experimentation.
- **Resolution of K021 (Reconciliation Email Duplicate Prevention):** Adding an email that already exists in the 3-email roster is rejected with inline error *"Email đã tồn tại trong danh sách"* (`ERR-HP-02`), preventing duplicate notifications.
- **Resolution of K022 (Absence Meal Refund Toggle & Operating Hours Schedule):** When "Báo vắng" toggle is ON, the read-only school Operating Hours (Mon–Sat) table is rendered and meal refunds are contingent upon reporting before configured threshold hours. When toggle is OFF, the table is hidden and all absences in the billing month are unconditionally refunded. Changes apply strictly to future invoice generation.
- **Independent Block Dirty State Partitioning:** Main page `/setting/fee/` hosts 5 independent configuration forms. Each form has its own "Lưu" button enabled strictly when edits occur in that specific block. Navigating away with any unsaved block triggers the system confirmation modal guard.

---

## 10. Cơ Chế Hoàn Tiền Ăn (Meal Refund Mechanism Memory & Cross-Module Dependencies)

- **Resolution of K023 (Next-Month Billing Cycle Settlement $M+1$):** Attendance reconciliations for month $M$ (e.g. September) are evaluated and credited against month $M+1$ (October) tuition invoices. This maintains the legal and accounting immutability of historical issued invoices while automating parent refund disbursement.
- **Resolution of K024 (Granular Multi-Meal Category Breakdown):** Schools configure independent refund percentages for Tiền ăn (bán trú / trưa, e.g. 50%) and Tiền ăn sáng (e.g. 70%), while statutory school holidays and calendar closures permanently enforce a 100% refund guarantee without requiring percentage entry.
- **September Baseline Arithmetic Test Vector:**
  - $D_{self} = 3$ absent days (from parent leave requests or homeroom attendance logs).
  - $D_{school} = 1$ statutory holiday (02/09 / National Day).
  - Daily unit prices: $P_{main} = 40,000\text{đ}$, $P_{bf} = 20,000\text{đ}$.
  - Configured rates: $\text{Rate}_{main} = 50\%$, $\text{Rate}_{bf} = 70\%$.
  - September Refund Breakdown:
    - Tiền ăn: $(3 \times 40,000 \times 50\%) + (1 \times 40,000 \times 100\%) = 60,000 + 40,000 = 100,000\text{đ}$.
    - Tiền ăn sáng: $(3 \times 20,000 \times 70\%) + (1 \times 20,000 \times 100\%) = 42,000 + 20,000 = 62,000\text{đ}$.
    - Total September Meal Refund: $162,000\text{đ}$.
- **Invoice Wizard Auto-Deduction Integration:** In `CreateInvoiceWizardModal.tsx`, selecting billing month `2026-10` automatically resolves the September refund, deducting $100,000\text{đ}$ from Tiền ăn and $62,000\text{đ}$ from Tiền ăn sáng line items, updating the net payable total and VietQR payment payload.



---

## 11. Nhà Trường: Lớp Học (School Class Management Memory & Invariants)

- **Resolution of K026 (Class Deletion Guardrail & Empty Class Invariant):**
  - Classes containing one or more enrolled students (`studentCount > 0`) cannot be deleted under any circumstances.
  - The UI disables or hides the delete icon, displaying an explanatory tooltip. The Redux reducer asserts `studentCount === 0` before mutating the array.
  - To decommission an active class, the administrator must first reassign or transfer all students to other classes in the "Học sinh" module (`/school/kid`).
- **Resolution of K027 (Teacher Staffing Asymmetry):**
  - Curricular classes enforce a single `homeroomTeacherId` with conflict detection warnings if the selected teacher already serves as homeroom for another class in the same academic year.
  - Extracurricular classes enforce `instructorIds: string[]`, supporting multiple instructors or rotational coaches for sports, arts, and STEM clubs.
- **Resolution of K028 (Route Standardization under `/school/classes`):**
  - The administrative class directory is standardized at `/[schoolCode]/school/classes` under the `NHÀ TRƯỜNG` menu.
  - Sub-routes include `/create`, `/[classId]/index`, and `/[classId]/edit`.
  - Operational shortcuts on the class detail hub link directly to daily tools at `/[schoolCode]/class/[classId]/attendance`, `/activity`, and `/media`.
- **Statutory Capacity Thresholds:**
  - Class capacity defaults to 35 students, validated against MoET Circular 32/2020 (max 35 for primary, 45 for secondary/high school).

---

## 12. Nhà Trường: Môn Học (School Subject Management Memory & Invariants)

- **Resolution of K029 (Subject Catalog Authority & Standard MoET Protection):**
  - Standard subjects derived from the Ministry of Education's General Education Program 2018 (Circular 32/2018) are pre-initialized with protected system status (`isStandardMoET: true`).
  - School Admins cannot rename, delete, or modify standardized subject codes or assessment matrices, preventing data corruption across academic evaluation sheets and report cards.
- **Resolution of K030 (Four Educational Stage Partitioning):**
  - The subject directory provides 4 segmented stage tabs: `TH` (Tiểu học), `THCS`, `THPT`, and `GDTX`.
  - Multi-level schools seamlessly toggle between tiers. Each stage isolates its own subject catalog and code namespace (e.g. `TH-TOAN` vs `THPT-TOAN`), ensuring compliance with level-specific educational requirements.
- **Resolution of K031 (Assessment Matrix Structure):**
  - Standard assessment configurations across 4 milestone terms (Giữa Kỳ 1, Cuối Kỳ 1, Giữa Kỳ 2, Cuối Kỳ 2) are modeled as a structured matrix (`evaluationMethods` supporting `score`, `level`, `comment`, `score_comment`).
  - GPA inclusion status `isCountedForGPA` (`tinh_tong_ket`) is displayed alongside the evaluation matrix in the subject inspection drawer.
- **Resolution of K032 (Teacher Unassignment Safety & Scoreboard Integrity):**
  - Unassigning a teacher requires explicit confirmation via modal `MODAL-UNASSIGN-TEACHER`, detailing the teacher's name and assigned class count.
  - Unassignment removes future teaching assignments while strictly preserving historical scoreboard marks and past class evaluations in `/school/scoreboard`.

---

## 13. Nhà Trường: Khối Lớp (School Grade Level Management Memory & Invariants)

- **Resolution of K033 (Grade Catalog Immutability & Statutory Authority):**
  - Grade levels represent national educational cohorts defined by MoET Circulars 28/2020 and 32/2020 (Khối 1 đến Khối 12 across TH, THCS, THPT, GDTX).
  - The catalog is strictly read-only: School Administrators cannot create custom cohort tiers or delete statutory grades, protecting structural cohort integrity across downstream class rosters, transcripts, and scoreboards.
- **Resolution of K034 (Dynamic Reactive Rollup Invariant):**
  - Grade-level metrics (total classes, enrolled students, faculty count, and homeroom staffing rates) are computed dynamically from active class rosters in `classSlice.ts` matching `gradeLevelId === grade.id` within the selected `academicYear`.
  - Dynamic derivation guarantees zero data drift or stale counters when students transfer classes or new classes are provisioned.
- **Resolution of K035 (Client-Side Reactive Search & Instant Reset):**
  - Instant client-side accent-insensitive search using `normalizeVietnameseText` matches grade names and codes (e.g. "khoi 1" -> "Khối 1" / "K01").
  - Clearing the search input immediately restores the complete list without page reloads or API round-trips (< 10ms).
- **Resolution of K036 (Grade Detail Cockpit & Operational Links):**
  - Dedicated full-page route at `/[schoolCode]/school/grades/[gradeId]` hosts 4 metric KPI summary cards and an 8-column class roster table.
  - Each class row provides direct operational shortcuts linking to Class Detail (`/school/classes/[classId]`), Daily Attendance (`/attendance`), and Timetables (`/schedule`).

---

## 14. Nhà Trường: Bảng Thông Tin (School Announcement Board Memory & Invariants)

- **Resolution of K037 (Canonical Route Hierarchy under `/school/announcements`):**
  - Standardize primary announcement routes at `/[schoolCode]/school/announcements` (with sub-routes for `/create`, `/[announcementId]`, and `/edit/[announcementId]`), maintaining complete consistency with all other `NHÀ TRƯỜNG` sub-modules (`/school/kid`, `/school/teacher`, `/school/classes`, `/school/grades`, `/school/subjects`, `/school/menu`, `/school/calendar`).
  - A legacy redirect alias maps `/[schoolCode]/announcements` to support external bookmarks and deep links.
- **Resolution of K038 (Draft-Only Mutability Safeguard):**
  - Editing is strictly restricted to notices in `ban_nhap` (draft) status. Once an announcement is dispatched (`da_gui`), mobile push notifications and emails have already landed in recipient mailboxes and mobile devices. Modifying sent records invalidates the delivery audit trail and creates confusing discrepancies with received push payloads. To correct an issued notice, administrators must publish a clarifying announcement or delete the record.
- **Resolution of K039 (Audience Scoping & Multi-Class Target Selection):**
  - Selecting "Lớp học" as audience dynamically unlocks sub-audience selection (`targetSubAudience`: `all` | `teachers` | `parents`) and multi-class selection (`targetClassIds: string[]`). Administrators can select multiple classes in a single batch, avoiding repetitive notice authoring for each class.
- **Resolution of K040 (Irrevocable Email Notification Warning & Audit Retention):**
  - Deleting an announcement removes it from the web portal and mobile app views, but external emails already delivered cannot be retracted.
  - Single (`BT-01`) and bulk (`BT-02`) deletion dialogs explicitly warn administrators: *"Lưu ý: Người dùng sẽ không thể xem các thông tin liên quan đến thông báo này trên cả Web và App, trừ những email đã được gửi ra"*.
  - In Redux, records transition to `isDeleted: true` rather than hard memory purging to maintain historical audit integrity and prevent broken cross-module foreign links.
- **Resolution of K011 Interoperability (Menu & Timetable Auto-Broadcast):**
  - When a weekly menu or timetable is published with "Gửi thông báo", the system automatically authors a linked announcement (`category: 'thuc_don'` or `category: 'thoi_khoa_bieu'`) referencing `linkedAnnouncementId`. Deleting an announcement from the board clears the link without corrupting the originating menu or timetable schedule.

---

## 15. Nhà Trường: Bình Chọn (School Polls, Voting & Surveys Memory & Invariants)

- **Resolution of K041 (Decoupled Creation and Audience Dispatch Workflow):**
  - Standardize primary poll routes at `/[schoolCode]/school/poll/` (with sub-routes for `/create`, `/[pollId]`, and `/edit/[pollId]`), with a backwards-compatible redirect alias from `/[schoolCode]/school/polls`.
  - Strictly decouple question authoring from audience distribution (BR03). Poll creation at `/create` focuses solely on questions, options ($\ge 2$), deadline, and toggles, creating the poll in `da_tao` (Created / Draft) status without audience. Audience scoping ("Toàn trường" vs "Lớp học" with multi-class selection) is isolated into a subsequent dispatch modal (`UC-04`), allowing teachers and administrators to prepare questionnaires well in advance of live distribution.
- **Resolution of K042 (Permissible Choice Revision & Chronological Audit Log):**
  - Registered voters may revise their submitted choices multiple times prior to the poll deadline.
  - Active option counts update immediately to reflect current sentiment, while each modification appends an immutable entry to `voteHistory` with an ISO timestamp.
  - Clicking the history icon ("Lịch sử thay đổi") beside a voter in the student roster opens an audit modal displaying the full chronological sequence of revisions, resolving parent disputes and guaranteeing democratic transparency.
- **Resolution of K043 (Result Transparency & Conditional Visual Chart Rendering):**
  - "PH được xem kết quả bình chọn" (`allowParentViewResults`) defaults to disabled, preventing bandwagon effects in sensitive consultative surveys.
  - Option progress bars render for all polls. The interactive pie chart renders dynamically if and only if total recorded votes $> 0$ (BR06, NFR01). If zero votes exist, the pie chart is completely omitted to avoid rendering empty or broken circular frames.
- **Resolution of K044 (State-Driven Action Visibility & Ballot Integrity):**
  - In the directory table, the 3 action icons (Edit pencil, Send paper plane, Delete trash bin) appear strictly for `da_tao` polls.
  - For `da_gui` and `da_dong` polls, row action icons are completely hidden; users can only click the poll title to view results. This prevents accidental deletion or unauthorized structural modifications while voting is active or closed.
- **Resolution of K045 (Voter Roster & Legacy Profile String Isolation):**
  - The student voter roster binds to canonical `studentId` foreign keys and displays student name profiles verbatim without heuristic modifications (BR11), treating master profile hygiene as the responsibility of the Student Directory while guaranteeing reliable voter tallying.





---

## 16. Nhà Trường: Điểm Danh NV (School Staff Attendance Memory & Invariants)

- **Resolution of K046 (Strict 45-Day Retrospective Read-Only Lock & Audit Integrity):**
  - Date navigation is restricted to $\le$ today; future dates are disabled on the calendar picker (BR01).
  - Selecting any past date displays static warning banner `DD-02` (*"*Chỉ được cập nhật thông tin điểm danh trong vòng 45 ngày kể từ hôm nay"*).
  - Strict 45-Day Read-Only Hard Lock (BR02): If a date older than 45 days in the past is selected, all mutation controls (Check-in, Check-out, Vắng toggle, inline note edit) are strictly disabled in read-only mode. This safeguard protects closed monthly payroll accounting cycles, tax filings, and social insurance audits from unauthorized retroactive tampering under Vietnam Labor Code 45/2019/QH14.
- **Resolution of K047 (Canonical Routing & Client-Side Cohort Scoping via URL Query Parameters):**
  - Standardize staff attendance at `/[schoolCode]/school/staff-attendance` with query param `?classId=...` and legacy redirect from `/[schoolCode]/staff-attendance`.
  - Selecting a class narrows the roster instantaneously via client-side Redux filtering without full page reloads, while fully supporting browser history and bookmarking.
- **Resolution of K048 (High-Velocity 1-Click Roll Call & Inline Time Badge Editing with Validation Rollback):**
  - High-velocity morning roll call: Clicking "Check-In" or "Check-Out" records current system time (`HH:mm`) immediately without confirmation dialogs, converting the button into a colored time badge (Blue `#0070CE` for Check-in, Amber `#FEC020` for Check-out) with a pencil icon (BR03).
  - Inline badge editing: Clicking a recorded time badge toggles inline editing for hours and minutes.
  - Blur rollback safeguard (BR04): If the user clears the input or enters an invalid time format upon blur, the system triggers error toast `DD-01` (*"Thời gian không đúng định dạng."*) and automatically restores the previous valid timestamp without clearing recorded data.
- **Absence Mutual Exclusion & Conflict Warning DD-03 (BR05, BR06):**
  - Toggling "Vắng" requires explicit modal confirmation choosing "Có phép" vs "Không phép" with an optional note.
  - If the employee already has Check-in or Check-out recorded that day, the modal displays reminder warning `DD-03` (*"Lưu ý: Nhân viên đã check-in/check-out lúc {giờ}"*).
  - While the modal is open, that row's Check-in/Check-out buttons are disabled; cancelling reverts the toggle to off; saving updates absence status and increments the KPI counter.
- **Multi-Role Personnel Architecture & Read-Only Profile Inspection (BR08, BR11):**
  - Faculty members frequently hold multiple concurrent roles (e.g. Quản Lý and Giáo Viên). Table rows render all applicable badges without truncation.
  - Clicking an employee's nickname opens a read-only profile modal displaying "Thông tin Quản Trị" for Admin or "Thông tin người dùng" with assigned class links for Managers/Teachers; empty fields render as `"Chưa có {trường}"`.
- **Search-Responsive KPI Hiding & Nickname Sorting (BR10, BR12):**
  - When a search query is active in the search input, the top 3 KPI summary counters (*Tham dự*, *Vắng có phép*, *Vắng không phép*) are dynamically hidden to prevent misinterpreting partial search results as school-wide totals. The footer displays `"Tổng: N"`.
  - Clicking the sort icon beside the "Nhân viên" header alternates nickname ordering between A $\rightarrow$ Z and Z $\rightarrow$ A.


---

## 17. Nhà Trường: Sổ Tay PH (Parent Handbook Memory & Invariants)

- **Navigation Order under NHÀ TRƯỜNG Group:**
  1. Học sinh (`/[schoolCode]/school/kid`)
  2. Giáo viên (`/[schoolCode]/school/teacher`)
  3. Lớp học (`/[schoolCode]/school/classes`)
  4. Môn học (`/[schoolCode]/school/subjects`)
  5. Khối lớp (`/[schoolCode]/school/grades`)
  6. Bảng thông tin (`/[schoolCode]/school/announcements`)
  7. Bình chọn (`/[schoolCode]/school/poll`)
  8. Thực đơn (`/[schoolCode]/school/menu`)
  9. Điểm danh NV (`/[schoolCode]/school/staff-attendance`)
  10. **Sổ tay PH** (`/[schoolCode]/school/handbook`) — *Target Sub-module mounted with icon `faBookBookmark`*
  11. Lịch sự kiện (`/[schoolCode]/school/calendar`)

- **Resolution of K049 (Strict 2-Tier Category Taxonomy):**
  - Categories are strictly capped at 2 levels: Root Category (`parentCategoryId: null`) $\rightarrow$ Sub-Category (`parentCategoryId: rootId`).
  - Articles are leaf nodes belonging to root or sub-categories.
  - Inside sub-categories, only "+ Thêm bài viết" is rendered; "+ Thêm danh mục" is omitted, preventing deep nested folders that break mobile readability.

- **Resolution of K050 (Accordion Single-Active Sibling Expansion):**
  - Within any sibling category group, expanding one category automatically collapses the active sibling.
  - Category descriptions ("Ghi chú") render in a dashed callout box when expanded, and as a subtitle when collapsed (`BR03`).

- **Resolution of K051 (Article-Centric Search Pruning & Empty State ST-03):**
  - Status filters and search queries match strictly against article titles (never against category names).
  - Non-matching categories are pruned from the view; matching branches auto-expand down to their matching articles.
  - Non-matching queries render empty state `ST-03`: *"Hiện chưa có danh mục hoặc bài viết nào. Hãy bắt đầu bằng cách tạo danh mục mới"*.

- **Resolution of K052 (Frictionless 1-Click Status Toggling: Xuất bản & Ẩn):**
  - Contextual `•••` action menus allow 1-click status transitions between `draft` ("Xuất bản bài viết") and `published` ("Ẩn bài viết") with immediate toast confirmation, bypassing redundant confirmation prompts for reversible actions.

- **Resolution of K053 (Sibling-Only Drag-and-Drop Reordering):**
  - Sub-categories and articles render drag handles (☰) for positional reordering within their immediate parent container.
  - Root categories maintain fixed administrative ordering and omit drag handles. Cross-tier reparenting via drag-and-drop is prohibited.

- **Cascading Deletion Safeguards (BR09, ST-01, ST-02):**
  - Deleting a category prompts high-severity modal `ST-01`: *"Vui lòng xác nhận xóa danh mục {tên danh mục}. Lưu ý: Tất cả danh mục con và bài viết trong danh mục sẽ bị xóa"*.
  - Deleting an article prompts simple confirmation modal `ST-02`: *"Vui lòng xác nhận xóa bài viết {tiêu đề bài viết}"*.


## 18. Nhà Trường: Góp Ý (School Parent Feedback & Ticketing Memory & Invariants)

- **Canonical Sidebar Navigation Ordering (Under NHÀ TRƯỜNG in `PortalLayout.tsx`):**
  1. Học sinh (`/[schoolCode]/school/student`)
  2. Giáo viên (`/[schoolCode]/school/teacher`)
  3. Lớp học (`/[schoolCode]/school/classes`)
  4. Môn học (`/[schoolCode]/school/subjects`)
  5. Khối lớp (`/[schoolCode]/school/grades`)
  6. Bảng thông tin (`/[schoolCode]/school/announcements`)
  7. Bình chọn (`/[schoolCode]/school/poll`)
  8. Thực đơn (`/[schoolCode]/school/menu`)
  9. Điểm danh NV (`/[schoolCode]/school/staff-attendance`)
  10. Sổ tay PH (`/[schoolCode]/school/handbook`)
  11. **Góp ý** (`/[schoolCode]/school/feedback`) — *Target Sub-module mounted with icon `faCommentDots`*
  12. Lịch sự kiện (`/[schoolCode]/school/calendar`)

- **Resolution of K054 (Parent-Only Ticket Inception & Invariant):**
  - Web operating portal is strictly an administrative triage, communication, and resolution inbox.
  - Administrators and teachers cannot create feedback tickets on the web portal. There is NO "Tạo góp ý" or "Thêm góp ý" button.
  - The `+` icon on the `Yêu cầu mới` KPI card is strictly a visual icon and filter toggle, NOT a creation button. All feedback tickets originate authenticated from parents via the mobile application.

- **Resolution of K055 (Dual-Function Status Filter/KPI Cards & Reset):**
  - The top 4 cards (`Yêu cầu mới` Blue `#0070CE`, `Đang xử lý` Purple `#8B5CF6`, `Hoàn tất` Green `#10B981`, `Mở lại` Amber `#F59E0B`) display aggregate ticket counts for the selected academic year.
  - Clicking any card filters the table roster to that status and displays an explicit "Xóa bộ lọc" reset action. Resetting clears the filter while preserving global counts across all cards.

- **Resolution of K056 (Asymmetric Mutation Friction: Inline Priority vs Modal Closure):**
  - Routine priority updates (`Thấp`, `Trung bình`, `Cao`, `Khẩn cấp`) and assignee assignments occur via inline select dropdowns on table rows and detail views, applying immediately without modal confirmations.
  - In contrast, ticket closure is a formal operational termination affecting parent SLA. Clicking "Đóng góp ý" strictly mandates confirmation modal `GY-01` (*"Vui lòng xác nhận Đóng góp ý {tên góp ý}"*).

- **Resolution of K057 (Reactive Turn-Taking State Machine):**
  - Turn-taking state (`waitingFor`) tracks next-action ownership: `Chờ phản hồi từ nhà trường` vs `Chờ phản hồi từ phụ huynh`.
  - Submitting a school comment automatically sets `waitingFor: parent`. Inbound parent comments set `waitingFor: school`.
  - If a parent submits a comment on a ticket already marked `Hoàn tất`, the ticket automatically transitions to `Mở lại` (`reopened`) with `waitingFor: school`.

- **Resolution of K058 (Canonical Placement & Read-Only Profiles):**
  - Positioned under NHÀ TRƯỜNG strictly after "Sổ tay PH" and before "Lịch sự kiện".
  - Clicking student or parent names opens read-only profile modals. Missing fields always render fallback text `"Chưa có {trường}"`.


## 19. Nhà Trường: Năm Học (School Academic Year & Calendar Milestone Memory & Invariants)

- **Canonical Sidebar Navigation Ordering (Under NHÀ TRƯỜNG in `PortalLayout.tsx`):**
  1. Học sinh (`/[schoolCode]/school/student`)
  2. Giáo viên (`/[schoolCode]/school/teacher`)
  3. Lớp học (`/[schoolCode]/school/classes`)
  4. Môn học (`/[schoolCode]/school/subjects`)
  5. Khối lớp (`/[schoolCode]/school/grades`)
  6. Bảng thông tin (`/[schoolCode]/school/announcements`)
  7. Bình chọn (`/[schoolCode]/school/poll`)
  8. Thực đơn (`/[schoolCode]/school/menu`)
  9. Điểm danh NV (`/[schoolCode]/school/staff-attendance`)
  10. Sổ tay PH (`/[schoolCode]/school/handbook`)
  11. Góp ý (`/[schoolCode]/school/feedback`)
  12. Lịch sự kiện (`/[schoolCode]/school/calendar`)
  13. **Năm học** (`/[schoolCode]/school/academic-year`, alias `/school/season`) — *Sub-module mounted with icon `faCalendarCheck`*

- **Resolution of K059 (Automated Current Year Calculation & Omission of Manual Radio/Toggle):**
  - Active status is computed purely from system calendar date: `isCurrent = today >= startDate && today <= endDate`.
  - Active rows display in bold typography, primary brand blue (`#0070CE`), with a "Hiện tại" badge chip.
  - The modal form strictly omits any manual checkbox or radio button for "Hiện tại", eliminating stale current-year flags and administrative oversight during school year turnover.

- **Resolution of K060 (Permanent Omission of Delete Operations):**
  - Academic years function as primary temporal foreign keys across classes, attendance, invoices, meal plans, scoreboards, and feedback.
  - Deleting an academic year—even soft-delete—corrupts historic invoices and breaks referential integrity.
  - The table row actions column strictly contains only the Edit button (`faEdit`); delete is permanently omitted across all UI surfaces.

- **Resolution of K061 (Flexible Free-Text Naming & Semester Sub-Periods):**
  - Names are free-form text accommodating both annual school years ("Năm học 2026 - 2027") and semester sub-periods ("Kỳ 1 năm học 2026 - 2027", "Kỳ 2 năm học 2026 - 2027").
  - Overlapping timeframes are permitted to support nested semesters, but identical duplicate intervals are rejected (`VR-AY-03`), and date ordering `endDate >= startDate` is strictly enforced (`VR-AY-02`).

- **Resolution of K062 (Minimalist 3-Field Modal & Disabled Submit Gating):**
  - Modal form contains exactly 3 inputs: `Tên năm học` (text), `Ngày bắt đầu` (date), and `Ngày kết thúc` (date).
  - Submit action button ("Thêm" or "Cập nhật") remains disabled until all 3 fields are non-empty and `endDate >= startDate`.
  - Attaching cohorts, default fees, and holiday schedules is decoupled to dedicated downstream modules.

- **Resolution of K063 (Canonical Route & Sidebar Order):**
  - Mounted at canonical route `/[schoolCode]/school/academic-year` (with backward compatibility alias `/[schoolCode]/school/season`).
  - Placed under sidebar group `NHÀ TRƯỜNG` strictly after "Lịch sự kiện" (`/school/calendar`), using FontAwesome icon `faCalendarCheck`.

---

## 20. Nhà Trường: Lưu Trữ Memory & Invariants

- **Full 14-Module Navigation Sequence under NHÀ TRƯỜNG:**
  1. Học sinh (`/[schoolCode]/school/students`)
  2. Giáo viên (`/[schoolCode]/school/teachers`)
  3. Lớp học (`/[schoolCode]/school/classes`)
  4. Môn học (`/[schoolCode]/school/subjects`)
  5. Khối lớp (`/[schoolCode]/school/grade-levels`)
  6. Bảng tin (`/[schoolCode]/school/bulletin`)
  7. Bình chọn (`/[schoolCode]/school/polls`)
  8. Thực đơn (`/[schoolCode]/school/menu`)
  9. Điểm danh NV (`/[schoolCode]/school/staff-attendance`)
  10. Sổ tay PH (`/[schoolCode]/school/handbook`)
  11. Góp ý (`/[schoolCode]/school/feedback`)
  12. Lịch sự kiện (`/[schoolCode]/school/calendar`)
  13. Năm học (`/[schoolCode]/school/academic-year`, alias `/school/season`)
  14. **Lưu trữ** (`/[schoolCode]/school/archive`, alias `/setting/kid/archived`) — *Sub-module mounted with icon `faArchive`*

- **Resolution of K064 (Unidirectional Inflow & Cold Storage Isolation):**
  - The Lưu Trữ module is strictly an administrative cold-storage repository for withdrawn, transferred, and graduated students.
  - Students enter Lưu Trữ exclusively via withdrawal actions executed in the Học Sinh module.
  - The archive dashboard contains zero "Tạo học sinh" or "Thêm học sinh" buttons, preserving single-source authority for student identity generation.

- **Resolution of K065 (Guarded Permanent Deletion & Red Hazard Modal LT-02):**
  - Permanent purge completely destroys historical attendance, tuition invoices, health measurements, and evaluation reports.
  - Confirmation modal `LT-02` ("Vui lòng xác nhận xoá học sinh {tên}!") enforces distinct red hazard styling, explicit student name confirmation, and affirmative button gating, clearly distinguishing it from the friendly restore dialog (`LT-01`).

- **Resolution of K066 (Class Continuity Safeguards on Restoration K013):**
  - Restoring a student evaluates `formerClassId`: if active in the current academic year, the student is re-enrolled into that class with a success toast.
  - If the former class is closed, dissolved, or from a past academic year, the student is restored with `classId = null` ("Chưa xếp lớp") accompanied by an amber system alert prompting administrative reassignment.

- **Resolution of K067 (Tolerant Metadata Nullability in Legacy Records):**
  - In legacy records (such as "Huy", "Ngọc", "Thương"), `archiveDate`, `archivedBy`, or `archiveReason` may be missing.
  - Schema models these attributes as optional (`string | undefined`). The table renders clean empty cells (`—` or blank) without throwing errors, and modal notes render as "Chưa có ghi chú".

- **Resolution of K068 (Canonical Route & Navigation Placement):**
  - Mounted at canonical route `/[schoolCode]/school/archive` (with backward compatibility alias `/[schoolCode]/setting/kid/archived`).
  - Placed under sidebar group `NHÀ TRƯỜNG` strictly after "Năm học" (`/school/academic-year`), using FontAwesome icon `faArchive`.

---

## 21. Cấu Hình: Trường (School Master Profile Memory & Invariants)

- **Canonical Sidebar Navigation Ordering (Under CẤU HÌNH in `PortalLayout.tsx`):**
  1. **Trường** (`/[schoolCode]/setting/school`, alias `/school/info/`) — *Sub-module mounted with icon `faSchool`*
  2. Học phí (`/[schoolCode]/setting/fee`)
  3. Lớp học (`/[schoolCode]/setting/class`)
  4. Giáo viên (`/[schoolCode]/setting/teacher`)
  5. Học sinh (`/[schoolCode]/setting/kid`)
  6. Điểm danh (`/[schoolCode]/setting/attendance`)
  7. Hoạt động (`/[schoolCode]/setting/activity`)

- **Resolution of K069 (Overview Read-Only Integrity & Gated Edit Mode):**
  - Master profile overview at `/[schoolCode]/setting/school` is strictly read-only.
  - No inputs or mutable form elements exist on the overview dashboard.
  - To enter editing mode, the administrator must explicitly click the Edit icon button (`icon_edit_square`) at the top right of the overview page, which navigates to `/setting/school/edit`.

- **Resolution of K070 (Two-Tab Edit Architecture & Route Synchronization):**
  - Edit screen partitions configuration into two distinct routed tabs:
    - Tab 1: "Thông tin trường" (`/[schoolCode]/setting/school/edit?tab=info`) for institutional demographics, address, contact, default notification language, and logo.
    - Tab 2: "Giờ hoạt động" (`/[schoolCode]/setting/school/edit?tab=weekdays`, alias `/setting/school/weekdays`) for Monday–Saturday operating hours and school-wide attendance calculation rules.
  - URL query parameters stay synchronized with tab switching to support browser back/forward and deep linking.

- **Resolution of K071 (Independent Sub-Form Submissions in Giờ Hoạt Động):**
  - In the "Giờ hoạt động" tab, operating hours (Monday–Saturday opening/closing intervals) and attendance threshold rules (late arrival toggle/dropdown, late departure toggle) are structured as completely independent sub-forms.
  - Each sub-form contains its own "Cập nhật" action button and dispatches distinct Redux mutation actions (`updateOperatingHours` vs `updateAttendanceRules`).
  - Saving daily operating hours never triggers validation or submission of attendance rules, eliminating cross-contamination between facility hours and attendance policies.

- **Resolution of K072 (5-Minute Stepped Time Increments & Fixed Range):**
  - All opening and closing time pickers are strictly constrained to fixed 5-minute increments (`06:00` to `18:00`).
  - Free-text time input is prohibited, preventing timing syntax errors and ensuring consistent bell schedule representation across operational modules.

- **Resolution of K073 (Static Sunday Non-Operational Rest Designation):**
  - Sunday renders as a static non-operational grey badge without input controls, reflecting Vietnamese statutory rest standards (Labor Code 45/2019/QH14).
  - Weekend club activities and special events are governed by extracurricular class schedules and event calendars, keeping master institutional bell hours clean.

- **Resolution of K074 (Decoupled Late Departure Fee Linkage):**
  - Overtime childcare fees for late student departures belong strictly to Tuition Fee Settings (`/setting/fee`).
  - Toggling late departure on/off reveals a contextual informational link ("Cài đặt phí trông học sinh về muộn tại đây") navigating directly to `/setting/fee`.
  - Monetary surcharge figures are never duplicated or configured inside the school profile module.

- **Resolution of K075 (Canonical Route & Navigation Placement under CẤU HÌNH):**
  - Mounted at canonical route `/[schoolCode]/setting/school` positioned first under the `CẤU HÌNH` sidebar menu group before "Học phí".
  - Backward compatibility aliases `/school/info` and `/setting/school/weekdays` redirect seamlessly.

- **Dirty Form Navigation Interception (TR-02):**
  - Modifying any field in either tab flags the form state as dirty.
  - Attempting to switch tabs, click sidebar links, or depart the page triggers modal `TR-02`: *"Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!"* with "Hủy bỏ" and "Xác nhận rời khỏi" choices.

### 22. Module 6: Cấu Hình — Tài Khoản (User & Student Account Management and Access Control)

- **Sub-Module Name:** Tài khoản (Account Management)
- **Primary Routes:**
  - `/[schoolCode]/setting/users` (Tab 1: Người Dùng — User Accounts)
  - `/[schoolCode]/school/kid/accounts` or `/[schoolCode]/setting/users?tab=students` (Tab 2: Học Sinh — Student Login Accounts)
  - `/[schoolCode]/setting/users/[id]/password` (Dedicated Password Reset Sub-Page under BẢO MẬT)
- **Sidebar Placement (`K076`):**
  - Third under `CẤU HÌNH` in `PortalLayout.tsx` strictly after "Học phí" (`/setting/fee`) and before "Thông báo", using icon `faUserShield`.

- **Resolution of K076 (Dual-Tab Routed Architecture & Synchronization):**
  - User accounts (adult personnel/parents) and Student login accounts represent distinct domain personas and lifecycle models.
  - Segregating them into two routed tabs ("Người Dùng" and "Học Sinh") provides focused ergonomics.
  - URL query parameters (`?tab=users` vs `?tab=students`) stay synchronized with tab switching to preserve browser back/forward and deep linking.

- **Resolution of K077 (Super-Admin Privilege Escalation Lock):**
  - On the user creation form, the "Admin" role checkbox is permanently disabled (`disabled={true}`) to prevent rogue privilege elevation.
  - Table rows for Admin accounts omit Edit (pencil) and Delete (trash) action icons completely; only View (eye) is rendered.

- **Resolution of K078 (CSDL Sở National Database Synchronization Safeguards):**
  - Accounts imported or synchronized from the provincial Department of Education database ("CSDL Sở") carry an authoritative badge.
  - Edit form displays a yellow advisory banner and permanently disables the "Họ và tên" input (`BR05`).
  - Attempting to toggle activation status on a CSDL Sở account row is blocked and renders red error banner `TK-03`: *"Không thể cập nhật với đối tượng được đồng bộ từ CSDL ngành"*, keeping status unchanged (`BR06`).

- **Resolution of K079 (Asymmetric Status Confirmation Mechanics):**
  - Row-level status toggle applies immediately with toast `TK-06` for frictionless deactivation of departing personnel (`BR06`).
  - In-form updates inside the full Edit modal require explicit confirmation modal `TK-05`: *"Vui lòng xác nhận cập nhật tài khoản này!"* before persisting changes (`BR07`).

- **Resolution of K080 (Decoupled Email & Password Security Workflows):**
  - In the Edit form, Email is rendered as read-only text with a "Thay đổi" button opening a dedicated email change modal with RFC 5322 regex validation (`BR08`).
  - Password updates route to a dedicated security sub-page under `BẢO MẬT` (`/password`) displaying explicit session revocation advisories and dual password inputs with visibility toggles, complying with Decree 13/2023/NĐ-CP (`BR09`).

- **Resolution of K081 (Dynamic Role-Dependent Disclosure):**
  - Checking "Nhân viên" dynamically reveals Staff Functions (Điểm danh, Kế toán, Thông báo, Chăm sóc/Y tế) requiring at least 1 selection (inline error `TK-02`), plus "Mã nhân viên" (`BR10`).
  - Checking "Quản lý" dynamically reveals the Assigned Classes selector (`BR12`).
  - Checking "Nhân viên" or "Giáo viên" reveals collapsible "Thông tin bổ sung" (`BR13`).

- **Resolution of K082 (Student Account 1-to-1 Mapping & Validation):**
  - Tab "Học Sinh" strictly maintains 1-to-1 mapping with enrolled students in the school directory.
  - Students without accounts display `+` (create modal); students with accounts display pencil (edit modal) and username.
  - Username creation validates alphanumeric and email characters (`/^[a-zA-Z0-9_\-\.]+$/`), accompanied by a green helper hint (`BR19`, `BR20`).





### 23. Module 6: Cấu Hình — Nhận Diện (Face Recognition Management & Registration Authority)

- **Sub-Module Name:** Nhận diện (Face Recognition / "Đăng ký nhận diện")
- **Canonical Route:** `/[schoolCode]/setting/face-recognition`
- **Sidebar Placement (`K083`):**
  - Fourth under `CẤU HÌNH` in `PortalLayout.tsx` strictly following "Tài khoản" (`/setting/users`), using icon `faCamera`.
- **Primary Roles:** School Administrator (`admin`).

- **Resolution of K083 (Canonical Route & Navigation Topology):**
  - Positioned fourth in `PortalLayout.tsx` under `CẤU HÌNH` strictly following "Trường", "Học phí", and "Tài khoản".
  - Canonical path is `/[schoolCode]/setting/face-recognition/`, providing dedicated bookmarkable route and active state highlighting.

- **Resolution of K084 (Centralized Biometric Authority vs Fragmented Uploads):**
  - Sub-module "Nhận diện" establishes the authoritative master registry for student biometric facial templates.
  - Feeds downstream operational consumers in `Module 1: Điểm danh` (morning/evening gate attendance) and `Module 1: Thư viện` (AI facial detection and album tagging) without fragmented photo stores.

- **Resolution of K085 (Demographic Read-Only Binding & Immutability):**
  - Registration and edit modals display 4 core student demographic attributes: Biệt danh, Giới tính, Ngày sinh, and Lớp học link.
  - These attributes are strictly read-only and dynamically bound to master student records in `school/kid`. Modifying student demographics is prohibited inside the biometric modal.

- **Resolution of K086 (Mandatory New File Selection for Submit Activation):**
  - The submit button ("Đăng ký") in both registration and edit modals is disabled by default (`disabled: true`).
  - In Registration mode, choosing an image file via "UPLOAD FILE" enables the submit button.
  - In Edit mode, viewing the existing photo in the preview box is explicitly insufficient to enable saving; an administrator MUST choose a *new* image file before "Đăng ký" is enabled (`BR04`, `BR05`).

- **Resolution of K087 (State-Driven Action Column Duality):**
  - Unregistered students display `-` in Photo and Date columns, and a single circular `+` button in the Action column (`BR01`, `BR02`).
  - Registered students display a valid photo thumbnail, formatted date `DD/MM/YYYY`, and pencil (Edit) + `X` (Delete) buttons.

- **Resolution of K088 (Guarded Biometric Deletion with Explicit Student Name Affirmation):**
  - Complying with Decree 13/2023/NĐ-CP on sensitive personal data protection, deleting biometric data triggers a confirmation dialog that explicitly articulates the target student's full name: *"Vui lòng xác nhận xóa thông tin nhận diện của học sinh {Họ tên}"* (`BR06`, `NFR01`).
  - Confirming clears the photo and date, immediately reverting the row to unregistered status.

---

## Section 24: Cấu Hình — Tính Năng (Feature Flags & Academic Term Configuration)

- **Resolution of K089 (Independent Two-Route Architecture vs Client-Side Tab Switching):**
  - Following the precedent of `setting/school`, Tab Hoạt Động lives at `/[schoolCode]/setting/activity/` and Tab Học Kỳ lives at `/[schoolCode]/setting/period/`.
  - An alias route at `/[schoolCode]/setting/features` redirects to `/setting/activity`.
  - Mounted fifth in `PortalLayout.tsx` under `CẤU HÌNH` strictly following "Nhận diện" using icon `faSlidersH` / `faToggleOn`.
  - Preserves browser back/forward history, direct deep-linking, and independent component state lifecycles without leaking dirty form inputs across tabs.

- **Resolution of K090 (Strict Toggle Decoupling vs Cascading Disablement):**
  - Verified directly from legacy system behavior, turning OFF "Bình luận" does NOT disable, hide, or reset "Duyệt bình luận".
  - Both toggles remain completely interactive and persist independent boolean values in Redux, enabling school administrators to establish moderation policies in advance of turning on commenting.

- **Resolution of K091 (Dirty-State Submit Invariant vs Always-Enabled Save):**
  - The "Cập nhật" action button on Tab Hoạt Động is disabled upon initial page load (`disabled: true`).
  - It becomes enabled if and only if active toggle selections diverge from the saved baseline.
  - Submitting commits changes, displays a toast notification, and resets the button to disabled, preventing redundant no-op server mutations.

- **Resolution of K092 (Statutory Two-Term Ceiling vs Arbitrary Term Subdivisions):**
  - Aligned with Vietnam Ministry of Education and Training (MoET GDPT 2018) general education guidelines, general schools operate on a strict two-semester structure (Học kỳ 1 and Học kỳ 2).
  - The Academic Year dropdown defaults to the ongoing school year marked `(Hiện tại)`.
  - The "+ Thêm học kỳ" button automatically becomes disabled (`disabled: true`) as soon as the selected academic year possesses 2 terms (`terms.length >= 2`).

- **Resolution of K093 (Pure Inline Table Row Editing with Mutual Exclusion Locking):**
  - All term creation and editing operations execute directly within table cells without popup modal overhead.
  - Sửa or Thêm converts the table row into inline text and date inputs with green checkmark (Save) and gray X (Cancel) icon buttons.
  - While any row is in edit or addition mode, all other row edit buttons and "+ Thêm học kỳ" are strictly disabled, preventing state collisions and concurrent edit conflicts.

- **Resolution of K094 (Permanent Saved Terms & Deletion Omission):**
  - Academic terms serve as critical temporal anchors across timetables, gradebooks, attendance, and fee schedules; deleting saved terms risks cascading orphan data across the system.
  - The Action column of saved rows displays only the Edit pencil icon—zero deletion controls exist.
  - Academic years with zero registered terms display a clean, dedicated full-width empty state row with text `"Chưa có học kỳ"`.

---

## Section 25: Cấu Hình — Thông Báo (Notification Configuration)

- **Resolution of K095 (Monolithic Form Architecture vs Fragmented Multi-Page Tabs):**
  - Notification Settings renders as a single, comprehensive configuration cockpit encapsulating 5 operational domains: (1) Điểm danh, (2) Sinh nhật, (3) Học phí, (4) Khác, and (5) Phụ huynh.
  - Unlike Fee Configuration which splits into multiple child views, all sections are governed by a single bottom sticky action bar with one "Cập nhật" button, providing holistic oversight of school dispatch rules.

- **Resolution of K096 (Guarded Confirmation Modal Submission & Working State Preservation):**
  - Clicking "Cập nhật" triggers a mandatory confirmation dialog: *"Vui lòng xác nhận thay đổi cấu hình thông báo của trường!"* (Hủy bỏ / Xác nhận).
  - Confirming writes changes atomically to the store, updates the saved baseline, and triggers a success toast.
  - Canceling immediately dismisses the modal while preserving all working unsaved edits in the form, allowing administrators to make further adjustments without losing input progress.

- **Resolution of K097 (Institutional Scope Banner & 31st-Day Calendar Overflow Fallback):**
  - A prominent blue top informational banner establishes: (1) school-wide applicability across all classes/teachers/parents, (2) multi-platform delivery (Web and Mobile App), and (3) calendar overflow fallback logic.
  - Reminders scheduled on days 29, 30, or 31 automatically trigger on the final calendar day of shorter months (e.g. 28th/29th in February, 30th in April/June/September/November), preventing silent omission of recurring alerts.

- **Resolution of K098 (Shared Birthday Schedule Inheritance vs Fragmented Toggles):**
  - Section 2 (Sinh nhật) provides a shared schedule configuration row (Day 1-31 and Time HH:mm, default 09:00) that does NOT have an independent toggle switch.
  - Child recipient toggles ("Giáo viên" and "Admin nhà trường") inherit this schedule when toggled ON, preventing orphaned or contradictory schedule states.

- **Resolution of K099 (Multi-Channel Delivery Asymmetry vs Uniform Channel Toggles):**
  - Dual delivery channel toggles (`Web/App` and `Email`) are strictly confined to Section 4 administrative review queues: "Hoạt động chờ duyệt" and "Nhật ký hằng ngày".
  - All other operational events (attendance check-in/out, birthdays, tuition invoices, parent activity feeds) deliver exclusively via Web and Mobile App push notifications to avoid email inbox flooding.

- **Resolution of K100 (Read-Only Operational Time Bounds vs Free-Form Time Inputs):**
  - Institutional operational milestones are protected against accidental edits by rendering fixed times in disabled/read-only inputs with muted styling:
    - Section 1 evening pickup overtime alert is fixed at `17:00`.
    - Section 4 daily journal log review alert is fixed at `20:00`.

- **Resolution of K101 (Extracurricular Class Scoping vs Global-Only Attendance):**
  - Section 1 includes an alert for "Thông báo điểm danh hoạt động ngoại khóa", providing an "Áp dụng cho" select dropdown allowing administrators to scope the alert to "Tất cả các lớp" or select specific classes.

- **Resolution of K102 (Directional Tuition Schedule vs Simple Threshold Days):**
  - Section 3 (Học phí) overdue reminder pairs a directional selector ("Trước hạn đóng học phí" vs "Sau hạn đóng học phí") with an integer day counter (1-31 days), supporting diverse school tuition collection policies.

- **Resolution of K103 (Parent Action Highlighting with Orange Typography):**
  - In Section 5 (Phụ huynh), notification trigger verbs ("điểm danh", "hoạt động", "album", "hình/video") are rendered in distinct bold orange typography (`#EA580C`) within the descriptive Vietnamese labels for instant scanning.

- **Resolution of K104 (Canonical Route & Navigation Topology):**
  - Mounted sixth under sidebar navigation group `CẤU HÌNH` in `PortalLayout.tsx` at canonical route `/[schoolCode]/setting/notification/`, strictly following "Tính năng" with FontAwesome icon `faBell`.

