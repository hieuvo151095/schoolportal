---
title: Hóa Đơn Học Phí (Tuition Invoice)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-tech-architecture-blueprint.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-01
  - TC-02
  - TC-22
  - TC-23
updated: 2026-11-05
---

# Hóa Đơn Học Phí (Tuition Invoice)

## Định nghĩa
Thực thể Hóa đơn học phí thể hiện nghĩa vụ tài chính định kỳ (theo tháng hoặc học kỳ) của học sinh đối với nhà trường, bao gồm học phí chính khóa, tiền ăn, tiền dịch vụ, các khoản miễn giảm, hoàn tiền ăn khấu trừ, và hỗ trợ cấu trúc Sub-invoice phân rã ngoại khóa.

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| TC-01 | Tích hợp mã VietQR động chứa số tài khoản trường, số tiền chính xác và mã hóa đơn duy nhất | Phụ huynh quét mã thanh toán tự động khớp lệnh |
| TC-01 | Trạng thái hóa đơn: `draft` (Nháp), `issued` (Đã phát hành), `partial_paid` (Nộp một phần), `paid` (Đã thanh toán đủ), `overdue` (Quá hạn), `cancelled` (Đã hủy), `frozen_under_review` (Đóng băng chờ tra soát) | Quản lý bằng Finite State Machine (FSM) |
| TC-01 | Phân rã Sub-Invoice lớp ngoại khóa (OQ-14): Dòng phí ngoại khóa định danh `is_separable = true`, cho phép thanh toán riêng hoặc tách thành hóa đơn con độc lập (`INV-EXT-...`) khi phụ huynh từ chối đóng | Chi tiết tại [Điều phối ngoại khóa](../concepts/extracurricular-billing-scheduling.md) |
| TC-02 | Tự động tính và hiển thị dòng khấu trừ hoàn tiền ăn ngày nghỉ có phép tháng M vào hóa đơn tháng M+1 | Huy hiệu xanh `"Hoàn tiền: -X đ"` |
| TC-02 | Áp dụng số dư tín dụng `credit_balance` từ kỳ trước; nếu hoàn thừa tiếp tục sinh `credit_balance` mới | Hóa đơn không bao giờ âm trên cổng thanh toán |
| TC-01 | Xử lý Race condition: Khóa `SELECT ... FOR UPDATE`; nếu hóa đơn đã `cancelled` mà nhận tiền VietQR, giao dịch chuyển vào `UNMATCHED_SUSPENSE_POOL` | Kế toán 1-chạm kết chuyển Credit Balance hoặc chi hoàn |
| TC-01 | Bảo toàn công nợ: Hóa đơn chưa thanh toán gắn chặt với `student_id`, độc lập với trạng thái đóng/lưu trữ của lớp học | Mang công nợ sang niên khóa mới (Carried-over Debt) |
| TC-01 | Hủy hóa đơn tương lai khi thôi học giữa kỳ (OQ-17): Khi học sinh rút hồ sơ, hệ thống tự động quét và hủy vĩnh viễn các hóa đơn dự kiến chưa đến hạn | Tránh phát sinh công nợ ảo |
| TC-01 | Giao dịch VietQR bất thường thừa/thiếu & Đóng băng tra soát (OQ-18): Chuyển thừa kết chuyển Credit Balance; chuyển thiếu vào `partial_paid` và sinh lại mã VietQR nợ; tra soát ngân hàng chuyển sang `frozen_under_review` chặn xuất hóa đơn điện tử VAT | Xem [Kiến trúc VietQR động](../concepts/vietqr-dynamic-reconciliation.md) |
| TC-01 | Học sinh nhập học giữa tháng Prorated (OQ-22): Tự động tính học phí theo tỷ lệ ngày học còn lại trong tháng và tiền ăn theo số ngày ăn thực tế còn lại từ ngày nhập học đến cuối tháng | Phí trọn gói ban đầu tính nguyên giá |
| TC-01 | Hóa đơn riêng lẻ độc lập cho từng học sinh (OQ-22): Hệ thống chỉ tạo hóa đơn riêng lẻ cho từng học sinh, tuyệt đối không gộp chung hóa đơn gia đình; mỗi học sinh sở hữu mã hóa đơn riêng, mã VietQR động độc lập và gạch nợ riêng biệt | Chuẩn hóa VAT và hạch toán kế toán |
| TC-02 | Chốt dữ liệu điểm danh tự động cuối tháng (OQ-21): Đợt hóa đơn tháng M+1 tự động truy xuất dữ liệu hoàn tiền ăn từ tháng M sau khi hệ thống tự động đóng băng sổ điểm danh vào 23:59:59 ngày cuối tháng | Tránh xung đột sửa điểm danh |
| TC-01 | Toàn bộ giao dịch cập nhật trạng thái hóa đơn bắt buộc sử dụng Pessimistic Row Lock (`SELECT ... FOR UPDATE`) trong CSDL | Tuân thủ kiến trúc kiểm soát đồng thời |
| TC-22 | Quy tắc xác nhận thanh toán thủ công (ADR-036): Trong modal Xác nhận thanh toán, dropdown phương thức chỉ có duy nhất 1 tùy chọn là "Tiền mặt". Các kênh thanh toán điện tử được đối soát tự động qua webhook cổng thanh toán | Bảo vệ tính toàn vẹn của sổ kế toán |
| TC-01 | Mẫu in chuẩn PHIẾU BÁO THU TIỀN (ADR-037): Bản in hóa đơn tuân thủ cấu trúc 7 cột (STT, Nội dung, ĐVT, Số tiền, Số lượng, Khấu trừ, Thành tiền), khối logo-tiêu đề-VietQR cân đối, ghi chú thanh toán ECO Me và 3 chữ ký (Kế toán, Thủ quỹ, Hiệu trưởng) trên 1 trang A4 | Bản in chuẩn doanh nghiệp |
| TC-23 | Quy tắc phân bổ thanh toán dứt điểm theo dòng khoản thu (ADR-038): Mọi khoản thanh toán phải quyết toán trọn vẹn 100% cho từng dòng khoản thu cụ thể; dòng nào đủ tiền chuyển sang "Đã thanh toán" (xanh lá), cấm thu lơ lửng không gán khoản thu | Minh bạch đối soát & hoàn phí |

## Quan hệ
- Thuộc về một [Hồ sơ học sinh 360](student-profile.md).
- Chứa các dòng khoản thu từ [Danh mục khoản phí](fee-catalog-item.md).
- Áp dụng các dòng [Chính sách miễn giảm](discount-policy.md) và [Khấu trừ hoàn tiền ăn](meal-refund-credit.md).
- Khớp lệnh giao dịch trong [Màn hình đối soát](../screens/m4-sm2-doi-soat.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-01 | Lập hóa đơn học phí tháng cho học sinh tích hợp mã VietQR động chuyển khoản chính xác | Frontend prototype hiển thị VietQR tĩnh, chưa có API sinh mã động | MISSING | repo:app/src/features/finance/ |
| TC-02 | Tự động rà soát ngày nghỉ có phép tháng M và khấu trừ tiền ăn vào hóa đơn tháng M+1 | Chưa có batch job tự động tạo dòng hoàn tiền ăn vào hóa đơn | MISSING | repo:app/src/features/finance/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-02, OQ-09, OQ-14, OQ-17, OQ-18, OQ-21, OQ-22).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md)
- [Kiến trúc thanh toán VietQR động](../concepts/vietqr-dynamic-reconciliation.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Màn hình học phí](../screens/m4-sm1-hoc-phi.md)
- [Luồng lập và phát hành hóa đơn](../flows/fl-lap-phat-hanh-hoa-don.md)
