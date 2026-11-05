---
title: "Thời khóa biểu Tuần & Lịch sử Phiên bản"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Thời khóa biểu Tuần & Lịch sử Phiên bản (`M3/SM1`)

## Mục đích

Lập lịch thời khóa biểu tuần theo tiết học, môn học, phòng học và giáo viên phụ trách; lưu vết lịch sử phiên bản gửi thông báo đến phụ huynh.

Thuộc phân hệ **[Học tập](../overview/module-m3-hoc-tap.md)**. Mã định danh tính năng Harness Loop: **`F019`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/schedule`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/schedule.ts`
  - `docs/src/utils/scheduleValidation.ts`
  - `docs/tests/unit/schedule.test.mjs`

## Yêu cầu spec

- **SPEC-F019-01**: Ma trận thời khóa biểu linh hoạt: khởi tạo 1 tiết, bấm [+] thêm tiết, các cột Thứ 2 - Thứ 7 để trống chờ nhập.
- **SPEC-F019-02**: Menu ba chấm (•••) z-index cao: Xem chi tiết, Chỉnh sửa, Gửi phụ huynh (kèm modal xác nhận), Tải xuống, Xóa.
- **SPEC-F019-03**: Lưu vết lịch sử các phiên bản công bố thời khóa biểu.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F019-01` | Ma trận thời khóa biểu linh hoạt: khởi tạo 1 tiết, bấm [+] t... | `MISSING` | repo:app/src/types/schedule.ts:1 | Cần triển khai và verify |
| `SPEC-F019-02` | Menu ba chấm (•••) z-index cao: Xem chi tiết, Chỉnh sửa, Gửi... | `MISSING` | repo:app/src/types/schedule.ts:1 | Cần triển khai và verify |
| `SPEC-F019-03` | Lưu vết lịch sử các phiên bản công bố thời khóa biểu.... | `MISSING` | repo:app/src/types/schedule.ts:1 | Cần triển khai và verify |

## Liên quan

- Phân hệ cha: [Học tập](../overview/module-m3-hoc-tap.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
