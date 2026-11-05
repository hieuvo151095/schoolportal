---
title: "Danh bạ Giáo viên & Phân quyền Kiểm duyệt"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Danh bạ Giáo viên & Phân quyền Kiểm duyệt (`M5/SM2`)

## Mục đích

Quản trị đội ngũ cán bộ giáo viên, phân công chủ nhiệm / giảng dạy bộ môn, cấp tài khoản và áp dụng cơ chế kiểm duyệt nội dung 2 cấp (Giáo viên chính tự đăng vs Giáo viên hỗ trợ chờ duyệt).

Thuộc phân hệ **[Nhà trường](../overview/module-m5-nha-truong.md)**. Mã định danh tính năng Harness Loop: **`F008`** (Mức ưu tiên: `P0`).

## App / route / file code

- **Route ứng dụng**: `/school/teacher`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/teacher.ts`
  - `docs/src/utils/teacherValidation.ts`
  - `docs/tests/unit/teachers.test.mjs`

## Yêu cầu spec

- **SPEC-F008-01**: Danh sách giáo viên phân tách lớp chủ nhiệm và môn học giảng dạy.
- **SPEC-F008-02**: Phân quyền kiểm duyệt nội dung: Giáo viên chính đăng bài ngay; Giáo viên hỗ trợ chuyển bài sang hàng đợi duyệt.
- **SPEC-F008-03**: Quy trình gửi email lời mời nhận việc và đổi email đăng nhập qua modal an toàn.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F008-01` | Danh sách giáo viên phân tách lớp chủ nhiệm và môn học giảng... | `OK` | repo:app/tests/unit/teachers.test.mjs:1 | Đã kiểm chứng 29/29 unit tests |
| `SPEC-F008-02` | Phân quyền kiểm duyệt nội dung: Giáo viên chính đăng bài nga... | `OK` | repo:app/tests/unit/teachers.test.mjs:1 | Đã kiểm chứng 29/29 unit tests |
| `SPEC-F008-03` | Quy trình gửi email lời mời nhận việc và đổi email đăng nhập... | `OK` | repo:app/tests/unit/teachers.test.mjs:1 | Đã kiểm chứng 29/29 unit tests |

## Liên quan

- Phân hệ cha: [Nhà trường](../overview/module-m5-nha-truong.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
