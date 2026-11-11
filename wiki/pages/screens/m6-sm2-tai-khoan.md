---
title: Màn Hình Quản Trị Tài Khoản
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - CH-02
apps:
  - web
route_ids:
  - /{schoolCode}/setting/users
status: missing
updated: 2026-11-11
---

# Màn Hình Quản Trị Tài Khoản

## Mục đích
Cấp phát tài khoản người dùng, phân quyền nhóm quản trị (Admin, Quản lý, Giáo viên, Nhân viên, Phụ huynh) và quản lý trạng thái tài khoản học sinh.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/setting/users` | repo:app/src/pages/[schoolCode]/setting/users/index.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-02 | Quản trị tài khoản người dùng, cấp quyền quản trị và quản lý trạng thái tài khoản | MISSING |

## Chuẩn hóa UI/UX Design System v2.6.0 & Hiến pháp
1. **FilterBar Single Frame Line 38px**:
   - Ô tìm kiếm text xám gợi ý (`placeholder="Tìm theo tên, email, SĐT..."` hoặc `placeholder="Tìm tên HS, mã HS..."`).
   - Các trường Dropdown chuẩn 38px với text xám hướng dẫn (`placeholder="Chọn vai trò"`, `placeholder="Chọn trạng thái"`, `placeholder="Chọn nguồn dữ liệu"`, `placeholder="Chọn lớp học"`), bảo lưu logic lựa chọn mặc định.
   - Action button "+ Thêm người dùng" nằm cân phải trên cùng frame line 38px.
2. **Right-Sheet SlideOver**:
   - Thao tác "Thêm người dùng mới", "Chỉnh sửa tài khoản" và "Cấp tài khoản học sinh" mở Right-Sheet `<SlideOver>` từ cạnh phải, loại bỏ popup modal nổi giữa màn hình.
3. **Thao tác dòng bảng (Three-Dots DropdownMenu)**:
   - Cột "Thao tác" dùng `<DropdownMenu>` 3 chấm với nút `<IconButton icon="ellipsis-vertical">`, hiển thị các tác vụ bằng text thuần túy ("Xem chi tiết", "Chỉnh sửa tài khoản", "Ngừng hoạt động / Kích hoạt lại", "Xóa tài khoản").
4. **Hệ màu Semantic**:
   - Thẻ `<StatusTag>` semantic: "Hoạt động" (`tone="success"`), "Tạm khóa / Ngừng HĐ" (`tone="neutral"` hoặc `tone="warning"`).
5. **Điều hướng Tab**:
   - Component `<CountedTabs>` hiển thị số lượng trực quan cho tab "Người Dùng (8)" và "Học Sinh (9)".

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-02 | Quản trị tài khoản người dùng, cấp quyền quản trị và quản lý trạng thái tài khoản | Frontend hoàn chỉnh theo Design System v2.6.0 và Hiến pháp UX/UI, tích hợp Redux slice và dữ liệu mẫu | MISSING | repo:app/src/modules/setting/account/UserAccountsTable.tsx:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-settings.md)
- [Thực thể liên quan](../entities/auth-session.md)
