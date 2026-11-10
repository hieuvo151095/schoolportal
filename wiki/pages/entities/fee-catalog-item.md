---
title: Danh Mục Khoản Phí (Fee Catalog Item)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-03
  - TC-04
  - TC-24
updated: 2026-11-10
---

# Danh Mục Khoản Phí (Fee Catalog Item)

## Định nghĩa
Thực thể Danh mục khoản phí định nghĩa toàn bộ các loại phí, đơn giá chuẩn, chu kỳ thu và tính chất (bắt buộc hay tự chọn) được áp dụng trong toàn trường và theo từng khối/lớp học, bao gồm các cấu hình biểu phí linh hoạt, phân rã hóa đơn cho lớp ngoại khóa và cấu hình xuất hóa đơn điện tử 2 bước an toàn (TC-24).

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| TC-03 | Danh mục toàn trường quản lý chuẩn 24 khoản thu (3 khoản hệ thống cốt lõi: Học phí chính khóa, Tiền ăn bán trú, Phí cơ sở vật chất + 21 khoản tùy chỉnh) | Thuộc tính phân loại: Bắt buộc hoặc Tự chọn |
| TC-03 | Đơn vị tính đa dạng: theo tháng, theo kỳ, theo năm, theo ngày (ví dụ: Tiền ăn tính theo ngày để phục vụ hoàn tiền) | Định dạng tiền tệ có dấu chấm phân cách hàng nghìn |
| TC-04 | Cấu hình biểu phí theo lớp: Cho phép gán tập hợp con các khoản thu và đơn giá riêng biệt cho từng lớp học | Khi lập hóa đơn, chỉ nạp danh mục phí thuộc lớp đó |
| TC-04 | Biểu phí ngoại khóa & Phân rã Sub-Invoice (OQ-14): Hỗ trợ tính phí trọn gói theo kỳ (`TERM_FIXED`) hoặc tính theo số buổi thực tế (`PER_SESSION`); các khoản phí ngoại khóa gắn cờ `is_separable = true` để hỗ trợ tách hóa đơn độc lập | Chi tiết tại [Điều phối ngoại khóa](../concepts/extracurricular-billing-scheduling.md) |
| TC-24 | Trạng thái Xuất HĐĐT hiển thị tinh gọn "Có" / "Không" kèm icon mũi tên xuống `chevron-down`. Click mở menu chọn option; chỉ khi chọn option khác mới bật pop-up confirm xác nhận | ADR-039 / repo:app/src/modules/finance/catalog/FeeCatalogTable.tsx |

## Quan hệ
- Được gán vào các [Lớp học](classroom.md).
- Làm mẫu nạp cho các dòng thu trong [Hóa đơn học phí](tuition-invoice.md).
- Là đối tượng áp dụng của [Chính sách miễn giảm](discount-policy.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-03 | Quản lý danh mục 24 khoản thu toàn trường gồm 3 khoản hệ thống và 21 khoản tùy chỉnh | Danh mục khoản thu mới lưu ở dạng dữ liệu mẫu trong state frontend | MISSING | repo:app/src/features/finance/ |
| TC-04 | Cấu hình gói biểu phí và đơn giá áp dụng riêng biệt cho từng lớp học hoặc khối lớp | Chưa có API lưu trữ cấu hình biểu phí gán theo từng lớp | MISSING | repo:app/src/features/finance/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-14).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Màn hình khoản phí](../screens/m4-sm3-khoan-phi.md)
- [Hóa đơn học phí](tuition-invoice.md)
