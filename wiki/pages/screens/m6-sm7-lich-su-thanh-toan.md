---
title: Màn Hình Lịch Sử Giao Dịch Sepay (M6-SM7)
type: screen
sources:
  - repo:docs/guides/planning/screens.md
  - repo:docs/guides/decisions.md
  - pages/sources/src-open-questions-resolutions.md
  - repo:app/src/pages/[schoolCode]/setting/fee/payment-history/index.tsx
updated: 2026-11-05
spec_ids:
  - TC-21
  - CH-09
route_ids:
  - /[schoolCode]/setting/fee/payment-history
status: implemented
---

# Màn Hình Lịch Sử Giao Dịch Sepay (M6-SM7)

## Mục đích
Màn hình cung cấp giao diện tra cứu, kiểm toán và giám sát toàn bộ các luồng giao dịch thanh toán học phí tự động phát sinh qua cổng thanh toán Sepay và webhook ngân hàng. Hỗ trợ kế toán trường học đối chiếu các khoản thu theo từng tháng, lọc trạng thái xử lý, xuất dữ liệu giao dịch, và hiển thị rõ ràng các giao dịch bất thường chuyển thừa (`OVERPAID`), chuyển thiếu (`PARTIAL_PAID`), và đóng băng chờ tra soát ngân hàng (`FROZEN_UNDER_REVIEW` - OQ-18).

## Route và components
- **Route:** `/[schoolCode]/setting/fee/payment-history`
- **File code:** `repo:app/src/pages/[schoolCode]/setting/fee/payment-history/index.tsx`
- **Thành phần giao diện:**
  - Nút quay lại cấu hình học phí (`faArrowLeft` -> `/[schoolCode]/setting/fee`).
  - Thanh công cụ lọc đa chiều:
    - Ô tìm kiếm linh hoạt theo Tên học sinh, Lớp học, Số hóa đơn, Mã giao dịch Sepay.
    - Bộ chọn tháng đối soát (`selectedMonth`, ví dụ: `2026-09`).
    - Bộ lọc trạng thái giao dịch (`all`, `success`, `pending`, `failed`, `overpaid`, `partial_paid`, `frozen_under_review`).
  - Bảng danh sách giao dịch 8 cột:
    - STT, Mã giao dịch (`transactionCode`), Số hóa đơn (`invoiceNumber`), Tên học sinh, Lớp, Số tiền thanh toán (`formatCurrencyVND`), Ngày giao dịch (`paymentDate`), Trạng thái (`StatusTag`: Thành công / Chờ xử lý / Thất bại / Chuyển thừa / Chuyển thiếu / Đóng băng tra soát).
  - Khối rỗng (Empty state) với biểu tượng `faReceipt` và thông báo rõ ràng khi không tìm thấy giao dịch nào trong tháng đã chọn.

## Yêu cầu spec
- **TC-21:** Toàn bộ lịch sử giao dịch cổng thanh toán Sepay phải được hiển thị dưới dạng bản ghi bất biến (append-only), lưu vết mã giao dịch duy nhất, thời gian thanh toán chính xác, số hóa đơn học phí liên kết, trạng thái xử lý webhook và cờ bất thường OQ-18.
- **CH-09:** Điều hướng trơn tru giữa trang cấu hình thông số học phí và trang lịch sử thanh toán mà không làm mất dirty state của các khối cấu hình đang nhập dở dang.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-21 | Tra cứu lịch sử thanh toán Sepay theo tháng và trạng thái | Đã dựng giao diện đầy đủ với bộ lọc Redux và selector | MISSING | — |
| CH-09 | Điều hướng an toàn từ cấu hình học phí | Có nút back về `/[schoolCode]/setting/fee` | MISSING | — |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-18).

## Liên quan
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Màn hình cấu hình học phí](m6-sm3-hoc-phi.md)
- [Màn hình học phí](m4-sm1-hoc-phi.md)
- [Thực thể hóa đơn học phí](../entities/tuition-invoice.md)
- [Kiến trúc thanh toán VietQR động](../concepts/vietqr-dynamic-reconciliation.md)
