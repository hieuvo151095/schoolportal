---
title: Phân Hệ Đăng Nhập & Xác Thực
type: overview
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-tech-architecture-blueprint.md
  - pages/sources/src-open-questions-resolutions.md
  - pages/sources/src-prd-dang-nhap-xac-thuc.md
  - pages/sources/src-legacy-operating-portal-guide.md
updated: 2026-11-05
---

# Phân Hệ Đăng Nhập & Xác Thực

## Tóm tắt
Phân hệ Đăng nhập & Xác thực đảm nhiệm định danh người dùng theo ngữ cảnh trường học đa trường `{schoolCode}`, hỗ trợ đăng nhập mật khẩu truyền thống và đăng nhập một lần (SSO) từ Managing Portal, chống dò mật khẩu Brute-force, cấp phát và thu hồi phiên JWT an toàn, quản trị tác vụ tài khoản cá nhân, cùng ma trận phân quyền Role-Based Access Control (RBAC) 3 cấp độ bảo vệ toàn bộ tài nguyên API và giao diện.

## Bản đồ
| Nhóm | Trang |
|---|---|
| Thực thể | [Phiên đăng nhập & RBAC](../entities/auth-session.md) |
| Khái niệm | [Cơ chế cô lập đa trường học](../concepts/multi-tenancy-isolation.md) |
| Luồng | [Đăng nhập đa trường](../flows/fl-dang-nhap-da-truong.md) |
| Màn hình | [Đăng nhập](../screens/m7-sm2-dang-nhap.md), [Tài khoản cá nhân & Thông báo](../screens/m7-sm1-khac.md) |

## Liên quan
- [Tổng quan dự án](project-overview.md)
- [Cơ chế cô lập đa trường học](../concepts/multi-tenancy-isolation.md)
- [Phân hệ Cấu hình](module-settings.md)
