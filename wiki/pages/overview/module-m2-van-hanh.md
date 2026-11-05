---
title: "Phân hệ M2: Vận Hành Lớp Học"
type: overview
sources:
  - docs/PRD_School_Operating_Portal_VI.md
updated: 2026-11-04
---

# Phân hệ M2: Vận Hành Lớp Học

## Tóm tắt

Tập trung các nghiệp vụ hàng ngày của giáo viên và học sinh: điểm danh đón/trả, bảng tin hoạt động, thư viện ảnh AI, trao đổi phụ huynh và báo cáo vận hành.

Phân hệ bao gồm **6 sub-modules** được quản lý chặt chẽ theo kỷ luật Harness Loop.

## Bản đồ

| Mã FID | Mã Phân hệ | Tên Màn hình / Sub-module | Độ ưu tiên | Route |
|---|---|---|---|---|
| `F009` | `M2/SM1` | [Điểm danh Học sinh Hằng ngày (Đón / Trả / Sức khỏe)](../screens/m2-sm1-diem-danh.md) | `P0` | `/class/[classId]/attendance` |
| `F010` | `M2/SM2` | [Bảng tin Hoạt động Lớp học](../screens/m2-sm2-hoat-dong.md) | `P0` | `/class/[classId]/activity` |
| `F022` | `M2/SM3` | [Thư viện Media & Nhận diện Khuôn mặt AI](../screens/m2-sm3-thu-vien.md) | `P1` | `/class/[classId]/media` |
| `F023` | `M2/SM4` | [Kênh Trao đổi Tin nhắn Phụ huynh](../screens/m2-sm4-trao-doi.md) | `P1` | `/conversations` |
| `F028` | `M2/SM5` | [Báo cáo Điểm danh Tháng Học sinh & Nhân viên](../screens/m2-sm5-bao-cao-diem-danh.md) | `P2` | `/reports/attendance` |
| `F029` | `M2/SM6` | [Báo cáo Mở rộng theo Mẫu Động](../screens/m2-sm6-bao-cao-mo-rong.md) | `P2` | `/reports/extended` |

## Liên quan

- [Tổng quan School Operating Portal](project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
- [Quy chuẩn SCHEMA](../../SCHEMA.md)
