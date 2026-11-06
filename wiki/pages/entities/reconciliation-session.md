---
title: Thực Thể Phiên Đối Soát Giao Dịch
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - pages/sources/src-open-questions-resolutions.md
  - repo:docs/guides/development/E-013-finance-reconciliation/epic.md
spec_ids:
  - TC-06
updated: 2026-11-05
---

# Thực Thể Phiên Đối Soát Giao Dịch

## Định nghĩa
Đại diện cho đợt kiểm tra, so sánh và khớp lệnh giữa dữ liệu dòng tiền thanh toán thực tế ghi nhận qua cổng thanh toán / tài khoản ngân hàng (VietQR / chuyển khoản) với các hóa đơn học phí tương ứng trong hệ thống, bao gồm xử lý các giao dịch bất thường chuyển thừa, chuyển thiếu và tra soát ngân hàng.

## Thuộc tính & Quy tắc nghiệp vụ
- **Thông tin phiên:** Mã phiên đối soát (`session_id`), Khoảng thời gian đối soát (`from_date` đến `to_date`), Tổng số tiền ngân hàng ghi nhận, Tổng số tiền hóa đơn khớp lệnh, Chênh lệch.
- **Trạng thái dòng giao dịch:** Khớp hoàn toàn (`MATCHED`), Chưa tìm thấy hóa đơn (`UNMATCHED`), Thừa tiền (`OVERPAID`), Thiếu tiền (`PARTIAL_PAID`), Đóng băng chờ tra soát (`FROZEN_UNDER_REVIEW`), Giao dịch nghi vấn / lỗi (`DISCREPANCY`).
- **Giao dịch bất thường & Đóng băng tra soát (OQ-18):**
  - Giao dịch `OVERPAID`: Cung cấp nút kết chuyển sang Credit Balance của học sinh hoặc "Tạo phiếu chi hoàn tiền thừa".
  - Giao dịch `PARTIAL_PAID`: Tự động sinh lại mã VietQR động mới cho số tiền còn thiếu `remaining_amount`.
  - Giao dịch `FROZEN_UNDER_REVIEW`: Khóa cứng không xuất hóa đơn điện tử VAT, chặn kết chuyển doanh thu cho đến khi có phán quyết phân xử từ ngân hàng.
- **Cơ chế khóa sổ:** Khi phiên đối soát được kế toán trưởng phê duyệt và xác nhận "Hoàn thành", toàn bộ các giao dịch trong phiên sẽ bị khóa không thể điều chỉnh.

## Quan hệ
- Liên kết với nhiều [Hóa đơn học phí](tuition-invoice.md).
- Liên kết với [Phiếu chi nội bộ](expense-voucher.md) khi lập phiếu hoàn tiền thừa.
- Tác động tới số dư thu học phí thực tế tại [Phân hệ Tài chính](../overview/module-finance.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-06 | Đối soát giao dịch thanh toán tự động và thủ công với sổ phụ ngân hàng | Type `ReconciliationSession`, chi tiết phiên và Redux slice | MISSING | repo:app/src/types/reconciliation.ts:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-09, OQ-18).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Màn hình đối soát](../screens/m4-sm2-doi-soat.md)
- [Khái niệm Kiến trúc VietQR và đối soát](../concepts/vietqr-dynamic-reconciliation.md)
- [Thực thể Phiếu chi nội bộ](expense-voucher.md)
- [Luồng đối soát giao dịch](../flows/fl-doi-soat-giao-dich.md)
