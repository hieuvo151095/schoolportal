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
  - /{schoolCode}/settings/accounts
status: missing
updated: 2026-11-05
---

# Màn Hình Quản Trị Tài Khoản

## Mục đích
Cấp phát tài khoản người dùng, phân quyền nhóm quản trị và khóa/mở khóa tài khoản.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/settings/accounts` | repo:app/src/pages/[schoolCode]/settings/accounts.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-02 | Quản trị tài khoản người dùng, cấp quyền quản trị và quản lý trạng thái tài khoản | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-02 | Quản trị tài khoản người dùng, cấp quyền quản trị và quản lý trạng thái tài khoản | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/settings/accounts.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-settings.md)
- [Thực thể liên quan](../entities/auth-session.md)
