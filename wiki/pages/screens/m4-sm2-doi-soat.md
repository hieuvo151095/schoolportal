---
title: Màn Hình Đối Soát Thanh Toán
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-06
apps:
  - web
route_ids:
  - /{schoolCode}/finance/reconciliation
status: missing
updated: 2026-11-05
---

# Màn Hình Đối Soát Thanh Toán

## Mục đích
Đối soát tự động và thủ công giữa các giao dịch nộp học phí qua cổng thanh toán với sổ phụ ngân hàng; cảnh báo và xử lý Quỹ treo đối soát (`UNMATCHED_SUSPENSE_POOL`) đối với giao dịch trên hóa đơn đã hủy; xử lý giao dịch chuyển thừa `OVERPAID` (kết chuyển Credit Balance hoặc nút "Tạo phiếu chi hoàn tiền thừa"), chuyển thiếu `PARTIAL_PAID` (sinh lại VietQR nợ), và đóng băng tra soát `FROZEN_UNDER_REVIEW` cấm xuất hóa đơn điện tử VAT (OQ-18).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/finance/reconciliation` | repo:app/src/pages/[schoolCode]/finance/reconciliation.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| TC-06 | Đối soát giao dịch thanh toán tự động/thủ công và xử lý bất thường thừa/thiếu/tra soát (OQ-18) | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-06 | Đối soát giao dịch thanh toán tự động và thủ công với sổ phụ ngân hàng | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/finance/reconciliation.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-09, OQ-18).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Thực thể Hóa đơn học phí](../entities/tuition-invoice.md)
- [Thực thể Phiên đối soát giao dịch](../entities/reconciliation-session.md)
- [Thực thể Phiếu chi nội bộ](../entities/expense-voucher.md)
- [Khái niệm Kiến trúc VietQR động và đối soát](../concepts/vietqr-dynamic-reconciliation.md)
- [Luồng đối soát giao dịch](../flows/fl-doi-soat-giao-dich.md)
