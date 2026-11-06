# Mục Lục Toàn Bộ Tài Liệu LLM Wiki (Index)

> **Dự án:** School Operating Portal (Finviet / SOHA)  
> **Chế độ:** `new` (Đặc tả mong muốn cho quá trình phát triển mới)  
> **Cập nhật:** 2026-11-05  
> **Hợp đồng:** Xem [SCHEMA.md](SCHEMA.md) · Nhật ký: Xem [log.md](log.md)

---

## 1. Tổng Quan & Các Phân Hệ (Overview)

- [Tổng quan dự án](pages/overview/project-overview.md) — Kiến trúc tổng thể và bản đồ phân hệ
- [Phân hệ Tổng quan (TQ)](pages/overview/module-overview.md) — Dashboard điều hành số liệu trường
- [Phân hệ Vận hành (VH)](pages/overview/module-operations.md) — Điểm danh, y tế, ảnh AI, trò chuyện
- [Phân hệ Học tập (HT)](pages/overview/module-academics.md) — Thời khóa biểu, bài tập, sổ điểm
- [Phân hệ Tài chính (TC)](pages/overview/module-finance.md) — Hóa đơn VietQR, hoàn tiền ăn, miễn giảm, CSDL Sở
- [Phân hệ Nhà trường (NT)](pages/overview/module-school-admin.md) — Học sinh 360°, giáo viên, lớp học, niên khóa
- [Phân hệ Cấu hình (CH)](pages/overview/module-settings.md) — Hồ sơ trường, tài khoản, tham số, AI, tính năng
- [Phân hệ Đăng nhập & Xác thực (DN)](pages/overview/module-auth.md) — Xác thực đa trường `{schoolCode}` và RBAC

---

## 2. Tài Liệu Nguồn Cốt Lõi (Sources)

- [PRD Cổng Vận Hành Trường Học](pages/sources/src-prd-school-operating-portal.md) — Đặc tả nghiệp vụ chuẩn tổng thể
- [Khung Kiến Trúc Kỹ Thuật Nền Tảng](pages/sources/src-tech-architecture-blueprint.md) — Blueprint kỹ thuật hệ thống
- [Bảng Câu Hỏi Mở & Quyết Định](pages/sources/src-open-questions-resolutions.md) — Quyết định dứt điểm OQ-01..23 (gồm 15 kịch bản đối kháng Red-Team và nghiệp vụ thực tế)
- [Đặc Tả Đăng Nhập & Xác Thực](pages/sources/src-prd-dang-nhap-xac-thuc.md) — Đặc tả cơ chế xác thực đa trường, SSO và JWT
- [Đặc Tả Cơ Chế Hoàn Tiền Khi Nghỉ Học](pages/sources/src-prd-co-che-hoan-tien.md) — Cơ chế khấu trừ tiền ăn tự động tháng M+1
- [Đặc Tả Cơ Chế Miễn Giảm Học Phí](pages/sources/src-prd-mien-giam-hoc-phi.md) — Chính sách ưu đãi, xử lý xung đột Best-rate
- [Đặc Tả Bộ Hồ Sơ Kỹ Thuật 35 Epics & Prototype](pages/sources/src-development-epics-manifest.md) — Bản vẽ 35 Epics E-001..E-035
- [Đặc Tả Khảo Sát Hệ Thống Cũ (Legacy Portal QLTH)](pages/sources/src-legacy-operating-portal-guide.md) — Báo cáo khảo sát 30 modules và M7-SM1
- [Đặc Tả 33 Quyết Định Kiến Trúc (ADR)](pages/sources/src-adr-architectural-decisions.md) — 33 quyết định ADR-001..ADR-033
- [Đặc Tả Kho Tri Thức Kỹ Thuật & Danh Mục Anti-Pattern](pages/sources/src-knowledge-base-standards.md) — Tiêu chuẩn đa tầng và Never Do List
- [Đặc Tả Bảng Đối Soát Mâu Thuẫn Nghiệp Vụ (K001–K057)](pages/sources/src-planning-contradictions-matrix.md) — 57 điểm mâu thuẫn K001..K057
- [Đặc Tả Bộ Hồ Sơ Thiết Kế Kế Hoạch (Screens, Flows, Diagrams)](pages/sources/src-planning-blueprints-flows-screens.md) — Hồ sơ màn hình và sơ đồ tuần tự
- [Đặc Tả Hệ Thống Thiết Kế Giao Diện (ECO Design System)](pages/sources/src-portal-design-system.md) — Nền tảng token semantic v2.6.0
- [Đặc Tả Bộ Hồ Sơ Kế Hoạch SEPO (VOI, AP, ISP)](pages/sources/src-sepo-architecture-implementation-plan.md) — Kế hoạch kiến trúc và thi công kỹ thuật

---

## 3. Khái Niệm Kiến Trúc Then Chốt (Concepts)

- [Cơ chế cô lập đa trường học (Multi-Tenancy)](pages/concepts/multi-tenancy-isolation.md) — RLS & routing
- [Cơ chế hoàn tiền ăn tự động](pages/concepts/meal-refund-engine.md) — Liên thông điểm danh sang hóa đơn M+1
- [Thuật toán giải quyết xung đột miễn giảm](pages/concepts/discount-deduplication.md) — Cảnh báo trùng lặp & Best-rate
- [Đường ống nhận diện khuôn mặt AI](pages/concepts/ai-face-recognition.md) — BullMQ Worker bất đồng bộ
- [Chốt chặn an toàn khi xóa lớp](pages/concepts/class-deletion-guard.md) — Bảo vệ toàn vẹn tài chính & học sinh
- [Cơ chế kiểm duyệt bài viết 2 cấp & Phân quyền RBAC](pages/concepts/rbac-two-tier-moderation.md) — Quy trình duyệt bài GV và BGH
- [Kiến trúc thanh toán VietQR động & Đối soát tự động](pages/concepts/vietqr-dynamic-reconciliation.md) — Tích hợp NAPAS 247 và webhook
- [Kiến trúc tích hợp Cơ sở dữ liệu Bộ/Sở GD&ĐT (CSDL Sở)](pages/concepts/csdl-so-integration.md) — Chuẩn hóa danh mục tài chính nhà nước
- [Chuẩn đánh giá & Xếp loại học sinh Bộ GD&ĐT](pages/concepts/curriculum-assessment-standard.md) — Thông tư 22/27/51 và công thức TBHK có trọng số
- [Vòng đời chuyển tiếp học sinh](pages/concepts/student-lifecycle-transitions.md) — Chuyển lớp, niên khóa, lưu trữ kho lạnh và phục hồi
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](pages/concepts/extracurricular-billing-scheduling.md) — Conflict scheduler 4 chiều & Sub-invoice
- [Kiến trúc giao diện & Hệ thống Token](pages/concepts/design-system-tokens-principles.md) — Hybrid Tailwind/Styled Components & tokens v2.6.0

---

## 4. Thực Thể Nghiệp Vụ Cốt Lõi (Entities)

- [Hồ sơ học sinh 360](pages/entities/student-profile.md) — Dữ liệu gốc học sinh và 5 tab ngữ cảnh
- [Giáo viên & Nhân viên](pages/entities/teacher-staff.md) — Nhân sự và phân quyền kiểm duyệt 2 cấp
- [Lớp học](pages/entities/classroom.md) — Đơn vị tổ chức lớp chính khóa và ngoại khóa
- [Điểm danh hằng ngày](pages/entities/attendance-daily.md) — Đón/trả, thân nhiệt, sức khỏe, người đón hộ
- [Hóa đơn học phí](pages/entities/tuition-invoice.md) — Hóa đơn thu phí tích hợp VietQR động
- [Danh mục khoản phí](pages/entities/fee-catalog-item.md) — 24 khoản thu chuẩn toàn trường
- [Chính sách miễn giảm](pages/entities/discount-policy.md) — Quy tắc ưu đãi học phí và chuyển đổi đơn vị
- [Khấu trừ hoàn tiền ăn](pages/entities/meal-refund-credit.md) — Dòng giảm trừ tiền ăn nghỉ học có phép
- [Thời khóa biểu tuần](pages/entities/timetable-weekly.md) — Lịch học ma trận theo tiết và phòng học
- [Bài tập về nhà](pages/entities/homework-assignment.md) — Nhiệm vụ tự học và theo dõi nộp bài
- [Sổ điểm đánh giá](pages/entities/gradebook-record.md) — Điểm số và nhận xét chuẩn Bộ GD&ĐT
- [Bảng tin hoạt động lớp](pages/entities/class-activity.md) — Nhật ký lớp học kèm hashtag và mention
- [Thư viện media](pages/entities/media-album.md) — Album ảnh lớp và gắn thẻ AI học sinh
- [Tin nhắn trao đổi](pages/entities/conversation-thread.md) — Kênh trò chuyện trực tiếp 1:1 với phụ huynh
- [Phiếu chi nội bộ](pages/entities/expense-voucher.md) — Quản lý chi tiêu vận hành và phê duyệt chi
- [Phiên đăng nhập & RBAC](pages/entities/auth-session.md) — Token JWT kép và kiểm soát truy cập 3 cấp
- [Niên khóa & Học kỳ](pages/entities/academic-year.md) — Quản lý khung thời gian năm học và kích hoạt niên khóa
- [Bảng thông tin nhà trường](pages/entities/school-announcement.md) — Bản tin truyền thông nội bộ và thông báo khẩn cấp
- [Khảo sát & Bình chọn](pages/entities/school-poll.md) — Chiến dịch lấy ý kiến phụ huynh và giáo viên
- [Thực đơn dinh dưỡng tuần](pages/entities/weekly-menu.md) — Khẩu phần ăn bán trú theo bữa và khối tuổi
- [Lịch sự kiện & Ngày nghỉ lễ](pages/entities/calendar-event.md) — Lịch nghỉ lễ, sự kiện học thuật và ngoại khóa
- [Môn học](pages/entities/school-subject.md) — Danh mục môn học giảng dạy và phân công chuyên môn
- [Khối lớp học](pages/entities/grade-level.md) — Cấp bậc phân loại độ tuổi và chương trình đào tạo
- [Sổ tay phụ huynh](pages/entities/parent-handbook.md) — Cẩm nang học đường, quy chế và hỏi đáp FAQ
- [Góp ý & Khiếu nại phụ huynh](pages/entities/parent-feedback.md) — Hòm thư tiếp nhận và phân luồng khiếu nại
- [Điểm danh nhân sự](pages/entities/staff-attendance.md) — Nhật ký chấm công ca làm việc của cán bộ giáo viên
- [Phiên đối soát giao dịch](pages/entities/reconciliation-session.md) — Đợt đối soát khớp lệnh ngân hàng tự động
- [Danh mục thu CSDL Sở](pages/entities/revenue-category.md) — Danh mục nguồn thu chuẩn hóa liên thông Sở GD&ĐT
- [Hồ sơ trường học](pages/entities/school-profile.md) — Thông tin pháp lý, nhận diện thương hiệu và tham số trường
- [Đơn xin nghỉ học / Báo vắng](pages/entities/student-absence-request.md) — Đơn nghỉ học của phụ huynh và căn cứ hoàn tiền ăn
- [Hồ sơ nhận diện khuôn mặt sinh trắc](pages/entities/face-biometric-registration.md) — Ảnh chân dung mẫu và vector AI 512 chiều
- [Hồ sơ lưu trữ học sinh](pages/entities/student-archive-record.md) — Bản ghi học sinh lưu trữ kho lạnh và phục hồi

---

## 5. Luồng Nghiệp Vụ (Flows)

- [Luồng điểm danh đón trả](pages/flows/fl-diem-danh-don-tra.md) — Đón trẻ, đo nhiệt độ và xác thực người đón
- [Luồng báo vắng và hoàn tiền](pages/flows/fl-bao-vang-hoan-tien.md) — Báo vắng hợp lệ và khấu trừ M+1
- [Luồng lập và phát hành hóa đơn](pages/flows/fl-lap-phat-hanh-hoa-don.md) — Tạo đợt hóa đơn và sinh mã VietQR
- [Luồng thiết lập miễn giảm](pages/flows/fl-thiet-lap-mien-giam.md) — Tạo chính sách ưu đãi kèm cảnh báo trùng lặp
- [Luồng đăng bài kiểm duyệt](pages/flows/fl-dang-bai-kiem-duyet.md) — Đăng nhật ký lớp học và duyệt bài 2 cấp
- [Luồng nhận diện album ảnh](pages/flows/fl-nhan-dien-album-anh.md) — Tải ảnh lớp và xử lý khuôn mặt AI ngầm
- [Luồng đăng nhập đa trường](pages/flows/fl-dang-nhap-da-truong.md) — Xác thực `{schoolCode}` và cấp quyền RBAC
- [Luồng chuyển lớp và chuyển năm học](pages/flows/fl-chuyen-lop-va-chuyen-nam-hoc.md) — Điều chuyển học sinh bảo toàn dữ liệu
- [Luồng lập thời khóa biểu](pages/flows/fl-lap-thoi-khoa-bieu.md) — Xếp lịch học tuần và kiểm tra trùng tiết
- [Luồng nhập sổ điểm](pages/flows/fl-nhap-so-diem.md) — Nhập điểm kiểm tra và khóa sổ điểm
- [Luồng quản lý hồ sơ học sinh 360](pages/flows/fl-quan-ly-ho-so-hoc-sinh-360.md) — Quản lý danh bạ và tab ngữ cảnh
- [Luồng phân công giáo viên](pages/flows/fl-phan-cong-giao-vien-kiem-duyet.md) — Phân công chủ nhiệm và quyền duyệt bài
- [Luồng đối soát giao dịch](pages/flows/fl-doi-soat-giao-dich.md) — Khớp lệnh ngân hàng tự động và xử lý lệch số liệu
- [Luồng lập duyệt phiếu chi](pages/flows/fl-lap-duyet-phieu-chi.md) — Lập, đính kèm chứng từ và phê duyệt xuất quỹ nội bộ
- [Luồng giao bài tập về nhà](pages/flows/fl-giao-bai-tap-ve-nha.md) — Giao bài tập, theo dõi nộp bài và chấm nhận xét
- [Luồng khảo sát bình chọn](pages/flows/fl-khao-sat-binh-chon.md) — Khởi tạo và tổng hợp biểu quyết trực tuyến
- [Luồng lập thực đơn dinh dưỡng](pages/flows/fl-lap-thuc-don-dinh-duong.md) — Lên thực đơn tuần và công bố tới phụ huynh
- [Luồng tiếp nhận và xử lý góp ý](pages/flows/fl-tiep-nhan-xu-ly-gop-y.md) — Phân luồng giải quyết khiếu nại của phụ huynh
- [Luồng điểm danh chấm công nhân viên](pages/flows/fl-diem-danh-cham-cong-nv.md) — Chấm công ca làm việc và tổng hợp công tháng
- [Luồng đồng bộ danh mục thu](pages/flows/fl-dong-bo-danh-muc-thu.md) — Kéo danh mục chuẩn từ CSDL Sở và kích hoạt sử dụng
- [Luồng nộp đơn xin nghỉ học](pages/flows/fl-don-xin-nghi-hoc.md) — Phụ huynh nộp đơn và duyệt báo vắng tự động
- [Luồng kho lưu trữ học sinh](pages/flows/fl-kho-luu-tru-hoc-sinh.md) — Đóng băng kho lạnh, phục hồi và xóa vĩnh viễn 2 bước
- [Luồng đăng ký sinh trắc khuôn mặt](pages/flows/fl-dang-ky-sinh-trac-khuon-mat.md) — Quét webcam/tải ảnh và đồng bộ AI
- [Luồng quản trị tài khoản đa vai trò](pages/flows/fl-quan-tri-tai-khoan-phan-quyen.md) — RBAC, bảo vệ Super-Admin và CSDL Sở

---

## 6. Màn Hình Giao Diện (Screens)

### M1: Tổng Quan
- [Màn hình tổng quan điều hành](pages/screens/m1-sm1-tong-quan.md) — Dashboard trung tâm

### M2: Vận Hành
- [Màn hình điểm danh](pages/screens/m2-sm1-diem-danh.md) — Điểm danh đón/trả và sức khỏe
- [Màn hình hoạt động](pages/screens/m2-sm2-hoat-dong.md) — Bảng tin hoạt động lớp học
- [Màn hình thư viện](pages/screens/m2-sm3-thu-vien.md) — Thư viện ảnh và AI nhận diện
- [Màn hình trao đổi](pages/screens/m2-sm4-trao-doi.md) — Kênh trò chuyện với phụ huynh
- [Màn hình báo cáo điểm danh](pages/screens/m2-sm5-bao-cao-diem-danh.md) — Lưới điểm danh tháng
- [Màn hình báo cáo mở rộng](pages/screens/m2-sm6-bao-cao-mo-rong.md) — Báo cáo thống kê chuyên sâu

### M3: Học Tập
- [Màn hình thời khóa biểu](pages/screens/m3-sm1-thoi-khoa-bieu.md) — Ma trận lịch học tuần
- [Màn hình bài tập về nhà](pages/screens/m3-sm2-bai-tap.md) — Giao bài và kiểm tra nộp bài
- [Màn hình sổ điểm đánh giá](pages/screens/m3-sm3-diem-danh-gia.md) — Nhập điểm và tổng kết học lực

### M4: Tài Chính
- [Màn hình hóa đơn học phí](pages/screens/m4-sm1-hoc-phi.md) — Lập hóa đơn và VietQR động
- [Màn hình đối soát](pages/screens/m4-sm2-doi-soat.md) — Khớp lệnh ngân hàng tự động
- [Màn hình khoản phí](pages/screens/m4-sm3-khoan-phi.md) — Quản lý 24 khoản thu trường
- [Màn hình quản lý học phí](pages/screens/m4-sm4-quan-ly-hoc-phi.md) — Cấu hình biểu phí từng lớp
- [Màn hình khoản chi](pages/screens/m4-sm5-khoan-chi.md) — Phiếu chi và chứng từ nội bộ
- [Màn hình báo cáo học phí](pages/screens/m4-sm6-bao-cao-hoc-phi.md) — Biểu đồ tỷ lệ hoàn thành thu phí
- [Màn hình danh mục thu](pages/screens/m4-sm7-danh-muc-thu.md) — Danh mục nguồn thu chuẩn hóa CSDL Sở
- [Màn hình chính sách miễn giảm](pages/screens/m4-sm8-mien-giam.md) — Thiết lập ưu đãi và giảm trừ

### M5: Nhà Trường
- [Màn hình học sinh](pages/screens/m5-sm1-hoc-sinh.md) — Danh bạ và hồ sơ học sinh 360
- [Màn hình giáo viên](pages/screens/m5-sm2-giao-vien.md) — Danh bạ giáo viên và quyền duyệt
- [Màn hình lớp học](pages/screens/m5-sm3-lop-hoc.md) — Quản lý lớp và chốt chặn xóa lớp
- [Màn hình môn học](pages/screens/m5-sm4-mon-hoc.md) — Danh mục môn học giảng dạy
- [Màn hình khối lớp](pages/screens/m5-sm5-khoi-lop.md) — Danh mục khối lớp liên cấp
- [Màn hình bảng thông tin](pages/screens/m5-sm6-bang-thong-tin.md) — Tin tức và truyền thông nội bộ
- [Màn hình bình chọn](pages/screens/m5-sm7-binh-chon.md) — Khảo sát trực tuyến phụ huynh
- [Màn hình thực đơn](pages/screens/m5-sm8-thuc-don.md) — Thực đơn dinh dưỡng tuần
- [Màn hình điểm danh nhân viên](pages/screens/m5-sm9-diem-danh-nv.md) — Chấm công ca làm việc
- [Màn hình sổ tay phụ huynh](pages/screens/m5-sm10-so-tay-ph.md) — Quy định và hướng dẫn nhà trường
- [Màn hình hòm thư góp ý](pages/screens/m5-sm11-gop-y.md) — Tiếp nhận phản ánh khiếu nại
- [Màn hình lịch sự kiện](pages/screens/m5-sm12-lich-su-kien.md) — Lịch sự kiện và hoạt động
- [Màn hình niên khóa](pages/screens/m5-sm13-nam-hoc.md) — Quản lý năm học và học kỳ
- [Màn hình kho lưu trữ](pages/screens/m5-sm14-luu-tru.md) — Hồ sơ học sinh tốt nghiệp/chuyển trường

### M6: Cấu Hình
- [Màn hình cấu hình trường học](pages/screens/m6-sm1-truong.md) — Thông tin pháp lý & thương hiệu
- [Màn hình quản trị tài khoản](pages/screens/m6-sm2-tai-khoan.md) — Người dùng và phân quyền admin
- [Màn hình cấu hình tham số học phí](pages/screens/m6-sm3-hoc-phi.md) — Tỷ lệ hoàn tiền ăn & hạn báo vắng
- [Màn hình cấu hình nhận diện AI](pages/screens/m6-sm4-nhan-dien.md) — Tham số mô hình thị giác AI
- [Màn hình bật tắt tính năng](pages/screens/m6-sm5-tinh-nang.md) — Quản lý Feature Flags
- [Màn hình cấu hình thông báo](pages/screens/m6-sm6-thong-bao.md) — Ma trận thông báo push/email
- [Màn hình lịch sử thanh toán Sepay](pages/screens/m6-sm7-lich-su-thanh-toan.md) — Nhật ký giao dịch cổng thanh toán và webhook

### M7: Tài Khoản & Đăng Nhập
- [Màn hình quản trị tài khoản cá nhân & thông báo](pages/screens/m7-sm1-khac.md) — Profile, đổi mật khẩu, thông báo cá nhân, ngôn ngữ, đăng xuất
- [Màn hình đăng nhập hệ thống](pages/screens/m7-sm2-dang-nhap.md) — Đăng nhập `{schoolCode}`, SSO & cấp JWT
