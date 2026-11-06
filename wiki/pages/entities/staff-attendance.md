---
title: Thực Thể Điểm Danh Nhân Sự
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-026-school-staff-attendance/epic.md
spec_ids:
  - NT-10
updated: 2026-11-05
---

# Thực Thể Điểm Danh Nhân Sự

## Định nghĩa
Đại diện cho nhật ký chấm công, ghi nhận giờ vào ca (Check-in), giờ ra ca (Check-out), thời gian đi muộn/về sớm và đơn xin nghỉ phép của giáo viên, nhân viên văn phòng, bảo mẫu và nhân viên phục vụ trong trường học.

## Thuộc tính & Quy tắc nghiệp vụ
- Trạng thái ca: Có mặt đúng giờ (`ON_TIME`), Đi muộn (`LATE`), Về sớm (`EARLY_LEAVE`), Nghỉ có phép (`EXCUSED_ABSENCE`), Nghỉ không phép (`UNEXCUSED_ABSENCE`).
- Dữ liệu xác thực: Giờ vào/ra thực tế, định vị GPS hoặc dữ liệu từ máy chấm công vân tay / camera AI nhận diện khuôn mặt.
- Tổng hợp chấm công: Tự động tổng hợp số công chuẩn, số giờ làm thêm (OT) và số lần đi muộn trong tháng để làm căn cứ tính lương.

## Quan hệ
- Gắn liền với từng cán bộ trong [Giáo viên & Nhân viên](teacher-staff.md).
- Gắn với [Niên khóa & Học kỳ](academic-year.md) và lịch làm việc của trường.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-10 | Điểm danh ca làm việc và tổng hợp bảng chấm công nhân viên nhà trường | Type `StaffAttendance`, Redux slice và bảng điểm danh | MISSING | repo:app/src/types/staffAttendance.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Màn hình điểm danh nhân viên](../screens/m5-sm9-diem-danh-nv.md)
- [Luồng điểm danh chấm công nhân viên](../flows/fl-diem-danh-cham-cong-nv.md)
