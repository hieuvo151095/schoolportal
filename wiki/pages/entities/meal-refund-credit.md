---
title: Khấu Trừ Hoàn Tiền Ăn (Meal Refund Credit)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-02
  - TC-08
updated: 2026-11-05
---

# Khấu Trừ Hoàn Tiền Ăn (Meal Refund Credit)

## Định nghĩa
Thực thể lưu vết số tiền ăn bán trú được hoàn trả cho học sinh do có những ngày nghỉ học có phép hợp lệ trong tháng trước (tháng M), được dùng để cấn trừ trực tiếp vào hóa đơn học phí của tháng tiếp theo (tháng M+1).

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| TC-02 | Tự động sinh ra khi lập hóa đơn tháng M+1 bằng cách quét ngày vắng có phép tháng M từ bảng điểm danh | Không yêu cầu kế toán tính thủ công |
| TC-08 | Giá trị hoàn tiền = Số ngày vắng có phép $\times$ Đơn giá suất ăn/ngày $\times$ Tỷ lệ hoàn tiền cấu hình | Tỷ lệ hoàn tiền cấu hình tại Cấu hình học phí |
| TC-08 | Khi học sinh chuyển lớp giữa tháng: Lưu `rate_snapshot` và `origin_class_id` theo từng khoảng thời gian theo học | Tính đúng theo đơn giá từng lớp cũ |
| TC-02 | Đón về nửa ngày do y tế trước 10:30 sáng (`half_day_leave`): Được tính 0.5 ngày hoàn (50% tiền ăn ngày) | Bảo vệ quyền lợi học sinh khi ốm sốt đột xuất |
| TC-02 | Nếu số tiền hoàn vượt học phí hóa đơn M+1: Sinh bản ghi `credit_balance` cấn trừ tháng M+2 hoặc chi hoàn | Tuyệt đối không làm mất tiền thừa của phụ huynh |
| TC-02 | Được gán vào dòng tiền ăn của hóa đơn và hiển thị huy hiệu xanh: `"Hoàn tiền: -X đ"` | Minh bạch cho phụ huynh đối soát |
| TC-02 | Quy tắc không hoàn tiền khi đón sớm chủ động (OQ-20): Phụ huynh chủ động đón sớm sau khi học sinh đã đến trường KHÔNG hoàn tiền ăn (hoàn 0%). Suất ăn chỉ hoàn khi ngày lễ, trường cho nghỉ, có đơn nghỉ cả ngày hợp lệ hoặc y tế đón về trước 10:30 | Loại bỏ tranh chấp chi phí vận hành bếp ăn |
| TC-02 | Căn cứ chốt điểm danh tự động cuối tháng (OQ-21): Dữ liệu ngày nghỉ hoàn tiền ăn được khóa đóng băng tự động vào 23:59:59 ngày cuối tháng trước kỳ tính phí, bảo đảm không bị sửa đổi sai lệch | Kiểm soát toàn vẹn dữ liệu kế toán |

## Quan hệ
- Sinh ra từ các bản ghi [Điểm danh hằng ngày](attendance-daily.md).
- Thuộc về [Hồ sơ học sinh 360](student-profile.md).
- Được nhúng vào [Hóa đơn học phí](tuition-invoice.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-02 | Tự động rà soát ngày nghỉ có phép tháng M và khấu trừ tiền ăn vào hóa đơn tháng M+1 | Chưa có database entity và backend calculator hoàn tiền ăn | MISSING | repo:app/src/features/finance/ |
| TC-08 | Tính toán số tiền hoàn tiền ăn theo tỷ lệ cấu hình tham số tại Cấu hình học phí | Chưa có bảng cấu hình tỷ lệ hoàn tiền ăn trong CSDL | MISSING | repo:app/src/features/finance/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-02, OQ-09, OQ-10, OQ-20, OQ-21).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md)
- [Hóa đơn học phí](tuition-invoice.md)
- [Luồng báo vắng và hoàn tiền](../flows/fl-bao-vang-hoan-tien.md)
