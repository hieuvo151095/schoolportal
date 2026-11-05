---
title: "Báo cáo Mở rộng theo Mẫu Động"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Báo cáo Mở rộng theo Mẫu Động (`M2/SM6`)

## Mục đích

Hệ thống sinh báo cáo đánh giá định kỳ theo các mẫu động cấu hình trước, hỗ trợ lọc theo khối, lớp, khoảng ngày và xuất file Excel.

Thuộc phân hệ **[Vận hành](../overview/module-m2-van-hanh.md)**. Mã định danh tính năng Harness Loop: **`F029`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/reports/extended`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/reports.ts`
  - `docs/src/utils/reportsValidation.ts`
  - `docs/tests/unit/reports.test.mjs`

## Yêu cầu spec

- **SPEC-F029-01**: Lựa chọn mẫu báo cáo động từ danh mục biểu mẫu của trường.
- **SPEC-F029-02**: Bộ lọc đa chiều theo lớp học, trạng thái và khoảng thời gian.
- **SPEC-F029-03**: Menu ba chấm (•••) thao tác đồng bộ với các bảng dữ liệu toàn hệ thống.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F029-01` | Lựa chọn mẫu báo cáo động từ danh mục biểu mẫu của trường.... | `OK` | repo:app/src/utils/reportsValidation.ts:1 | Đã hoàn thành và verify qua tests/unit/reports.test.mjs |
| `SPEC-F029-02` | Bộ lọc đa chiều theo lớp học, trạng thái và khoảng thời gian... | `OK` | repo:app/src/utils/reportsValidation.ts:40 | Đã hoàn thành và verify qua tests/unit/reports.test.mjs |
| `SPEC-F029-03` | Menu ba chấm (•••) thao tác đồng bộ với các bảng dữ liệu toà... | `OK` | repo:app/src/utils/reportsValidation.ts:80 | Đã hoàn thành và verify qua tests/unit/reports.test.mjs |

## Liên quan

- Phân hệ cha: [Vận hành](../overview/module-m2-van-hanh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
