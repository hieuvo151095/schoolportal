---
title: Thực Thể Khối Lớp Học
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-023-school-grade-management/epic.md
spec_ids:
  - NT-06
updated: 2026-11-05
---

# Thực Thể Khối Lớp Học

## Định nghĩa
Đại diện cho cấp bậc phân loại học sinh theo độ tuổi hoặc trình độ học vấn trong mô hình trường liên cấp (Khối Mầm non: Mầm/Chồi/Lá; Khối Tiểu học: Khối 1..5; Khối THCS: Khối 6..9; Khối THPT: Khối 10..12).

## Thuộc tính & Quy tắc nghiệp vụ
- Thuộc tính: Mã khối (`grade_code`), Tên khối (`grade_name`), Bậc học (`level`: Mầm non, Tiểu học, THCS, THPT), Thứ tự hiển thị.
- Định mức học phí: Là đơn vị cơ sở để gán biểu phí chuẩn trong phân hệ Tài chính (áp dụng biểu phí theo khối trước khi ghi đè theo từng lớp cụ thể).
- Ràng buộc: Không được xóa khối lớp khi đang có các lớp học trực thuộc đang hoạt động.

## Quan hệ
- Một Khối lớp chứa nhiều [Lớp học](classroom.md).
- Gắn với [Danh mục khoản phí](fee-catalog-item.md) và [Chính sách miễn giảm](discount-policy.md) theo chính sách từng khối.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-06 | Quản lý danh mục khối lớp học và định tuyến chương trình liên cấp | Type `Grade`, Redux slice và danh sách khối lớp | MISSING | repo:app/src/types/grade.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Màn hình khối lớp](../screens/m5-sm5-khoi-lop.md)
- [Thực thể Lớp học](classroom.md)
