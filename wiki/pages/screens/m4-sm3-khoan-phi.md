---
title: "Danh mục Khoản phí Master (24 khoản thu)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Danh mục Khoản phí Master (24 khoản thu) (`M4/SM3`)

## Mục đích

Master catalog quản lý toàn bộ 24 khoản thu của trường (3 khoản hệ thống + 21 khoản tùy chỉnh), thiết lập đơn giá chuẩn, đơn vị tính (tháng, kỳ, ngày, lần) và cờ Bắt buộc/Tự chọn.

Thuộc phân hệ **[Tài chính](../overview/module-m4-tai-chinh.md)**. Mã định danh tính năng Harness Loop: **`F011`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/school-fees`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/schoolFee.ts`
  - `docs/src/utils/schoolFeeValidation.ts`
  - `docs/tests/unit/schoolFees.test.mjs`

## Yêu cầu spec

- **SPEC-F011-01**: Danh mục 24 khoản phí với đơn vị tính chuẩn (khoản hoàn tiền bắt buộc đơn vị là 'ngày').
- **SPEC-F011-02**: Cấu hình cờ bắt buộc hoặc tự chọn, kỳ thu và chính sách thuế VAT.
- **SPEC-F011-03**: Định dạng tiền tệ chuẩn Việt Nam có dấu chấm phân cách hàng nghìn.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F011-01` | Danh mục 24 khoản phí với đơn vị tính chuẩn (khoản hoàn tiền... | `OK` | repo:app/tests/unit/schoolFees.test.mjs:1 | Đã kiểm chứng 12/12 unit tests |
| `SPEC-F011-02` | Cấu hình cờ bắt buộc hoặc tự chọn, kỳ thu và chính sách thuế... | `OK` | repo:app/tests/unit/schoolFees.test.mjs:1 | Đã kiểm chứng 12/12 unit tests |
| `SPEC-F011-03` | Định dạng tiền tệ chuẩn Việt Nam có dấu chấm phân cách hàng ... | `OK` | repo:app/tests/unit/schoolFees.test.mjs:1 | Đã kiểm chứng 12/12 unit tests |

## Liên quan

- Phân hệ cha: [Tài chính](../overview/module-m4-tai-chinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
