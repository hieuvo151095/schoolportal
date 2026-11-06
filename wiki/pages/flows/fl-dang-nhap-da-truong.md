---
title: Luồng Đăng Nhập Đa Trường & Phân Quyền RBAC
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-tech-architecture-blueprint.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - DN-01
  - DN-02
updated: 2026-11-05
---

# Luồng Đăng Nhập Đa Trường & Phân Quyền RBAC

## Mục tiêu
Xác thực danh tính người dùng theo trường học cụ thể dựa trên tiền tố `{schoolCode}`, kiểm tra vai trò người dùng và cấp phiên làm việc an toàn với quyền hạn tương ứng.

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | Người dùng | [Màn hình đăng nhập](../screens/m7-sm2-dang-nhap.md) | Nhập mã trường `{schoolCode}`, tên đăng nhập/email và mật khẩu | Gửi request xác thực kèm context trường học | DN-01 |
| 2 | Backend Gateway | Auth Service | Kiểm tra thông tin, xác thực mật khẩu qua Argon2id/Bcrypt và kiểm tra trạng thái tài khoản | Cấp cặp JWT Access/Refresh Token kèm thông tin vai trò RBAC | DN-01 |
| 3 | Frontend Portal | Dashboard Router | Đọc vai trò người dùng (Admin, Giáo viên, Kế toán), chuyển hướng tới phân hệ tương ứng | Giao diện hiển thị đúng menu và tính năng được phân quyền | DN-02 |
| 4 | Người dùng kiêm nhiệm | Thanh điều hướng Header | Chọn chuyển trường hoặc mở 2 tab 2 trường khác nhau | Kích hoạt `RESET_TENANT_STATE` dọn sạch Redux store; cô lập token và kênh WebSocket theo `schoolCode` | DN-01 |

## Quy tắc chặn / validation
- Nếu tài khoản ở trạng thái Khóa (`locked` hoặc `inactive`), hệ thống từ chối đăng nhập và trả thông báo rõ ràng (DN-01).
- Nếu mã trường `{schoolCode}` không tồn tại trong hệ thống, chuyển hướng về trang báo lỗi trường học không hợp lệ (DN-01).
- **Chốt chặn an toàn chuyển trường (OQ-13):** Khi chuyển đổi trường trên cùng một tab, bắt buộc dispatch action `RESET_TENANT_STATE` để xóa sạch toàn bộ cache Redux của trường cũ trước khi nạp dữ liệu trường mới (DN-01).
- **Cô lập WebSocket và Storage đa tab (OQ-13):** Khi mở đồng thời nhiều tab cho các trường khác nhau, mỗi tab bắt buộc kết nối WebSocket phân kênh `{schoolCode}:user:{userId}:{channel}` và đọc token phân vùng `eco_token_{schoolCode}`, tuyệt đối cấm rò rỉ thông báo và dữ liệu chéo trường (DN-01).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| DN-01 | Đăng nhập hệ thống theo tiền tố mã trường `{schoolCode}` và cấp cặp JWT Access/Refresh Token | Prototype dùng mock auth, chưa có JWT và RLS backend | MISSING | repo:app/src/pages/sso/login.tsx |
| DN-02 | Phân quyền kiểm soát truy cập theo mô hình Role-Based Access Control (RBAC) 3 cấp | Chưa có backend authorization guard theo scope RBAC | MISSING | repo:app/src/utils/authSession.ts |

## Liên quan
- [Phân hệ Đăng nhập](../overview/module-auth.md)
- [Cơ chế cô lập đa trường học](../concepts/multi-tenancy-isolation.md)
- [Phiên đăng nhập](../entities/auth-session.md)
- [Màn hình đăng nhập](../screens/m7-sm2-dang-nhap.md)
