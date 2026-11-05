---
title: "Dashboard Tổng quan Toàn trường (Overview)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Dashboard Tổng quan Toàn trường (Overview) (`M1/SM1`)

## Mục đích

Bảng điều khiển trung tâm hiển thị toàn diện các chỉ số KPI vận hành của trường: tổng số học sinh/lớp/giáo viên, tiến độ thu học phí, điểm danh hôm nay, hàng đợi duyệt bài và sinh nhật trong tháng.

Thuộc phân hệ **[Tổng quan](../overview/module-m1-tong-quan.md)**. Mã định danh tính năng Harness Loop: **`F027`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/overview`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/pages/index.tsx`
  - `docs/src/types/reports.ts`

## Yêu cầu spec

- **SPEC-F027-01**: Hiển thị widget KPI tổng quan trường học thời gian thực.
- **SPEC-F027-02**: Tóm tắt tiến độ thu học phí và các cảnh báo học sinh vắng nhiều lần.
- **SPEC-F027-03**: Hàng đợi kiểm duyệt bài đăng hoạt động và thông báo mới nhất.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F027-01` | Hiển thị widget KPI tổng quan trường học thời gian thực.... | `MISSING` | repo:app/src/pages/index.tsx:1 | Cần triển khai và verify |
| `SPEC-F027-02` | Tóm tắt tiến độ thu học phí và các cảnh báo học sinh vắng nh... | `MISSING` | repo:app/src/pages/index.tsx:1 | Cần triển khai và verify |
| `SPEC-F027-03` | Hàng đợi kiểm duyệt bài đăng hoạt động và thông báo mới nhất... | `MISSING` | repo:app/src/pages/index.tsx:1 | Cần triển khai và verify |

## Liên quan

- Phân hệ cha: [Tổng quan](../overview/module-m1-tong-quan.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
