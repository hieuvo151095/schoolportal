---
title: Hồ Sơ Học Sinh 360 (Student Profile 360)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - NT-01
  - NT-02
updated: 2026-11-05
---

# Hồ Sơ Học Sinh 360 (Student Profile 360)

## Định nghĩa
Thực thể Hồ sơ học sinh 360 lưu trữ toàn bộ dữ liệu gốc, thông tin nhân thân, hành trình học tập, sức khỏe, tài chính, trạng thái đồng bộ kỳ thi và quyền riêng tư sinh trắc của học sinh qua các năm học trong hệ thống trường học.

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| NT-01 | Quản lý mã học sinh duy nhất trong trường, ngày sinh, giới tính, CCCD/Định danh, địa chỉ và thông tin đa phụ huynh (Bố, Mẹ, Người giám hộ) | 5 tab ngữ cảnh: Hồ sơ, Hoạt động, Thư viện, Điểm danh, Học phí |
| NT-01 | Theo dõi chỉ số thể chất BMI (chiều cao, cân nặng theo tháng) và lịch sử tiêm chủng y tế | Tự động tính chỉ số BMI và xếp loại thể lực |
| NT-02 | Chuyển lớp và chuyển niên khóa bảo toàn toàn bộ kết quả học tập và lịch sử đóng phí | Tự động chuyển giao biểu phí theo lớp mới |
| NT-01 | **Số dư tín dụng học sinh (`credit_balance` - OQ-09):** Lưu số tiền hoàn thừa khi tiền hoàn ăn > học phí; tự động cấn trừ vào hóa đơn kỳ sau hoặc lập phiếu chi hoàn tiền khi thôi học | Tab Học phí hiển thị số dư tín dụng khả dụng |
| NT-01 | **Bảo toàn công nợ (`carried_over_debt` - OQ-12):** Công nợ học phí gắn chặt với mã học sinh, độc lập với việc lưu trữ/giải thể lớp cũ; tự động mang sang niên khóa mới | Tab Học phí hiển thị nợ kỳ trước cần thu |
| NT-02 | **Bảo toàn điểm khi chuyển trường (OQ-11):** Chuyển trường trạng thái `transferred_out` trích xuất bảng điểm ký số; trường tiếp nhận trạng thái `enrolled` kế thừa 100% điểm TX, GK | Tab Hồ sơ & Học tập lưu vết học bạ liên trường |
| NT-01 | **Khóa đồng bộ kỳ thi Sở GD&ĐT (`is_sync_locked` - OQ-15):** Khi Sở chốt kỳ thi, thông tin định danh (`full_name`, `dob`, `gender`, `national_id_number`, `moet_student_code`) bị khóa cứng chỉ đọc; mở khóa cần phê duyệt BGH và ghi log `SyncLockAuditTrail` | Xem [Kiến trúc tích hợp CSDL Sở](../concepts/csdl-so-integration.md) |
| NT-01 | **Quyền riêng tư AI & Tranh chấp giám hộ (OQ-16):** Cờ `opt_out_face_ai` yêu cầu bỏ qua nhận diện AI và làm mờ ảnh; danh sách `restricted_guardians` lưu phán quyết Tòa án hạn chế tiếp cận trẻ, kích hoạt cảnh báo đỏ khi đón/trả | Xem [Đường ống AI](../concepts/ai-face-recognition.md) |
| NT-02 | **Thôi học giữa kỳ & Thu hồi Mobile App (OQ-17):** Chuyển trạng thái `WITHDRAWN`, lập Biên bản thanh lý Pro-rata, thu hồi quyền chat/điểm danh, chuyển Mobile App sang `READ_ONLY_ARCHIVE` | Xem [Vòng đời học sinh](../concepts/student-lifecycle-transitions.md) |
| NT-01 | **Sổ dặn thuốc y tế & Lịch sử uống thuốc (OQ-19):** Tab Điểm danh/Y tế tiếp nhận đơn dặn thuốc từ phụ huynh, hiển thị đơn thuốc/liều lượng/ảnh toa, và lưu vết nhật ký uống thuốc `student_medical_logs` | Phục vụ kiểm toán y tế học đường |
| NT-01 | **Ngày bắt đầu học chính thức (`enrollment_date` - OQ-22):** Ghi nhận ngày nhập học chính thức để kích hoạt công thức tính học phí và tiền ăn lẻ ngày Prorated cho học sinh nhập học giữa tháng | Xem [Hóa đơn học phí](tuition-invoice.md) |
| NT-01 | **Nhóm gia đình Sibling Discount (`primary_phone` - OQ-23):** Tự động liên kết các anh chị em ruột qua số điện thoại chính và CCCD phụ huynh, sắp xếp theo `dob` để tự động áp dụng giảm trừ cho con thứ 2/thứ 3 | Xem [Chính sách miễn giảm](discount-policy.md) |

## Quan hệ
- Thuộc về [Lớp học](classroom.md).
- Có nhiều bản ghi [Điểm danh hằng ngày](attendance-daily.md).
- Có nhiều [Hóa đơn học phí](tuition-invoice.md).
- Có hồ sơ đóng băng tại [Hồ sơ lưu trữ học sinh](student-archive-record.md) khi chuyển trường/thôi học.
- Thụ hưởng [Chính sách miễn giảm](discount-policy.md) và [Khấu trừ hoàn tiền ăn](meal-refund-credit.md).
- Xuất hiện trong các ảnh tại [Thư viện media](media-album.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-01 | Quản lý danh bạ và hồ sơ học sinh 360° với 5 tab ngữ cảnh chuyên sâu | Prototype giao diện tab hồ sơ học sinh chưa kết nối CSDL PostgreSQL | MISSING | repo:app/src/features/students/ |
| NT-02 | Chuyển lớp học sinh và chuyển năm học hàng loạt với bảo toàn kết quả học tập | Logic chuyển lớp hàng loạt chưa cài đặt backend API | MISSING | repo:app/src/features/students/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-15, OQ-16, OQ-17, OQ-19, OQ-22, OQ-23).

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Kiến trúc tích hợp CSDL Sở](../concepts/csdl-so-integration.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Vòng đời chuyển tiếp học sinh](../concepts/student-lifecycle-transitions.md)
- [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md)
- [Luồng quản lý hồ sơ học sinh 360](../flows/fl-quan-ly-ho-so-hoc-sinh-360.md)
