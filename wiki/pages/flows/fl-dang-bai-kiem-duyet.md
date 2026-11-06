---
title: Luồng Đăng Bài Hoạt Động Lớp & Kiểm Duyệt 2 Cấp
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-05
  - NT-03
updated: 2026-11-05
---

# Luồng Đăng Bài Hoạt Động Lớp & Kiểm Duyệt 2 Cấp

## Mục tiêu
Cho phép giáo viên ghi nhận và truyền thông hoạt động học tập hằng ngày của lớp học tới phụ huynh, đồng thời thực thi cơ chế kiểm duyệt nội dung 2 cấp bảo đảm tính chuẩn mực sư phạm.

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | Giáo viên | [Màn hình hoạt động](../screens/m2-sm2-hoat-dong.md) | Soạn bài viết, tải hình ảnh, gắn hashtag `#` chủ đề và nhắc tên học sinh `@` | Bài viết sẵn sàng xuất bản hoặc kiểm duyệt | VH-05 |
| 2 | Hệ thống | Background Logic | Kiểm tra vai trò của giáo viên: Giáo viên chính (Chủ nhiệm) hay Giáo viên hỗ trợ | Nếu là GV chính: Đăng trực tiếp; Nếu là GV hỗ trợ: Chuyển sang Chờ duyệt | NT-03 |
| 3 | GV chính / Admin | [Màn hình hoạt động](../screens/m2-sm2-hoat-dong.md) | Mở tab "Chờ duyệt", xem nội dung và bấm "Phê duyệt" hoặc "Yêu cầu chỉnh sửa" | Bài viết được phát hành tới toàn bộ phụ huynh học sinh | NT-03 |

## Quy tắc chặn / validation
- Bài viết ở trạng thái Chờ duyệt (`pending_review`) tuyệt đối không hiển thị trên ứng dụng của phụ huynh (NT-03).
- Giáo viên hỗ trợ không được tự phê duyệt bài viết do chính mình khởi tạo (NT-03).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-05 | Đăng bài hoạt động lớp hỗ trợ gắn hashtag `#` chủ đề và nhắc tên học sinh `@` | Giao diện đăng bài chưa hỗ trợ nhắc tên học sinh động | MISSING | repo:app/src/features/activity/ |
| NT-03 | Quản lý danh bạ giáo viên và cơ chế kiểm duyệt nội dung bài đăng 2 cấp | Chưa có tab Chờ duyệt bài viết và quyền duyệt 2 cấp | MISSING | repo:app/src/features/activity/ |

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Bảng tin hoạt động lớp](../entities/class-activity.md)
- [Giáo viên & Nhân viên](../entities/teacher-staff.md)
- [Màn hình hoạt động](../screens/m2-sm2-hoat-dong.md)
