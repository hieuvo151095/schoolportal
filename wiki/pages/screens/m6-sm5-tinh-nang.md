---
title: "Quản lý Bật/Tắt Tính năng Trường học (Feature Flags)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Quản lý Bật/Tắt Tính năng Trường học (Feature Flags) (`M6/SM5`)

## Mục đích

Bảng công tắc cấu hình bật hoặc tắt linh hoạt từng phân hệ chức năng cho trường học (Điểm danh, Bài tập, Thực đơn, Sổ tay, Khảo sát, Đón muộn...).

Thuộc phân hệ **[Cấu hình](../overview/module-m6-cau-hinh.md)**. Mã định danh tính năng Harness Loop: **`F037`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/setting/activity`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/featureFlags.ts`
  - `docs/src/utils/featureFlagsValidation.ts`
  - `docs/tests/unit/featureFlags.test.mjs`

## Yêu cầu spec

- **SPEC-F037-01**: Bật / tắt tức thì các module trên thanh điều hướng Sidebar của trường.
- **SPEC-F037-02**: Lưu cấu hình an toàn và phản hồi trạng thái bằng thông báo Toast.
- **SPEC-F037-03**: Chặn truy cập vào route tương ứng khi module bị tắt.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F037-01` | Bật / tắt tức thì các module trên thanh điều hướng Sidebar c... | `OK` | repo:app/src/utils/featureFlagsValidation.ts:1 | Đã hoàn thành và verify qua tests/unit/featureFlags.test.mjs |
| `SPEC-F037-02` | Lưu cấu hình an toàn và phản hồi trạng thái bằng thông báo T... | `OK` | repo:app/src/utils/featureFlagsValidation.ts:35 | Đã hoàn thành và verify qua tests/unit/featureFlags.test.mjs |
| `SPEC-F037-03` | Chặn truy cập vào route tương ứng khi module bị tắt.... | `OK` | repo:app/src/utils/featureFlagsValidation.ts:70 | Đã hoàn thành và verify qua tests/unit/featureFlags.test.mjs |

## Liên quan

- Phân hệ cha: [Cấu hình](../overview/module-m6-cau-hinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
