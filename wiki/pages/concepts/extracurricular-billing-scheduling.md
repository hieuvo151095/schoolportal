---
title: Điều Phối Lịch Học, Biểu Phí & Phân Rã Hóa Đơn Lớp Ngoại Khóa
type: concept
sources:
  - pages/sources/src-open-questions-resolutions.md
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-04
  - TC-01
updated: 2026-11-05
---

# Điều Phối Lịch Học, Biểu Phí & Phân Rã Hóa Đơn Lớp Ngoại Khóa

## Định nghĩa
Cơ chế quản trị lớp học ngoại khóa (câu lạc bộ năng khiếu, tiếng Anh nâng cao, thể thao, nghệ thuật), giải quyết trọn vẹn xung đột thời khóa biểu 4 chiều, hỗ trợ mô hình thu phí linh hoạt theo kỳ hoặc theo buổi học thực tế, và cho phép phân rã hóa đơn (Sub-Invoice) khi phụ huynh từ chối hoặc trả chậm khoản thu ngoại khóa.

## Quy tắc
1. **Bộ điều phối lịch học & Phát hiện xung đột 4 chiều (4-Way Conflict Scheduler - OQ-14):**
   - Khi xếp lịch học hoặc ghi danh học sinh vào lớp ngoại khóa, hệ thống tự động kiểm tra xung đột thời gian thực trên 4 chiều:
     - *(a) Học sinh (Student):* Không được trùng khung giờ với tiết học chính khóa hoặc lớp ngoại khóa khác đã ghi danh.
     - *(b) Giáo viên (Teacher):* Không bị phân công dạy 2 lớp khác nhau trong cùng một khung giờ.
     - *(c) Phòng học / Cơ sở vật chất (Facility):* Kiểm tra trùng lặp phòng chức năng, sân bóng, nhà đa năng hoặc phòng thí nghiệm.
     - *(d) Sĩ số tối đa (Capacity):* Chặn ghi danh vượt quá sĩ số tối đa (`capacity`) đã được phê duyệt của lớp ngoại khóa.
   - Khi phát hiện xung đột, hệ thống chặn lưu (Hard Block) và hiển thị modal cảnh báo vị trí trùng lịch chi tiết để quản trị viên điều chỉnh.
2. **Mô hình tính phí linh hoạt (Flexible Fee Billing Engine):**
   - Lớp ngoại khóa hỗ trợ 2 phương thức tính phí:
     - `TERM_FIXED`: Thu trọn gói cố định theo tháng hoặc theo học kỳ/khóa học.
     - `PER_SESSION`: Thu theo số buổi học thực tế. Hệ thống tự động tổng hợp số buổi có mặt từ bảng điểm danh lớp ngoại khóa trong tháng để nhân đơn giá buổi học: $\text{Fee} = \sum (\text{attended\_sessions} \times \text{session\_rate})$.
3. **Phân rã hóa đơn (Sub-Invoice Decomposition) & Partial Payment:**
   - Khoản phí ngoại khóa được cấu trúc dưới dạng Sub-Invoice độc lập (`is_separable = true`) lồng trong hóa đơn tổng của học sinh.
   - Nếu phụ huynh chỉ muốn đóng học phí chính khóa và từ chối/khiếu nại khoản ngoại khóa:
     - Hệ thống cho phép thanh toán một phần (`PARTIAL_PAID`), gạch nợ hoàn tất khoản chính khóa.
     - Cung cấp nút "Tách hóa đơn ngoại khóa" (Decompose Sub-Invoice): Tách khoản ngoại khóa thành hóa đơn con độc lập (`INV-EXT-...`), chuyển hóa đơn chính khóa về trạng thái `PAID` hợp lệ.
     - Nếu phụ huynh chính thức nộp đơn xin rút khỏi lớp ngoại khóa, kế toán được quyền hủy riêng hóa đơn con (`CANCELLED`) kèm lý do mà không ảnh hưởng tới hóa đơn chính khóa và công nợ trường.

## Áp dụng ở đâu
- [Lớp học](../entities/classroom.md)
- [Thời khóa biểu tuần](../entities/timetable-weekly.md)
- [Hóa đơn học phí](../entities/tuition-invoice.md)
- [Luồng lập thời khóa biểu](../flows/fl-lap-thoi-khoa-bieu.md)
- [Luồng lập và phát hành hóa đơn](../flows/fl-lap-phat-hanh-hoa-don.md)
- [Màn hình thời khóa biểu](../screens/m3-sm1-thoi-khoa-bieu.md)
- [Màn hình hóa đơn học phí](../screens/m4-sm1-hoc-phi.md)
- [Màn hình quản lý lớp học](../screens/m5-sm3-lop-hoc.md)

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-04 | Phân loại lớp chính khóa và ngoại khóa kèm chốt chặn an toàn khi xóa lớp | Đã có trường loại lớp nhưng chưa tích hợp kiểm tra trùng lịch 4 chiều | MISSING | repo:app/src/types/class.ts:1 |
| TC-01 | Lập hóa đơn học phí tháng cho học sinh tích hợp mã VietQR động | Hóa đơn đơn khối, chưa hỗ trợ phân rã sub-invoice độc lập | MISSING | repo:app/src/types/invoice.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Phân hệ Học tập](../overview/module-academics.md)
- [Lớp học](../entities/classroom.md)
- [Thời khóa biểu tuần](../entities/timetable-weekly.md)
- [Hóa đơn học phí](../entities/tuition-invoice.md)
- [Luồng lập thời khóa biểu](../flows/fl-lap-thoi-khoa-bieu.md)
- [Luồng lập và phát hành hóa đơn](../flows/fl-lap-phat-hanh-hoa-don.md)
- [Màn hình thời khóa biểu](../screens/m3-sm1-thoi-khoa-bieu.md)
- [Màn hình hóa đơn học phí](../screens/m4-sm1-hoc-phi.md)
- [Màn hình quản lý lớp học](../screens/m5-sm3-lop-hoc.md)
