---
title: Thực Thể Môn Học
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-022-school-subject-management/epic.md
spec_ids:
  - NT-05
updated: 2026-11-05
---

# Thực Thể Môn Học

## Định nghĩa
Đại diện cho danh mục các môn học chính khóa (Toán, Văn, Tiếng Anh, Khoa học...), môn năng khiếu và hoạt động giáo dục được giảng dạy tại trường học theo chương trình của Bộ GD&ĐT hoặc chương trình quốc tế.

## Thuộc tính & Quy tắc nghiệp vụ
- Thuộc tính chính: Mã môn (`code`), Tên môn (`name`), Số tiết tiêu chuẩn/tuần, Phân loại cấp học (`TH`, `THCS`, `THPT`, `MAM_NON`), Hệ số tính điểm (`weight`).
- Phân công giáo viên: Mỗi môn học có danh sách giáo viên bộ môn được phân quyền nhập điểm và giao bài tập.
- Tính toàn vẹn: Không cho phép xóa môn học đã có dữ liệu sổ điểm hoặc đã xuất hiện trong thời khóa biểu của niên khóa hiện hành.

## Quan hệ
- Liên kết với [Khối lớp](grade-level.md) và [Lớp học](classroom.md).
- Xuất hiện trực tiếp trên các tiết học của [Thời khóa biểu tuần](timetable-weekly.md), các nhiệm vụ trong [Bài tập về nhà](homework-assignment.md) và các cột điểm trong [Sổ điểm đánh giá](gradebook-record.md).
- Gắn với [Giáo viên & Nhân viên](teacher-staff.md) qua quan hệ phân công chuyên môn.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-05 | Quản lý danh mục môn học và phân công giáo viên giảng dạy | Type `Subject`, Redux slice và validation môn học | MISSING | repo:app/src/types/subject.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Phân hệ Học tập](../overview/module-academics.md)
- [Màn hình môn học](../screens/m5-sm4-mon-hoc.md)
- [Thực thể Sổ điểm đánh giá](gradebook-record.md)
- [Thực thể Thời khóa biểu tuần](timetable-weekly.md)
