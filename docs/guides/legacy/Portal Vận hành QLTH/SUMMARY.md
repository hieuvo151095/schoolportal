# Managing Portal — Tổng hợp tài liệu (M1–M21)

> Tài liệu tổng hợp toàn bộ quá trình khảo sát **Managing Portal** (`api-dev.ecoschool.com.vn`) — công cụ quản trị nội bộ dành cho nhân viên Finviet/SOHA, xây dựng trên Laravel/CoreUI. Phạm vi khảo sát: **21 module** (M1-M20 theo sidebar, cộng M21 — các tính năng tồn tại nhưng không có trong sidebar). Toàn bộ tài liệu module nằm trong các thư mục con `M{n}-{tên}/`, mỗi thư mục gồm 1 hoặc nhiều file `SM{n}-{tên}.md` (1 file/sub-module) và thư mục `screenshots/` riêng.

**Quy ước xuyên suốt:** không thực hiện bất kỳ hành động ghi/sửa/xoá dữ liệu thật nào trong toàn bộ quá trình khảo sát (chỉ đọc, không Save/Create/Delete/Import/Run được submit thật); mọi suy luận chưa xác minh được đánh dấu `[Cần xác nhận]`; mọi thông tin plaintext nhạy cảm (mật khẩu, API key) đã được che (redact) trước khi lưu ảnh; mỗi ảnh chụp có khung đỏ đánh dấu vùng nội dung liên quan; tham chiếu ảnh trong mỗi file `.md` đã được xác minh khớp 1:1 với file thực tế trên đĩa.

---

## 1. Danh sách 21 module

| # | Module | Sub-module | Screenshots | Ghi chú nổi bật |
|---|---|---|---|---|
| [M1](M1-dashboard/SM1-dashboard.md) | Dashboard | 1 | 2 | Trang thiết kế tốt nhất trong dự án; chỉ 7/27 trường có dữ liệu hoạt động thật |
| [M2](M2-school/SM1-school.md) | School | 1 | 20 | Module lõi — quản lý toàn bộ 27 trường/tenant |
| [M3](M3-user-school/SM1-user-school.md) | User School | 1 | 3 | Quản lý user gắn với từng trường |
| [M4](M4-billing/SM1-billing.md) | Billing | 1 | 10 | Quản lý hoá đơn/thanh toán học phí |
| [M5](M5-statistic/) | Statistic | 2 | 6 | Top School + Year — thống kê tổng quan |
| [M6](M6-holidays/SM1-holidays.md) | Holidays | 1 | 5 | Quản lý ngày lễ dùng chung |
| [M7](M7-qr-profiles/SM1-qr-profiles.md) | QR Profiles | 1 | 6 | **Lộ Client ID/API Key VietQR dạng plaintext** trên form Edit |
| [M8](M8-announcement/) | Announcement | 2 | 6 | Management + Upload Media |
| [M9](M9-tracking/) | Tracking | 4 | 7 | Announcement/Invoices/Assistant AI/Hook Logs — nhiều cột dữ liệu chưa từng có giá trị |
| [M10](M10-mailer-profiles/) | Mailer Profiles | 2 | 3 | **Lộ Username/Password SMTP dạng plaintext** (cùng lỗi với M7) |
| [M11](M11-lessons/) | Lessons | 6 | 13 | Thư viện nội dung dùng chung lớn nhất dự án (8 Set/54 Area/1.135 Group/5.217 Lesson); CKEditor 4.18.0 tự cảnh báo "not secure" |
| [M12](M12-lesson-plans/) | Lesson Plans | 2 | 3 | Trống hoàn toàn dữ liệu; Categories **không có chức năng Create** |
| [M13](M13-audit-log/SM1-audit-log.md) | Audit Log | 1 | 2 | 2 phạm vi dữ liệu độc lập trên cùng 1 trang không phân tách rõ; chỉ ghi chi tiết sự kiện đăng nhập |
| [M14](M14-schoolyear/SM1-schoolyear.md) | School Year | 1 | 3 | Modal "Apply for school" còn nguyên tiêu đề mẫu **"Modal title"** chưa sửa |
| [M15](M15-transparent-classroom/SM1-transparent-classroom.md) | Transparent Classroom | 1 | 2 | Module Vue.js đầu tiên; **lộ email tài khoản tích hợp bên thứ ba**; nguồn dữ liệu crawl cho M11 |
| [M16](M16-logs/) | Logs | 4 | 5 | Dashboard/Logs (package LogViewer nhúng) + Payment Transactions + Reconciliation Logs |
| [M17](M17-partner/) | Partner | 2 | 4 | Brands + Categories; phát hiện thêm trang Advertisements ẩn (không sidebar) |
| [M18](M18-campus-user-management/SM1-campus-user-management.md) | Campus User Management | 1 | 2 | Module duy nhất yêu cầu xác nhận lại mật khẩu; cơ chế "Hidden Password" chưa rõ mục đích |
| [M19](M19-school-groups/SM1-school-groups.md) | School Groups | 1 | 3 | Nơi thực sự gán Campus Admin (M18) vào nhóm; không có action Delete |
| [M20](M20-sales/SM1-sales.md) | Sales | 1 | 3 | "Sale Histories" — nhật ký audit chi tiết nhất dự án (route + payload đầy đủ) |
| [M21](M21-others/SM1-command-runner.md) | Others (Command Runner) | 1 | 1 | **Phát hiện bảo mật nghiêm trọng nhất**: console chạy Artisan command ẩn, không sidebar, không xác thực bổ sung |

**Tổng cộng: 21 module, 37 file tài liệu (`.md`), 109 ảnh chụp minh hoạ — toàn bộ đã xác minh khớp 1:1 giữa tham chiếu trong file và ảnh thực tế trên đĩa.**

---

## 2. Phát hiện bảo mật — xếp theo mức độ nghiêm trọng

| # | Mức độ | Phát hiện | Module |
|---|---|---|---|
| 1 | 🔴 Nghiêm trọng | Console chạy Artisan command tuỳ ý qua web, không sidebar, không xác thực bổ sung, có command nhận mật khẩu plaintext làm tham số | [M21](M21-others/SM1-command-runner.md) |
| 2 | 🟠 Cao | Client ID/API Key VietQR lộ plaintext trên form Edit | [M7](M7-qr-profiles/SM1-qr-profiles.md) |
| 3 | 🟠 Cao | Username/Password SMTP lộ plaintext trên form Edit (cùng pattern với M7) | [M10](M10-mailer-profiles/SM1-management.md) |
| 4 | 🟡 Trung bình | Email tài khoản tích hợp Transparent Classroom lộ plaintext (dùng chung cho 27 trường) | [M15](M15-transparent-classroom/SM1-transparent-classroom.md) |
| 5 | 🟡 Trung bình | Cơ chế "Hidden Password" (Generate/Set/Clear) không có tài liệu, không rõ mục đích/rủi ro | [M18](M18-campus-user-management/SM1-campus-user-management.md) |
| 6 | 🟢 Thấp | CKEditor 4.18.0 — chính thư viện tự cảnh báo "not secure", dùng ở cả M11 và M12 | [M11](M11-lessons/SM6-lessons.md), [M12](M12-lesson-plans/SM1-management.md) |
| 7 | 🟢 Thấp | Hầu hết action Delete trong toàn portal không có dialog xác nhận (ngoại lệ: package LogViewer ở M16 có xác nhận đầy đủ) | Xuyên suốt M2-M20 |

---

## 3. Pattern lặp lại xuyên suốt nhiều module

- **Lỗi tiêu đề "Manage{Entity}" (thiếu dấu cách):** xuất hiện nhất quán trên trang Edit của Lesson Set/Area/Group/Lesson (M11) và School Year (M14) — xác nhận là lỗi ở 1 Blade layout dùng chung cho trang Edit trên toàn Managing Portal, không phải lỗi riêng lẻ từng module.
- **Trộn ngôn ngữ Việt/Anh:** cột/nhãn tiếng Việt xen giữa giao diện tiếng Anh, đậm nhất ở Audit Log (M13), Transparent Classroom (M15), Logs (M16), School Groups (M19), Sales (M20).
- **Trường bị khoá sau khi tạo:** Brand/Type của Category (M17) và Email của Sales (M20) đều dùng `readonly`/text tĩnh sau khi tạo — không thể sửa lại.
- **Cột tồn tại nhưng chưa từng có dữ liệu:** lặp lại nhiều lần ở Tracking (M9: Question/School ở Assistant AI), Mailer Profiles (M10: cột School), Lessons (M11: cột Number ở Lesson), Sales (M20: tương tự).
- **Nhiều kiến trúc UI khác nhau cùng tồn tại:** Blade + DataTables (mặc định, đa số module) → Vue.js (M15) → package mã nguồn mở ArcaneDev LogViewer nhúng nguyên khối (M16) → Alpine.js (M18) — không có 1 kiến trúc thống nhất toàn portal.
- **Action điều hướng sang danh sách con đã lọc (thay vì trang Detail riêng):** Lesson Set→Area→Group→Lesson (M11), Brand→Category→Advertisement (M17) — 1 pattern thiết kế lặp lại nhất quán cho quan hệ cha-con.
- **"X / Y" (active/total):** cột đếm Category/Advertisement ở Brands (M17), đã xác minh bằng đối chiếu số học trực tiếp.

---

## 4. Liên kết chéo giữa các module (bản đồ quan hệ)

- **M1 Dashboard** → link trực tiếp tới **M2 School** (tên trường trong bảng "Schools in...").
- **M11 Lessons** ← nguồn dữ liệu crawl từ **M15 Transparent Classroom** (`transparent_lessons => lessons`, xác nhận qua văn bản mô tả cơ chế Crawl/Sync trên UI M15).
- **M13 Audit Log** (breakdown route `admin.schoolyears.apply-to-school`) → giải thích bằng action "Apply for school" ở **M14 School Year**.
- **M13 Audit Log** (route `admin.commands.run`, 10,54% tổng request — mục lớn nhất) → giải thích bằng **M21 Command Runner**.
- **M16 Payment Transactions** (cột Reconcile Status) ↔ **M16 Reconciliation Logs** (nơi thực thi đối soát qua API, kích hoạt bởi `super_admin`, không qua UI thủ công).
- **M17 Partner/Categories** → phát hiện thêm trang **Advertisements** (không sidebar, chưa khảo sát đầy đủ).
- **M18 Campus User Management** (cột School Groups) ↔ **M19 School Groups** (cột Users) — liên kết 2 chiều qua `school_group_id`; M19 là nơi thực sự gán user vào nhóm (M18 không có field tương ứng).
- **M20 Sales** (trường Schools multi-select) dùng lại đúng component Select2 tag đã thấy ở **M19 School Groups**.

---

## 5. Ngoài phạm vi dự án (đã xác nhận tồn tại nhưng không khảo sát)

| Hệ thống | Bằng chứng | Lý do ngoài phạm vi |
|---|---|---|
| **Operating Portal** | Đề cập chéo ở M11 (Lesson Plans phía trường dùng thư viện Lessons dùng chung) | Là 1 portal riêng dành cho trường học, không phải Managing Portal |
| **Sales Portal** (giả định) | Routes `sales.*` (không tiền tố `admin.`) trong breakdown Audit Log — vd `sales.school.login`, `sales.invoices.revert-status` | Khác hệ đăng nhập, dành cho nhân viên Sales tự vận hành, không thuộc Managing Portal |
| **Frontend app** (phụ huynh/giáo viên) | Route `frontend.auth.*` trong breakdown Audit Log | Ứng dụng dành cho người dùng cuối, không thuộc Managing Portal |
| Route `admin.config.compare.post` | 11 lượt gọi (0,04%) trong breakdown Audit Log; không tìm ra URL qua các suy đoán hợp lý (`/admin/config`, `/admin/config/compare` đều trả lỗi) | Mức độ dùng quá thấp để tiếp tục đầu tư công dò tìm; ghi nhận `[Chưa xác định được]` ở `M21-others/SM1-command-runner.md` §4 |
| Trang **Advertisements** (`/admin/partners/advertisements`) | Phát hiện qua action "Advertisements" ở M17 Categories | Tồn tại thật nhưng nằm ngoài phạm vi "Brands, Categories" được yêu cầu khảo sát ở M17 |

---

## 6. Thống kê tổng quan

- **21 module**, trải từ M1 (Dashboard) đến M21 (Command Runner ẩn).
- **37 file tài liệu `.md`**, theo cấu trúc thống nhất: Tổng quan → Business Flow (sequence diagram + Business Rules) → Feature Breakdown (Acceptance Criteria + Use Case + Edge Cases + UI Conventions).
- **109 ảnh chụp màn hình**, mỗi ảnh có khung đỏ đánh dấu vùng nội dung liên quan, đã redact toàn bộ thông tin nhạy cảm (mật khẩu, email tài khoản tích hợp, số điện thoại/địa chỉ cá nhân).
- **1 phát hiện bảo mật nghiêm trọng** (M21), **2 phát hiện lộ credential plaintext** (M7, M10), **1 lỗi UI rõ ràng nhất dự án** ("Modal title" chưa sửa ở M14).
- Trình tự khảo sát: **M2 → M20 → M1**, cộng M21 được bổ sung sau khi rà soát toàn diện sidebar + breakdown Audit Log để xác nhận không còn phần nào của Managing Portal chưa được tài liệu hoá.
