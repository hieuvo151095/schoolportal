---
title: Thời Khóa Biểu Tuần (Weekly Timetable)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - HT-01
updated: 2026-11-05
---

# Thời Khóa Biểu Tuần (Weekly Timetable)

## Định nghĩa
Thực thể Thời khóa biểu tuần lưu trữ lịch học chi tiết từ thứ Hai đến thứ Bảy theo các tiết học (tiết 1 đến tiết 10), phòng học, môn học và giáo viên phụ trách của từng lớp học trong trường, đồng thời tích hợp bộ điều phối xung đột lịch giữa lớp chính khóa và ngoại khóa.

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| HT-01 | Phân bổ lịch học theo ngày trong tuần, thứ tự tiết học, môn học, giáo viên bộ môn và phòng học | Trực quan hóa dạng lưới ma trận |
| HT-01 | Kiểm tra xung đột lịch cơ bản: Cảnh báo khi một giáo viên hoặc một phòng học bị xếp trùng giờ tại hai lớp khác nhau | Ngăn chặn xung đột lịch giảng dạy |
| HT-01 | Điều phối xung đột 4 chiều chính khóa & ngoại khóa (OQ-14): Kiểm tra thời gian thực trên 4 chiều: Học sinh, Giáo viên, Phòng học/sân bãi, Sĩ số tối đa; chặn lưu cứng khi có xung đột | Chi tiết tại [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md) |
| HT-01 | Quản lý trạng thái: Bản nháp (`draft`) và Đã công bố (`published`); lưu lịch sử các phiên bản điều chỉnh | Phụ huynh xem được bản đã công bố |

## Quan hệ
- Thuộc về một [Lớp học](classroom.md).
- Gắn với [Giáo viên & Nhân viên](teacher-staff.md) giảng dạy.
- Hiển thị trên [Màn hình thời khóa biểu](../screens/m3-sm1-thoi-khoa-bieu.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| HT-01 | Thiết lập và công bố thời khóa biểu tuần theo tiết học, môn học, phòng học và giáo viên | Prototype thời khóa biểu frontend dùng dữ liệu tĩnh, chưa có API lưu vết | MISSING | repo:app/src/features/academics/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-14).

## Liên quan
- [Phân hệ Học tập](../overview/module-academics.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Màn hình thời khóa biểu](../screens/m3-sm1-thoi-khoa-bieu.md)
- [Luồng lập thời khóa biểu](../flows/fl-lap-thoi-khoa-bieu.md)
