---
title: "Cấu hình Hoàn tiền Nghỉ học & Cổng Thanh toán"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Cấu hình Hoàn tiền Nghỉ học & Cổng Thanh toán (`M6/SM3`)

## Mục đích

Thiết lập cơ chế hoàn tiền khi học sinh nghỉ học (tỷ lệ hoàn tiền ăn/xe theo ngày có phép vs không phép, giờ chốt Cut-off), cấu hình mã thanh toán VietQR động, Sepay và hóa đơn điện tử SInvoice.

Thuộc phân hệ **[Cấu hình](../overview/module-m6-cau-hinh.md)**. Mã định danh tính năng Harness Loop: **`F013`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/setting/fee`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/settingFee.ts`
  - `docs/src/utils/settingFeeValidation.ts`
  - `docs/utils/mealRefundCalculation.ts`
  - `docs/tests/unit/settingFee.test.mjs`

## Yêu cầu spec

- **SPEC-F013-01**: Khối thiết lập cơ chế hoàn tiền khi nghỉ học: tỷ lệ % hoàn riêng biệt cho Có phép và Không phép, giờ chốt Cut-off (07:30 sáng).
- **SPEC-F013-02**: Widget mô phỏng 3 cột tính toán phản hồi tức thì công thức hoàn tiền: (đơn giá x % x ngày vắng).
- **SPEC-F013-03**: Quy tắc thứ bậc chân lý thực tế: Điểm danh có mặt của giáo viên phủ quyết đơn xin nghỉ của phụ huynh.
- **SPEC-F013-04**: Cấu hình thông tin tài khoản ngân hàng thụ hưởng và cấu hình kết nối Sepay / SInvoice.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F013-01` | Khối thiết lập cơ chế hoàn tiền khi nghỉ học: tỷ lệ % hoàn r... | `OK` | repo:app/tests/unit/mealRefund.test.mjs:1 | Đã kiểm chứng 44/44 unit tests |
| `SPEC-F013-02` | Widget mô phỏng 3 cột tính toán phản hồi tức thì công thức h... | `OK` | repo:app/tests/unit/settingFee.test.mjs:1 | Đã kiểm chứng 44/44 unit tests |
| `SPEC-F013-03` | Quy tắc thứ bậc chân lý thực tế: Điểm danh có mặt của giáo v... | `OK` | repo:app/tests/unit/mealRefund.test.mjs:1 | Đã kiểm chứng 44/44 unit tests |
| `SPEC-F013-04` | Cấu hình thông tin tài khoản ngân hàng thụ hưởng và cấu hình... | `OK` | repo:app/tests/unit/settingFee.test.mjs:1 | Đã kiểm chứng 44/44 unit tests |

## Liên quan

- Phân hệ cha: [Cấu hình](../overview/module-m6-cau-hinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
