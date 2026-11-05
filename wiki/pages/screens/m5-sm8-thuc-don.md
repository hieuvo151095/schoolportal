---
title: "Kế hoạch Thực đơn Tuần & Nguồn gốc Thực phẩm GTIN"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Kế hoạch Thực đơn Tuần & Nguồn gốc Thực phẩm GTIN (`M5/SM8`)

## Mục đích

Lập thực đơn dinh dưỡng bán trú tuần trước tối đa 8 tuần (dạng lưới hoặc file tải lên), tự động kế thừa thực đơn trường cho các lớp và truy xuất nguồn gốc thực phẩm theo mã GTIN/lô.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F025`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/menu`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/menu.ts`
  - `docs/src/utils/menuValidation.ts`
  - `docs/tests/unit/menu.test.mjs`

## Yêu cầu spec

- **SPEC-F025-01**: Lập thực đơn tuần linh hoạt theo từng bữa ăn (sáng, trưa, xế).
- **SPEC-F025-02**: Cơ chế tự động kế thừa thực đơn toàn trường cho các lớp chưa có thực đơn riêng.
- **SPEC-F025-03**: Hỗ trợ truy xuất nguồn gốc an toàn thực phẩm qua mã lô / mã vạch GTIN.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F025-01` | Lập thực đơn tuần linh hoạt theo từng bữa ăn (sáng, trưa, xế... | `MISSING` | repo:app/src/types/menu.ts:1 | Cần triển khai và verify |
| `SPEC-F025-02` | Cơ chế tự động kế thừa thực đơn toàn trường cho các lớp chưa... | `MISSING` | repo:app/src/types/menu.ts:1 | Cần triển khai và verify |
| `SPEC-F025-03` | Hỗ trợ truy xuất nguồn gốc an toàn thực phẩm qua mã lô / mã ... | `MISSING` | repo:app/src/types/menu.ts:1 | Cần triển khai và verify |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
