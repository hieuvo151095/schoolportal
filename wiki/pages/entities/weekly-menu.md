---
title: Thực Thể Thực Đơn Dinh Dưỡng Tuần
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-018-school-menu/epic.md
spec_ids:
  - NT-09
updated: 2026-11-05
---

# Thực Thể Thực Đơn Dinh Dưỡng Tuần

## Định nghĩa
Đại diện cho khẩu phần ăn bán trú của học sinh theo từng ngày trong tuần (từ Thứ Hai đến Thứ Sáu/Thứ Bảy), phân theo từng bữa ăn (bữa sáng, bữa trưa, bữa phụ xế chiều) và theo từng khối tuổi/lớp học.

## Thuộc tính & Quy tắc nghiệp vụ
- Khung thời gian: Theo tuần học, cho phép lập trước tối đa 8 tuần tiếp theo (`max_future_weeks = 8`).
- Chi tiết bữa ăn: Tên món ăn, thành phần dinh dưỡng, cảnh báo dị ứng thực phẩm (nếu có).
- Hỗ trợ tải lên thực đơn qua file Excel mẫu hoặc nhập trực tiếp trên lưới giao diện.
- Trạng thái công bố: Bản nháp -> Đã duyệt -> Đã công bố tới phụ huynh. Khi công bố, gửi thông báo tới phụ huynh các lớp liên quan.

## Quan hệ
- Áp dụng cho một hoặc nhiều [Lớp học](classroom.md) hoặc [Khối lớp](grade-level.md).
- Kết nối logic với [Khấu trừ hoàn tiền ăn](meal-refund-credit.md) khi học sinh có suất ăn trong thực đơn nhưng nghỉ học có phép.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-09 | Lập và công bố thực đơn dinh dưỡng theo tuần bảo đảm an toàn vệ sinh thực phẩm | Type `Menu`, giao diện tạo thực đơn và Redux slice | MISSING | repo:app/src/types/menu.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Màn hình thực đơn](../screens/m5-sm8-thuc-don.md)
- [Luồng lập thực đơn dinh dưỡng](../flows/fl-lap-thuc-don-dinh-duong.md)
