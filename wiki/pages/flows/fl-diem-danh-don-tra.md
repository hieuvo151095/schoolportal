---
title: Luồng Điểm Danh Đón Trả & Theo Dõi Sức Khỏe
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-01
  - VH-02
  - VH-03
updated: 2026-11-05
---

# Luồng Điểm Danh Đón Trả & Theo Dõi Sức Khỏe

## Mục tiêu
Thực hiện quy trình đón học sinh buổi sáng, kiểm tra thân nhiệt dấu hiệu y tế, và trả học sinh buổi chiều xác thực người đón hộ chỉ với 1-chạm, bảo đảm an toàn giám hộ và kích hoạt cảnh báo đỏ khẩn cấp khi có tranh chấp.

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | Giáo viên | [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md) | Chọn lớp học và bấm nút Đón buổi sáng 1-chạm; nếu đến sau 08:30 ghi nhận Đến muộn (Late Arrival, kèm toggle báo bổ sung suất ăn với bếp nếu đến trước 09:00 - OQ-20) | Trạng thái học sinh chuyển sang Đã đến lớp kèm giờ đến thực tế | VH-01 |
| 2 | Giáo viên | [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md) | Nhập số đo nhiệt độ và chọn dấu hiệu sức khỏe nếu có bất thường | Lưu chỉ số thân nhiệt; nếu sốt $\ge 38.0^\circ\text{C}$ phát cảnh báo y tế | VH-02 |
| 2c | Giáo viên | [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md) | Sổ dặn thuốc y tế & Xác nhận uống thuốc trưa (OQ-19): Tiếp nhận đơn dặn thuốc từ phụ huynh, đối chiếu Huy hiệu Viên thuốc, cho học sinh uống thuốc đúng liều lượng và bấm xác nhận "Đã cho uống thuốc lúc HH:mm" | Hệ thống tự động gửi Push Notification an tâm tức thời tới phụ huynh; lưu vết bất biến trong `student_medical_logs` | VH-02 |
| 2b | Giáo viên / Y tế | [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md) | Học sinh sốt cao ($\ge 38.5^\circ\text{C}$), phụ huynh đón về trước 10:30 sáng: chọn "Đón về nửa ngày do y tế" | Ghi nhận `half_day_leave`, hoàn 50% tiền ăn bán trú ngày đó | VH-02 |
| 3 | Giáo viên | [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md) | Bấm nút Trả buổi chiều (hoặc ghi nhận Đón sớm giữa buổi Early Departure nếu phụ huynh chủ động đón trước giờ quy định - OQ-20) và chọn người đón hợp lệ | Xác nhận hoàn thành trả trẻ, gửi thông báo đẩy tới phụ huynh; đón sớm chủ động ghi nhận lý do và hoàn 0% tiền ăn | VH-03 |
| 3b | Hệ thống / GV | [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md) | Chốt chặn an toàn tranh chấp quyền giám hộ (OQ-16): Phát hiện người đón thuộc danh sách hạn chế `restricted_guardians` | Bật Cảnh báo đỏ toàn màn hình (Red Modal Alert), hú chuông, khóa nút trả trẻ, gửi SOS tới BGH và Bảo vệ | VH-03 |
| 4 | GV & BGH | Phòng lưu giữ trẻ | Sau 17:00/17:30 người đón lạ không trong danh bạ và không liên lạc được phụ huynh: kích hoạt quy trình giữ trẻ khẩn cấp | Đưa vào phòng lưu trẻ (2 nhân sự + camera), lập biên bản 3 bên; sau 19:30 báo Công an | VH-03 |

## Quy tắc chặn / validation
- Không cho phép xác nhận Trả trẻ nếu chưa thực hiện thao tác Đón trẻ trong cùng ngày (VH-01).
- **Chốt chặn an toàn tranh chấp quyền giám hộ (OQ-16):** Tuyệt đối cấm giao trẻ cho người nằm trong danh sách bị Tòa án hạn chế tiếp cận (`restricted_guardians`). Hệ thống khóa cứng nút trả trẻ trên giao diện, chỉ Ban Giám Hiệu và lực lượng chức năng mới có thẩm quyền giải quyết theo biên bản pháp lý.
- **Chốt chặn người lạ ngoài giờ (OQ-10):** Cấm giao trẻ cho người không có tên/ảnh trong danh bạ nếu chưa có xác thực trực tiếp từ phụ huynh qua OTP hoặc video call.
- **Quy trình bảo vệ pháp lý giữ trẻ ngoài giờ (OQ-10):** Sau 17:30, phòng trực có 2 nhân sự + camera an ninh; sau 19:30 báo Công an Phường và Tổng đài Bảo vệ Trẻ em 111.
- **Hoàn tiền nửa ngày do y tế (OQ-10):** Đón về trước 10:30 sáng do sốt cao $\ge 38.5^\circ\text{C}$ hoặc có chỉ định y tế học đường hoàn 50% suất ăn ngày đó; đón về sau 11:30 sáng (đã ăn trưa) hoàn 0%.
- **Quy tắc không hoàn tiền khi đón sớm chủ động (OQ-20):** Phụ huynh chủ động đón con sớm sau khi học sinh đã đến trường (Early Departure vì việc gia đình, về quê...) thì TUYỆT ĐỐI KHÔNG HOÀN TIỀN GÌ CẢ (hoàn 0%). Quy tắc hoàn tiền ăn chỉ áp dụng khi: rơi vào ngày lễ, nhà trường cho nghỉ, phụ huynh có đơn xin nghỉ học cả ngày hợp lệ duyệt trước 08:30 sáng, hoặc y tế cho về trước 10:30 (OQ-10).
- **Cơ chế tự động đóng băng sổ điểm danh cuối tháng (OQ-21):** Vào 23:59:59 ngày cuối tháng trước khi tiến trình batch job tính phí cho tháng tiếp theo khởi chạy, hệ thống TỰ ĐỘNG KHÓA (Monthly Attendance Auto-Freeze / Read-Only), không cần nút nộp thủ công. Cấm mọi thao tác thêm/sửa/xóa điểm danh tháng cũ, mở khóa khẩn cấp cần BGH duyệt và ghi Audit Trail.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-01 | Điểm danh đón và trả học sinh 1-chạm theo lớp học hằng ngày | Giao diện prototype điểm danh chưa kết nối cơ sở dữ liệu thật | MISSING | repo:app/src/features/attendance/ |
| VH-02 | Ghi nhận thân nhiệt và cảnh báo các dấu hiệu sức khỏe y tế bất thường của học sinh | Modal y tế và thân nhiệt chưa lưu trữ lịch sử sức khỏe | MISSING | repo:app/src/features/attendance/ |
| VH-03 | Xác thực người đón hộ học sinh từ danh sách người đưa đón hợp lệ đã đăng ký | Chưa có API đối chiếu danh bạ người đón hợp lệ | MISSING | repo:app/src/features/attendance/ |

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Điểm danh hằng ngày](../entities/attendance-daily.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md)
