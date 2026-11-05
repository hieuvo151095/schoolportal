---
title: "Báo cáo Điểm danh Tháng Học sinh & Nhân viên"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Báo cáo Điểm danh Tháng Học sinh & Nhân viên (`M2/SM5`)

## Mục đích

Xuất lưới điểm danh tháng của lớp và nhân viên theo 2 buổi sáng/chiều, nhúng thông tin tổng kết trực tiếp vào cột cố định và xuất file Excel phục vụ thanh tra lưu trữ.

Thuộc phân hệ **[Vận hành](../overview/module-m2-van-hanh.md)**. Mã định danh tính năng Harness Loop: **`F028`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/reports/attendance`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/reports.ts`
  - `docs/src/utils/reportsValidation.ts`
  - `docs/tests/unit/reports.test.mjs`

## Yêu cầu spec

- **SPEC-F028-01**: Bảng điểm danh tháng hiển thị 2 dòng mỗi đối tượng (Sáng và Chiều).
- **SPEC-F028-02**: Tổng kết số buổi có mặt, vắng có phép, không phép được nhúng trực tiếp trong khung cố định tên.
- **SPEC-F028-03**: Xuất dữ liệu bảng tính Excel chuẩn xác.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F028-01` | Bảng điểm danh tháng hiển thị 2 dòng mỗi đối tượng (Sáng và ... | `OK` | repo:app/src/utils/reportsValidation.ts:1 | Đã hoàn thành và verify qua tests/unit/reports.test.mjs |
| `SPEC-F028-02` | Tổng kết số buổi có mặt, vắng có phép, không phép được nhúng... | `OK` | repo:app/src/utils/reportsValidation.ts:40 | Đã hoàn thành và verify qua tests/unit/reports.test.mjs |
| `SPEC-F028-03` | Xuất dữ liệu bảng tính Excel chuẩn xác.... | `OK` | repo:app/src/utils/reportsValidation.ts:80 | Đã hoàn thành và verify qua tests/unit/reports.test.mjs |

## Liên quan

- Phân hệ cha: [Vận hành](../overview/module-m2-van-hanh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
