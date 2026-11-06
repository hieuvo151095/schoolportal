---
title: Luồng Lập & Phát Hành Hóa Đơn Học Phí VietQR
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-tech-architecture-blueprint.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-01
  - TC-03
  - TC-04
updated: 2026-11-05
---

# Luồng Lập & Phát Hành Hóa Đơn Học Phí VietQR

## Mục tiêu
Cho phép kế toán viên tạo đợt thu học phí định kỳ theo lớp học hoặc toàn trường, tự động nạp danh mục khoản phí của từng lớp (bao gồm lớp chính khóa và ngoại khóa), áp dụng các chính sách miễn giảm và hoàn tiền ăn, hỗ trợ phân rã Sub-invoice và sinh mã VietQR động để phụ huynh thanh toán nhanh chóng.

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | Kế toán | [Màn hình học phí](../screens/m4-sm1-hoc-phi.md) | Chọn phạm vi thu (Khối, một hoặc nhiều lớp học), chọn kỳ thu và hạn nộp | Hệ thống nạp danh sách học sinh và biểu phí tương ứng | TC-04 |
| 2 | Kế toán | [Màn hình học phí](../screens/m4-sm1-hoc-phi.md) | Kiểm tra bảng dòng khoản thu (học phí chính khóa, tiền ăn theo snapshot lớp nếu chuyển lớp hoặc tính Prorated theo ngày ăn thực tế còn lại nếu nhập học giữa tháng OQ-22, phí ngoại khóa, khấu trừ hoàn tiền ăn căn cứ sổ điểm danh đã đóng băng cuối tháng OQ-21, số dư Credit Balance, miễn giảm anh chị em ruột OQ-23), bấm "Phát hành hóa đơn" | Hóa đơn chuyển trạng thái `issued`, tự động sinh mã VietQR động độc lập cho từng học sinh (không gộp gia đình - OQ-22); phần hoàn thừa kết chuyển thành Credit Balance kỳ sau | TC-01 |
| 3 | Phụ huynh | Mobile App / Portal | Mở chi tiết hóa đơn học phí của con và quét mã VietQR bằng ứng dụng ngân hàng | Chuyển khoản thành công, hệ thống tự động ghi nhận thanh toán `paid` | TC-01 |
| 4 | Kế toán / Phụ huynh | [Màn hình học phí](../screens/m4-sm1-hoc-phi.md) | Xử lý ngoại lệ: Phân rã khoản ngoại khóa hoặc xử lý thanh toán thiếu | Tách Sub-invoice ngoại khóa hoặc sinh lại VietQR nợ | TC-01 |

## Quy tắc chặn / validation
- Chỉ được phát hành hóa đơn khi tổng số tiền thanh toán $\ge 0$; nếu tiền hoàn lớn hơn học phí, đặt `amount_due = 0` và lưu phần chênh lệch vào `credit_balance` (TC-01, TC-02).
- **Quy định hóa đơn riêng lẻ độc lập cho từng học sinh (OQ-22):** Hệ thống CHỈ tạo hóa đơn riêng lẻ cho từng học sinh (`INV-{studentCode}-{YYYYMM}`), tuyệt đối không gộp chung nghĩa vụ tài chính của nhiều học sinh vào một hóa đơn gia đình. Mỗi học sinh sở hữu mã VietQR riêng biệt và quy trình gạch nợ độc lập.
- **Tính học phí và tiền ăn lẻ ngày nhập học giữa tháng (Prorated - OQ-22):** Chọn ngày bắt đầu học `enrollment_date`, tiền ăn tính theo số ngày ăn thực tế còn lại đến cuối tháng; học phí tính theo tỷ lệ ngày học còn lại so với ngày làm việc chuẩn. Nếu ngày bắt đầu rơi vào cuối tuần hoặc ngày lễ, bắt đầu tính từ ngày học/ăn bán trú thực tế đầu tiên; số ngày ăn chỉ đếm ngày bếp hoạt động thực tế.
- **Căn cứ dữ liệu hoàn tiền ăn đóng băng cuối tháng (OQ-21):** Số liệu ngày nghỉ có phép hoàn tiền ăn được truy xuất tự động từ sổ điểm danh tháng M sau khi hệ thống tự động kích hoạt đóng băng (Monthly Auto-Freeze) vào 23:59:59 ngày cuối tháng.
- **Phân rã Sub-Invoice lớp ngoại khóa (OQ-14):** Khoản phí ngoại khóa được cấu trúc là Sub-Invoice (`is_separable = true`). Nếu phụ huynh từ chối đóng ngoại khóa, hệ thống cho phép thanh toán một phần hoặc tách thành hóa đơn con độc lập (`INV-EXT-...`), chuyển hóa đơn chính khóa sang `PAID` mà không bị gián đoạn.
- **Xử lý chuyển thiếu & Sinh lại mã VietQR (OQ-18):** Nếu phụ huynh chuyển thiếu tiền, hóa đơn chuyển sang `PARTIAL_PAID`. Hệ thống tự động sinh lại mã VietQR động mới với payload bằng đúng số tiền còn nợ (`remaining_amount`) để phụ huynh quét mã thanh toán nốt.
- Chốt chặn Race condition: Khi kế toán bắt đầu thao tác Hủy hoặc Chỉnh sửa hóa đơn đã phát hành, hệ thống khóa dòng `FOR UPDATE` và lập tức vô hiệu hóa mã VietQR cũ. Giao dịch webhook thanh toán đến sau khi hóa đơn đã hủy được đưa vào `UNMATCHED_SUSPENSE_POOL` (TC-01).
- Trong quá trình ghi nhận thanh toán, bắt buộc sử dụng Pessimistic Row Lock (`FOR UPDATE`) để ngăn ngừa giao dịch kép hoặc sai lệch số dư (TC-01).
- Chốt chặn bảo toàn công nợ: Không xóa hoặc ẩn hóa đơn nợ của học sinh ngay cả khi lớp học cũ bị đóng/lưu trữ (TC-01).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-01 | Lập hóa đơn học phí tháng cho học sinh tích hợp mã VietQR động chuyển khoản chính xác | Chưa có API sinh mã VietQR động theo chuẩn NAPAS | MISSING | repo:app/src/features/finance/ |
| TC-03 | Quản lý danh mục 24 khoản thu toàn trường gồm 3 khoản hệ thống và 21 khoản tùy chỉnh | Danh mục khoản thu mới ở dạng mock tĩnh | MISSING | repo:app/src/features/finance/ |
| TC-04 | Cấu hình gói biểu phí và đơn giá áp dụng riêng biệt cho từng lớp học hoặc khối lớp | Chưa có logic gán biểu phí liên thông theo từng lớp | MISSING | repo:app/src/features/finance/ |

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Hóa đơn học phí](../entities/tuition-invoice.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Kiến trúc thanh toán VietQR động](../concepts/vietqr-dynamic-reconciliation.md)
- [Màn hình học phí](../screens/m4-sm1-hoc-phi.md)
