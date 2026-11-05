---
title: "Giao Bài tập về nhà & Theo dõi Nộp bài"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Giao Bài tập về nhà & Theo dõi Nộp bài (`M3/SM2`)

## Mục đích

Tạo bài tập về nhà theo môn học và lớp, đính kèm tài liệu hướng dẫn, đặt hạn nộp và theo dõi trạng thái làm bài của từng học sinh.

Thuộc phân hệ **[Học tập](../overview/module-m3-hoc-tap.md)**. Mã định danh tính năng Harness Loop: **`F020`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/assignment`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/assignment.ts`
  - `docs/src/utils/assignmentValidation.ts`
  - `docs/tests/unit/assignment.test.mjs`

## Yêu cầu spec

- **SPEC-F020-01**: Soạn bài tập với tiêu đề, hướng dẫn chi tiết, tệp đính kèm và thời hạn nộp bài.
- **SPEC-F020-02**: Bảng theo dõi trạng thái nộp bài của học sinh: Đã nộp, Đã chấm, Nộp trễ, Chưa nộp.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F020-01` | Soạn bài tập với tiêu đề, hướng dẫn chi tiết, tệp đính kèm v... | `MISSING` | repo:app/src/types/assignment.ts:1 | Cần triển khai và verify |
| `SPEC-F020-02` | Bảng theo dõi trạng thái nộp bài của học sinh: Đã nộp, Đã ch... | `MISSING` | repo:app/src/types/assignment.ts:1 | Cần triển khai và verify |

## Liên quan

- Phân hệ cha: [Học tập](../overview/module-m3-hoc-tap.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
