---
title: "Hồ sơ Trường học & Thiết lập Vận hành"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Hồ sơ Trường học & Thiết lập Vận hành (`M6/SM1`)

## Mục đích

Quản lý thông tin định danh gốc của cơ sở trường học: tên trường, mã trường, địa chỉ, số điện thoại liên hệ, logo thương hiệu, ngôn ngữ thông báo mặc định và cấu hình phương thức điểm danh.

Thuộc phân hệ **[Cấu hình](../overview/module-m6-cau-hinh.md)**. Mã định danh tính năng Harness Loop: **`F002`** (Mức ưu tiên: `P0`).

## App / route / file code

- **Route ứng dụng**: `/school/info`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/schoolProfile.ts`
  - `docs/src/utils/schoolProfileValidation.ts`
  - `docs/tests/unit/schoolProfile.test.mjs`

## Yêu cầu spec

- **SPEC-F002-01**: Hiển thị và cập nhật thông tin pháp lý, địa chỉ và hotline nhà trường.
- **SPEC-F002-02**: Cấu hình phương thức điểm danh mặc định của trường (Thủ công / QR / Nhận diện AI).
- **SPEC-F002-03**: Thiết lập ngôn ngữ hiển thị và kênh thông báo mặc định gửi phụ huynh.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F002-01` | Hiển thị và cập nhật thông tin pháp lý, địa chỉ và hotline n... | `OK` | repo:app/tests/unit/schoolProfile.test.mjs:1 | Đã kiểm chứng 11/11 unit tests |
| `SPEC-F002-02` | Cấu hình phương thức điểm danh mặc định của trường (Thủ công... | `OK` | repo:app/tests/unit/schoolProfile.test.mjs:1 | Đã kiểm chứng 11/11 unit tests |
| `SPEC-F002-03` | Thiết lập ngôn ngữ hiển thị và kênh thông báo mặc định gửi p... | `OK` | repo:app/tests/unit/schoolProfile.test.mjs:1 | Đã kiểm chứng 11/11 unit tests |

## Liên quan

- Phân hệ cha: [Cấu hình](../overview/module-m6-cau-hinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
