---
title: "Phân hệ M3: Quản Lý Học Tập"
type: overview
sources:
  - docs/PRD_School_Operating_Portal_VI.md
updated: 2026-11-04
---

# Phân hệ M3: Quản Lý Học Tập

## Tóm tắt

Tiêu chuẩn hóa thời khóa biểu tuần, giao và chấm bài tập về nhà, cùng sổ điểm đánh giá định kỳ theo quy chuẩn của Bộ GD&ĐT.

Phân hệ bao gồm **3 sub-modules** được quản lý chặt chẽ theo kỷ luật Harness Loop.

## Bản đồ

| Mã FID | Mã Phân hệ | Tên Màn hình / Sub-module | Độ ưu tiên | Route |
|---|---|---|---|---|
| `F019` | `M3/SM1` | [Thời khóa biểu Tuần & Lịch sử Phiên bản](../screens/m3-sm1-thoi-khoa-bieu.md) | `P1` | `/school/schedule` |
| `F020` | `M3/SM2` | [Giao Bài tập về nhà & Theo dõi Nộp bài](../screens/m3-sm2-bai-tap.md) | `P1` | `/school/assignment` |
| `F021` | `M3/SM3` | [Sổ điểm & Đánh giá Học tập Định kỳ](../screens/m3-sm3-diem-danh-gia.md) | `P1` | `/school/scoreboard` |

## Liên quan

- [Tổng quan School Operating Portal](project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
- [Quy chuẩn SCHEMA](../../SCHEMA.md)
