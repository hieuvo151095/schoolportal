---
title: "Phân hệ M6: Cấu Hình Hệ Thống"
type: overview
sources:
  - docs/PRD_School_Operating_Portal_VI.md
updated: 2026-11-04
---

# Phân hệ M6: Cấu Hình Hệ Thống

## Tóm tắt

Thiết lập cấu hình vận hành cơ sở trường học: hồ sơ trường, tài khoản người dùng, cấu hình học phí & hoàn tiền nghỉ học M+1, nhận diện khuôn mặt mẫu, feature flags và quy tắc thông báo.

Phân hệ bao gồm **6 sub-modules** được quản lý chặt chẽ theo kỷ luật Harness Loop.

## Bản đồ

| Mã FID | Mã Phân hệ | Tên Màn hình / Sub-module | Độ ưu tiên | Route |
|---|---|---|---|---|
| `F002` | `M6/SM1` | [Hồ sơ Trường học & Thiết lập Vận hành](../screens/m6-sm1-truong.md) | `P0` | `/school/info` |
| `F003` | `M6/SM2` | [Quản lý Tài khoản & Phân quyền Quản trị](../screens/m6-sm2-tai-khoan.md) | `P0` | `/setting/users` |
| `F013` | `M6/SM3` | [Cấu hình Hoàn tiền Nghỉ học & Cổng Thanh toán](../screens/m6-sm3-hoc-phi.md) | `P1` | `/setting/fee` |
| `F036` | `M6/SM4` | [Quản lý Dữ liệu Khuôn mặt Học sinh (Face ID)](../screens/m6-sm4-nhan-dien.md) | `P2` | `/setting/face-recognition` |
| `F037` | `M6/SM5` | [Quản lý Bật/Tắt Tính năng Trường học (Feature Flags)](../screens/m6-sm5-tinh-nang.md) | `P2` | `/setting/activity` |
| `F038` | `M6/SM6` | [Cấu hình Lịch & Quy tắc Thông báo Toàn trường](../screens/m6-sm6-thong-bao.md) | `P2` | `/setting/notification` |

## Liên quan

- [Tổng quan School Operating Portal](project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
- [Quy chuẩn SCHEMA](../../SCHEMA.md)
