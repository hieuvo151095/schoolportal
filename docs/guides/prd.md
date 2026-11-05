# Product Requirements Document (PRD) — School Operating Portal

> **Project:** School Operating Portal (Finviet / SOHA)  
> **Target Version:** Phase 1 Enterprise Release  
> **Status:** Approved for Execution Planning  
> **Source Documents:** `docs_legacy/operating-portal/` (PRD & Test Cases)

---

## 1. Product Goal & Executive Overview

The **School Operating Portal** is an enterprise multi-tenant administration and operations platform designed for Vietnamese K-12 and pre-K educational institutions. It unifies daily classroom management, academic administration, and school finance into a single cohesive, high-performance web experience.

The primary goal of this phase is to rebuild the three mission-critical operational pillars of the school:
1. **Vận Hành (Operations):** Streamlining daily student check-in/out, health monitoring, class activity logs, media albums with automated facial recognition, parent communication, and operational reporting.
2. **Học Tập (Academics):** Standardizing class timetables, homework assignment tracking, and multi-term gradebook evaluations.
3. **Tài Chính (Finance):** Managing end-to-end tuition billing, fee catalogs, class-specific fee schedules, expense disbursements, payment gateway reconciliation, and tuition collection analytics.

---

## 2. Target Users & Stakeholder Personas

- **School Administrators (Ban Giám Hiệu / Quản Trị Viên):** Require comprehensive operational visibility across all classes, master configurations, fee schedule policies, disbursement approvals, and aggregate reporting.
- **Homeroom & Subject Teachers (Giáo Viên Chủ Nhiệm / Bộ Môn):** Require quick, single-click touch interactions for morning check-in and afternoon checkout, temperature and health incident logs, activity and homework posting, media uploads, direct parent chatting, and grade entry.
- **School Accountants (Kế Toán Trường Học):** Require rigorous financial controls, bulk tuition invoice generation with attendance-based meal deductions, fee schedule assignments per class, expense voucher lifecycles, and transaction reconciliation.
- **Parents (Phụ Huynh — Indirect Stakeholders):** Receive real-time push notices, invoice QR codes, daily activity stories, and check-in confirmation photos via their paired mobile application.

---

## 3. Problem Statement & Business Opportunity

The legacy operating system suffered from architectural sprawl, fragmented state management, and inconsistent user experience across critical workflows. Teachers experienced friction during peak check-in hours (7:30 AM – 8:30 AM) when marking arrival rosters, and accountants lacked automated linkage between daily attendance absence records and monthly meal fee deductions on invoices.

By re-engineering the portal using Next.js (Pages Router), Redux, Tailwind CSS with `styled-components`, and Laravel Sanctum REST APIs, the school achieves:
- Sub-second check-in roster response times even during school-wide morning rush.
- Automated reconciliation of attendance absences into billing credit lines.
- AI-assisted student photo tagging in class media albums, reducing manual teacher effort by over 80%.
- Strict multi-tenant isolation under unified domain gateways fronted by OpenResty and Google Cloud Run.

---

## 4. User Stories by Module

### 4.1 Module 1: Vận Hành (Operations)
- **US-OPS-01 (Daily Attendance):** As a homeroom teacher, I want to view my class roster for today and record arrival (Đón) and departure (Trả) times with one click, so that student presence is immediately tracked and visible to parents and school leadership.
- **US-OPS-02 (Health & Temperature Logging):** As a homeroom teacher, I want to record student temperatures and select health flags (e.g., Cảm sốt, Sốt cao, Tay chân miệng), so that infectious disease risks are caught early and monitored school-wide.
- **US-OPS-03 (Authorized Pickup Verification):** As a duty teacher, I want to verify and select the registered pickup person when checking a student out, so that children are only released to authorized guardians.
- **US-OPS-04 (Bulk Absence with Refund Flag):** As a teacher or school admin, I want to select multiple absent students and mark them as Excused (Có phép) or Unexcused (Không phép) with a tuition refund eligibility toggle, so that meal deductions can automatically apply to the next billing cycle.
- **US-OPS-05 (Daily Activities Feed):** As a homeroom teacher, I want to post daily classroom stories with rich media, tagged curriculum lessons (`#`), and student mentions (`@`), so that parents stay informed of learning outcomes.
- **US-OPS-06 (Media Album & Facial Recognition):** As a school staff member, I want uploaded classroom photos to be automatically indexed by facial recognition and grouped into smart student portfolios, so that parents can browse photos featuring their child.
- **US-OPS-07 (Parent Messaging - Trao Đổi):** As a teacher, I want to maintain dedicated chat channels with individual parents, custom student groups, and full class rosters with file attachments, so that official school communications stay organized.
- **US-OPS-08 (Attendance & Extended Reports):** As an administrator, I want to generate monthly class attendance grids and custom operational reports with Excel exports, so that compliance records are audit-ready.

### 4.2 Module 2: Học Tập (Academics)
- **US-ACAD-01 (Timetable Management):** As an academic admin or teacher, I want to configure weekly period schedules by subject, room, and teacher, and publish them to parents with full versioning history.
- **US-ACAD-02 (Homework Assignments):** As a subject teacher, I want to create homework tasks with due dates, instruction attachments, and track student submission statuses, so that student independent study is reinforced.
- **US-ACAD-03 (Gradebook & Evaluations):** As a subject teacher, I want to input regular, midterm, and final examination scores into a standardized grade matrix, so that student performance evaluations are recorded accurately.

### 4.3 Module 3: Tài Chính (Finance)
- **US-FIN-01 (Tuition Billing & Invoicing):** As a school accountant, I want to generate monthly student tuition notices featuring line items for tuition, meals, bus services, and extracurriculars, equipped with VietQR dynamic payment codes.
- **US-FIN-02 (Attendance-Based Meal Deductions):** As an accountant, I want the invoicing engine to automatically calculate meal deductions based on verified excused absence days from the attendance module.
- **US-FIN-03 (Fee Catalog):** As an accountant, I want to manage the master catalog of all billing items, unit prices, billing periods, and tax configurations.
- **US-FIN-04 (Class Fee Schedules):** As an accountant, I want to attach specific fee packages and customized pricing rules to classes or cohorts.
- **US-FIN-05 (Expense Vouchers - Khoản Chi):** As an accountant, I want to draft, submit, and track expense vouchers with receipt proof attachments and manage cancellation flows.
- **US-FIN-07 (Collection Reports):** As a school principal or accountant, I want visual dashboards tracking school-wide and class-level collection rates (Paid, Partially Paid, Unpaid).
- **US-FIN-08 (Tuition Exemption & Discount Policies - Miễn Giảm):** As a school administrator or accountant, I want to establish and manage tuition and fee discount policies by percentage (%) or fixed cash amount (VND) applied to specific fee items (tuition, meals, bus services) for designated student cohorts or multiple classes across academic terms, so that institutional scholarship programs, statutory exemptions, and sibling discounts are systematically governed and automatically applied during invoice generation.

### 4.4 Module 4: Nhà Trường (School Administration) — Core Master Data
- **US-SCH-01 (Student Directory & 360° Profile Hub):** As a school administrator, I want to manage student master records across all academic years, including identity (Mã học sinh, CCCD, DOB), homeroom and extracurricular classes, multi-parent contact cards, per-student tuition overrides, physical health records with BMI tracking, and unified contextual tabs (Hoạt Động, Thư Viện, Điểm Danh, Học Phí), so that institutional student data is centrally maintained.
- **US-SCH-02 (Student Transitions & Lifecycle):** As an administrator, I want to perform individual student class transfers and bulk academic year grade promotions ("Chuyển năm học") with automated fee recalculation, parent chat revocation, and evaluation record alignment, so that annual student transitions execute smoothly.
- **US-SCH-03 (Teacher Directory & Moderation Permissions):** As an administrator, I want to manage the faculty directory, assign homeroom classes and teaching subjects, manage teacher portal invitation credentials, and enforce two-tier content moderation permissions (Giáo viên chính auto-publishes vs Giáo viên hỗ trợ requiring review), so that staff roles and permissions are properly governed.
- **US-SCH-04 (Class Taxonomy & Deletion Safeguards):** As an administrator, I want to manage regular curricular classes ("Lớp chính khóa") and extracurricular classes ("Lớp ngoại khóa") with targeted feature gating, homeroom teacher allocation, and strict deletion safeguards preventing removal of active classes, so that school class structure remains structurally sound.
- **US-SCH-05 (Subject Curriculum & Teaching Assignment):** As an administrator, I want to consult national curriculum subject catalogs across 4 educational tiers (TH, THCS, THPT, GDTX) and academic years, view read-only term evaluation rubrics, and dynamically assign and remove subject teachers, so that curriculum delivery is staffed accurately.
- **US-SCH-06 (Grade Level Hierarchy & Aggregate Reporting):** As an administrator, I want an overview of grade levels across all 4 educational tiers with automated class counts and student headcounts, and responsive reactive search, so that grade-level structure is readily visible.

### 4.5 Module 4: Nhà Trường (School Administration) — Operations & Knowledge
- **US-SCH-07 (Announcement Broadcasting & Scheduling):** As an administrator, I want to compose, preview, schedule, and broadcast announcements to whole-school, teacher, parent, or class cohorts via app push and email, and manage them in bulk with email permanence warnings, so that school communications are timely and reliable.
- **US-SCH-08 (Stakeholder Polling & Survey Analytics):** As an administrator, I want to formulate surveys with multi-option selection, decouple drafting from audience dispatch, and analyze live voting participation with progress bars, dynamic pie charts, and revision logs, so that stakeholder sentiment is accurately captured.
- **US-SCH-09 (Weekly Nutritional Planning & Food Safety):** As an administrator, I want to plan weekly meal menus up to 8 weeks ahead in grid or file formats, with automatic class fallback to school-wide schedules and food safety ingredient traceability (GTIN/stamps), so that school meals are transparent and compliant.
- **US-SCH-10 (Staff Attendance & Rapid Daily Clock-In):** As an administrator, I want to record daily staff clock-in/out timestamps instantly with single-click actions, manage absence requests with modal confirmations, and edit logs within a 45-day retroactive window, so that staff timesheets are effortlessly tracked.
- **US-SCH-11 (Parent Handbook & Structured Knowledge Base):** As an administrator, I want to organize parent guidelines and FAQs in a strict 2-tier category tree with accordion interaction, draft rich-text articles, toggle publishing states, and delete categories safely with cascading warnings, so that institutional knowledge is well-structured.

### 4.6 Module 4: Nhà Trường (School Administration) — Feedback, Calendar, Terms & Archives
- **US-SCH-12 (Parent Feedback & Inquiries):** As an administrator, I want to manage parent feedback tickets across 8 domains, assign internal handlers, adjust priority levels, and participate in two-way discussion threads with image attachments, so that parent issues are resolved transparently.
- **US-SCH-13 (Event & Holiday Calendar):** As an administrator, I want to manage school events and holidays across Year, Month, and Event list views with semantic color bands and single-day date auto-fill, so that institutional schedules are comprehensively communicated.
- **US-SCH-14 (Academic Years & Terms Configuration):** As an administrator, I want to configure academic years and terms using a minimal 3-field form with automated current-year resolution and date overlap guards, so that system-wide temporal filters remain accurate.
- **US-SCH-15 (Student Archive Repository):** As an administrator, I want a centralized archive repository for withdrawn students preserving withdrawal reasons, staff operators, and dates, with safe restoration and permanent deletion safeguards, so that active class rosters remain pristine.
- **US-SCH-16 (Governance & Audit Compliance):** As an internal operator, I need audit trails on ticket closures, event removals, and permanent student purging, so that administrative operations are fully traceable.

### 4.7 Module 6: Cấu Hình (Settings) — Sub-module 3: Học Phí (Settings Fee Configuration)
- **US-SET-01 (Invoice Footer Notes):** As a school administrator, I want to customize the invoice footer note displayed on all student tuition notices, so that parents understand payment policies and bank transfer rules.
- **US-SET-02 (Sepay Payment Service Inspection):** As an accountant, I want to inspect Sepay credentials and access monthly payment history logs, so that automated banking transactions are easily reconciled.
- **US-SET-03 (SInvoice Electronic Invoicing):** As an accountant, I want to configure SInvoice electronic invoice credentials, templates, and issuance automation toggles, so that legal VAT electronic invoices are generated systematically.
- **US-SET-04 (Late Pickup & Meal Refund Policies):** As an administrator, I want to configure late childcare surcharges (fixed vs tiered) and advance-notice meal refund cutoffs linked to school hours, so that childcare and cafeteria operations are fairly managed.
- **US-SET-05 (Reconciliation Distribution List):** As an accountant, I want to maintain a list of up to 3 authorized email addresses for automated tuition settlement reports, so that financial statements reach designated accounting personnel.

---


## 5. Functional Requirements (FR)

### Module 1: Vận Hành (Operations)
- `FR-OPS-001`: The system MUST provide a daily class attendance roster filterable by class and date, defaulting to today's active session.
- `FR-OPS-002`: The system MUST support one-click check-in (Đón), recording the exact timestamp and automatically tagging arrivals after school opening threshold as "Đến muộn".
- `FR-OPS-003`: The system MUST enforce that departure time (Trả) is strictly greater than arrival time (Đón). If a user attempts to record departure earlier than or equal to arrival, the system MUST reject the update with message `Giờ trả học sinh phải lớn hơn giờ đón học sinh` (MSG01).
- `FR-OPS-004`: If check-out is triggered for a student with no recorded arrival time, the system MUST show an inline warning `Chưa nhập thời gian đón học sinh` (MSG02) and block checkout via the quick action.
- `FR-OPS-005`: The system MUST provide an advanced checkout modal (via gear icon `pickup-button`) allowing teachers to select the authorized pickup guardian from the student's registered guardian roster.
- `FR-OPS-006`: The system MUST provide bulk absence marking for selected students, requiring selection of Excused (Có phép) vs Unexcused (Không phép) and Refundable (Được hoàn tiền) vs Non-refundable.
- `FR-OPS-007`: The system MUST maintain a closed health observation catalog: Bình thường, Cảm sốt, Sốt cao, Đỏ mắt, Mụn rộp, Đau bụng, Thủy đậu, Sốt xuất huyết, Tay chân miệng.
- `FR-OPS-008`: The system MUST provide a class activity publisher supporting rich text, media uploads, subject tags (`#`), user mentions (`@`), and moderation approval status (Chờ duyệt vs Đã duyệt).
- `FR-OPS-009`: The system MUST maintain automated system media albums ("Hoạt động" and "Điểm danh") alongside custom class photo/video albums.
- `FR-OPS-010`: The system MUST provide an asynchronous facial recognition pipeline that analyzes uploaded album photos against student reference faces, tagging matching students.
- `FR-OPS-011`: The system MUST provide real-time chat channels for direct parent messaging, custom student group chats, and class announcements.
- `FR-OPS-012`: The system MUST generate monthly attendance calendars with aggregated presence, excused absence, unexcused absence, and late-pickup penalty fee calculations.

### Module 2: Học Tập (Academics)
- `FR-ACAD-001`: The system MUST allow administrators and teachers to configure weekly class timetables structured by morning and afternoon periods.
- `FR-ACAD-002`: The system MUST support timetable versioning and log every published timetable revision dispatched to parents.
- `FR-ACAD-003`: The system MUST provide homework creation categorized by class and subject with title, rich description, file attachments, and submission deadlines.
- `FR-ACAD-004`: The system MUST display a student homework submission tracker detailing submitted, graded, late, and missing assignments.
- `FR-ACAD-005`: The system MUST provide a gradebook matrix supporting configurable scoring categories (regular oral tests, 15-minute tests, 1-period tests, midterm exams, and final exams).

### Module 3: Tài Chính (Finance)
- `FR-FIN-001`: The system MUST support tuition invoice generation scoped by school, grade, class, or individual student for any target billing month.
- `FR-FIN-002`: The invoicing engine MUST automatically deduct meal allowances for verified excused absence days recorded in the attendance module during the previous billing cycle.
- `FR-FIN-003`: Each generated invoice MUST feature a unique invoice number, itemized fee breakdown, payment due date, and dynamic VietQR payment code.
- `FR-FIN-004`: The system MUST maintain invoice payment statuses: Đã tạo (Created), Đã gửi (Sent), Nộp một phần (Partially Paid), Đã hoàn thành (Paid), Quá hạn (Overdue), and Đã hủy (Cancelled).
- `FR-FIN-005`: The system MUST maintain a master fee catalog specifying line item names, billing unit (monthly, term, one-off), and mandatory vs optional classification.
- `FR-FIN-006`: The system MUST allow configuring tuition schedules per class, binding catalog fees with class-specific price overrides.
- `FR-FIN-007`: The system MUST provide an expense voucher management workflow with category classification, recipient details, proof attachments, and cancellation audit trails.
- `FR-FIN-009`: The system MUST generate school-wide and class-level collection analytics illustrating payment percentages and outstanding balances.
- `FR-FIN-010`: The system MUST provide a Tuition Exemption & Discount Policy Management catalog (`/school/discount`) displaying policy code, policy name, discount calculation type, discount value, applied fee item, beneficiary scope, validity interval, and lifecycle status.
- `FR-FIN-011`: The system MUST support two discount calculation types: Percentage discount (`percent`, 0% - 100%) and Fixed cash deduction (`fixed_amount` in integer VND), bound to a specific fee line item from the master fee catalog (`/school/school-fees`).
- `FR-FIN-012`: The system MUST support dual application scope topologies: Class cohort (with multi-select class dropdown) or Specific enrolled students (with searchable student picker across classes).
- `FR-FIN-013`: The system MUST enforce temporal policy validity by Academic Year or Month Interval (`fromMonth` to `toMonth`). Policies past their configured end date MUST automatically transition to `Hết hạn` (Expired) status, while valid policies remain `Hoạt động` (Active), with manual pause (`Ngừng áp dụng`) and termination controls.
- `FR-FIN-014`: During tuition invoice generation (`/school/fee/create`), the billing engine MUST automatically evaluate active discount policies against student and class cohorts, calculate itemized deductions, and render them as dedicated discount lines (`Giảm trừ`) on the invoice.
- `FR-FIN-015`: The invoice creation wizard MUST provide an administrative toggle ("Tự động áp dụng chính sách miễn giảm", default ON) allowing accountants to optionally bypass discount calculations for a specific invoice generation run without altering master policy definitions.
- `FR-FIN-016`: The system MUST provide an Excel export feature allowing administrators to download the full discount policy catalog with beneficiary rosters and validity metadata.

### Module 4: Nhà Trường (School Administration)
- `FR-SCH-001`: The system MUST provide a comprehensive Student Directory (`/school/kid/`) filterable by academic year, class, keyword search, enrollment date, and educational authority flag ("CSDL Sở").
- `FR-SCH-002`: The system MUST provide a 360° Student Detail Hub (`/school/kid/detail/[id]/`) featuring 5 primary tabs: "Hồ Sơ" (master identity, multi-parent contact cards, tuition fee override, physical growth history with BMI calculation), "Hoạt Động", "Thư Viện", "Điểm Danh", and "Học Phí".
- `FR-SCH-003`: The system MUST provide a student creation page (`/school/kid/create/`) validating mandatory fields (Mã học sinh, Họ và tên, Số CCCD) with optional tuition override and baseline physical metrics.
- `FR-SCH-004`: The system MUST support individual class transfer and bulk academic year transfer ("Chuyển năm học"), enforcing 3 mandatory rules: updating student fee schedules to target class, revoking parent access to previous class group chats, and pruning evaluation records to subjects present in the new class.
- `FR-SCH-005`: The system MUST provide a student notes modal allowing internal administrative notes, showing a visual indicator (📄) on the directory roster when populated.
- `FR-SCH-006`: The system MUST provide a Teacher Directory (`/school/teacher/`) filterable by class (matching both homeroom and assigned teaching classes), keyword substring search across name and email, and CSDL Sở flag.
- `FR-SCH-007`: The system MUST enforce two-tier teacher content moderation permissions: "Giáo viên chính" (activities publish automatically) vs "Giáo viên hỗ trợ" (activities submit to the administrative moderation queue).
- `FR-SCH-008`: The system MUST provide teacher invitation onboarding ("Tạo và gửi lời mời"), credential updates via a dedicated "Thay đổi email" modal, and password resets delegating to account configuration.
- `FR-SCH-009`: The system MUST provide a Class Management Catalog (`/school/class/`) organized into two distinct tabs: "Lớp chính khóa" (curricular) and "Lớp ngoại khóa" (extracurricular).
- `FR-SCH-010`: The system MUST enforce degraded feature support for extracurricular classes: extracurricular classes support only attendance, daily activities, and media albums, while strictly omitting tuition billing schedules, gradebook evaluation matrices, and subject teacher assignments.
- `FR-SCH-011`: The system MUST enforce that the delete action for classes is strictly permitted only when student enrollment equals zero (`studentCount === 0`). Classes with 1 or more enrolled students MUST hide or disable the delete action.
- `FR-SCH-012`: The system MUST provide homeroom teacher (GVCN) assignment for regular classes and direct multi-select teacher allocation for extracurricular classes.
- `FR-SCH-013`: The system MUST maintain a Subject Catalog (`/school/subject/`) structured across 4 educational levels (TH, THCS, THPT, GDTX) and academic years, displaying read-only syllabus evaluation schemes across 4 evaluation terms.
- `FR-SCH-014`: The system MUST allow school administrators to assign and remove teaching teachers for any subject, automatically deduplicating already-assigned teachers from the assignment modal dropdown.
- `FR-SCH-015`: The system MUST provide a Grade Level Hierarchy (`/school/grades/`) organized across 4 educational levels with aggregate metrics (Mã khối, Cấp học, Số học sinh, Số lớp), and provide reactive client-side search resolution that instantly restores full listings on clearing input.

### Module 4 Phase 2: Nhà Trường (Operations & Knowledge)
- `FR-SCH-016`: The system MUST provide an announcement management roster (`/announcement/`) filterable by status (`Bản nháp`, `Chưa gửi`, `Đã gửi`) and category (Thông báo chung, Kế hoạch học tập, Thực đơn, Sự kiện, Lịch nghỉ, Thời khóa biểu), with case-insensitive search.
- `FR-SCH-017`: The system MUST enforce announcement life-cycle states where only drafts can be edited, scheduled announcements broadcast on their designated timestamp, and deletions display warnings that delivered emails cannot be recalled.
- `FR-SCH-018`: The system MUST provide a live visual preview modal simulating the recipient's mobile/web card layout before sending.
- `FR-SCH-019`: The system MUST provide a poll builder (`/school/poll/`) requiring Title, Deadline, $\ge 2$ options, and configuration toggles for multi-choice and parent result visibility.
- `FR-SCH-020`: The system MUST decouple poll drafting from audience dispatch, permitting administrators to broadcast an existing draft to the whole school or specific classes (`INFANT; Lá`).
- `FR-SCH-021`: The system MUST render live voting analytics with progress bars, conditionally display an interactive SVG pie chart only when total votes $> 0$, and log per-student vote modification histories.
- `FR-SCH-022`: The system MUST support weekly meal menus (`/school/menu/`) up to 8 weeks ahead in dual formats: Mon–Sat $\times$ 3-meal grid editor or uploaded graphic/PDF.
- `FR-SCH-023`: The system MUST dynamically fallback to the school-wide (`Toàn trường`) weekly menu for any class lacking a custom weekly menu override.
- `FR-SCH-024`: The system MUST support food safety provenance on grid dishes via GTIN + Lot number (auto-resolving supplier names) or internal stamp codes, and restrict cloning exclusively to grid menus.
- `FR-SCH-025`: The system MUST support dual menu publishing: silent publication vs broadcast integration creating an announcement in Bảng Thông Tin.
- `FR-SCH-026`: The system MUST provide daily staff attendance (`/school/staff-attendance/`) with single-click Check-in/out instant timestamping and inline badge editing.
- `FR-SCH-027`: The system MUST enforce modal confirmations for marking staff Absent (`Có phép` vs `Không phép`), disabling Check-in/out buttons while active.
- `FR-SCH-028`: The system MUST enforce a 45-day retroactive calendar selection limit while strictly disabling future dates, and suppress aggregate KPI counters during text search.
- `FR-SCH-029`: The system MUST maintain a parent handbook (`/school/handbook/`) restricted to a strict 2-tier category hierarchy (Root $\rightarrow$ Sub-category $\rightarrow$ Articles) with single-sibling accordion expansion.
- `FR-SCH-030`: The system MUST support rich-text article drafting with dual save options (`Lưu nháp` vs `Lưu & Xuất bản`), publishing/hiding toggles, and cascading deletion confirmation for categories.

### Module 4: Nhà Trường — Phase 3 (Feedback, Calendar, Terms, Archives)
- `FR-SCH-031`: The system MUST provide a parent feedback ticket inbox (`/school/feedback/`) filterable by academic year, status, category, handler, priority, and date range.
- `FR-SCH-032`: The system MUST provide 4 status summary cards (`Yêu cầu mới`, `Đang xử lý`, `Hoàn tất`, `Mở lại`) that function as clickable filters while persistently retaining independent global ticket totals across all cards (`K012`).
- `FR-SCH-033`: The system MUST categorize feedback into 8 standard domains: Nội dung, Hình thức/trình bày, Hiệu suất/chất lượng, Kỹ năng, Thái độ/hành vi, Quy trình, Trải nghiệm người dùng, and Mang tính chiến lược.
- `FR-SCH-034`: The system MUST support 4 priority tiers (`Thấp`, `Trung bình`, `Cao`, `Khẩn cấp`) modifiable inline directly on table rows and ticket details.
- `FR-SCH-035`: The system MUST manage two-way discussion threads (`DiscussionMessage[]`) with image attachments, toggling waiting side between parent and school upon submission.
- `FR-SCH-037` (C051): The system MUST provide a school event calendar (`/school/calendar/`) supporting 3 synchronized view modes: `Năm` (12-month grid matrix with bottom category legend), `Tháng` (single-month 7-column day cell grid with previous/next month navigation), and `Sự kiện` (chronological agenda stream).
- `FR-SCH-038`: The system MUST color-code events across 3 fixed categories: `Ngày nghỉ` (Rose `#E11D48`), `Sự kiện nội bộ` (Teal `#0D9488`), and `Sự kiện có mời phụ huynh` (Amber `#EA580C`), with an explanatory color legend banner on the Year view.
- `FR-SCH-039` (C052): In Year and Month views, multi-day events MUST render as horizontal continuous colored bars across day cells; clicking an event bar opens the read-only "Chi tiết sự kiện" inspection modal with a direct pencil-edit shortcut.
- `FR-SCH-040` (C053): In `Sự kiện` list view, the system MUST render tear-away calendar date cards (large day number + month label), support dual scope filtering between `Sự kiện sắp tới` and `Tất cả sự kiện`, and provide direct inline edit and delete actions with confirmation modal `LS-01`.
- `FR-SCH-040b` (C054): The system MUST provide dedicated authoring routes (`/school/calendar/create` and `/school/calendar/edit/[eventId]`) with mandatory title, category, and date span validation, an optional "Thêm thời gian" toggle (`HH:mm`), dirty form navigation guard `LS-02`, and automatic synchronization of `Ngày nghỉ` events with the Tuition Meal Refund schedule (`TASK-FIN-034`).
- `FR-SCH-041`: The system MUST manage academic years (`/school/academic-year/`) using a minimal 3-field form (`Tên năm học`, `Ngày bắt đầu`, `Ngày kết thúc`).
- `FR-SCH-042`: The system MUST dynamically compute and render the green `Hiện tại` badge on the academic year containing the current system date (`BR01`).
- `FR-SCH-043`: The system MUST enforce date validation preventing overlapping date intervals between full academic years while permitting nested semester sub-terms (`K015`).
- `FR-SCH-044`: The system MUST disable deleting academic years from the UI to protect relational integrity across dependent modules (`BR03`).
- `FR-SCH-045`: The system MUST provide an archived student repository (`/school/archive/`) capturing withdrawal metadata: withdrawal date, staff operator link, and reason.
- `FR-SCH-046`: The system MUST render student detail modals with a prominent yellow warning banner (`🔒 Học sinh đã được lưu trữ`) and read-only field presentations (`BR03`).
- `FR-SCH-047`: The system MUST provide student restoration (`Phục hồi`) with modal confirmation, restoring students to active rosters while verifying class continuity (`K013`).
- `FR-SCH-048`: The system MUST enforce a two-step confirmation modal with red warning graphics before permanently purging an archived student from the database (`BR06`).

### Module 6: Cấu Hình (Settings) — Sub-module 3: Học Phí (Settings Fee Configuration)
- `FR-SET-001` (C043): The Settings Fee sub-module provides 5 independent configuration blocks with isolated per-block dirty tracking, independent Save buttons, and an unsaved changes confirmation modal guard (`/setting/fee/`).
- `FR-SET-002`: The Sepay automated payment block MUST be read-only without a save button, displaying masked API secret tokens and webhook URLs with reveal eye icons, and providing a navigation link to the monthly Sepay transaction history view.
- `FR-SET-003` (C045): The SInvoice electronic invoice block provides collapsible toggle activation, mandatory tax credential validation, permanently masked passwords, and issuance automation toggles.
- `FR-SET-004`: The Late Pickup policy block MUST provide an independent toggle switch that disables (without hiding) inner controls when OFF, supporting fixed rate (5–60 minutes combobox + hourly rate) or tiered bracket table where row 1 cannot be deleted.
- `FR-SET-005`: The Meal Refund policy block MUST provide an independent toggle switch and 0–100 hours combobox; when ON, school operating hours table is shown and conditional refund applies; when OFF, operating hours are hidden and unconditional refund applies.
- `FR-SET-006`: The Reconciliation Email distribution roster MUST support up to 3 email recipients, enforcing strict regex validation (`ERR-HP-01`), duplicate prevention (`ERR-HP-02`), and disabling input controls upon reaching 3 emails.
- `FR-SET-007` (C048): The Meal Refund configuration MUST categorize non-attendance days into Group A (Ngày nghỉ lễ / sự kiện của trường) enforcing an automatic 100% refund rule without requiring percentage entry, and Group B (Ngày học sinh tự nghỉ) with independent configurable percentage inputs for Tiền ăn (bán trú / trưa) and Tiền ăn sáng.
- `FR-SET-008` (C049): The system MUST compute total meal refund amounts using $(D_{self} \times P_{main} \times \text{Rate}_{main}) + (D_{school} \times P_{main} \times 100\%)$ and $(D_{self} \times P_{bf} \times \text{Rate}_{bf}) + (D_{school} \times P_{bf} \times 100\%)$.
- `FR-FIN-019` (C049b): During tuition invoice generation for billing month $M+1$ (`/school/fee/create`), the billing engine MUST automatically query student non-attendance records from month $M$, evaluate meal refund rules, and inject itemized deduction line items into the invoice creation wizard.
- `FR-FIN-020` (C050): Invoices, printable receipts, and VietQR payloads MUST clearly display the itemized meal refund breakdown and reflect the net payable amount after deducting previous month meal refunds.
- `FR-CLS-001` (C055): The Class Management module MUST partition school classes into two distinct tabs: "Lớp chính khóa" (formal academic cohorts with full curriculum, grade evaluation, and fee structures) and "Lớp ngoại khóa" (extracurricular clubs with multi-instructor staffing).
- `FR-CLS-002` (C056): The system MUST strictly disable and block deletion of any class containing one or more enrolled students (`studentCount > 0`), requiring student reassignment in the Student module prior to decommissioning.
- `FR-CLS-003` (C057): Curricular classes MUST mandate a single Homeroom Teacher (`homeroomTeacherId`) with conflict detection warnings, while Extracurricular classes MUST support multiple assigned instructors (`instructorIds: string[]`).
- `FR-CLS-004` (C058): The system MUST provide a centralized Class Detail hub at `/[schoolCode]/school/classes/[classId]` consolidating student rosters, tuition schedule previews, subject-teacher assignments, and one-click operational shortcuts to Attendance, Activity feeds, Media albums, and Timetables.
- `FR-SUB-001` (C059): The Subject Management module MUST partition the school subject catalog across 4 distinct educational stage tabs: "Tiểu học (TH)", "THCS", "THPT", and "GDTX", with independent subject codes and curricula per stage.
- `FR-SUB-002` (C060): Core standard MoET subjects (`isStandardMoET === true`) MUST be pre-initialized and protected from accidental deletion or code modification by school administrators.
- `FR-SUB-003` (C061): The system MUST provide a structured 4-term Assessment Matrix per subject (Giữa Kỳ 1, Cuối Kỳ 1, Giữa Kỳ 2, Cuối Kỳ 2) detailing evaluation modalities (Điểm số, Mức đánh giá, Nhận xét) and GPA summarization status (`isCountedForGPA`).
- `FR-SUB-004` (C062): The teacher assignment workflow MUST provide a modal dropdown strictly excluding already-assigned teachers, and teacher unassignment MUST enforce confirmation modal `MODAL-UNASSIGN-TEACHER` with active class assignment warnings.
- `FR-SUB-006`: Top KPI summary cards MUST present: Tổng số môn học, Môn tính điểm, Môn nhận xét, and Số giáo viên đã phân công for the active educational stage.
- `FR-GRD-001` (C064): The system MUST provide an administrative grade level dashboard at `/[schoolCode]/school/grades` featuring stage filter tabs ("Tất cả", "Tiểu học (TH)", "THCS", "THPT", "GDTX") and an Academic Year dropdown selector.
- `FR-GRD-002` (C066): The dashboard MUST include 4 top KPI summary cards: Tổng số khối lớp, Tổng số lớp học, Tổng số học sinh, and Sĩ số trung bình/lớp dynamically rolled up from active class rosters in the selected academic year.
- `FR-GRD-003`: The grade table MUST display: STT, Mã khối (e.g. `K01`, `K06`), Tên khối (e.g. `Khối 1`, `Khối 6`), Cấp học (badge colored by tier), Số lượng lớp học, Số lượng học sinh, Tỷ lệ gán GVCN, and Thao tác (icon xem chi tiết `faEye`).
- `FR-GRD-004` (C067): The search bar MUST execute instantaneous, accent-insensitive Vietnamese matching across grade names and codes, restoring the full list immediately when cleared (`BR04`, `BR05`).
- `FR-GRD-005` (C068): The Grade Detail view at `/[schoolCode]/school/grades/[gradeId]` MUST render 4 metric summary cards (Mã khối & Cấp học, Tổng số lớp, Tổng số học sinh, Tổng giáo viên) and breadcrumb navigation (`Nhà trường > Khối lớp > Chi tiết Khối {name}`).
- `FR-GRD-006` (C068): The Grade Detail view MUST host a comprehensive Class Roster Table displaying: STT, Tên lớp (link to `/school/classes/[classId]`), Phòng học, Giáo viên chủ nhiệm (tên & SĐT), Sĩ số học sinh (kèm thanh tiến độ sức chứa), Số lượng GV bộ môn, Trạng thái (badge), and Lối tắt thao tác nhanh (Xem lớp, Điểm danh `/attendance`, TKB `/schedule`).
- `FR-ANN-001` (C069): The system MUST provide an announcement directory dashboard at `/[schoolCode]/school/announcements` featuring status tabs (`Tất cả`, `Đã gửi`, `Chưa gửi`, `Bản nháp`), category filters (6 MoET categories: Thông báo chung, Kế hoạch học tập, Thực đơn, Sự kiện, Lịch nghỉ, Thời khóa biểu), instant client-side accent-insensitive search, and 4 KPI summary cards (Tổng số thông báo, Đã gửi, Chưa gửi, Bản nháp).
- `FR-ANN-002` (C069): The announcement composer at `/create` MUST support 3 transmission channels (`app`, `email`, `both`) and 5 audience scopes (`toan_truong`, `toan_bo_giao_vien`, `toan_bo_phu_huynh`, `lop_hoc`, `ca_nhan`).
- `FR-ANN-003` (C069): When `lop_hoc` is selected as audience, the composer MUST dynamically render conditional selectors for sub-audience (`targetSubAudience`: `all` | `teachers` | `parents`) and multi-class target selection (`targetClassIds: string[]`), enforcing mandatory selection before publishing.
- `FR-ANN-004` (C073): The system MUST provide an interactive WYSIWYG preview modal simulating the exact recipient notification presentation (sender avatar, school badge, category pill, formatted content, attachments) prior to dispatch.
- `FR-ANN-005` (C070): The system MUST enforce a strict draft-only mutability policy: only announcements in `ban_nhap` status can be edited; published notices (`da_gui`) and scheduled notices (`chua_gui`) are immutable and permit only inspection or deletion.
- `FR-ANN-006` (C071): The system MUST support scheduled dispatch: if `sendDate` is populated with a future date, the announcement is saved in `chua_gui` status for automated dispatch; if `sendDate` is omitted, clicking "Gửi" immediately publishes the notice with `da_gui` status.
- `FR-ANN-007` (C072): The system MUST support single and bulk announcement deletion, triggering an explicit audit warning dialog stating that notices are removed from Web and App interfaces but dispatched emails cannot be retracted.
- `FR-ANN-008`: The system MUST provide a comprehensive announcement detail view (`/[schoolCode]/school/announcements/[announcementId]`) displaying transmission metadata, recipient statistics, read counts (`viewCount`), formatted body, attachments, and contextual action buttons based on lifecycle status.
- `FR-POL-001` (C074): The system MUST provide a poll directory dashboard at `/[schoolCode]/school/poll/` featuring status tabs (`Tất cả`, `Đã tạo`, `Đã gửi`, `Đã đóng`), class filter dropdown, instant client-side accent-insensitive search, and 4 KPI summary cards (Tổng số bình chọn, Đang diễn ra, Bản nháp, Đã đóng).
- `FR-POL-002` (C074): The poll composer at `/school/poll/create` MUST require Title (Chủ đề), Expiration Deadline (Thời hạn bình chọn), optional Description, optional Image URL, and minimum 2 distinct Options (Các lựa chọn), with configuration toggles for "Chọn nhiều phương án" and "PH được xem kết quả bình chọn" (both defaulting to false), saving in `da_tao` draft status without audience.
- `FR-POL-003` (C074): The system MUST provide a decoupled dispatch modal (`UC-04`) accessible via the paper-plane action icon on `da_tao` polls, supporting recipient selection between "Toàn trường" (default) or "Lớp học" (with multi-class selection), transitioning status to `da_gui`.
- `FR-POL-004` (C075): The directory table MUST enforce a state-driven action visibility rule: the 3 action icons (Edit pencil, Send paper plane, Delete trash bin) appear strictly for polls in `da_tao` status; rows in `da_gui` or `da_dong` status display zero action icons to protect ballot integrity.
- `FR-POL-005` (C077): The poll detail cockpit at `/[schoolCode]/school/poll/[pollId]` MUST display poll title, cover image, collapsible description with "Xem thêm / Thu gọn", expiration status badge, and individual option progress bars with vote counts and percentage shares.
- `FR-POL-006` (C077): The detail cockpit MUST dynamically render a visual pie chart if and only if total recorded votes $> 0$; if total votes equal zero, the chart is omitted, displaying only horizontal progress bars at 0%.
- `FR-POL-007` (C078): The detail cockpit MUST host a comprehensive student voter roster filtered by class and voting status (Tất cả, Đã bình chọn, Chưa bình chọn), displaying student name, avatar, class, selected option titles, and latest voted timestamp.
- `FR-POL-008` (C078): Beside each recorded vote in the student roster, the system MUST render a history icon opening an audit modal that displays the complete chronological log of all option revisions made by that voter with exact timestamps.
- `FR-HNB-001` (C084): The system MUST provide an administrative Parent Handbook dashboard at canonical route `/[schoolCode]/school/handbook` positioned in the sidebar navigation strictly after "Điểm danh NV" and before "Lịch sự kiện", featuring an accordion category/article tree, top status filter ("Tất cả", "Bản nháp", "Đã phát hành"), client-side accent-insensitive search, a "+ Thêm danh mục" root action button, and a right-hand article detail inspection panel.
- `FR-HNB-002` (C084): The system MUST enforce a strict 2-tier category taxonomy (`BR01`, `K049`): Root Category -> Sub-Category -> Leaf Article. At the sub-category level, only "+ Thêm bài viết" is rendered; creating sub-categories inside sub-categories is strictly blocked.
- `FR-HNB-003`: The system MUST enforce an accordion single-active expansion rule (`BR02`, `K050`): within any sibling group, expanding a category automatically collapses previously open siblings.
- `FR-HNB-004` (C085): The system MUST support drag-and-drop sibling reordering (`BR04`, `K053`): sub-categories and articles render drag handle icons (☰) for positional reordering within their parent; root categories maintain fixed order.
- `FR-HNB-005` (C086): The system MUST support article draft vs. published lifecycles (`BR05`, `BR12`): Drafts render slate titles and a gray "Bản nháp" badge with 1-click "Xuất bản bài viết"; Published articles render amber titles without badges and offer 1-click "Ẩn bài viết".
- `FR-HNB-006`: The system MUST provide an article detail inspection panel (`BR06`) displaying full category breadcrumbs, rich text formatted HTML body, and downloadable file attachment tiles.
- `FR-HNB-007`: The system MUST provide dedicated authoring routes (`/school/handbook/create` and `/edit/[articleId]`) with locked destination category breadcrumbs (`BR07`) and dual save buttons ("Lưu nháp" vs "Lưu & Xuất bản", `BR08`).
- `FR-HNB-008` (C088): The system MUST execute article-centric pruning and search filtering (`BR10`): filters evaluate article titles only, pruning categories with no matching articles, auto-expanding matches, and rendering empty state `ST-03` on zero results.
- `FR-HNB-009` (C087): The system MUST enforce cascading deletion guardrails (`BR09`): deleting a category triggers high-severity modal `ST-01` warning that all child sub-categories and articles will be wiped; deleting an article triggers simple leaf confirmation `ST-02`.
- `FR-HNB-010`: The system MUST configure context-aware category modals (`BR11`): creating/editing sub-categories renders read-only "Danh mục chính" (parent category name); root category modals omit this field.
- `FR-FDB-001` (C089): The system MUST provide an administrative Parent Feedback dashboard at canonical route `/[schoolCode]/school/feedback` positioned in the sidebar navigation strictly after "Sổ tay PH" and before "Lịch sự kiện", with top status filter/KPI cards, school year selector, advanced filter bar, and feedback ticket roster table.
- `FR-FDB-002` (C090): The system MUST render 4 color-coded KPI summary cards (`Yêu cầu mới` Blue `#0070CE`, `Đang xử lý` Purple `#8B5CF6`, `Hoàn tất` Green `#10B981`, `Mở lại` Amber `#F59E0B`) that display global school-year ticket counts while functioning as single-click table filter toggles with a "Xóa bộ lọc" reset action.
- `FR-FDB-003` (C091): The system MUST classify feedback across 8 fixed categories (Nội dung, Hình thức/trình bày, Hiệu suất/chất lượng, Kỹ năng, Thái độ/hành vi, Quy trình, Trải nghiệm người dùng, Mang tính chiến lược) and 4 color-coded priority levels (Thấp, Trung bình, Cao, Khẩn cấp).
- `FR-FDB-004` (C091): The system MUST permit frictionless inline priority and assignee updates directly from table rows and ticket detail views without confirmation dialogs.
- `FR-FDB-005` (C092): The system MUST enforce a reactive turn-taking state machine tracking "Chờ phản hồi" (Chờ phản hồi từ nhà trường vs Chờ phản hồi từ phụ huynh) that automatically alternates based on the last commenter and reopens completed tickets upon parent replies.
- `FR-FDB-006`: The system MUST provide a dual-pane feedback detail surface (`/[schoolCode]/school/feedback/[feedbackId]`) featuring an original message banner, chronological discussion stream, and 3 structured sidebar metadata cards.
- `FR-FDB-007`: The system MUST provide an interactive discussion reply composer with empty-state submit button disablement, optional photo previews, and automated status flipping.
- `FR-FDB-008` (C093): The system MUST enforce confirmation modal `GY-01` before terminal ticket closure ("Vui lòng xác nhận Đóng góp ý {tên góp ý}").
- `FR-FDB-009` (C093): The system MUST provide read-only student and parent quick-view profile modals displaying essential contact and academic metadata with missing fields rendering `"Chưa có {trường}"`.
- `FR-FDB-010` (C089): The system MUST enforce parent-only ticket inception via the parent mobile application, strictly omitting any ticket creation buttons from the school web portal.
- `FR-AY-001` (C098): The system MUST provide an administrative Academic Year directory at canonical route `/[schoolCode]/school/academic-year` (with backward compatibility alias `/[schoolCode]/school/season`), positioned in the sidebar navigation strictly after "Lịch sự kiện", displaying a search bar, a "Tạo năm học" action button, an academic year table roster, and a footer counter "Tổng: N".
- `FR-AY-002` (C094): The system MUST implement automated calendar-driven current year evaluation (`BR01`): dynamically calculating whether an academic year is active (`today >= startDate && today <= endDate`), applying bold blue text (`#0070CE`) and a "Hiện tại" badge chip to the active row, while strictly omitting any manual "Hiện tại" checkbox/toggle in the form modal.
- `FR-AY-003`: The system MUST support flexible free-form academic naming (`BR02`), accommodating both standard annual school years (e.g., "Năm học 2026 - 2027") and semester sub-periods (e.g., "Kỳ 1 năm học 2026 - 2027").
- `FR-AY-004` (C096): The system MUST provide a minimalist 3-field create/edit modal (`BR04`) containing strictly: `Tên năm học` (text, required), `Ngày bắt đầu` (date, required), and `Ngày kết thúc` (date, required), keeping the submit button disabled until all 3 fields are valid (`NH-01`).
- `FR-AY-005` (C095): The system MUST enforce permanent omission of delete operations (`BR03`): the table row actions column strictly contains only the Edit button (`faEdit`); delete is permanently omitted across all UI surfaces to preserve referential integrity across attendance, tuition, classes, and gradebooks.
- `FR-AY-006` (C097): The system MUST support instant client-side search filtering (`BR05`): typing into the search input dynamically filters rows by academic year name case- and diacritic-insensitively while updating the "Tổng: N" counter in real-time.
- `FR-AY-007` (C096): The system MUST enforce date ordering validation (`VR-AY-02`): validating `endDate >= startDate` and displaying an inline error if end date precedes start date.


---


## 6. Non-Functional Requirements (NFR)

- `NFR-001 (Performance)`: Daily attendance roster initial load time MUST be less than 800ms under 95th percentile load. Single-click check-in state updates MUST reflect optimistically within 100ms on the client.
- `NFR-002 (Scalability & Multi-Tenancy)`: The application MUST support multi-tenant isolation using the `{schoolCode}` URL prefix across a single unified codebase. Tenant data leakage between schools MUST be prevented at both the application router and API gateway levels.
- `NFR-003 (Security & Authentication)`: Authentication MUST use NextAuth.js with encrypted JWE session cookies. Backend API requests MUST be authenticated using Laravel Sanctum bearer tokens with tenant-scoped permissions.
- `NFR-004 (Design System Compliance)`: All interfaces MUST strictly adhere to `ECO Design System 1.0` design tokens, utilizing `#FEC020` (brand yellow), `#0070CE` (primary blue), the 4-64px spacing scale, and Google Fonts (`Baloo Chettan 2`, `Quicksand`, `Inter`).
- `NFR-005 (Observability)`: Error tracking MUST be monitored via Sentry with ~10% trace sampling. User interaction telemetry and session replay MUST be captured via Google Analytics 4 and Microsoft Clarity.
- `NFR-006 (Data Integrity & Concurrency)`: Check-in/out updates and payment confirmations MUST be idempotent and protected against race conditions using optimistic locking or transaction isolation.

---

## 7. Acceptance Criteria (AC)

- `AC-001`: Given a homeroom teacher viewing today's class roster, when clicking "Đón" on an unmarked student, then the current timestamp is saved, the "Tham dự" counter increments by 1, and if the time exceeds the school opening cutoff, the "Đến muộn" badge appears.
- `AC-002`: Given a student with recorded arrival at 08:15, when the teacher clicks "Trả" with an input time of 08:10, then the system displays error toast `Giờ trả học sinh phải lớn hơn giờ đón học sinh` and saves nothing.
- `AC-003`: Given an unmarked student, when the teacher clicks quick "Trả", then the system displays inline warning `Chưa nhập thời gian đón học sinh.` and blocks submission.
- `AC-004`: Given a student, when the teacher clicks the gear icon `pickup-button` next to Trả, then a modal opens displaying the student's authorized guardian roster and allows saving checkout time and guardian selection even if arrival was not pre-recorded.
- `AC-005`: Given 3 selected students, when the teacher clicks "Vắng" on the toolbar, then the bulk absence modal requires choosing Có phép vs Không phép and refund status before saving.
- `AC-005b`: Given multiple selected students (or "Chọn tất cả"), when the teacher clicks "Đón hàng loạt" or "Trả hàng loạt", the system presents a confirmation modal displaying the selected students and an adjustable timestamp stepper (`-15p`, `-5p`, `Hiện tại`, `+5p`, `+15p`, or manual time) before executing the bulk action.
- `AC-005c`: In the attendance roster, clicking the temperature box opens a clean numeric-only input without stepper buttons or degree icons; in the bulk confirmation modal, each student card features a top-right `[x]` button allowing teachers to remove individual students before confirming.
- `AC-006`: Given a teacher composing a daily activity post, when typing `@`, an inline autocomplete popup displays enrolled students for quick keyboard/click selection; upon selection, `@Student Name` is highlighted in a distinct blue pill badge, and each published activity card cleanly displays view count and likes while omitting obsolete comment and sharing icons.
- `AC-006b`: In the activity module, the header omits quick stats pills ("3 bài đã duyệt", "1 chờ duyệt"), the general feed strictly excludes unapproved posts (isolating them to the "Chờ duyệt" tab), and only 1 post can be pinned at any time, requiring user confirmation to unpin the previous post before pinning a new one.
- `AC-007`: Given an uploaded photo album with 20 class pictures, when processed by facial recognition, all recognized student faces are highlighted with confidence bounding boxes and linked to student profiles.
- `AC-007b`: In the media library, all album cards and the detail view hero banner follow the widescreen 16:9 standard of "Lễ Khai Giảng Năm Học 2026-2027"; deleting any album triggers a custom confirmation pop-up modal; and selecting photos displays a floating bar with a dedicated `[Xóa ảnh]` button next to `Tải xuống ZIP` with confirmation before deletion.
- `AC-008`: Given an accountant running monthly tuition billing for Grade 1, when generating invoices, student invoices automatically deduct meal fees matching verified excused absence days from the previous month.
- `AC-009`: Given a student invoice in "Đã gửi" status, when a parent transfers tuition via VietQR and the gateway webhook fires, the invoice status transitions to "Đã hoàn thành" and a payment receipt record is appended.
- `AC-010`: Given an accountant viewing the reconciliation module, when comparing a banking session against school ledger invoices, all matching transaction IDs, fees, and discrepancies are clearly highlighted.
- `AC-011`: In the application shell, the left navigation sidebar and the main content pane scroll independently with zero mutual layout shifting, and the "Niên khóa - Học kỳ" information is stationary and permanently pinned fixed at the bottom of the sidebar.
- `AC-012`: In the Trao Đổi (Conversations) module, clicking any element keeps the whole section still without jumping; the conversation list scrolls independently; chat settings allow locking parents from sending messages and archiving the conversation (both fully reversible with audit logging); and pinned messages are capped at a maximum of 3 per chat with an interactive conflict resolution modal requiring removing an existing pin before pinning a new one.
- `AC-013`: In the Báo Cáo Điểm Danh (Attendance Report) module, the Học Sinh tab table displays 2 rows per student (Sáng and Chiều) with date columns spanning under the month title; attendance totals (Tham dự, Vắng có phép, Vắng không phép, Đến/Về muộn) are embedded directly within the student's name frame alongside parent contact info, with all trailing summary columns removed from the end of the table; and an explanatory legend bar is positioned at the bottom.
- `AC-014`: In the Báo Cáo Điểm Danh (Attendance Report) module, the "Nhân viên" tab matches the "Học sinh" tab architecture: structured with 2 session rows per staff member (Sáng and Chiều), date columns arranged under the month spanning header (`Báo cáo điểm danh nhân viên tháng {MM}/{YYYY}`), staff profile cards embedding individual totals (`✓` Ngày làm, `⭕` Vắng có phép, `⭕` Vắng không phép, `⏱️` Đến/Về muộn) directly in the sticky name frame, removal of the trailing summary column from the table end, and the bottom legend bar.
- `AC-015`: In the Thời Khóa Biểu (Academics Schedule) module:
  1. The timetable list table is enlarged and capped at 10 schedules per page with pagination controls to navigate across subsequent pages.
  2. For every timetable row in the table, clicking the `[...]` (three dots) action button opens a dropdown consistently presenting all 5 actions: `Xem chi tiết`, `Chỉnh sửa`, `Gửi phụ huynh`, `Tải xuống`, and `Xóa`.
  3. In the schedule detail view (`[scheduleId].tsx`), the "Tạo bản sao" button is deleted; clicking "Gửi phụ huynh" displays an interactive confirmation pop-up modal before dispatching notifications to parents; clicking "Chỉnh sửa" navigates to the schedule edit screen.
  4. In the schedule edit screen (`edit/[scheduleId].tsx`), the "Cập nhật và gửi" button is deleted, leaving only two actions: "Hủy bỏ" and "Cập nhật".
- `AC-016`: Universal Table Data Casing & Top-Layer Action Dropdowns Across All Modules:
  1. All column titles in tables across all modules consistently use Sentence case (e.g. `Bài tập & môn học`, `Mã TKB`, `Tên thời khóa biểu`, `Học sinh`, `Thao tác`, etc.) with `uppercase` styling purged.
  2. In any table, action menus and dropdown popovers (including `[...]` three dots and `Thao tác` buttons) near the bottom of a table render on the topmost layer (`z-index: 9999`, open upwards when near the bottom, with active row relative elevation) so users can immediately view and interact with options without scrolling or obstruction.
- `AC-017`: BC Mở Rộng (Extended Reports) Module Action Menu:
  In `ExtendedReportTable`, the trailing `Thao tác` column replaces inline buttons with a uniform `[...]` (three dots) action button opening a top-layer dropdown menu with actions (`Xem chi tiết`, `Chỉnh sửa`, `Tạo bản sao`, `Xóa`), matching the Thời khóa biểu design pattern.
- `AC-018`: Trao Đổi (Conversations) Module Chat Composer:
  In the `ChatThread` message composer, formatting controls "B", "I", "U" are deleted. The toolbar permits only file attachments (`📎`) and emojis (`😊`), allowing users to attach multiple files (with dismissible preview chips) and pick emojis from a popup selector that inserts directly at the text cursor position.
- `AC-019`: Thời Khóa Biểu (Academics Schedule) Module - Dynamic Grid Matrix Mode:
  1. In Grid Matrix creation mode, the matrix initializes showing only 1 period line (`Tiết 1`) at a time.
  2. Users can click the `[+]` ("Thêm tiết học") button to dynamically add new lines, with start and end times customizable via time inputs instead of static hardcoded intervals.
  3. Columns Monday through Saturday are completely blank by default for all added lines, awaiting user input.
  4. The "Ra chơi & uống sữa" section is completely eliminated across the schedule grid, mock data, and file preview templates.
- `AC-020`: Universal "Thao tác" Three-Dots (`•••`) Action Dropdown Standardization:
  Across all modules in the platform (including Thời khóa biểu, Báo cáo mở rộng, Bài tập, Học phí, Khoản phí, Quản lý học phí, Khoản chi, Đối soát, and Thư viện album list), the "Thao tác" column standardizes on a single `•••` (`[three dots]`) button that toggles a floating contextual action dropdown menu, with upward flip behavior (`isNearBottom`) and outside-click dismissal. Inline action icons are eliminated.
- `AC-021`: Học Phí (Tuition Billing & Invoices) UI & Workflow Alignment:
  1. Time filtering toolbar features a prefix titled `"Lọc theo:"` with selectable options (`Thời gian tạo HĐ` vs `Hạn đóng HĐ`) paired with a single date range picker (`DD/MM/YYYY - DD/MM/YYYY ▾`).
  2. Manual payment confirmation (`ManualPaymentModal`) is strictly limited to 3 payment methods: `Tiền mặt`, `QR ECOPay`, and `Ví Finviet`. On clicking `"Lưu xác nhận"`, an enterprise success toast notification (`addToast`) confirms the payment and closes the dialog.
  3. Detailed invoice view (`InvoiceDetailView`) clearly highlights the payment status under `Thành tiền` for each line item: green badge `"Đã thanh toán"` for settled fees and red badge `"Chưa thanh toán"` for unsettled fees.
- `AC-022`: Universal Logic Change Confirmation Pop-up & Success Toast Standard:
  1. Across all portal modules (current and future), any action that modifies configuration logic or business rules (such as toggling `Xuất HĐĐT` in Khoản phí, deleting items, or updating configurations) must display an explicit confirmation pop-up modal requiring user confirmation before committing changes.
  2. Displaying information, status confirmations, and successful action feedback must consistently be rendered via the standard global toast notification in the top-right viewport corner (`addToast`).
  3. In `FeeCatalogTable`, add a unit filter dropdown in the toolbar and interactive ascending/descending sorting directly by clicking the "Đơn vị" column header.
- `AC-023`: Quản Lý Học Phí Table Restructuring & Khoản Phí Detail Modal:
  1. In `ClassFeeScheduleTable`, columns `Học phí (đ/tháng)`, `Tiền ăn (đ/ngày)`, and `Xuất HĐĐT` are eliminated, streamlining table columns from 9 to 6 (`STT`, `Tên lớp`, `Khối`, `Sĩ số`, `Các khoản phí`, `Thao tác`).
  2. The column `Các khoản khác` is renamed to `Các khoản phí`. Each class row displays the total number of configured fees (`{count} khoản phí`) alongside a clickable eye icon button.
  3. Clicking the eye icon button opens a centered modal pop-up displaying a table with exactly three columns: `Tên khoản phí`, `Số tiền` (with unit), and `Xuất HĐĐT` (`Có` / `Không` status badge).
- `AC-024`: Học Sinh (Student Directory, Profile Hub, and Transitions):
  1. Student Directory table displays student photo avatar, full name, student code, homeroom class (with optional "Ngoại khóa: {name}" subline), study status pill, gender, creator, and standardized `•••` action dropdown (`Xem chi tiết`, `Cập nhật`, `Lưu trữ`, `Chuyển lớp`, `Xóa`).
  2. An icon indicator (📄) appears next to the student's name only when internal notes exist; clicking it opens the notes modal displaying current content and edit capabilities.
  3. Student Detail Hub (`/school/kid/detail/[id]/`) renders 5 tabs: "Hồ Sơ" (master identity, expandable parent contact cards with multi-student linking, tuition fee overrides, and physical height/weight growth history with automated BMI calculation) plus 4 filtered context tabs ("Hoạt Động", "Thư Viện", "Điểm Danh", "Học Phí").
  4. Class transfer and academic year promotion ("Chuyển năm học") modals enforce selecting old and new classes, explicitly prompting acknowledgement of the 3 transition rules (fee schedule cascade, chat revocation, evaluation pruning).
- `AC-025`: Giáo Viên (Teacher Directory, Moderation Tiers & Credentials):
  1. Teacher Directory table displays staff name, homeroom class, assigned teaching classes, contact info (phone, email), address, and `•••` action dropdown.
  2. Teacher detail view distinguishes "Lớp chủ nhiệm" from "Lớp phụ trách" and displays "Phân quyền" (Giáo viên chính vs Giáo viên hỗ trợ) with an informative tooltip explaining moderation behavior.
  3. Email updates are managed through a dedicated "Thay đổi email" modal, and password resets delegate directly to account configuration (`/setting/users/{id}/change-password/`).
  4. Adding a new teacher submits via "Tạo và gửi lời mời" which validates Email, Temporary Password, and Full Name.
- `AC-026`: Lớp Học (Class Taxonomy, Extracurricular Degeneration & Deletion Safeguards):
  1. Class Overview manages classes under two tabs: "Lớp chính khóa" (curricular) and "Lớp ngoại khóa" (extracurricular), toggleable via form switch.
  2. Extracurricular classes enforce degraded feature scope: omitting tuition fee configurations, gradebook evaluation rubrics, and subject allocations, while supporting attendance, activities, and photo albums.
  3. The delete action (`Xóa`) is strictly visible and permitted only for classes with 0 enrolled students. For any class with 1 or more students, the delete option is completely omitted from the action menu.
  4. Regular class detail embeds "Thông tin học phí" (6 standard line items) and "Phân công bộ môn" requiring an assigned grade level.
- `AC-027`: Môn Học (Subject Catalog by 4 Educational Tiers & Teaching Assignments):
  1. Subject catalog organizes subjects across 4 educational level tabs (TH, THCS, THPT, GDTX) with distinct subject IDs and academic year context.
  2. Detail view presents read-only syllabus evaluation matrix across 4 terms (Giữa HK1, HK1, Giữa HK2, Cuối năm) specifying Point, Evaluation Level, and Comment rubrics.
  3. Administrative staff can add teachers to subjects via a modal dropdown that automatically deduplicates already-assigned faculty, and remove teachers with a confirmation pop-up.
- `AC-028`: Khối Lớp (Grade Level Hierarchy across 4 Tiers & Reactive Search):
  1. Grade level catalog displays the 4-tier educational hierarchy (TH, THCS, THPT, GDTX) with 4 summary metric cards (Mã khối, Cấp học, Số học sinh, Số lớp).
  2. Grade detail lists all assigned classes with homeroom teacher links, student counts, and teacher totals.
  3. Search filtering executes reactively on the client side, overcoming legacy server-side search defects, and immediately restores the complete listing upon clearing the search term without requiring page reloads.
- `AC-029`: Bảng Thông Tin (Announcement Board & Scheduling):
  1. Announcement roster displays title, send date, audience, view counts, and standard `•••` action dropdowns.
  2. Live preview modal accurately simulates the mobile/web card layout without requiring optional fields.
  3. Bulk deletion requires confirmation with explicit email permanence non-retraction caveats.
- `AC-030`: Bình Chọn (Poll Formulation, Audience Dispatch & Analytics):
  1. Survey builder requires Title, Deadline, and $\ge 2$ options, with multi-choice and parent visibility toggles.
  2. Audience dispatch decouples from drafting, allowing whole school or multi-class targeting.
  3. Progress bars display option tallies; dynamic pie chart appears only when total votes $> 0$. Vote revision modal audits timestamped changes.
- `AC-031`: Thực Đơn (Weekly Meal Menus, Fallback Inheritance & Food Safety):
  1. Weekly menu editor supports 8-week horizon, Mon–Sat grid, and file uploads. Classes without custom menus inherit the school-wide menu.
  2. Ingredient traceability card parses GTIN + lot numbers and resolves supplier names. Grid menus support cloning; file menus omit cloning.
- `AC-032`: Điểm Danh NV (Daily Staff Attendance & Rapid Clock-In):
  1. Single-click Check-in/out records current time with immediate toast feedback without confirmation dialogs.
  2. Marking staff Absent enforces modal confirmation with permission type and notes.
  3. Calendar selection enforces 45-day past limit and locks future dates. Searching by name suppresses top 3 summary KPI counters.
- `AC-033`: Sổ Tay PH (Parent Handbook & 2-Tier Knowledge Base):
  1. Handbook taxonomy enforces a strict 2-tier category limit, disabling sub-category creation inside sub-categories.
  2. Accordion maintains single-sibling active expansion. Articles draft and publish with rich text.
  3. Category deletion prompts an explicit warning that all child sub-categories and articles will be deleted.
- `AC-034`: Góp Ý (Feedback Ticket Status Cards & Independent Counts):
  1. In the feedback inbox, clicking any of the 4 status cards (`Yêu cầu mới`, `Đang xử lý`, `Hoàn tất`, `Mở lại`) filters the table rows to the selected status.
  2. All 4 status cards persistently retain their independent global ticket counts regardless of the active filter card, eliminating the legacy drop to 0 (`K012`).
  3. Clicking the active card again or clicking "Xóa bộ lọc" resets table filtering to all tickets.
- `AC-035`: Góp Ý (Two-Way Discussion & Ticket Closure):
  1. The ticket detail view separates ticket metadata from the discussion stream. Submitting a new message appends it to the discussion timeline and updates waiting state.
  2. Clicking "Đóng góp ý" displays a confirmation modal with the ticket title. Upon confirmation, status transitions to `Hoàn tất` and success toast confirms closure.
- `AC-036`: Lịch Sự Kiện (3-View Calendar & Category Color Bands):
  1. Toggling between `Năm`, `Tháng`, and `Sự kiện` views displays the identical event dataset for the selected year.
  2. Events display color-coded indicators matching their category: `Ngày nghỉ` (pink/red), `Sự kiện nội bộ` (cyan), `Sự kiện có mời phụ huynh` (orange).
- `AC-037`: Lịch Sự Kiện (Single-Day Event End-Date Defaulting):
  1. In event creation/edit forms, selecting a start date auto-populates the end date with the same value if the end date is currently empty (`K014`).
  2. In list view, events render with tear-away calendar date cards displaying large day numbers and month names.
- `AC-038`: Năm Học (Automated Current Badge & Date Validation):
  1. The academic year whose interval contains current system time automatically displays the green `Hiện tại` badge.
  2. Creating or updating academic years validates that full school year intervals do not overlap (`K015`).
- `AC-039`: Lưu Trữ (Archived Student Roster & Warning Banner):
  1. Archived student roster lists withdrawal date, staff operator link, and withdrawal reason. Clicking student name opens the detail modal with yellow `🔒 Học sinh đã được lưu trữ` banner.
  2. Clicking the sort arrow next to `Học sinh` alternates between `A→Z` and `Z→A` alphabetical ordering.
- `AC-040`: Lưu Trữ (Restoration Continuity & Permanent Purge Safeguard):
  1. Clicking `Phục hồi` opens a confirmation modal. Confirming restores student to active status, preserving previous class if active or defaulting to unassigned with warning if inactive (`K013`).
  2. Clicking `Xóa` displays a confirmation modal with distinct red warning graphics. Confirming permanently purges the student record.
- `AC-041`: Miễn Giảm (Policy Catalog & State Lifecycle Automation):
  1. Accessing `/school/discount` renders the discount policy roster table with columns: Policy Code, Policy Name, Applied Fee Item, Scope Type & Count, Discount Value (% or VND), Validity Interval, Status badge (`Hoạt động`, `Ngừng áp dụng`, `Hết hạn`), and Action Menu.
  2. Policies whose `toMonth` or academic year end date is strictly in the past relative to system date automatically render as `Hết hạn` (Expired) with disabled apply triggers (`K017`).
  3. Clicking "Ngừng áp dụng" (Pause) transitions active policy to paused state; clicking "Kích hoạt lại" restores it to active if within validity window.
- `AC-042`: Miễn Giảm (Policy Creation & Dual Scope Topology):
  1. Policy creation form enforces validation: Policy Name (required, min 3 chars), Fee Item (selected from master fee catalog), Discount Type (`percent` 1-100% or `fixed_amount` > 0 VND), Scope Type (`class` or `student`), Validity Interval (`academic_year` or custom month range `fromMonth` <= `toMonth`), and Reason text.
  2. If Scope is `class`, multi-select dropdown allows selecting 1 or more classes (or "Tất cả các lớp"). If Scope is `student`, searchable student picker allows selecting 1 or more specific students across enrolled classes.
- `AC-043`: Miễn Giảm (Discount Conflict Resolution & Automated Highest Value Policy):
  1. When a student qualifies for 2 or more active discount programs simultaneously for the same fee line item (e.g. Student A already has Program X applied for the whole class, and Program Y is created specifically for Student A):
     - The billing engine evaluates the actual monetary deduction across all candidate policies and **automatically applies the program yielding the highest discount value (`Math.max`)** upon tuition invoice generation.
     - If student-specific Program Y offers a higher benefit than class-wide Program X (e.g., 50% > 20%), Program Y (50%) is automatically applied.
     - If class-wide Program X offers a higher benefit than student-specific Program Y (e.g., 30% > 10%), Program X (30%) is automatically retained to ensure the student's benefit is never decreased.
     - When deductions are identical, the student-specific policy is selected as tie-breaker.
  2. In the policy creation/edit dialog (`CreateDiscountPolicyModal`), selecting students who already possess an active discount on that fee item renders an alert banner detailing the existing program, current vs new discount values, and confirms that the system will automatically apply the higher value.
  3. Independent fee item discounts (e.g., 50% tuition and 200,000 VND meal discount) apply concurrently to their respective invoice line items without cross-item contamination. Total discount amount for any fee line item is capped at 100% of that line item's gross charge, preventing negative invoice line items.
- `AC-044`: Miễn Giảm (Tuition Invoice Creation Wizard Integration & Admin Override):
  1. In the tuition invoice generation wizard (`/school/fee/create`), an admin toggle "Tự động áp dụng chính sách miễn giảm" is enabled (ON) by default (`K018`).
  2. When enabled, preview and generated invoice line items render with itemized discount deductions (`Giảm trừ miễn giảm: -X VND`) and net payable amounts.
  3. When toggled OFF, invoice calculations proceed with standard gross fee catalog amounts without applying any discount deductions, preserving master policy definitions unchanged.
- `AC-045`: Miễn Giảm (Historical Invoice Immutability & Excel Export):
  1. Modifying, pausing, or expiring a discount policy strictly affects future invoice generation batches; previously generated, sent, or settled invoices (`da_tao`, `da_gui`, `da_thanh_toan`) remain immutable with their original discount deductions intact (`K017`).
  2. Clicking "Xuất Excel" exports the discount policy catalog and beneficiary roster to an `.xlsx` file with metadata headers, policy codes, beneficiary names/classes, applied fee items, discount values, validity intervals, and status.
- `AC-046`: Cấu Hình Học Phí (Independent Blocks & Dirty Tracking):
  1. Main page `/setting/fee/` hosts 5 independent configuration blocks, each with isolated "Lưu" buttons disabled by default.
  2. Modifying any input in a block enables only that block's "Lưu" button; other buttons remain disabled (`BR01`).
  3. Attempting to leave the page with unsaved changes in any block triggers the system confirmation modal dialog (`BR03`).
- `AC-047`: Cấu Hình Hóa Đơn Điện Tử SInvoice & Sepay:
  1. Toggling SInvoice OFF collapses the form block, hiding all inner fields (`BR04`).
  2. Toggling SInvoice ON displays all 6 mandatory fields marked with red `*` (Tax Code, Account Name, Password, Invoice Template, Invoice Type, Invoice Serial) and 2 toggles (`BR05`).
  3. Password field remains permanently masked with `type="password"` (`BR06`, `K019`).
  4. Sepay block displays masked secret and webhook with eye toggle icon, and navigates to payment history with monthly filter (`BR02`, `BR16`).
- `AC-048`: Cấu Hình Trả Trễ & Báo Vắng:
  1. Toggling Late Pickup OFF disables inner controls without hiding them (`BR08`).
  2. Selecting "Theo giờ cố định" allows selecting 5–60 mins interval (step 5) and entering hourly rate (`BR11`).
  3. Selecting "Theo khung giờ" renders dynamic tiered table where row 1 cannot be deleted; delete icon appears when $\ge 2$ rows exist (`BR13`).
  4. Toggling Meal Refund ON displays 0–100 hours combobox, school operating hours table, and conditional refund notice; toggling OFF hides operating hours table and switches to unconditional refund (`BR09`, `BR10`, `K022`).
- `AC-049`: Cấu Hình Email Đối Soát:
  1. Adding an invalid email displays inline error *"Email không hợp lệ"* (`ERR-HP-01`).
  2. Adding a duplicate email displays *"Email đã tồn tại trong danh sách"* (`ERR-HP-02`, `K021`).
  3. Reaching 3 emails locks the input field and Add button (`BR14`).
- `AC-050`: Cơ Chế Hoàn Tiền Ăn (Group A 100% Guarantee & Group B Configurable Rates):
  1. In `Cấu hình > Học phí`, Group A (Ngày nghỉ lễ / ngày nghỉ theo lịch sự kiện của trường) renders an informational guarantee card confirming automatic 100% refund for Tiền ăn (bán trú / trưa) and Tiền ăn sáng without requiring percentage inputs.
  2. In Group B (Ngày học sinh tự nghỉ), user can independently input refund percentages for Tiền ăn (0-100%, default 50%) and Tiền ăn sáng (0-100%, default 70%). Inputs are validated and clamped between 0% and 100%.
- `AC-051`: Tính Toán Hoàn Tiền Ăn Tháng 9 (September Arithmetic Vector Verification):
  1. Given: Student Nguyen Gia Huy with 3 student-initiated absent days ($D_{self} = 3$) and 1 statutory holiday ($D_{school} = 1$, 02/09) in September.
  2. Given: Daily rates $P_{main} = 40,000\text{đ}$, $P_{bf} = 20,000\text{đ}$, and configured rates $50\%$ (Tiền ăn) and $70\%$ (Tiền ăn sáng).
  3. Calculation yields:
     - Tiền ăn tự nghỉ: $40,000 \times 50\% \times 3 = 60,000\text{đ}$
     - Tiền ăn sáng tự nghỉ: $20,000 \times 70\% \times 3 = 42,000\text{đ}$
     - Tiền ăn nghỉ lễ: $40,000 \times 100\% \times 1 = 40,000\text{đ}$
     - Tiền ăn sáng nghỉ lễ: $20,000 \times 100\% \times 1 = 20,000\text{đ}$
     - Total September Meal Refund: $100,000\text{đ}$ (Tiền ăn) $+ 62,000\text{đ}$ (Tiền ăn sáng) $= 162,000\text{đ}$.
- `AC-052`: Tự Động Khấu Trừ Hóa Đơn Tháng Tiếp Theo (October Billing Deduction):
  1. When creating an invoice for October (`2026-10`) in `/school/fee/create`, the billing engine automatically queries September absences and injects the $162,000\text{đ}$ refund into the invoice pricing calculation.
  2. Step 3 (Chi tiết & Khấu trừ) displays itemized deduction lines:
     - `Khấu trừ hoàn tiền ăn T9: -100.000đ (3 ngày tự nghỉ [50%]: -60.000đ, 1 ngày nghỉ lễ [100%]: -40.000đ)`
     - `Khấu trừ hoàn tiền ăn sáng T9: -62.000đ (3 ngày tự nghỉ [70%]: -42.000đ, 1 ngày nghỉ lễ [100%]: -20.000đ)`
  3. Net payable total is reduced by exactly $162,000\text{đ}$.
- `AC-053`: Đồng Bộ Hóa Hóa Đơn & Mã QR Thanh Toán (Invoice Record & VietQR Sync):
  1. The generated student invoice record (`InvoiceRecord`), printable receipt voucher, and VietQR payment payload reflect the net payable amount after deducting previous month meal refunds.
- `AC-054`: Tính Bất Biến & Lưu Trữ State Độc Lập (State Isolation & Historical Immutability):
  1. Updating meal refund percentages in Settings Fee strictly affects *future* invoice generation runs without altering settled historical invoices (`ADR-014`).
  2. Editing rates marks the block dirty and integrates with the unsaved changes navigation guard modal.
- `AC-055`: Lớp Học (Dual Taxonomy & Dynamic Filtering):
  1. Navigating to `/school/classes` renders two primary tabs ("Lớp chính khóa" and "Lớp ngoại khóa") with summary KPI cards at the top.
  2. On the Curricular tab, the Grade Level dropdown filters classes reactively; on the Extracurricular tab, the Grade filter is hidden and replaced by Club Category.
- `AC-056`: Lớp Học (Empty Class Deletion Guardrail):
  1. For any class with `studentCount > 0`, the delete icon in the table is disabled with tooltip "Không thể xóa lớp đang có {N} học sinh. Vui lòng chuyển học sinh sang lớp khác trước khi xóa."
  2. For an empty class with `studentCount === 0`, clicking delete opens confirmation modal `MODAL-DELETE-CLASS` requiring explicit confirmation before removal.
- `AC-057`: Lớp Học (Class Creation Wizard & Schema Switching):
  1. Navigating to `/school/classes/create` defaults to Curricular mode, enforcing mandatory Grade Level and single Homeroom Teacher selection.
  2. Toggling "Lớp ngoại khóa" dynamically updates form fields to Club Category, Multi-Instructor assignment, and Meeting Schedule.
- `AC-058`: Lớp Học (Centralized Class Detail Dashboard):
  1. Navigating to `/school/classes/[classId]` renders the class profile header with student capacity progress.
  2. Tabs provide full enrolled student rosters, fee schedule preview, subject assignments, and immediate operational shortcut buttons to Attendance, Activity feeds, Media albums, and Timetables.
- `AC-059`: Môn Học (Four-Stage Educational Partitioning & Top KPIs):
  1. Navigating to `/school/subjects` defaults to the primary educational stage tab (e.g. "Tiểu học (TH)"), displaying all stage-specific subjects and 4 KPI summary cards (Tổng số môn, Môn tính điểm, Môn nhận xét, GV đã phân công).
  2. Clicking "THCS", "THPT", or "GDTX" re-renders the table with curriculum subjects appropriate to that educational tier without code collisions.
- `AC-060`: Môn Học (Protected MoET Standard Catalog):
  1. Standard MoET 2018 subjects display a verified badge (`Môn chuẩn Bộ`) with protected code, classification, and evaluation types, preventing unauthorized deletion or corruption by school staff.
- `AC-061`: Môn Học (4-Term Assessment Matrix & Detail Drawer):
  1. Clicking any subject row opens the Subject Detail Drawer (`DRAWER-SUB-DETAIL`).
  2. The drawer presents a 4-column read-only matrix across Giữa Kỳ 1, Cuối Kỳ 1, Giữa Kỳ 2, and Cuối Kỳ 2 displaying evaluation badges (`Điểm số`, `Mức đánh giá`, `Nhận xét`), accompanied by an explicit GPA status indicator.
- `AC-062`: Môn Học (Teacher Assignment & Deduplication):
  1. Clicking "Phân công GV" opens modal `MODAL-ASSIGN-TEACHER`.
  2. The teacher dropdown automatically filters out all faculty members currently assigned to the subject, preventing redundant assignments.
- `AC-063`: Môn Học (Teacher Unassignment Confirmation Guardrail):
  1. Clicking the remove icon next to an assigned teacher in the detail drawer triggers confirmation modal `MODAL-UNASSIGN-TEACHER`.
  2. The dialog clearly states the teacher's full name, subject name, and assigned class count, requiring explicit confirmation before unassigning while preserving historical gradebook entries.
- `AC-064`: Môn Học (Accent-Insensitive Vietnamese Search & Filter):
  1. Typing "toan", "ngu van", or "tieng anh" in the search box matches "Toán học", "Ngữ văn", and "Tiếng Anh" instantaneously without requiring diacritic marks.
- `AC-065`: Khối Lớp (Four-Stage Educational Partitioning & Top KPIs):
  1. Navigating to `/[schoolCode]/school/grades` defaults to stage filter "Tất cả", rendering 4 KPI summary cards (Tổng số khối lớp, Tổng số lớp học, Tổng số học sinh, Sĩ số trung bình/lớp) dynamically computed from active class records.
  2. Selecting "Tiểu học (TH)", "THCS", "THPT", or "GDTX" filters the table rows to match that specific tier and recalculates KPI counters immediately.
- `AC-066`: Khối Lớp (Statutory Master Catalog Immutability):
  1. Grade levels are statutory cohorts defined per national standards (Khối 1 đến Khối 12); the UI exposes zero "Thêm mới" or "Xóa" buttons for grade entities, preserving data integrity.
- `AC-067`: Khối Lớp (Instant Client-Side Accent-Insensitive Search):
  1. Typing "khoi 1" or "k01" matches "Khối 1" (`K01`) and "Khối 10" (`K10`) instantaneously (< 10ms).
  2. Erasing the search term restores the complete grade roster immediately without page reload or network delay.
- `AC-068`: Khối Lớp (Grade Detail Cockpit Navigation):
  1. Clicking any grade row or its `faEye` action icon navigates to `/[schoolCode]/school/grades/[gradeId]`.
  2. The page renders breadcrumbs (`Nhà trường > Khối lớp > Chi tiết Khối {name}`) and 4 metric cards: Mã khối & Cấp học, Tổng số lớp, Tổng số học sinh, Tổng giáo viên.
- `AC-069`: Khối Lớp (Grade Detail Class Roster & Operational Shortcuts):
  1. The Grade Detail view renders all classes belonging to the grade with columns: STT, Tên lớp, Phòng học, Giáo viên chủ nhiệm (tên & SĐT), Sĩ số (kèm thanh tiến độ sức chứa), Số lượng GV bộ môn, Trạng thái (badge).
  2. Quick action buttons directly open Class Detail (`/school/classes/[classId]`), Attendance (`/attendance`), and Timetable (`/schedule`).
- `AC-070`: Khối Lớp (Dynamic Class and Student Rollups):
  1. All class counts, enrolled student tallies, and homeroom staffing completion percentages update reactively when classes are added or modified in the selected academic year.
- `AC-071`: Bảng Thông Tin (Directory Status Filtering & Summary KPIs):
  1. Navigating to `/[schoolCode]/school/announcements` displays 4 status tabs (`Tất cả`, `Đã gửi`, `Chưa gửi`, `Bản nháp`), category filter dropdown (6 categories), and 4 KPI cards (Tổng số thông báo, Đã gửi, Chưa gửi, Bản nháp).
  2. Selecting tabs or filtering categories immediately filters the announcement table without page reload.
- `AC-072`: Bảng Thông Tin (Multi-Channel Dispatch & Conditional Class Target Scoping):
  1. Creating an announcement supports 3 transmission channels (`app`, `email`, `both`) and 5 audience scopes (`toan_truong`, `toan_bo_giao_vien`, `toan_bo_phu_huynh`, `lop_hoc`, `ca_nhan`).
  2. Selecting "Lớp học" opens conditional fields for sub-audience (`targetSubAudience`: `all` | `teachers` | `parents`) and multi-class target selection (`targetClassIds`), which are required before publication.
- `AC-073`: Bảng Thông Tin (WYSIWYG Recipient Preview Modal):
  1. Clicking "Xem trước" in the composer opens a modal simulating the recipient card layout (title, sender, category badge, timestamp, body, attachments).
  2. The preview displays cleanly without requiring premature validation of unselected classes.
- `AC-074`: Bảng Thông Tin (Draft-Only Mutability Safeguard):
  1. Announcements in `da_gui` (published) status completely hide the "Chỉnh sửa" action, restricting actions to view and delete.
  2. Only announcements in `ban_nhap` (draft) status display the "Chỉnh sửa" button.
- `AC-075`: Bảng Thông Tin (Scheduled Automatic Dispatch):
  1. Populating `sendDate` with a future date saves the notice in `chua_gui` status with a clock indicator.
  2. Leaving `sendDate` empty publishes immediately in `da_gui` status with `sentAt` timestamped.
- `AC-076`: Bảng Thông Tin (Irrevocable Email Notification Warning on Single/Bulk Delete):
  1. Deleting one or multiple selected notices triggers a modal warning: *"Lưu ý: Người dùng sẽ không thể xem các thông tin liên quan đến thông báo này trên cả Web và App, trừ những email đã được gửi ra"*.
- `AC-077`: Bảng Thông Tin (Comprehensive Detail Hub & Interaction Tracking):
  1. Clicking an announcement row navigates to `/[schoolCode]/school/announcements/[announcementId]`.
  2. The page renders complete transmission metadata, audience breakdown, attachments, formatted body, and cumulative read counts (`viewCount`).
- `AC-078`: Bình Chọn (Directory Dashboard & Accent-Insensitive Filter):
  1. The poll directory loads at `/[schoolCode]/school/poll/` with 4 KPI summary cards and 4 status tabs (`Tất cả`, `Đã tạo`, `Đã gửi`, `Đã đóng`).
  2. Typing accent-free text (e.g. "gia ngoai") in the search input instantly filters matching polls without page reloads.
- `AC-079`: Bình Chọn (Poll Authoring & Configuration):
  1. Creating a poll requires Title, Future Deadline, and at least 2 non-empty options.
  2. Configuration toggles for "Chọn nhiều phương án" and "PH được xem kết quả bình chọn" default to disabled.
  3. Saving creates the poll in `da_tao` status without audience bindings.
- `AC-080`: Bình Chọn (Decoupled Audience Dispatch Modal):
  1. Clicking the Send icon on a `da_tao` poll opens the confirmation modal with "Gửi đến" defaulting to "Toàn trường".
  2. Switching to "Lớp học" reveals a class dropdown; confirming updates `audienceScope`, stamps `sentAt`, and transitions the poll to `da_gui`.
- `AC-081`: Bình Chọn (State-Driven Action Visibility Safeguard):
  1. Table rows for polls in `da_gui` or `da_dong` status completely hide Edit, Send, and Delete action icons.
  2. Only polls in `da_tao` status display the 3 action icons.
- `AC-082`: Bình Chọn (Conditional Visual Results Chart):
  1. For polls with zero recorded votes, option progress bars display 0% and no pie chart is rendered.
  2. For polls with $\ge 1$ recorded vote, an interactive pie chart visually depicts proportional distributions.
- `AC-083`: Bình Chọn (Student Voter Roster & Class Filtering):
  1. The detail cockpit lists enrolled students in the target cohort, filterable by class and voting status.
  2. Voters who cast ballots display their selected options and last voted timestamp.
- `AC-084`: Bình Chọn (Voter Choice Revision History Modal):
  1. Clicking the history icon beside a student voter opens the "Lịch sử bình chọn" modal.
  2. The modal displays the chronological list of all option revisions made by that voter before the deadline.
- `AC-085`: Điểm Danh NV (Directory Dashboard, Cohort Filtering & Responsive Search):
  1. Staff attendance dashboard loads at canonical route `/[schoolCode]/school/staff-attendance` (with `?classId=...`) with 3 top KPI presence cards (*Tham dự*, *Vắng có phép*, *Vắng không phép*), date picker, class dropdown, role dropdown, search input, and table roster.
  2. Selecting a class or role narrows the staff roster instantaneously without page reloads.
- `AC-086`: Điểm Danh NV (Date Selection Boundaries & 45-Day Retrospective Read-Only Lock):
  1. Date picker disables future dates ($\le$ today).
  2. Selecting any past date within 45 days displays static warning banner `DD-02` (*"*Chỉ được cập nhật thông tin điểm danh trong vòng 45 ngày kể từ hôm nay"*).
  3. Selecting a date older than 45 days in the past renders the entire roster strictly read-only, disabling Check-in, Check-out, Vắng toggle, and inline note editing (K046).
- `AC-087`: Điểm Danh NV (1-Click Direct Check-In / Check-Out Action):
  1. Clicking "Check-In" or "Check-Out" immediately records the current system time (`HH:mm`) without any confirmation modal, converting the button to a colored badge with a pencil icon.
  2. Check-in uses Primary Blue `#0070CE`; Check-out uses Amber Accent `#FEC020`.
- `AC-088`: Điểm Danh NV (Inline Time Badge Editing & Validation Rollback):
  1. Clicking a recorded time badge toggles inline editing for hours and minutes.
  2. Entering an invalid format or clearing the field triggers error toast `DD-01` (*"Thời gian không đúng định dạng."*) upon blur, automatically reverting the badge to its prior valid timestamp without losing recorded data.
- `AC-089`: Điểm Danh NV (Absence Toggle & Modal Confirmation):
  1. Activating the "Vắng" toggle opens a confirmation modal requiring selection of "Có phép" or "Không phép" with an optional reason note.
  2. If the employee already has Check-in or Check-out recorded that day, the modal displays reminder warning `DD-03` (*"Lưu ý: Nhân viên đã check-in/check-out lúc {giờ}"*).
  3. While the modal is open, that row's Check-in/Check-out buttons are disabled; cancelling reverts the toggle to off; saving updates absence status and increments the KPI counter.
- `AC-090`: Điểm Danh NV (Inline Attendance Notes with Blur Auto-Save):
  1. Clicking the pencil icon in the "Ghi chú" column activates an inline text field.
  2. Clicking outside the field (blur) automatically commits the note to state without requiring a separate save button; empty notes are valid and accepted without error.
- `AC-091`: Điểm Danh NV (Multi-Role Badges & Read-Only Staff Profile Modal):
  1. Employees holding multiple roles render all applicable role badges simultaneously (e.g. Admin, Quản Lý, Giáo Viên, Nhân Viên).
  2. Clicking an employee's nickname opens a read-only profile modal displaying "Thông tin Quản Trị" for Admin or "Thông tin người dùng" with assigned class links for Managers/Teachers; empty fields display `"Chưa có {trường}"`.
- `AC-092`: Điểm Danh NV (Search-Responsive KPI Visibility & Nickname Sorting):
  1. Entering a query in the search input hides the top 3 KPI summary cards to prevent data confusion, while the footer shows `"Tổng: N"`.
  2. Clicking the sort icon beside the "Nhân viên" header alternates nickname ordering between A $\rightarrow$ Z and Z $\rightarrow$ A.
- `AC-093`: Sổ Tay PH (Navigation Placement & Dashboard Mounting):
  1. "Sổ tay PH" is positioned in the NHÀ TRƯỜNG sidebar navigation strictly after "Điểm danh NV" and before "Lịch sự kiện".
  2. Navigating to `/[schoolCode]/school/handbook` loads the dashboard with status filter, search bar, "+ Thêm danh mục", accordion tree, and article detail panel.
- `AC-094`: Sổ Tay PH (2-Tier Hierarchy & Accordion Single-Active Expansion):
  1. Root categories allow creating sub-categories with read-only parent name in modal; sub-categories strictly omit "+ Thêm danh mục" and allow only "+ Thêm bài viết" (`BR01`, `K049`).
  2. In any sibling group, expanding one category collapses any previously open sibling category (`BR02`, `K050`).
- `AC-095`: Sổ Tay PH (Drag-and-Drop Sibling Reordering & Contextual Menu Actions):
  1. Sub-categories and articles render drag handles (☰) allowing reordering within parent; root categories maintain fixed administrative order (`BR04`, `K053`).
  2. Action menu (`•••`) allows 1-click status transitions: "Xuất bản bài viết" on drafts and "Ẩn bài viết" on published articles (`BR05`, `BR12`).
- `AC-096`: Sổ Tay PH (Article-Centric Pruning Filter & Search):
  1. Keyword search and status filter match strictly against article titles, pruning non-matching category branches from the view (`BR10`, `K051`).
  2. Matching branches auto-expand; if no articles match, the system renders empty state `ST-03` ("Hiện chưa có danh mục hoặc bài viết nào...").
- `AC-097`: Sổ Tay PH (Cascading Deletion Guardrails):
  1. Deleting a category opens confirmation modal `ST-01` warning that all child sub-categories and articles will be wiped (`BR09`).
  2. Deleting an article opens confirmation modal `ST-02` with simple leaf confirmation.
- `AC-098`: Góp Ý (Navigation Placement & Dashboard Mounting):
  1. "Góp ý" is positioned in the NHÀ TRƯỜNG sidebar navigation strictly after "Sổ tay PH" and before "Lịch sự kiện".
  2. Navigating to `/[schoolCode]/school/feedback` loads the dashboard with 4 KPI status cards, school year dropdown, search/filter bar, and feedback ticket table.
- `AC-099`: Góp Ý (Dual-Function Status Cards & Filter Reset):
  1. Top 4 cards display aggregate counts for the active school year across all 4 statuses (`Yêu cầu mới`, `Đang xử lý`, `Hoàn tất`, `Mở lại`).
  2. Clicking a card filters the table roster to that status and reveals "Xóa bộ lọc"; clicking "Xóa bộ lọc" clears the filter while preserving global counts.
- `AC-100`: Góp Ý (Inline Priority Triage & Category Classification):
  1. Feedback items categorize under 8 fixed domains and 4 color-coded priority levels.
  2. Changing priority or assignee via inline dropdown applies immediately without confirmation dialogs.
- `AC-101`: Góp Ý (Reactive Turn-Taking Discussion & Closure Modal GY-01):
  1. Discussion composer button remains disabled until non-whitespace text is entered; submitting an admin reply flips `waitingFor` to `parent`.
  2. Clicking "Đóng góp ý" triggers confirmation modal `GY-01`; confirming transitions ticket to `Hoàn tất`.
- `AC-102`: Góp Ý (Parent-Only Invariant & Read-Only Profiles):
  1. Web Admin portal has no "Tạo góp ý" button; the `+` icon on `Yêu cầu mới` is strictly an indicator/filter toggle (`K054`).
  2. Clicking student or parent names opens read-only modals with missing fields rendering `"Chưa có {trường}"`.
- `AC-103`: Năm Học (Navigation Placement & Dashboard Mounting):
  1. "Năm học" is positioned in the NHÀ TRƯỜNG sidebar navigation strictly after "Lịch sự kiện".
  2. Navigating to `/[schoolCode]/school/academic-year` (or legacy `/school/season`) loads the directory with search bar, "Tạo năm học" button, academic year table roster, and footer counter "Tổng: N".
- `AC-104`: Năm Học (Automated Current Year Evaluation & Styling):
  1. Any academic year record whose date interval encompasses today's date (`today >= startDate && today <= endDate`) automatically displays the "Hiện tại" badge chip with bold blue typography (`#0070CE`).
  2. The create/edit modal strictly omits any manual "Hiện tại" checkbox or radio button (`K059`).
- `AC-105`: Năm Học (Minimalist 3-Field Create Modal & Submit Gating):
  1. Clicking "Tạo năm học" triggers modal `MODAL-AY-FORM` displaying exactly 3 input fields (`Tên năm học`, `Ngày bắt đầu`, `Ngày kết thúc`).
  2. The submit action button ("Thêm") remains disabled until all 3 fields are non-empty and `endDate >= startDate` (`VR-AY-01`, `VR-AY-02`).
- `AC-106`: Năm Học (In-Place Edit Modal & Mutation):
  1. Clicking the Edit button (`faEdit`) on an existing row opens the modal pre-filled with the record's title, start date, and end date.
  2. Saving updates the record in-place; if new dates encapsulate today, the "Hiện tại" badge updates immediately.
- `AC-107`: Năm Học (Instant Client-Side Search Filtering):
  1. Entering a query into the "Tìm kiếm năm học" input immediately filters table rows case- and diacritic-insensitively.
  2. The table footer reflects matching row count (`"Tổng: N"`); if no records match, the table displays an empty state with `"Tổng: 0"`.
- `AC-108`: Năm Học (Permanent Omission of Delete Operations):
  1. Across the entire Academic Year module, no delete button, trash can icon, or deletion confirmation modal exists (`BR03`, `K060`).
  2. Table row action column strictly contains only the Edit action to ensure zero orphaned foreign key records across attendance, fees, and gradebooks.

### Phân hệ 4.7: Nhà Trường — Lưu Trữ (School Archive & Cold Storage Roster)

#### Functional Requirements (Lưu Trữ)
- `FR-ARC-001`: The system MUST provide an administrative Archive dashboard at canonical route `/[schoolCode]/school/archive` (with legacy compatibility alias `/[schoolCode]/setting/kid/archived`), positioned in the sidebar navigation under `NHÀ TRƯỜNG` strictly after "Năm học", displaying a top toolbar, responsive archive table, and footer counter "Tổng: N".
- `FR-ARC-002`: The system MUST enforce **Unidirectional Cold-Storage Inflow** (`BR01`, `K064`). The module strictly receives records from the Học Sinh module upon withdrawal. Direct creation or manual record addition within Lưu Trữ is prohibited.
- `FR-ARC-003`: The system MUST support **Flexible Archive Context Nullability** (`BR02`, `K067`). Each record tracks `archiveDate`, `archivedBy`, and `archiveReason`. If any or all of these fields are missing in legacy records, the table cell MUST render clean blank/empty space without breaking layout or triggering errors.
- `FR-ARC-004`: The system MUST provide an **Archived Student Detail Modal** (`BR03`). Clicking a student's name MUST open their profile with:
  1. A yellow warning banner at the top: `🔒 Học sinh đã được lưu trữ`.
  2. All standard student demographic, guardian, and academic fields displayed in read-only mode.
  3. Archive metadata section at the bottom displaying `Lý do lưu trữ`, `Ngày lưu trữ`, and `Ghi chú lưu trữ` (rendering "Chưa có ghi chú" if blank). The "Lưu trữ bởi" field is omitted from this modal per legacy specification.
- `FR-ARC-005`: The system MUST provide a **Staff Operator Quick View Modal** (`BR02`). Clicking the name in the "Lưu trữ bởi" column MUST open the staff member's administrative information modal (name, role, email, phone, avatar).
- `FR-ARC-006`: The system MUST implement **Dual-Action Modals with Distinct Visual Cues** (`BR04`, `BR05`, `BR06`):
  1. **Phục hồi (Restore):** Triggered by the restore icon (`faBoxOpen` / `faTrashRestore`). Opens confirmation modal `LT-01` ("Vui lòng xác nhận phục hồi học sinh {tên học sinh}!") with friendly illustration and "Xác nhận" / "Hủy bỏ" buttons.
  2. **Xóa (Permanent Delete):** Triggered by the trash icon (`faTrash`). Opens confirmation modal `LT-02` ("Vui lòng xác nhận xoá học sinh {tên học sinh}!") with prominent red hazard warning illustration and confirmation gating (`K065`).
- `FR-ARC-007`: The system MUST implement **Class Continuity on Restoration** (`BR05`, `K013`, `K066`). Restoring a student re-enacts active status in the Học Sinh module:
  - If the student's `formerClassId` is active in the current academic year, re-enroll into `formerClassId` with success toast.
  - If `formerClassId` is closed, inactive, or belongs to a past academic year, restore with `classId = null` ("Chưa xếp lớp") and emit an amber system alert prompting class reassignment.
- `FR-ARC-008`: The system MUST support **Real-Time Client-Side Search & Sorting** (`BR08`, `BR10`). Searching filters dynamically by student name, nickname, or code without page reload. Clicking the sort icon next to the "Học sinh" column header toggles A→Z and Z→A sorting.
- `FR-ARC-009`: The system MUST support **Advanced Monthly Period Filtering & Export** (`BR07`, `BR09`). The extended filter dropdown allows selecting a specific month/year (`YYYY-MM`) to filter by archive date. The "Xuất dữ liệu" action exports filtered records.

#### Acceptance Criteria (Lưu Trữ)
- `AC-109`: Lưu Trữ (Cold Storage Directory & Canonical Navigation):
  1. "Lưu trữ" is positioned in the NHÀ TRƯỜNG sidebar navigation strictly after "Năm học" (`/school/academic-year`) with icon `faArchive`.
  2. Navigating to `/[schoolCode]/school/archive` (or legacy `/setting/kid/archived`) renders the archive cockpit with search bar, month filter, export button, archive table roster, and footer counter "Tổng: N".
- `AC-110`: Lưu Trữ (Unidirectional Inflow & Direct Creation Omission):
  1. The archive dashboard strictly contains zero "Thêm học sinh" or "Tạo học sinh" buttons (`BR01`, `K064`).
  2. Archived students populate exclusively through student withdrawal actions executed in the Học Sinh module.
- `AC-111`: Lưu Trữ (Tolerant Context Metadata & Table Roster):
  1. Table displays columns: STT, Mã HS, Họ và tên, Lớp cũ, Ngày sinh, Giới tính, Lý do lưu trữ, Ngày lưu trữ, Lưu trữ bởi, and Hành động (`BR02`).
  2. In legacy records where `archiveDate`, `archivedBy`, or `archiveReason` are missing, table cells render clean empty spaces without interface errors (`K067`).
- `AC-112`: Lưu Trữ (Archived Student Detail Modal & Warning Banner):
  1. Clicking a student's name opens their read-only profile modal.
  2. The modal header features an authoritative yellow warning banner `🔒 Học sinh đã được lưu trữ` (`BR03`).
  3. The bottom section presents `Lý do lưu trữ`, `Ngày lưu trữ`, and `Ghi chú lưu trữ` (rendering "Chưa có ghi chú" if blank), omitting the "Lưu trữ bởi" field.
- `AC-113`: Lưu Trữ (Staff Operator Quick View Modal):
  1. Clicking the staff name in the "Lưu trữ bởi" column opens the staff member's administrative contact modal displaying their name, role, email, and phone (`BR02`).
- `AC-114`: Lưu Trữ (Restoration & Context-Aware Class Continuity):
  1. Clicking the Restore icon triggers modal `LT-01` ("Vui lòng xác nhận phục hồi học sinh {tên học sinh}!").
  2. Confirming restores the student: if `formerClassId` is active, re-enrols into that class; if closed/inactive, restores as "Chưa xếp lớp" with an amber alert (`K013`, `K066`).
- `AC-115`: Lưu Trữ (Guarded Permanent Deletion & Red Hazard Confirmation):
  1. Clicking the Trash icon triggers modal `LT-02` ("Vui lòng xác nhận xoá học sinh {tên học sinh}!") with distinct red hazard styling (`BR06`, `K065`).
  2. Confirming permanently erases the student record from the database.
- `AC-116`: Lưu Trữ (Real-Time Search, Monthly Period Scoping & Data Export):
  1. Typing in the search input instantly filters the roster by name, nickname, or code without page reloads.
  2. Selecting a month in the extended filter scopes records by `archiveDate` (`YYYY-MM`).
  3. Clicking the sort arrow on "Học sinh" alternates ordering between A→Z and Z→A. Clicking "Xuất dữ liệu" initiates file export (`BR07`, `BR08`, `BR09`).

### Phân hệ 5.1: Cấu Hình — Trường (School Profile & Operational Baseline Configuration)

#### Functional Requirements (Cấu Hình — Trường)
- `FR-SCH-INFO-001`: The system MUST render the primary School Profile overview dashboard at `/[schoolCode]/setting/school` (with legacy compatibility alias `/[schoolCode]/school/info/`), positioned first under the `CẤU HÌNH` sidebar menu group before "Học phí", using icon `faSchool`. The page MUST display full institutional master data in read-only cards, with an explicit Edit icon (`icon_edit_square`) at the top right triggering edit mode (`K069`, `K075`).
- `FR-SCH-INFO-002`: The system MUST display Educational Stages (e.g. `02-TH`, `03-THCS`), Attendance Mode (`Điểm danh 2 buổi`), and Session Windows (`Sáng: 07:00 - 11:30`, `Chiều: 13:30 - 17:00`) as immutable read-only records (`BR05`, `BR14`). Descriptive system notices MUST indicate "Liên hệ Eco School để thay đổi" and "Hiện Eco School chưa hỗ trợ thay đổi thông tin này".
- `FR-SCH-INFO-003`: The system MUST provide an edit screen (`/[schoolCode]/setting/school/edit`) featuring two distinct routed tabs: "Thông tin trường" (`?tab=info`) and "Giờ hoạt động" (`?tab=weekdays`, aliasing `/setting/school/weekdays`). Switching tabs MUST preserve route synchronization and enforce dirty form departure guards (`BR06`, `K070`).
- `FR-SCH-INFO-004`: In tab "Thông tin trường", the system MUST provide input fields for Tên trường (`*`), Tên ngắn gọn, Địa chỉ (`*`), Website, Số điện thoại, Email (`*`), Khẩu hiệu, Thông tin liên hệ, Ngôn ngữ thông báo mặc định (Tiếng Việt / Tiếng Anh dropdown), and Logo upload (`BR01`, `BR04`). Leaving Tên trường, Địa chỉ, or Email empty MUST trigger inline validation error `TR-01` ("Vui lòng nhập tên trường", etc.) and visual red border upon field blur (`BR02`). Form submission MUST be blocked until all mandatory fields are valid (`BR03`).
- `FR-SCH-INFO-005`: In tab "Giờ hoạt động", the system MUST render a dedicated operating hours form for Monday through Saturday (`BR07`, `BR09`, `K071`). Each day row MUST feature a green day label and opening/closing time pickers constrained to fixed 5-minute increments (`06:00` to `18:00`) (`BR08`, `K072`). Sunday MUST render as a static non-operational grey indicator without input pickers (`K073`). Clicking "Cập nhật" on this sub-form MUST save operating hours independently of attendance rules.
- `FR-SCH-INFO-006`: The system MUST provide a late arrival toggle switch (`tomia-switch`) paired with a threshold dropdown (5 to 60 minutes, step 5) (`BR10`). When the toggle is disabled, the dropdown MUST transition to a disabled/dimmed state while preserving its previously configured numeric threshold.
- `FR-SCH-INFO-007`: The system MUST provide a late departure toggle switch paired with a descriptive notice ("Học sinh ra về sau 15 phút so với giờ hoạt động sẽ tính là về muộn") (`BR11`). When enabled, the notice MUST render an active link "Cài đặt phí trông học sinh về muộn tại đây" navigating directly to Tuition Fee Settings (`/[schoolCode]/setting/fee`) (`K074`). When disabled, the fee link MUST be hidden while preserving the descriptive text. Clicking "Cập nhật" on this sub-form MUST commit attendance threshold rules independently.
- `FR-SCH-INFO-008`: If an administrator modifies any field in either tab and attempts to navigate away (switching tabs, clicking sidebar links, or browser back), the system MUST intercept navigation and present confirmation modal `TR-02`: *"Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!"* with "Hủy bỏ" (remain on form) and "Xác nhận rời khỏi" (discard and proceed) actions (`BR12`).

#### Acceptance Criteria (Cấu Hình — Trường)
- `AC-117`: Trường (Overview Dashboard & Canonical Navigation):
  1. "Trường" is positioned first in the `CẤU HÌNH` sidebar menu group before "Học phí" (`/setting/fee`) with icon `faSchool`.
  2. Navigating to `/[schoolCode]/setting/school` (or legacy `/school/info`) renders the institutional overview dashboard displaying school name, address, contact details, educational stages, operating hours, and attendance mode in read-only mode (`K069`, `K075`).
- `AC-118`: Trường (Explicit Edit Mode Transition):
  1. The overview screen provides an explicit Edit button (`icon_edit_square`) at the top right.
  2. Clicking the Edit icon transitions cleanly to `/setting/school/edit?tab=info` without direct inline editing on the dashboard.
- `AC-119`: Trường (Two-Tab Routed Navigation):
  1. The edit screen provides two tabs: "Thông tin trường" (`?tab=info`) and "Giờ hoạt động" (`?tab=weekdays`, aliasing `/setting/school/weekdays`).
  2. Switching tabs synchronizes the URL query parameter and preserves independent form states (`K070`).
- `AC-120`: Trường (Mandatory Identity Fields & Real-Time Blur Validation TR-01):
  1. Basic info form marks Tên trường, Địa chỉ, and Email as mandatory (`*`).
  2. Leaving any mandatory field empty triggers inline error `TR-01` ("Vui lòng nhập tên trường", etc.) and a red border immediately upon field blur (`BR01`, `BR02`).
  3. Form submission is gated and disabled until all mandatory fields are valid (`BR03`).
- `AC-121`: Trường (5-Minute Stepped Weekly Operating Hours & Static Sunday Rest):
  1. In "Giờ hoạt động", Monday through Saturday display opening and closing time pickers selectable from discrete 5-minute intervals between `06:00` and `18:00` (`BR08`, `K072`).
  2. Sunday renders as a static grey indicator ("Chủ nhật: Không hoạt động") without input controls (`BR07`, `K073`).
  3. Sub-form has an independent "Cập nhật" button that saves operating hours without submitting attendance rules (`K071`).
- `AC-122`: Trường (Late Arrival Toggle & Threshold Dropdown):
  1. "Đến muộn" toggle controls the grace period dropdown (5 to 60 minutes, step 5).
  2. Turning off the toggle dims/disables the dropdown while retaining the configured threshold value (`BR10`).
- `AC-123`: Trường (Late Departure Toggle & Fee Settings Cross-Link):
  1. "Về muộn" toggle controls the display of the active link "Cài đặt phí trông học sinh về muộn tại đây" navigating to `/setting/fee` (`BR11`, `K074`).
  2. Sub-form has an independent "Cập nhật" button that saves attendance rules without submitting operating hours (`K071`).
- `AC-124`: Trường (Unsaved Changes Navigation Interception Guard TR-02):
  1. Modifying any field in either tab flags the form as dirty.
  2. Attempting to switch tabs or click any external navigation link intercepts the route and presents modal `TR-02`: *"Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!"* (`BR12`).
  3. Clicking "Hủy bỏ" retains edits; clicking "Xác nhận rời khỏi" discards uncommitted edits and completes navigation.

### Phân hệ 5.2: Cấu Hình — Tài Khoản (User & Student Account Management and Access Control)

#### Functional Requirements (Cấu Hình — Tài Khoản)
- `FR-ACC-001`: The system MUST render the primary Account Management sub-module with two routed tabs: "Người Dùng" (`/[schoolCode]/setting/users`) and "Học Sinh" (`/[schoolCode]/school/kid/accounts` or `/[schoolCode]/setting/users?tab=students`). The module MUST be positioned in the sidebar menu group `CẤU HÌNH` strictly after "Học phí" and before "Thông báo", using icon `faUserShield` (`K076`).
- `FR-ACC-002`: In tab "Người Dùng", the table roster MUST display: STT, Họ và tên (with linked students for Parent roles), Email, Số điện thoại, Vai trò (multi-badge pills), Trạng thái (toggle switch), and Hành động. Default status filter MUST be `"Đang hoạt động"` (`BR16`).
- `FR-ACC-003`: The system MUST permanently disable the `Admin` role checkbox on the user creation form (`BR04`). Accounts holding the `Admin` role MUST omit Edit (pencil) and Delete (trash) icons in the action column, exposing only the View (eye) inspection action (`BR03`, `K077`).
- `FR-ACC-004`: Accounts marked with badge `CSDL Sở` MUST be protected:  
  1. On the Edit form, a yellow advisory banner MUST be displayed, and the "Họ và tên" input MUST be disabled/locked (`BR05`).  
  2. Clicking the row-level "Trạng thái" toggle switch MUST be rejected by the system, displaying red error banner `TK-03`: *"Không thể cập nhật với đối tượng được đồng bộ từ CSDL ngành"*, leaving status unchanged (`BR06`, `K078`).
- `FR-ACC-005`: Toggling "Trạng thái" on the table roster MUST execute immediately without a modal, displaying auto-dismissing banner `TK-06` (`BR06`). Submitting changes inside the Edit form MUST mandate affirmative confirmation modal `TK-05`: *"Vui lòng xác nhận cập nhật tài khoản này!"* before persisting changes (`BR07`, `K079`).
- `FR-ACC-006`: In the Edit form, Email MUST be displayed as read-only text with a "Thay đổi" button opening modal "Thay đổi email" (`BR08`). Password modifications MUST be decoupled into a dedicated sub-view under `BẢO MẬT` displaying explicit session revocation warnings and dual password inputs with visibility toggles (`BR09`, `K080`).
- `FR-ACC-007`: Dynamic Role-Dependent Form Visibility:  
  1. Checking role "Nhân viên" MUST dynamically reveal "Chức năng nhân viên" (4 checkboxes: Điểm danh, Kế toán, Thông báo, Chăm sóc/Y tế) with tooltips, requiring at least 1 selection (inline error `TK-02`), plus "Mã nhân viên" (`BR10`).  
  2. Checking role "Quản lý" MUST dynamically reveal "Lớp phụ trách" selector (`BR12`).  
  3. Checking role "Nhân viên" or "Giáo viên" MUST dynamically reveal collapsible "Thông tin bổ sung" (CCCD, Chức vụ, Ngày vào làm, Bằng cấp, Kỹ năng, Bộ phận) (`BR13`, `K081`).
- `FR-ACC-008`: Clicking the Delete icon on a non-Admin account MUST open confirmation modal `TK-04`: *"Vui lòng xác nhận xoá tài khoản [Họ và tên]!"* with "Hủy bỏ" and "Xác nhận" buttons (`BR15`).
- `FR-ACC-009`: In tab "Học Sinh", the system MUST display enrolled students with columns: STT, Mã học sinh, Họ và tên, Lớp, Tên tài khoản, Trạng thái, Hành động. Students without an account MUST display `+` (create modal); students with an account MUST display a pencil icon (edit modal) and their username. Username input MUST validate alphanumeric/email characters (`/^[a-zA-Z0-9_\-\.]+$/`) accompanied by green helper text (`BR19`, `BR20`, `BR21`, `K082`).

#### Acceptance Criteria (Cấu Hình — Tài Khoản)
- `AC-125`: Tài Khoản (Canonical Navigation & Sidebar Placement):
  1. "Tài khoản" is positioned strictly after "Học phí" (`/setting/fee`) and before "Thông báo" in the `CẤU HÌNH` sidebar menu group with icon `faUserShield` (`K076`).
  2. Navigating to `/[schoolCode]/setting/users` renders the User Accounts roster by default with search, role filters, and status filters.
- `AC-126`: Tài Khoản (Multi-Role User Directory Roster & Default Active Filter):
  1. Table displays STT, Họ và tên, Email, Số điện thoại, Vai trò (multi-badge pills), Trạng thái, and Hành động (`BR16`).
  2. For Parent accounts, linked student names are rendered beneath the parent's full name.
  3. Default status filter is preset to "Đang hoạt động" (`active`).
- `AC-127`: Tài Khoản (Super-Admin Role Privilege Protection):
  1. On the user creation form, the "Admin" role checkbox is permanently disabled and cannot be toggled (`BR04`).
  2. Table rows for Admin accounts omit Edit and Delete action icons, providing exclusively the View (eye) action (`BR03`, `K077`).
- `AC-128`: Tài Khoản (CSDL Sở National Database Synchronization Safeguards):
  1. In the edit form for CSDL Sở accounts, a yellow warning banner is displayed and the "Họ và tên" input is disabled (`BR05`).
  2. Clicking the status toggle switch on a CSDL Sở account row is immediately blocked, displaying error banner `TK-03` ("Không thể cập nhật với đối tượng được đồng bộ từ CSDL ngành") while keeping status unchanged (`BR06`, `K078`).
- `AC-129`: Tài Khoản (Asymmetric Status Confirmation Mechanics):
  1. Toggling user status directly on the roster applies changes immediately and displays toast notification `TK-06` without opening a modal (`BR06`).
  2. Clicking "Cập nhật" inside the full edit form intercepts submission and presents confirmation modal `TK-05` ("Vui lòng xác nhận cập nhật tài khoản này!") (`BR07`, `K079`).
- `AC-130`: Tài Khoản (Decoupled Email & Password Security Workflows):
  1. In the Edit form, the email field is read-only with a "Thay đổi" button opening a dedicated email change modal (`BR08`).
  2. Modifying password routes to a dedicated security view (`/password`) under `BẢO MẬT` displaying session revocation advisories and dual password inputs (`BR09`, `K080`).
- `AC-131`: Tài Khoản (Dynamic Role-Dependent Fields & Validation TK-02):
  1. Selecting role "Nhân viên" dynamically reveals Staff Functions (Điểm danh, Kế toán, Thông báo, Chăm sóc/Y tế) and Staff Code (`BR10`). Deselecting all functions triggers inline error `TK-02` ("Vui lòng chọn chức năng").
  2. Selecting role "Quản lý" dynamically reveals the Assigned Classes selector (`BR12`).
  3. Selecting "Nhân viên" or "Giáo viên" reveals collapsible "Thông tin bổ sung" (`BR13`, `K081`).
- `AC-132`: Tài Khoản (Guarded User Deletion Confirmation TK-04):
  1. Clicking the Delete icon on an eligible non-Admin account presents confirmation modal `TK-04`: *"Vui lòng xác nhận xoá tài khoản [Họ và tên]!"* (`BR15`).
  2. Confirming removes the user from the roster and emits a success toast.
- `AC-133`: Tài Khoản (Student Login Account Management & Regex Validation):
  1. Tab "Học Sinh" lists enrolled students with username status and action controls (`K082`).
  2. Students without accounts show a `+` create icon; students with accounts show their username and an edit pencil icon (`BR19`, `BR20`).
  3. Username creation validates alphanumeric and email characters (`/^[a-zA-Z0-9_\-\.]+$/`), accompanied by a green helper message.

### Phân hệ 5.3: Cấu Hình — Nhận Diện (Face Recognition Management & Registration Authority)

#### Functional Requirements (Cấu Hình — Nhận Diện)
- `FR-REC-001`: The system MUST mount the Face Recognition sub-module at canonical route `/[schoolCode]/setting/face-recognition`, positioned fourth in sidebar menu group `CẤU HÌNH` strictly following "Tài khoản" and using icon `faCamera` (`K083`).
- `FR-REC-002`: The system MUST render the student biometric roster displaying STT, Mã học sinh, Họ và tên (with avatar/nickname), Lớp (with class link), Ảnh nhận diện (thumbnail / `-`), Ngày ghi nhận (`DD/MM/YYYY` / `-`), and dynamic action buttons, with reactive `Tổng: N` footer and pagination controls (`BR01`, `BR09`).
- `FR-REC-003`: The system MUST provide multi-factor filters evaluating concurrently with AND logic across text search (name/code), class selection, and two-state registration status (`"Đã đăng ký nhận diện"` vs `"Chưa đăng ký nhận diện"`) (`BR07`, `BR08`).
- `FR-REC-004`: The system MUST dynamically render the Action column based on registration state: single circular `+` button with tooltip "Đăng ký ảnh nhận diện" for unregistered pupils; edit (pencil) and delete (`X`) buttons for registered pupils (`BR02`, `K087`).
- `FR-REC-005`: Clicking `+` MUST open modal "Đăng ký ảnh nhận diện" displaying 4 read-only student demographic fields (Biệt danh, Giới tính, Ngày sinh, Lớp học link) (`BR03`, `K085`), with the submit button strictly disabled until an image file is uploaded (`BR04`, `K086`).
- `FR-REC-006`: Clicking Edit MUST open modal "Chỉnh sửa ảnh nhận diện" pre-rendering the student's existing photo (`BR05`), keeping submit button disabled until a replacement image file is selected (`BR04`, `K086`).
- `FR-REC-007`: Clicking Delete MUST present an affirmative confirmation dialog explicitly articulating the student's full name: *"Vui lòng xác nhận xóa thông tin nhận diện của học sinh {Họ tên}"* (`BR06`, `K088`). Dismissing cancels with zero data loss; confirming clears biometric data and reverts row to unregistered status.

#### Acceptance Criteria (Cấu Hình — Nhận Diện)
- `AC-134`: Nhận Diện (Canonical Navigation & Sidebar Placement):
  1. Positioned fourth under `CẤU HÌNH` strictly after "Tài khoản" at `/[schoolCode]/setting/face-recognition` with icon `faCamera` (`K083`).
  2. Access restricted to School Administrators (`admin`).
- `AC-135`: Nhận Diện (State-Driven Roster Display & Action Duality):
  1. Unregistered students display `-` in Photo and Date columns, and a single circular `+` button in Action column (`BR01`, `BR02`).
  2. Registered students display a valid photo thumbnail, formatted date `DD/MM/YYYY`, and pencil (Edit) + `X` (Delete) buttons (`BR01`, `BR02`, `K087`).
- `AC-136`: Nhận Diện (Multi-Factor Conjunction Filtering & Aggregate Summary):
  1. Searching by student name or code, filtering by class, and filtering by registration status combine concurrently with AND logic (`BR08`).
  2. Dropdown "Chọn trạng thái nhận diện" exposes "Đã đăng ký nhận diện" and "Chưa đăng ký nhận diện" (`BR07`).
  3. "Tổng: N" accurately reflects matching student count (`BR09`).
- `AC-137`: Nhận Diện (Biometric Registration Workflow & Read-Only Demographics):
  1. Registration modal presents read-only Nickname, Gender, DOB, and clickable Class link (`BR03`, `K085`).
  2. Submit button is disabled by default and enables immediately once an image file is selected via "UPLOAD FILE" (`BR04`, `K086`).
- `AC-138`: Nhận Diện (Biometric Edit Workflow & Mandatory Replacement Selection):
  1. Edit modal pre-renders the student's current face photo in the preview box (`BR05`).
  2. Submit button is strictly disabled until a new image file is chosen; retaining current photo does not enable save (`BR04`, `K086`).
- `AC-139`: Nhận Diện (Guarded Deletion with Explicit Student Name Confirmation):
  1. Clicking Delete triggers confirmation dialog displaying: *"Vui lòng xác nhận xóa thông tin nhận diện của học sinh {Họ tên}"* (`BR06`, `K088`).
  2. Clicking "Hủy bỏ" preserves data; clicking "Xác nhận" clears biometric data and reverts row to unregistered status.

### Phân hệ 5.4: Cấu Hình — Tính Năng (Feature Flags & Academic Term Configuration)

#### Functional Requirements (Cấu Hình — Tính Năng)
- `FR-FEAT-001`: The system MUST mount the Feature Flags sub-module across two routed endpoints: Tab Hoạt Động at `/[schoolCode]/setting/activity/` (default) and Tab Học Kỳ at `/[schoolCode]/setting/period/`, with an alias at `/[schoolCode]/setting/features` redirecting to `/setting/activity`. It MUST be positioned fifth under sidebar group `CẤU HÌNH` strictly following "Nhận diện" using icon `faSlidersH` / `faToggleOn` (`BR01`, `K089`).
- `FR-FEAT-002`: Tab Hoạt Động MUST provide two decoupled switches: "Bình luận" (`allowComments`) and "Duyệt bình luận" (`requireCommentModeration`). Turning OFF "Bình luận" MUST NOT disable, hide, or alter "Duyệt bình luận"; both toggles remain fully independent (`BR02`, `K090`).
- `FR-FEAT-003`: The "Cập nhật" button on Tab Hoạt Động MUST be disabled by default (`disabled: true`) and MUST enable if and only if at least one toggle diverges from its saved state. Successful save MUST update the persisted baseline and disable the button again (`BR03`, `K091`).
- `FR-FEAT-004`: Tab Học Kỳ MUST provide an Academic Year selector dropdown loading from school academic years (`school/season`), defaulting to the active year labeled `(Hiện tại)`. The system MUST enforce a strict ceiling of 2 terms per school year by disabling the "+ Thêm học kỳ" button when 2 terms exist (`BR04`, `BR05`, `K092`).
- `FR-FEAT-005`: Term creation and modification MUST operate via pure inline table row editing without modal dialogs, displaying Term Name, Start Date, End Date, Notes, and green checkmark (Save) and gray X (Cancel) buttons. Editing or adding one row MUST lock all other row edit actions and "+ Thêm học kỳ" (`BR06`, `BR07`, `BR08`, `K093`, `NFR01`, `NFR02`).
- `FR-FEAT-006`: Saved academic terms MUST omit deletion controls, rendering only the Edit pencil icon. Academic years with zero registered terms MUST render a dedicated `"Chưa có học kỳ"` empty state row (`BR09`, `BR10`, `K094`).

#### Acceptance Criteria (Cấu Hình — Tính Năng)
- `AC-140`: Tính Năng (Navigation Placement & Two-Route Architecture):
  1. Positioned fifth under `CẤU HÌNH` strictly after "Nhận diện" at `/[schoolCode]/setting/activity` with icon `faSlidersH` (`BR01`, `K089`).
  2. Tab navigation smoothly transitions between `/setting/activity` and `/setting/period`, and `/setting/features` redirects to `/setting/activity`.
- `AC-141`: Tính Năng (Decoupled Activity Comment Toggles):
  1. Turning OFF "Bình luận" leaves "Duyệt bình luận" fully interactive and intact (`BR02`, `K090`).
  2. State changes are tracked independently in Redux.
- `AC-142`: Tính Năng (Dirty-State Submit Invariant):
  1. "Cập nhật" button is disabled upon initial load (`BR03`, `K091`).
  2. Mutating either toggle enables "Cập nhật"; reverting to saved values disables it again.
  3. Clicking "Cập nhật" persists state and displays a confirmation toast.
- `AC-143`: Tính Năng (Academic Year Selection & Empty State):
  1. Dropdown defaults to the academic year with label `(Hiện tại)` (`BR04`).
  2. Selecting an academic year with 0 terms renders the `"Chưa có học kỳ"` row (`BR10`).
- `AC-144`: Tính Năng (Statutory Two-Term Ceiling):
  1. When an academic year contains 2 terms, "+ Thêm học kỳ" is strictly disabled (`BR05`, `K092`).
  2. When an academic year contains $< 2$ terms, "+ Thêm học kỳ" inserts a blank inline draft row and disables "+ Thêm học kỳ".
- `AC-145`: Tính Năng (Pure Inline Editing & Deletion Omission):
  1. Clicking Edit on a term turns the row into inline inputs and locks other rows (`BR06`, `BR07`).
  2. Clicking X cancels edits without mutation; saved rows render no delete icon (`BR09`, `K094`).

### Phân hệ 5.5: Cấu Hình — Thông Báo (Notification Configuration)

#### Functional Requirements (Cấu Hình — Thông Báo)
- `FR-NOTIF-001`: The system MUST mount the Notification Settings sub-module at canonical route `/[schoolCode]/setting/notification`, positioned sixth under sidebar group `CẤU HÌNH` strictly following "Tính năng", using icon `faBell` (`BR01`, `K104`).
- `FR-NOTIF-002`: The interface MUST render as a single monolithic configuration form spanning 5 distinct functional cards: (1) Điểm danh, (2) Sinh nhật, (3) Học phí, (4) Khác, and (5) Phụ huynh, governed by a unified sticky bottom action bar containing a single "Cập nhật" button (`BR01`, `K095`).
- `FR-NOTIF-003`: Clicking "Cập nhật" MUST trigger a modal confirmation dialog displaying: *"Vui lòng xác nhận thay đổi cấu hình thông báo của trường!"* with actions "Hủy bỏ" and "Xác nhận". Confirming commits all 5 sections simultaneously; canceling dismisses the dialog while retaining working form edits in the form (`BR02`, `K096`).
- `FR-NOTIF-004`: The top of the form MUST feature an informational institutional banner articulating 3 core operating policies: (1) School-wide scope across all classes, teachers, and parents, (2) Dual platform delivery across Web Portal and Mobile App, and (3) Calendar overflow fallback rolling reminders set on the 29th, 30th, or 31st to the final day of shorter months (`BR03`, `K097`).
- `FR-NOTIF-005`: Section 2 (Sinh nhật) MUST render a shared schedule configuration row (Day 1-31 and Time `HH:mm`, default `09:00`) with NO independent toggle switch. Sub-options for Teachers and School Admins MUST inherit this schedule when their respective toggles are active (`BR04`, `K098`).
- `FR-NOTIF-006`: The system MUST enforce multi-channel delivery asymmetry: only Section 4 items ("Hoạt động chờ duyệt" and "Nhật ký hằng ngày") provide dual Web/App and Email delivery toggles. All other notification events deliver exclusively via Web and Mobile App push notifications (`BR05`, `K099`).
- `FR-NOTIF-007`: Section 1 (Điểm danh) evening pickup alert (17:00) and Section 4 daily journal log reminder (20:00) MUST render fixed times in muted read-only inputs. Section 1 extracurricular attendance alert MUST provide an "Áp dụng cho" select dropdown offering "Tất cả các lớp" or specific class selection (`BR06`, `BR07`, `K100`, `K101`).
- `FR-NOTIF-008`: Section 3 (Học phí) overdue reminder MUST support directional timing ("Trước hạn đóng học phí" vs "Sau hạn đóng học phí") paired with an integer input (1-31 days). Section 5 (Phụ huynh) action keywords ("điểm danh", "hoạt động", "album", "hình/video") MUST render with distinct orange typography (`#EA580C`) (`BR08`, `BR10`, `K102`, `K103`).
- `FR-NOTIF-009`: All child labels across the interface MUST standardize student references on the primary term "học sinh" (with parenthesized "học sinh / trẻ" where applicable), eliminating legacy discrepancies (`BR09`).

#### Acceptance Criteria (Cấu Hình — Thông Báo)
- `AC-146`: Thông Báo (Navigation Placement & Monolithic Layout):
  1. Positioned sixth under `CẤU HÌNH` strictly following "Tính năng" at `/[schoolCode]/setting/notification` with icon `faBell` (`BR01`, `K104`).
  2. Renders all 5 functional sections inside a unified layout with a single bottom "Cập nhật" action button (`BR01`, `K095`).
- `AC-147`: Thông Báo (Guarded Confirmation Modal Submission):
  1. Clicking "Cập nhật" triggers confirmation dialog *"Vui lòng xác nhận thay đổi cấu hình thông báo của trường!"* (`BR02`, `K096`).
  2. Confirming commits all 5 sections and displays a success toast; canceling preserves working unsaved edits.
- `AC-148`: Thông Báo (Institutional Policy Banner & Calendar Overflow Rule):
  1. Renders top banner detailing school-wide applicability, multi-platform push, and calendar overflow fallback (`BR03`, `K097`).
  2. Reminder dates set to 31st automatically trigger on 28th/29th in February and 30th in 30-day months.
- `AC-149`: Thông Báo (Shared Birthday Schedule Inheritance):
  1. Schedule row contains Day and Time inputs without an independent toggle switch (`BR04`, `K098`).
  2. Toggling Teachers or Admins on inherits the shared schedule.
- `AC-150`: Thông Báo (Multi-Channel Delivery Asymmetry):
  1. "Hoạt động chờ duyệt" and "Nhật ký hằng ngày" render dual Web/App and Email toggle switches (`BR05`, `K099`).
  2. Other sections render only single event toggles.
- `AC-151`: Thông Báo (Read-Only Operational Hours & Extracurricular Scope):
  1. 17:00 pickup alert and 20:00 journal review times render in disabled/read-only styling (`BR06`, `K100`).
  2. Extracurricular attendance alert provides class scope selector dropdown (`BR07`, `K101`).
- `AC-152`: Thông Báo (Directional Tuition Schedule & Orange Typography):
  1. Tuition due alert provides dropdown for "Trước hạn" vs "Sau hạn" and day counter (1-31) (`BR08`, `K102`).
  2. Parent trigger keywords render in orange (`#EA580C`) typography (`BR10`, `K103`).
- `AC-153`: Thông Báo (Standardized Student Terminology):
  1. All student labels reference "học sinh" consistently (`BR09`).
- `AC-154`: Thông Báo (Dirty-State Invariant):
  1. "Cập nhật" button is disabled by default and enables when any toggle, time, or input diverges from saved baseline.

---

## 8. Out-of-Scope for Phase 1

- Provincial Department of Education external database synchronization ("CSDL Sở").
- Direct parent native mobile application source code (parents interact via existing mobile apps; this specification governs the school web operating portal).
- Automated bus GPS hardware IoT integration (attendance bus verification in Phase 1 relies on manual duty teacher confirmation).
- Complex payroll and staff salary computation (handled in dedicated future HR/Payroll modules).

---

## 9. Risk & Assumption Ledger

| Risk ID | Description | Impact | Mitigation Strategy |
|---|---|---|---|
| R-001 | High latency during bulk photo facial recognition | High | Offload face detection to an asynchronous background worker on Cloud Run; provide immediate UI response with progress indicator. |
| R-002 | Race conditions during simultaneous teacher check-ins | Medium | Implement optimistic updates on the client paired with atomic database transactions on the Laravel backend. |
| R-003 | Ambiguity in attendance refund disbursement method | Medium | Default to crediting next month's invoice line item; provide accountant override for immediate cash expense vouchers. |
