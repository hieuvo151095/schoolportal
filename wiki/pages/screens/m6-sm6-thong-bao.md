---
title: Màn Hình Cấu Hình Thông Báo
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - CH-06
apps:
  - web
route_ids:
  - /{schoolCode}/settings/notifications
status: missing
updated: 2026-11-05
---

# Màn Hình Cấu Hình Thông Báo

## Mục đích
Thiết lập ma trận quy tắc gửi thông báo push và email cho phụ huynh, giáo viên và quản trị viên.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/settings/notifications` | repo:app/src/pages/[schoolCode]/settings/notifications.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-06 | Cấu hình ma trận quy tắc gửi thông báo push và email đa kênh theo sự kiện | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-06 | Cấu hình ma trận quy tắc gửi thông báo push và email đa kênh theo sự kiện | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/settings/notifications.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-settings.md)
- [Thực thể liên quan](../entities/teacher-staff.md)
