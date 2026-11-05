---
title: "Phân hệ M7: Cổng Xác Thực & Đăng Nhập"
type: overview
sources:
  - docs/PRD_School_Operating_Portal_VI.md
updated: 2026-11-04
---

# Phân hệ M7: Cổng Xác Thực & Đăng Nhập

## Tóm tắt

Cổng vào hệ thống duy nhất, hỗ trợ 2 phương thức xác thực độc lập: SSO Sở GD&ĐT và Tài khoản quản trị Finviet.

Phân hệ bao gồm **1 sub-modules** được quản lý chặt chẽ theo kỷ luật Harness Loop.

## Bản đồ

| Mã FID | Mã Phân hệ | Tên Màn hình / Sub-module | Độ ưu tiên | Route |
|---|---|---|---|---|
| `F001` | `M7/SM2` | [Cổng Đăng nhập (SSO Sở GD&ĐT & Tài khoản Finviet)](../screens/m7-sm2-dang-nhap.md) | `P0` | `/signin, /sso/login` |

## Liên quan

- [Tổng quan School Operating Portal](project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
- [Quy chuẩn SCHEMA](../../SCHEMA.md)
