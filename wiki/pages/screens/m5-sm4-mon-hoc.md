---
title: "Danh mục Môn học & Phân công Giảng dạy"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Danh mục Môn học & Phân công Giảng dạy (`M5/SM4`)

## Mục đích

Tra cứu danh mục môn học chuẩn theo 4 cấp học (Tiểu học, THCS, THPT, GDTX) và phân công giáo viên phụ trách giảng dạy.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F024`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/subject`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/subject.ts`
  - `docs/src/utils/subjectValidation.ts`
  - `docs/tests/unit/subject.test.mjs`

## Yêu cầu spec

- **SPEC-F024-01**: Danh mục môn học phân chia theo cấp học và niên khóa.
- **SPEC-F024-02**: Chi tiết môn học hiển thị ma trận đánh giá 4 kỳ.
- **SPEC-F024-03**: Gán giáo viên giảng dạy tự động lọc bỏ giáo viên đã được phân công.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F024-01` | Danh mục môn học phân chia theo cấp học và niên khóa.... | `MISSING` | repo:app/src/types/subject.ts:1 | Cần triển khai và verify |
| `SPEC-F024-02` | Chi tiết môn học hiển thị ma trận đánh giá 4 kỳ.... | `MISSING` | repo:app/src/types/subject.ts:1 | Cần triển khai và verify |
| `SPEC-F024-03` | Gán giáo viên giảng dạy tự động lọc bỏ giáo viên đã được phâ... | `MISSING` | repo:app/src/types/subject.ts:1 | Cần triển khai và verify |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
