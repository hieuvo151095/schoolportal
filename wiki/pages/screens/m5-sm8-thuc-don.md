---
title: Màn Hình Thực Đơn Tuần
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-09
apps:
  - web
route_ids:
  - /{schoolCode}/school/menu
status: missing
updated: 2026-11-05
---

# Màn Hình Thực Đơn Tuần

## Mục đích
Lập thực đơn dinh dưỡng chi tiết theo bữa (sáng, trưa, xế) và công bố tới phụ huynh.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/menu` | repo:app/src/pages/[schoolCode]/school/menu.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-09 | Lập và công bố thực đơn dinh dưỡng theo tuần bảo đảm an toàn vệ sinh thực phẩm | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-09 | Lập và công bố thực đơn dinh dưỡng theo tuần bảo đảm an toàn vệ sinh thực phẩm | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/menu.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-school-admin.md)
- [Thực thể liên quan](../entities/meal-refund-credit.md)
