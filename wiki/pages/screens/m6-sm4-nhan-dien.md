---
title: "Quản lý Dữ liệu Khuôn mặt Học sinh (Face ID)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Quản lý Dữ liệu Khuôn mặt Học sinh (Face ID) (`M6/SM4`)

## Mục đích

Đăng ký, cập nhật và quản lý kho ảnh mẫu khuôn mặt của học sinh phục vụ cho tính năng nhận diện AI trong thư viện ảnh lớp và điểm danh sinh trắc học.

Thuộc phân hệ **[Cấu hình](../overview/module-m6-cau-hinh.md)**. Mã định danh tính năng Harness Loop: **`F036`** (Mức ưu tiên: `P2`).

## App / route / file code

- **Route ứng dụng**: `/setting/face-recognition`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/faceRecognition.ts`
  - `docs/src/utils/faceRecognitionValidation.ts`
  - `docs/tests/unit/faceRecognition.test.mjs`

## Yêu cầu spec

- **SPEC-F036-01**: Quản lý ảnh đại diện và ảnh mẫu khuôn mặt theo từng học sinh.
- **SPEC-F036-02**: Kiểm tra chất lượng góc chụp và độ sắc nét trước khi lưu vector khuôn mặt.
- **SPEC-F036-03**: Đồng bộ tức thời với mô hình nhận diện khuôn mặt AI lớp học.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F036-01` | Quản lý ảnh đại diện và ảnh mẫu khuôn mặt theo từng học sinh... | `OK` | repo:app/src/utils/faceRecognitionValidation.ts:1 | Đã hoàn thành và verify qua tests/unit/faceRecognition.test.mjs |
| `SPEC-F036-02` | Kiểm tra chất lượng góc chụp và độ sắc nét trước khi lưu vec... | `OK` | repo:app/src/utils/faceRecognitionValidation.ts:35 | Đã hoàn thành và verify qua tests/unit/faceRecognition.test.mjs |
| `SPEC-F036-03` | Đồng bộ tức thời với mô hình nhận diện khuôn mặt AI lớp học.... | `OK` | repo:app/src/utils/faceRecognitionValidation.ts:70 | Đã hoàn thành và verify qua tests/unit/faceRecognition.test.mjs |

## Liên quan

- Phân hệ cha: [Cấu hình](../overview/module-m6-cau-hinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
