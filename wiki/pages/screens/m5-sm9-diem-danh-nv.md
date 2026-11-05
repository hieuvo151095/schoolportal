---
title: "Điểm danh Nhân viên 1 chạm & Phê duyệt Nghỉ phép"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Điểm danh Nhân viên 1 chạm & Phê duyệt Nghỉ phép (`M5/SM9`)

## Mục đích

Chấm công đến/về cho cán bộ nhân viên nhà trường tức thì bằng 1 click, duyệt đơn xin nghỉ phép và hỗ trợ điều chỉnh công trong vòng 45 ngày quá khứ.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F026`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/school/staff-attendance`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/staffAttendance.ts`
  - `docs/src/utils/staffAttendanceValidation.ts`
  - `docs/tests/unit/staffAttendance.test.mjs`

## Yêu cầu spec

- **SPEC-F026-01**: Chấm công đến và về 1 click không cần qua modal xác nhận rườm rà.
- **SPEC-F026-02**: Phê duyệt nghỉ phép có phép / không phép bằng hộp thoại chuyên dụng.
- **SPEC-F026-03**: Khóa chọn ngày tương lai và giới hạn xem/sửa bảng công trong 45 ngày quá khứ.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F026-01` | Chấm công đến và về 1 click không cần qua modal xác nhận rườ... | `OK` | repo:app/src/utils/staffAttendanceValidation.ts:1 | Đã hoàn thành và verify qua tests/unit/staffAttendance.test.mjs |
| `SPEC-F026-02` | Phê duyệt nghỉ phép có phép / không phép bằng hộp thoại chuy... | `OK` | repo:app/src/utils/staffAttendanceValidation.ts:40 | Đã hoàn thành và verify qua tests/unit/staffAttendance.test.mjs |
| `SPEC-F026-03` | Khóa chọn ngày tương lai và giới hạn xem/sửa bảng công trong... | `OK` | repo:app/src/utils/staffAttendanceValidation.ts:80 | Đã hoàn thành và verify qua tests/unit/staffAttendance.test.mjs |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
