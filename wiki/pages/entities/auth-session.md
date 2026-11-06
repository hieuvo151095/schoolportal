---
title: Phiên Đăng Nhập & Phân Quyền (Auth Session & RBAC)
type: entity
sources:
  - pages/sources/src-tech-architecture-blueprint.md
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - DN-01
  - DN-02
updated: 2026-11-05
---

# Phiên Đăng Nhập & Phân Quyền (Auth Session & RBAC)

## Định nghĩa
Thực thể Phiên đăng nhập & Phân quyền quản lý danh tính xác thực của người dùng, cặp khóa JWT (Access Token & Refresh Token) và ma trận phân quyền truy cập Role-Based Access Control (RBAC) theo ngữ cảnh trường học `{schoolCode}`.

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| DN-01 | Đăng nhập hợp lệ theo mã trường `{schoolCode}`, tên đăng nhập/email và mật khẩu mã hóa Argon2id/Bcrypt | Cấp Access Token ngắn hạn và Refresh Token trong HttpOnly Cookie |
| DN-02 | Mô hình phân quyền RBAC 3 cấp độ: Module $\rightarrow$ Resource:Action (ví dụ: `finance:invoice:approve`) $\rightarrow$ Data Scope (Toàn trường, Khối, Lớp hoặc Cá nhân) | Chặn truy cập trái phép ở cả Gateway và Backend Controller |
| DN-01 | Phân vùng session đa tab (OQ-13): Quản lý token theo namespace `eco_token_{schoolCode}` độc lập trên từng tab trình duyệt | Ngăn ngừa xung đột token khi giáo viên mở cùng lúc 2 trường |
| DN-01 | Dọn dẹp Redux Store (OQ-13): Kích hoạt `RESET_TENANT_STATE` xóa sạch dữ liệu cũ khi người dùng chuyển context trường | Chống rò rỉ dữ liệu "bóng ma" giữa các trường |
| DN-01 | Thu hồi phiên đăng nhập tức thì (Token Revocation List) khi tài khoản bị khóa hoặc người dùng đăng xuất | Lưu blacklist vào Redis với TTL khớp hạn token |

## Quan hệ
- Gắn với tài khoản người dùng của [Giáo viên & Nhân viên](teacher-staff.md) hoặc Quản trị viên.
- Ràng buộc theo [Cơ chế cô lập đa trường học](../concepts/multi-tenancy-isolation.md).
- Thao tác tại [Màn hình đăng nhập](../screens/m7-sm2-dang-nhap.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| DN-01 | Đăng nhập hệ thống theo tiền tố mã trường `{schoolCode}` và cấp cặp JWT Access/Refresh Token | Cơ chế phân vùng session đa tab theo namespace `eco_session_{schoolCode}` và `eco_token_{schoolCode}` | OK | repo:app/src/utils/authSession.ts:16 |
| DN-02 | Phân quyền kiểm soát truy cập theo mô hình Role-Based Access Control (RBAC) 3 cấp | Chưa có middleware kiểm tra scope RBAC ở backend | MISSING | repo:app/src/utils/authSession.ts |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-01).

## Liên quan
- [Phân hệ Đăng nhập](../overview/module-auth.md)
- [Cơ chế cô lập đa trường học](../concepts/multi-tenancy-isolation.md)
- [Màn hình đăng nhập](../screens/m7-sm2-dang-nhap.md)
- [Luồng đăng nhập đa trường](../flows/fl-dang-nhap-da-truong.md)
