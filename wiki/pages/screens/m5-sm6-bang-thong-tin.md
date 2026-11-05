---
title: "Bảng thông tin & Lên lịch Gửi Thông báo"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Bảng thông tin & Lên lịch Gửi Thông báo (`M5/SM6`)

## Mục đích

Soạn thảo, xem trước giao diện hiển thị trên ứng dụng di động của phụ huynh, hẹn giờ phát thông báo tới toàn trường, giáo viên hoặc lớp cụ thể qua App Push và Email.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F030`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/announcement`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/announcement.ts`
  - `docs/src/utils/announcementValidation.ts`
  - `docs/tests/unit/announcements.test.mjs`

## Yêu cầu spec

- **SPEC-F030-01**: Soạn thông báo với chế độ xem trước (Preview) giao diện mobile trực quan.
- **SPEC-F030-02**: Hẹn giờ phát sóng thông báo và chọn phạm vi người nhận linh hoạt.
- **SPEC-F030-03**: Cảnh báo tính bất biến khi gửi thông báo qua email (không thể thu hồi).

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F030-01` | Soạn thông báo với chế độ xem trước (Preview) giao diện mobi... | `MISSING` | repo:app/src/types/announcement.ts:1 | Cần triển khai và verify |
| `SPEC-F030-02` | Hẹn giờ phát sóng thông báo và chọn phạm vi người nhận linh ... | `MISSING` | repo:app/src/types/announcement.ts:1 | Cần triển khai và verify |
| `SPEC-F030-03` | Cảnh báo tính bất biến khi gửi thông báo qua email (không th... | `MISSING` | repo:app/src/types/announcement.ts:1 | Cần triển khai và verify |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
