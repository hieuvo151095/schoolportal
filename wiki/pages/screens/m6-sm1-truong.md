---
title: Màn Hình Cấu Hình Trường Học
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - CH-01
apps:
  - web
route_ids:
  - /{schoolCode}/settings/school-profile
status: missing
updated: 2026-11-05
---

# Màn Hình Cấu Hình Trường Học

## Mục đích
Cập nhật thông tin pháp lý nhà trường, địa chỉ, hotline, logo thương hiệu và niên khóa mặc định.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/settings/school-profile` | repo:app/src/pages/[schoolCode]/settings/school-profile.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-01 | Cấu hình thông tin pháp lý nhà trường, biểu tượng thương hiệu và niên khóa mặc định | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-01 | Cấu hình thông tin pháp lý nhà trường, biểu tượng thương hiệu và niên khóa mặc định | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/settings/school-profile.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-settings.md)
- [Khái niệm liên quan](../concepts/multi-tenancy-isolation.md)
