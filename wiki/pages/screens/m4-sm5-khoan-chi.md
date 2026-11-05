---
title: "Quản lý Phiếu chi Nội bộ (Expenses)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Quản lý Phiếu chi Nội bộ (Expenses) (`M4/SM5`)

## Mục đích

Lập, trình duyệt và theo dõi các phiếu chi tiêu nội bộ của trường học kèm chứng từ đính kèm và quy trình hủy phiếu chi an toàn.

Thuộc phân hệ **[Tài chính](../overview/module-m4-tai-chinh.md)**. Mã định danh tính năng Harness Loop: **`F016`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/expenses`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/expense.ts`
  - `docs/src/utils/expenseValidation.ts`
  - `docs/tests/unit/expense.test.mjs`

## Yêu cầu spec

- **SPEC-F016-01**: Lập phiếu chi phân loại danh mục, người nhận tiền, số tiền và tệp chứng từ đính kèm.
- **SPEC-F016-02**: Quy trình duyệt phiếu chi nhiều bước và hủy phiếu chi có ghi nhận lý do bắt buộc.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F016-01` | Lập phiếu chi phân loại danh mục, người nhận tiền, số tiền v... | `OK` | repo:app/tests/unit/expenses.test.mjs:1 | Đã kiểm chứng 10/10 unit tests |
| `SPEC-F016-02` | Quy trình duyệt phiếu chi nhiều bước và hủy phiếu chi có ghi... | `OK` | repo:app/tests/unit/expenses.test.mjs:1 | Đã kiểm chứng 10/10 unit tests |

## Liên quan

- Phân hệ cha: [Tài chính](../overview/module-m4-tai-chinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
