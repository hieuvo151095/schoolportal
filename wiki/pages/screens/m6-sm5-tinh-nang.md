---
title: Màn Hình Bật Tắt Tính Năng
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - CH-05
apps:
  - web
route_ids:
  - /{schoolCode}/settings/features
status: missing
updated: 2026-11-05
---

# Màn Hình Bật Tắt Tính Năng

## Mục đích
Quản lý bật/tắt các phân hệ và tính năng (Feature Flags) linh hoạt theo từng trường học và gói bản quyền.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/settings/features` | repo:app/src/pages/[schoolCode]/settings/features.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-05 | Quản lý bật/tắt các phân hệ và tính năng (Feature Flags) theo gói bản quyền phần mềm | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-05 | Quản lý bật/tắt các phân hệ và tính năng (Feature Flags) theo gói bản quyền phần mềm | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/settings/features.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-settings.md)
- [Khái niệm liên quan](../concepts/multi-tenancy-isolation.md)
