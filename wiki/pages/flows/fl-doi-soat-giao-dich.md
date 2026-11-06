---
title: Luồng Đối Soát Giao Dịch & Khớp Lệnh Ngân Hàng
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - pages/sources/src-open-questions-resolutions.md
  - repo:docs/guides/development/E-013-finance-reconciliation/epic.md
spec_ids:
  - TC-06
updated: 2026-11-05
---

# Luồng Đối Soát Giao Dịch & Khớp Lệnh Ngân Hàng

## Mục tiêu
Đảm bảo tính chính xác 100% giữa số tiền học phí thực tế phụ huynh đã chuyển khoản qua ngân hàng với trạng thái công nợ của học sinh trên hệ thống, tự động phát hiện và cảnh báo sai lệch tài chính, xử lý các trường hợp chuyển thừa, thiếu và đóng băng tra soát ngân hàng.

## Các bước
| Bước | Vai trò | Ứng dụng | Hành động | Kết quả mong đợi |
|---|---|---|---|---|
| 1 | Kế toán trường | Web Admin | Truy cập màn hình Đối soát và nhấn "Tạo phiên đối soát mới" | Khởi tạo phiên với mã định danh duy nhất |
| 2 | Kế toán trường | Web Admin | Tải tệp sao kê ngân hàng (Excel/CSV) hoặc chọn kỳ đối soát tự động qua webhook | Hệ thống nạp danh sách giao dịch đầu vào |
| 3 | Hệ thống | Server Backend | Quét nội dung chuyển khoản theo cú pháp `ECO {schoolCode} {invoiceId}` và so sánh số tiền | Phân loại giao dịch: Khớp 100%, Thừa tiền (`OVERPAID`), Thiếu tiền (`PARTIAL_PAID`), Không tìm thấy hóa đơn, hoặc Giao dịch trên hóa đơn đã hủy (`SUSPENSE`) |
| 4 | Kế toán trường | Web Admin | Xử lý giao dịch bất thường (OQ-18): (a) Thừa tiền: Kết chuyển sang Credit Balance hoặc Lập phiếu chi hoàn tiền thừa; (b) Thiếu tiền: Kích hoạt sinh lại mã VietQR nợ; (c) Tra soát ngân hàng: Kích hoạt cờ `FROZEN_UNDER_REVIEW` | 100% giao dịch được xử lý minh bạch |
| 5 | Kế toán trường | Web Admin | Rà soát giao dịch nghi vấn và xử lý Quỹ treo (`UNMATCHED_SUSPENSE_POOL`): chọn Kết chuyển sang Credit Balance học sinh hoặc Lập phiếu chi hoàn tiền phụ huynh | Không thất thoát tiền |
| 6 | Kế toán trưởng | Web Admin | Nhấn "Xác nhận & Khóa sổ đối soát" | Đóng phiên đối soát, cập nhật hóa đơn sang `PAID` và khóa dữ liệu |

## Quy tắc chặn / validation
- Không được khóa phiên đối soát nếu vẫn còn giao dịch trạng thái `DISCREPANCY` (sai lệch), `FROZEN_UNDER_REVIEW` (đang tra soát), hoặc `SUSPENSE` (quỹ treo do hóa đơn đã hủy) chưa được xử lý (TC-06, OQ-18).
- **Chuyển tiền thừa (OQ-18):** Tự động gạch nợ `PAID` hóa đơn, số tiền dôi dư đưa vào `credit_balance` hoặc xuất phiếu chi hoàn tiền.
- **Chuyển tiền thiếu (OQ-18):** Chuyển sang `PARTIAL_PAID`, tự động sinh lại mã VietQR động mới với payload đúng bằng số tiền còn nợ để phụ huynh quét trả nốt.
- **Đóng băng tra soát ngân hàng (OQ-18):** Khi kích hoạt `FROZEN_UNDER_REVIEW`, khóa cứng cấm tuyệt đối xuất Hóa đơn điện tử VAT, cấm kết chuyển doanh thu và cấm rút Credit Balance liên quan cho đến khi ngân hàng có kết luận phân xử.
- Giao dịch thanh toán VietQR trên hóa đơn đã hủy tuyệt đối không được tự ý xóa hoặc bỏ qua mà bắt buộc phải giải tỏa qua ghi nhận Credit Balance hoặc chi hoàn (TC-06).
- Giao dịch đã nằm trong một phiên đã khóa sổ không được phép đưa vào phiên đối soát khác (TC-06).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-06 | Đối soát giao dịch thanh toán tự động và thủ công với sổ phụ ngân hàng | Giao diện bảng đối soát và chi tiết phiên mockup | MISSING | repo:app/src/pages/[schoolCode]/school/reconciliation/index.tsx:1 |

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Thực thể Phiên đối soát giao dịch](../entities/reconciliation-session.md)
- [Thực thể Hóa đơn học phí](../entities/tuition-invoice.md)
- [Thực thể Phiếu chi nội bộ](../entities/expense-voucher.md)
- [Khái niệm Kiến trúc VietQR và đối soát](../concepts/vietqr-dynamic-reconciliation.md)
- [Màn hình đối soát](../screens/m4-sm2-doi-soat.md)
