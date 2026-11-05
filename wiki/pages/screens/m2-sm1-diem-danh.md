---
title: "Điểm danh Học sinh Hằng ngày (Đón / Trả / Sức khỏe)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Điểm danh Học sinh Hằng ngày (Đón / Trả / Sức khỏe) (`M2/SM1`)

## Mục đích

Phân hệ điểm danh đón/trả trẻ hằng ngày 1 click, theo dõi thân nhiệt, phát hiện dấu hiệu sức khỏe bất thường, xác thực người đón hộ và báo vắng hàng loạt liên thông hoàn tiền.

Thuộc phân hệ **[Vận hành](../overview/module-m2-van-hanh.md)**. Mã định danh tính năng Harness Loop: **`F009`** (Mức ưu tiên: `P0`).

## App / route / file code

- **Route ứng dụng**: `/class/[classId]/attendance`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/attendance.ts`
  - `docs/src/utils/attendanceValidation.ts`
  - `docs/tests/unit/attendance.test.mjs`

## Yêu cầu spec

- **SPEC-F009-01**: Điểm danh Đón 1 click, tự động gắn huy hiệu Đến muộn nếu sau giờ quy định.
- **SPEC-F009-02**: Ràng buộc logic: Giờ Trả phải lớn hơn giờ Đón; chặn trả nhanh nếu chưa có giờ đón.
- **SPEC-F009-03**: Modal chọn người đón hộ hợp lệ trong danh sách người giám hộ đã đăng ký.
- **SPEC-F009-04**: Báo vắng hàng loạt phân loại Có phép / Không phép kèm cờ Hoàn tiền ăn liên thông hóa đơn học phí.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F009-01` | Điểm danh Đón 1 click, tự động gắn huy hiệu Đến muộn nếu sau... | `OK` | repo:app/src/utils/attendanceValidation.ts:1 | Đã hoàn thành và verify qua tests/unit/attendance.test.mjs |
| `SPEC-F009-02` | Ràng buộc logic: Giờ Trả phải lớn hơn giờ Đón; chặn trả nhan... | `OK` | repo:app/src/utils/attendanceValidation.ts:25 | Đã hoàn thành và verify qua tests/unit/attendance.test.mjs |
| `SPEC-F009-03` | Modal chọn người đón hộ hợp lệ trong danh sách người giám hộ... | `OK` | repo:app/src/utils/attendanceValidation.ts:50 | Đã hoàn thành và verify qua tests/unit/attendance.test.mjs |
| `SPEC-F009-04` | Báo vắng hàng loạt phân loại Có phép / Không phép kèm cờ Hoà... | `OK` | repo:app/src/utils/attendanceValidation.ts:80 | Đã hoàn thành và verify qua tests/unit/attendance.test.mjs |

## Liên quan

- Phân hệ cha: [Vận hành](../overview/module-m2-van-hanh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
