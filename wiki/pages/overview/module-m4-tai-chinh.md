---
title: "Phân hệ M4: Quản Trị Tài Chính & Học Phí"
type: overview
sources:
  - docs/PRD_School_Operating_Portal_VI.md
updated: 2026-11-04
---

# Phân hệ M4: Quản Trị Tài Chính & Học Phí

## Tóm tắt

Quản lý toàn diện hóa đơn học phí VietQR động, 24 khoản phí Master, biểu phí lớp, phiếu chi nội bộ, đối soát ngân hàng, báo cáo thu và chính sách miễn giảm linh hoạt.

Phân hệ bao gồm **7 sub-modules** được quản lý chặt chẽ theo kỷ luật Harness Loop.

## Bản đồ

| Mã FID | Mã Phân hệ | Tên Màn hình / Sub-module | Độ ưu tiên | Route |
|---|---|---|---|---|
| `F011` | `M4/SM3` | [Danh mục Khoản phí Master (24 khoản thu)](../screens/m4-sm3-khoan-phi.md) | `P1` | `/school/school-fees` |
| `F012` | `M4/SM4` | [Quản lý Biểu phí theo Lớp học (Tuition Management)](../screens/m4-sm4-quan-ly-hoc-phi.md) | `P1` | `/school/tuition-management` |
| `F014` | `M4/SM8` | [Chính sách Miễn giảm & Động cơ Tự động Áp dụng Mức cao nhất](../screens/m4-sm8-mien-giam.md) | `P1` | `/school/discount` |
| `F015` | `M4/SM1` | [Lập Hóa đơn Học phí & Thu phí VietQR Động](../screens/m4-sm1-hoc-phi.md) | `P1` | `/school/fee` |
| `F016` | `M4/SM5` | [Quản lý Phiếu chi Nội bộ (Expenses)](../screens/m4-sm5-khoan-chi.md) | `P1` | `/school/expenses` |
| `F017` | `M4/SM2` | [Đối soát Giao dịch Ngân hàng & Cổng Thanh toán](../screens/m4-sm2-doi-soat.md) | `P1` | `/school/reconciliation` |
| `F018` | `M4/SM6` | [Báo cáo Thu Học phí & Tỷ lệ Hoàn thành](../screens/m4-sm6-bao-cao-hoc-phi.md) | `P1` | `/reports/fee/overview` |

## Liên quan

- [Tổng quan School Operating Portal](project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
- [Quy chuẩn SCHEMA](../../SCHEMA.md)
