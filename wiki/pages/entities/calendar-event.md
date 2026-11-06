---
title: Thực Thể Lịch Sự Kiện & Ngày Nghỉ Lễ
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-020-school-calendar/epic.md
spec_ids:
  - NT-13
updated: 2026-11-05
---

# Thực Thể Lịch Sự Kiện & Ngày Nghỉ Lễ

## Định nghĩa
Đại diện cho các mốc thời gian sự kiện, kỳ nghỉ lễ quốc gia, lễ hội trường học, lịch thi học kỳ, ngày họp phụ huynh và hoạt động dã ngoại ngoại khóa trong năm học.

## Thuộc tính & Quy tắc nghiệp vụ
- Phân loại: Ngày nghỉ lễ toàn trường (`HOLIDAY`), Sự kiện học tập (`ACADEMIC_EVENT`), Hoạt động ngoại khóa (`EXTRACURRICULAR`), Hoạt động nội bộ cán bộ giáo viên (`STAFF_ONLY`).
- Thuộc tính ngày: Bắt đầu (`start_date`), Kết thúc (`end_date`), Cả ngày (`all_day`), Địa điểm tổ chức.
- Quy tắc vận hành: Vào những ngày được đánh dấu là `HOLIDAY`, hệ thống tự động tắt cảnh báo điểm danh chưa hoàn thành và loại trừ ngày này khỏi việc tính vắng học sinh hoặc phạt tiền muộn.

## Quan hệ
- Thuộc về [Niên khóa & Học kỳ](academic-year.md) cụ thể.
- Tác động tới việc sinh lịch tại [Thời khóa biểu tuần](timetable-weekly.md) và bảng kiểm tra tại [Điểm danh hằng ngày](attendance-daily.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-13 | Lịch sự kiện và hoạt động trải nghiệm ngoại khóa toàn trường | Type `CalendarEvent`, form tạo sự kiện và validation ngày | MISSING | repo:app/src/types/calendar.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Màn hình lịch sự kiện](../screens/m5-sm12-lich-su-kien.md)
- [Thực thể Niên khóa & Học kỳ](academic-year.md)
