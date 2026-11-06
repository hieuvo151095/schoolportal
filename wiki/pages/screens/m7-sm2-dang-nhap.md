---
title: Màn Hình Đăng Nhập Hệ Thống
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-prd-dang-nhap-xac-thuc.md
spec_ids:
  - DN-01
  - DN-02
  - DN-03
  - DN-04
  - DN-05
  - DN-06
apps:
  - web
route_ids:
  - /{schoolCode}/login
  - /signin
  - /sso/login
status: missing
updated: 2026-11-05
---

# Màn Hình Đăng Nhập Hệ Thống

## Mục đích
Cổng xác thực danh tính người dùng theo trường học cụ thể (`{schoolCode}`), hỗ trợ đăng nhập mật khẩu truyền thống và đăng nhập một lần (SSO - Single Sign-On), cấp phiên làm việc JWT và phân quyền giao diện; thực thi cô lập phiên đa tab (`eco_token_{schoolCode}`), phân kênh WebSocket theo tenant và dọn dẹp Redux Store qua `RESET_TENANT_STATE` khi chuyển trường.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/login` | repo:app/src/pages/signin.tsx |
| web | `/signin` | repo:app/src/pages/signin.tsx |
| web | `/sso/login` | repo:app/src/pages/sso/login.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| DN-01 | Đăng nhập hệ thống theo tiền tố mã trường `{schoolCode}` và cấp cặp JWT Access/Refresh Token | OK |
| DN-02 | Phân quyền kiểm soát truy cập theo mô hình Role-Based Access Control (RBAC) 3 cấp | MISSING |
| DN-03 | Xác thực đăng nhập một lần SSO (Single Sign-On) tích hợp với hệ thống Managing Portal | MISSING |
| DN-04 | Cơ chế khóa tạm thời tài khoản chống tấn công dò mật khẩu sau 5 lần thử thất bại | MISSING |
| DN-05 | Kiểm soát vòng đời phiên làm việc và tự động làm mới JWT Access/Refresh Token | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| DN-01 | Đăng nhập hệ thống theo tiền tố mã trường `{schoolCode}` và cấp cặp JWT Access/Refresh Token | Phân vùng session đa tab theo namespace `eco_session_{schoolCode}` và `eco_token_{schoolCode}` | OK | repo:app/src/utils/authSession.ts:16 |
| DN-02 | Phân quyền kiểm soát truy cập theo mô hình Role-Based Access Control (RBAC) 3 cấp | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/signin.tsx:1 |
| DN-03 | Xác thực đăng nhập một lần SSO (Single Sign-On) tích hợp với hệ thống Managing Portal | Trang mock SSO tiếp nhận token qua URL query nhưng chưa liên thông auth backend | MISSING | repo:app/src/pages/sso/login.tsx:1 |
| DN-04 | Cơ chế khóa tạm thời tài khoản chống tấn công dò mật khẩu sau 5 lần thử thất bại | Xử lý client validation cơ bản, chưa có rate-limiting backend | MISSING | repo:app/src/utils/authValidation.ts:1 |
| DN-05 | Kiểm soát vòng đời phiên làm việc và tự động làm mới JWT Access/Refresh Token | Mock session helper, chưa có middleware silent refresh | MISSING | repo:app/src/utils/authSession.ts:1 |
| DN-06 | Thu hồi phiên làm việc từ xa và đăng xuất an toàn trên toàn bộ thiết bị đang hoạt động | Mock session helper, chưa có API thu hồi token từ xa | MISSING | repo:app/src/utils/authSession.ts:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ Đăng nhập & Xác thực](../overview/module-auth.md)
- [Thực thể Phiên đăng nhập](../entities/auth-session.md)
- [Khái niệm Cô lập đa trường học](../concepts/multi-tenancy-isolation.md)
- [Luồng đăng nhập đa trường](../flows/fl-dang-nhap-da-truong.md)
- [Màn hình quản trị tài khoản cá nhân](../screens/m7-sm1-khac.md)
