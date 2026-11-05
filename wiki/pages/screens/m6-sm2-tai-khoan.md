---
title: "Quản lý Tài khoản & Phân quyền Quản trị"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Quản lý Tài khoản & Phân quyền Quản trị (`M6/SM2`)

## Mục đích

Quản trị danh sách tài khoản nội bộ trường học (Ban Giám Hiệu, Giáo viên, Kế toán, Nhân sự), gán vai trò quyền hạn và hỗ trợ bộ lọc liên kết Cơ sở dữ liệu ngành Sở GD&ĐT.

Thuộc phân hệ **[Cấu hình](../overview/module-m6-cau-hinh.md)**. Mã định danh tính năng Harness Loop: **`F003`** (Mức ưu tiên: `P0`).

## App / route / file code

- **Route ứng dụng**: `/setting/users`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/types/account.ts`
  - `docs/src/utils/accountValidation.ts`
  - `docs/tests/unit/account.test.mjs`

## Yêu cầu spec

- **SPEC-F003-01**: Danh sách người dùng hệ thống phân loại theo vai trò (Admin, Teacher, Accountant, Staff).
- **SPEC-F003-02**: Tạo mới, kích hoạt, khóa tài khoản và thiết lập lại mật khẩu an toàn.
- **SPEC-F003-03**: Bộ lọc chuyên biệt đối chiếu tài khoản liên kết CSDL Sở GD&ĐT.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F003-01` | Danh sách người dùng hệ thống phân loại vai trò | `OK` | repo:app/tests/unit/account.test.mjs:51 | Verify Gate 22/22 tests PASS |
| `SPEC-F003-02` | Tạo mới, kích hoạt, khóa và đổi mật khẩu | `OK` | repo:app/tests/unit/account.test.mjs:101 | Verify Gate 22/22 tests PASS |
| `SPEC-F003-03` | Bộ lọc đối chiếu tài khoản liên kết CSDL Sở GD&ĐT | `OK` | repo:app/tests/unit/account.test.mjs:85 | Verify Gate 22/22 tests PASS |

## Liên quan

- Phân hệ cha: [Cấu hình](../overview/module-m6-cau-hinh.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
