---
title: "Cổng Đăng nhập (SSO Sở GD&ĐT & Tài khoản Finviet)"
type: screen
sources:
  - docs/PRD_School_Operating_Portal_VI.md
  - docs/PRD_Dang_Nhap_VI.md
updated: 2026-11-04
---

# Cổng Đăng nhập (SSO Sở GD&ĐT & Tài khoản Finviet) (`M7/SM2`)

## Mục đích

Cổng xác thực đăng nhập duy nhất cho mọi nhân sự trường học, hỗ trợ 2 luồng độc lập: Đăng nhập SSO bằng dữ liệu Sở GD&ĐT (chọn Sở, tìm trường, redirect SSO, ánh xạ CCCD) và Đăng nhập bằng tài khoản Finviet cấp (Mã trường, Email, Mật khẩu, Nhớ mật khẩu 24h).

Thuộc phân hệ **[Cổng & Xác thực](../overview/module-m7-dang-nhap.md)**. Mã định danh tính năng Harness Loop: **`F001`** (Mức ưu tiên: `P0`).

## App / route / file code

- **Route ứng dụng**: `/signin, /sso/login`
- **Tài liệu đặc tả nguồn**: `docs/PRD_School_Operating_Portal_VI.md` (hoặc `docs/PRD_Dang_Nhap_VI.md`)
- **Tệp mã nguồn liên quan**:
  - `docs/src/pages/signin.tsx`
  - `docs/src/pages/sso/login.tsx`
  - `docs/src/types/auth.ts`
  - `docs/tests/unit/auth.test.mjs`

## Yêu cầu spec

- **SPEC-F001-01**: Hỗ trợ SegmentedControl chuyển đổi mượt mà giữa Tab SSO Sở và Tab Tài khoản Finviet.
- **SPEC-F001-02**: Tab SSO: Combobox tìm kiếm trường tiếng Việt không dấu theo Sở đã chọn, redirect cổng SSO Sở và xử lý JWT callback.
- **SPEC-F001-03**: Tab Tài khoản: Xác thực mã trường (tenant isolation), email, mật khẩu với icon ẩn/hiện mắt và checkbox ghi nhớ phiên 24h.
- **SPEC-F001-04**: Chống tấn công dò quét tài khoản (Account Enumeration) bằng thông báo lỗi chung, điều hướng an toàn theo tham số `?next=`.

## Khác biệt spec ↔ code

| Mã yêu cầu | Mô tả tóm tắt | Hiện trạng | Bằng chứng mã nguồn | Ghi chú theo dõi |
|---|---|---|---|---|
| `SPEC-F001-01` | Hỗ trợ SegmentedControl chuyển đổi giữa SSO và Tài khoản | `OK` | repo:app/tests/unit/auth.test.mjs:90 | Verify Gate 14/14 tests PASS |
| `SPEC-F001-02` | Tab SSO: Tìm trường tiếng Việt không dấu, redirect cổng SSO | `OK` | repo:app/tests/unit/auth.test.mjs:32 | Verify Gate 14/14 tests PASS |
| `SPEC-F001-03` | Tab Tài khoản: Xác thực mã trường, email, mật khẩu ẩn/hiện | `OK` | repo:app/tests/unit/auth.test.mjs:8 | Verify Gate 14/14 tests PASS |
| `SPEC-F001-04` | Chống dò quét tài khoản, điều hướng an toàn ?next= | `OK` | repo:app/tests/unit/auth.test.mjs:74 | Verify Gate 14/14 tests PASS |

## Liên quan

- Phân hệ cha: [Cổng & Xác thực](../overview/module-m7-dang-nhap.md)
- Tổng quan hệ thống: [Tổng quan School Operating Portal](../overview/project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
