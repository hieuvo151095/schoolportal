---
title: "Thư viện Media & Nhận diện Khuôn mặt AI"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Thư viện Media & Nhận diện Khuôn mặt AI (`M2/SM3`)

## Mục đích

Album hình ảnh và video lớp học tỷ lệ chuẩn 16:9, tích hợp AI tự động nhận diện khuôn mặt để gom nhóm ảnh học sinh và phân bổ vào album cá nhân.

Thuộc phân hệ **[Vận hành](../overview/module-m2-van-hanh.md)**. Mã định danh tính năng Harness Loop: **`F022`** (Mức ưu tiên: `P1`).

## App / route / file code

- **Route ứng dụng**: `/class/[classId]/media`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/media.ts`
  - `docs/src/utils/mediaValidation.ts`
  - `docs/tests/unit/media.test.mjs`

## Yêu cầu spec

- **SPEC-F022-01**: Duy trì 2 album hệ thống ('Hoạt động' và 'Điểm danh') cùng các album tùy tạo của giáo viên.
- **SPEC-F022-02**: Tích hợp AI phân tích khuôn mặt ảnh tải lên, tự động gắn khung và tag vào hồ sơ học sinh tương ứng.
- **SPEC-F022-03**: Thanh công cụ chọn nhiều ảnh hỗ trợ Tải xuống ZIP và Xóa ảnh hàng loạt kèm modal xác nhận.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F022-01` | Duy trì 2 album hệ thống ('Hoạt động' và 'Điểm danh') cùng c... | `OK` | repo:app/src/utils/mediaValidation.ts:1 | Đã hoàn thành và verify qua tests/unit/media.test.mjs |
| `SPEC-F022-02` | Tích hợp AI phân tích khuôn mặt ảnh tải lên, tự động gắn khu... | `OK` | repo:app/src/utils/mediaValidation.ts:35 | Đã hoàn thành và verify qua tests/unit/media.test.mjs |
| `SPEC-F022-03` | Thanh công cụ chọn nhiều ảnh hỗ trợ Tải xuống ZIP và Xóa ảnh... | `OK` | repo:app/src/utils/mediaValidation.ts:75 | Đã hoàn thành và verify qua tests/unit/media.test.mjs |

## Liên quan

- Phân hệ cha: [Vận hành](../overview/module-m2-van-hanh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
