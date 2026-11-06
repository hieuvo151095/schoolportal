---
title: Luồng Báo Vắng Học Sinh & Tự Động Khấu Trừ Hoàn Tiền Ăn
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-04
  - TC-02
  - TC-08
updated: 2026-11-05
---

# Luồng Báo Vắng Học Sinh & Tự Động Khấu Trừ Hoàn Tiền Ăn

## Mục tiêu
Ghi nhận tình trạng nghỉ học của học sinh (đơn xin phép từ phụ huynh, giáo viên ghi nhận hoặc đón về nửa ngày do y tế), tự động tổng hợp số ngày vắng có phép trong tháng M theo snapshot đơn giá lớp học tại thời điểm vắng, và khấu trừ tiền ăn bán trú vào hóa đơn học phí tháng M+1 (kết chuyển Credit Balance nếu hoàn thừa) mà không cần kế toán tính thủ công.

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | Phụ huynh / GV | [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md) | Gửi đơn báo vắng trước 08:30 sáng hoặc đánh dấu Vắng có phép trên lưới điểm danh | Ghi nhận bản ghi điểm danh trạng thái vắng có phép hợp lệ (`excused_absence`) | VH-04 |
| 1b | GV / Y tế trường | [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md) | Học sinh sốt cao $\ge 38.5^\circ\text{C}$ đón về trước 10:30 sáng: chọn "Đón về nửa ngày do y tế" | Ghi nhận trạng thái `half_day_leave`, kích hoạt hoàn 50% tiền ăn ngày đó | VH-02 |
| 2 | Hệ thống | Background Service | Quét điểm danh định kỳ sau khi hệ thống tự động đóng băng sổ điểm danh tháng cũ lúc 23:59:59 ngày cuối tháng (OQ-21), tổng hợp số ngày vắng có phép tháng M theo snapshot đơn giá lớp tại thời điểm vắng | Lưu tổng tiền hoàn theo từng lớp: $\sum (\text{ngày vắng} \times \text{đơn giá lớp} \times \text{tỷ lệ hoàn})$ | TC-08 |
| 3 | Kế toán | [Màn hình học phí](../screens/m4-sm1-hoc-phi.md) | Thực hiện tạo đợt hóa đơn học phí cho tháng tiếp theo (M+1) | Hóa đơn tự động sinh dòng giảm trừ tiền ăn `"Hoàn tiền: -X đ"` | TC-02 |
| 4 | Hệ thống | Billing Engine | Kiểm tra nếu tiền hoàn thặng dư $(\text{refund} + \text{discounts} > \text{gross})$ | Hóa đơn gán `amount_due = 0`, phần hoàn thừa kết chuyển thành `credit_balance` lưu vào hồ sơ học sinh | TC-02 |

## Quy tắc chặn / validation
- Chỉ những ngày nghỉ được báo vắng TRƯỚC giờ chốt báo vắng hằng ngày (cấu hình tại Cấu hình học phí, mặc định 08:30 sáng) mới được tính vào diện hoàn tiền ăn (TC-08).
- Ngày vắng không phép tuyệt đối không được hưởng chính sách hoàn tiền ăn (TC-02).
- **Quy tắc hoàn tiền nửa ngày do y tế (OQ-10):** Học sinh check-in sáng nhưng sốt cao $\ge 38.5^\circ\text{C}$ đón về trước 10:30 sáng được hoàn 50% tiền ăn; đón về sau 11:30 đã dùng bữa trưa thì hoàn 0% (TC-02, VH-02).
- **Quy tắc không hoàn tiền khi phụ huynh chủ động đón sớm (OQ-20):** Phụ huynh chủ động đón sớm giữa buổi sau khi học sinh đã đến trường thì TUYỆT ĐỐI KHÔNG HOÀN TIỀN GÌ CẢ (hoàn 0%). Tiền ăn chỉ hoàn khi: ngày nghỉ lễ, nhà trường cho nghỉ, có đơn xin nghỉ học cả ngày hợp lệ được duyệt trước 08:30 sáng, hoặc đón về nửa ngày trước 10:30 do sốt cao y tế (OQ-10).
- **Tự động đóng băng điểm danh trước khi quét hoàn tiền (OQ-21):** Không cần giáo viên nộp sổ thủ công. Dữ liệu điểm danh tháng cũ được tự động đóng băng (Read-Only) vào 23:59:59 ngày cuối tháng trước khi billing engine chạy, bảo đảm số liệu khấu trừ không bị biến động.
- **Snapshot đơn giá khi chuyển lớp giữa tháng (OQ-09):** Đơn giá tiền ăn hoàn trả gắn chặt với lớp học tại thời điểm ngày vắng phát sinh, không áp dụng đơn giá cào bằng của lớp mới (TC-08).
- **Chốt chặn Credit Balance chống hóa đơn âm (OQ-09):** Hóa đơn tuyệt đối không bao giờ xuất số âm trên cổng thanh toán. Toàn bộ tiền hoàn thừa được tự động lưu vào `credit_balance` của học sinh để cấn trừ vào các kỳ hóa đơn sau (TC-02).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-04 | Báo vắng học sinh hàng loạt và phân loại vắng có phép hoặc không phép | Prototype điểm danh chưa phân loại chặt chẽ vắng có phép và không phép | MISSING | repo:app/src/features/attendance/ |
| TC-02 | Tự động rà soát ngày nghỉ có phép tháng M và khấu trừ tiền ăn vào hóa đơn tháng M+1 | Chưa có service tự động quét điểm danh đưa vào hóa đơn M+1 | MISSING | repo:app/src/features/finance/ |
| TC-08 | Tính toán số tiền hoàn tiền ăn theo tỷ lệ cấu hình tham số tại Cấu hình học phí | Chưa có tham số cấu hình tỷ lệ hoàn tiền và hạn chốt báo vắng | MISSING | repo:app/src/features/finance/ |

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md)
- [Khấu trừ hoàn tiền ăn](../entities/meal-refund-credit.md)
- [Hóa đơn học phí](../entities/tuition-invoice.md)
- [Điểm danh hằng ngày](../entities/attendance-daily.md)
