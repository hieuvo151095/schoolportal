---
title: PRD Cổng Vận Hành Trường Học (School Operating Portal)
type: source
sources:
  - raw/specs/prd-school-operating-portal.md
updated: 2026-11-05
---

# PRD Cổng Vận Hành Trường Học (School Operating Portal)

## Thông tin nguồn
| Trường | Giá trị |
|---|---|
| Đường dẫn | `raw/specs/prd-school-operating-portal.md` |
| Người cung cấp | Finviet / SOHA Product Team |
| Ngày | 2026-11-04 |
| Loại | PRD Nghiệp vụ cốt lõi (Core Business Requirements) |

## Nội dung chính
Tài liệu đặc tả toàn diện 4 trụ cột nghiệp vụ cho nền tảng quản trị trường học đa trường (Multi-tenant K-12):
1. **Vận hành (Operations):** Điểm danh đón/trả, thân nhiệt, người đón hộ, báo vắng & hoàn tiền, nhật ký hoạt động, thư viện ảnh AI, trò chuyện phụ huynh, báo cáo điểm danh.
2. **Học tập (Academics):** Thời khóa biểu tuần, giao & chấm bài tập, sổ điểm & đánh giá Bộ GD&ĐT.
3. **Tài chính (Finance):** Lập hóa đơn VietQR động, khấu trừ tiền ăn M+1, danh mục 24 khoản thu, cấu hình biểu phí lớp, phiếu chi nội bộ, đối soát ngân hàng, chính sách miễn giảm học phí.
4. **Nhà trường (School Admin):** Hồ sơ học sinh 360°, giáo viên & kiểm duyệt 2 cấp, lớp học (chính khóa/ngoại khóa) kèm chốt chặn an toàn khi xóa, môn học, khối lớp, bảng tin, bình chọn, thực đơn tuần, điểm danh NV, sổ tay PH, hòm thư góp ý, lịch sự kiện, niên khóa, lưu trữ.
5. **Cấu hình & Đăng nhập:** Hồ sơ trường, tài khoản, cấu hình học phí & hoàn tiền, nhận diện AI, tính năng, thông báo, đăng nhập đa trường theo tiền tố `{schoolCode}`.

## Mã yêu cầu được định nghĩa
| Mã | Quy tắc (kiểm được) | Nguồn (dòng/mục) |
|---|---|---|
| TQ-01 | Dashboard hiển thị tổng quan số liệu sĩ số học sinh, giáo viên, lớp học theo thời gian thực | §4.1, §5.1 |
| TQ-02 | Thống kê tỷ lệ điểm danh học sinh trong ngày (có mặt, vắng có phép, vắng không phép) | §4.1, §5.1 |
| TQ-03 | Biểu đồ thu nộp học phí và tiến độ nộp theo tháng/học kỳ toàn trường | §4.3, §5.1 |
| VH-01 | Điểm danh đón và trả học sinh 1-chạm theo lớp học hằng ngày | §4.1 US-OPS-01 |
| VH-02 | Ghi nhận thân nhiệt và cảnh báo các dấu hiệu sức khỏe y tế bất thường của học sinh | §4.1 US-OPS-02 |
| VH-03 | Xác thực người đón hộ học sinh từ danh sách người đưa đón hợp lệ đã đăng ký | §4.1 US-OPS-03 |
| VH-04 | Báo vắng học sinh hàng loạt và phân loại vắng có phép hoặc không phép | §4.1 US-OPS-04 |
| VH-05 | Đăng bài hoạt động lớp hỗ trợ gắn hashtag `#` chủ đề và nhắc tên học sinh `@` | §4.1 US-OPS-05 |
| VH-06 | Thư viện media tự động gắn thẻ khuôn mặt học sinh trong ảnh lớp bằng AI | §4.1 US-OPS-06 |
| VH-07 | Kênh trò chuyện tin nhắn đa chiều 1:1 trực tiếp giữa giáo viên và phụ huynh | §4.1 US-OPS-07 |
| VH-08 | Xuất lưới điểm danh tháng và các mẫu báo cáo đánh giá định kỳ ra Excel | §4.1 US-OPS-08 |
| HT-01 | Thiết lập và công bố thời khóa biểu tuần theo tiết học, môn học, phòng học và giáo viên | §4.2 US-ACAD-01 |
| HT-02 | Tạo bài tập về nhà kèm hạn nộp và theo dõi trạng thái nộp bài của học sinh | §4.2 US-ACAD-02 |
| HT-03 | Nhập sổ điểm và đánh giá định kỳ theo quy chuẩn chuẩn hóa của Bộ GD&ĐT | §4.2 US-ACAD-03 |
| TC-01 | Lập hóa đơn học phí tháng cho học sinh tích hợp mã VietQR động chuyển khoản chính xác | §4.3 US-FIN-01 |
| TC-02 | Tự động rà soát ngày nghỉ có phép tháng M và khấu trừ tiền ăn vào hóa đơn tháng M+1 | §4.3 US-FIN-02 |
| TC-03 | Quản lý danh mục 24 khoản thu toàn trường gồm 3 khoản hệ thống và 21 khoản tùy chỉnh | §4.3 US-FIN-03 |
| TC-04 | Cấu hình gói biểu phí và đơn giá áp dụng riêng biệt cho từng lớp học hoặc khối lớp | §4.3 US-FIN-04 |
| TC-05 | Lập, trình duyệt và theo dõi vòng đời phiếu chi nội bộ kèm chứng từ đính kèm | §4.3 US-FIN-05 |
| TC-06 | Đối soát giao dịch thanh toán tự động và thủ công với sổ phụ ngân hàng | §4.3 US-FIN-06 |
| TC-07 | Báo cáo trực quan tỷ lệ hoàn thành thu học phí toàn trường và theo từng lớp | §4.3 US-FIN-07 |
| TC-08 | Tính toán số tiền hoàn tiền ăn theo tỷ lệ cấu hình tham số tại Cấu hình học phí | §4.3 US-FIN-02 |
| TC-09 | Cảnh báo và yêu cầu xác nhận khi tạo chính sách miễn giảm trùng lặp đối tượng | §4.3 FR-FIN-019 |
| TC-10 | Hỗ trợ giảm trừ linh hoạt theo `%` hoặc tiền mặt `đ` kèm dấu chấm phân cách hàng nghìn | §4.3 FR-FIN-022 |
| NT-01 | Quản lý danh bạ và hồ sơ học sinh 360° với 5 tab ngữ cảnh chuyên sâu | §4.4 US-SCH-01 |
| NT-02 | Chuyển lớp học sinh và chuyển năm học hàng loạt với bảo toàn kết quả học tập | §4.4 US-SCH-02 |
| NT-03 | Quản lý danh bạ giáo viên và cơ chế kiểm duyệt nội dung bài đăng 2 cấp | §4.4 US-SCH-03 |
| NT-04 | Phân loại lớp chính khóa và ngoại khóa kèm chốt chặn an toàn khi xóa lớp | §4.4 US-SCH-04 |
| NT-05 | Quản lý danh mục môn học và phân công giáo viên giảng dạy | §4.4 US-SCH-05 |
| NT-06 | Quản lý danh mục khối lớp học và định tuyến chương trình liên cấp | §4.4 US-SCH-06 |
| NT-07 | Bảng thông tin điện tử truyền thông sự kiện và gửi thông báo khẩn cấp | §4.4 US-SCH-07 |
| NT-08 | Khởi tạo bình chọn và khảo sát ý kiến trực tuyến của phụ huynh và giáo viên | §4.4 US-SCH-08 |
| NT-09 | Lập và công bố thực đơn dinh dưỡng theo tuần bảo đảm an toàn vệ sinh thực phẩm | §4.4 US-SCH-09 |
| NT-10 | Điểm danh ca làm việc và tổng hợp bảng chấm công nhân viên nhà trường | §4.4 US-SCH-10 |
| NT-11 | Sổ tay phụ huynh điện tử công bố quy định và hướng dẫn của nhà trường | §4.4 US-SCH-11 |
| NT-12 | Hòm thư tiếp nhận và xử lý góp ý, phản hồi khiếu nại của phụ huynh học sinh | §4.4 US-SCH-12 |
| NT-13 | Lịch sự kiện và hoạt động trải nghiệm ngoại khóa toàn trường | §4.4 US-SCH-13 |
| NT-14 | Quản lý niên khóa học, các kỳ học và kích hoạt niên khóa hiện hành | §4.4 US-SCH-14 |
| NT-15 | Kho lưu trữ học sinh chuyển trường, hoàn thành chương trình hoặc tốt nghiệp | §4.4 US-SCH-15 |
| CH-01 | Cấu hình thông tin pháp lý nhà trường, biểu tượng thương hiệu và niên khóa mặc định | §4.5 US-SET-01 |
| CH-02 | Quản trị tài khoản người dùng, cấp quyền quản trị và quản lý trạng thái tài khoản | §4.5 US-SET-02 |
| CH-03 | Thiết lập tham số tính học phí, tỷ lệ hoàn tiền ăn và hạn chốt báo vắng hằng ngày | §4.5 US-SET-03 |
| CH-04 | Cấu hình mô hình AI nhận diện khuôn mặt và ngưỡng nhạy độ tin cậy nhận diện | §4.5 US-SET-04 |
| CH-05 | Quản lý bật/tắt các phân hệ và tính năng (Feature Flags) theo gói bản quyền phần mềm | §4.5 US-SET-05 |
| CH-06 | Cấu hình ma trận quy tắc gửi thông báo push và email đa kênh theo sự kiện | §4.5 US-SET-06 |
| DN-01 | Đăng nhập hệ thống theo tiền tố mã trường `{schoolCode}` và cấp cặp JWT Access/Refresh Token | §4.6 US-AUTH-01 |
| DN-02 | Phân quyền kiểm soát truy cập theo mô hình Role-Based Access Control (RBAC) 3 cấp | §4.6 US-AUTH-02 |

## Điểm đáng chú ý / mâu thuẫn
- Tài liệu quy định rõ liên thông giữa Điểm danh (M2) và Hóa đơn học phí (M4): Tiền ăn nghỉ học có phép tháng M tự động giảm trừ vào hóa đơn tháng M+1.
- Mọi thắc mắc về phân định lớp học, xóa lớp, và xử lý trùng lặp chính sách miễn giảm đã được giải quyết dứt điểm tại `docs/init/open-questions.md`.

## Trang chịu ảnh hưởng
- [Tổng quan dự án](../overview/project-overview.md)
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Phân hệ Học tập](../overview/module-academics.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Phân hệ Đăng nhập](../overview/module-auth.md)
- [Điểm danh hằng ngày](../entities/attendance-daily.md)
- [Hóa đơn học phí](../entities/tuition-invoice.md)
- [Chính sách miễn giảm](../entities/discount-policy.md)
- [Khấu trừ hoàn tiền ăn](../entities/meal-refund-credit.md)
- [Hồ sơ học sinh 360](../entities/student-profile.md)
- [Lớp học](../entities/classroom.md)
