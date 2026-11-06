---
title: Luồng Phân Công Giáo Viên & Quyền Kiểm Duyệt
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - NT-03
updated: 2026-11-05
---

# Luồng Phân Công Giáo Viên & Quyền Kiểm Duyệt

## Mục tiêu
Thiết lập danh sách nhân sự giáo viên, phân công lớp chủ nhiệm và môn học giảng dạy, đồng thời cấu hình quyền kiểm duyệt đăng bài hoạt động nhằm kiểm soát chất lượng nội dung truyền thông.

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | Quản trị viên | [Màn hình giáo viên](../screens/m5-sm2-giao-vien.md) | Thêm giáo viên mới hoặc chọn giáo viên từ danh sách nhân sự | Mở form thông tin giáo viên và phân quyền | NT-03 |
| 2 | Quản trị viên | [Màn hình giáo viên](../screens/m5-sm2-giao-vien.md) | Phân công lớp chủ nhiệm, các môn học giảng dạy và chọn vai trò kiểm duyệt | Lưu thiết lập phân công giảng dạy | NT-03 |
| 3 | Quản trị viên | [Màn hình giáo viên](../screens/m5-sm2-giao-vien.md) | Cấu hình quyền kiểm duyệt: Chọn "Đăng trực tiếp" cho GV chính hoặc "Cần duyệt" cho GV hỗ trợ | Áp dụng chính sách kiểm duyệt 2 cấp | NT-03 |

## Quy tắc chặn / validation
- Một lớp học chính khóa chỉ có tối đa một Giáo viên chủ nhiệm chính trong cùng một niên khóa (NT-03).
- Giáo viên hỗ trợ khi được phân quyền "Cần duyệt" không được tự duyệt bài của mình (NT-03).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-03 | Quản lý danh bạ giáo viên và cơ chế kiểm duyệt nội dung bài đăng 2 cấp | Chưa có trường dữ liệu và logic phân quyền duyệt bài 2 cấp trong backend | MISSING | repo:app/src/features/teachers/ |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Giáo viên & Nhân viên](../entities/teacher-staff.md)
- [Bảng tin hoạt động lớp](../entities/class-activity.md)
- [Màn hình giáo viên](../screens/m5-sm2-giao-vien.md)
