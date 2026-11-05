---
title: "Hòm thư Góp ý Phụ huynh & Thảo luận 2 chiều"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Hòm thư Góp ý Phụ huynh & Thảo luận 2 chiều (`M5/SM11`)

## Mục đích

Tiếp nhận phiếu phản ánh góp ý từ phụ huynh theo 8 lĩnh vực, phân công cán bộ xử lý, đặt mức ưu tiên và trao đổi thảo luận 2 chiều minh bạch.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F033`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/school/feedback`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/feedback.ts`
  - `docs/src/utils/feedbackValidation.ts`
  - `docs/tests/unit/feedback.test.mjs`

## Yêu cầu spec

- **SPEC-F033-01**: Bốn thẻ trạng thái giữ số liệu độc lập khi click lọc danh sách phiếu góp ý.
- **SPEC-F033-02**: Luồng thảo luận 2 chiều chi tiết có hỗ trợ đính kèm hình ảnh.
- **SPEC-F033-03**: Đóng phiếu góp ý chuyển sang trạng thái Hoàn tất kèm thông báo Toast.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F033-01` | Bốn thẻ trạng thái giữ số liệu độc lập khi click lọc danh sá... | `MISSING` | repo:app/src/types/feedback.ts:1 | Cần triển khai và verify |
| `SPEC-F033-02` | Luồng thảo luận 2 chiều chi tiết có hỗ trợ đính kèm hình ảnh... | `MISSING` | repo:app/src/types/feedback.ts:1 | Cần triển khai và verify |
| `SPEC-F033-03` | Đóng phiếu góp ý chuyển sang trạng thái Hoàn tất kèm thông b... | `MISSING` | repo:app/src/types/feedback.ts:1 | Cần triển khai và verify |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
