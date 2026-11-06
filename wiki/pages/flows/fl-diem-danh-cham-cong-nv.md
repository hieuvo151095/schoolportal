---
title: Luồng Chấm Công Ca & Tổng Hợp Điểm Danh Nhân Sự
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-026-school-staff-attendance/epic.md
spec_ids:
  - NT-10
updated: 2026-11-05
---

# Luồng Chấm Công Ca & Tổng Hợp Điểm Danh Nhân Sự

## Mục tiêu
Tự động hóa việc ghi nhận công làm việc của đội ngũ giáo viên, bảo mẫu và nhân viên trường học, làm cơ sở tính lương, thưởng và đánh giá kỷ luật lao động chính xác.

## Các bước
| Bước | Vai trò | Ứng dụng | Hành động | Kết quả mong đợi |
|---|---|---|---|---|
| 1 | Giáo viên / Nhân viên | Máy chấm công / Web / App | Check-in khi đến trường và Check-out khi hết giờ làm | Ghi nhận thời gian thực tế |
| 2 | Hệ thống | Server Backend | Đối chiếu giờ vào/ra với khung ca làm việc quy định | Đánh dấu: Đúng giờ, Đi muộn, Về sớm |
| 3 | Giáo viên | Web Admin / App | Nộp đơn giải trình hoặc đơn xin nghỉ phép nếu có sự cố bất khả kháng | Đơn gửi tới quản lý nhân sự |
| 4 | Cán bộ nhân sự | Web Admin | Vào màn hình Điểm danh NV, kiểm tra đơn xin phép và bấm "Duyệt phép" | Cập nhật thành Vắng có phép |
| 5 | Cán bộ nhân sự | Web Admin | Cuối tháng nhấn "Tổng hợp bảng công" và xuất file Excel | Kết xuất bảng tổng hợp công chuẩn |

## Quy tắc chặn / validation
- Nhân viên quên check-out cuối ngày sẽ bị đánh dấu trạng thái cảnh báo `MISSING_CHECKOUT` và phải làm thủ tục giải trình bổ sung trước khi chốt công tháng.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-10 | Điểm danh ca làm việc và tổng hợp bảng chấm công nhân viên nhà trường | Giao diện bảng chấm công nhân viên và Redux slice | MISSING | repo:app/src/pages/[schoolCode]/school/staff-attendance/index.tsx:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Thực thể Điểm danh nhân sự](../entities/staff-attendance.md)
- [Thực thể Giáo viên & Nhân viên](../entities/teacher-staff.md)
- [Màn hình điểm danh nhân viên](../screens/m5-sm9-diem-danh-nv.md)
