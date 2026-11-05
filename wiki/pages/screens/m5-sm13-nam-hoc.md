---
title: "Cấu hình Niên khóa & Học kỳ"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Cấu hình Niên khóa & Học kỳ (`M5/SM13`)

## Mục đích

Thiết lập các niên khóa và khoảng thời gian học kỳ trong năm học; tự động nhận diện năm học hiện tại theo thời gian thực và ngăn chặn chồng lấn thời gian.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F004`** (Mức ưu tiên: `P0`).

## App / route / file code

- **Route ứng dụng**: `/setting/season`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/academicYear.ts`
  - `docs/src/utils/academicYearValidation.ts`
  - `docs/tests/unit/academicYear.test.mjs`

## Yêu cầu spec

- **SPEC-F004-01**: Form tối giản tạo niên khóa với ngày bắt đầu và kết thúc học kỳ 1, học kỳ 2.
- **SPEC-F004-02**: Thuật toán tự động gắn huy hiệu 'Hiện tại' cho năm học bao hàm ngày hệ thống.
- **SPEC-F004-03**: Chặn trùng lặp khoảng thời gian giữa các niên khóa và khóa hành động xóa niên khóa đang có dữ liệu.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F004-01` | Form tối giản tạo niên khóa với ngày bắt đầu và kết thúc học... | `OK` | repo:app/tests/unit/academicYear.test.mjs:1 | Đã kiểm chứng 24/24 unit tests |
| `SPEC-F004-02` | Thuật toán tự động gắn huy hiệu 'Hiện tại' cho năm học bao h... | `OK` | repo:app/tests/unit/academicYear.test.mjs:1 | Đã kiểm chứng 24/24 unit tests |
| `SPEC-F004-03` | Chặn trùng lặp khoảng thời gian giữa các niên khóa và khóa h... | `OK` | repo:app/tests/unit/academicYear.test.mjs:1 | Đã kiểm chứng 24/24 unit tests |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
