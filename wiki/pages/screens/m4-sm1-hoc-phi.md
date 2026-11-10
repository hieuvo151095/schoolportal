---
title: Màn Hình Hóa Đơn Học Phí
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-prd-co-che-hoan-tien.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-01
  - TC-02
  - TC-11
  - TC-12
  - TC-13
  - TC-14
  - TC-22
apps:
  - web
route_ids:
  - /{schoolCode}/school/fee
status: missing
updated: 2026-11-05
---

# Màn Hình Hóa Đơn Học Phí

## Mục đích
Quản lý vòng đời hóa đơn học phí, tích hợp VietQR động, áp dụng chính sách miễn giảm, hiển thị công nợ kỳ trước (Carried-over Debt), tự động cấn trừ số dư tín dụng (Credit Balance), khấu trừ hoàn tiền ăn nghỉ học có phép, hỗ trợ phân rã Sub-invoice lớp ngoại khóa (OQ-14), hủy hóa đơn tương lai khi học sinh rút hồ sơ (OQ-17), xử lý giao dịch chuyển thiếu (sinh lại mã VietQR nợ) hoặc đóng băng chờ tra soát `FROZEN_UNDER_REVIEW` ngăn xuất VAT (OQ-18), lập hóa đơn học phí lẻ ngày Prorated cho học sinh nhập học giữa tháng (OQ-22), tạo hóa đơn riêng lẻ độc lập cho từng học sinh với mã VietQR riêng biệt (không gộp gia đình - OQ-22), và liên thông dữ liệu an toàn với cơ chế tự động đóng băng sổ điểm danh cuối tháng (OQ-21).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/fee` | repo:app/src/pages/[schoolCode]/school/fee/index.tsx |

## Quy tắc xác nhận thanh toán thủ công (ADR-036)
- **Phương thức thanh toán duy nhất:** Khi kế toán hoặc quản trị viên chọn thao tác "Xác nhận thanh toán" (`ManualPaymentModal` / SlideOver) trên hóa đơn học phí, dropdown "Hình thức thanh toán" chỉ có đúng 1 lựa chọn là **Tiền mặt** (`tien_mat`).
- **Bảo toàn kênh thanh toán điện tử:** Các hình thức thanh toán điện tử (như QR ECOPay, Ví Finviet, chuyển khoản ngân hàng) được xử lý tự động thông qua webhook cổng thanh toán và đối soát (`Xác nhận tự động`), tuyệt đối không cho phép xác nhận thủ công từ người dùng để ngăn ngừa rủi ro sai lệch số dư và đối soát ngân hàng.
- **Lịch sử thanh toán bất biến (TC-22):** Mỗi lần xác nhận thanh toán tiền mặt thành công ghi thêm đúng 1 bản ghi mới vào lịch sử thanh toán (`paymentHistory`), tính toán lại công nợ còn lại và gửi thông báo thành công chuẩn Redux toast (`addToast`).

## Mẫu in hóa đơn chuẩn "PHIẾU BÁO THU TIỀN" & Cách ly in ấn (ADR-037)
- **Tiêu đề & Đầu phiếu:** Tiêu đề chuẩn hóa **PHIẾU BÁO THU TIỀN** kèm `Mã hóa đơn: {invoiceNo}` đặt ở vị trí trung tâm. Góc trái hiển thị Logo thương hiệu ECO (`EcoBrandLogo`), góc phải là mã VietQR thanh toán kèm dòng phụ đề *"Quét mã QR để thanh toán"*.
- **Thông tin học sinh & trường:** Danh sách thông tin cơ bản đặt bên trái: `Trường FINVIET`, `Địa chỉ: 34 Hoàng Việt, Phường Tân Sơn Nhất, TP.HCM`, `Tên học sinh`, `Mã học sinh`, `Lớp`, `Kỳ phí: MM/YYYY`.
- **Bảng chi tiết 7 cột:** Chuẩn hóa 7 cột kế toán giáo dục: `STT`, `Nội dung`, `ĐVT` (Tháng, Ngày, Bộ, Năm...), `Số tiền (VNĐ)`, `Số lượng`, `Khấu trừ / Miễn giảm`, `Thành tiền (VNĐ)`, kết thúc bằng dòng `Tổng cộng` in đậm gộp 6 cột đầu.
- **Khối Ghi chú:** Hướng dẫn mở App ngân hàng quét mã QR; lưu ý cài đặt ứng dụng **ECO Me** để miễn phí giao dịch và sử dụng tính năng **thanh toán học phí trả sau**; hotline hỗ trợ `1900 9005`.
- **Khối Chữ ký:** Ngày lập căn phải `Ngày ... tháng ... năm ...`, 3 cột chữ ký cân đối: `Kế toán`, `Thủ quỹ`, `Hiệu trưởng`.
- **Cách ly in ấn (@media print):** Khổ giấy `A4 portrait`, lề `8mm 12mm`. Ẩn toàn bộ AppHeader, Sidebar, breadcrumb, nút thao tác và khối đối soát web (`.screen-only`, `.no-print`), đảm bảo phiếu in ra vừa khít 01 trang giấy A4 mà không bị phân mảnh hay tràn layout.

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| TC-01 | Lập hóa đơn học phí tháng cho học sinh tích hợp mã VietQR động, Sub-invoice ngoại khóa OQ-14, xử lý thừa thiếu/tra soát OQ-18, hóa đơn lẻ ngày Prorated nhập học giữa tháng OQ-22 và quy định hóa đơn riêng lẻ độc lập cho từng học sinh (không gộp gia đình) | MISSING |
| TC-02 | Tự động rà soát ngày nghỉ có phép tháng M và khấu trừ tiền ăn vào hóa đơn tháng M+1 | MISSING |
| TC-11 | Thiết lập điều kiện học sinh nghỉ học có phép hợp lệ để được khấu trừ hoàn tiền ăn | MISSING |
| TC-12 | Công thức tính tiền ăn hoàn trả theo số bữa ăn thực tế và tỷ lệ khấu trừ cấu hình | MISSING |
| TC-13 | Chốt dữ liệu nghỉ học tháng M, lập bảng tổng hợp công nợ tiền ăn và phê duyệt | MISSING |
| TC-14 | Tự động kết chuyển suất hoàn tiền ăn thành dòng giảm trừ âm trên hóa đơn học phí tháng M+1 | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-01 | Lập hóa đơn học phí tháng cho học sinh tích hợp mã VietQR động chuyển khoản chính xác | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/fee/index.tsx:1 |
| TC-02 | Tự động rà soát ngày nghỉ có phép tháng M và khấu trừ tiền ăn vào hóa đơn tháng M+1 | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/fee/index.tsx:1 |
| TC-11 | Thiết lập điều kiện học sinh nghỉ học có phép hợp lệ để được khấu trừ hoàn tiền ăn | Hàm tính toán khấu trừ suất ăn mock | MISSING | repo:app/src/utils/mealRefundCalculation.ts:1 |
| TC-12 | Công thức tính tiền ăn hoàn trả theo số bữa ăn thực tế và tỷ lệ khấu trừ cấu hình | Mock service tính hoàn tiền ăn | MISSING | repo:app/src/services/mockMealRefundData.ts:1 |
| TC-13 | Chốt dữ liệu nghỉ học tháng M, lập bảng tổng hợp công nợ tiền ăn và phê duyệt | Redux slice quản lý state hóa đơn | MISSING | repo:app/src/store/slices/invoiceSlice.ts:1 |
| TC-14 | Tự động kết chuyển suất hoàn tiền ăn thành dòng giảm trừ âm trên hóa đơn học phí tháng M+1 | Validation dữ liệu hóa đơn | MISSING | repo:app/src/utils/invoiceValidation.ts:1 |
| TC-22 | Chốt chặn bảo toàn lịch sử thanh toán hóa đơn: cấm ghi đè lịch sử cũ khi có giao dịch thanh toán mới | State Redux chưa khóa lịch sử thanh toán bất biến | MISSING | repo:app/src/store/slices/invoiceSlice.ts:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-02, OQ-09, OQ-14, OQ-17, OQ-18, OQ-21, OQ-22).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Thực thể Hóa đơn học phí](../entities/tuition-invoice.md)
- [Thực thể Khấu trừ hoàn tiền ăn](../entities/meal-refund-credit.md)
- [Khái niệm Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md)
- [Khái niệm Kiến trúc VietQR và đối soát](../concepts/vietqr-dynamic-reconciliation.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Khái niệm vòng đời học sinh](../concepts/student-lifecycle-transitions.md)
- [Luồng lập và phát hành hóa đơn](../flows/fl-lap-phat-hanh-hoa-don.md)
- [Luồng báo vắng và hoàn tiền](../flows/fl-bao-vang-hoan-tien.md)
