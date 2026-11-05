# Screen Inventory & UI States Catalog — School Operating Portal

> **Module Scope:** Vận Hành (Operations), Học Tập (Academics), Tài Chính (Finance)  
> **Governance:** Marcus Fleet Screen Architecture

---

## 1. Route & Navigation Map

All portal routes are prefixed by the dynamic tenant identifier `/[schoolCode]/`:

```text
/[schoolCode]/
├── class/[classId]/
│   ├── attendance/          # SCR-OPS-01: Điểm Danh Theo Lớp
│   ├── activity/            # SCR-OPS-02: Bảng Tin Hoạt Động Lớp
│   └── media/               # SCR-OPS-03: Thư Viện Media & Album Lớp
├── conversations/
│   └── group/               # SCR-OPS-04: Trao Đổi Phụ Huynh & Nhóm Chat
├── reports/
│   ├── attendance/          # SCR-OPS-05: Báo Cáo Điểm Danh Tháng
│   ├── extended/            # SCR-OPS-06: Báo Cáo Mở Rộng
│   └── fee/overview/        # SCR-FIN-06: Báo Cáo Học Phí & Tỷ Lệ Thu
├── setting/
│   └── fee/                 # SCR-SET-01: Cấu Hình Học Phí
│       └── payment-history/ # SCR-SET-02: Lịch Sử Giao Dịch Sepay
└── school/
    ├── schedule/            # SCR-ACAD-01: Thời Khóa Biểu
    ├── assignment/          # SCR-ACAD-02: Quản Lý Bài Tập
    ├── scoreboard/          # SCR-ACAD-03: Bảng Điểm & Đánh Giá
    ├── fee/                 # SCR-FIN-01: Quản Lý Học Phí & Hóa Đơn
    ├── discount/            # SCR-FIN-07: Chính Sách Miễn Giảm Học Phí
    ├── school-fees/         # SCR-FIN-02: Danh Mục Khoản Phí
    ├── tuition-management/  # SCR-FIN-03: Cấu Hình Học Phí Theo Lớp
    ├── expenses/            # SCR-FIN-04: Quản Lý Khoản Chi & Phiếu Chi
    └── reconciliation/      # SCR-FIN-05: Đối Soát Giao Dịch
```

---

## 2. Screen Inventory & Component Specifications

### 2.1 Module 1: Vận Hành (Operations)

#### SCR-OPS-01: Điểm Danh Theo Lớp (`/class/[classId]/attendance`)
- **Primary Purpose:** Daily attendance roster with single-click check-in (Đón), checkout (Trả), temperature tracking, and health status logging.
- **Header KPI Cards:** 3 summary counters: "Tham dự" (Present count), "Vắng" (Absent count: CP/KP), and "Chưa điểm danh" (Unmarked count).
- **Interactive Elements:**
  - Checkbox selection column for bulk operations.
  - Student avatar, name, student code, and guardian quick info.
  - "Đón" action button: clicks trigger current timestamp; turns into timestamp badge with optional "Đến muộn" indicator.
  - "Trả" action button: clicks trigger current timestamp; paired with gear icon (`pickup-button`) opening authorized guardian selector.
  - "Nhiệt độ": clickable temperature chip (default `37°C`) opening inline numerical stepper.
  - "Sức khỏe": dropdown menu selecting from 9 predefined health conditions.
  - "Ghi chú": pencil icon opening quick modal for teacher free-text notes.
  - Toolbar actions: "Đón hàng loạt", "Trả hàng loạt", "Vắng" (opens modal for CP/KP and refund toggle), "Báo vắng", "Lịch sử nhận diện".
- **States:**
  - *Loading:* Skeleton rows with shimmering avatar and action elements.
  - *Empty:* Illustration "Lớp học chưa có học sinh nào" with quick student import link.
  - *Error:* Red alert banner "Không thể tải danh sách điểm danh" with "Thử lại" button.

#### SCR-OPS-02: Bảng Tin Hoạt Động Lớp (`/class/[classId]/activity`)
- **Primary Purpose:** Class social feed allowing teachers to publish daily classroom activities, lesson milestones, photos, and videos.
- **Interactive Elements:**
  - Post composer with rich-text editor, media file uploader, hashtag `#` lesson autocomplete, and user `@` tagger.
  - Audience scope picker: "Chỉ lớp này", "Toàn trường", "Nhiều lớp".
  - Activity feed timeline showing author, timestamp, status pill (Chờ duyệt / Đã duyệt), pinned badge, and interaction metrics (Likes, Views, Comments).
  - Side panel: "Thông tin bài học" displaying curriculum lesson details linked to the post.

#### SCR-OPS-03: Thư Viện Media & Album (`/class/[classId]/media`)
- **Primary Purpose:** Class photo/video album manager integrating automated albums and facial recognition tagging.
- **Interactive Elements:**
  - System albums ("Hoạt động" and "Điểm danh") alongside custom created albums.
  - Album grid showing cover thumbnail, photo count, video count, and last update date.
  - Inside album: photo gallery grouped by upload date and author, with face recognition tags on hover.
  - Face recognition overview modal: shows recognized face percentage per student and manual tagging workflow.

#### SCR-OPS-04: Trao Đổi Phụ Huynh (`/conversations/group`)
- **Primary Purpose:** Real-time messaging hub connecting teachers, administrators, and parents.
- **Interactive Elements:**
  - Left sidebar: search bar, channel tabs ("Trực tiếp 1-1", "Nhóm học sinh", "Thông báo toàn lớp").
  - Central chat area: message thread history, voice/photo/document attachments, read receipts.
  - Right sidebar: student profile, linked parent contact cards, and shared media gallery.

#### SCR-OPS-05: Báo Cáo Điểm Danh Tháng (`/reports/attendance`)
- **Primary Purpose:** Monthly calendar grid summarizing daily student attendance and calculating late-pickup penalties.
- **Interactive Elements:**
  - Class selector, month/year picker, search filter.
  - Matrix table showing days 1-31 with status icons (X: present, P: excused absent, K: unexcused absent).
  - Summary columns: Tổng ngày học, Nghỉ có phép, Nghỉ không phép, Phí đón muộn (VND).
  - "Xuất Excel" action button.

#### SCR-OPS-06: Báo Cáo Mở Rộng (`/reports/extended`)
- **Primary Purpose:** Template-based operational report generator for school compliance audits.
- **Interactive Elements:**
  - Report template dropdown, multi-class filter, date range picker, student status filter (Đang học, Nghỉ học, Chuyển trường).
  - Tabular preview with pagination and CSV/Excel export buttons.

---

### 2.2 Module 2: Học Tập (Academics)

#### SCR-ACAD-01: Thời Khóa Biểu (`/school/schedule`)
- **Primary Purpose:** Weekly class timetable builder and schedule distribution center.
- **Interactive Elements:**
  - Term/week selector, class selector.
  - Weekly grid (Thứ 2 – Thứ 7), split into Morning (Tiết 1-5) and Afternoon (Tiết 6-9).
  - Cell slot: subject name, room, and assigned teacher.
  - "Gửi phụ huynh" button with revision audit history modal.

#### SCR-ACAD-02: Quản Lý Bài Tập (`/school/assignment`)
- **Primary Purpose:** Homework assignment creation and submission monitoring.
- **Interactive Elements:**
  - Assignment creation modal (Title, Subject, Class, Due Date, Attachments, Description).
  - Filterable list: upcoming, active, past due assignments.
  - Detail drawer: student submission roster displaying status pills (Đã nộp, Chưa nộp, Chấm điểm), submitted files, and teacher feedback box.

#### SCR-ACAD-03: Bảng Điểm & Đánh Giá (`/school/scoreboard`)
- **Primary Purpose:** Standardized academic evaluation and grade entry spreadsheet.
- **Interactive Elements:**
  - Filter bar: Khối lớp (Grade), Lớp học (Class), Môn học (Subject), Học kỳ (Semester 1 / Semester 2 / Cả năm).
  - Spreadsheet table: Student name, score columns (Kiểm tra miệng, 15 phút, 1 tiết, Giữa kỳ, Cuối kỳ), and calculated Average Score.
  - Inline score editing with instant numerical validation (`0.0` to `10.0`).

---

### 2.3 Module 3: Tài Chính (Finance)

#### SCR-FIN-01: Quản Lý Học Phí & Hóa Đơn (`/school/fee`)
- **Primary Purpose:** Student tuition invoice master list and billing lifecycle control.
- **Interactive Elements:**
  - Class selector dropdown, Invoice creation date range picker ("Từ ngày tạo HĐ" - "Đến ngày tạo HĐ" evaluating against `createdAt`), Search input (name, student code, invoice number).
  - Multi-criteria filter modal ("Lọc mở rộng học phí"): Status (Đã tạo, Đã gửi, Đã thanh toán, Nộp một phần, Quá hạn, Đã hủy), Payment method, Grade level, Deductions/refunds, Electronic invoice toggle.
  - Student billing roster table: Student profile, invoice code, amount, status pill, dynamic action buttons (Gửi, Thu tiền, In hóa đơn, Xem lịch sử, Hủy hóa đơn).
  - Invoice detail modal: itemized billing line items, attendance meal deduction credit line, payment history log, and dynamic VietQR code.
  - Bulk actions: "Tạo hóa đơn hàng loạt", "Gửi hóa đơn", "Xác nhận thanh toán", "Xuất Excel".

#### SCR-FIN-02: Danh Mục Khoản Phí (`/school/school-fees`)
- **Primary Purpose:** Master fee catalog setup.
- **Interactive Elements:**
  - Fee item creation modal: Tên khoản phí, Loại phí (Bắt buộc / Tự nguyện), Chu kỳ (Tháng / Kỳ / Năm / Một lần), Đơn giá chuẩn.
  - Action menu: Chỉnh sửa, Tạm ngưng, Kích hoạt.

#### SCR-FIN-03: Cấu Hình Học Phí Theo Lớp (`/school/tuition-management`)
- **Primary Purpose:** Mapping fee catalog items to specific classes or student cohorts.
- **Interactive Elements:**
  - Class matrix table showing applied fee packages and customized pricing rules.

#### SCR-FIN-04: Quản Lý Khoản Chi (`/school/expenses`)
- **Primary Purpose:** Expense voucher tracking and disbursement approvals.
- **Interactive Elements:**
  - Expense creation modal: Mã phiếu chi, Danh mục chi, Người nhận tiền, Số tiền, Ngày chi, Chứng từ đính kèm (Receipt images).
  - Status tracker: Chờ duyệt, Đã duyệt, Đã chi, Đã hủy (with cancellation reason audit).

#### SCR-FIN-05: Đối Soát Giao Dịch (`/school/reconciliation`)
- **Primary Purpose:** Payment session and gateway settlement reconciliation.
- **Interactive Elements:**
  - Session selector, gateway transaction filter, summary totals (Tổng số GD, Tổng tiền nhận, Phí cổng thanh toán, Số dư đối soát).
  - Discrepancy resolution modal for manual transaction matching.

#### SCR-FIN-06: Báo Cáo Học Phí (`/reports/fee/overview`)
- **Primary Purpose:** Tuition collection rate analytics and executive dashboard.
- **Interactive Elements:**
  - Donut chart displaying school-wide collection breakdown (Paid / Partial / Unpaid).
  - Class comparison bar charts showing collection rate percentages.

#### SCR-FIN-07: Danh Sách Chính Sách Miễn Giảm (`/school/discount`)
- **Primary Purpose:** Master discount & fee exemption policy catalog and beneficiary overview.
- **Interactive Elements:**
  - Top header toolbar: Action buttons "+ Thêm chính sách miễn giảm" and "Xuất Excel" (.xlsx).
  - Status filter tabs: "Tất cả", "Đang hoạt động", "Ngừng áp dụng", "Hết hạn".
  - Search input: Real-time text filter by policy code, policy name, applied fee item name, or reason.
  - Policy roster table (full-width layout `w-full space-y-6`):
    - Columns: Mã chính sách (e.g. `MG-2026-001`), Tên chính sách, Khoản thu áp dụng (badge), Mức miễn giảm (% hoặc dot-separated VND), Nhóm áp dụng (icon + count badge e.g. "3 Lớp" or "5 Học sinh"), Thời gian áp dụng (Năm học hoặc Từ tháng - Đến tháng), Trạng thái (green badge "Hoạt động", gray "Ngừng áp dụng", yellow/red "Hết hạn"), Thao tác (`•••`).
    - Clickable beneficiary count badge opening popup modal with beneficiary list.
    - Row action menu `•••`: "Xem chi tiết", "Chỉnh sửa chính sách", "Tạm dừng áp dụng" / "Kích hoạt lại", "Xóa chính sách" (prompts confirmation modal).

#### SCR-FIN-08: Modal Thêm / Chỉnh Sửa Chính Sách Miễn Giảm
- **Primary Purpose:** Form authoring for discount policies with dual scope configuration and validation.
- **Interactive Elements:**
  - Tên chính sách* input (required, min 3 chars).
  - Loại miễn giảm*: Segmented control ("Giảm theo %" vs "Giảm theo số tiền cố định").
  - Mức miễn giảm*: Number input with dynamic unit label (`%` 1–100 or `đ` with dot-separated currency formatting).
  - Áp dụng cho khoản thu*: Dropdown selecting from master fee catalog items (Học phí, Tiền ăn, Xe đưa đón, Hoạt động ngoại khóa...).
  - Nhóm áp dụng*: Segmented control ("Lớp học" vs "Học sinh").
    - If "Lớp học": Multi-select class dropdown with tags and "Chọn tất cả".
    - If "Học sinh": Student selector modal trigger button showing selected count badge, with searchable student picker modal (cross-class student list with checkboxes).
  - Thời gian áp dụng*: Segmented control ("Theo năm học" vs "Theo khoảng thời gian").
    - If "Theo năm học": Academic year dropdown.
    - If "Theo khoảng thời gian": Month pickers `Từ tháng/năm` đến `Đến tháng/năm`.
  - Lý do miễn giảm: Multi-line textarea for administrative audit notes.
  - Action buttons: "Hủy bỏ", "Lưu chính sách".

#### SCR-FIN-09: Tích Hợp Tạo Hóa Đơn Học Phí - Toggle Miễn Giảm (`/school/fee/create`)
- **Primary Purpose:** Tuition invoice generation wizard with automated discount deductions preview.
- **Interactive Elements:**
  - Step 1 Config: Administrative toggle switch "Tự động áp dụng chính sách miễn giảm" (default ON, green accent). Helper text: "Tự động trừ tiền theo các chính sách miễn giảm hợp lệ của học sinh/lớp trong đợt thu này".
  - Step 2 Preview: Roster table displaying gross tuition, excused absence meal refund, itemized discount deduction line (`-X VND` with policy name tooltip), and net final payable amount.

---

### 2.4 Module 4: Nhà Trường (School Administration) Screens

#### SCR-SCH-01: Danh Sách Học Sinh (`/school/kid/`)
- **Primary Purpose:** Institutional student roster with search, class filter, extended filters, and student lifecycle actions.
- **Interactive Elements:**
  - Academic year selector in top-right header ("Năm học 2025 - 2026", "Hiện tại").
  - Search bar matching student name and student code; class dropdown filter.
  - "Lọc mở rộng" modal filter with "Thời gian nhập học" and "CSDL Sở" criteria.
  - Student table columns: Học sinh (avatar, name, student code badge, optional 📄 note indicator), Lớp học (homeroom class with optional "Ngoại khóa: {tên lớp}" subline), Trạng thái, Giới tính, Tạo bởi, Thao tác (`•••` action dropdown: `Xem chi tiết`, `Cập nhật`, `Lưu trữ`, `Chuyển lớp`, `Xóa`).
  - Action buttons: "+ Thêm học sinh" (links to `/school/kid/create/`), "..." bulk actions dropdown ("Chuyển năm học" modal).
  - Modals: "Ghi chú học sinh", "Cập nhật thông tin học sinh", "Chuyển năm học", "Xác nhận xóa học sinh".

#### SCR-SCH-02: Chi Tiết Học Sinh & Profile Hub (`/school/kid/detail/[id]/`)
- **Primary Purpose:** 360-degree comprehensive profile hub for an individual student.
- **Interactive Elements:**
  - Student header card with avatar, name, student code, birthdate, homeroom class badge, and action shortcuts (`Cập nhật`, `Chuyển lớp`, `Lưu trữ`).
  - Primary Tab navigation bar:
    1. **Tab "Hồ Sơ":** Master identity data, expandable "Thông tin phụ huynh" cards (supporting Mother, Father, Guardian, and displaying "Phụ huynh của học sinh" cross-sibling links), "Thông tin học phí" override card (Học phí đ/tháng, Tiền ăn đ/ngày), "Chiều cao / cân nặng" card (opens "Lịch sử phát triển" modal with BMI calculation), and "Thông tin mở rộng".
    2. **Tab "Hoạt Động":** Embedded class activity feed pre-filtered to the current student.
    3. **Tab "Thư Viện":** Embedded photo albums pre-filtered by face recognition tags for this student.
    4. **Tab "Điểm Danh":** Monthly attendance records and history for this student.
    5. **Tab "Học Phí":** Invoice ledger and payment history for this student.

#### SCR-SCH-03: Thêm Học Sinh Mới (`/school/kid/create/`)
- **Primary Purpose:** Dedicated onboarding form for enrolling new students into the school system.
- **Interactive Elements:**
  - Information sections: "Thông tin học sinh" (Mã học sinh*, Họ và tên*, Biệt danh, Số CCCD*, Ngày sinh, Giới tính, Lớp học, Ngày ghi danh, Ghi chú).
  - Collapsible "Thông tin học phí" card (Học phí đ/tháng, Tiền ăn đ/ngày, Ghi chú học phí).
  - Collapsible "Chiều cao / Cân nặng" card (Initial height in cm, initial weight in kg).
  - Action footer: "Hủy bỏ" (navigates back to directory) and "Thêm" (submits new student and redirects to detail profile).

#### SCR-SCH-04: Danh Sách Giáo Viên (`/school/teacher/`)
- **Primary Purpose:** Faculty and staff directory with class assignments and contact information.
- **Interactive Elements:**
  - Search input with substring case-insensitive matching across name and email.
  - Class filter dropdown matching both homeroom and teaching classes.
  - "Lọc mở rộng" modal with CSDL Sở flag.
  - Faculty table columns: Họ và tên (avatar, name, email), Lớp học (homeroom badge and assigned teaching classes), Thông tin liên hệ (phone, email), Địa chỉ, Trạng thái, Thao tác (`•••` dropdown: `Xem chi tiết`, `Cập nhật`, `Xóa`).
  - Action button: "+ Thêm giáo viên" (links to `/school/teacher/create/`).

#### SCR-SCH-05: Chi Tiết & Chỉnh Sửa Giáo Viên (`/school/teacher/info/[id]/`)
- **Primary Purpose:** Teacher profile and credential administration.
- **Interactive Elements:**
  - Faculty profile card with staff code, phone, email, address, DOB.
  - "Lớp chủ nhiệm" and "Lớp phụ trách" visual breakdowns.
  - "Phân quyền" badge ("Giáo viên chính" with auto-publish badge vs "Giáo viên hỗ trợ" with moderation badge and hover tooltip ⓘ).
  - "Thông tin bổ sung" card: CCCD, Chức vụ, Ngày vào làm, Bằng cấp, Kỹ năng khác, Bộ phận.
  - Security actions: "Thay đổi email" (opens dedicated modal), "Đổi mật khẩu" (links to `/setting/users/{id}/change-password/`).

#### SCR-SCH-06: Thêm Giáo Viên Mới (`/school/teacher/create/`)
- **Primary Purpose:** Dedicated onboarding form for provisioning faculty accounts and dispatching invitations.
- **Interactive Elements:**
  - Form fields: Email*, Mật khẩu khởi tạo*, Họ và tên*, Mã nhân viên, Số điện thoại, Địa chỉ, Ngày sinh, Lớp phụ trách (multi-select), Phân quyền ("Giáo viên chính" vs "Giáo viên hỗ trợ").
  - Collapsible "Thông tin bổ sung" section.
  - Action footer: "Hủy bỏ" and "Tạo và gửi lời mời" (dispatches invitation and auth credentials).

#### SCR-SCH-07: Quản Lý Lớp Học (`/school/class/`)
- **Primary Purpose:** School class catalog with dual taxonomy (Curricular vs Extracurricular).
- **Interactive Elements:**
  - Top tab switcher: "Lớp chính khóa" and "Lớp ngoại khóa" (with orange badge).
  - Grade level dropdown filter (visible only on "Lớp chính khóa" tab).
  - "Lọc mở rộng" modal with "Phân loại GV" (GV thường / GV chủ nhiệm), "Giáo viên cụ thể", and "CSDL Sở".
  - Class table columns: Lớp học (name, grade level), Số học sinh, Giáo viên (GVCN and assigned staff), Số hoạt động, Thao tác (`•••` dropdown).
  - Deletion constraint: "Xóa" is visible in `•••` action dropdown only if `studentCount === 0`.
  - Action button: "+ Thêm lớp học" (links to `/school/class/create/`).

#### SCR-SCH-08: Chi Tiết Lớp Học (`/school/class/info/[id]/`)
- **Primary Purpose:** Comprehensive class management overview with cross-module summaries.
- **Interactive Elements:**
  - Top navigation tabs: Curricular class has 4 tabs ("Chi Tiết", "Hoạt Động", "Điểm Danh", "Học Phí"); Extracurricular class has 3 tabs ("Chi Tiết", "Hoạt Động", "Điểm Danh").
  - Embedded sections on "Chi Tiết": Basic Info, GVCN profile card, "Thông tin học phí" (6 line items for curricular class, 1 line item for extracurricular), "Danh sách học sinh", "Thông tin đánh giá", and "Phân công bộ môn".

#### SCR-SCH-09: Thêm Lớp Học (`/school/class/create/`)
- **Primary Purpose:** Class creation form with dynamic taxonomy switching.
- **Interactive Elements:**
  - Toggle switch: "Ngoại khóa".
  - Dynamic fields: Turning toggle off renders Tên lớp*, Khối lớp*, GV chủ nhiệm, Điểm & Đánh giá. Turning toggle on hides Khối lớp and Đánh giá, rendering multi-select "Giáo viên phụ trách".
  - Action footer: "Hủy bỏ" and "Thêm".

#### SCR-SCH-10: Danh Mục Môn Học (`/school/subject/`)
- **Primary Purpose:** Master subject catalog organized by 4 educational tiers.
- **Interactive Elements:**
  - Educational tier tab switcher: `TH` (Tiểu học), `THCS` (Trung học cơ sở), `THPT` (Trung học phổ thông), `GDTX` (Giáo dục thường xuyên).
  - Academic year selector dropdown.
  - Search input with diacritic-insensitive matching.
  - Subject table columns: Tên môn học (subject name link, code badge, and up to 3 teacher names with "+N GV" button), Kiểu môn học (badge: Môn học, Hoạt động giáo dục, Môn tính điểm, Môn nhận xét), Loại môn học (Bắt buộc, Tự chọn, Lựa chọn), Tính tổng kết (toggle pill), Thao tác (`•••` dropdown).

#### SCR-SCH-11: Chi Tiết Môn Học (`/school/subject/info/[id]/`)
- **Primary Purpose:** Read-only syllabus evaluation matrix and administrative faculty assignment.
- **Interactive Elements:**
  - Two-column header cards: "Khối lớp áp dụng" on left; "Cấu hình môn học" on right.
  - Read-only "Phương thức đánh giá" table displaying Point, Evaluation Level, and Comment rubrics across 4 evaluation terms (Giữa HK1, HK1, Giữa HK2, Cuối năm).
  - "Danh sách giáo viên" table listing assigned teaching teachers and their assigned classes.
  - Actions: "+ Thêm giáo viên" button (modal with deduplicated faculty dropdown) and delete trash icon next to each teacher with confirmation modal.

#### SCR-SCH-12: Danh Mục Khối Lớp (`/school/grades/`)
- **Primary Purpose:** Grade level hierarchy oversight across 4 educational tiers.
- **Interactive Elements:**
  - Educational tier dropdown filter (`Tất cả cấp học`, `TH`, `THCS`, `THPT`, `GDTX`).
  - Reactive search input with client-side instant filtering and auto-reload on clear.
  - Grade level table columns: Tên khối (link and level badge `Cấp: {cấp}`), Mã khối badge, Số học sinh, Số lớp, Thao tác (eye icon viewing details).

#### SCR-SCH-13: Chi Tiết Khối Lớp (`/school/grades/info/[id]/`)
- **Primary Purpose:** Metric aggregation and class listing for an individual grade level.
- **Interactive Elements:**
  - Top 4 metric stat cards: Mã khối, Cấp học, Số học sinh, Số lớp.
  - "Danh sách lớp học" table listing all classes in the grade, homeroom teacher (GVCN link), student headcount, and teacher total.

### 2.5 School Administration Phase 2 (Nhà Trường) Screen Inventory

#### SCR-SCH-14: Danh Sách Bảng Thông Tin (`/announcement/`)
- **Primary Purpose:** Announcement broadcasting hub with status tracking, category filters, and bulk actions.
- **Interactive Elements:**
  - Status filter dropdown (`Bản nháp`, `Chưa gửi`, `Đã gửi`), Category dropdown (6 business types), Search input.
  - Primary button "+ Tạo thông báo" and contextual "Xóa thông báo" (visible when row checkboxes are checked).
  - Announcement table: Checkbox column, Tiêu đề (link with sublines for audience and channel), Trạng thái pill, Đã xem count, Thao tác (`•••` dropdown).

#### SCR-SCH-15: Tạo Thông Báo Mới (`/announcement/create/`)
- **Primary Purpose:** Multi-channel rich announcement composer with scheduling.
- **Interactive Elements:**
  - Two-column configuration grid: Kênh thông báo (App, Email, App & Email), Loại thông báo (6 categories), Tạo thông báo cho (Toàn trường, GV, PH, Lớp học, Cá nhân), Người nhận.
  - Conditional class picker: Appears with class multi-select when audience is "Lớp học".
  - Tiêu đề* input, Rich Text body editor with formatting toolbar, Attachment file dropzone.
  - Ngày gửi datepicker (blank = immediate, future date = scheduled), Include future accounts toggle.
  - Action footer: "Hủy bỏ", "Xem trước" (modal simulation), "Lưu bản nháp", "Gửi".

#### SCR-SCH-16: Chi Tiết & Thống Kê Thông Báo (`/announcement/[id]/`)
- **Primary Purpose:** Read-only inspection of published announcements and view counts.
- **Interactive Elements:**
  - Metadata badges: Kênh, Loại, Đối tượng, Gửi đến, Người nhận, Trạng thái (sent timestamp), Đã xem metric counter.
  - Rendered rich-text content body and downloadable attachment list.
  - Action buttons: "Xoá" (all states), "Chỉnh sửa" and "Gửi" (draft state only).

#### SCR-SCH-17: Chỉnh Sửa Thông Báo Bản Nháp (`/announcement/edit/[id]/`)
- **Primary Purpose:** Updating unpublished announcement drafts.
- **Interactive Elements:**
  - Pre-populated form fields matching SCR-SCH-15.
  - Action footer: "Hủy bỏ" (with dirty form unsaved changes warning), "Lưu bản nháp", "Gửi".

#### SCR-SCH-18: Danh Sách Bình Chọn (`/school/poll/`)
- **Primary Purpose:** Overview of active and closed surveys.
- **Interactive Elements:**
  - Filter dropdown for Status (`Đã tạo`, `Đã gửi`, `Đã đóng`), Class dropdown filter, Search input.
  - Primary button "+ Tạo bình chọn".
  - Poll table: Chủ đề (link with deadline subline), Gửi đến pills, Thời hạn, Trạng thái pill, Thao tác (`•••` dropdown: Edit, Dispatch, Delete only on `Đã tạo`).

#### SCR-SCH-19: Tạo Bình Chọn Mới (`/school/poll/create/`)
- **Primary Purpose:** Survey question and option builder.
- **Interactive Elements:**
  - Form fields: Chủ đề*, Mô tả (rich text), Thời hạn bình chọn* (datetime picker), Cover image upload.
  - Dynamic options list: Option text inputs (minimum 2), "+ Thêm" button, delete option buttons.
  - Configuration switches: "Chọn nhiều phương án" and "PH được xem kết quả bình chọn".
  - Action footer: "Hủy bỏ" and "Tạo bình chọn".

#### SCR-SCH-20: Chi Tiết & Kết Quả Bình Chọn (`/school/poll/[id]/`)
- **Primary Purpose:** Real-time survey dashboard with dynamic visualization.
- **Interactive Elements:**
  - Overview section: Title, expandable description ("Xem thêm" / "Thu gọn"), deadline pill, total votes.
  - Option analytics: Progress bars with vote counts and percentages for all options.
  - Dynamic SVG pie chart: Conditionally mounted when `totalVotes > 0`.
  - "Danh sách đã bình chọn" roster: Student avatar, name, class, selected option, voted timestamp.
  - "Lịch sử thay đổi" icon on each respondent opening VoteHistoryModal with timestamped option switches.

#### SCR-SCH-21: Danh Sách Thực Đơn Tuần (`/school/menu/`)
- **Primary Purpose:** Weekly nutritional menu calendar and roster.
- **Interactive Elements:**
  - 8-week horizon calendar selector and week switcher.
  - Class filter dropdown, Format toggle ("Sử dụng file" filter), Month picker.
  - Action buttons: "+ Tạo thực đơn" and "..." menu ("Tạo thực đơn bằng file").
  - Menu table: Tuần học, Thực đơn cho (Toàn trường vs Class names), Hình thức (Lưới vs File badge), Trạng thái, Thao tác (`•••` dropdown with asymmetric cloning).

#### SCR-SCH-22: Tạo Thực Đơn Lưới / Tải File (`/school/menu/create/`)
- **Primary Purpose:** Weekly meal menu authoring interface.
- **Interactive Elements:**
  - Header controls: "Thực đơn cho" selector (Toàn trường vs Lớp học), Week datepicker (bounded to 8 weeks ahead).
  - Toggle switch "Sử dụng file": Switching on displays file/image dropzone with sample template download link; switching off renders Mon–Sat $\times$ 3-meal interactive grid.
  - Grid cell editors: Add multiple dishes per meal slot, dish title inputs, ingredient traceability trigger icons.
  - Action footer: "Hủy bỏ", "Lưu bản nháp", "Gửi".

#### SCR-SCH-23: Chi Tiết Thực Đơn & Truy Xuất Nguồn Gốc (`/school/menu/[id]/`)
- **Primary Purpose:** Detailed menu inspection, ingredient provenance, and send history.
- **Interactive Elements:**
  - Grid menu view displaying dishes per day/meal with ingredient status badges (`N thực phẩm` vs `Chưa nhập`).
  - Read-only ingredient provenance modal detailing GTIN, lot number, supplier name, and status (`Đạt chuẩn` vs `Chưa truy xuất`).
  - "Lịch sử gửi thực đơn" modal tracking publication timestamps and broadcast modes.

#### SCR-SCH-24: Bảng Chấm Công Điểm Danh NV (`/school/staff-attendance/`)
- **Primary Purpose:** Daily rapid staff attendance roster.
- **Interactive Elements:**
  - Header controls: 45-day past datepicker (future dates locked), Class filter, Role filter, Search input, A-Z / Z-A sort icon.
  - Top 3 summary KPI counters: Tham dự (green), Vắng có phép (amber), Vắng không phép (red) — automatically hidden during text search.
  - Staff table: Avatar, display name, full name, staff code, role badges.
  - Rapid clock-in buttons: Single-click "Check-In" (blue) and "Check-Out" (gold) buttons updating to time badges with inline edit popovers.
  - Absence switch: Toggling "Vắng" opens AbsentMarkingModal (`Có phép` vs `Không phép`, reason note).
  - Inline note editor: Free-form text note input auto-saving on blur.

#### SCR-SCH-25: Điểm Danh NV Theo Lớp (`/school/[classId]/staff-attendance/`)
- **Primary Purpose:** Class-scoped staff attendance view for homeroom and teaching faculty.
- **Interactive Elements:**
  - Scoped roster displaying only staff assigned to the active class. Same rapid clock-in and absence interaction standards as SCR-SCH-24.

#### SCR-SCH-26: Cây Danh Mục Sổ Tay PH (`/school/handbook/`)
- **Primary Purpose:** 2-tier parent handbook and FAQ knowledge base.
- **Interactive Elements:**
  - Left pane: 2-tier category tree with single-sibling accordion behavior.
  - Category actions: "+ Thêm danh mục" at root level, "+ Thêm danh mục" inside root categories (creates sub-category), and "+ Thêm bài viết" inside sub-categories.
  - Sibling drag-and-drop handles on sub-categories and articles.
  - Category context menu `•••`: "Chỉnh sửa danh mục" and "Xóa danh mục" (triggers cascading deletion warning modal).
  - Right pane: Active article rich-text reader displaying category breadcrumbs, author metadata, and attachments.

#### SCR-SCH-27: Soạn & Chỉnh Sửa Bài Viết Sổ Tay PH (`/school/handbook/article/create/` & `.../edit/`)
- **Primary Purpose:** Rich-text article authoring and publishing.
- **Interactive Elements:**
  - Category breadcrumb bar: Fixed read-only path indicating target parent category.
  - Tiêu đề* input.
  - Full rich-text editor: Headings H1/H2, bold/italic/underline/strikethrough, quote blocks, text/background colors, lists, indentations, hyperlinks.
  - Attachment upload area.
  - Action footer: "Hủy bỏ", "Lưu nháp", "Lưu & Xuất bản" (or "Chỉnh sửa & Xuất bản").

---

### 2.6 School Administration Phase 3 Screens (Góp Ý, Lịch Sự Kiện, Năm Học, Lưu Trữ)

#### SCR-SCH-28: Hộp Thư Góp Ý (`/school/feedback/`)
- **Primary Purpose:** Ticket-based parent feedback inbox with dual-purpose filter status cards.
- **Interactive Elements:**
  - Top header controls: Academic year dropdown selector (default: active year with "Hiện tại" badge), date range picker, search bar.
  - 4 status filter cards: "Yêu cầu mới" (blue `+`), "Đang xử lý" (purple spin), "Hoàn tất" (green check), "Mở lại" (amber reset). Selecting a card filters table while cards retain global independent counts; active card displays highlighted border and "Xóa bộ lọc" link.
  - Filter toolbar: Feedback category dropdown (8 fixed categories), handler dropdown (school staff), priority dropdown (Thấp, Trung bình, Cao, Khẩn cấp), waiting status dropdown ("Chờ phản hồi từ phụ huynh" vs "Chờ phản hồi từ nhà trường").
  - Feedback table:
    - Columns: Mã phiếu, Tiêu đề & trích đoạn, Loại góp ý, Học sinh & Lớp, Người gửi, Ngày gửi, Người xử lý (inline assignment dropdown), Độ ưu tiên (inline color chip dropdown), Trạng thái (status chip), Thao tác (`•••`).
    - Action menu `•••`: "Xem chi tiết", "Đổi người xử lý", "Đóng góp ý" (if not already completed).
  - Empty state: "Chưa có góp ý", "Tổng: 0".

#### SCR-SCH-29: Chi Tiết Góp Ý & Thảo Luận (`/school/feedback/[id]/`)
- **Primary Purpose:** Two-way threaded discussion view with contextual student and guardian profile cards.
- **Interactive Elements:**
  - Header & Breadcrumb: Back to list link, ticket title, status badge, priority chip, action buttons ("Đổi người xử lý", "Đóng góp ý" prompting confirmation modal GY-01).
  - Left pane: Original feedback submission body with attachments, followed by chronological threaded discussion stream. Message bubbles indicate author (School staff vs Parent), timestamp, and image previews.
  - Discussion composer: Rich-text message input, image attachment button, "Gửi" button (disabled when input is whitespace-only). Submitting automatically switches `waitingOn` to 'parent'.
  - Right pane (3 Contextual Cards):
    1. "Thông tin góp ý": Category, created timestamp, assigned handler, linked student (clickable), linked class (links to `/school/class/[id]/`).
    2. "Thông tin người tạo": Parent full name (clickable), relationship, phone number, email.
    3. "Góp ý gần đây": Collapsible list of previous tickets submitted by the same parent/student with status badges (or "Không có góp ý gần đây").

#### SCR-SCH-30: Modal Thông Tin Học Sinh & Phụ Huynh Góp Ý
- **Primary Purpose:** Read-only contextual quick-view overlays accessed from ticket details.
- **Interactive Elements:**
  - Modal "Thông tin học sinh": Left avatar, right field grid (Họ tên, Mã học sinh, Ngày sinh, Giới tính, Lớp, Phụ huynh, Địa chỉ).
  - Modal "Thông tin phụ huynh": Left avatar, right field grid (Họ tên, Quan hệ với học sinh, Số điện thoại, Email, Nghề nghiệp).
  - Read-only indicator with "Đóng" button.

##### SCR-SCH-31: Lịch Sự Kiện Tổng Quan & 3 Chế Độ Xem (`/school/calendar/`)
- **Primary Purpose:** Institutional event scheduling calendar with synchronized 3-view topology (C051, C052).
- **Interactive Elements:**
  - Top header toolbar: Year selector (2021-2030+ with prev/next buttons and quick year picker), "+ Thêm sự kiện" primary button (links to `/school/calendar/create/`).
  - View switcher segmented control:
    1. View "Năm": 12-month mini-grid matrix showing day cells with category color bars indicating event spans, and a bottom "Chú thích" color legend banner with event counts.
    2. View "Tháng": Detailed 7-column calendar grid (Thứ 2 - Chủ nhật) with month navigation. Multi-day events render as horizontal continuous colored bars across spanning days. Clicking any event opens read-only inspection modal.
    3. View "Sự kiện" (Danh sách): Chronological list layout with tear-away style calendar date blocks (large day number, uppercase month label), event title, category badge, time/date interval, location, description excerpt, scope filter ("Sự kiện sắp tới" vs "Tất cả sự kiện"), and direct inline edit (pencil) and delete (trash) action buttons.
  - Empty state: "Chưa có sự kiện nào trong khoảng thời gian đã chọn", "Tổng: 0".

#### SCR-SCH-32: Soạn & Chỉnh Sửa Sự Kiện (`/school/calendar/create/` & `/school/calendar/edit/[eventId]/`)
- **Primary Purpose:** Dedicated event authoring pages with automated single-day date synchronization and granular time resolution (C053).
- **Interactive Elements:**
  - Header & Breadcrumb: Navigation back to `/school/calendar/` (guarded by unsaved changes modal `LS-02` if form is dirty).
  - Ảnh đại diện sự kiện (cover image upload / preview).
  - Tiêu đề sự kiện* text input.
  - Loại sự kiện* dropdown (3 fixed types with colors): "Ngày nghỉ" (Rose `#E11D48`), "Sự kiện nội bộ" (Teal `#0D9488`), "Sự kiện có mời phụ huynh" (Amber `#EA580C`).
  - Date selectors: "Từ ngày"* datepicker, "Đến ngày"* datepicker. Selecting "Từ ngày" auto-populates "Đến ngày" if empty (K014).
  - Time toggle: "Thêm thời gian" checkbox enabling "Giờ bắt đầu" (`HH:mm`) and "Giờ kết thúc" (`HH:mm`) time pickers.
  - Địa điểm input.
  - Mô tả sự kiện: Rich-text editor supporting bold, italic, underline, hyperlinks, and bullet lists.
  - File đính kèm: Upload documents (PDF, Word, images).
  - Action footer: "Hủy bỏ" (with dirty state guard) and "Lưu sự kiện" (or "Cập nhật sự kiện").

#### SCR-SCH-33: Modal Chi Tiết Sự Kiện & Modal Xác Nhận Xóa
- **Primary Purpose:** Single-event inspection overlay and deletion confirmation safeguards.
- **Interactive Elements:**
  - Modal "Chi tiết sự kiện": Header with calendar icon, event title, category pill, date/time interval, location, formatted description body, attachment file list. Top-right pencil icon navigates directly to `/school/calendar/edit/[eventId]/`. "Đóng" button.
  - Modal "Xác nhận xóa sự kiện" (`LS-01`): Prompt "Vui lòng xác nhận xóa sự kiện {tên sự kiện}". Action buttons: "Hủy" and "Xác nhận xóa" (dispatches Redux deletion and displays success toast).

#### SCR-SCH-34: Quản Lý Năm Học & Học Kỳ (`/school/academic-year/`)
- **Primary Purpose:** Academic year and semester configuration master table.
- **Interactive Elements:**
  - Top action button: "+ Thêm năm học".
  - Master table:
    - Columns: Tên năm học, Khoảng thời gian (Từ ngày - Đến ngày), Số học kỳ, Trạng thái (green badge "Hiện tại" for active interval, grey "Đã kết thúc", blue "Sắp tới"), Thao tác (`•••`).
    - Expandable accordion rows revealing sub-terms: Học kỳ 1, Học kỳ 2, Học kỳ hè with respective date ranges and active indicators.
    - Row action menu `•••`: "Chỉnh sửa năm học", "+ Thêm học kỳ", "Xem danh sách lớp". "Xóa" is permanently hidden/disabled (K015).
  - System warning footer: "Năm học liên kết trực tiếp với dữ liệu điểm danh, học phí và học sinh. Không thể xóa năm học đã phát sinh dữ liệu."

#### SCR-SCH-35: Modal Thêm / Chỉnh Sửa Năm Học & Học Kỳ
- **Primary Purpose:** Academic term interval authoring with overlap validation.
- **Interactive Elements:**
  - Modal "Thêm năm học": Tên năm học* (e.g. "2026 - 2027"), Từ ngày*, Đến ngày*. System validates interval non-overlap against existing academic years (error NH-03).
  - Modal "Thêm học kỳ": Năm học (locked read-only dropdown), Tên học kỳ* (e.g. "Học kỳ 1"), Từ ngày*, Đến ngày*. Validates dates fall strictly within parent academic year interval (error NH-04).
  - Action buttons: "Hủy bỏ", "Lưu".

#### SCR-SCH-36: Danh Sách Học Sinh Lưu Trữ (`/school/archive/`)
- **Primary Purpose:** Cold storage directory for withdrawn, transferred, and graduated students.
- **Interactive Elements:**
  - Top header toolbar: Archive reason filter ("Thôi học", "Chuyển trường", "Tốt nghiệp"), search bar (name, student code, former class), export button.
  - Archived student table:
    - Columns: Mã học sinh, Họ và tên, Lớp cũ, Ngày sinh, Giới tính, Lý do lưu trữ (badge), Ngày lưu trữ, Người thực hiện, Ghi chú, Thao tác (`•••`).
    - Row action menu `•••`: "Xem hồ sơ lưu trữ", "Khôi phục học sinh", "Xóa vĩnh viễn".
  - Summary footer: "Tổng số học sinh lưu trữ: N".

#### SCR-SCH-37: Modal Khôi Phục & Modal Xóa Vĩnh Viễn 2 Bước
- **Primary Purpose:** Life-cycle state change modals for archived student records.
- **Interactive Elements:**
  - Modal "Khôi phục học sinh": Displays student name, former class, and active academic year class availability. Prompt: "Khôi phục học sinh {tên} về danh sách học sinh đang học?". Buttons: "Hủy bỏ", "Xác nhận khôi phục".
  - Modal "Xóa vĩnh viễn" - Bước 1: Red warning header with hazard icon. Text: "Hành động này sẽ xóa hoàn toàn hồ sơ học sinh {tên} cùng toàn bộ lịch sử điểm danh, học phí, đánh giá. Thao tác không thể hoàn tác!". Checkbox: "Tôi đã hiểu và chịu trách nhiệm về thao tác này". Button: "Tiếp tục".
  - Modal "Xóa vĩnh viễn" - Bước 2: Confirmation challenge input. User must type "XAC NHAN XOA" or the exact student code to activate the red "Xóa vĩnh viễn ngay" button.

---

### 2.6 Module 6: Cấu Hình (Settings)

#### SCR-SET-01: Bảng Điều Khiển Cấu Hình Học Phí (`/setting/fee/`)
- **Primary Purpose:** Institutional financial configuration dashboard hosting 5 independent form blocks with isolated dirty states and independent Save buttons (`BR01`).
- **Interactive Elements:**
  - **Khối 1: Ghi chú hóa đơn học phí:** Multiline textarea for policy footer text printed on tuition notices; independent "Lưu" button enabled strictly upon text modification (`UC-01`).
  - **Khối 2: Thanh toán tự động - Dịch vụ Sepay (`C044`):** The Sepay automated payment block provides read-only inspection of API secrets and webhook endpoints with eye reveal toggles and monthly transaction log filtering. No save button (`BR02`). Direct link button "Lịch sử giao dịch" navigating to `/setting/fee/payment-history/` (`BR16`).
  - **Khối 3: Cấu hình hóa đơn điện tử SInvoice:** Master toggle switch. When OFF, collapses card body completely (`BR04`). When ON, reveals 6 mandatory fields marked with red `*` (Mã số thuế, Tên tài khoản, Mật khẩu - permanently masked `type="password"`, Mẫu hóa đơn, Loại hóa đơn, Ký hiệu hóa đơn) and 2 toggle switches (Tự động tạo HĐĐT, Tách HĐĐT) (`BR05`, `BR06`). Independent "Lưu" button.
  - **Khối 4: Cấu hình trả trễ & cơ chế hoàn tiền ăn (`C048`, `C049`):**
    - *Về muộn:* Toggle switch (disables inner controls without hiding when OFF, `BR08`). Radio selector for 2 calculation modes: "Theo giờ cố định" (5–60 mins step 5 combobox + hourly rate in VND, `BR11`) vs "Theo khung giờ" (dynamic bracket table with Giờ bắt đầu, Giờ kết thúc, Số tiền; Row 1 has no trash icon, delete icon appears when $\ge 2$ rows, `BR13`).
    - *Cơ chế hoàn tiền ăn (2 nhóm ngày vắng):*
      - **Nhóm A (Ngày nghỉ lễ / Sự kiện của trường):** Read-only informational card with green checkmark: *"Hệ thống tự động áp dụng hoàn 100% cho các ngày nghỉ lễ và sự kiện do trường thiết lập (Tiền ăn: 100%, Tiền ăn sáng: 100%). Nhà trường không cần nhập % cho nhóm này."*
      - **Nhóm B (Ngày học sinh tự nghỉ):** Dual number input fields: Tiền ăn % (0–100, default 50%) và Tiền ăn sáng % (0–100, default 70%). Interactive live calculation preview widget simulating the September scenario (Tự nghỉ 3 ngày + Lễ 1 ngày $\rightarrow$ Hoàn 162.000đ).
      - *Điều kiện giờ báo vắng:* Toggle switch & 0–100 hours combobox (`BR12`). When ON, renders school Operating Hours table (Mon–Sat, `BR09`) and conditional notice; when OFF, hides table and applies unconditional refund (`BR10`). Independent "Lưu" button.
  - **Khối 5: Cấu hình đối soát học phí:** Email text input, "Thêm" button, list of email tag pills with trash delete icon. Inline error *"Email không hợp lệ"* (`ERR-HP-01`) on invalid format, inline error *"Email đã tồn tại trong danh sách"* (`ERR-HP-02`) on duplicate. Maximum 3 emails; locks input and Add button when cap is reached (`BR14`). Independent "Lưu" button.
  - **Footer Navigation Banner:** Informational banner and link to Notification settings `/setting/notification/` (`BR15`).

#### SCR-FIN-08: Bước 3 Tạo Hóa Đơn — Tự Động Khấu Trừ Hoàn Tiền Ăn Kỳ Trước (`/school/fee/create`)
- **Primary Purpose:** Invoicing creation wizard Step 3 (Chi tiết & Khấu trừ) displaying itemized deductions for accumulated meal refunds from month $M$.
- **Interactive Elements:**
  - Alert banner: *"Đã tự động tính toán và khấu trừ hoàn tiền ăn T9 cho học sinh (Tổng khấu trừ: -162.000đ)"*.
  - Itemized Line Items:
    - `Tiền ăn bán trú`: Base 880.000đ minus 100.000đ $= 780.000\text{đ}$ (with subline `Khấu trừ hoàn tiền ăn T9: -100.000đ [3 ngày tự nghỉ (50%): -60.000đ, 1 ngày nghỉ lễ (100%): -40.000đ]`).
    - `Tiền ăn sáng`: Base 440.000đ minus 62.000đ $= 378.000\text{đ}$ (with subline `Khấu trừ hoàn tiền ăn sáng T9: -62.000đ [3 ngày tự nghỉ (70%): -42.000đ, 1 ngày nghỉ lễ (100%): -20.000đ]`).
  - Total Net Amount recalculation card with updated VietQR transfer payload.


#### SCR-SET-02: Lịch Sử Giao Dịch Sepay (`/setting/fee/payment-history/`)
- **Primary Purpose:** Monthly audit log of automated banking transactions processed through Sepay.
- **Interactive Elements:**
  - Header with breadcrumbs: Cấu hình > Học phí > Lịch sử giao dịch Sepay.
  - Month/Year selector filter dropdown (defaults to current month).
  - Responsive transaction table: Ngày thanh toán, Số hóa đơn, Tên học sinh, Lớp, Số tiền (VND), Trạng thái (Thành công, Thất bại, Đang xử lý), Thao tác (`•••`).
  - Empty state: Clean illustration and banner *"Không tìm thấy dữ liệu"* when demo/unlinked tenant has no live transactions (`BR16`).

#### SCR-SET-03: Modal Cảnh Báo Rời Trang Khi Chưa Lưu (`UnsavedChangesModal`)
- **Primary Purpose:** Route guard modal preventing accidental loss of unsaved form changes across any of the 5 configuration blocks (`BR03`).
- **Interactive Elements:**
  - Warning banner with caution amber triangle graphic.
  - Title: "Thay đổi của bạn chưa được lưu".
  - Body text: "Vui lòng xác nhận rời khỏi khi chưa lưu! Các thay đổi bạn đã nhập trong biểu mẫu sẽ bị hủy bỏ nếu rời khỏi trang."
  - Action buttons: "Ở lại chỉnh sửa" (secondary, keeps user on page) and "Rời khỏi không lưu" (primary danger, discards draft changes and navigates).

---

### 2.7 Module 5: Nhà Trường — Lớp Học (School Class Management Screens)

#### SCR-CLS-01: Bảng Danh Sách Lớp Học (`/school/classes/`)
- **Primary Purpose:** Main class directory partitioned into Curricular and Extracurricular tabs with real-time grade filtering, search, and KPI overview cards.
- **Interactive Elements:**
  - Summary KPI cards: Tổng số lớp học, Lớp chính khóa, Lớp ngoại khóa, Tổng học sinh đã xếp lớp.
  - Dual Tab Switcher: "Lớp chính khóa" (mặc định) và "Lớp ngoại khóa".
  - Toolbar controls:
    - Search input: Tìm kiếm nhanh theo tên lớp, mã lớp, hoặc tên GVCN.
    - Khối lớp dropdown filter (chỉ hiện ở tab Lớp chính khóa): "Tất cả khối", "Khối 1", "Khối 2", "Khối 6", "Khối 10", "Mầm non".
    - Nút "Lọc mở rộng" kích hoạt drawer `DRAWER-CLASS-FILTER`.
    - Nút "+ Thêm lớp học" (Primary Blue `#0070CE`) điều hướng tới `/school/classes/create`.
  - Data table (Tab Lớp chính khóa):
    - Cột: STT, Tên lớp học, Khối lớp, Giáo viên chủ nhiệm (avatar, tên, số điện thoại), Sĩ số (hiện tại / tối đa kèm progress bar màu), CSDL Sở (badge liên kết), Thao tác (`•••`).
    - Thao tác: "Xem chi tiết", "Thông tin học phí", "Chỉnh sửa", "Xóa lớp" (disabled kèm tooltip khi sĩ số > 0).
  - Data table (Tab Lớp ngoại khóa):
    - Cột: STT, Tên lớp/CLB, Lĩnh vực, Giáo viên phụ trách (avatar cluster), Sĩ số, Lịch học, Trạng thái (badge), Thao tác (`•••`).

#### SCR-CLS-02: Form Thêm Mới Lớp Học (`/school/classes/create`)
- **Primary Purpose:** Dedicated wizard for creating a new curricular class or extracurricular club with real-time schema switching.
- **Interactive Elements:**
  - Breadcrumb: Nhà trường > Lớp học > Thêm mới lớp học.
  - Master toggle "Lớp ngoại khóa" (mặc định OFF = Lớp chính khóa).
  - Form Fields (Chính khóa):
    - Tên lớp học (input text, bắt buộc).
    - Mã lớp học (input text, tự động gợi ý, duy nhất trong niên khóa).
    - Niên khóa (dropdown/input, e.g. "2026-2027").
    - Khối lớp (dropdown chọn khối).
    - Giáo viên chủ nhiệm (dropdown có tìm kiếm; nếu GV đã chủ nhiệm lớp khác, hiển thị warning banner màu vàng).
    - Phòng học / Địa điểm (input text).
    - Sĩ số tối đa (number input, mặc định 35).
    - Mã định danh CSDL Sở GD&ĐT (optional text).
    - Ghi chú lớp học (textarea).
  - Form Fields (Ngoại khóa - khi toggle ON):
    - Tên câu lạc bộ / Lớp ngoại khóa (input text).
    - Nhóm lĩnh vực (dropdown: Thể thao, Nghệ thuật, STEM, Kỹ năng, Ngoại ngữ).
    - Giáo viên phụ trách (multi-select staff dropdown).
    - Lịch sinh hoạt (input text, e.g. "Thứ 3 & Thứ 5, 16:30 - 17:45").
    - Giới hạn sĩ số tối đa.
    - Học phí khóa / buổi (optional currency input).
  - Form footer: Nút "Hủy bỏ" (kèm check dirty state) và nút "Lưu lớp học".

#### SCR-CLS-03: Chi Tiết Lớp Học (`/school/classes/[classId]`)
- **Primary Purpose:** Centralized operational and academic dashboard for an individual class.
- **Interactive Elements:**
  - Header Hero Banner: Tên lớp, Khối, Phòng học, Mã CSDL Sở, Profile card GVCN (hoặc danh sách HLV), Sĩ số hiện tại (e.g. 32/35 học sinh).
  - Quick action buttons: "Chỉnh sửa lớp", "Quản lý học phí", "Xem thời khóa biểu".
  - Tab 1: **Học sinh:** Bảng danh sách 32 học sinh với avatar, mã HS, ngày sinh, giới tính, phụ huynh liên hệ, và nút "Xem hồ sơ" (`/school/kid/detail/[id]`).
  - Tab 2: **Thông tin học phí:** Bảng tổng hợp các khoản thu (Học phí chính khóa, Tiền ăn bán trú, Xe đưa đón), tỷ lệ thu học phí đã hoàn thành, và link mở Quản lý học phí.
  - Tab 3: **Phân công bộ môn:** Bảng môn học và giáo viên phụ trách bộ môn.
  - Tab 4: **Lối tắt vận hành:** 4 thẻ shortcut lớn có icon: "Điểm danh hôm nay", "Hoạt động & Nhật ký", "Thư viện ảnh lớp", "Thời khóa biểu tuần".

#### SCR-CLS-04: Cập Nhật Lớp Học (`/school/classes/[classId]/edit`)
- **Primary Purpose:** Editing class metadata and reassigning homeroom teacher.
- **Interactive Elements:**
  - Form fields pre-filled with class data.
  - Conflict warning banner if changing homeroom teacher to a teacher who already has an assigned homeroom class.
  - Action buttons: "Hủy bỏ" and "Cập nhật thay đổi".

#### MODAL-DELETE-CLASS: Modal Xác Nhận Xóa Lớp Rỗng
- **Primary Purpose:** Confirmation dialog for permanently deleting an empty class (`studentCount === 0`).
- **Interactive Elements:**
  - Warning icon and title "Xác nhận xóa lớp học {Tên lớp}".
  - Body: "Lớp học này hiện không có học sinh. Bạn có chắc chắn muốn xóa lớp học khỏi hệ thống không?".
  - Buttons: "Hủy bỏ" (secondary) và "Xóa lớp học" (danger red).

#### DRAWER-CLASS-FILTER: Drawer Lọc Mở Rộng Lớp Học
- **Primary Purpose:** Slide-over drawer for multi-factor class filtering.
- **Interactive Elements:**
  - Phân loại GV: Radio options (Tất cả, Đã có GVCN, Chưa có GVCN, GV chính, GV thỉnh giảng).
  - Chọn giáo viên cụ thể: Searchable dropdown.
  - Trạng thái liên kết CSDL Sở: Radio options (Tất cả, Đã liên kết, Chưa liên kết).
  - Khoảng sĩ số: Radio options (Tất cả, Dưới 20, Từ 20 - 30, Trên 30).
  - Buttons: "Đặt lại" và "Áp dụng bộ lọc".

---

### 2.8 Module 5: Nhà Trường — Môn Học (School Subject Management Screens)

#### SCR-SUB-01: Bảng Danh Mục Môn Học (`/school/subjects/`)
- **Primary Purpose:** Main subject catalog dashboard partitioned into 4 educational stages with teacher assignment chips, search, and KPI overview cards.
- **Interactive Elements:**
  - **Thẻ KPI tổng quan (4 cards):**
    - Tổng số môn học (của cấp học đang chọn).
    - Môn tính điểm (số môn có tính điểm trung bình tổng kết).
    - Môn nhận xét (số môn đánh giá bằng nhận xét).
    - Giáo viên đã phân công (tổng số giáo viên đang phụ trách các môn của cấp học).
  - **Segmented Stage Tabs (4 tabs):**
    - "Tiểu học (TH)" (mặc định cho trường tiểu học/liên cấp).
    - "Trung học cơ sở (THCS)".
    - "Trung học phổ thông (THPT)".
    - "Giáo dục thường xuyên (GDTX)".
  - **Thanh công cụ Toolbar:**
    - Dropdown Niên khóa: "2026-2027", "2025-2026".
    - Ô tìm kiếm: Tìm kiếm nhanh không dấu tiếng Việt theo tên môn hoặc mã môn (e.g. "dia li", "toan", "THPT-TOAN").
    - Dropdown Khối lớp: "Tất cả khối", "Khối 10", "Khối 11", "Khối 12"... (lọc theo các khối áp dụng).
  - **Bảng dữ liệu môn học:**
    - Cột: STT, Mã môn, Tên môn học, Phân loại (badge `Môn học` hoặc `Hoạt động GD`), Loại môn (`Bắt buộc`, `Tự chọn`, `Lựa chọn`), Khối lớp áp dụng, Điểm tổng kết (badge xanh `Có` / xám `Không`), Giáo viên giảng dạy (tối đa 3 avatar chips kèm tên rút gọn + badge `+N GV`), Thao tác (`•••`).
    - Menu Thao tác: "Xem chi tiết", "Phân công giáo viên".
  - **Cơ chế bảo vệ danh mục chuẩn:** Với các môn học chuẩn Bộ GD&ĐT (`isStandardMoET === true`), nút xóa môn bị vô hiệu hóa; bảng hiển thị huy hiệu `Môn chuẩn Bộ`.

#### DRAWER-SUB-DETAIL: Drawer Chi Tiết Môn Học & Ma Trận Đánh Giá
- **Primary Purpose:** Slide-over drawer displaying complete subject syllabus configuration, 4-term assessment matrix, and full assigned teacher roster.
- **Interactive Elements:**
  - Header: Tên môn học, Mã môn, Cấp học, Trạng thái (badge `Đang hoạt động`).
  - **Khối 1: Thông tin cấu hình chung:**
    - Khối lớp áp dụng (e.g. "Khối 10, Khối 11, Khối 12").
    - Phân loại & Loại môn (e.g. "Môn học bắt buộc").
    - Tính điểm tổng kết: Badge "Có tính vào điểm trung bình môn cả năm".
    - Mô tả môn học: Tóm tắt mục tiêu chương trình GDPT 2018.
  - **Khối 2: Ma Trận Phương Thức Đánh Giá (4 Kỳ):**
    - Bảng hiển thị 4 cột:
      1. *Giữa Kỳ 1:* Badge phương thức (Điểm số / Mức đánh giá / Nhận xét / Điểm số & Nhận xét).
      2. *Cuối Kỳ 1:* Badge phương thức.
      3. *Giữa Kỳ 2:* Badge phương thức.
      4. *Cuối Kỳ 2:* Badge phương thức.
    - Chú thích: Quy định theo Thông tư 22/2021/TT-BGDĐT hoặc Thông tư 27/2020/TT-BGDĐT.
  - **Khối 3: Danh Sách Giáo Viên Giảng Dạy:**
    - Danh sách toàn bộ giáo viên được phân công cho môn học này.
    - Mỗi giáo viên hiển thị: Avatar, Họ và tên, Mã GV, Số lớp đang phụ trách (e.g. "3 lớp: 10A1, 10A2, 10A3"), nút xóa (icon trash / user-minus).
    - Nút "+ Phân công giáo viên" mở modal `MODAL-ASSIGN-TEACHER`.

#### MODAL-ASSIGN-TEACHER: Modal Phân Công Giáo Viên Giảng Dạy
- **Primary Purpose:** Modal dialog for assigning a qualified faculty member to the active subject.
- **Interactive Elements:**
  - Tiêu đề: "Phân công giáo viên — {Tên môn học}".
  - Dropdown chọn giáo viên:
    - Có ô tìm kiếm theo tên/mã giáo viên.
    - **Quy tắc lọc:** Chỉ hiển thị những giáo viên *chưa* được phân công giảng dạy môn học này (`BR09`).
  - Chọn lớp phụ trách (tùy chọn): Multi-select checkboxes các lớp thuộc khối áp dụng.
  - Ghi chú phân công (textarea).
  - Nút hành động: "Hủy bỏ" và "Lưu phân công" (Primary Blue `#0070CE`).

#### MODAL-UNASSIGN-TEACHER: Modal Xác Nhận Hủy Phân Công Giáo Viên
- **Primary Purpose:** Confirmation dialog safeguarding against accidental unassignment of an active instructor (`BR10`, `K032`).
- **Interactive Elements:**
  - Warning icon tam giác vàng.
  - Tiêu đề: "Xác nhận hủy phân công giáo viên".
  - Nội dung: "Bạn có chắc chắn muốn hủy phân công giáo viên **{Tên giáo viên}** khỏi môn học **{Tên môn học}**? Giáo viên này đang phụ trách **{N}** lớp học."
  - Lưu ý hệ thống: "Điểm số và đánh giá đã nhập trước đó trong Sổ Điểm sẽ được bảo lưu."
  - Nút hành động: "Hủy bỏ" (secondary) và "Xác nhận hủy" (danger red).

---

### 2.9 Module 5: Nhà Trường — Khối Lớp (School Grade Level Management Screens)

#### SCR-GRD-01: Bảng Danh Sách Khối Lớp (`/school/grades/`)
- **Primary Purpose:** Centralized grade level overview and capacity rollup dashboard partitioned across 4 educational stages with instant accent-insensitive search and academic year selection.
- **Interactive Elements:**
  - **Top KPI Overview Cards (4 cards):**
    - `Tổng số khối lớp`: Tổng số khối thuộc cấp học đang chọn (e.g. 5 khối TH, 4 khối THCS, 3 khối THPT).
    - `Tổng số lớp học`: Tổng số lớp học được phân bổ vào các khối (dynamic rollup).
    - `Tổng số học sinh`: Tổng số học sinh đang theo học thực tế (dynamic rollup).
    - `Sĩ số trung bình/lớp`: Sĩ số trung bình tính toán theo khối học đang lọc.
  - **Toolbar Controls:**
    - Cấp học stage filter pills: "Tất cả", "Tiểu học (TH)", "THCS", "THPT", "GDTX" (chuyển đổi danh sách tức thì).
    - Dropdown Niên khóa: Lựa chọn năm học (mặc định "2026-2027").
    - Search bar: Tìm kiếm nhanh không dấu theo tên khối hoặc mã khối (e.g., "khoi 1" -> "Khối 1", "K01").
    - Nút 'X' xóa nhanh từ khóa tìm kiếm: Phục hồi toàn bộ danh sách ngay lập tức không cần tải lại trang (`BR05`).
  - **Grade Catalog Table:**
    - Cột: STT, Mã khối (`K01`, `K06`, ...), Tên khối (`Khối 1`, `Khối 6`, ...), Cấp học (badge colored by tier: Blue TH, Emerald THCS, Purple THPT, Amber GDTX), Số lượng lớp học, Số lượng học sinh, Tỷ lệ gán GVCN (kèm mini progress bar), Thao tác (icon xem chi tiết `faEye`).
    - Hàng dữ liệu có hiệu ứng hover và click mở thẳng màn hình chi tiết khối lớp `/[schoolCode]/school/grades/[gradeId]`.
  - **Bảo Vệ Tính Toàn Vẹn Danh Mục:** Không hiển thị nút "Thêm mới" hoặc "Xóa khối", bảo đảm danh mục khối lớp chuẩn quốc gia không bị sai lệch cấu trúc dữ liệu (`BR06`, `K033`).

#### SCR-GRD-02: Chi Tiết Khối Lớp & Danh Sách Lớp Học Thuộc Khối (`/school/grades/[gradeId]`)
- **Primary Purpose:** Dedicated grade-level cockpit displaying assigned class rosters, faculty contacts, enrollment capacity progress bars, and direct operational shortcuts.
- **Interactive Elements:**
  - **Header & Breadcrumbs:**
    - Breadcrumbs: `Nhà trường > Khối lớp > Chi tiết {Tên khối}` (link quay lại danh mục khối).
    - Tiêu đề lớn: "{Tên khối} — Niên khóa 2026-2027" kèm badge cấp học.
    - Nút quay lại: "← Danh sách khối lớp".
  - **Grade Metric Summary Cards (4 cards):**
    - `Mã khối & Cấp học`: Hiển thị mã chuẩn (`K10`) và Cấp học (`Trung học phổ thông`).
    - `Tổng số lớp`: Số lượng lớp chính khóa thuộc khối (e.g. 3 lớp).
    - `Tổng số học sinh`: Tổng sĩ số học sinh thực tế (e.g. 105 học sinh).
    - `Tổng giáo viên`: Tổng số GVCN và GVBM đang giảng dạy tại khối (e.g. 12 giáo viên).
  - **Class Roster Table (8 columns):**
    - Cột 1: `STT`.
    - Cột 2: `Tên lớp học`: Liên kết trực tiếp tới màn hình chi tiết lớp học `/[schoolCode]/school/classes/[classId]`.
    - Cột 3: `Phòng học`: Tên phòng học được phân bổ (e.g. "Phòng 301 - Tòa A").
    - Cột 4: `Giáo viên chủ nhiệm`: Tên GVCN kèm số điện thoại liên hệ (e.g. "Cô Hoàng Thị Mai - 0988.123.456").
    - Cột 5: `Sĩ số học sinh`: Số lượng học sinh hiện tại / sức chứa tối đa kèm thanh tiến độ phân màu (xanh lá < 90%, vàng 90-100%, đỏ đầy sĩ số).
    - Cột 6: `Số lượng GVBM`: Số giáo viên bộ môn đang phụ trách giảng dạy tại lớp.
    - Cột 7: `Trạng thái`: Badge "Đang hoạt động" hoặc "Tạm dừng".
    - Cột 8: `Lối tắt thao tác nhanh`:
      - Nút "Xem lớp" (`faChalkboard`): Mở chi tiết lớp học.
      - Nút "Điểm danh" (`faCalendarCheck`): Mở sổ điểm danh lớp `/[schoolCode]/class/[classId]/attendance`.
      - Nút "TKB" (`faClock`): Mở thời khóa biểu lớp `/[schoolCode]/school/schedule?classId=[classId]`.

---

### 2.10 Module 5: Nhà Trường — Bảng Thông Tin (School Announcement Board Screens)

#### SCR-ANN-01: Bảng Danh Sách Bảng Thông Tin (`/[schoolCode]/school/announcements`)
- **Primary Purpose:** Centralized announcement directory with status tabs, category filtering, accent-insensitive search, KPI cards, and bulk deletion actions.
- **Interactive Elements:**
  - **Top KPI Cards (4 cards):**
    - `Tổng số thông báo`: Tổng số thông báo đã tạo trong niên khóa.
    - `Đã gửi`: Số lượng thông báo đã phát hành tới người nhận.
    - `Chưa gửi (Lên lịch)`: Số lượng thông báo đã lên lịch gửi trong tương lai.
    - `Bản nháp`: Số lượng thông báo đang soạn dở chưa phát hành.
  - **Status Filter Tabs (4 tabs):**
    - "Tất cả" (mặc định), "Đã gửi", "Chưa gửi (Lên lịch)", "Bản nháp".
  - **Toolbar Controls:**
    - Dropdown Loại thông báo: "Tất cả loại", "Thông báo chung", "Kế hoạch học tập", "Thực đơn", "Sự kiện", "Lịch nghỉ", "Thời khóa biểu".
    - Ô tìm kiếm: Tìm kiếm nhanh không dấu tiếng Việt theo tiêu đề thông báo (e.g., "thuc don", "thoi khoa").
    - Nút "+ Tạo thông báo" (Primary Blue `#0070CE`): Điều hướng tới `/[schoolCode]/school/announcements/create`.
    - Nút "Xóa thông báo (N)": Xuất hiện cạnh nút Tạo thông báo khi có $\ge 1$ dòng được tích chọn checkbox ở cột đầu.
  - **Announcement Table:**
    - Cột 1: `Checkbox` (chọn dòng đơn lẻ hoặc chọn tất cả ở header).
    - Cột 2: `Tiêu đề thông báo`: Hiển thị tiêu đề dạng link cam/vàng có gạch chân, kèm các dòng thông tin phụ bên dưới:
      - Dòng phụ 1: `Gửi đến: {Toàn trường / Lớp 10A1, 10A2 / Giáo viên}`.
      - Dòng phụ 2: `Người nhận: {Tất cả / Giáo viên / Phụ huynh}` (khi đối tượng là Lớp học).
      - Dòng phụ 3: `Kênh: {Ứng dụng / Email / Email & Ứng dụng}`.
    - Cột 3: `Loại thông báo`: Badge phân loại tương ứng với 6 loại nghiệp vụ.
    - Cột 4: `Trạng thái`: Badge màu sắc:
      - Xanh dương `Đã gửi` kèm timestamp gửi thực tế (`DD/MM/YYYY HH:mm`).
      - Vàng hổ phách `Chưa gửi` kèm ngày gửi đã lên lịch (`Lên lịch: DD/MM/YYYY`).
      - Xám `Bản nháp`.
    - Cột 5: `Lượt xem`: Hiển thị số lượt xem (`viewCount` lượt xem) đối với thông báo đã gửi.
    - Cột 6: `Thao tác`:
      - Với Bản nháp: Icon bút chì "Chỉnh sửa" và icon thùng rác "Xoá".
      - Với Đã gửi / Chưa gửi: Icon con mắt "Xem chi tiết" và icon thùng rác "Xoá" (không có nút Chỉnh sửa theo BR02).

#### SCR-ANN-02: Soạn Thông Báo Mới (`/[schoolCode]/school/announcements/create`)
- **Primary Purpose:** Dedicated wizard for authoring rich multi-channel announcements with targeted recipient scoping and scheduling.
- **Interactive Elements:**
  - Header & Breadcrumb: `Nhà trường > Bảng thông tin > Tạo thông báo mới`.
  - **Khối cấu hình truyền tải (2 cột):**
    - `Kênh thông báo*`: Radio buttons hoặc dropdown ("Ứng dụng", "Email", "Email và ứng dụng").
    - `Loại thông báo*`: Dropdown (6 loại: Thông báo chung, Kế hoạch học tập, Thực đơn, Sự kiện, Lịch nghỉ, Thời khóa biểu).
    - `Tạo thông báo cho*`: Dropdown 5 lựa chọn ("Toàn trường", "Toàn bộ giáo viên", "Toàn bộ phụ huynh", "Lớp học", "Cá nhân").
  - **Khối điều kiện khi chọn "Lớp học":**
    - `Người nhận*`: Dropdown ("Giáo viên và Phụ huynh", "Toàn bộ giáo viên", "Toàn bộ phụ huynh").
    - `Chọn lớp học*`: Multi-select checkboxes danh sách các lớp học của trường (bắt buộc chọn $\ge 1$ lớp trước khi gửi).
  - **Khối nội dung:**
    - `Tiêu đề thông báo*`: Input text (bắt buộc, max 200 ký tự).
    - `Nội dung thông báo*`: Rich-text editor hỗ trợ định dạng tiêu đề, in đậm, in nghiêng, gạch chân, danh sách gạch đầu dòng, liên kết.
    - `File đính kèm`: File upload dropzone hỗ trợ tối đa 5 files (PDF, Word, Excel, PNG, JPG) dung lượng $\le 10\text{MB}$/file.
  - **Khối tùy chọn gửi & hiển thị:**
    - `Ngày gửi`: Datepicker (để trống = gửi ngay khi bấm "Gửi"; chọn ngày tương lai = hệ thống tự động lên lịch gửi).
    - `Hiển thị thông báo cho tài khoản thêm sau`: Toggle switch (mặc định tắt).
  - **Footer Actions:**
    - Nút "Hủy bỏ": Quay về danh sách (kèm cảnh báo nếu form đang dirty).
    - Nút "Xem trước": Mở modal `MODAL-PREVIEW-ANN` mô phỏng giao diện người nhận.
    - Nút "Lưu bản nháp": Lưu thông báo ở trạng thái `ban_nhap`.
    - Nút "Gửi": Xác nhận phát hành ngay (hoặc lên lịch nếu có Ngày gửi).

#### SCR-ANN-03: Chi Tiết Thông Báo & Thống Kê Tương Tác (`/[schoolCode]/school/announcements/[announcementId]`)
- **Primary Purpose:** Full inspection hub of an announcement record, displaying metadata, body, attachments, and status-based actions.
- **Interactive Elements:**
  - Breadcrumb: `Nhà trường > Bảng thông tin > Chi tiết thông báo`.
  - **Transmission Summary Card:**
    - Badge Kênh truyền tải (`Ứng dụng`, `Email`, `Email & Ứng dụng`).
    - Badge Loại thông báo (`Thực đơn`, `Sự kiện`, ...).
    - Badge Trạng thái (`Đã gửi` kèm ngày giờ, `Chưa gửi` kèm ngày hẹn, `Bản nháp`).
    - Đối tượng gửi & Lớp áp dụng.
    - Người tạo thông báo & Chức danh.
    - Số lượt tương tác: Counter `Đã xem: {N} lượt`.
  - **Body Content Area:**
    - Tiêu đề thông báo in đậm cỡ lớn.
    - Nội dung thông báo rich-text đầy đủ.
    - Danh sách file đính kèm kèm kích thước và nút tải xuống.
  - **Action Toolbar:**
    - Với `da_gui` / `chua_gui`: Nút "Xoá thông báo" (mở modal cảnh báo email không thể thu hồi).
    - Với `ban_nhap`: Nút "Xoá", Nút "Chỉnh sửa" (mở trang edit), Nút "Gửi thông báo" (phát hành ngay).

#### SCR-ANN-04: Chỉnh Sửa Thông Báo Bản Nháp (`/[schoolCode]/school/announcements/edit/[announcementId]`)
- **Primary Purpose:** Updating unpublished announcement drafts (strictly restricted to `ban_nhap` status).
- **Interactive Elements:**
  - Form controls tương tự SCR-ANN-02 được điền sẵn toàn bộ dữ liệu từ bản nháp.
  - Footer actions: "Hủy bỏ", "Xem trước", "Lưu bản nháp", "Gửi thông báo".

#### MODAL-PREVIEW-ANN: Modal Xem Trước Nội Dung Thông Báo
- **Primary Purpose:** Realistic simulation of how the announcement will appear to recipients on mobile apps and the web portal.
- **Interactive Elements:**
  - Device frame preview card:
    - Header: Avatar/Logo trường học, Tên trường, Badge loại thông báo, Kênh truyền tải, Timestamp "Vừa xong".
    - Title: Tiêu đề thông báo hiển thị nổi bật.
    - Body: Nội dung rich text định dạng trực quan (paragragh, headings, links, lists).
    - Attachments: Danh sách file đính kèm dạng chip với icon file tương ứng.
  - Nút "Đóng": Trở về form soạn thảo.

#### MODAL-DELETE-CONFIRM: Modal Xác Nhận Xóa Thông Báo
- **Primary Purpose:** Confirmation dialog for single and bulk announcement deletion with mandatory legal/operational warning.
- **Interactive Elements:**
  - Biểu tượng loa phóng thanh / cảnh báo màu đỏ.
  - Tiêu đề: "Xác nhận xóa thông báo" (hoặc "Xác nhận xóa {N} thông báo đã chọn").
  - Lời nhắc: "Bạn có chắc chắn muốn xóa thông báo **{Tiêu đề}** không?".
  - **Cảnh báo hệ quả bắt buộc (BT-01, BT-02, BR10):**
    *"Lưu ý: Người dùng sẽ không thể xem các thông tin liên quan đến thông báo này trên cả Web và App, trừ những email đã được gửi ra."*
  - Nút hành động: "Hủy bỏ" (secondary) và "Xác nhận xóa" (danger red).

---

### 2.11 Module 5: Nhà Trường — Bình Chọn (School Polls, Voting & Surveys Screens)

#### SCR-POL-01: Bảng Danh Sách Bình Chọn (`/school/poll/`)
- **Primary Purpose:** Central survey and polling dashboard with status tabs, class cohort filtering, client-side accent-free search, and state-driven action icons.
- **Interactive Elements:**
  - **KPI Summary Cards:** 4 top metric cards:
    - Tổng số bình chọn (Total polls in system).
    - Đang diễn ra (Active polls with `da_gui` status).
    - Bản nháp (Draft polls with `da_tao` status).
    - Đã đóng (Expired/Closed polls with `da_dong` status).
  - **Status Tabs:** `Tất cả` (All), `Đã tạo` (Drafts), `Đã gửi` (Active), `Đã đóng` (Closed).
  - **Toolbar Controls:**
    - Dropdown "Chọn lớp học" để lọc bình chọn theo lớp áp dụng.
    - Ô tìm kiếm text không phân biệt dấu tiếng Việt (ví dụ "gia ngoai" khớp "giã ngoại" - BR10).
    - Nút "+ Tạo bình chọn" (Primary Blue `#0070CE`) điều hướng tới `/school/poll/create`.
  - **Data Table:**
    - Cột: STT, Chủ đề (link cam có gạch chân, kèm dòng phụ "Bình chọn kết thúc vào {ngày giờ}" - BR09), Đối tượng gửi (Toàn trường / Lớp học cụ thể có liên kết tới chi tiết lớp), Ngày tạo, Trạng thái (badge: `Đã tạo` xám, `Đã gửi` xanh lá, `Đã đóng` đỏ), Thao tác.
    - **State-Driven Action Icons (BR02, K044):** 3 icon Chỉnh sửa (bút chì), Gửi (máy bay giấy), Xoá (thùng rác) hiển thị ĐỘC QUYỀN trên các dòng có trạng thái `Đã tạo`. Các dòng `Đã gửi` và `Đã đóng` hoàn toàn ẩn các icon thao tác này.

#### SCR-POL-02: Form Soạn Thảo & Tạo Bình Chọn Mới (`/school/poll/create`)
- **Primary Purpose:** Dedicated vertical layout page for authoring poll questions and options before recipient distribution.
- **Interactive Elements:**
  - Breadcrumb: `Nhà trường > Bình chọn > Tạo bình chọn`.
  - **Khối Nội Dung Chính (Bố cục dọc 1 cột - BR03):**
    - `Chủ đề*`: Input text (bắt buộc, tiêu đề cuộc khảo sát).
    - `Mô tả`: Textarea (tùy chọn, hướng dẫn hoặc giải thích bối cảnh).
    - `Thời hạn bình chọn*`: Datetime picker (bắt buộc, phải ở tương lai).
    - `Hình ảnh`: Dropzone hoặc input URL hình ảnh minh họa cho cuộc khảo sát.
    - `Các lựa chọn*`: Danh sách các phương án trả lời (mặc định tối thiểu 2 ô input). Có nút "+ Thêm" để bổ sung lựa chọn thứ 3, 4, 5... và nút xóa cạnh mỗi lựa chọn.
  - **Khối Cấu Hình Bình Chọn (BR04):**
    - Toggle "Chọn nhiều phương án" (mặc định tắt = single-choice radio; bật = multiple-choice checkbox).
    - Toggle "PH được xem kết quả bình chọn" (mặc định tắt = ẩn tỷ lệ với phụ huynh; bật = hiển thị kết quả cho phụ huynh).
  - **Footer Actions:**
    - Nút "Hủy bỏ": Quay lại danh sách bình chọn.
    - Nút "Tạo bình chọn": Lưu bình chọn với trạng thái `Đã tạo` (chưa gán đối tượng nhận).

#### SCR-POL-03: Chi Tiết Kết Quả Bình Chọn & Cockpit (`/school/poll/[pollId]`)
- **Primary Purpose:** Live evaluation hub showing aggregated voting progress, conditional pie chart visualizer, and class voter roster with revision logs.
- **Interactive Elements:**
  - Breadcrumb: `Nhà trường > Bình chọn > Chi tiết bình chọn`.
  - **Header Overview:**
    - Ảnh đại diện/banner cuộc khảo sát (nếu có).
    - Tiêu đề cuộc bình chọn cỡ lớn.
    - Mô tả dài rút gọn mặc định kèm link "Xem thêm / Thu gọn" (BR09).
    - Badge trạng thái (`Đang mở`, `Đã đóng`) kèm ngày kết thúc và người tạo.
  - **Kết Quả Bình Chọn (Real-Time Results):**
    - Danh sách các phương án với số phiếu tuyệt đối và thanh tiến trình ngang tỉ lệ % (BR06).
    - **Biểu đồ tròn trực quan (Pie/Donut Chart):** Chỉ xuất hiện khi tổng số phiếu $> 0$ (BR06, NFR01); khi chưa có phiếu nào, biểu đồ được ẩn hoàn toàn để tránh giao diện rỗng.
  - **Danh Sách Đã Bình Chọn (Voter Roster - BR07):**
    - Bộ lọc: Chọn lớp học, Lọc trạng thái (Tất cả, Đã bình chọn, Chưa bình chọn), Ô tìm kiếm học sinh.
    - Bảng danh sách học sinh: STT, Mã học sinh, Tên học sinh (avatar, họ tên hiển thị nguyên trạng - BR11), Lớp học, Trạng thái (Đã bình chọn / Chưa bình chọn), Phương án đã chọn, Thời gian bình chọn gần nhất, Thao tác (icon lịch sử "Lịch sử thay đổi").

#### SCR-POL-04: Chỉnh Sửa Bình Chọn Bản Nháp (`/school/poll/edit/[pollId]`)
- **Primary Purpose:** Updating poll content strictly restricted to `da_tao` drafts (BR02).
- **Interactive Elements:**
  - Form controls tương tự SCR-POL-02 điền sẵn dữ liệu hiện tại của bản nháp.
  - Nút lưu cập nhật hoặc hủy thao tác.

#### MODAL-SEND-POLL: Modal Xác Nhận Gửi Bình Chọn (UC-04)
- **Primary Purpose:** Decoupled recipient assignment modal triggered by the Send icon on `da_tao` polls.
- **Interactive Elements:**
  - Biểu tượng 3 vòng tròn màu đặc trưng ở đầu modal.
  - Tiêu đề: "Vui lòng xác nhận gửi Bình chọn {Tên bình chọn}".
  - Tùy chọn "Gửi đến":
    - Radio 1: "Toàn trường" (mặc định).
    - Radio 2: "Lớp học" — kích hoạt dropdown "Chọn lớp học" (hỗ trợ chọn nhiều lớp cùng lúc, ví dụ "INFANT, Lá" - BR05).
  - Nút hành động: "Hủy bỏ" (secondary) và "Xác nhận gửi" (primary blue).

#### MODAL-DELETE-POLL: Modal Xác Nhận Xóa Bình Chọn (UC-06)
- **Primary Purpose:** Confirmation dialog for deleting draft polls (`status === 'da_tao'`).
- **Interactive Elements:**
  - Biểu tượng cảnh báo hoặc 3 vòng tròn màu.
  - Tiêu đề: "Vui lòng xác nhận xóa bình chọn {Tên bình chọn}".
  - Nút hành động: "Hủy bỏ" và "Xác nhận xóa" (danger red).

#### MODAL-VOTE-HISTORY: Modal Lịch Sử Thay Đổi Lựa Chọn (BR08)
- **Primary Purpose:** Audit log modal showing every historical choice revision made by a specific student/parent before poll close.
- **Interactive Elements:**
  - Tiêu đề: "Lịch sử bình chọn: {Tên học sinh} - Lớp {Tên lớp}".
  - Bảng lịch sử tuần tự theo thời gian:
    - Cột: Lần bình chọn (Lần 1, Lần 2, ...), Thời gian ghi nhận (dd/MM/yyyy HH:mm:ss), Phương án đã chọn, Người thực hiện (Phụ huynh / Học sinh).
  - Nút "Đóng modal".

---


## 3. Responsive & Accessibility Constraints

- **Responsive Breakpoints:**
  - Mobile / Small Tablet (`<768px`): Class rosters collapse action buttons into sticky bottom sheets; tabular grids enable horizontal scroll with frozen student name columns.
  - Tablet Landscape (`768px - 1024px`): Two-column layout with collapsible navigation drawer.
  - Desktop (`>1024px`): Full desktop multi-column view with persistent sidebar and split detail panels.
- **Accessibility:** Minimum touch target size of 44x44px for teacher tablet check-in buttons; WCAG AA contrast ratio compliance across all text against `#FEC020` and `#0070CE` backgrounds.


### 2.26 Module 26 — Điểm Danh NV (School Staff Attendance & Daily Timekeeping)

#### SCR-STA-01: Bảng Chấm Công & Điểm Danh Nhân Viên (`/school/staff-attendance`)
- **Primary Purpose:** High-velocity daily timekeeping cockpit for all school faculty and staff (Administrators, Managers, Teachers, Operations Staff), featuring 1-click arrival/departure recording, retrospective 45-day audit locking, multi-role badging, and search-responsive KPI counters.
- **Interactive Elements:**
  - Breadcrumbs: `Nhà trường > Điểm danh NV`.
  - **Attendance Toolbar (`StaffAttendanceToolbar`):**
    - Lịch chọn ngày: Vô hiệu hóa các ngày trong tương lai ($\le$ hôm nay, BR01).
    - Cảnh báo giới hạn 45 ngày (`DD-02`): Text cảnh báo tĩnh dưới hàng bộ lọc hiển thị mỗi khi ngày đang xem khác hôm nay: `"*Chỉ được cập nhật thông tin điểm danh trong vòng 45 ngày kể từ hôm nay"`.
    - Bộ lọc "Chọn lớp học" (`?classId=...`): Lọc danh sách nhân viên gắn với lớp (chủ nhiệm, bộ môn) theo URL query params không reload trang (BR09, K047).
    - Bộ lọc "Chọn vai trò": Lọc tức thời phía client (`Tất cả`, `Admin`, `Quản Lý`, `Giáo Viên`, `Nhân Viên`).
    - Ô "Tìm kiếm": Tìm kiếm tức thì không phân biệt dấu tiếng Việt theo tên hiển thị và họ tên (BR10).
  - **KPI Summary Cards (`StaffAttendanceSummaryCards`):**
    - 3 thẻ đếm trạng thái: "Tham dự" (xanh lá/xanh dương), "Vắng có phép" (vàng cam), "Vắng không phép" (đỏ).
    - **Cơ chế ẩn động khi tìm kiếm (BR10):** Khi ô tìm kiếm có ký tự, khối 3 bộ đếm này được **ẩn hoàn toàn** để tránh nhầm lẫn số liệu tổng hợp toàn trường với số kết quả tìm được.
  - **Bảng Điểm Danh Nhân Viên (`StaffAttendanceTable`):**
    - Cột 1: STT.
    - Cột 2: "Nhân viên" (có icon mũi tên đảo chiều sắp xếp A $\leftrightarrow$ Z theo tên hiển thị - BR12). Hiển thị avatar, tên hiển thị (nickname dạng link màu click mở modal thông tin - BR11), họ và tên đầy đủ, mã nhân viên ("Mã NV: NV001" hoặc `"Chưa có mã NV"` - BR11), và các badge vai trò.
    - Cột 3: "Vai trò" (hỗ trợ hiển thị nhiều badge vai trò đồng thời trên cùng một dòng - BR08).
    - Cột 4: "Check-in" — Nút bấm 1 lần màu xanh dương `#0070CE` ghi nhận ngay giờ hiện tại không qua xác nhận (BR03). Sau khi ghi nhận, chuyển thành badge giờ xanh dương kèm icon bút chì (BR04). Click vào badge cho sửa trực tiếp `HH:mm`; nếu xóa trống hoặc sai định dạng khi blur thì hiện toast `DD-01` (*"Thời gian không đúng định dạng."*) và tự khôi phục giờ cũ (BR04, K048).
    - Cột 5: "Check-out" — Nút bấm 1 lần màu vàng cam `#FEC020` ghi nhận ngay giờ hiện tại (BR03). Chuyển thành badge giờ vàng cam kèm icon bút chì cho phép sửa giờ với cơ chế rollback tương tự Check-in.
    - Cột 6: "Vắng" — Toggle switch riêng biệt mở modal xác nhận (BR05). Trong lúc modal mở, 2 nút Check-in/Check-out của dòng đó bị disable (BR06).
    - Cột 7: "Ghi chú" — Icon bút chì click mở ô nhập text inline, tự lưu khi rời khỏi ô (blur) mà không cần nút Lưu; để trống vẫn được chấp nhận (BR07).
  - **Dòng tổng kết chân trang:** Hiển thị `"Tổng: N"` phản ánh chính xác số dòng nhân viên đang hiển thị sau khi lọc/tìm kiếm.
  - **Khóa cứng chế độ chỉ đọc quá 45 ngày (K046, BR02):** Khi chọn ngày cách hôm nay $> 45$ ngày, toàn bộ nút Check-in, Check-out, toggle Vắng và ô sửa ghi chú bị vô hiệu hóa trong chế độ Read-Only để bảo vệ kỳ quyết toán lương và kiểm toán.

#### MODAL-STA-ABSENCE: Modal Xác Nhận Đánh Dấu Vắng Mặt (BR05, BR06)
- **Primary Purpose:** Formal absence confirmation dialog distinguishing excused vs unexcused leave and detecting prior arrival timestamps.
- **Interactive Elements:**
  - Tiêu đề modal: "Đánh dấu vắng mặt: {Tên nhân viên}".
  - Dòng cảnh báo xung đột (`DD-03`): Nếu nhân viên đã Check-in hoặc Check-out trong ngày, hiển thị thông báo: `"Lưu ý: Nhân viên đã check-in/check-out lúc {giờ}"`.
  - Loại vắng:
    - Radio 1: "Có phép" (mặc định được chọn).
    - Radio 2: "Không phép".
  - Ô "Ghi chú": Textarea nhập lý do vắng tùy chọn.
  - Nút hành động: "Hủy" (đóng modal, toggle tự trả về OFF) và "Lưu" (ghi nhận vắng, cập nhật bộ đếm).
  - Khóa thao tác: Hai nút Check-In/Check-Out của đúng dòng nhân viên đó bị vô hiệu hóa cho tới khi đóng modal (BR06).

#### MODAL-STA-PROFILE: Modal Thông Tin Nhân Viên Chỉ Đọc (BR11)
- **Primary Purpose:** Read-only personnel profile modal triggered by clicking an employee's nickname in the attendance roster.
- **Interactive Elements:**
  - Biểu tượng sổ tay có mặt cười ở đầu modal.
  - Tiêu đề thay đổi theo vai trò:
    - Vai trò Admin: "Thông tin Quản Trị".
    - Các vai trò khác (Quản Lý, Giáo Viên, Nhân Viên): "Thông tin người dùng".
  - Danh sách trường thông tin:
    - Avatar, Tên hiển thị, Họ và tên đầy đủ.
    - Mã nhân viên (hoặc `"Chưa có mã nhân viên"`).
    - Email (hoặc `"Chưa có email"`).
    - Số điện thoại (hoặc `"Chưa có số điện thoại"`).
    - Ngày sinh (hoặc `"Chưa có ngày sinh"`).
    - Địa chỉ (hoặc `"Chưa có địa chỉ"`).
    - Trạng thái xác thực: Badge xanh `"Đã xác thực"`.
    - **Trường đặc thù Quản Lý ("Quản lý lớp"):** Chỉ hiển thị với vai trò Quản Lý, liệt kê các lớp đang phụ trách dưới dạng link trực tiếp sang trang chi tiết lớp học (`/school/classes/[classId]`).
  - Nút "Đóng" (hoặc icon "X").


---

### Screen 17: Sổ Tay PH (Parent Handbook Cockpit, Editor & Modals)

#### SCR-HNB-01: Bàn Làm Việc Sổ Tay PH (`/[schoolCode]/school/handbook`)
- **Primary Purpose:** Comprehensive parent handbook cockpit hosting the 2-tier accordion category tree, article-centric search filter, and right-hand article inspection panel.
- **Header Elements:**
  - Tiêu đề trang: "Sổ Tay PH" với icon sổ tay / bookmark (`faBookBookmark`), mô tả: "Cẩm nang hướng dẫn và nội dung thông tin chung dành cho phụ huynh".
  - Bộ lọc trạng thái bài viết: Dropdown "Chọn trạng thái" (`Tất cả`, `Bản nháp`, `Đã phát hành`).
  - Ô tìm kiếm bài viết: Input text tìm kiếm bài viết tức thì theo tiêu đề, không phân biệt dấu (`normalizeVietnameseText`).
  - Nút chính: "+ Thêm danh mục" màu xanh dương thương hiệu `#0070CE` mở modal thêm danh mục gốc.
- **Bố Cục Hai Cột (Split-View Layout):**
  - **Cột Trái (Cây Danh Mục Accordion — `HandbookAccordionTree`):**
    - Tổ chức tối đa 2 cấp danh mục: Danh mục gốc $\rightarrow$ Danh mục con $\rightarrow$ Bài viết lá (`BR01`, `K049`).
    - Cơ chế Accordion: Trong cùng nhóm anh em, chỉ mở 1 danh mục tại một thời điểm; mở danh mục khác tự đóng danh mục đang mở (`BR02`, `K050`).
    - Hàng Danh mục: Icon lớp xếp tầng, tên danh mục, mô tả ("Ghi chú" hiển thị khung viền chấm khi mở, dạng dòng phụ khi đóng - `BR03`), menu `•••` (Chỉnh sửa danh mục, Thêm danh mục con [chỉ có ở gốc], Xóa danh mục).
    - Hàng Bài viết: Icon kéo-thả (☰) cho phép sắp xếp thứ tự trong cùng danh mục cha (`BR04`), icon sách mở, tiêu đề bài viết (màu xám nhạt nếu Bản nháp, màu cam nếu Đã phát hành - `BR05`), badge xám "Bản nháp", menu `•••` (Chỉnh sửa bài viết, Xuất bản bài viết [nếu nháp] / Ẩn bài viết [nếu đã phát hành], Xóa bài viết).
    - Trạng thái lọc & tìm kiếm: Cây tự thu gọn về đúng các nhánh chứa bài viết khớp điều kiện (`BR10`, `K051`).
    - Trạng thái rỗng (`ST-03`): Khi tìm kiếm không có kết quả, hiển thị: *"Hiện chưa có danh mục hoặc bài viết nào. Hãy bắt đầu bằng cách tạo danh mục mới"*.
  - **Cột Phải (Panel Chi Tiết Bài Viết — `HandbookDetailPanel`):**
    - Breadcrumbs danh mục chỉ đọc đầy đủ đường dẫn (ví dụ: `Quy định chung > Đưa đón học sinh >`).
    - Tiêu đề bài viết lớn, thông tin tác giả và ngày giờ phát hành/cập nhật.
    - Khung nội dung Rich Text định dạng đầy đủ (heading H1/H2, bold/italic/underline, danh sách, quote, màu chữ, links).
    - Khối tệp đính kèm: Danh sách file tải về kèm icon và dung lượng (ví dụ: `So_tay_PH_2026.pdf (2.4 MB)`).

#### SCR-HNB-02: Trang Soạn & Sửa Bài Viết (`/school/handbook/create`, `/edit/[articleId]`)
- **Primary Purpose:** Dedicated rich text editor for authoring and revising parent handbook articles with locked destination breadcrumbs.
- **Form Elements:**
  - Breadcrumb danh mục cố định (chỉ đọc): Hiển thị đúng danh mục cha đã chọn (ví dụ: `Chính sách & Quy định > Đưa đón học sinh`), không cho đổi danh mục khác tại form (`BR07`).
  - Ô "Tiêu đề bài viết" (*): Input text bắt buộc.
  - Trình soạn thảo Rich Text (*): Editor hỗ trợ định dạng heading, bold, italic, căn lề, danh sách bullet/số, link, và màu sắc.
  - Khu vực tải file đính kèm: Hỗ trợ upload tài liệu PDF, Word, Excel tham khảo.
  - **Hai nút lưu riêng biệt (`BR08`):**
    - Nút 1 ("Lưu nháp" / "Chỉnh sửa"): Lưu bài viết ở trạng thái Bản nháp.
    - Nút 2 ("Lưu & Xuất bản" / "Chỉnh sửa & Xuất bản"): Lưu và kích hoạt trạng thái Đã phát hành trong một bước duy nhất.
  - Nút "Hủy bỏ": Quay lại trang danh sách (kèm guard xác nhận nếu form đã thay đổi).

#### MODAL-HNB-CATEGORY: Modal Thêm / Chỉnh Sửa Danh Mục (BR11)
- **Primary Purpose:** Context-aware dialog for creating or updating root and secondary handbook categories.
- **Interactive Elements:**
  - Tiêu đề: "Thêm danh mục" / "Chỉnh sửa danh mục".
  - **Trường "Danh mục chính" (chỉ đọc):** Chỉ xuất hiện khi tạo hoặc sửa danh mục con cấp 2, hiển thị rõ tên danh mục cha. Hoàn toàn ẩn khi thao tác trên danh mục gốc.
  - Trường "Tên danh mục" (*): Input text bắt buộc.
  - Trường "Ghi chú": Textarea mô tả ngắn tùy chọn.
  - Nút "Hủy" và nút "Thêm" / "Cập nhật".

#### MODAL-HNB-DELETE: Modal Xác Nhận Xóa Danh Mục & Bài Viết (BR09)
- **Primary Purpose:** Safety confirmation modal preventing accidental recursive loss of handbook data.
- **Interactive Elements:**
  - **Trường hợp xóa danh mục (`ST-01`):** Cảnh báo hệ quả nghiêm trọng: *"Vui lòng xác nhận xóa danh mục {tên danh mục}. Lưu ý: Tất cả danh mục con và bài viết trong danh mục sẽ bị xóa"*.
  - **Trường hợp xóa bài viết (`ST-02`):** Xác nhận đơn giản: *"Vui lòng xác nhận xóa bài viết {tiêu đề bài viết}"*.
  - Nút "Hủy" và nút "Xác nhận xóa" màu đỏ nguy hiểm.


### 18. School Parent Feedback (Góp Ý) Screen Catalog

#### SCR-FDB-01: Trang Danh Sách Góp Ý (`/[schoolCode]/school/feedback`)
- **Primary Purpose:** Administrative cockpit for triaging, filtering, and managing parent feedback tickets across the school.
- **Top Header & KPI Summary Cards (`BR02`, `K055`):**
  - Dropdown chọn "Năm học" (ví dụ: `2026 - 2027`) điều khiển phạm vi tính toán của các thẻ số liệu.
  - **4 thẻ KPI trạng thái kiêm bộ lọc một chạm:**
    1. `Yêu cầu mới`: Xanh dương (`#0070CE`), icon `+` (chỉ là icon minh họa/lọc, không phải nút tạo `BR09`), hiển thị tổng số yêu cầu mới.
    2. `Đang xử lý`: Tím (`#8B5CF6`), icon vòng tròn xoay, hiển thị tổng số ticket đang giải quyết.
    3. `Hoàn tất`: Xanh lá (`#10B981`), icon tích chọn, hiển thị tổng số ticket đã đóng.
    4. `Mở lại`: Cam (`#F59E0B`), icon mũi tên xoay ngược, hiển thị tổng số ticket phụ huynh phản hồi lại sau khi đóng.
  - Bấm vào bất kỳ thẻ nào sẽ lọc danh sách bảng theo trạng thái đó và hiển thị link "Xóa bộ lọc" (`K055`). Bấm "Xóa bộ lọc" để bỏ chọn.
  - **Quy tắc bất biến:** Không có nút "Tạo góp ý" hay "Thêm góp ý" trên Web Admin (`BR09`, `K054`).
- **Thanh Công Cụ Tìm Kiếm & Lọc Nâng Cao:**
  - Ô tìm kiếm text: Tìm kiếm theo mã góp ý, tiêu đề, tên học sinh, lớp, tên phụ huynh.
  - Dropdown "Trạng thái": Tất cả, Yêu cầu mới, Đang xử lý, Hoàn tất, Mở lại.
  - Dropdown "Loại góp ý": 8 danh mục cố định (`BR03`).
  - Dropdown "Người xử lý": Lọc theo giáo viên/quản trị viên phụ trách.
  - Dropdown "Độ ưu tiên": Tất cả, Thấp, Trung bình, Cao, Khẩn cấp.
  - Bộ chọn khoảng thời gian (Từ ngày - Đến ngày).
- **Bảng Danh Sách Góp Ý (Roster Table):**
  - Cột 1: Mã góp ý (ví dụ: `#GY-2026-001`, click để vào trang chi tiết).
  - Cột 2: Tiêu đề & Loại góp ý (hiển thị tag loại góp ý màu xám nhạt).
  - Cột 3: Học sinh & Lớp (click tên học sinh mở `MODAL-FDB-PROFILE`).
  - Cột 4: Người tạo (Phụ huynh, click tên mở `MODAL-FDB-PROFILE`).
  - Cột 5: Trạng thái (Badge màu chuẩn: Mới, Đang xử lý, Hoàn tất, Mở lại).
  - Cột 6: Chờ phản hồi (Tag "Từ nhà trường" hoặc "Từ phụ huynh").
  - Cột 7: Người xử lý (Dropdown chọn trực tiếp người phụ trách inline `BR04`).
  - Cột 8: Độ ưu tiên (Dropdown đổi trực tiếp inline: Thấp/Xanh, TB/Xanh lá, Cao/Cam, Khẩn cấp/Đỏ `BR04`, `K056`).
  - Cột 9: Ngày tạo & Hành động (Icon xem chi tiết, icon đóng góp ý nếu chưa hoàn tất).

#### SCR-FDB-02: Trang Chi Tiết Góp Ý (`/[schoolCode]/school/feedback/[feedbackId]`)
- **Primary Purpose:** In-depth resolution surface featuring original feedback payload, chronological two-way communication thread, and parent/student context cards.
- **Khung Bên Trái (Nội Dung & Luồng Trao Đổi — 70% Width):**
  - **Khối thông tin ban đầu của Phụ huynh:**
    - Tiêu đề góp ý lớn, mã ticket, nhãn danh mục, ngày giờ tạo.
    - Nội dung phản ánh gốc của phụ huynh (Read-only, không thể chỉnh sửa).
    - Thư viện ảnh đính kèm ban đầu của phụ huynh (hỗ trợ click phóng to ảnh).
  - **Dòng thời gian trao đổi hai chiều (Discussion Stream):**
    - Hiển thị tuần tự các tin nhắn phản hồi giữa nhà trường và phụ huynh.
    - Avatar, tên người gửi (ví dụ: "Cô Mai Anh - Quản trị viên" vs "Anh Trần Văn B - Phụ huynh"), thời gian gửi chính xác.
    - Bong bóng chat phân biệt rõ màu sắc (Trường: nền xanh nhạt bên phải; Phụ huynh: nền xám trắng bên trái).
    - Huy hiệu "Chờ phản hồi từ..." hiển thị rõ ràng trên thanh tiêu đề trao đổi (`BR05`).
  - **Khung soạn thảo phản hồi (Discussion Composer — `BR06`):**
    - Textarea nhập nội dung phản hồi từ nhà trường.
    - Nút đính kèm ảnh (hỗ trợ preview ảnh trước khi gửi).
    - Nút "Gửi" màu xanh: Bị vô hiệu hóa (disabled) nếu nội dung rỗng hoặc toàn khoảng trắng (`BR06`). Khi gửi thành công, tự động đổi `waitingFor` thành `parent` (`K057`).
- **Cột Bên Phải (Metadata & Ngữ Cảnh — 30% Width):**
  - **Thẻ 1: Thông tin góp ý:**
    - Loại góp ý, Ngày tạo, Học sinh liên quan, Lớp học.
    - Dropdown đổi Người xử lý.
    - Dropdown đổi Độ ưu tiên.
    - Nút hành động chính: "Đóng góp ý" (chỉ hiện khi chưa hoàn tất, mở `MODAL-FDB-CLOSE`).
  - **Thẻ 2: Thông tin người tạo:**
    - Họ tên phụ huynh, mối quan hệ (Bố/Mẹ), số điện thoại, email.
    - Các trường thiếu hiển thị rõ `"Chưa có {trường}"` (`BR08`).
  - **Thẻ 3: Góp ý gần đây:**
    - Danh sách các ticket trước đó từ cùng phụ huynh này kèm mã và trạng thái.
    - Nếu không có, hiển thị chuỗi mặc định `"Không có góp ý gần đây"`.

#### MODAL-FDB-CLOSE: Modal Xác Nhận Đóng Góp Ý (GY-01)
- **Primary Purpose:** Guarded terminal confirmation modal preventing premature or accidental ticket resolution.
- **Interactive Elements:**
  - Tiêu đề modal: "Xác nhận đóng góp ý".
  - Nội dung cảnh báo (`GY-01`): *"Vui lòng xác nhận Đóng góp ý {tên góp ý}"*.
  - Lưu ý hệ quả: Trạng thái sẽ chuyển thành Hoàn tất và thông báo sẽ được gửi tới phụ huynh.
  - Nút "Hủy bỏ" và nút "Xác nhận đóng" màu xanh lá hoặc đỏ an toàn.

#### MODAL-FDB-PROFILE: Modal Xem Nhanh Thông Tin Học Sinh & Phụ Huynh (BR08)
- **Primary Purpose:** Contextual read-only quick view displaying identity, class enrollment, and parent contact details without navigating away.
- **Interactive Elements:**
  - Header: "Thông tin học sinh" hoặc "Thông tin phụ huynh".
  - Avatar, họ tên, ngày sinh, giới tính, mã định danh.
  - Thông tin liên hệ: Số điện thoại, Email, Địa chỉ cư trú.
  - **Quy tắc hiển thị fallback:** Mọi trường dữ liệu chưa có đều hiển thị rõ ràng `"Chưa có {trường}"` (ví dụ: `"Chưa có số điện thoại"`, `"Chưa có email"`).
  - Nút "Đóng" để trở lại màn hình đang làm việc.


### Section 19: School Academic Year (Năm Học — Module 29) Screens

#### SCR-AY-01: Trang Danh Mục Năm Học (`/[schoolCode]/school/academic-year`)
- **Primary Purpose:** Centralized administrative milestone directory displaying academic years and semester sub-terms with automatic current-year highlights, instant client-side search, and strict referential protection.
- **Interactive Layout & Components:**
  - **Breadcrumbs & Header:**
    - Breadcrumb path: `Nhà trường` > `Năm học`.
    - Page Title: "Năm học" accompanied by subtitle "Quản lý danh sách các năm học và kỳ học trong toàn trường".
  - **Top Toolbar:**
    - **Ô Tìm kiếm năm học:** Search input with search icon (`faSearch`) and clear button. Evaluates against academic year titles in real-time ($< 10\text{ms}$) case- and diacritic-insensitively (`BR05`).
    - **Nút "+ Tạo năm học":** Primary brand blue button (`#0070CE`) triggering `MODAL-AY-FORM` in creation mode (`modalMode = 'create'`).
  - **Bảng Danh sách Năm học (Academic Year Table Roster):**
    - **Cột 1: Tên năm học:** Free-form text (`BR02`, `K061`). If active based on today's calendar date, text is rendered in bold brand blue (`#0070CE`) accompanied by a distinctive "Hiện tại" badge chip (`BR01`, `K059`).
    - **Cột 2: Ngày bắt đầu:** Formatted as `DD/MM/YYYY`.
    - **Cột 3: Ngày kết thúc:** Formatted as `DD/MM/YYYY`.
    - **Cột 4: Hành động:** Strictly contains only the Edit button (`faEdit` icon). The Delete action and trash can icons are permanently omitted across all UI surfaces to preserve referential integrity (`BR03`, `K060`).
  - **Table Footer:**
    - Live record counter: `"Tổng: N"`. Updates synchronously when search filtering is applied.
  - **Empty State:**
    - Displayed when no academic years match search criteria, showing a clean empty illustration, message *"Không tìm thấy năm học nào phù hợp"*, and `"Tổng: 0"`.

#### MODAL-AY-FORM: Modal Thêm & Chỉnh Sửa Năm Học
- **Primary Purpose:** Focused 3-field modal for creating and updating academic year intervals with disabled submit gating and strict omission of delete controls and manual current-year toggles.
- **Interactive Elements:**
  - **Header:** "Tạo năm học mới" (Create mode) or "Chỉnh sửa năm học" (Edit mode).
  - **Trường 1: Tên năm học *:** Text input with hint text *"VD: Năm học 2026 - 2027 hoặc Kỳ 1 năm học 2026 - 2027"*. Required; trimmed non-empty (`VR-AY-01`).
  - **Trường 2: Ngày bắt đầu *:** Date picker input (`YYYY-MM-DD`). Required (`VR-AY-01`).
  - **Trường 3: Ngày kết thúc *:** Date picker input (`YYYY-MM-DD`). Required (`VR-AY-01`).
  - **Date Validation:** Enforces `Ngày kết thúc >= Ngày bắt đầu` (`VR-AY-02`). Inverted dates render an inline red error message *"Ngày kết thúc phải sau hoặc bằng ngày bắt đầu"*.
  - **Omission Invariant:** Strictly NO manual "Hiện tại" checkbox or radio toggle exists (`K059`). System automatically handles current-year tagging based on system date.
  - **Action Buttons:**
    - **Nút "Hủy":** Closes modal without committing changes.
    - **Nút "Thêm" / "Cập nhật":** Brand Blue button. Remains disabled (`disabled`, opacity 50%, cursor-not-allowed) until all 3 fields are non-empty and `endDate >= startDate` (`NH-01`). Clicking dispatches Redux action, updates the roster, and closes modal with an affirmative toast.

---

### Section 20: School Archive (Lưu Trữ — Module 30) Screens

#### SCR-ARC-01: Trang Danh Sách Học Sinh Lưu Trữ (`/[schoolCode]/school/archive`)
- **Primary Purpose:** Cold-storage directory for withdrawn, transferred, and graduated students providing search, monthly period filtering, sorting, student profile inspection, staff operator inspection, restoration, and guarded permanent purge.
- **Interactive Layout & Components:**
  - **Breadcrumbs & Header:**
    - Breadcrumb path: `Nhà trường` > `Lưu trữ`.
    - Page Title: "Lưu trữ" accompanied by subtitle "Danh sách học sinh đã rút hồ sơ, chuyển trường hoặc tốt nghiệp".
  - **Top Toolbar:**
    - **Ô Tìm kiếm học sinh:** Search input with search icon (`faSearch`) and clear button. Evaluates against student name, nickname, and student code in real-time ($< 10\text{ms}$) case- and diacritic-insensitively (`BR08`, `BR10`).
    - **Bộ lọc mở rộng (Thời gian lưu trữ):** Dropdown select allowing filtering by archive month/year (`YYYY-MM`) (`BR07`).
    - **Nút "Xuất dữ liệu":** Button in top right exporting filtered archived student list to an external spreadsheet (`BR09`).
    - **Zero-Creation Invariant:** Strictly omits any "Thêm học sinh" or "Tạo học sinh" buttons (`BR01`, `K064`).
  - **Bảng Danh Sách Học Sinh Lưu Trữ (Archived Student Table):**
    - **Cột 1: STT:** Numerical index.
    - **Cột 2: Mã HS:** Alphanumeric identifier (e.g. `HS-2026-089`).
    - **Cột 3: Học sinh:** Clickable student name with sort arrow icon toggling A→Z and Z→A ordering (`BR08`). Clicking student name opens `MODAL-ARC-DETAIL`.
    - **Cột 4: Lớp cũ:** Former class name (e.g. `Lớp 9A1`).
    - **Cột 5: Ngày sinh:** Formatted as `DD/MM/YYYY`.
    - **Cột 6: Giới tính:** Male (`Nam`) or Female (`Nữ`).
    - **Cột 7: Lý do lưu trữ:** Free-form text reason (e.g. "Chuyển nhà", "Tốt nghiệp ra trường", "Thôi học") (`BR02`).
    - **Cột 8: Ngày lưu trữ:** Formatted as `DD/MM/YYYY`.
    - **Cột 9: Lưu trữ bởi:** Clickable staff operator name (`BR02`). Clicking opens `MODAL-ARC-STAFF`.
    - **Cột 10: Hành động:** Exactly 2 action icon buttons (`BR04`):
      1. Icon **Phục hồi** (`faBoxOpen` / `faTrashRestore`): Triggers `MODAL-ARC-RESTORE`.
      2. Icon **Xóa** (`faTrash`): Triggers `MODAL-ARC-PURGE`.
    - **Null Tolerance:** For legacy records lacking date, staff, or reason, cells render clean empty spaces (`—` or blank) without text errors (`K067`).
  - **Table Footer:**
    - Total counter: `"Tổng: N"`. Updates synchronously when search or month filtering is applied.

#### MODAL-ARC-DETAIL: Modal Thông Tin Học Sinh Đã Lưu Trữ (`BR03`)
- **Primary Purpose:** Comprehensive read-only profile modal displaying student identity, guardian contact info, and archive context metadata.
- **Interactive Elements:**
  - **Yellow Warning Banner:** Distinctive warning header with lock icon `🔒 Học sinh đã được lưu trữ`.
  - **Demographics & Profile (Read-Only):** Avatar, full name, nickname, student code, date of birth, gender, former class, address, and guardian information.
  - **Archive Metadata Section (Bottom):**
    - `Lý do lưu trữ`: Displayed reason text.
    - `Ngày lưu trữ`: Formatted date.
    - `Ghi chú lưu trữ`: Detailed notes (renders *"Chưa có ghi chú"* if blank).
    - *Omission Invariant:* "Lưu trữ bởi" is strictly omitted from this modal per legacy specification (`BR03`).
  - **Action Button:** "Đóng" button to dismiss modal.

#### MODAL-ARC-STAFF: Modal Thông Tin Quản Trị / Nhân Sự Lưu Trữ (`BR02`)
- **Primary Purpose:** Contextual staff quick-view modal opened by clicking the name in the "Lưu trữ bởi" column.
- **Interactive Elements:**
  - Avatar, full name, institutional role (e.g., "Quản trị viên", "Giáo viên chủ nhiệm").
  - Contact details: Email address, phone number, department.
  - Action button: "Đóng" button.

#### MODAL-ARC-RESTORE: Modal Xác Nhận Phục Hồi Học Sinh (`LT-01`, `BR04`, `BR05`, `K066`)
- **Primary Purpose:** Non-destructive restoration confirmation modal with friendly illustration.
- **Interactive Elements:**
  - Friendly graphic illustration (two smiling school children).
  - Header: "Phục hồi học sinh".
  - Prompt: *"Vui lòng xác nhận phục hồi học sinh {tên học sinh}!"* (`LT-01`).
  - Informative note: *"Học sinh sẽ được đưa trở lại danh sách học sinh đang học trong module Học Sinh."*
  - Buttons: "Hủy bỏ" and primary "Xác nhận phục hồi".

#### MODAL-ARC-PURGE: Modal Xác Nhận Xoá Vĩnh Viễn Học Sinh (`LT-02`, `BR04`, `BR06`, `K065`)
- **Primary Purpose:** Destructive permanent hard deletion confirmation modal with prominent red hazard styling.
- **Interactive Elements:**
  - Severe graphic illustration (two school children marked with a prominent red X).
  - Header: Red warning banner "Xóa vĩnh viễn học sinh".
  - Prompt: *"Vui lòng xác nhận xoá học sinh {tên học sinh}!"* (`LT-02`).
  - High-impact alert: *"Cảnh báo: Thao tác này sẽ xoá hoàn toàn hồ sơ học sinh cùng toàn bộ lịch sử điểm danh, hoá đơn học phí và đánh giá. Dữ liệu không thể phục hồi sau khi xoá!"*
  - Buttons: "Hủy bỏ" and destructive red button "Xác nhận xoá vĩnh viễn".

---

### Section 21: School Master Profile (Trường — Module 31) Screens

#### SCR-SCH-INFO-01: Trang Tổng Quan Trường Học (`/[schoolCode]/setting/school`, alias `/school/info/`)
- **Primary Purpose:** Authoritative, read-only institutional dashboard presenting complete school identity, logo, operating hours, and attendance baseline configuration. Zero input controls exist on this surface to safeguard master data from accidental keystrokes (`BR01`, `K069`).
- **Interactive Layout & Components:**
  - **Breadcrumbs & Header:**
    - Breadcrumb path: `Cấu hình` > `Trường`.
    - Page Title: "Thông tin trường học".
    - Top-Right Action: Explicit Edit Button (`icon_edit_square` / `faEdit`, "Chỉnh sửa") navigating to `/setting/school/edit` (`K069`).
  - **Card 1: Thông tin cơ bản (Institutional Profile Card - Read-Only):**
    - Logo preview badge with default institutional avatar fallback if not uploaded.
    - Tên trường: Prominent bold title (e.g. "Trường Mầm Non Ban Mai").
    - Mã trường: Institutional identifier chip (e.g. `BANMAI-01`).
    - Khối lớp / Cấp học đào tạo: Read-only badge tags (e.g. `02-TH`, `03-THCS`) accompanied by notice *"Liên hệ Eco School để thay đổi"* (`BR05`).
    - Địa chỉ, Website, Số điện thoại, Email, Khẩu hiệu (Slogan), Thông tin liên hệ.
    - Ngôn ngữ thông báo mặc định: Tag chip (Tiếng Việt / English).
  - **Card 2: Giờ hoạt động trường (Weekly Operating Hours Card - Read-Only):**
    - Weekly schedule table: Monday through Saturday rows displaying green weekday label badges and operating intervals (e.g. "07:00 - 17:30").
    - Sunday row: Displays a static grey non-operational tag ("Không hoạt động") (`K073`).
  - **Card 3: Quy định điểm danh (Attendance Rules Card - Read-Only):**
    - Hình thức điểm danh: Read-only badge chip "Điểm danh 2 buổi" accompanied by notice *"Hiện Eco School chưa hỗ trợ thay đổi thông tin này"* (`BR14`).
    - Khung giờ điểm danh: "Sáng: 07:00 - 11:30" và "Chiều: 13:30 - 17:00".
    - Mốc đến muộn: Badge hiển thị trạng thái (VD: "Bật - 15 phút" hoặc "Tắt").
    - Quy định về muộn: Badge hiển thị trạng thái và thông báo cách tính về muộn.

#### SCR-SCH-INFO-02: Trang Chỉnh Sửa — Tab "Thông tin trường" (`/[schoolCode]/setting/school/edit?tab=info`)
- **Primary Purpose:** Institutional identity form supporting real-time inline validation (`TR-01`) on mandatory fields and logo upload (`FR-SCH-INFO-04`, `BR01`–`BR04`).
- **Interactive Layout & Components:**
  - **Tab Navigation Bar:**
    - Tab 1: **"Thông tin trường"** (Active, primary Eco Blue underline `#006FDA`).
    - Tab 2: **"Giờ hoạt động"** (Inactive, clicks route to `?tab=weekdays` with dirty check `TR-02`).
  - **Form Fields:**
    - `Tên trường *`: Text input. Required. Triggers error `TR-01` *"Vui lòng nhập tên trường"* and red border on blur if left empty (`BR02`).
    - `Tên ngắn gọn`: Text input (optional).
    - `Địa chỉ *`: Text input. Required. Triggers error *"Vui lòng nhập địa chỉ trường"* on blur if left empty.
    - `Website`: URL input (optional).
    - `Số điện thoại`: Phone input (optional, validates standard Vietnam phone format if entered).
    - `Email *`: Email input. Required. Triggers error *"Vui lòng nhập email trường"* or *"Email không đúng định dạng"* on blur.
    - `Khẩu hiệu`: Textarea (optional).
    - `Thông tin liên hệ`: Textarea (optional).
    - `Ngôn ngữ thông báo mặc định`: Dropdown select (`Tiếng Việt`, `Tiếng Anh`).
    - `Logo trường`: Image upload zone with drag-and-drop, preview avatar, file size validation ($\le 2\text{MB}$), and remove logo action.
  - **Action Controls:**
    - Nút "Hủy bỏ": Discards changes (prompting `TR-02` if dirty) and returns to `/setting/school`.
    - Nút "Cập nhật": Primary Eco Blue button. Submits school basic info, commits to Redux store, and displays affirmative success toast.

#### SCR-SCH-INFO-03: Trang Chỉnh Sửa — Tab "Giờ hoạt động" (`/[schoolCode]/setting/school/edit?tab=weekdays`)
- **Primary Purpose:** Independent sub-forms for configuring Monday–Saturday bell schedule intervals and attendance calculation rules with fee linkage (`FR-SCH-INFO-005`..`007`, `K071`–`K074`).
- **Interactive Layout & Components:**
  - **Sub-Form A: Giờ hoạt động trường (Weekly Hours Sub-Form):**
    - Schedule list: 6 rows for Thứ 2, Thứ 3, Thứ 4, Thứ 5, Thứ 6, Thứ 7.
    - Day Labels: Vibrant green badges (`bg-emerald-50 text-emerald-700`).
    - Time Pickers: Opening and closing time selects constrained to fixed 5-minute stepped intervals (`06:00` to `18:00`) (`BR08`, `K072`).
    - Sunday row: Statically styled with grey badge "Chủ nhật: Không hoạt động", omitting all inputs (`BR09`, `K073`).
    - Validation: Enforces `openTime < closeTime` for all active days (`VR-SCH-05`).
    - Nút "Cập nhật" (Sub-form A): Saves operating hours independently. Does not submit or validate attendance rules (`K071`).
  - **Sub-Form B: Quy định điểm danh (Attendance Rules Sub-Form):**
    - Section Header: "Quy định điểm danh".
    - `Hình thức điểm danh`: Read-only tag "Điểm danh 2 buổi" with notice *"Hiện Eco School chưa hỗ trợ thay đổi thông tin này"* (`BR14`).
    - `Đến muộn` Toggle Switch: When enabled, activates the late arrival threshold dropdown (5 to 60 minutes in steps of 5: 5, 10, 15, 20, ..., 60). When disabled, dropdown is dimmed/disabled while retaining previous value (`BR10`).
    - `Về muộn` Toggle Switch: Accompanied by descriptive notice *"Học sinh ra về sau 15 phút so với giờ hoạt động sẽ tính là về muộn"*. When enabled, renders an active hyperlink: *"Cài đặt phí trông học sinh về muộn tại đây"* pointing directly to `/setting/fee` (`BR11`, `K074`).
    - Nút "Cập nhật" (Sub-form B): Saves attendance rules independently. Does not modify or re-submit operating hours (`K071`).

#### MODAL-UNSAVED-LEAVE: Modal Cảnh Báo Rời Khỏi Khi Chưa Lưu (`TR-02`, `FR-SCH-INFO-008`, `BR12`)
- **Primary Purpose:** Navigation guard modal intercepting attempts to switch tabs, click sidebar navigation, or depart the edit screen with uncommitted form edits.
- **Interactive Elements:**
  - Header: "Chưa lưu thay đổi".
  - Warning prompt: *"Thay đổi của bạn chưa được lưu. Vui lòng xác nhận rời khỏi khi chưa lưu!"* (`TR-02`).
  - Buttons:
    - Nút "Hủy bỏ": Closes modal, keeps user on current form with all draft edits intact.
    - Nút "Xác nhận rời khỏi": Discards draft state and completes navigation to target destination.

---

### Section 22: Account Management (Tài Khoản — Module 32) Screens

#### SCR-ACC-01: Trang Quản Lý Tài Khoản — Tab Người Dùng (`/[schoolCode]/setting/users`)
- **Primary Purpose:** Directory of institutional user accounts (Administrators, Managers, Teachers, Staff, Parents) supporting multi-role badge pills, status toggling, role and sync filtering, and Super-Admin / CSDL Sở protections (`FR-ACC-001`, `FR-ACC-002`, `K076`).
- **Interactive Layout & Components:**
  - **Breadcrumbs & Header:**
    - Breadcrumb path: `Cấu hình` > `Tài khoản`.
    - Page Title: "Quản lý tài khoản" accompanied by subtitle "Quản lý người dùng hệ thống và tài khoản đăng nhập học sinh".
  - **Tab Navigation Bar:**
    - Tab 1: **"Người Dùng"** (Active, primary Eco Blue underline `#006FDA`).
    - Tab 2: **"Học Sinh"** (Inactive, clicks route to `?tab=students` or `/school/kid/accounts`).
  - **Top Toolbar:**
    - **Ô Tìm kiếm:** Search input evaluating against user name, email, and phone number in real-time ($< 10\text{ms}$).
    - **Bộ lọc vai trò (Role Filter):** Dropdown select (Tất cả, Quản trị viên, Quản lý, Giáo viên, Nhân viên, Phụ huynh).
    - **Bộ lọc trạng thái (Status Filter):** Dropdown select (Tất cả, Đang hoạt động, Ngừng hoạt động). Default preset is **"Đang hoạt động"** (`active`) (`BR16`).
    - **Bộ lọc nguồn đồng bộ (CSDL Sở):** Filter toggle/checkbox isolating accounts synchronized from the national education database.
    - **Nút "+ Thêm người dùng":** Primary Eco Blue button opening `MODAL-ACC-USER-FORM` in creation mode (`BR02`).
  - **Bảng Danh Sách Người Dùng (User Accounts Table):**
    - **Cột 1: STT:** Numerical row index.
    - **Cột 2: Họ và tên:** User full name with avatar. If account has role "Phụ huynh", linked student names are rendered underneath as small badge tags (`BR16`). Accounts synchronized from CSDL Sở carry a distinctive blue badge `CSDL Sở` (`BR05`).
    - **Cột 3: Email:** Formatted email string.
    - **Cột 4: Số điện thoại:** Formatted Vietnam phone number.
    - **Cột 5: Vai trò:** Multi-role badge pills (e.g. `[Quản lý] [Giáo viên]`).
    - **Cột 6: Trạng thái:** Toggle switch (`tomia-switch`).
      - On standard accounts: Toggling applies immediately, updating state and displaying auto-dismissing toast `TK-06` without a modal (`BR06`, `K079`).
      - On CSDL Sở accounts: Toggling is blocked by the system, displaying red error banner `TK-03`: *"Không thể cập nhật với đối tượng được đồng bộ từ CSDL ngành"* while keeping status unchanged (`BR06`, `K078`).
    - **Cột 7: Hành động:**
      - On standard accounts: Exactly 2 action icon buttons: Edit pencil (opens `MODAL-ACC-USER-FORM` in edit mode) and Delete trash can (opens `MODAL-ACC-DELETE-USER`) (`BR15`).
      - On Admin accounts: Edit and Delete icons are completely suppressed; only the View eye icon is visible (`BR03`, `K077`).
  - **Table Footer:**
    - Total counter: `"Tổng: N"`.

#### SCR-ACC-02: Trang Quản Lý Tài Khoản — Tab Học Sinh (`/[schoolCode]/school/kid/accounts`, alias `?tab=students`)
- **Primary Purpose:** Pupil login directory maintaining a strict 1-to-1 mapping with enrolled students, providing class filtering, account status filtering, and credential provisioning (`FR-ACC-009`, `BR19`–`BR21`, `K082`).
- **Interactive Layout & Components:**
  - **Tab Navigation Bar:** Tab 1 "Người Dùng", Tab 2 "Học Sinh" (Active).
  - **Top Toolbar:**
    - Search input: Evaluates against student name and student code.
    - Class filter: Dropdown select (All classes, Lớp 1A1, Lớp 1A2...).
    - Account status filter: Dropdown select (Tất cả, Đã có tài khoản, Chưa có tài khoản) (`BR21`).
  - **Bảng Tài Khoản Học Sinh (Student Accounts Table):**
    - **Cột 1: STT:** Numerical index.
    - **Cột 2: Mã học sinh:** Student code.
    - **Cột 3: Họ và tên:** Student full name with avatar.
    - **Cột 4: Lớp:** Assigned class name.
    - **Cột 5: Tên tài khoản:** Displayed login username. Renders "—" if not yet provisioned.
    - **Cột 6: Trạng thái:** Active / Inactive badge chip.
    - **Cột 7: Hành động:**
      - For students without an account: Green `+` icon button opening `MODAL-ACC-STUDENT-FORM` in create mode (`BR19`).
      - For students with an account: Blue pencil icon button opening `MODAL-ACC-STUDENT-FORM` in edit mode (`BR20`).
  - **Table Footer:**
    - Total counter: `"Tổng: N"`.

#### MODAL-ACC-USER-FORM: Modal Tạo & Chỉnh Sửa Người Dùng (`BR02`–`BR13`, `K077`–`K081`)
- **Primary Purpose:** Comprehensive user account form supporting multi-role configuration, dynamic conditional sub-sections, CSDL Sở immutability rules, and update confirmation gating.
- **Interactive Elements:**
  - **Header:** "Thêm người dùng mới" or "Chỉnh sửa người dùng".
  - **CSDL Sở Advisory Banner (Edit mode only):** Yellow warning banner *"Tài khoản này được đồng bộ từ CSDL ngành. Một số thông tin định danh không thể chỉnh sửa tại trường"* (`BR05`).
  - **Roles Multi-Select Checkboxes:** Admin, Quản lý, Giáo viên, Nhân viên, Phụ huynh (`BR02`).
    - *Admin Role Protection:* On create form, the "Admin" checkbox is permanently disabled (`disabled=true`) to block privilege escalation (`BR04`, `K077`).
  - **Basic Info Fields:**
    - `Họ và tên *`: Text input. Required. Locked and disabled (`disabled=true`) when editing a CSDL Sở account (`BR05`, `K078`).
    - `Email *`: On create mode: editable email input. On edit mode: read-only text accompanied by a "Thay đổi" button opening `MODAL-ACC-CHANGE-EMAIL` (`BR08`, `K080`).
    - `Số điện thoại`: Text input.
    - `Giới tính`: Radio select (Nam / Nữ).
    - `Ngày sinh`: Date picker.
  - **Dynamic Staff Controls (Visible when "Nhân viên" is checked) (`BR10`):**
    - `Mã nhân viên`: Text input.
    - `Chức năng nhân viên *`: 4 checkboxes with tooltips: Điểm danh, Kế toán, Thông báo, Chăm sóc/Y tế.
    - *Validation TK-02:* If "Nhân viên" is checked and zero functions are selected, renders inline red error `TK-02`: *"Vui lòng chọn chức năng"* (`K081`).
  - **Dynamic Management Controls (Visible when "Quản lý" is checked) (`BR12`):**
    - `Lớp phụ trách`: Multi-select class picker.
  - **Collapsible "Thông tin bổ sung" (Visible when "Nhân viên" or "Giáo viên" is checked) (`BR13`):**
    - CCCD/CMND, Chức vụ, Ngày vào làm, Bằng cấp, Kỹ năng, Bộ phận/Tổ chuyên môn.
  - **Action Controls:**
    - Nút "Hủy bỏ": Dismisses modal.
    - Nút "Thêm mới" / "Cập nhật": Primary Eco Blue button.
      - On creation: Commits user record to store.
      - On edit: Intercepts submission and presents confirmation modal `TK-05` before persistence (`BR07`, `K079`).

#### MODAL-ACC-CHANGE-EMAIL: Modal Thay Đổi Email (`BR08`, `K080`)
- **Primary Purpose:** Focused credential modal for modifying user email address with affirmative confirmation.
- **Interactive Elements:**
  - Header: "Thay đổi email người dùng".
  - Current email: Read-only display.
  - New email input: Text input validating RFC 5322 regex.
  - Informative notice: *"Email này sẽ được sử dụng làm tên đăng nhập và nhận thông báo từ hệ thống."*
  - Buttons: "Hủy bỏ" and "Xác nhận thay đổi".

#### SCR-ACC-PASSWORD: Trang Đổi Mật Khẩu Chuyên Dụng (`/[schoolCode]/setting/users/[id]/password`) (`BR09`, `K080`)
- **Primary Purpose:** Dedicated security sub-page under `BẢO MẬT` for updating user passwords, enforcing session revocation warnings in compliance with Decree 13/2023/NĐ-CP.
- **Interactive Elements:**
  - Breadcrumbs: `Cấu hình` > `Tài khoản` > `Đổi mật khẩu`.
  - Section Header: "BẢO MẬT: Đặt lại mật khẩu đăng nhập".
  - Revocation Advisory: High-visibility security notice *"Cảnh báo: Đổi mật khẩu sẽ tự động đăng xuất tất cả các phiên làm việc đang hoạt động của người dùng này trên mọi thiết bị."*
  - `Mật khẩu mới *`: Password input with eye icon toggling cleartext visibility ($\ge 8$ chars).
  - `Xác nhận mật khẩu mới *`: Password confirmation input.
  - Action Controls: "Hủy bỏ" (returns to user roster) and primary "Lưu mật khẩu".

#### MODAL-ACC-CONFIRM-UPDATE: Modal Xác Nhận Cập Nhật Tài Khoản (`TK-05`, `BR07`, `K079`)
- **Primary Purpose:** Affirmative confirmation dialog guarding form-level account modifications.
- **Interactive Elements:**
  - Prompt: *"Vui lòng xác nhận cập nhật tài khoản này!"* (`TK-05`).
  - Buttons: "Hủy bỏ" and "Xác nhận".

#### MODAL-ACC-DELETE-USER: Modal Xác Nhận Xóa Tài Khoản (`TK-04`, `BR15`)
- **Primary Purpose:** Guarded deletion modal for non-Admin user accounts.
- **Interactive Elements:**
  - Prompt: *"Vui lòng xác nhận xoá tài khoản [Họ và tên]!"* (`TK-04`).
  - Buttons: "Hủy bỏ" and destructive "Xác nhận xóa".

#### MODAL-ACC-STUDENT-FORM: Modal Cấp / Chỉnh Sửa Tài Khoản Học Sinh (`BR19`, `BR20`, `K082`)
- **Primary Purpose:** Credential management dialog for student login accounts.
- **Interactive Elements:**
  - Header: "Cấp tài khoản học sinh" or "Chỉnh sửa tài khoản học sinh".
  - Student Context: Read-only display of student name, student code, and class.
  - `Tên tài khoản *`: Text input with regex validation (`/^[a-zA-Z0-9_\-\.]+$/`). Displays green helper text *"Tên đăng nhập chỉ chứa chữ cái, số, dấu gạch dưới, gạch ngang hoặc chấm."*
  - `Mật khẩu *`: Password input with eye visibility toggle.
  - `Trạng thái`: Active / Inactive switch.
  - Buttons: "Hủy bỏ" and "Lưu tài khoản".





### 23. Module 6: Cấu Hình — Nhận Diện (Face Recognition Management Screens)

#### SCR-REC-01: Bảng Danh Sách Đăng Ký Nhận Diện (`/[schoolCode]/setting/face-recognition`)
- **Primary Purpose:** Main directory screen displaying all enrolled students of the school, tracking their biometric facial registration status, providing search and class/status filtering, and hosting creation/edit/deletion actions (`K083`, `FR-REC-002`).
- **Interactive Elements:**
  - Header: Tiêu đề trang: "Đăng ký nhận diện".
  - Toolbar controls (`FR-REC-003`, `BR07`, `BR08`):
    - `Tìm kiếm theo học sinh`: Text input with magnifying glass icon, matching student name (accent-insensitive) or student code.
    - `Chọn lớp học`: Dropdown selecting "Tất cả lớp" or a specific active class.
    - `Chọn trạng thái nhận diện`: Dropdown with exactly 2 options: "Đã đăng ký nhận diện" và "Chưa đăng ký nhận diện" (plus "Tất cả trạng thái").
  - Data Table (`FR-REC-002`, `BR01`, `BR02`, `K087`):
    - Cột 1: `STT` (Sequential 1-indexed number).
    - Cột 2: `Mã học sinh` (Student ID code).
    - Cột 3: `Họ và tên` (Student avatar, full name, and nickname if present).
    - Cột 4: `Lớp` (Class display name, rendered as an active navigation hyperlink to `/[schoolCode]/school/classes/[classId]`).
    - Cột 5: `Ảnh nhận diện`:
      - Khi chưa đăng ký: Hiển thị ký tự `-`.
      - Khi đã đăng ký: Hiển thị ảnh thumbnail vuông bo góc thực tế của học sinh.
    - Cột 6: `Ngày ghi nhận`:
      - Khi chưa đăng ký: Hiển thị ký tự `-`.
      - Khi đã đăng ký: Hiển thị ngày định dạng `DD/MM/YYYY`.
    - Cột 7: `Hành động`:
      - Khi chưa đăng ký: Hiển thị đúng 1 nút tròn màu xanh primary có icon `+` (tooltip: *"Đăng ký ảnh nhận diện"*).
      - Khi đã đăng ký: Hiển thị đúng 2 nút tròn: Nút sửa màu xám/vàng có icon cây bút chì (tooltip: *"Chỉnh sửa ảnh nhận diện"*) và Nút xóa màu đỏ có icon `X` hoặc thùng rác (tooltip: *"Xóa ảnh nhận diện"*).
  - Footer bar (`BR09`):
    - Chỉ số: `Tổng: N` (phản ánh chính xác tổng số học sinh khớp với bộ lọc).
    - Bộ điều khiển phân trang: Previous, trang hiện tại, Next.

#### MODAL-REC-01: Modal Đăng Ký Ảnh Nhận Diện (`FR-REC-005`, `BR03`, `BR04`, `K085`, `K086`)
- **Primary Purpose:** Dialog for enrolling a new biometric reference image for an un-enrolled student.
- **Interactive Elements:**
  - Tiêu đề modal: "Đăng ký ảnh nhận diện".
  - Nút đóng `X` ở góc trên bên phải.
  - Khối thông tin học sinh (hoàn toàn read-only, lấy từ hồ sơ học sinh) (`BR03`, `K085`):
    - `Biệt danh`: Text read-only.
    - `Giới tính`: Text read-only ("Nam" / "Nữ").
    - `Ngày sinh`: Text read-only (`DD/MM/YYYY`).
    - `Lớp học`: Link điều hướng tới trang chi tiết lớp học.
  - Khối Upload Ảnh:
    - Khung xem trước ảnh đại diện avatar mặc định.
    - Nút `UPLOAD FILE`: Kích hoạt file input chọn ảnh chân dung (`.jpg`, `.jpeg`, `.png`, `.webp`).
    - Ghi chú hướng dẫn: "Vui lòng chọn ảnh chụp chính diện, rõ mặt, không đeo kính râm hoặc khẩu trang".
  - Nút hành động phía dưới:
    - `Hủy bỏ`: Đóng modal, không lưu thay đổi.
    - `Đăng ký`: Mặc định bị khóa (`disabled: true`). Chỉ chuyển sang enabled khi người dùng đã chọn một file ảnh hợp lệ qua "UPLOAD FILE" (`BR04`, `K086`). Nhấn nút sẽ lưu ảnh và chuyển dòng sang trạng thái đã đăng ký.

#### MODAL-REC-02: Modal Chỉnh Sửa Ảnh Nhận Diện (`FR-REC-006`, `BR04`, `BR05`, `K086`)
- **Primary Purpose:** Dialog for replacing an existing facial recognition reference image.
- **Interactive Elements:**
  - Tiêu đề modal: "Chỉnh sửa ảnh nhận diện".
  - Khối thông tin học sinh: Hiển thị 4 trường read-only (Biệt danh, Giới tính, Ngày sinh, Lớp học link) (`BR03`).
  - Khối Xem Trước & Thay Ảnh:
    - Khung preview hiển thị đúng ảnh nhận diện hiện tại của học sinh (`BR05`).
    - Nút `UPLOAD FILE`: Cho phép chọn tệp ảnh mới để thay thế.
  - Nút hành động phía dưới:
    - `Hủy bỏ`: Đóng modal, giữ nguyên ảnh cũ.
    - `Đăng ký`: Mặc định bị khóa (`disabled: true`). Việc mở modal và nhìn thấy ảnh cũ KHÔNG đủ để bật nút này; Quản trị viên bắt buộc phải chọn một tệp ảnh mới thì nút mới được kích hoạt (`BR04`, `K086`).

#### MODAL-REC-03: Hộp Thoại Xác Nhận Xóa Thông Tin Nhận Diện (`FR-REC-007`, `BR06`, `K088`, `NFR01`)
- **Primary Purpose:** Affirmative confirmation modal preventing accidental erasure of student biometric identification profiles under Decree 13/2023/NĐ-CP.
- **Interactive Elements:**
  - Tiêu đề: "Xác nhận xóa".
  - Nội dung cảnh báo rõ ràng nêu đích danh học sinh (`BR06`, `K088`):
    *"Vui lòng xác nhận xóa thông tin nhận diện của học sinh {Họ tên}"*
  - Nút hành động:
    - `Hủy bỏ`: Đóng hộp thoại, bảo toàn nguyên vẹn dữ liệu nhận diện của học sinh.
    - `Xác nhận`: Thực thi xóa dữ liệu nhận diện, chuyển ảnh và ngày về `-`, và đổi icon cột hành động trở lại icon `+`.

---

## Section 24: Cấu Hình — Tính Năng (Feature Flags & Academic Term Configuration)

### SCR-FEAT-01: Màn hình Cấu hình tính năng — Tab Hoạt Động (Activity Feature Settings)
- **Canonical Route:** `/[schoolCode]/setting/activity/` (Tab mặc định)
- **Primary Purpose:** Centralized operational switchboard for classroom activity social interaction and moderation policies.
- **Layout & Structure:**
  - Header: Tiêu đề trang `"Cấu hình tính năng"` kèm breadcrumbs `Cấu hình / Tính năng`.
  - Tab Switcher: Thanh tab điều hướng gồm 2 tab `"Hoạt Động"` (active) và `"Học Kỳ"` (liên kết sang `/setting/period/`).
  - Container Cấu Hình: Thẻ card nền trắng, bo góc, phân tách rõ ràng 2 thiết lập toggle:
    1. **Bình luận:**
       - Label: "Bình luận".
       - Description: "Cho phép phụ huynh và giáo viên bình luận trên các bài đăng hoạt động lớp".
       - Control: Toggle switch màu xanh thương hiệu (`#0070CE`).
    2. **Duyệt bình luận:**
       - Label: "Duyệt bình luận".
       - Description: "Yêu cầu giáo viên hoặc quản trị viên duyệt bình luận trước khi hiển thị công khai".
       - Control: Toggle switch màu xanh thương hiệu (`#0070CE`).
       - Interaction: Hoạt động hoàn toàn độc lập với toggle "Bình luận"; tắt toggle "Bình luận" KHÔNG vô hiệu hóa hoặc làm mờ toggle này (`BR02`, `K090`).
  - Action Footer:
    - Nút `Cập nhật`:
      - Vị trí: Góc dưới bên trái card.
      - Trạng thái mặc định: Bị khóa (`disabled: true`), nền xám nhạt (`#E2E8F0`), chữ mờ (`#94A3B8`).
      - Trạng thái Dirty: Tự động chuyển sang enabled (nền xanh thương hiệu `#0070CE`, chữ trắng) ngay khi người dùng thay đổi bất kỳ toggle nào so với cấu hình đã lưu (`BR03`, `K091`).
      - Click Action: Lưu cấu hình vào store, kích hoạt thông báo toast `"Cập nhật cấu hình thành công"`, và đưa nút trở lại trạng thái disabled.

---

### SCR-FEAT-02: Màn hình Cấu hình tính năng — Tab Học Kỳ (Academic Period Settings)
- **Canonical Route:** `/[schoolCode]/setting/period/`
- **Primary Purpose:** Roster view and inline editor for academic semester boundaries across the school year.
- **Layout & Structure:**
  - Header & Tab Switcher: Đồng bộ với Tab Hoạt Động, tab `"Học Kỳ"` ở trạng thái active.
  - Toolbar Điều Khiển:
    - Dropdown `Năm học`: Danh sách các năm học thực tế lấy từ module Năm Học (`school/season`). Mặc định chọn năm học đang là năm hiện hành kèm nhãn `(Hiện tại)` (`BR04`).
    - Nút `+ Thêm học kỳ`:
      - Vị trí: Phía bên phải toolbar.
      - Trạng thái: Tự động bị vô hiệu hóa (`disabled: true`) khi năm học đang chọn đã có đủ 2 học kỳ (`BR05`, `K092`).
      - Click Action: Thêm một dòng nhập liệu inline trống ở cuối bảng và khóa nút này để tránh tạo nhiều dòng đồng thời (`BR08`).
  - Bảng Cấu Hình Học Kỳ:
    - Cột 1: `Học kỳ` (Tên học kỳ, VD: `Học kì 1`, `Học kì 2`).
    - Cột 2: `Ngày bắt đầu` (Định dạng `DD/MM/YYYY`).
    - Cột 3: `Ngày kết thúc` (Định dạng `DD/MM/YYYY`).
    - Cột 4: `Ghi chú` (Ghi chú tùy chọn hoặc để trống).
    - Cột 5: `Hành động` (Hiển thị icon bút chì Sửa cho dòng đã lưu; KHÔNG có icon Xóa - `BR09`, `K094`).
  - Trạng thái Rỗng (Empty State):
    - Khi chọn một năm học chưa có học kỳ nào được khai báo, bảng hiển thị một dòng duy nhất toàn chiều rộng với nội dung: *"Chưa có học kỳ"* (`BR10`).

---

### COMP-FEAT-01: Thành phần Dòng nhập liệu Inline (InlineTermRow)
- **Primary Purpose:** Encapsulated component handling read-only display vs inline editing controls for an academic term row (`BR06`, `K093`, `NFR02`).
- **Interactive States:**
  1. **Chế độ Hiển Thị (Read-Only Mode):**
     - Hiển thị văn bản tên học kỳ, ngày bắt đầu, ngày kết thúc, ghi chú.
     - Cột hành động: Icon Sửa (hình bút chì). Khi có một dòng khác trong bảng đang ở chế độ sửa hoặc thêm, icon này bị khóa (`disabled: true`, mờ màu) (`BR07`).
  2. **Chế độ Chỉnh Sửa Inline (Inline Edit Mode):**
     - Ô input `Học kỳ`: Text field chỉnh sửa tên học kỳ.
     - Ô input `Ngày bắt đầu`: Date field chọn ngày bắt đầu (`DD/MM/YYYY`).
     - Ô input `Ngày kết thúc`: Date field chọn ngày kết thúc (`DD/MM/YYYY`).
     - Ô input `Ghi chú`: Text field nhập ghi chú.
     - Cột hành động: Cặp icon chuyên dụng:
       - **Icon Lưu (Tick xanh `#16A34A`):** Xác thực `Ngày bắt đầu <= Ngày kết thúc`, lưu dữ liệu, khôi phục dòng về chế độ hiển thị với dữ liệu mới, mở khóa các dòng khác.
       - **Icon Hủy (X xám `#64748B`):**
         - Nếu đang sửa dòng có sẵn: Hủy bỏ các thay đổi, khôi phục dữ liệu ban đầu.
         - Nếu đang thêm dòng mới: Xóa dòng nhập liệu trống khỏi bảng, mở khóa lại nút `+ Thêm học kỳ`.

---

### SCR-NOTIF-01: Màn hình Cấu hình thông báo (Institutional Notification Settings)
- **Canonical Route:** `/[schoolCode]/setting/notification/`
- **Primary Purpose:** Comprehensive, school-wide monolithic cockpit for configuring automated notifications, reminder schedules, and push delivery rules across 5 operational modules.
- **Layout & Structure:**
  - Header: Tiêu đề trang `"Cấu hình thông báo"` kèm breadcrumbs `Cấu hình / Thông báo`.
  - Banner Nguyên Tắc Vận Hành (`NotificationPolicyBanner.tsx`):
    - Khung thông tin màu xanh lam (`#EFF6FF`, viền `#BFDBFE`, icon `faInfoCircle` `#1D4ED8`).
    - Trình bày 3 nguyên tắc bất biến (`BR03`, `K097`):
      1. Áp dụng toàn trường cho tất cả các lớp học, học sinh, phụ huynh và cán bộ nhân viên.
      2. Thông báo tự động gửi đa nền tảng tới Web Portal và Ứng dụng Di động (Mobile App).
      3. Quy tắc Fallback ngày 31: Các lịch nhắc vào ngày 29, 30, 31 sẽ tự động kích hoạt vào ngày cuối cùng của tháng ngắn hơn (ví dụ ngày 28/29 tháng 2).
  - Khối Cấu Hình 1: Điểm Danh (`AttendanceNotificationCard.tsx`):
    - Toggle `Thông báo điểm danh vào/ra`: Bật/tắt gửi thông báo đẩy khi giáo viên thực hiện điểm danh học sinh.
    - Cảnh báo học sinh chưa về lúc 17:00: Ô nhập giờ cố định `17:00` ở chế độ read-only với nền xám mờ (`BR06`, `K100`).
    - Toggle `Thông báo điểm danh hoạt động ngoại khóa`: Kèm dropdown "Áp dụng cho" (`scope`) cho phép chọn "Tất cả các lớp" hoặc các lớp cụ thể (`BR07`, `K101`).
  - Khối Cấu Hình 2: Sinh Nhật (`BirthdayNotificationCard.tsx`):
    - Dòng cấu hình lịch chung: Ô chọn ngày trong tháng (1 - 31) và ô chọn giờ (`HH:mm`, mặc định `09:00`). Không có toggle switch riêng cho dòng này (`BR04`, `K098`).
    - Toggle `Nhắc sinh nhật học sinh`: Bật/tắt gửi thông báo sinh nhật học sinh cho phụ huynh và giáo viên.
    - Toggle `Nhắc sinh nhật giáo viên`: Kế thừa lịch gửi chung ở trên.
    - Toggle `Nhắc sinh nhật Admin nhà trường`: Kế thừa lịch gửi chung ở trên.
  - Khối Cấu Hình 3: Học Phí (`TuitionNotificationCard.tsx`):
    - Toggle `Thông báo phát hành phiếu thu`: Gửi thông báo khi kế toán phát hành hóa đơn học phí mới.
    - Cấu hình nhắc hạn nộp học phí: Toggle switch kết hợp dropdown hướng nhắc ("Trước hạn đóng học phí" hoặc "Sau hạn đóng học phí") và ô nhập số ngày (1 - 31 ngày) (`BR08`, `K102`).
  - Khối Cấu Hình 4: Khác (`OtherNotificationCard.tsx`):
    - Bất đối xứng kênh gửi: Chỉ có 2 mục này cung cấp 2 công tắc độc lập cho Web/App và Email (`BR05`, `K099`):
      1. `Hoạt động chờ duyệt`: 1 toggle Web/App + 1 toggle Email gửi tới ban giám hiệu/quản trị viên khi giáo viên tạo bài hoạt động mới cần duyệt.
      2. `Nhật ký hằng ngày`: 1 toggle Web/App + 1 toggle Email gửi nhắc nhở xem nhật ký lớp lúc 20:00 (giờ `20:00` read-only cố định - `K100`).
  - Khối Cấu Hình 5: Phụ Huynh (`ParentNotificationCard.tsx`):
    - Danh sách các thông báo tự động đẩy tới phụ huynh khi có tương tác từ trường.
    - Các động từ hành động kích hoạt ("điểm danh", "hoạt động", "album", "hình/video") được định dạng bằng chữ in đậm màu cam nổi bật (`#EA580C`) giúp người dùng quét nhanh nội dung (`BR10`, `K103`).
    - Tất cả các nhãn tham chiếu học sinh chuẩn hóa bằng từ khóa "học sinh" (`BR09`).
  - Action Bar Cố Định Dưới Cùng (`NotificationActionBar.tsx`):
    - Khung cố định ở đáy màn hình (sticky bottom).
    - Nút `Cập nhật`:
      - Trạng thái mặc định: Bị vô hiệu hóa (`disabled: true`), nền xám nhạt (`#E2E8F0`), chữ mờ (`#94A3B8`).
      - Trạng thái Dirty: Tự động kích hoạt sang nền xanh thương hiệu (`#0070CE`), chữ trắng khi bất kỳ giá trị nào trên 5 khối card khác với dữ liệu đã lưu.
      - Click Action: Mở modal xác nhận `MODAL-NOTIF-01` (`BR02`, `K096`).

---

### MODAL-NOTIF-01: Modal Xác nhận thay đổi cấu hình thông báo (Confirmation Dialog)
- **Primary Purpose:** Guarded safety dialog preventing accidental system-wide notification dispatch changes (`BR02`, `K096`).
- **Interactive Elements:**
  - Tiêu đề modal: `"Xác nhận thay đổi cấu hình thông báo"`.
  - Nội dung thông báo: *"Vui lòng xác nhận thay đổi cấu hình thông báo của trường!"*.
  - Nút `Hủy bỏ`:
    - Kiểu dáng: Nút phụ viền xám, nền trắng.
    - Click Action: Đóng modal ngay lập tức, giữ nguyên toàn bộ các thay đổi chưa lưu trên form để người dùng tiếp tục chỉnh sửa.
  - Nút `Xác nhận`:
    - Kiểu dáng: Nút chính nền xanh thương hiệu (`#0070CE`), chữ trắng.
    - Click Action: Đóng modal, lưu toàn bộ cấu hình 5 khối vào Redux store / API, hiển thị toast thông báo thành công, và đưa nút "Cập nhật" trở về trạng thái disabled.
