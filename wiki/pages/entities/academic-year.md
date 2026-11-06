---
title: Thực Thể Niên Khóa & Học Kỳ
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-029-school-academic-year/epic.md
spec_ids:
  - NT-14
updated: 2026-11-05
---

# Thực Thể Niên Khóa & Học Kỳ

## Định nghĩa
Đại diện cho khung thời gian năm học và các học kỳ (Học kỳ 1, Học kỳ 2, Hè) của nhà trường, đóng vai trò mỏ neo thời gian tối cao cho toàn bộ dữ liệu học sinh, lớp học, thời khóa biểu và sổ điểm đánh giá.

## Thuộc tính & Quy tắc nghiệp vụ
- Mỗi trường học chỉ có duy nhất **một niên khóa hiện hành** (`is_current = true`). Kích hoạt niên khóa mới sẽ tự động chuyển niên khóa cũ về trạng thái lưu trữ.
- Niên khóa gồm ngày bắt đầu (`start_date`) và ngày kết thúc (`end_date`), không được trùng chéo khoảng thời gian với niên khóa khác trong cùng trường.
- Mỗi niên khóa chứa danh sách các học kỳ với ngày bắt đầu/kết thúc tương ứng để phục vụ tính điểm học lực và học phí định kỳ.

## Quan hệ
- Một trường học (`school_id`) sở hữu nhiều Niên khóa (`academic_years`).
- Một Niên khóa chứa nhiều [Lớp học](classroom.md) và [Thời khóa biểu tuần](timetable-weekly.md).
- Kết quả học tập trong [Sổ điểm đánh giá](gradebook-record.md) gắn liền với Niên khóa và Học kỳ cụ thể.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-14 | Quản lý niên khóa học, các kỳ học và kích hoạt niên khóa hiện hành | Type định nghĩa `AcademicYear`, mock data và trang quản trị season | MISSING | repo:app/src/types/academicYear.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Màn hình niên khóa](../screens/m5-sm13-nam-hoc.md)
- [Luồng chuyển lớp và chuyển năm học](../flows/fl-chuyen-lop-va-chuyen-nam-hoc.md)
