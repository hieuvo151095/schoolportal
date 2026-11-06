---
title: Cơ Chế Kiểm Duyệt Bài Viết 2 Cấp & Phân Quyền RBAC
type: concept
sources:
  - pages/sources/src-open-questions-resolutions.md
  - pages/sources/src-prd-school-operating-portal.md
  - repo:docs/guides/development/E-016-school-teachers/epic.md
spec_ids:
  - NT-03
  - VH-05
updated: 2026-11-05
---

# Cơ Chế Kiểm Duyệt Bài Viết 2 Cấp & Phân Quyền RBAC

## Định nghĩa
Là cơ chế kiểm soát chất lượng nội dung truyền thông của nhà trường trước khi công bố ra công chúng hoặc gửi đến phụ huynh, áp dụng nguyên tắc kiểm duyệt 2 cấp: Cấp 1 (Giáo viên khởi tạo bài đăng) và Cấp 2 (Ban Giám Hiệu hoặc Tổ trưởng phê duyệt phát hành).

## Quy tắc
1. **Phân quyền vai trò:**
   - **Giáo viên bộ môn / Giáo viên trợ giảng:** Được phép soạn bài viết, tải ảnh/video và gửi yêu cầu kiểm duyệt (`DRAFT` -> `SUBMITTED`).
   - **Giáo viên chủ nhiệm (được cấp cờ `can_moderate = true`):** Được duyệt bài đăng nội bộ của lớp mình mà không cần qua Ban Giám Hiệu.
   - **Ban Giám Hiệu (School Admin):** Có quyền tối cao kiểm duyệt, chỉnh sửa hoặc từ chối mọi bài đăng của toàn trường kèm lý do.
2. **Luồng xuất bản nội dung:**
   - Bài đăng chỉ hiển thị trên bảng tin phụ huynh khi chuyển sang trạng thái `APPROVED` hoặc `PUBLISHED`.
   - Nếu bị từ chối (`REJECTED`), hệ thống gửi thông báo phản hồi cho người soạn kèm lý do chỉnh sửa.

## Áp dụng ở đâu
- Áp dụng tại phân hệ Vận hành (Hoạt động lớp học) và phân hệ Nhà trường (Bảng thông tin, Bảng tin điện tử).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-03 | Quản lý danh bạ giáo viên và cơ chế kiểm duyệt nội dung bài đăng 2 cấp | Cờ `can_moderate` trên type Teacher và modal phê duyệt | MISSING | repo:app/src/types/teacher.ts:1 |
| VH-05 | Đăng bài hoạt động lớp hỗ trợ gắn hashtag chủ đề và nhắc tên học sinh | Giao diện composer đăng bài và danh sách bài chờ duyệt | MISSING | repo:app/src/types/activity.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Thực thể Giáo viên & Nhân viên](../entities/teacher-staff.md)
- [Thực thể Bảng tin hoạt động lớp](../entities/class-activity.md)
- [Luồng phân công giáo viên kiểm duyệt](../flows/fl-phan-cong-giao-vien-kiem-duyet.md)
- [Luồng đăng bài kiểm duyệt](../flows/fl-dang-bai-kiem-duyet.md)
