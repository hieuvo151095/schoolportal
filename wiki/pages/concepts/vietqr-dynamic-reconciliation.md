---
title: Kiến Trúc Thanh Toán VietQR Động & Đối Soát Tự Động
type: concept
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - pages/sources/src-open-questions-resolutions.md
  - repo:docs/guides/development/E-009-finance-invoices/epic.md
  - repo:docs/guides/development/E-013-finance-reconciliation/epic.md
spec_ids:
  - TC-01
  - TC-06
updated: 2026-11-05
---

# Kiến Trúc Thanh Toán VietQR Động & Đối Soát Tự Động

## Định nghĩa
Kiến trúc tích hợp thanh toán không tiền mặt theo tiêu chuẩn VietQR chuẩn quốc gia (NAPAS 247), tự động sinh mã QR động kèm số tiền chính xác và cú pháp chuyển khoản định danh hóa đơn, kết hợp webhook đồng bộ biến động số dư để khớp lệnh tức thì và kiểm soát toàn diện các giao dịch bất thường thừa, thiếu hoặc tra soát.

## Quy tắc
1. **Sinh VietQR động:**
   - Mỗi hóa đơn học phí có một chuỗi nội dung chuyển khoản duy nhất (Payload): `ECO <Mã trường> <Mã hóa đơn>`.
   - Mã QR nhúng sẵn số tài khoản ngân hàng của trường, số tiền phải thanh toán sau khi trừ miễn giảm và hoàn tiền ăn.
2. **Khớp lệnh thời gian thực (Real-time Webhook):**
   - Cổng ngân hàng hoặc dịch vụ đối soát (Sepay/NAPAS) bắn webhook khi nhận tiền.
   - Hệ thống quét cú pháp, kiểm tra số tiền: nếu số tiền khớp 100%, tự động chuyển hóa đơn sang `PAID` và gửi thông báo cho phụ huynh.
3. **Chốt chặn Race Condition khi Hủy/Chỉnh sửa hóa đơn (OQ-09):**
   - *Khóa bi quan bắt buộc:* Cả webhook xử lý thanh toán và API hủy/chỉnh sửa hóa đơn của kế toán đều phải thực thi bên trong transaction với `SELECT ... FROM tuition_invoices WHERE id = ... FOR UPDATE`.
   - *Vô hiệu hóa QR tức thì:* Khi kế toán bắt đầu chỉnh sửa hoặc hủy hóa đơn, mã QR payload lập tức bị vô hiệu hóa trong Redis cache (`qr_active = false`).
   - *Bảo vệ giao dịch treo (`UNMATCHED_SUSPENSE_POOL`):* Nếu phụ huynh quét mã chuyển khoản đúng thời điểm kế toán vừa bấm hủy hóa đơn thành công (webhook đến khi hóa đơn đã `cancelled`), hệ thống gom tiền vào Quỹ treo chờ xử lý (`UNMATCHED_SUSPENSE_POOL`) với nút xử lý 1-chạm kết chuyển sang Credit Balance hoặc hoàn tiền.
4. **Đối soát định kỳ:**
   - Hằng ngày hoặc hằng tuần, kế toán tải sổ phụ ngân hàng (file Excel) để chạy công cụ đối soát lô (Batch Reconciliation) nhằm phát hiện các giao dịch bị sai cú pháp hoặc lỗi mạng.
5. **Xử lý giao dịch VietQR bất thường — Thừa, Thiếu & Tra soát ngân hàng (OQ-18):**
   - *Chuyển tiền thừa / Chuyển 2 lần:* Khi số tiền nhận lớn hơn số tiền hóa đơn ($\text{Amount}_{\text{transfer}} > \text{Amount}_{\text{due}}$), hệ thống tự động gạch nợ `PAID` hóa đơn, toàn bộ phần tiền thừa được tự động kết chuyển thành `credit_balance` của học sinh. Tại màn hình Đối soát (`m4-sm2-doi-soat`) hiển thị cờ `OVERPAID` kèm nút "Tạo phiếu chi hoàn tiền thừa" để chuyển khoản trả lại phụ huynh nếu có yêu cầu.
   - *Chuyển tiền thiếu (Underpayment):* Khi số tiền nhận nhỏ hơn số tiền hóa đơn, hệ thống chuyển hóa đơn sang trạng thái `PARTIAL_PAID`, ghi nhận `paid_amount`, tính số nợ còn thiếu `remaining_amount`, và **tự động sinh lại mã VietQR động mới** với payload số tiền đúng bằng `remaining_amount` để phụ huynh quét mã trả nốt.
   - *Cơ chế đóng băng chờ tra soát & Ngăn xuất hóa đơn VAT (Chargeback Dispute & Frozen State):* Khi có yêu cầu tra soát (Chargeback) hoặc cảnh báo nghi vấn gian lận từ ngân hàng, giao dịch và hóa đơn lập tức chuyển sang trạng thái `FROZEN_UNDER_REVIEW`. Khóa cứng toàn diện: **Cấm tuyệt đối xuất Hóa đơn điện tử VAT**, cấm kết chuyển doanh thu và cấm rút `credit_balance` cho đến khi ngân hàng có kết luận phân xử chính thức.

## Áp dụng ở đâu
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Hóa đơn học phí](../entities/tuition-invoice.md)
- [Phiên đối soát giao dịch](../entities/reconciliation-session.md)
- [Phiếu chi nội bộ](../entities/expense-voucher.md)
- [Màn hình hóa đơn học phí](../screens/m4-sm1-hoc-phi.md)
- [Màn hình đối soát](../screens/m4-sm2-doi-soat.md)
- [Màn hình lịch sử thanh toán](../screens/m6-sm7-lich-su-thanh-toan.md)
- [Luồng lập và phát hành hóa đơn](../flows/fl-lap-phat-hanh-hoa-don.md)
- [Luồng đối soát giao dịch](../flows/fl-doi-soat-giao-dich.md)

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-01 | Lập hóa đơn học phí tháng cho học sinh tích hợp mã VietQR động chuyển khoản chính xác | Component hiển thị mã VietQR động trên modal chi tiết hóa đơn | MISSING | repo:app/src/types/invoice.ts:1 |
| TC-06 | Đối soát giao dịch thanh toán tự động và thủ công với sổ phụ ngân hàng | Redux slice quản lý phiên đối soát và khớp lệnh | MISSING | repo:app/src/store/slices/reconciliationSlice.ts:1 |

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Thực thể Hóa đơn học phí](../entities/tuition-invoice.md)
- [Thực thể Phiên đối soát giao dịch](../entities/reconciliation-session.md)
- [Thực thể Phiếu chi nội bộ](../entities/expense-voucher.md)
- [Luồng lập và phát hành hóa đơn](../flows/fl-lap-phat-hanh-hoa-don.md)
- [Luồng đối soát giao dịch](../flows/fl-doi-soat-giao-dich.md)
- [Màn hình hóa đơn học phí](../screens/m4-sm1-hoc-phi.md)
- [Màn hình đối soát](../screens/m4-sm2-doi-soat.md)
- [Màn hình lịch sử thanh toán](../screens/m6-sm7-lich-su-thanh-toan.md)
