---
title: Luồng Lập, Đính Kèm Chứng Từ & Phê Duyệt Phiếu Chi
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - pages/sources/src-open-questions-resolutions.md
  - repo:docs/guides/development/E-012-finance-expenses/epic.md
spec_ids:
  - TC-05
updated: 2026-11-05
---

# Luồng Lập, Đính Kèm Chứng Từ & Phê Duyệt Phiếu Chi

## Mục tiêu
Quản lý chặt chẽ các khoản chi tiêu vận hành nhà trường (mua sắm văn phòng phẩm, hoàn tiền thừa học phí, sửa chữa cơ sở vật chất, hoạt động dã ngoại), đồng thời quản lý giải ngân Phiếu chi hoàn tiền rút hồ sơ (`STUDENT_WITHDRAWAL_REFUND` - OQ-17) và Phiếu chi hoàn tiền thừa VietQR (`VIETQR_EXCESS_REFUND` - OQ-18), đảm bảo có hóa đơn chứng từ hợp lệ và được Ban Giám Hiệu phê duyệt trước khi xuất quỹ.

## Các bước
| Bước | Vai trò | Ứng dụng | Hành động | Kết quả mong đợi |
|---|---|---|---|---|
| 1 | Nhân viên / Kế toán | Web Admin | Truy cập màn hình Khoản chi và nhấn "Tạo phiếu chi mới" (hoặc sinh tự động từ Quyết toán rút hồ sơ / Đối soát chuyển thừa) | Mở form nhập chứng từ chi |
| 2 | Người tạo | Web Admin | Điền người nhận tiền, phân loại mục chi (chi vận hành, `STUDENT_WITHDRAWAL_REFUND`, `VIETQR_EXCESS_REFUND`), số tiền, ngày chi và tải ảnh/PDF hóa đơn chứng từ | Form được xác thực hợp lệ |
| 3 | Người tạo | Web Admin | Nhấn "Trình duyệt phiếu chi" | Trạng thái chuyển thành `PENDING_APPROVAL` |
| 4 | Hiệu trưởng / Kế toán trưởng | Web Admin | Kiểm tra nội dung chứng từ, quy tắc Pro-rata hoặc giao dịch Overpaid, chọn "Phê duyệt" hoặc "Từ chối" kèm lý do | Cập nhật trạng thái phiếu chi |
| 5 | Thủ quỹ / Kế toán | Web Admin | Thực hiện xuất quỹ tiền mặt hoặc ủy nhiệm chi, nhấn "Hoàn thành chi" | Phiếu chi chuyển sang `COMPLETED`, trừ quỹ tương ứng |

## Quy tắc chặn / validation
- Bắt buộc phải tải lên ít nhất một chứng từ đính kèm (ảnh hóa đơn, biên nhận) đối với các khoản chi có giá trị từ 500.000 đ trở lên.
- Không thể hủy hoặc xóa phiếu chi đã ở trạng thái `COMPLETED` (chỉ được tạo phiếu thu hoàn ứng để điều chỉnh sổ sách kế toán).
- **Phiếu chi hoàn tiền rút hồ sơ (`STUDENT_WITHDRAWAL_REFUND` - OQ-17):** Bắt buộc liên kết với Biên bản thanh lý Pro-rata và hồ sơ lưu trữ học sinh, duyệt chi 2 cấp trước khi giải ngân.
- **Phiếu chi hoàn tiền thừa VietQR (`VIETQR_EXCESS_REFUND` - OQ-18):** Bắt buộc đối chiếu với giao dịch `OVERPAID` trên phiên đối soát ngân hàng.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-05 | Lập, trình duyệt và theo dõi vòng đời phiếu chi nội bộ kèm chứng từ đính kèm | Giao diện tạo phiếu chi, tải ảnh chứng từ và Redux slice | MISSING | repo:app/src/pages/[schoolCode]/school/expenses/create/index.tsx:1 |

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Thực thể Phiếu chi nội bộ](../entities/expense-voucher.md)
- [Khái niệm Vòng đời học sinh](../concepts/student-lifecycle-transitions.md)
- [Khái niệm Kiến trúc VietQR và đối soát](../concepts/vietqr-dynamic-reconciliation.md)
- [Thực thể Hồ sơ lưu trữ học sinh](../entities/student-archive-record.md)
- [Màn hình khoản chi](../screens/m4-sm5-khoan-chi.md)
