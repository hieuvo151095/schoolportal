---
title: "Quản lý Biểu phí theo Lớp học (Tuition Management)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Quản lý Biểu phí theo Lớp học (Tuition Management) (`M4/SM4`)

## Mục đích

Gán gói các khoản thu và đơn giá tùy chỉnh từ Master Catalog cho từng lớp học hoặc khối lớp cụ thể trong năm học.

Thuộc phân hệ **[Tài chính](../overview/module-m4-tai-chinh.md)**. Mã định danh tính năng Harness Loop: **`F012`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/tuition-management`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/tuitionManagement.ts`
  - `docs/src/utils/tuitionManagementValidation.ts`
  - `docs/tests/unit/tuitionManagement.test.mjs`

## Yêu cầu spec

- **SPEC-F012-01**: Bảng quản lý tinh gọn 6 cột; cột 'Các khoản phí' hiển thị số lượng kèm modal chi tiết 3 cột: Tên khoản phí, Số tiền, Xuất HĐĐT.
- **SPEC-F012-02**: Ghi đè đơn giá khoản thu riêng biệt theo lớp mà không làm biến động Master Catalog gốc.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F012-01` | Bảng quản lý tinh gọn 6 cột; cột 'Các khoản phí' hiển thị số... | `OK` | repo:app/tests/unit/tuitionManagement.test.mjs:1 | Đã kiểm chứng 15/15 unit tests |
| `SPEC-F012-02` | Ghi đè đơn giá khoản thu riêng biệt theo lớp mà không làm bi... | `OK` | repo:app/tests/unit/tuitionManagement.test.mjs:1 | Đã kiểm chứng 15/15 unit tests |

## Liên quan

- Phân hệ cha: [Tài chính](../overview/module-m4-tai-chinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
