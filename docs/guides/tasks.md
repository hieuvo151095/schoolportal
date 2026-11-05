# Implementation Tasks Breakdown — School Operating Portal

> **Module Scope:** Vận Hành (Operations), Học Tập (Academics), Tài Chính (Finance)  
> **Governance:** Marcus Fleet V34 Execution Gate  
> **Target Release:** Phase 1 Enterprise Delivery

---

## 1. Core Architecture & Foundation Tasks

- [ ] `TASK-ARCH-001`: Initialize Next.js Pages Router foundation with multi-tenant dynamic routing `pages/[schoolCode]/...`, NextAuth.js session configuration, and centralized Redux store setup.  
  - **Owner:** `alan-tech-lead`  
  - **Write Scope:** `src/pages/`, `src/store/`, `src/lib/auth.ts`  
  - **Dependencies:** None  
  - **Verification:** Execute `npm test` verifying that tenant route resolution correctly extracts `schoolCode` and hydrates Redux tenant context.

- [ ] `TASK-ARCH-002` [P]: Configure ECO Design System 1.0 token integration, global typography imports (`Baloo Chettan 2`, `Quicksand`, `Inter`), Tailwind CSS theme configuration, and `styled-components` registry.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/styles/`, `tailwind.config.js`, `src/components/theme/`  
  - **Dependencies:** `TASK-ARCH-001`  
  - **Verification:** Automated Jest snapshot test verifying that `#FEC020` brand yellow and `#0070CE` primary blue CSS variables are injected without SSR hydration warning.

- [ ] `TASK-ARCH-003` [P]: Implement Laravel Sanctum API client wrapper with tenant header injection `X-School-Code`, bearer token refresh interceptor, and versioned endpoint mapping `/{schoolCode}/api/1.0/...`.  
  - **Owner:** `david-systems-architect`  
  - **Write Scope:** `src/services/api/`, `src/lib/http.ts`  
  - **Dependencies:** `TASK-ARCH-001`  
  - **Verification:** Unit test HTTP interceptor ensuring `401 Unauthorized` triggers token refresh or redirect to sign-in page.

---

## 2. Module 1: Vận Hành (Operations) Tasks

- [x] `TASK-OPS-001`: Build daily per-class attendance roster screen (`/class/[classId]/attendance`) with single-click arrival (Đón) and departure (Trả) actions, timestamp logging, and late arrival badge calculation.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/operations/attendance/`  
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`  
  - **Verification:** Unit and integration tests verifying that clicking Đón updates presence counter, checks late threshold, and renders "Đến muộn". (Completed)

- [x] `TASK-OPS-001b`: Multi-class mock rosters (7 classes), calendar past vs. future date attendance engine with empty future state, click-to-edit inline temperature adjustment, and universal top-right toast notification system across all modules.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/services/mockAttendanceData.ts`, `src/store/slices/attendanceSlice.ts`, `src/store/slices/toastSlice.ts`, `src/modules/operations/attendance/AttendanceRoster.tsx`, `src/components/common/GlobalToastContainer.tsx`, `src/components/layout/PortalLayout.tsx`  
  - **Dependencies:** `TASK-OPS-001`  
  - **Verification:** 176 unit tests pass, integration tests confirm multi-class switching, calendar past/future date logic, inline temperature editing with stepper, and top-right corner toast display. (Completed)

- [x] `TASK-OPS-001c`: Expand portal layout content width to full width (w-full, Image 1 red frame standard) and modernize typography to Inter & Be Vietnam Pro (Image 2 clean reference standard) across all school portal modules.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/components/layout/PortalLayout.tsx`, `src/styles/globals.css`, `tailwind.config.js`, `src/pages/_document.tsx`, fee reports & reconciliation pages  
  - **Dependencies:** `TASK-ARCH-002`, `TASK-OPS-001b`  
  - **Verification:** 176 unit tests pass, Next.js build succeeds with 39/39 pages, live DOM asserts w-full container and Inter font loading. (Completed)

- [x] `TASK-OPS-002`: Implement checkout validation logic enforcing departure time greater than arrival time (MSG01 `Giờ trả học sinh phải lớn hơn giờ đón học sinh`) and gear-button pickup guardian modal.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/operations/attendance/`  
  - **Dependencies:** `TASK-OPS-001`  
  - **Verification:** Unit tests verifying validation failure when Trả <= Đón, and successful saving of authorized guardian selection. (Completed)

- [x] `TASK-OPS-003`: Build bulk absence modal with Excused (Có phép) vs Unexcused (Không phép) radio choices, tuition refund eligibility toggle, and internal notes.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/operations/attendance/`  
  - **Dependencies:** `TASK-OPS-001`  
  - **Verification:** Tests asserting bulk selection, status updating, and refund eligibility tagging. (Completed)

- [x] `TASK-OPS-004` [P]: Build daily activities social feed (`/class/[classId]/activity`) supporting rich text, media upload, hashtag `#` lesson picker, user `@` mentions, and post status queue.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/operations/activity/`  
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`  
  - **Verification:** Automated unit test suite `tests/unit/activity.test.mjs` verifying post submission with media attachments, pinned post priority, and status pill rendering (Chờ duyệt / Đã duyệt). (Completed)

- [x] `TASK-OPS-005` [P]: Build media library album viewer (`/class/[classId]/media`) with automated "Hoạt động" and "Điểm danh" system albums and facial recognition tagging gallery.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/operations/media/`  
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`  
  - **Verification:** Automated unit test suite `tests/unit/media.test.mjs` verifying album protection, 5-student filter cap, and AI facial recognition scan simulation. (Completed)

- [x] `TASK-OPS-006` [P]: Build parent messaging communication center (`/conversations` and `/conversations/group`) supporting direct parent threads, student group channels, interactive absence cards, and recipient deduplication.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/operations/conversation/`  
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`  
  - **Verification:** Automated unit test suite `tests/unit/conversations.test.mjs` validating absence workflow transitions, system audit log injection, parent deduplication, deep search, category filter, and message recall. (Completed)

- [x] `TASK-OPS-007` [P]: Build attendance monthly reporting grid and extended template-based report generator (`/reports/attendance` and `/reports/extended`).  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/operations/reports/`, `src/pages/[schoolCode]/reports/`  
  - **Dependencies:** `TASK-OPS-001`  
  - **Verification:** Automated unit test suite `tests/unit/reports.test.mjs` (16 assertions, 62/62 tests passing overall) validating monthly calendar calculations (BR02), overtime surcharge arithmetic (BR05/BR06), strict draft-only deletion (BR03), forward-only status lifecycle (BR02/BR09), and fixed-template report cloning (BR08). Clean Next.js build and HTTP 200 responses verified. (Completed)

---

## 3. Module 2: Học Tập (Academics) Tasks

- [x] `TASK-ACAD-001`: Build weekly class timetable builder and schedule viewer (`/school/schedule`) with period matrix, subject assignment, and parent dispatch audit log.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/academics/schedule/`  
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`  
  - **Verification:** Automated unit test suite `tests/unit/schedule.test.mjs` (10/10 assertions, 72/72 tests passing overall) validating dual grid/file formats (BR01), auto-title synthesis and undefined semester prevention (BR02, BR11), academic date intervals (BR03), file upload submit guard (BR04), weekly grid structure (BR05), 3-way edit submission and republished status (BR06, BR08), cumulative notification send history (BR07), asymmetric action permissions (BR10), structure cloning (BR08, BR10), and multi-criteria filtering (BR12). Clean Next.js build and HTTP 200 server response verified on all 4 routes. (Completed)

- [x] `TASK-ACAD-002`: Build homework management module (`/school/assignment`) with class/subject assignment creation, attachment uploads, deadline pickers, and student submission tracking.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/academics/assignment/`, `src/types/assignment.ts`, `src/utils/assignmentValidation.ts`, `src/services/mockAssignmentData.ts`, `src/store/slices/assignmentSlice.ts`, `src/pages/[schoolCode]/school/assignment/`  
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`, `TASK-ACAD-001`  
  - **Verification:** Automated unit test suite `tests/unit/assignment.test.mjs` (15/15 assertions, 87/87 tests passing overall) validating 4 mandatory creation fields and dynamic subject resolution (BR01, BR02), audience scope (BR03), scheduled send status determination (BR04), asymmetric action permissions (BR06), submission metrics tally (BR08), late arrival detection and mandatory feedback grading (BR09), title immutability in edit mode (BR11), multi-criteria filtering (BR12, BR13), and Redux state transitions. Clean Next.js build and HTTP 200 server response verified across all 4 routes. (Completed)

- [x] `TASK-ACAD-003`: Build gradebook and evaluation matrix (`/school/scoreboard`) filterable by grade level, class, and subject, supporting regular, midterm, and final grades.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/academics/gradebook/`, `src/types/gradebook.ts`, `src/utils/gradebookValidation.ts`, `src/services/mockGradebookData.ts`, `src/store/slices/gradebookSlice.ts`, `src/pages/[schoolCode]/school/scoreboard/`  
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`  
  - **Verification:** Automated unit test suite `tests/unit/gradebook.test.mjs` (14/14 assertions, 101/101 tests passing overall) validating dual evaluation paradigms (BR01), weighted semester GPA calculation per MoET standard (BR03), bounded evaluation tally clamping fixing legacy 6/5 defect (BR07), rubric completion determination (BR07), publication lifecycle and switch to "Cập nhật" action (BR02, BR08), homeroom summary completion rates (BR04), multi-criteria filtering (BR09), and numeric score bounds validation (0.0 - 10.0). Verified clean Next.js production build (`npm run build`) with static generation for all 3 routes, and live HTTP 200 telemetry responses. (Completed)

---

## 4. Module 3: Tài Chính (Finance) Tasks

- [x] `TASK-FIN-001`: Build student tuition billing roster (`/school/fee`) with invoice creation wizard, VietQR payment code generation, and payment status lifecycle management.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/finance/invoices/`, `src/pages/[schoolCode]/school/fee/`  
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`  
  - **Verification:** Automated unit test suite `tests/unit/invoices.test.mjs` (13/13 assertions, 114/114 overall) asserting VND dot-separated currency formatting, dynamic status transitions across 6 states (da_tao, da_gui, da_thanh_toan, thanh_toan_mot_phan, qua_han, da_huy), asymmetric permissions matrix (BR03), dynamic batch action intersection (BR04), VietQR transfer syntax 'HOCPHI {invoiceNo}', and cumulative non-overwriting payment history logging (BR08). Verified clean Next.js production build (`npm run build`) and live HTTP 200 telemetry responses. (Completed)

- [x] `TASK-FIN-002`: Implement automated attendance-linked meal deduction logic during invoice generation, pulling excused absence counts from Module 1.  
  - **Owner:** `alan-tech-lead`  
  - **Write Scope:** `src/utils/invoiceValidation.ts`, `src/types/invoice.ts`, `src/services/mockInvoiceData.ts`  
  - **Dependencies:** `TASK-FIN-001`, `TASK-OPS-003`  
  - **Verification:** Unit tests in `tests/unit/invoices.test.mjs` verifying exact integer VND meal fee deduction formula `deductedAmount = excusedAbsenceDays * dailyMealRate` with absence bounds clamping against school days, avoiding floating-point rounding errors. Integrated seamlessly in creation wizard and bill line items. (Completed)

- [x] `TASK-FIN-003`: Build fee catalog management (`/school/school-fees`) and per-class tuition fee schedule assignment (`/school/tuition-management`).  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/finance/catalog/`, `src/modules/finance/tuition/`, `src/types/schoolFee.ts`, `src/types/tuitionManagement.ts`, `src/utils/schoolFeeValidation.ts`, `src/utils/tuitionManagementValidation.ts`, `src/services/mockSchoolFeeData.ts`, `src/services/mockTuitionManagementData.ts`, `src/store/slices/schoolFeeSlice.ts`, `src/store/slices/tuitionManagementSlice.ts`, `src/pages/[schoolCode]/school/school-fees/`, `src/pages/[schoolCode]/school/tuition-management/`  
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`  
  - **Verification:** Automated unit test suites `tests/unit/schoolFees.test.mjs` and `tests/unit/tuitionManagement.test.mjs` (199/199 tests passing overall across 14 sub-modules) validating fee catalog with mandatory confirmation pop-up on Xuất HĐĐT toggle, unit filter dropdown, clickable column unit sorting, and streamlined tuition management table (6 columns, fee count badge with eye icon triggering 3-column fee portfolio modal: Tên khoản phí, Số tiền, Xuất HĐĐT), plus universal logic-change modal and toast standards. Clean Next.js production build (`npm run build`) and live HTTP 200 telemetry verified on all fee catalog and class schedule routes. (Completed)

- [x] `TASK-FIN-004` [P]: Build expense disbursement voucher tracker (`/school/expenses`) with category categorization, receipt attachments, approval workflow, and voucher cancellation flows.  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/finance/expenses/`  
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`  
  - **Verification:** Test verifying expense voucher submission and status change to "Đã hủy" upon authorized cancellation.

- [x] `TASK-FIN-005` [P]: Build payment session reconciliation (`/school/reconciliation`) and tuition collection analytics dashboard (`/reports/fee/overview`).  
  - **Owner:** `benny-frontend-engineer`  
  - **Write Scope:** `src/modules/finance/reconciliation/`, `src/modules/finance/reports/`, `src/pages/[schoolCode]/reports/fee/`  
  - **Dependencies:** `TASK-FIN-001`  
  - **Verification:** Completed payment session reconciliation (`/school/reconciliation` and `/[sessionId]`) with 10/10 tests in `tests/unit/reconciliation.test.mjs`. Completed fee collection analytics reporting suite across 4 dedicated tab routes (`/overview`, `/fee`, `/fee/partial`, `/fee/unpaid`) with 10/10 tests passing in `tests/unit/feeReports.test.mjs`, 39/39 Next.js pages statically prerendered, class rate matrix with archived student isolation, confirmation date filtering, stacked partial balances, and red overdue highlights. Total test suite: 170/170 tests passing.

- [x] `TASK-FIN-006` [P]: Build Miễn Giảm (Tuition Exemption & Discount Policy Management) Catalog Roster (`/school/discount`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/finance/discount/`, `src/types/discount.ts`, `src/utils/discountValidation.ts`, `src/store/slices/discountSlice.ts`, `src/pages/[schoolCode]/school/discount/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`, `TASK-FIN-003`
  - **Verification:** Completed catalog roster at `/[schoolCode]/school/discount` with full-width frame styling, search filter, status lifecycle tabs (`Tất cả`, `Đang hoạt động`, `Ngừng áp dụng`, `Hết hạn`), automated expiration based on current date, pause/resume policy toggles, and deletion confirmation modal. 10/10 tests passing in `tests/unit/discount.test.mjs`.

- [x] `TASK-FIN-007` [P]: Build Policy Creation & Editing Modal with Dual Application Scope (`student` vs `class`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/finance/discount/CreateDiscountPolicyModal.tsx`, `src/modules/finance/discount/StudentPickerModal.tsx`, `src/modules/finance/discount/BeneficiaryModal.tsx`
  - **Dependencies:** `TASK-FIN-006`
  - **Verification:** Completed `CreateDiscountPolicyModal` and `StudentPickerModal` with percentage vs fixed VND discounts, fee catalog selection, multi-select classes or multi-select student picker, validity period by academic year or month range, quick reason chips, and `validateDiscountPolicyForm` validation.

- [x] `TASK-FIN-008` [P]: Integrate Discount Calculation Engine with Tuition Invoice Creation Wizard (`/school/fee/create`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/utils/discountValidation.ts`, `src/modules/finance/invoices/CreateInvoiceWizardModal.tsx`, `src/types/discount.ts`, `src/store/slices/invoiceSlice.ts`
  - **Dependencies:** `TASK-FIN-001`, `TASK-FIN-006`
  - **Verification:** Step 1 administrative toggle ("Tự động áp dụng chính sách miễn giảm", default ON) and Step 3 itemized deduction lines (`Miễn giảm: {policyName} (-X đ)`) integrated using `resolveStudentDiscounts`, enforcing Scope Specificity (student overrides class for same fee item), highest discount priority (`Math.max`), disjoint line-item independence, and non-negative clamping (ADR-012, K016, K017).

- [x] `TASK-FIN-009` [P]: Build Discount Policy & Beneficiary Roster Excel Export.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/finance/discount/discountExport.ts`
  - **Dependencies:** `TASK-FIN-006`
  - **Verification:** Client-side CSV generator with UTF-8 BOM (`\uFEFF`) and Excel-compatible formatting for policy catalog and beneficiary details. Verified in production build and unit test suite. Total test suite: 253/253 tests passing.

---

## 5. Module 4: Nhà Trường (School Administration) Tasks

- [x] `TASK-SCH-001` [P]: Build Student Directory & 360° Profile Hub (`/school/kid/` and `/school/kid/detail/[id]/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/student/`, `src/types/student.ts`, `src/utils/studentValidation.ts`, `src/store/slices/studentSlice.ts`, `src/pages/[schoolCode]/school/kid/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Completed student master data slice with 15/15 unit tests passing in `tests/unit/students.test.mjs`, verified multi-factor search, 360° Profile Hub with 5 contextual tabs, pediatric BMI math and live badge indicators, class transfers with cascade warnings, legacy null resolution K008, and clean static Next.js production build across 41 routes.


- [x] `TASK-SCH-002` [P]: Build Teacher Directory & Credential Management (`/school/teacher/` and `/school/teacher/info/[id]/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/teacher/`, `src/types/teacher.ts`, `src/utils/teacherValidation.ts`, `src/services/mockTeacherData.ts`, `src/store/slices/teacherSlice.ts`, `src/pages/[schoolCode]/school/teacher/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Completed teacher master data slice with 29/29 unit tests passing in `tests/unit/teachers.test.mjs`, verified multi-factor search across 5 fields, class assignments with Resolution K006 homeroom conflict warning banners, two-tier content moderation permissions (BR01), credential email updates (BR06), onboarding wizard with dirty form guard (Resolution K010), legacy null resolution K008, and clean static Next.js production build across 44 routes.

- [ ] `TASK-SCH-003` [P]: Build Class Management Catalog & Safeguards (`/school/class/` and `/school/class/info/[id]/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/class/`, `src/types/class.ts`, `src/utils/classValidation.ts`, `src/services/mockClassData.ts`, `src/store/slices/classSlice.ts`, `src/pages/[schoolCode]/school/class/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Unit tests verifying two-tab partitioning (Chính khóa vs Ngoại khóa), extracurricular feature degeneration, deletion permission guard strictly allowing delete only when `studentCount === 0`, and homeroom assignment binding.

- [ ] `TASK-SCH-004` [P]: Build Subject Catalog & Teaching Assignments (`/school/subject/` and `/school/subject/info/[id]/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/subject/`, `src/types/subject.ts`, `src/utils/subjectValidation.ts`, `src/services/mockSubjectData.ts`, `src/store/slices/subjectSlice.ts`, `src/pages/[schoolCode]/school/subject/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Unit tests verifying 4-level educational tabs (TH, THCS, THPT, GDTX), read-only 4-term evaluation matrices, deduplicated teacher allocation modal, and teacher unassignment confirmation.

- [ ] `TASK-SCH-005` [P]: Build Grade Level Hierarchy & Reactive Search (`/school/grades/` and `/school/grades/info/[id]/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/grades/`, `src/types/grade.ts`, `src/utils/gradeValidation.ts`, `src/services/mockGradeData.ts`, `src/store/slices/gradeSlice.ts`, `src/pages/[schoolCode]/school/grades/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Unit tests verifying 4 educational tiers, aggregate metrics computation (students and classes per grade), class list rendering with GVCN links, and client-side reactive search with instant restoration on clear.

- [ ] `TASK-SCH-006` [P]: Build Bảng Thông Tin (Announcement Board & Scheduling) (`/announcement/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/announcement/`, `src/types/announcement.ts`, `src/utils/announcementValidation.ts`, `src/store/slices/announcementSlice.ts`, `src/pages/[schoolCode]/announcement/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Unit tests verifying life-cycle states (`ban_nhap`, `chua_gui`, `da_gui`), draft-only editing, preview modal rendering, and bulk deletion email permanence warnings.

- [ ] `TASK-SCH-007` [P]: Build Bình Chọn (Polls & Surveys) (`/school/poll/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/poll/`, `src/types/poll.ts`, `src/utils/pollValidation.ts`, `src/store/slices/pollSlice.ts`, `src/pages/[schoolCode]/school/poll/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Unit tests validating survey option rules ($\ge 2$), decoupled audience dispatch, conditional pie chart rendering ($\text{totalVotes} > 0$), and student revision history tracking.

- [x] `TASK-SCH-008` [P]: Build Thực Đơn (Weekly Meal Menus & Food Safety) (`/school/menu/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/menu/`, `src/types/menu.ts`, `src/utils/menuValidation.ts`, `src/store/slices/menuSlice.ts`, `src/pages/[schoolCode]/school/menu/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Completed weekly meal menu planning and food safety traceability sub-module with 13/13 unit tests passing in `tests/unit/menu.test.mjs` (282/282 tests passing overall across all modules), verified 8-week horizon limit (`BR01`), automatic class fallback to school-wide menu when no custom class menu exists (`BR02`), published menu republishing (`BR03`), dual content modes (grid vs file) with symmetric form toggles (`BR04`), asymmetric action toolbar omitting clone for file-based menus (`BR05`), dual publishing modalities (portal vs announcement board) (`BR06`), GTIN and internal barcode traceability parsing (`BR07`), automated GS1/Vietnamese certified supplier lookup (`BR08`), immutable send history audit timeline (`BR09`), dirty navigation guard (`BR10`), draft-only deletion safeguard (`BR11`), AI balanced menu suggestions across 4 budget tiers (`BR12`), clean Next.js static build `npm run build` across 48 routes, and live HTTP 200 server response. (Completed)

- [ ] `TASK-SCH-009` [P]: Build Điểm Danh NV (Staff Attendance & Rapid Clock-In) (`/school/staff-attendance/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/staffAttendance/`, `src/types/staffAttendance.ts`, `src/utils/staffAttendanceValidation.ts`, `src/store/slices/staffAttendanceSlice.ts`, `src/pages/[schoolCode]/school/staff-attendance/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Unit tests validating single-click clock-in timestamps, mutual exclusivity between Check-in/out and Absent modals, 45-day retroactive date limit, and KPI summary counter suppression during search.

- [ ] `TASK-SCH-010` [P]: Build Sổ Tay PH (Parent Handbook & Knowledge Base) (`/school/handbook/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/handbook/`, `src/types/handbook.ts`, `src/utils/handbookValidation.ts`, `src/store/slices/handbookSlice.ts`, `src/pages/[schoolCode]/school/handbook/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Unit tests verifying strict 2-tier tree depth constraint, single-sibling accordion behavior, drag-and-drop sibling reordering, publishing toggles, and cascading category deletion guards.

- [ ] `TASK-SCH-011` [P]: Build Góp Ý (Parent Feedback & Inquiries) (`/school/feedback/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/feedback/`, `src/types/feedback.ts`, `src/utils/feedbackValidation.ts`, `src/store/slices/feedbackSlice.ts`, `src/pages/[schoolCode]/school/feedback/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`, `TASK-SCH-001`
  - **Verification:** Unit tests verifying 4 status filter cards with persistent global counter retention, inline priority editing, handler assignment, 2-way discussion threads with image attachments, and modal confirmation on ticket close (`Hoàn tất`).

- [ ] `TASK-SCH-012` [P]: Build Lịch Sự Kiện (Event & Holiday Calendar) (`/school/calendar/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/calendar/`, `src/types/calendar.ts`, `src/utils/calendarValidation.ts`, `src/store/slices/calendarSlice.ts`, `src/pages/[schoolCode]/school/calendar/`, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Unit tests validating 3 synchronized view modes (Năm: 12-month matrix with bottom category legend, Tháng: 7-column day cell grid with multi-day continuous horizontal spanning bars, Sự kiện: agenda stream with tear-away calendar date cards), 3 semantic category color tokens (`ngay_nghi` Rose `#E11D48`, `noi_bo` Teal `#0D9488`, `moi_phu_huynh` Amber `#EA580C`), read-only inspection modal with direct edit jump, authoring form (`/school/calendar/create` & `/edit/[eventId]`) with "Thêm thời gian" toggle (`HH:mm`), dirty form navigation guard `LS-02`, modal deletion confirmation `LS-01`, and cross-module synchronization with the meal refund holiday calendar (`TASK-FIN-034`). Verified via `node --test tests/unit/schoolCalendar.test.mjs`.

- [ ] `TASK-SCH-013` [P]: Build Năm Học (Academic Years & Terms Configuration) (`/school/academic-year/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/academicYear/`, `src/types/academicYear.ts`, `src/utils/academicYearValidation.ts`, `src/store/slices/academicYearSlice.ts`, `src/pages/[schoolCode]/school/academic-year/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`
  - **Verification:** Unit tests verifying minimal 3-field creation/edit form, automated system-date current year badge calculation, date interval non-overlap validation between full school years, and client-side reactive search filtering.

- [ ] `TASK-SCH-014` [P]: Build Lưu Trữ (Archived Students Roster) (`/school/archive/`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/archive/`, `src/types/archive.ts`, `src/utils/archiveValidation.ts`, `src/store/slices/archiveSlice.ts`, `src/pages/[schoolCode]/school/archive/`
  - **Dependencies:** `TASK-ARCH-002`, `TASK-ARCH-003`, `TASK-SCH-001`
  - **Verification:** Unit tests validating student archive listing with withdrawal audit context (date, operator, reason), alphabetical sorting, student detail inspection modal with yellow warning banner, restoration with class continuity check, and two-step permanent deletion confirmation.

- [ ] `TASK-SCH-015` [P]: Execute Quality Gates, Regression Testing & Release Packaging for Phase 3.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/`, `docs/`
  - **Dependencies:** `TASK-SCH-011` through `TASK-SCH-014`
  - **Verification:** Execute full unit test suite `npm test`, verify clean production build `npm run build`, and confirm live HTTP 200 route responses across all 4 Phase 3 sub-modules.

---

## 6. Quality Assurance & E2E Validation Tasks

- [ ] `TASK-QA-001`: Implement Playwright end-to-end regression suite covering daily check-in/out, activity creation, homework distribution, tuition invoice generation, and reconciliation.  
  - **Owner:** `ada-qa-agent`  
  - **Write Scope:** `tests/e2e/`  
  - **Dependencies:** All previous tasks  
  - **Verification:** Complete headless Playwright test run passing 100% across Chromium and WebKit.

---

## 7. Module 6: Cấu Hình (Settings) — Sub-module 3: Học Phí Tasks

- [x] `TASK-SET-001` [P]: Build Settings Fee Data Contracts & Pure Validation Engine (`settingFeeValidation.ts`).
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/settingFee.ts`, `src/utils/settingFeeValidation.ts`
  - **Dependencies:** None
  - **Verification:** Unit test suite asserting email regex validation, duplicate detection, tier row delete invariants (row 1 permanent), and SInvoice mandatory field verification. (Completed)

- [x] `TASK-SET-002` [P]: Build Redux State Machine with Independent Block Dirty States (`settingFeeSlice.ts`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/settingFeeSlice.ts`
  - **Dependencies:** `TASK-SET-001`
  - **Verification:** Redux actions for updating invoice note, toggling SInvoice, toggling late pickup & meal refund, updating email recipients, and managing per-block dirty flags. (Completed)

- [x] `TASK-SET-003` [P]: Build Configuration Block UI Components (`InvoiceNoteBlock`, `SepayIntegrationBlock`, `SInvoiceBlock`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/settings/fee/InvoiceNoteBlock.tsx`, `SepayIntegrationBlock.tsx`, `SInvoiceBlock.tsx`
  - **Dependencies:** `TASK-SET-001`, `TASK-SET-002`
  - **Verification:** Independent Save button enablement, masked secret/webhook reveal toggles, collapsible SInvoice layout, and required field error rendering. (Completed)

- [x] `TASK-SET-004` [P]: Build Childcare & Reconciliation UI Components (`LatePickupAndRefundBlock`, `ReconciliationEmailBlock`, `UnsavedChangesModal`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/settings/fee/LatePickupAndRefundBlock.tsx`, `ReconciliationEmailBlock.tsx`, `UnsavedChangesModal.tsx`
  - **Dependencies:** `TASK-SET-001`, `TASK-SET-002`
  - **Verification:** Late pickup fixed vs tiered calculation modes, tier table row delete constraint, 101-choice combobox, and 3-email cap with duplicate/invalid email rejection. (Completed)

- [x] `TASK-SET-005` [P]: Assemble Page Routes & Navigation Guard (`/setting/fee` and `/setting/fee/payment-history`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/pages/[schoolCode]/setting/fee/index.tsx`, `src/pages/[schoolCode]/setting/fee/payment-history/index.tsx`
  - **Dependencies:** `TASK-SET-003`, `TASK-SET-004`
  - **Verification:** Main page routing, unsaved changes modal guard upon route departure, and Sepay transaction history view with monthly date filter. (Completed)

- [x] `TASK-SET-006` [P]: Execute Quality Assurance & Automated Test Suite for Settings Fee.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/settingFee.test.mjs`, `docs/verification.md`
  - **Dependencies:** `TASK-SET-001` through `TASK-SET-005`
  - **Verification:** 100% test pass rate across `settingFee.test.mjs` (19/19 tests passing), clean Next.js build `npm run build` (50/50 static routes), and zero regressions across all portal modules (302/302 tests passing). (Completed)

---

## 8. Module 6: Cấu Hình — Cơ Chế Hoàn Tiền Ăn & Khấu Trừ Hóa Đơn Kỳ Sau Tasks

- [ ] `TASK-REFUND-001` [P]: Update Data Contracts for Meal Refund Rates & Invoice Deductions.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/settingFee.ts`, `src/types/invoice.ts`
  - **Dependencies:** `TASK-SET-001`
  - **Verification:** Add `MealRefundRates` (`mainMealRatePercent`, `breakfastRatePercent`, `holidayRefundRatePercent: 100`) and invoice line item deduction structures. Verified by `npx tsc --noEmit`.

- [ ] `TASK-REFUND-002` [P]: Implement Pure Meal Refund Calculation Engine & Explanation Formatter.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/utils/settingFeeValidation.ts`, `src/utils/invoiceValidation.ts`
  - **Dependencies:** `TASK-REFUND-001`
  - **Verification:** Unit tests verifying $(D_{self} \times P \times \text{Rate}) + (D_{school} \times P \times 100\%)$ for Tiền ăn and Tiền ăn sáng, asserting exact 162.000đ total refund for September scenario ($D_{self}=3, D_{school}=1$).

- [ ] `TASK-REFUND-003` [P]: Update Redux State Machine for Meal Refund Rates & Batch Invoicing Deductions.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/settingFeeSlice.ts`, `src/store/slices/invoiceSlice.ts`
  - **Dependencies:** `TASK-REFUND-002`
  - **Verification:** Redux actions for updating meal refund rates and automatic deduction injection during next-month batch invoice creation.

- [ ] `TASK-REFUND-004` [P]: Upgrade Settings Fee Meal Refund UI Block (`LatePickupAndRefundBlock.tsx`).
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/settings/fee/LatePickupAndRefundBlock.tsx`
  - **Dependencies:** `TASK-REFUND-003`
  - **Verification:** Group A (100% read-only badge), Group B (% inputs for Tiền ăn and Tiền ăn sáng), and live calculation preview widget.

- [ ] `TASK-REFUND-005` [P]: Integrate Previous-Month Meal Refund Auto-Deductions into Invoice Creation Wizard.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/finance/invoices/CreateInvoiceWizardModal.tsx`
  - **Dependencies:** `TASK-REFUND-003`
  - **Verification:** Step 3 Review displaying itemized meal refund deductions, formatted explanations, and adjusted net payable amounts.

- [ ] `TASK-REFUND-006` [P]: Execute Quality Assurance & Test Verification for Meal Refund Workflow.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/settingFee.test.mjs`, `tests/unit/invoices.test.mjs`, `docs/verification.md`
  - **Dependencies:** `TASK-REFUND-001` through `TASK-REFUND-005`
  - **Verification:** 100% test pass rate across unit test suites, clean Next.js static build `npm run build`, and live HTTP 200 server responses.



### Module 21: Quản Lý Lớp Học (School Class Management)

- [x] `TASK-CLS-001` [P]: Define TypeScript Data Contracts & Class State Interfaces.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/class.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `ClassItem`, `ClassType`, `ClassStatus`, `InstructorBrief`, `ClassFormData`, and `ClassFilterCriteria`.

- [x] `TASK-CLS-002` [P]: Implement Pure Class Validation & Empty Class Delete Safety Engine.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/classValidation.ts`
  - **Dependencies:** `TASK-CLS-001`
  - **Verification:** Pure functions `validateClassForm`, `canDeleteClass`, `checkHomeroomConflict`, and `filterClassesList` tested in node test runner.

- [x] `TASK-CLS-003` [P]: Construct Redux State Machine and Mock Seed Directory.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/classSlice.ts`, `src/services/mockClassData.ts`, `src/store/index.ts`
  - **Dependencies:** `TASK-CLS-002`
  - **Verification:** Redux actions for creating classes, updating metadata, deleting empty classes, and reactive filtering.

- [x] `TASK-CLS-004` [P]: Implement Class Directory UI Components and Delete Confirmation Modal.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/classes/ClassToolbar.tsx`, `ClassSummaryCards.tsx`, `ClassTable.tsx`, `DeleteClassModal.tsx`, `ClassFilterDrawer.tsx`
  - **Dependencies:** `TASK-CLS-003`
  - **Verification:** Dual tab rendering, delete button disabled state for populated classes, and modal trigger for empty classes.

- [x] `TASK-CLS-005` [P]: Assemble Pages, Creation Wizard, and Class Detail Convergence Hub.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/pages/[schoolCode]/school/classes/index.tsx`, `create.tsx`, `[classId]/index.tsx`, `[classId]/edit.tsx`, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-CLS-004`
  - **Verification:** Verified by Next.js static build `npm run build` and route inspection.

- [x] `TASK-CLS-006` [P]: Author Unit Test Suite and Verify Quality Gates.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/class.test.mjs`
  - **Dependencies:** `TASK-CLS-001` through `TASK-CLS-005`
  - **Verification:** 100% test pass rate in `npm test` and all documentation gates passing.



### Module 22: Quản Lý Môn Học (School Subject Management)

- [x] `TASK-SUB-001` [P]: Define TypeScript Data Contracts & Evaluation Matrix Schemas.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/subject.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `SchoolSubject`, `EducationStage`, `SubjectClassification`, `SubjectType`, `EvaluationType`, `TermEvaluationMatrix`, and `SubjectFilterState`.

- [x] `TASK-SUB-002` [P]: Implement Pure Subject Validation & Teacher Assignment Engine.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/subjectValidation.ts`
  - **Dependencies:** `TASK-SUB-001`
  - **Verification:** Pure functions `filterSubjectsByStage`, `getUnassignedTeachers`, `canUnassignTeacher`, and `searchSubjects` tested in node test runner.

- [x] `TASK-SUB-003` [P]: Construct Redux State Machine and Standard MoET Subject Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/subjectSlice.ts`, `src/services/mockSubjectData.ts`, `src/store/index.ts`
  - **Dependencies:** `TASK-SUB-002`
  - **Verification:** Redux actions for switching stage tabs, searching, assigning teachers, and unassigning teachers tested in node test runner.

- [x] `TASK-SUB-004` [P]: Implement Subject Directory UI Components and Detail Drawer.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/subjects/SubjectToolbar.tsx`, `SubjectSummaryCards.tsx`, `SubjectTable.tsx`, `SubjectDetailDrawer.tsx`
  - **Dependencies:** `TASK-SUB-003`
  - **Verification:** 4 stage tabs, teacher chips with +N remainder, and 4-term assessment matrix rendered.

- [x] `TASK-SUB-005` [P]: Implement Teacher Assignment and Unassignment Modals & Page Route.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/subjects/AssignTeacherModal.tsx`, `UnassignTeacherModal.tsx`, `src/pages/[schoolCode]/school/subjects/index.tsx`, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-SUB-004`
  - **Verification:** Verified by Next.js static build `npm run build` and route inspection at `/[schoolCode]/school/subjects`.

- [x] `TASK-SUB-006` [P]: Author Unit Test Suite and Verify Quality Gates.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/subject.test.mjs`
  - **Dependencies:** `TASK-SUB-001` through `TASK-SUB-005`
  - **Verification:** 100% test pass rate in `npm test` and all documentation gates passing.



### Module 23: Quản Lý Khối Lớp (School Grade Level Management)

- [x] `TASK-GRD-001` [P]: Define TypeScript Data Contracts & Grade Level Schemas.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/grade.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `EducationStage`, `GradeLevel`, `GradeClassItem`, `GradeSummaryKPI`, and `GradeFilterState`.

- [x] `TASK-GRD-002` [P]: Implement Pure Grade Validation & Dynamic Rollup Engine.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/gradeValidation.ts`
  - **Dependencies:** `TASK-GRD-001`
  - **Verification:** Pure functions `filterGradesByStage`, `searchGrades`, `computeGradeRollups`, and `computeSchoolKPIs` tested in node test runner.

- [x] `TASK-GRD-003` [P]: Construct Redux State Machine and Statutory Grade Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/gradeSlice.ts`, `src/services/mockGradeData.ts`, `src/store/index.ts`
  - **Dependencies:** `TASK-GRD-002`
  - **Verification:** Redux actions for stage filtering, search query updates, academic year selection, and dynamic rollup selectors verified.

- [x] `TASK-GRD-004` [P]: Implement Grade Dashboard UI Components.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/grades/GradeToolbar.tsx`, `GradeSummaryCards.tsx`, `GradeTable.tsx`
  - **Dependencies:** `TASK-GRD-003`
  - **Verification:** 5 stage pills, 4 summary KPI cards, and statutory grade table with detail eye icons verified.

- [x] `TASK-GRD-005` [P]: Implement Grade Detail Cockpit & Class Roster Table.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/grades/GradeDetailCards.tsx`, `GradeClassTable.tsx`, `src/pages/[schoolCode]/school/grades/index.tsx`, `src/pages/[schoolCode]/school/grades/[gradeId].tsx`, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-GRD-004`
  - **Verification:** Verified by Next.js static build `npm run build` and route inspection at `/[schoolCode]/school/grades` and `/[schoolCode]/school/grades/[gradeId]`.

- [x] `TASK-GRD-006` [P]: Author Unit Test Suite and Verify Quality Gates.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/grade.test.mjs`
  - **Dependencies:** `TASK-GRD-001` through `TASK-GRD-005`
  - **Verification:** 100% test pass rate in `npm test` and all documentation gates passing.



### Module 24: Bảng Thông Tin (School Announcement Board & Scheduling)

- [x] `TASK-ANN-001` [P]: Define TypeScript Data Contracts & Announcement Schemas.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/announcement.ts`, `contracts/announcement-contracts.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `AnnouncementStatus`, `AnnouncementCategory`, `AnnouncementChannel`, `AnnouncementAudienceScope`, `AnnouncementSubAudience`, `AnnouncementAttachment`, `Announcement`, `AnnouncementSummaryKPI`, and `AnnouncementFilterState`.

- [x] `TASK-ANN-002` [P]: Implement Pure Announcement Validation & Business Logic Engine.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/announcementValidation.ts`
  - **Dependencies:** `TASK-ANN-001`
  - **Verification:** Pure functions `filterAnnouncements`, `searchAnnouncements`, `validateAnnouncementPayload`, `canEditAnnouncement`, and `computeAnnouncementKPIs` tested in node test runner.

- [x] `TASK-ANN-003` [P]: Construct Redux State Machine and Comprehensive Mock Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/announcementSlice.ts`, `src/services/mockAnnouncementData.ts`, `src/store/index.ts`
  - **Dependencies:** `TASK-ANN-002`
  - **Verification:** Redux slice actions for filtering, searching, selecting, creating, updating, scheduling, and deleting announcements tested in unit tests.

- [x] `TASK-ANN-004` [P]: Implement Announcement Directory UI Components & Irrevocable Email Delete Modal.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/announcements/AnnouncementToolbar.tsx`, `AnnouncementSummaryCards.tsx`, `AnnouncementTable.tsx`, `DeleteAnnouncementModal.tsx`
  - **Dependencies:** `TASK-ANN-003`
  - **Verification:** 4 status tabs, category dropdown, search input, checkboxes, and irrevocable email warning dialog verified.

- [x] `TASK-ANN-005` [P]: Implement Announcement Composer & WYSIWYG Preview Modal.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/announcements/AnnouncementComposer.tsx`, `PreviewAnnouncementModal.tsx`
  - **Dependencies:** `TASK-ANN-004`
  - **Verification:** Dynamic conditional fields for class selection and preview modal rendering recipient layout verified.

- [x] `TASK-ANN-006` [P]: Implement Announcement Detail View, Page Routing & Sidebar Integration.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/announcements/AnnouncementDetailView.tsx`, `src/pages/[schoolCode]/school/announcements/index.tsx`, `create.tsx`, `[announcementId].tsx`, `edit/[announcementId].tsx`, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-ANN-005`
  - **Verification:** Verified by Next.js static build `npm run build` and route inspection at `/[schoolCode]/school/announcements`.

- [x] `TASK-ANN-007` [P]: Author Unit Test Suite and Verify Quality Gates.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/announcements.test.mjs`
  - **Dependencies:** `TASK-ANN-001` through `TASK-ANN-006`
  - **Verification:** 100% test pass rate in `npm test` covering BR01–BR13 and zero regressions on existing 408 tests.



### Module 25: Bình Chọn (School Polls, Voting & Surveys)

- [x] `TASK-POL-001` [P]: Define TypeScript Data Contracts & Poll Schemas.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/poll.ts`, `contracts/poll-contracts.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `PollStatus`, `PollAudienceScope`, `PollOption`, `PollConfig`, `Poll`, `VoteHistoryEntry`, `StudentVoterRecord`, `PollSummaryKPI`, and `PollFilterState`.

- [x] `TASK-POL-002` [P]: Implement Pure Poll Validation & Business Logic Engine.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/pollValidation.ts`
  - **Dependencies:** `TASK-POL-001`
  - **Verification:** Pure functions `filterPolls`, `searchPolls`, `validatePollPayload`, `canEditPoll`, `canSendPoll`, `canDeletePoll`, `computePollKPIs`, and `calculateOptionPercentages` tested in node test runner.

- [x] `TASK-POL-003` [P]: Construct Redux State Machine and Comprehensive Mock Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/pollSlice.ts`, `src/services/mockPollData.ts`, `src/store/index.ts`
  - **Dependencies:** `TASK-POL-002`
  - **Verification:** Redux slice actions for filtering, searching, draft saving, dispatching, vote revision recording, and deletion tested in unit tests.

- [x] `TASK-POL-004` [P]: Implement Poll Directory UI Components & Decoupled Dispatch Modal.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/poll/PollToolbar.tsx`, `PollSummaryCards.tsx`, `PollTable.tsx`, `SendPollModal.tsx`, `DeletePollModal.tsx`
  - **Dependencies:** `TASK-POL-003`
  - **Verification:** 4 status tabs, class selector, search input, state-driven action icons, send modal, and delete dialog verified.

- [x] `TASK-POL-005` [P]: Implement Poll Composer & Configuration Form.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/poll/PollComposer.tsx`
  - **Dependencies:** `TASK-POL-004`
  - **Verification:** Dynamic option addition/removal, minimum 2 options validation, future deadline check, and configuration toggles verified.

- [x] `TASK-POL-006` [P]: Implement Poll Detail Cockpit, Visual Charts, Voter Roster & History Modal.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/poll/PollDetailCockpit.tsx`, `PollVoterRoster.tsx`, `VoteHistoryModal.tsx`, `src/pages/[schoolCode]/school/poll/index.tsx`, `create.tsx`, `[pollId].tsx`, `edit/[pollId].tsx`, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-POL-005`
  - **Verification:** Verified by Next.js static build `npm run build` and route inspection at `/[schoolCode]/school/poll`.

- [x] `TASK-POL-007` [P]: Author Unit Test Suite and Verify Quality Gates.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/poll.test.mjs`
  - **Dependencies:** `TASK-POL-001` through `TASK-POL-006`
  - **Verification:** 100% test pass rate in `npm test` covering BR01–BR11 and zero regressions on existing 432 tests.



### Module 26: Điểm Danh NV (School Staff Attendance & Daily Timekeeping)

- [x] `TASK-STA-001` [P]: Define TypeScript Data Contracts & Staff Attendance Schemas.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/staffAttendance.ts`, `contracts/staff-attendance-contracts.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `StaffRole`, `StaffProfile`, `StaffAttendanceRecord`, `StaffAttendanceRosterItem`, `StaffAttendanceKPI`, and `StaffAttendanceFilterState`.

- [x] `TASK-STA-002` [P]: Implement Pure Staff Attendance Validation & Business Logic Engine.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/staffAttendanceValidation.ts`
  - **Dependencies:** `TASK-STA-001`
  - **Verification:** Pure functions `isDateLockedForEdit`, `isDateInFuture`, `validateTimeFormat`, `filterStaffRoster`, `computeStaffKPIs`, `sortStaffByNickname`, and rollback behaviors tested in node test runner.

- [x] `TASK-STA-003` [P]: Construct Redux State Machine and Comprehensive Mock Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/staffAttendanceSlice.ts`, `src/services/mockStaffAttendanceData.ts`, `src/store/index.ts`
  - **Dependencies:** `TASK-STA-002`
  - **Verification:** Redux slice actions for date selection, 1-click check-in/out, inline time updating, absence confirmation, note updating, and client-side filtering tested in unit tests.

- [x] `TASK-STA-004` [P]: Implement Staff Attendance Toolbar, Warning Banner & KPI Summary Cards.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/staff-attendance/StaffAttendanceToolbar.tsx`, `StaffAttendanceSummaryCards.tsx`
  - **Dependencies:** `TASK-STA-003`
  - **Verification:** Date picker locking future dates, 45-day static warning banner, and 3 KPI counters hiding during active search verified.

- [x] `TASK-STA-005` [P]: Implement Staff Attendance Roster Table & Inline Handlers.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/staff-attendance/StaffAttendanceTable.tsx`
  - **Dependencies:** `TASK-STA-004`
  - **Verification:** 1-click check-in/out transitions, inline time badge editing, blur rollback on invalid input, absence toggle trigger, and inline note auto-save verified.

- [x] `TASK-STA-006` [P]: Implement Absence Confirmation Modal, Staff Profile Modal, Route Integration & Sidebar Link.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/staff-attendance/StaffAbsenceModal.tsx`, `StaffProfileModal.tsx`, `src/pages/[schoolCode]/school/staff-attendance/index.tsx`, `src/pages/[schoolCode]/staff-attendance/index.tsx`, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-STA-005`
  - **Verification:** Verified by Next.js static build `npm run build` and route inspection at `/[schoolCode]/school/staff-attendance`.

- [x] `TASK-STA-007` [P]: Author Unit Test Suite and Verify Quality Gates.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/staffAttendance.test.mjs`
  - **Dependencies:** `TASK-STA-001` through `TASK-STA-006`
  - **Verification:** 100% test pass rate in `npm test` covering BR01–BR12 and zero regressions on existing 463 tests.


- [ ] `TASK-HNB-001` [P]: Define TypeScript Domain Types and Data Contracts for Sổ Tay PH.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/parentHandbook.ts`, `contracts/parent-handbook-contracts.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `HandbookCategory`, `HandbookArticle`, `HandbookCategoryNode`, `HandbookFileAttachment`, and `HandbookFilterState`.

- [ ] `TASK-HNB-002` [P]: Implement Pure Parent Handbook Validation and Hierarchy Engine.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/parentHandbookValidation.ts`
  - **Dependencies:** `TASK-HNB-001`
  - **Verification:** Pure functions `buildCategoryTree`, `filterTreeByArticleCriteria`, `toggleAccordionState`, `reorderSiblings`, and `getCascadingDeleteTargets` tested in node test runner.

- [ ] `TASK-HNB-003` [P]: Construct Redux State Machine and Handbook Mock Data Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/parentHandbookSlice.ts`, `src/store/index.ts`, `src/services/mockParentHandbookData.ts`
  - **Dependencies:** `TASK-HNB-002`
  - **Verification:** Redux slice actions for category CRUD, article CRUD, 1-click status transitions (publish/hide), sibling reordering, and filter criteria tested in unit tests.

- [ ] `TASK-HNB-004` [P]: Implement Handbook Toolbar and Accordion Category Tree.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/handbook/HandbookToolbar.tsx`, `HandbookAccordionTree.tsx`
  - **Dependencies:** `TASK-HNB-003`
  - **Verification:** Single-active accordion expansion, drag handles on sub-categories/articles, status badging, and tree pruning during search verified.

- [ ] `TASK-HNB-005` [P]: Implement Category Modals and Cascading Deletion Dialog.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/handbook/CategoryModal.tsx`, `HandbookDeleteModal.tsx`
  - **Dependencies:** `TASK-HNB-004`
  - **Verification:** Sub-category modal rendering read-only parent name, root category modal omitting parent name, and modal ST-01 warning vs ST-02 confirmation verified.

- [ ] `TASK-HNB-006` [P]: Construct Article Detail Panel, Authoring Routes & Sidebar Placement.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/handbook/HandbookDetailPanel.tsx`, `src/pages/[schoolCode]/school/handbook/`, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-HNB-005`
  - **Verification:** Verified by Next.js static build `npm run build` and route inspection at `/[schoolCode]/school/handbook`, `create.tsx`, and `edit/[articleId].tsx`.

- [ ] `TASK-HNB-007` [P]: Author Unit Test Suite and Verify Quality Gates for Sổ Tay PH.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/parentHandbook.test.mjs`
  - **Dependencies:** `TASK-HNB-001` through `TASK-HNB-006`
  - **Verification:** 100% test pass rate in `npm test` covering BR01–BR12 and zero regressions across all portal suites.


### Parent Feedback (Góp Ý) Engineering Tasks

- [ ] `TASK-FDB-001` [P]: Define TypeScript Contracts and Domain Types for Parent Feedback.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/feedback.ts`
  - **Dependencies:** None
  - **Verification:** Exported interfaces `FeedbackItem`, `FeedbackComment`, `FeedbackAttachment`, `FeedbackSummaryKPI`, `FeedbackFilterState`, and union types compile under strict TypeScript.

- [ ] `TASK-FDB-002` [P]: Implement Pure Feedback Validation and Business Rules Engine.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/feedbackValidation.ts`
  - **Dependencies:** `TASK-FDB-001`
  - **Verification:** Pure functions `calculateFeedbackKPIs`, `filterFeedbackItems`, `validateCommentPayload`, `getPriorityBadgeStyle`, and `getNextTurnTakingStatus` pass unit tests.

- [ ] `TASK-FDB-003` [P]: Construct Redux State Machine and Mock Data Fixtures for Feedback.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/feedbackSlice.ts`, `src/store/index.ts`, `src/services/mockFeedbackData.ts`
  - **Dependencies:** `TASK-FDB-002`
  - **Verification:** Redux slice actions for status filtering, inline priority/assignee update, discussion comment addition, and ticket closure tested in isolation.

- [ ] `TASK-FDB-004` [P]: Implement KPI Summary Cards and Feedback Toolbar.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/feedback/FeedbackKPICards.tsx`, `FeedbackToolbar.tsx`
  - **Dependencies:** `TASK-FDB-003`
  - **Verification:** 4 cards display school-year totals, toggle single status filtering with "Xóa bộ lọc" reset, and search/filter controls emit accurate criteria.

- [ ] `TASK-FDB-005` [P]: Implement Feedback Ticket Roster and Inline Mutation Controls.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/feedback/FeedbackRoster.tsx`, `FeedbackRow.tsx`
  - **Dependencies:** `TASK-FDB-004`
  - **Verification:** Roster displays code, category, student, parent, status, waiting side, priority dropdown with immediate inline update, and omission of create button verified.

- [ ] `TASK-FDB-006` [P]: Implement Feedback Detail Surface, Discussion Stream, and Profile Modals.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/feedback/FeedbackDetailPane.tsx`, `DiscussionStream.tsx`, `ClosureModal.tsx`, `ProfileQuickViewModal.tsx`, `src/pages/[schoolCode]/school/feedback/`
  - **Dependencies:** `TASK-FDB-005`
  - **Verification:** Discussion reply submit disabled when empty, turn-taking flips, modal GY-01 guards closure, and profile modals render `"Chưa có {trường}"`.

- [ ] `TASK-FDB-007` [P]: Author Unit Test Suite and Verify Quality Gates for Góp Ý.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/feedback.test.mjs`
  - **Dependencies:** `TASK-FDB-001` through `TASK-FDB-006`
  - **Verification:** 100% test pass rate in node test runner covering BR01–BR09, K054–K058, and clean Next.js build.


### Module 29: Năm Học (School Academic Year & Calendar Milestone Directory)

- [x] `TASK-AY-001` [P]: Define TypeScript Domain Types and Data Contracts for Academic Year.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/academicYear.ts`, `contracts/academic-year-contracts.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `AcademicYear`, `AcademicYearFormData`, `AcademicYearFilterState`, `CreateAcademicYearPayload`, `UpdateAcademicYearPayload`, and `AcademicYearValidationResult`.

- [x] `TASK-AY-002` [P]: Implement Pure Academic Year Validation and Calendar Calculation Engine.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/academicYearValidation.ts`
  - **Dependencies:** `TASK-AY-001`
  - **Verification:** Pure functions `isCurrentAcademicYear`, `validateAcademicYearForm` (`endDate >= startDate`), and `filterAcademicYears` pass unit test suite.

- [x] `TASK-AY-003` [P]: Construct Redux State Machine and Academic Year Mock Data Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/academicYearSlice.ts`, `src/store/index.ts`, `src/services/mockAcademicYearData.ts`
  - **Dependencies:** `TASK-AY-002`
  - **Verification:** Redux slice actions for adding academic year, updating in-place, modal toggling, and client-side search query updates tested in isolation.

- [x] `TASK-AY-004` [P]: Construct Academic Year Toolbar and Table Roster.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/academic-year/AcademicYearToolbar.tsx`, `AcademicYearTable.tsx`
  - **Dependencies:** `TASK-AY-003`
  - **Verification:** Component renders instant search input, "+ Tạo năm học" button, dynamic bold blue styling for current year with "Hiện tại" badge, and permanent omission of delete buttons.

- [x] `TASK-AY-005` [P]: Implement Minimalist 3-Field Create & Edit Modal.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/academic-year/AcademicYearModal.tsx`
  - **Dependencies:** `TASK-AY-004`
  - **Verification:** Form validates exactly 3 required fields (Tên năm học, Ngày bắt đầu, Ngày kết thúc), submit button remains disabled until valid, pre-populates on edit, and omits any manual "Hiện tại" checkbox.

- [x] `TASK-AY-006` [P]: Assemble Page Routes and Portal Layout Navigation.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/pages/[schoolCode]/school/academic-year/index.tsx`, `src/pages/[schoolCode]/school/season/index.tsx`, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-AY-005`
  - **Verification:** Main dashboard loads correctly, alias route `/school/season` redirects, and "Năm học" navigation item with `faCalendarCheck` icon is positioned strictly after "Lịch sự kiện" under `NHÀ TRƯỜNG`.

- [x] `TASK-AY-007` [P]: Author Unit Test Suite and Verify Quality Gates for Năm Học.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/academicYear.test.mjs`
  - **Dependencies:** `TASK-AY-001` through `TASK-AY-006`
  - **Verification:** 100% test pass rate in node test runner covering BR01–BR07, K059–K063, clean Next.js build `npm run build`, and all documentation quality gates passing.



### Module 30: Lưu Trữ (School Archive & Cold Storage Roster)

- [x] `TASK-ARC-001` [P]: Define TypeScript Domain Types and Data Contracts for School Archive.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/archive.ts`, `contracts/archive-contracts.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `ArchivedStudent`, `ArchiveStaffOperator`, `ArchiveFilterState`, `RestoreStudentPayload`, `RestoreStudentResult`, `PurgeStudentPayload`, and `PurgeStudentResult`.

- [x] `TASK-ARC-002` [P]: Implement Pure Archive Validation, Search, Sorting, and Class Continuity Engine.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/archiveValidation.ts`
  - **Dependencies:** `TASK-ARC-001`
  - **Verification:** Pure functions `filterArchivedStudents`, `sortArchivedStudents`, `evaluateRestorationClass`, and null-safe date formatting pass node unit tests.

- [x] `TASK-ARC-003` [P]: Construct Redux State Machine and Archive Mock Data Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/archiveSlice.ts`, `src/store/index.ts`, `src/services/mockArchiveData.ts`
  - **Dependencies:** `TASK-ARC-002`
  - **Verification:** Redux slice actions for student restoration, permanent purge, filter state updates, and modal open/close actions tested in isolation.

- [x] `TASK-ARC-004` [P]: Construct Archive Toolbar and Table Roster.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/archive/ArchiveToolbar.tsx`, `ArchiveTable.tsx`
  - **Dependencies:** `TASK-ARC-003`
  - **Verification:** Component renders instant keyword search, archive month dropdown, export button, column sort arrow, clickable student name, clickable staff operator, and dual action icons.

- [x] `TASK-ARC-005` [P]: Implement Archived Student Detail Modal and Staff Operator Quick View Modal.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/archive/ArchivedStudentDetailModal.tsx`, `ArchiveStaffModal.tsx`
  - **Dependencies:** `TASK-ARC-004`
  - **Verification:** Profile modal renders yellow warning banner `🔒 Học sinh đã được lưu trữ`, read-only demographic fields, archive reason/date/notes, and staff administrative contact card.

- [x] `TASK-ARC-006` [P]: Implement Dual Action Modals: Restoration and Permanent Deletion.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/school/archive/RestoreConfirmModal.tsx`, `PermanentDeleteModal.tsx`
  - **Dependencies:** `TASK-ARC-005`
  - **Verification:** Modal `LT-01` prompt and class continuity alert on restore; modal `LT-02` prompt, distinct red hazard illustration, and affirmative purge confirmation gating verified.

- [x] `TASK-ARC-007` [P]: Assemble Page Routes and Portal Layout Navigation.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/pages/[schoolCode]/school/archive/index.tsx`, `src/pages/[schoolCode]/setting/kid/archived/index.tsx`, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-ARC-006`
  - **Verification:** Main archive cockpit loads correctly, legacy alias redirects, and "Lưu trữ" navigation item with `faArchive` icon is positioned strictly after "Năm học" under `NHÀ TRƯỜNG`.

- [x] `TASK-ARC-008` [P]: Author Unit Test Suite and Verify Quality Gates for Lưu Trữ.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/archive.test.mjs`
  - **Dependencies:** `TASK-ARC-001` through `TASK-ARC-007`
  - **Verification:** 100% test pass rate in node test runner covering BR01–BR09, K064–K068, clean Next.js build `npm run build`, and all documentation quality gates passing.


### Module 31: Trường (School Master Profile & Operational Baseline Configuration)

- [ ] `TASK-SCH-INFO-001` [P]: Define TypeScript Domain Types and Data Contracts for School Profile.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/schoolProfile.ts`, `contracts/school-profile-contracts.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `SchoolProfile`, `DayOperatingHour`, `AttendanceRules`, `SchoolInfoFormData`, `SchoolInfoValidationErrors`, `OperatingHoursFormData`, and `AttendanceRulesFormData`.

- [ ] `TASK-SCH-INFO-002` [P]: Implement Pure Validation, 5-Minute Stepped Time Intervals, and Time Ordering Engine.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/schoolProfileValidation.ts`
  - **Dependencies:** `TASK-SCH-INFO-001`
  - **Verification:** Pure functions `validateSchoolInfoForm` (mandatory fields & email), `validateOperatingHours` (`closeTime > openTime`), `generateTimeOptions` (06:00 to 18:00, 5-min step), and interval formatting pass node unit tests.

- [ ] `TASK-SCH-INFO-003` [P]: Construct Redux State Machine and School Profile Mock Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/schoolProfileSlice.ts`, `src/store/index.ts`, `src/services/mockSchoolProfileData.ts`
  - **Dependencies:** `TASK-SCH-INFO-002`
  - **Verification:** Redux slice actions for updating profile identity, weekly operating hours, attendance rules, independent dirty state tracking, active tab routing, and navigation guard dialog tested in isolation.

- [ ] `TASK-SCH-INFO-004` [P]: Construct School Overview Dashboard with Read-Only Cards.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/settings/school/SchoolOverviewDashboard.tsx`
  - **Dependencies:** `TASK-SCH-INFO-003`
  - **Verification:** Overview dashboard renders institutional profile cards, educational stage tags, operating hours roster (Mon–Sun), attendance rules, and top-right Edit icon (`icon_edit_square`) navigating to `/setting/school/edit`.

- [ ] `TASK-SCH-INFO-005` [P]: Implement Basic Info Edit Form with Real-Time Blur Validation TR-01.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/settings/school/SchoolInfoForm.tsx`, `SchoolEditTabs.tsx`
  - **Dependencies:** `TASK-SCH-INFO-004`
  - **Verification:** Form validates mandatory fields (Tên trường, Địa chỉ, Email) on blur with red border and error alert TR-01, language dropdown, logo upload slot, and dedicated "Cập nhật" action.

- [ ] `TASK-SCH-INFO-006` [P]: Implement Weekly Operating Hours and Attendance Rules Independent Sub-Forms.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/settings/school/OperatingHoursForm.tsx`, `AttendanceRulesForm.tsx`, `UnsavedChangesModal.tsx`
  - **Dependencies:** `TASK-SCH-INFO-005`
  - **Verification:** Monday–Saturday 5-minute stepped time pickers, static grey Sunday tag, independent sub-form saving without cross-validation interference, late arrival dropdown (5–60 mins) disabled when toggle off, late departure toggle with active link to `/setting/fee`, and dirty navigation modal TR-02 verified.

- [x] `TASK-SCH-INFO-007` [P]: Assemble Page Routes and Portal Layout Navigation under Cấu Hình.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/pages/[schoolCode]/setting/school/index.tsx`, `src/pages/[schoolCode]/setting/school/edit.tsx`, legacy alias routes, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-SCH-INFO-006`
  - **Verification:** Main overview loads at `/setting/school`, edit interface loads at `/setting/school/edit`, legacy aliases redirect cleanly, and "Trường" with `faSchool` icon is positioned first under `CẤU HÌNH`.

- [x] `TASK-SCH-INFO-008` [P]: Author Unit Test Suite and Verify Quality Gates for Trường.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/schoolProfile.test.mjs`
  - **Dependencies:** `TASK-SCH-INFO-001` through `TASK-SCH-INFO-007`
  - **Verification:** 100% test pass rate in node test runner covering BR01–BR14, K069–K075, clean Next.js build `npm run build`, and all documentation quality gates passing.

### Module 32: Cấu Hình — Tài Khoản (User & Student Account Management and Access Control)

- [x] `TASK-ACC-001` [P]: Define TypeScript Domain Types and Data Contracts for Accounts.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/account.ts`, `contracts/account-contracts.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `UserAccount`, `StudentAccountItem`, `UserRole`, `StaffFunction`, `UserAccountFilterState`, `StudentAccountFilterState`, and modal view models.

- [x] `TASK-ACC-002` [P]: Implement Pure Validation Engine and Multi-Role / CSDL Sync Safeguards.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/accountValidation.ts`
  - **Dependencies:** `TASK-ACC-001`
  - **Verification:** Pure validation functions asserting multi-role rules, permanently disabled Admin role on create, locked CSDL Sở full name, rejection of CSDL Sở row status toggle with TK-03, and student username regex validation pass node unit tests.

- [x] `TASK-ACC-003` [P]: Construct Redux State Machine and Account Mock Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/accountSlice.ts`, `src/store/index.ts`, `src/services/mockAccountData.ts`
  - **Dependencies:** `TASK-ACC-002`
  - **Verification:** Redux slice actions for managing user accounts, row-level status toggles, rejecting CSDL status modifications, student account CRUD, and modal state management tested in isolation.

- [x] `TASK-ACC-004` [P]: Construct Account Tabs Shell and User Accounts Roster Table.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/setting/account/AccountTabsShell.tsx`, `UserAccountsToolbar.tsx`, `UserAccountsTable.tsx`
  - **Dependencies:** `TASK-ACC-003`
  - **Verification:** User accounts table renders multi-role badge pills, active status default filter, search bar, CSDL Sở filter drawer, View-only action for Admin accounts, and row-level status toggle with toast TK-06.

- [x] `TASK-ACC-005` [P]: Implement Dynamic User Account Create/Edit Form with Role-Dependent Controls.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/setting/account/UserAccountForm.tsx`, `AccountActionConfirmModal.tsx`
  - **Dependencies:** `TASK-ACC-004`
  - **Verification:** Form validates permanently disabled Admin checkbox on create, locked Full Name and warning banner for CSDL Sở accounts, dynamic Staff Functions (mandatory error TK-02), dynamic Management Classes, collapsible Additional Info, and update confirmation modal TK-05.

- [x] `TASK-ACC-006` [P]: Implement Decoupled Security Sub-Flows: Email Modal and Dedicated Password Sub-Page.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/setting/account/ChangeEmailModal.tsx`, `ChangePasswordSubPage.tsx`, `src/pages/[schoolCode]/setting/users/[id]/password.tsx`
  - **Dependencies:** `TASK-ACC-005`
  - **Verification:** Email field displayed read-only with dedicated change modal, RFC 5322 regex validation, dedicated password reset sub-route under BẢO MẬT, and old session revocation advisories verified.

- [x] `TASK-ACC-007` [P]: Implement Student Accounts Directory and Credential Management.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/setting/account/StudentAccountsToolbar.tsx`, `StudentAccountsTable.tsx`, `StudentAccountModal.tsx`
  - **Dependencies:** `TASK-ACC-004`
  - **Verification:** Student roster displays 1-to-1 mapping with enrolled students, class filter, account status filter, create modal with `+` action, edit modal with pencil action, and username alphanumeric/email regex validation.

- [x] `TASK-ACC-008` [P]: Assemble Canonical Page Routes, Sidebar Mounting, and Automated Unit Tests.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `src/pages/[schoolCode]/setting/users/index.tsx`, `src/pages/[schoolCode]/school/kid/accounts/index.tsx`, `src/components/layout/PortalLayout.tsx`, `tests/unit/account.test.mjs`
  - **Dependencies:** `TASK-ACC-001` through `TASK-ACC-007`
  - **Verification:** 100% test pass rate in node test runner covering BR01–BR21, K076–K082, clean Next.js build `npm run build`, and all documentation quality gates passing.





- [x] `TASK-REC-001` [P]: Define TypeScript Domain Types and Data Contracts for Face Recognition.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/faceRecognition.ts`, `contracts/face-recognition-contracts.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `StudentFaceRecord`, `Gender`, `FaceRegistrationStatus`, `FaceRecognitionFilterState`, and modal view models.

- [x] `TASK-REC-002` [P]: Implement Pure Validation Engine and Face Recognition Business Rules.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/faceRecognitionValidation.ts`
  - **Dependencies:** `TASK-REC-001`
  - **Verification:** Pure validation functions asserting BR01 through BR09, accent-insensitive search, and disabled submit states pass node unit tests.

- [x] `TASK-REC-003` [P]: Construct Redux State Machine and Face Recognition Mock Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/faceRecognitionSlice.ts`, `src/store/index.ts`, `src/services/mockFaceRecognitionData.ts`
  - **Dependencies:** `TASK-REC-002`
  - **Verification:** Redux slice actions for registering photo, updating photo, deleting photo, and managing filter state tested in isolation.

- [x] `TASK-REC-004` [P]: Construct Face Recognition Table and Multi-Factor Toolbar.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/setting/face-recognition/FaceRecognitionToolbar.tsx`, `FaceRecognitionTable.tsx`
  - **Dependencies:** `TASK-REC-003`
  - **Verification:** Table renders STT, Code, Name/Nickname, Class link, Photo thumbnail / `-`, Date / `-`, dynamic action column (`+` vs pencil + `X`), and footer `Tổng: N`.

- [x] `TASK-REC-005` [P]: Implement Registration, Edit, and Delete Confirmation Modals.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/setting/face-recognition/RegisterFaceModal.tsx`, `EditFaceModal.tsx`, `DeleteFaceConfirmModal.tsx`
  - **Dependencies:** `TASK-REC-004`
  - **Verification:** Modals validate read-only student demographics, disabled submit until new image selected, current photo preview in edit modal, and explicit student name in delete modal.

- [x] `TASK-REC-006` [P]: Build Face Recognition Shell Component and Mount Navigation Menu.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/setting/face-recognition/FaceRecognitionShell.tsx`, `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-REC-005`
  - **Verification:** Sidebar menu highlights "Nhận diện" with icon `faCamera` fourth in `CẤU HÌNH` strictly following "Tài khoản".

- [x] `TASK-REC-007` [P]: Assemble Canonical Page Route.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/pages/[schoolCode]/setting/face-recognition/index.tsx`
  - **Dependencies:** `TASK-REC-006`
  - **Verification:** Verified by Next.js static build `npm run build` and route inspection at `/[schoolCode]/setting/face-recognition`.

- [x] `TASK-REC-008` [P]: Author Comprehensive Automated Unit Test Suite and Verify Quality Gates.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/faceRecognition.test.mjs`
  - **Dependencies:** `TASK-REC-001` through `TASK-REC-007`
  - **Verification:** 100% test pass rate in node test runner covering BR01–BR09, K083–K088, clean Next.js build `npm run build`, and all documentation quality gates passing.

### Phase 4.4: Phân hệ Cấu Hình — Tính Năng (Feature Flags & Academic Term Configuration)

- [x] `TASK-FEAT-001` [P]: Define TypeScript Domain Types and Data Contracts.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/featureFlags.ts`, `.agents/specs/049-settings-feature-flags-tinh-nang/contracts/feature-flags-contracts.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `ActivityFeatureSettings`, `AcademicTerm`, `AcademicYearOption`, `InlineTermDraft`, `InlineTermEditState`, and `FeatureFlagsState`.

- [x] `TASK-FEAT-002` [P]: Implement Pure Validation Engine and Business Rules.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/featureFlagsValidation.ts`
  - **Dependencies:** `TASK-FEAT-001`
  - **Verification:** Pure validation unit tests for BR01–BR10, toggle dirty-state detection, two-term ceiling, date validation, and mutual exclusion locking pass 17/17 tests in `tests/unit/featureFlags.test.mjs`.

- [x] `TASK-FEAT-003` [P]: Construct Redux State Machine and Realistic Mock Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/featureFlagsSlice.ts`, `src/services/mockFeatureFlagsData.ts`, `src/store/index.ts`
  - **Dependencies:** `TASK-FEAT-002`
  - **Verification:** Unit tests verifying state transitions for toggle changes, dirty state resetting, academic year selection, inline term editing/addition, draft updates, and cancel/save transitions pass.

- [x] `TASK-FEAT-004` [P]: Construct Tab Switcher and Activity Settings UI.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/setting/features/FeatureFlagsTabs.tsx`, `src/modules/setting/features/ActivitySettingsTab.tsx`
  - **Dependencies:** `TASK-FEAT-003`
  - **Verification:** Component tests asserting independent switches ("Bình luận", "Duyệt bình luận"), dirty-state button disablement, and toast notification on save pass.

- [x] `TASK-FEAT-005` [P]: Construct Academic Terms Table and Inline Row Editing.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/setting/features/PeriodSettingsTab.tsx`, `src/modules/setting/features/InlineTermRow.tsx`
  - **Dependencies:** `TASK-FEAT-003`
  - **Verification:** Component tests asserting academic year dropdown, "+ Thêm học kỳ" button disabled at 2 terms, inline editing mode with tick/X icons, single-row mutual exclusion locking, deletion omission, and empty state `"Chưa có học kỳ"` pass.

- [x] `TASK-FEAT-006` [P]: Mount Canonical Pages and Redirect Alias.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/pages/[schoolCode]/setting/activity/index.tsx`, `src/pages/[schoolCode]/setting/period/index.tsx`, `src/pages/[schoolCode]/setting/features/index.tsx`
  - **Dependencies:** `TASK-FEAT-004`, `TASK-FEAT-005`
  - **Verification:** Verified by Next.js static build `npm run build` with 0 errors across 92 static pages and route inspections at `/setting/activity`, `/setting/period`, and `/setting/features`.

- [x] `TASK-FEAT-007` [P]: Integrate Sidebar Navigation Menu.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-FEAT-006`
  - **Verification:** Sidebar menu highlights "Tính năng" with icon `faToggleOn` fifth in `CẤU HÌNH` strictly following "Nhận diện".

- [x] `TASK-FEAT-008` [P]: Author Comprehensive Automated Unit Test Suite and Regression Verification.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/featureFlags.test.mjs`
  - **Dependencies:** `TASK-FEAT-001` through `TASK-FEAT-007`
  - **Verification:** 100% test pass rate in node test runner (17/17 tests passing), 646/646 regression tests passing repo-wide, clean Next.js build `npm run build`, and all documentation quality gates passing.

### Phase 4.5: Phân hệ Cấu Hình — Thông Báo (Notification Configuration)

- [x] `TASK-NOTIF-001` [P]: Define TypeScript Domain Types and Data Contracts.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/types/notificationSettings.ts`, `.agents/specs/050-settings-notifications-thong-bao/contracts/notification-settings-contracts.ts`
  - **Dependencies:** None
  - **Verification:** Verified by `npx tsc --noEmit`. Defines `SchoolNotificationSettings`, `AttendanceNotificationSettings`, `BirthdayNotificationSettings`, `TuitionNotificationSettings`, `OtherNotificationSettings`, `ParentNotificationSettings`, and `NotificationSettingsState`.

- [x] `TASK-NOTIF-002` [P]: Implement Pure Validation Engine and Business Rules.
  - **Owner:** `alan-tech-lead`
  - **Write Scope:** `src/utils/notificationSettingsValidation.ts`
  - **Dependencies:** `TASK-NOTIF-001`
  - **Verification:** Pure validation unit tests for BR01–BR10, monolithic dirty-state diffing, calendar overflow fallback arithmetic, time string validation, tuition directional scheduling, and student terminology consistency pass 19/19 tests in `tests/unit/notificationSettings.test.mjs`.

- [x] `TASK-NOTIF-003` [P]: Construct Redux State Machine and Realistic Mock Fixtures.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/store/slices/notificationSettingsSlice.ts`, `src/services/mockNotificationSettingsData.ts`, `src/store/index.ts`
  - **Dependencies:** `TASK-NOTIF-002`
  - **Verification:** Unit tests verifying state mutations across all 5 sections, dirty state tracking against saved baseline, confirmation modal open/close transitions, commit actions, and reset behavior pass.

- [x] `TASK-NOTIF-004` [P]: Construct Policy Banner and Section Cards 1 & 2.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/setting/notification/NotificationPolicyBanner.tsx`, `src/modules/setting/notification/AttendanceNotificationCard.tsx`, `src/modules/setting/notification/BirthdayNotificationCard.tsx`
  - **Dependencies:** `TASK-NOTIF-003`
  - **Verification:** Component tests verifying policy banner text (school-wide scope, multi-platform push, calendar overflow rule), Section 1 readonly 17:00 time and extracurricular class selector, and Section 2 schedule row inheritance without independent toggle pass.

- [x] `TASK-NOTIF-005` [P]: Construct Section Cards 3, 4, 5 and Confirmation Modal.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/modules/setting/notification/TuitionNotificationCard.tsx`, `src/modules/setting/notification/OtherNotificationCard.tsx`, `src/modules/setting/notification/ParentNotificationCard.tsx`, `src/modules/setting/notification/NotificationConfirmModal.tsx`
  - **Dependencies:** `TASK-NOTIF-003`
  - **Verification:** Component tests verifying Section 3 directional tuition schedule ("Trước hạn" vs "Sau hạn"), Section 4 dual Web/App and Email toggle switches, Section 5 orange keyword typography, and confirmation dialog open/dismiss/commit lifecycle pass.

- [x] `TASK-NOTIF-006` [P]: Mount Monolithic Route Page and Action Bar.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/pages/[schoolCode]/setting/notification/index.tsx`, `src/modules/setting/notification/NotificationActionBar.tsx`, `src/modules/setting/notification/NotificationSettingsShell.tsx`
  - **Dependencies:** `TASK-NOTIF-004`, `TASK-NOTIF-005`
  - **Verification:** Verified by Next.js static build `npm run build` with 0 errors across 93 static pages and route inspection at `/[schoolCode]/setting/notification` showing single "Cập nhật" action bar with dirty-state activation.

- [x] `TASK-NOTIF-007` [P]: Integrate Sidebar Navigation Menu.
  - **Owner:** `benny-frontend-engineer`
  - **Write Scope:** `src/components/layout/PortalLayout.tsx`
  - **Dependencies:** `TASK-NOTIF-006`
  - **Verification:** Sidebar menu highlights "Thông báo" with icon `faBell` sixth in `CẤU HÌNH` strictly following "Tính năng".

- [x] `TASK-NOTIF-008` [P]: Author Comprehensive Automated Unit Test Suite and Regression Verification.
  - **Owner:** `ada-qa-agent`
  - **Write Scope:** `tests/unit/notificationSettings.test.mjs`
  - **Dependencies:** `TASK-NOTIF-001` through `TASK-NOTIF-007`
  - **Verification:** 100% test pass rate in node test runner (19/19 tests passing), 665/665 regression tests passing repo-wide, clean Next.js build `npm run build`, and all documentation quality gates passing.
