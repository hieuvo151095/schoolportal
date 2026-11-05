---
title: "Bảng tin Hoạt động Lớp học"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Bảng tin Hoạt động Lớp học (`M2/SM2`)

## Mục đích

Bảng tin nhật ký bài học và hoạt động trong ngày của lớp, hỗ trợ soạn thảo đa phương tiện, nhắc tên học sinh (@), gắn thẻ bài học (#) và phân luồng duyệt bài đăng.

Thuộc phân hệ **[Vận hành](../overview/module-m2-van-hanh.md)**. Mã định danh tính năng Harness Loop: **`F010`** (Mức ưu tiên: `P0`).

## App / route / file code

- **Route ứng dụng**: `/class/[classId]/activity`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/activity.ts`
  - `docs/src/utils/activityValidation.ts`
  - `docs/tests/unit/activity.test.mjs`

## Yêu cầu spec

- **SPEC-F010-01**: Soạn bài viết hỗ trợ đính kèm ảnh/video, tag học sinh hiển thị dạng pill màu xanh nổi bật.
- **SPEC-F010-02**: Phân tách tab 'Đã duyệt' và 'Chờ duyệt' cho bài viết của giáo viên hỗ trợ.
- **SPEC-F010-03**: Cơ chế ghim tối đa 1 bài viết quan trọng lên đầu bảng tin kèm xác nhận gỡ bài cũ.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F010-01` | Soạn bài viết hỗ trợ đính kèm ảnh/video, tag học sinh hiển t... | `OK` | repo:app/src/utils/activityValidation.ts:1 | Đã hoàn thành và verify qua tests/unit/activity.test.mjs |
| `SPEC-F010-02` | Phân tách tab 'Đã duyệt' và 'Chờ duyệt' cho bài viết của giá... | `OK` | repo:app/src/utils/activityValidation.ts:35 | Đã hoàn thành và verify qua tests/unit/activity.test.mjs |
| `SPEC-F010-03` | Cơ chế ghim tối đa 1 bài viết quan trọng lên đầu bảng tin kè... | `OK` | repo:app/src/utils/activityValidation.ts:75 | Đã hoàn thành và verify qua tests/unit/activity.test.mjs |

## Liên quan

- Phân hệ cha: [Vận hành](../overview/module-m2-van-hanh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
