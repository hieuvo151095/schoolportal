---
title: Luồng Lập & Công Bố Thời Khóa Biểu Tuần
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - HT-01
updated: 2026-11-05
---

# Luồng Lập & Công Bố Thời Khóa Biểu Tuần

## Mục tiêu
Thiết lập lịch giảng dạy tuần cho từng lớp học (chính khóa và ngoại khóa), tự động kiểm tra xung đột 4 chiều (học sinh, giáo viên, phòng học, sĩ số), công bố bản chính thức tới giáo viên và phụ huynh.

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | Quản lý học vụ | [Màn hình thời khóa biểu](../screens/m3-sm1-thoi-khoa-bieu.md) | Chọn lớp học (chính khóa hoặc ngoại khóa), kéo thả hoặc chọn môn học và giáo viên vào từng tiết học trong tuần | Bản thảo thời khóa biểu được tạo lập | HT-01 |
| 2 | Hệ thống | 4-Way Conflict Scheduler | Kiểm tra tự động 4 chiều (OQ-14): Xung đột lịch học sinh (trùng ca chính khóa/ngoại khóa), giáo viên, phòng học/sân bãi, và kiểm tra vượt sĩ số | Báo lỗi và chặn lưu cứng nếu phát hiện trùng tiết hoặc vượt sĩ số | HT-01 |
| 3 | Quản lý học vụ | [Màn hình thời khóa biểu](../screens/m3-sm1-thoi-khoa-bieu.md) | Điều chỉnh các tiết trùng (nếu có), bấm "Công bố thời khóa biểu" | Thời khóa biểu chuyển sang trạng thái `published` và gửi thông báo | HT-01 |

## Quy tắc chặn / validation
- Không cho phép công bố thời khóa biểu nếu vẫn còn cảnh báo trùng tiết của giáo viên, phòng học, hoặc trùng ca của học sinh (HT-01, OQ-14).
- Bộ điều phối 4 chiều tự động phân tích ma trận lịch của lớp chính khóa và tất cả các lớp ngoại khóa học sinh đăng ký để ngăn ngừa trùng giờ hoàn toàn (OQ-14).
- Mỗi lần chỉnh sửa bản đã công bố phải tạo một phiên bản lịch sử mới để phục vụ tra cứu (HT-01).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| HT-01 | Thiết lập và công bố thời khóa biểu tuần theo tiết học, môn học, phòng học và giáo viên | Giao diện thời khóa biểu mới hiển thị bảng tĩnh, chưa có logic kiểm tra xung đột | MISSING | repo:app/src/features/academics/ |

## Liên quan
- [Phân hệ Học tập](../overview/module-academics.md)
- [Thời khóa biểu tuần](../entities/timetable-weekly.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Màn hình thời khóa biểu](../screens/m3-sm1-thoi-khoa-bieu.md)
