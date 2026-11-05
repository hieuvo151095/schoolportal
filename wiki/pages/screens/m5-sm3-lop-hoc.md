---
title: "Quản lý Lớp học (Chính khóa & Ngoại khóa)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Quản lý Lớp học (Chính khóa & Ngoại khóa) (`M5/SM3`)

## Mục đích

Quản lý danh sách lớp học, phân biệt rõ ràng lớp chính khóa và lớp ngoại khóa (chỉ bật điểm danh/hoạt động/ảnh), chỉ định giáo viên chủ nhiệm và chốt chặn an toàn cấm xóa lớp nếu còn sĩ số.

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F006`** (Mức ưu tiên: `P0`).

## App / route / file code

- **Route ứng dụng**: `/school/class`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/class.ts`
  - `docs/src/utils/classValidation.ts`
  - `docs/tests/unit/class.test.mjs`

## Yêu cầu spec

- **SPEC-F006-01**: Phân tách cấu hình lớp chính khóa và ngoại khóa với phạm vi tính năng linh hoạt.
- **SPEC-F006-02**: Gán giáo viên chủ nhiệm và phòng học trực quan.
- **SPEC-F006-03**: Chốt chặn bảo vệ dữ liệu: Chặn tuyệt đối xóa lớp khi sĩ số học sinh lớn hơn 0.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F006-01` | Phân tách cấu hình lớp chính khóa và ngoại khóa với phạm vi ... | `OK` | repo:app/tests/unit/class.test.mjs:1 | Đã kiểm chứng 20/20 unit tests |
| `SPEC-F006-02` | Gán giáo viên chủ nhiệm và phòng học trực quan.... | `OK` | repo:app/tests/unit/class.test.mjs:1 | Đã kiểm chứng 20/20 unit tests |
| `SPEC-F006-03` | Chốt chặn bảo vệ dữ liệu: Chặn tuyệt đối xóa lớp khi sĩ số h... | `OK` | repo:app/tests/unit/class.test.mjs:1 | Đã kiểm chứng 20/20 unit tests |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
