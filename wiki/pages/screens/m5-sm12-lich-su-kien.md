---
title: "Lịch Sự kiện & Ngày nghỉ Trường học (Calendar)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Lịch Sự kiện & Ngày nghỉ Trường học (Calendar) (`M5/SM12`)

## Mục đích

Quản lý lịch sự kiện và ngày nghỉ toàn trường trên 3 chế độ xem (Năm, Tháng, Danh sách sự kiện) có mã màu phân loại rõ ràng.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F034`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/setting/holidays`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/calendar.ts`
  - `docs/src/utils/calendarValidation.ts`
  - `docs/tests/unit/calendar.test.mjs`

## Yêu cầu spec

- **SPEC-F034-01**: Đồng bộ 3 chế độ xem: Lịch Năm, Lịch Tháng và Danh sách sự kiện.
- **SPEC-F034-02**: Mã màu phân loại sự kiện: Ngày nghỉ lễ, Sự kiện nội bộ, Sự kiện mời phụ huynh.
- **SPEC-F034-03**: Tự động điền ngày kết thúc trùng ngày bắt đầu cho các sự kiện diễn ra trong 1 ngày.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F034-01` | Đồng bộ 3 chế độ xem: Lịch Năm, Lịch Tháng và Danh sách sự k... | `OK` | repo:app/tests/unit/calendar.test.mjs:1 | Đã kiểm chứng 17/17 unit tests |
| `SPEC-F034-02` | Mã màu phân loại sự kiện: Ngày nghỉ lễ, Sự kiện nội bộ, Sự k... | `OK` | repo:app/tests/unit/calendar.test.mjs:1 | Đã kiểm chứng 17/17 unit tests |
| `SPEC-F034-03` | Tự động điền ngày kết thúc trùng ngày bắt đầu cho các sự kiệ... | `OK` | repo:app/tests/unit/calendar.test.mjs:1 | Đã kiểm chứng 17/17 unit tests |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
