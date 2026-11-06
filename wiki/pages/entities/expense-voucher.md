---
title: Phiếu Chi Nội Bộ (Expense Voucher)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-05
updated: 2026-11-05
---

# Phiếu Chi Nội Bộ (Expense Voucher)

## Định nghĩa
Thực thể Phiếu chi nội bộ quản lý các khoản chi tiêu vận hành của nhà trường (mua sắm văn phòng phẩm, bảo trì cơ sở vật chất, thanh toán thực phẩm bán trú, chi phí hoạt động sự kiện), đồng thời quản lý các phiếu chi hoàn tiền thanh lý rút hồ sơ và hoàn tiền thừa chuyển khoản VietQR.

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| TC-05 | Lập phiếu chi kèm số tiền, danh mục khoản chi, người nhận tiền, chứng từ hóa đơn gốc đính kèm | Số tiền có dấu chấm phân cách hàng nghìn |
| TC-05 | Quy trình phê duyệt 3 bước: `draft` (Nháp) $\rightarrow$ `pending_approval` (Chờ duyệt) $\rightarrow$ `approved` (Đã duyệt chi) hoặc `rejected` (Từ chối) | Hiệu trưởng hoặc Kế toán trưởng duyệt |
| TC-05 | Quy trình hủy phiếu chi đã duyệt: Bắt buộc nhập lý do hủy chi tiết và ghi log kiểm toán không thể xóa | Bảo toàn chứng từ tài chính kế toán |
| TC-05 | Phiếu chi hoàn tiền rút hồ sơ giữa kỳ (`STUDENT_WITHDRAWAL_REFUND` - OQ-17): Tự động sinh từ Biên bản quyết toán Pro-rata, duyệt chi 2 cấp trước khi hoàn trả phụ huynh | Xem [Vòng đời chuyển tiếp học sinh](../concepts/student-lifecycle-transitions.md) |
| TC-05 | Phiếu chi hoàn tiền thừa VietQR (`VIETQR_EXCESS_REFUND` - OQ-18): Sinh từ màn hình đối soát khi phụ huynh chuyển thừa/chuyển 2 lần có yêu cầu rút lại tiền | Xem [Kiến trúc thanh toán VietQR động](../concepts/vietqr-dynamic-reconciliation.md) |

## Quan hệ
- Được tạo bởi Kế toán và phê duyệt bởi Ban Giám Hiệu.
- Ảnh hưởng đến số dư quỹ tiền mặt/ngân hàng trong [Phân hệ Tài chính](../overview/module-finance.md).
- Liên kết với [Hóa đơn học phí](tuition-invoice.md) và [Hồ sơ lưu trữ học sinh](student-archive-record.md).
- Hiển thị trên [Màn hình khoản chi](../screens/m4-sm5-khoan-chi.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-05 | Lập, trình duyệt và theo dõi vòng đời phiếu chi nội bộ kèm chứng từ đính kèm | Màn hình phiếu chi mới có danh sách mockup, chưa có luồng phê duyệt API | MISSING | repo:app/src/features/finance/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-17, OQ-18).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Khái niệm vòng đời học sinh](../concepts/student-lifecycle-transitions.md)
- [Kiến trúc thanh toán VietQR động](../concepts/vietqr-dynamic-reconciliation.md)
- [Màn hình khoản chi](../screens/m4-sm5-khoan-chi.md)
- [Hóa đơn học phí](tuition-invoice.md)
- [Hồ sơ lưu trữ học sinh](student-archive-record.md)
