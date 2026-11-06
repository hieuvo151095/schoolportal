---
title: Màn Hình Cấu Hình Tham Số Học Phí
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - CH-03
  - CH-10
apps:
  - web
route_ids:
  - /{schoolCode}/settings/fee-configuration
status: missing
updated: 2026-11-05
---

# Màn Hình Cấu Hình Tham Số Học Phí

## Mục đích
Thiết lập các tham số tính học phí, tỷ lệ hoàn tiền ăn bán trú và hạn chốt báo vắng hằng ngày.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/settings/fee-configuration` | repo:app/src/pages/[schoolCode]/settings/fee-configuration.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-03 | Thiết lập tham số tính học phí, tỷ lệ hoàn tiền ăn và hạn chốt báo vắng hằng ngày | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-03 | Thiết lập tham số tính học phí, tỷ lệ hoàn tiền ăn và hạn chốt báo vắng hằng ngày | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/settings/fee-configuration.tsx |
| CH-10 | Quy chuẩn bảo mật hóa đơn điện tử SInvoice: mật khẩu bắt buộc ẩn vĩnh viễn không có toggle hiển thị | Cấu hình UI tĩnh, chưa có API cấu hình bảo mật backend | MISSING | repo:app/src/pages/[schoolCode]/settings/fee-configuration.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-settings.md)
- [Khái niệm liên quan](../concepts/meal-refund-engine.md)
- [Thực thể liên quan](../entities/tuition-invoice.md)
