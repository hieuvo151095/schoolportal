---
title: "Kho Lưu trữ Học sinh Thôi học / Rút hồ sơ (Archive)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Kho Lưu trữ Học sinh Thôi học / Rút hồ sơ (Archive) (`M5/SM14`)

## Mục đích

Kho lưu trữ độc lập danh sách học sinh đã thôi học hoặc chuyển trường, hỗ trợ phục hồi nguyên trạng vào lớp học cũ hoặc xóa vĩnh viễn an toàn 2 bước.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F035`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/setting/kid/archived`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/archive.ts`
  - `docs/src/utils/archiveValidation.ts`
  - `docs/tests/unit/archive.test.mjs`

## Yêu cầu spec

- **SPEC-F035-01**: Banner cảnh báo màu vàng nổi bật tại kho lưu trữ học sinh rút hồ sơ.
- **SPEC-F035-02**: Hỗ trợ phục hồi nguyên trạng học sinh vào lớp học với kiểm tra lớp cũ.
- **SPEC-F035-03**: Quy trình xóa vĩnh viễn hồ sơ bắt buộc xác nhận 2 bước an toàn.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F035-01` | Banner cảnh báo màu vàng nổi bật tại kho lưu trữ học sinh rú... | `MISSING` | repo:app/src/types/archive.ts:1 | Cần triển khai và verify |
| `SPEC-F035-02` | Hỗ trợ phục hồi nguyên trạng học sinh vào lớp học với kiểm t... | `MISSING` | repo:app/src/types/archive.ts:1 | Cần triển khai và verify |
| `SPEC-F035-03` | Quy trình xóa vĩnh viễn hồ sơ bắt buộc xác nhận 2 bước an to... | `MISSING` | repo:app/src/types/archive.ts:1 | Cần triển khai và verify |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
