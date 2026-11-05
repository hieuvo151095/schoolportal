---
title: "Sổ tay Phụ huynh Cây Tri thức 2 cấp (Handbook)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Sổ tay Phụ huynh Cây Tri thức 2 cấp (Handbook) (`M5/SM10`)

## Mục đích

Tổ chức các quy định, cẩm nang phụ huynh và câu hỏi thường gặp (FAQ) theo cấu trúc cây tri thức đúng 2 cấp (Danh mục gốc -> Danh mục con -> Bài viết).

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F032`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/school/handbook`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/parentHandbook.ts`
  - `docs/src/utils/parentHandbookValidation.ts`
  - `docs/tests/unit/parentHandbook.test.mjs`

## Yêu cầu spec

- **SPEC-F032-01**: Cấu trúc cây danh mục 2 cấp chuẩn hóa, hỗ trợ tương tác accordion mượt mà.
- **SPEC-F032-02**: Soạn thảo nội dung bài viết và chuyển đổi trạng thái xuất bản.
- **SPEC-F032-03**: Cảnh báo xóa danh mục gốc sẽ tự động xóa các bài viết con liên quan.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F032-01` | Cấu trúc cây danh mục 2 cấp chuẩn hóa, hỗ trợ tương tác acco... | `MISSING` | repo:app/src/types/parentHandbook.ts:1 | Cần triển khai và verify |
| `SPEC-F032-02` | Soạn thảo nội dung bài viết và chuyển đổi trạng thái xuất bả... | `MISSING` | repo:app/src/types/parentHandbook.ts:1 | Cần triển khai và verify |
| `SPEC-F032-03` | Cảnh báo xóa danh mục gốc sẽ tự động xóa các bài viết con li... | `MISSING` | repo:app/src/types/parentHandbook.ts:1 | Cần triển khai và verify |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
