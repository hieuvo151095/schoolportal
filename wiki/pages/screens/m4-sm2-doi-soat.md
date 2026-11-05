---
title: "Đối soát Giao dịch Ngân hàng & Cổng Thanh toán"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Đối soát Giao dịch Ngân hàng & Cổng Thanh toán (`M4/SM2`)

## Mục đích

Đối chiếu phiên giao dịch thanh toán từ tài khoản ngân hàng / Sepay / VietQR với hóa đơn thực thu của trường học, làm nổi bật giao dịch khớp và giao dịch lệch số liệu.

Thuộc phân hệ **[Tài chính](../overview/module-m4-tai-chinh.md)**. Mã định danh tính năng Harness Loop: **`F017`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/reconciliation`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/reconciliation.ts`
  - `docs/src/utils/reconciliationValidation.ts`
  - `docs/tests/unit/reconciliation.test.mjs`

## Yêu cầu spec

- **SPEC-F017-01**: Danh sách phiên đối soát theo ngày và cổng thanh toán.
- **SPEC-F017-02**: Tự động làm nổi bật các giao dịch khớp lệnh và cảnh báo chênh lệch số tiền / thừa thiếu.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F017-01` | Danh sách phiên đối soát theo ngày và cổng thanh toán.... | `OK` | repo:app/tests/unit/reconciliation.test.mjs:1 | Đã kiểm chứng 10/10 unit tests |
| `SPEC-F017-02` | Tự động làm nổi bật các giao dịch khớp lệnh và cảnh báo chên... | `OK` | repo:app/tests/unit/reconciliation.test.mjs:1 | Đã kiểm chứng 10/10 unit tests |

## Liên quan

- Phân hệ cha: [Tài chính](../overview/module-m4-tai-chinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
