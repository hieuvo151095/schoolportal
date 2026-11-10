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
- `FR-FIN-017`: When a student matches multiple active discount programs simultaneously for the same fee item (e.g., class-wide policy and individual scholarship), the system MUST detect conflicts in the creation modal, notify the user, and automatically apply the program yielding the highest monetary deduction (`Math.max`), with student-specific policies taking priority on ties.
- `FR-FIN-018`: The system MUST ensure 100% data consistency for students and classes across the Student Directory (`studentSlice`), Discount Policies (`discountSlice`), and Tuition Invoices (`invoiceSlice`). In particular, enrolled students like Nguyễn Gia Huy (Lớp 10A1) and high school cohorts (Khối 10, 11, 12) MUST be selectable in the invoice creation wizard, and their highest valid discount policy (50% academic scholarship over 20% class discount) MUST be automatically applied when generating invoices for tuition.
- `FR-FIN-019`: The system MUST enforce a strict invariant that each student can benefit from only ONE discount policy per fee item. If an existing policy conflicts with a newly authored policy in `CreateDiscountPolicyModal`, the system MUST present an explicit conflict warning card and require the user to check a mandatory confirmation box to replace the previous policy for affected students.
- `FR-FIN-020`: In `CreateDiscountPolicyModal`, the "Nhóm áp dụng" (target group) selector MUST be placed before the fee selector. The system MUST calculate the mathematical set intersection of fees across all selected classes or students ($A \cap B$), displaying only fees that are mutually shared by all selected cohorts.
- `FR-FIN-021`: When generating tuition invoices by class (`scope === 'lop_hoc'`), the wizard MUST support multi-class selection (`classIds: string[]`) and automatically populate all registered fees applicable to the students (including transport, uniforms, and extracurriculars).
- `FR-FIN-022`: In the invoice itemization table, the discount column header MUST be titled "Giảm trừ" (without `%`). Unit prices MUST be formatted with dot thousand separators. The interface MUST support flexible toggling between percentage `[%]` and fixed cash `[đ]` deductions, with dynamic deduction calculation and instant feedback.
- `FR-FIN-023`: The system MUST establish attendance-linked meal refund calculations where excused absences in month $M$ generate automated credit lines on invoices for month $M+1$.
- `FR-FIN-024`: When recording manual invoice settlement via "Xác nhận thanh toán" (`ManualPaymentModal`), the payment method selector MUST strictly provide only 1 option: Cash (`tien_mat`). Online digital channels are reserved exclusively for automated gateway reconciliation.
- `FR-FIN-025`: The invoice detail view (`InvoiceDetailView`) and print engine MUST strictly conform to the official enterprise print template **"PHIẾU BÁO THU TIỀN"** (ADR-037):
  1. Title & Header: Centered uppercase title **PHIẾU BÁO THU TIỀN** with invoice number; ECO Brand Logo on the left; VietQR code on the right with *"Quét mã QR để thanh toán"*.
  2. Student & Institution Metadata: Clean single-line entries for school name, address, student name, student ID, class, and billing cycle.
  3. 7-Column Table: `STT`, `Nội dung`, `ĐVT`, `Số tiền (VNĐ)`, `Số lượng`, `Khấu trừ / Miễn giảm`, `Thành tiền (VNĐ)`, ending with a bold `Tổng cộng` row spanning columns 1-6.
  4. Official Notes: Banking app QR scan instructions; ECO Me deferred payment notice; hotline 1900 9005.
  5. Tripartite Signature Block: Right-aligned date `Ngày ... tháng ... năm ...`, and 3 signature columns: `Kế toán`, `Thủ quỹ`, `Hiệu trưởng`.
  6. Print Isolation: Isolated A4 portrait styling (`8mm 12mm` margins) completely hiding navigation bars, toolbars, and web status panels (`.no-print`, `.screen-only`), outputting strictly 1 page.

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
- `FR-SCH-036`: The system MUST require modal confirmation prior to closing a ticket (`Đóng góp ý`) to transition status to `Hoàn tất`.
- `FR-SCH-037`: The system MUST provide a school event calendar (`/school/calendar/`) supporting 3 synchronized view modes: `Năm` (12-month grid), `Tháng` (1-month grid), and `Sự kiện` (chronological list).
- `FR-SCH-038`: The system MUST color-code events across 3 categories: `Ngày nghỉ` (pink/red), `Sự kiện nội bộ` (cyan), `Sự kiện có mời phụ huynh` (orange).
- `FR-SCH-039`: The system MUST automatically default `Đến ngày` to match `Từ ngày` when selecting dates for single-day events (`K014`).
- `FR-SCH-040`: In `Sự kiện` list view, the system MUST render tear-away calendar date cards, support filtering between `Sự kiện sắp tới` and `Tất cả sự kiện`, and provide direct inline edit and delete actions.
- `FR-SCH-041`: The system MUST manage academic years (`/school/academic-year/`) using a minimal 3-field form (`Tên năm học`, `Ngày bắt đầu`, `Ngày kết thúc`).
- `FR-SCH-042`: The system MUST dynamically compute and render the green `Hiện tại` badge on the academic year containing the current system date (`BR01`).
- `FR-SCH-043`: The system MUST enforce date validation preventing overlapping date intervals between full academic years while permitting nested semester sub-terms (`K015`).
- `FR-SCH-044`: The system MUST disable deleting academic years from the UI to protect relational integrity across dependent modules (`BR03`).
- `FR-SCH-045`: The system MUST provide an archived student repository (`/school/archive/`) capturing withdrawal metadata: withdrawal date, staff operator link, and reason.
- `FR-SCH-046`: The system MUST render student detail modals with a prominent yellow warning banner (`🔒 Học sinh đã được lưu trữ`) and read-only field presentations (`BR03`).
- `FR-SCH-047`: The system MUST provide student restoration (`Phục hồi`) with modal confirmation, restoring students to active rosters while verifying class continuity (`K013`).
- `FR-SCH-048`: The system MUST enforce a two-step confirmation modal with red warning graphics before permanently purging an archived student from the database (`BR06`).

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
  2. Manual payment confirmation (`ManualPaymentModal`) is strictly limited to 1 payment method: `Tiền mặt` (Cash). Electronic payment methods (QR ECOPay, Ví Finviet, bank transfers) are handled automatically via webhook/gateway reconciliation. On clicking `"Lưu xác nhận"`, an enterprise success toast notification (`addToast`) confirms the payment and closes the dialog.
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
- `AC-046`: Unified Student Data & Automated Highest Discount Verification:
  1. Student roster and class data (including Khối 10, 11, 12 and specifically Nguyễn Gia Huy - Lớp 10A1) are 100% synchronized between the Student sub-module, Discount sub-module, and Tuition Invoice sub-module.
  2. When generating an invoice for Nguyễn Gia Huy (Lớp 10A1) for standard tuition (2,500,000 VND), the system automatically applies the 50% academic scholarship (-1,250,000 VND) over the 20% class-wide discount, itemizing the deduction on the invoice line item, setting total amount to 1,250,000 VND, and updating the dynamic VietQR payload accordingly.

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
