---
title: "Phân hệ M5: Quản Trị Nhà Trường"
type: overview
sources:
  - docs/PRD_School_Operating_Portal_VI.md
updated: 2026-11-04
---

# Phân hệ M5: Quản Trị Nhà Trường

## Tóm tắt

Quản trị dữ liệu gốc trường học (học sinh 360°, giáo viên, lớp, môn, khối), vận hành tri thức (bảng thông tin, bình chọn, thực đơn GTIN, điểm danh NV, sổ tay) và ý kiến, lịch, niên khóa, lưu trữ.

Phân hệ bao gồm **14 sub-modules** được quản lý chặt chẽ theo kỷ luật Harness Loop.

## Bản đồ

| Mã FID | Mã Phân hệ | Tên Màn hình / Sub-module | Độ ưu tiên | Route |
|---|---|---|---|---|
| `F004` | `M5/SM13` | [Cấu hình Niên khóa & Học kỳ](../screens/m5-sm13-nam-hoc.md) | `P0` | `/setting/season` |
| `F005` | `M5/SM5` | [Quản lý Cây Khối Lớp](../screens/m5-sm5-khoi-lop.md) | `P0` | `/school/grades` |
| `F006` | `M5/SM3` | [Quản lý Lớp học (Chính khóa & Ngoại khóa)](../screens/m5-sm3-lop-hoc.md) | `P0` | `/school/class` |
| `F007` | `M5/SM1` | [Hồ sơ Học sinh 360° & Chuyển lớp](../screens/m5-sm1-hoc-sinh.md) | `P0` | `/school/kid` |
| `F008` | `M5/SM2` | [Danh bạ Giáo viên & Phân quyền Kiểm duyệt](../screens/m5-sm2-giao-vien.md) | `P0` | `/school/teacher` |
| `F024` | `M5/SM4` | [Danh mục Môn học & Phân công Giảng dạy](../screens/m5-sm4-mon-hoc.md) | `P1` | `/school/subject` |
| `F025` | `M5/SM8` | [Kế hoạch Thực đơn Tuần & Nguồn gốc Thực phẩm GTIN](../screens/m5-sm8-thuc-don.md) | `P1` | `/school/menu` |
| `F026` | `M5/SM9` | [Điểm danh Nhân viên 1 chạm & Phê duyệt Nghỉ phép](../screens/m5-sm9-diem-danh-nv.md) | `P1` | `/school/staff-attendance` |
| `F030` | `M5/SM6` | [Bảng thông tin & Lên lịch Gửi Thông báo](../screens/m5-sm6-bang-thong-tin.md) | `P2` | `/announcement` |
| `F031` | `M5/SM7` | [Bình chọn & Khảo sát Ý kiến Phụ huynh (Polls)](../screens/m5-sm7-binh-chon.md) | `P2` | `/school/poll` |
| `F032` | `M5/SM10` | [Sổ tay Phụ huynh Cây Tri thức 2 cấp (Handbook)](../screens/m5-sm10-so-tay-ph.md) | `P2` | `/school/handbook` |
| `F033` | `M5/SM11` | [Hòm thư Góp ý Phụ huynh & Thảo luận 2 chiều](../screens/m5-sm11-gop-y.md) | `P2` | `/school/feedback` |
| `F034` | `M5/SM12` | [Lịch Sự kiện & Ngày nghỉ Trường học (Calendar)](../screens/m5-sm12-lich-su-kien.md) | `P2` | `/setting/holidays` |
| `F035` | `M5/SM14` | [Kho Lưu trữ Học sinh Thôi học / Rút hồ sơ (Archive)](../screens/m5-sm14-luu-tru.md) | `P2` | `/setting/kid/archived` |

## Liên quan

- [Tổng quan School Operating Portal](project-overview.md)
- [Mục lục LLM Wiki](../../index.md)
- [Quy chuẩn SCHEMA](../../SCHEMA.md)
