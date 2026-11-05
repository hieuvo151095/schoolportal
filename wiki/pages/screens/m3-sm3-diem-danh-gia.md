---
title: "Sổ điểm & Đánh giá Học tập Định kỳ"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Sổ điểm & Đánh giá Học tập Định kỳ (`M3/SM3`)

## Mục đích

Sổ điểm điện tử chuẩn Bộ Giáo dục & Đào tạo ghi nhận điểm số (miệng, 15 phút, 1 tiết, giữa kỳ, cuối kỳ) và rubric đánh giá định kỳ cho học sinh mầm non.

Thuộc phân hệ **[Học tập](../overview/module-m3-hoc-tap.md)**. Mã định danh tính năng Harness Loop: **`F021`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/scoreboard`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/gradebook.ts`
  - `docs/src/utils/gradebookValidation.ts`
  - `docs/tests/unit/gradebook.test.mjs`

## Yêu cầu spec

- **SPEC-F021-01**: Ma trận nhập điểm số linh hoạt theo môn học, lớp và học kỳ.
- **SPEC-F021-02**: Rubric đánh giá định kỳ cho các cấp học mầm non và tiểu học.
- **SPEC-F021-03**: Tính điểm trung bình môn tự động theo trọng số quy chuẩn.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F021-01` | Ma trận nhập điểm số linh hoạt theo môn học, lớp và học kỳ.... | `MISSING` | repo:app/src/types/gradebook.ts:1 | Cần triển khai và verify |
| `SPEC-F021-02` | Rubric đánh giá định kỳ cho các cấp học mầm non và tiểu học.... | `MISSING` | repo:app/src/types/gradebook.ts:1 | Cần triển khai và verify |
| `SPEC-F021-03` | Tính điểm trung bình môn tự động theo trọng số quy chuẩn.... | `MISSING` | repo:app/src/types/gradebook.ts:1 | Cần triển khai và verify |

## Liên quan

- Phân hệ cha: [Học tập](../overview/module-m3-hoc-tap.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
