---
title: "Báo cáo Thu Học phí & Tỷ lệ Hoàn thành"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Báo cáo Thu Học phí & Tỷ lệ Hoàn thành (`M4/SM6`)

## Mục đích

Biểu đồ trực quan và bảng số liệu theo dõi tiến độ thu học phí toàn trường và từng lớp học (Đã nộp, Nộp một phần, Còn nợ).

Thuộc phân hệ **[Tài chính](../overview/module-m4-tai-chinh.md)**. Mã định danh tính năng Harness Loop: **`F018`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/reports/fee/overview`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/feeReport.ts`
  - `docs/src/utils/feeReportValidation.ts`
  - `docs/tests/unit/feeReports.test.mjs`

## Yêu cầu spec

- **SPEC-F018-01**: Thống kê tổng số tiền phải thu, thực thu và công nợ tồn đọng.
- **SPEC-F018-02**: Biểu đồ phân tích tỷ lệ hoàn thành thu học phí theo khối lớp và lớp học.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F018-01` | Thống kê tổng số tiền phải thu, thực thu và công nợ tồn đọng... | `OK` | repo:app/tests/unit/feeReports.test.mjs:1 | Đã kiểm chứng 10/10 unit tests |
| `SPEC-F018-02` | Biểu đồ phân tích tỷ lệ hoàn thành thu học phí theo khối lớp... | `OK` | repo:app/tests/unit/feeReports.test.mjs:1 | Đã kiểm chứng 10/10 unit tests |

## Liên quan

- Phân hệ cha: [Tài chính](../overview/module-m4-tai-chinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
