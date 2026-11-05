---
title: "Hồ sơ Học sinh 360° & Chuyển lớp"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Hồ sơ Học sinh 360° & Chuyển lớp (`M5/SM1`)

## Mục đích

Quản lý hồ sơ gốc học sinh toàn diện qua các năm học (mã học sinh, CCCD, ngày sinh, BMI), hub chi tiết 360° gồm 5 tab ngữ cảnh và điều phối chuyển lớp/chuyển năm học an toàn.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F007`** (Mức ưu tiên: `P0`).

## App / route / file code

- **Route ứng dụng**: `/school/kid`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/student.ts`
  - `docs/src/utils/studentValidation.ts`
  - `docs/tests/unit/students.test.mjs`

## Yêu cầu spec

- **SPEC-F007-01**: Danh sách học sinh với bộ lọc lớp, trạng thái, và icon thẻ miễn giảm (faTag) màu xanh ngọc.
- **SPEC-F007-02**: Hub chi tiết 360° với 5 tab: Hồ sơ, Hoạt động, Thư viện, Điểm danh, Học phí.
- **SPEC-F007-03**: Quy trình chuyển lớp / chuyển năm học tự động áp dụng 3 nguyên tắc cascade: gán biểu phí mới, thu hồi chat cũ, bảo toàn điểm số.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F007-01` | Danh sách học sinh với bộ lọc lớp, trạng thái, và icon thẻ m... | `OK` | repo:app/tests/unit/students.test.mjs:1 | Đã kiểm chứng 21/21 unit tests |
| `SPEC-F007-02` | Hub chi tiết 360° với 5 tab: Hồ sơ, Hoạt động, Thư viện, Điể... | `OK` | repo:app/tests/unit/students.test.mjs:1 | Đã kiểm chứng 21/21 unit tests |
| `SPEC-F007-03` | Quy trình chuyển lớp / chuyển năm học tự động áp dụng 3 nguy... | `OK` | repo:app/tests/unit/students.test.mjs:1 | Đã kiểm chứng 21/21 unit tests |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
