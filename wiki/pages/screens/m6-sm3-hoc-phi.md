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
  - /{schoolCode}/setting/fee
status: missing
updated: 2026-11-11
---

# Màn Hình Cấu Hình Tham Số Học Phí

## Mục đích
Thiết lập các tham số tính học phí, ghi chú chân phiếu báo, kết nối cổng thanh toán tự động Sepay/VietQR, tài khoản hóa đơn điện tử SInvoice, tỷ lệ hoàn tiền ăn bán trú và cơ chế tính phí trả trễ.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/setting/fee` | repo:app/src/pages/[schoolCode]/setting/fee/index.tsx |
| web | `/{schoolCode}/setting/fee/payment-history` | repo:app/src/pages/[schoolCode]/setting/fee/payment-history/index.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-03 | Thiết lập tham số tính học phí, tỷ lệ hoàn tiền ăn và hạn chốt báo vắng hằng ngày | MISSING |
| CH-10 | Quy chuẩn bảo mật hóa đơn điện tử SInvoice: mật khẩu bắt buộc ẩn vĩnh viễn không có toggle hiển thị | MISSING |

## Chuẩn hóa UI/UX Design System v2.6.0 & Hiến pháp
1. **Component Dropdown chuẩn**:
   - Thay thế thẻ select chọn block tính phí trả trễ bằng `<Dropdown>` chuẩn Design System (`placeholder="Chọn block tính phí"`).
2. **Bảo mật hóa đơn điện tử SInvoice (CH-10)**:
   - Mật khẩu tài khoản SInvoice được mã hóa và ẩn vĩnh viễn không hiển thị plain text.
3. **Nút thao tác và thẻ chỉ số**:
   - Sử dụng thẻ `<StatusTag>` cho trạng thái kết nối Sepay ("Đang kết nối") và các nút bấm theo biến token của Design System.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-03 | Thiết lập tham số tính học phí, tỷ lệ hoàn tiền ăn và hạn chốt báo vắng hằng ngày | Frontend hoàn chỉnh theo Design System v2.6.0, tích hợp Redux settingFeeSlice | MISSING | repo:app/src/modules/settings/fee/LatePickupAndRefundBlock.tsx:1 |
| CH-10 | Quy chuẩn bảo mật hóa đơn điện tử SInvoice: mật khẩu bắt buộc ẩn vĩnh viễn không có toggle hiển thị | Frontend hoàn chỉnh, tuân thủ trường mật khẩu bảo mật | MISSING | repo:app/src/pages/[schoolCode]/setting/fee/index.tsx:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-settings.md)
- [Khái niệm liên quan](../concepts/meal-refund-engine.md)
- [Thực thể liên quan](../entities/tuition-invoice.md)
