---
title: Điểm Danh Hằng Ngày (Daily Attendance)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-01
  - VH-02
  - VH-03
  - VH-04
updated: 2026-11-05
---

# Điểm Danh Hằng Ngày (Daily Attendance)

## Định nghĩa
Thực thể Điểm danh hằng ngày ghi nhận sự có mặt, vắng mặt, giờ đón/trả, chỉ số thân nhiệt, tình trạng sức khỏe, người đưa đón của từng học sinh trong mỗi ngày học, hỗ trợ điểm danh lớp ngoại khóa theo buổi và chốt chặn an toàn giám hộ trẻ em.

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| VH-01 | Ghi nhận thời gian Đón (Check-in buổi sáng) và Trả (Check-out buổi chiều) bằng thao tác 1-chạm | Cập nhật thông báo tức thì tới ứng dụng phụ huynh |
| VH-01 | Điểm danh lớp ngoại khóa (OQ-14): Ghi nhận tham gia theo từng buổi học, làm căn cứ tự động tính học phí theo buổi (`PER_SESSION`) | Xem [Điều phối ngoại khóa](../concepts/extracurricular-billing-scheduling.md) |
| VH-02 | Ghi nhận thân nhiệt (đơn vị °C) và chọn dấu hiệu sức khỏe bất thường (Cảm sốt, Phát ban, Tay chân miệng...) | Cảnh báo tự động nếu nhiệt độ $\ge 38.0^\circ\text{C}$ |
| VH-02 | Đón về nửa ngày do y tế: Nếu sốt cao $\ge 38.5^\circ\text{C}$ đón về trước 10:30 sáng, ghi nhận trạng thái `half_day_leave` | Tự động kích hoạt hoàn 50% tiền ăn bán trú ngày đó |
| VH-03 | Xác thực người đón hộ: Chọn người đón từ danh sách người đưa đón hợp lệ đã đăng ký (Bố, Mẹ, Ông, Bà, Tài xế đưa đón) | Chụp ảnh hoặc kiểm tra ảnh đại diện người đón |
| VH-03 | Xử lý ngoài giờ sau 17:00/17:30 người đón lạ không liên lạc được phụ huynh: Cấm giao trẻ, bật cờ `unclaimed_child_flag` | Chuyển sang quy trình lưu giữ trẻ 4 cấp bảo vệ pháp lý |
| VH-03 | Chốt chặn an toàn tranh chấp quyền giám hộ (OQ-16): Học sinh gắn Huy hiệu Khiên Đỏ; nếu người đón nằm trong `restricted_guardians`, kích hoạt Cảnh báo đỏ toàn màn hình (Red Modal Alert) kèm chuông báo động, cấm trả trẻ và báo BGH | Xem [Đường ống AI & An toàn giám hộ](../concepts/ai-face-recognition.md) |
| VH-02 | Sổ dặn thuốc y tế & Xác nhận uống thuốc trưa (OQ-19): Phụ huynh gửi đơn dặn thuốc điện tử qua app (tên thuốc, liều lượng, giờ uống, ảnh đơn thuốc). Màn hình điểm danh hiển thị Huy hiệu Viên thuốc; giáo viên bấm xác nhận "Đã cho uống thuốc lúc HH:mm" và hệ thống bắn thông báo an tâm tức thời tới phụ huynh | Lưu vết bất biến vào `student_medical_logs` |
| VH-01 | Đến muộn & Đón sớm giữa buổi (OQ-20): Ghi nhận Đến muộn (Late Arrival, kèm toggle báo bổ sung suất ăn với bếp nếu đến trước 09:00) và Đón sớm giữa buổi (Early Departure, ghi nhận giờ đón, người đón, lý do). Phụ huynh chủ động đón sớm KHÔNG hoàn tiền ăn | Xem [Cơ chế hoàn tiền ăn](../concepts/meal-refund-engine.md) |
| VH-04 | Báo vắng học sinh: Phân loại Vắng có phép (`excused`) hoặc Vắng không phép (`unexcused`) | Ngày vắng có phép kích hoạt cơ chế hoàn tiền ăn tự động |
| VH-01 | Chốt điểm danh tự động cuối tháng (OQ-21): Loại bỏ nút nộp thủ công. Vào 23:59:59 ngày cuối tháng trước khi hệ thống tính phí cho tháng tiếp theo, hệ thống TỰ ĐỘNG KHÓA (Freeze / Read-Only), không cho cập nhật bất kỳ thông tin điểm danh nào trong tháng đó nữa | Mở khóa ngoại lệ cần BGH duyệt và lưu Audit Trail |

## Quan hệ
- Thuộc về một [Hồ sơ học sinh 360](student-profile.md) tại một [Lớp học](classroom.md).
- Được thực hiện và xác nhận bởi [Giáo viên & Nhân viên](teacher-staff.md).
- Là căn cứ tính toán cho [Khấu trừ hoàn tiền ăn](meal-refund-credit.md) trong [Hóa đơn học phí](tuition-invoice.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-01 | Điểm danh đón và trả học sinh 1-chạm theo lớp học hằng ngày | Giao diện prototype điểm danh chưa kết nối cơ sở dữ liệu thật | MISSING | repo:app/src/features/attendance/ |
| VH-02 | Ghi nhận thân nhiệt và cảnh báo các dấu hiệu sức khỏe y tế bất thường của học sinh | Modal y tế và thân nhiệt chưa lưu trữ lịch sử sức khỏe | MISSING | repo:app/src/features/attendance/ |
| VH-03 | Xác thực người đón hộ học sinh từ danh sách người đưa đón hợp lệ đã đăng ký | Chưa có API đối chiếu danh bạ người đón hợp lệ | MISSING | repo:app/src/features/attendance/ |
| VH-04 | Báo vắng học sinh hàng loạt và phân loại vắng có phép hoặc không phép | Chưa đồng bộ dữ liệu ngày vắng sang phân hệ hóa đơn | MISSING | repo:app/src/features/attendance/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-02, OQ-10, OQ-14, OQ-16, OQ-19, OQ-20, OQ-21).

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md)
- [Luồng điểm danh đón trả](../flows/fl-diem-danh-don-tra.md)
