---
title: "Quản lý Cây Khối Lớp"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Quản lý Cây Khối Lớp (`M5/SM5`)

## Mục đích

Quản lý hệ thống phân cấp khối lớp theo 4 cấp học (Tiểu học, THCS, THPT, Mầm non), tổng hợp sĩ số học sinh và số lớp học thuộc từng khối.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F005`** (Mức ưu tiên: `P0`).

## App / route / file code

- **Route ứng dụng**: `/school/grades`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/grade.ts`
  - `docs/src/utils/gradeValidation.ts`
  - `docs/tests/unit/grade.test.mjs`

## Yêu cầu spec

- **SPEC-F005-01**: Danh mục khối lớp hiển thị mã khối, tên khối, cấp học và tổng số học sinh/lớp liên kết.
- **SPEC-F005-02**: Tìm kiếm tức thì trên client và tự động phục hồi danh sách khi xóa từ khóa.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F005-01` | Danh mục khối lớp hiển thị mã khối, tên khối, cấp học và tổn... | `OK` | repo:app/tests/unit/grade.test.mjs:1 | Đã kiểm chứng 23/23 unit tests |
| `SPEC-F005-02` | Tìm kiếm tức thì trên client và tự động phục hồi danh sách k... | `OK` | repo:app/tests/unit/grade.test.mjs:1 | Đã kiểm chứng 23/23 unit tests |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
