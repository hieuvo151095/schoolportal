---
title: Cơ Chế Hoàn Tiền Ăn Tự Động (Meal Refund Engine)
type: concept
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-02
  - TC-08
  - VH-04
updated: 2026-11-05
---

# Cơ Chế Hoàn Tiền Ăn Tự Động (Meal Refund Engine)

## Định nghĩa
Cơ chế hoàn tiền ăn tự động là giải pháp liên thông dữ liệu giữa phân hệ Điểm danh (M2) và phân hệ Tài chính (M4), tự động tính toán số tiền hoàn trả cho học sinh nghỉ học có phép và khấu trừ trực tiếp vào hóa đơn học phí của kỳ thu tiếp theo (M+1).

## Quy tắc
1. **Rà soát ngày nghỉ hợp lệ & Điều kiện hoàn tiền ăn (OQ-02, OQ-20):**
   - Hệ thống quét dữ liệu điểm danh tháng M của học sinh khi tạo hóa đơn tháng M+1.
   - **Quy tắc hoàn tiền ăn CHỈ áp dụng trong các trường hợp sau:**
     - *(a) Rơi vào các ngày nghỉ lễ, Tết* theo quy định của nhà nước hoặc Sở GD&ĐT.
     - *(b) Nhà trường chủ động cho nghỉ:* Toàn trường hoặc từng lớp nghỉ do thiên tai bão lũ, dịch bệnh, sửa chữa cơ sở vật chất hoặc sự cố bất khả kháng.
     - *(c) Phụ huynh có đơn xin nghỉ học cả ngày hợp lệ:* Đơn được gửi trên hệ thống và được nhà trường duyệt trước giờ chốt báo vắng hằng ngày (08:30 sáng).
     - *(d) Đón về nửa ngày do Y TẾ (OQ-10):* Học sinh đến trường nhưng sốt cao $\ge 38.5^\circ\text{C}$ hoặc có sự cố y tế đột xuất được Y tế trường xác nhận và phụ huynh đón về trước 10:30 sáng $\rightarrow$ Hoàn **50% đơn giá tiền ăn ngày đó** (khấu trừ bữa xế/chiều chưa chế biến và chưa phân phối). Đón về sau 11:30 sáng (đã ăn trưa xong) $\rightarrow$ Hoàn 0%.
   - **ĐẶC BIỆT LƯU Ý — ĐÓN SỚM CHỦ ĐỘNG (OQ-20):** Đối với các trường hợp Phụ huynh **chủ động đón sớm sau khi học sinh đã đến trường** (Early Departure vì việc gia đình, về quê, khám bệnh tư...) thì **TUYỆT ĐỐI KHÔNG HOÀN TIỀN GÌ CẢ (hoàn 0%)**, do nhà bếp đã tính toán và hoàn tất việc sơ chế nguyên liệu cho toàn bộ suất ăn trong ngày.
2. **Công thức tính hoàn tiền & Snapshot đơn giá chuyển lớp:**
   - *Học sinh ổn định một lớp:* 
     $$\text{Số tiền hoàn} = \text{Số ngày vắng có phép} \times \text{Đơn giá suất ăn/ngày} \times \text{Tỷ lệ hoàn tiền (\%)}.$$
   - *Học sinh chuyển lớp giữa tháng (Snapshot lịch sử):* Đơn giá suất ăn hoàn trả tính chính xác theo lớp học mà học sinh đang theo học tại thời điểm của từng ngày vắng có phép, không áp đơn giá cào bằng của lớp mới:
     $$\text{Số tiền hoàn} = \sum_{c \in \text{Classes}} \left( \text{Số ngày vắng có phép tại lớp } c \times \text{Đơn giá tiền ăn lớp } c \times \text{Tỷ lệ hoàn} \right).$$
3. **Tiền ăn cho học sinh nhập học giữa tháng (Prorated - OQ-22):**
   - Khi học sinh mới nhập học vào giữa tháng, tiền ăn tháng đầu tiên được tính tự động theo **số ngày ăn thực tế còn lại** từ ngày bắt đầu học chính thức (`enrollment_date`) đến ngày làm việc cuối cùng của tháng:
     $$\text{Tiền ăn tháng đầu} = \text{Số ngày ăn thực tế còn lại} \times \text{Đơn giá suất ăn/ngày}.$$
   - *Xử lý biên ngày nghỉ/lễ:* Nếu ngày bắt đầu học (`enrollment_date`) rơi vào ngày thứ Bảy, Chủ nhật hoặc ngày nghỉ lễ theo quy định nhà trường, ngày tính tiền ăn bắt đầu từ ngày làm việc và ăn bán trú thực tế đầu tiên. "Số ngày ăn thực tế còn lại" chỉ đếm các ngày bếp hoạt động thực tế đến hết tháng (loại trừ cuối tuần và ngày lễ).
4. **Cơ chế đóng băng dữ liệu điểm danh tự động cuối tháng (Monthly Auto-Freeze - OQ-21):**
   - Không cần nút nộp thủ công. Vào 23:59:59 ngày cuối tháng, trước khi engine hoàn tiền ăn khởi chạy để tính phí cho tháng tiếp theo (M+1), hệ thống **TỰ ĐỘNG KHÓA (Freeze / Read-Only)** toàn bộ dữ liệu điểm danh tháng cũ, ngăn chặn mọi sửa đổi trái phép làm sai lệch số liệu khấu trừ.
5. **Cơ chế Credit Balance chống hoàn tiền âm (OQ-09):**
   - Hóa đơn tuyệt đối không xuất số tiền phải trả âm trên cổng thanh toán (`amount_due = \max(0, \text{gross} - \text{discounts} - \text{refund})`).
   - Nếu học sinh nghỉ có phép cả tháng dẫn đến số tiền hoàn lớn hơn tổng học phí tháng M+1: Phần hoàn tiền thặng dư $(\text{refund} + \text{discounts} - \text{gross} > 0)$ được tự động kết chuyển thành **Số dư tín dụng học sinh (`credit_balance`)**.
   - Số dư tín dụng này tự động mang sang các kỳ tiếp theo (M+2, M+3...) để cấn trừ vào hóa đơn tương lai. Khi học sinh thôi học, chuyển trường hoặc tốt nghiệp, nhà trường xuất Phiếu chi hoàn trả trực tiếp vào tài khoản ngân hàng của phụ huynh theo đúng quy định tài chính.
6. **Hiển thị minh bạch trên hóa đơn:** Dòng hoàn tiền hiển thị huy hiệu xanh `"Hoàn tiền: -X đ"` chi tiết theo từng lớp (nếu có chuyển lớp) và số dư tín dụng còn dư (nếu có).

## Áp dụng ở đâu
- [Điểm danh hằng ngày](../entities/attendance-daily.md)
- [Khấu trừ hoàn tiền ăn](../entities/meal-refund-credit.md)
- [Hóa đơn học phí](../entities/tuition-invoice.md)
- [Màn hình học phí](../screens/m4-sm1-hoc-phi.md)

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-02 | Tự động rà soát ngày nghỉ có phép tháng M và khấu trừ tiền ăn vào hóa đơn tháng M+1 | Chưa có service tính toán tự động khấu trừ M+1 | MISSING | repo:app/src/features/finance/ |
| TC-08 | Tính toán số tiền hoàn tiền ăn theo tỷ lệ cấu hình tham số tại Cấu hình học phí | Chưa có formula engine hoàn tiền ăn | MISSING | repo:app/src/features/finance/ |
| VH-04 | Báo vắng học sinh hàng loạt và phân loại vắng có phép hoặc không phép | Giao diện prototype điểm danh chưa lưu trạng thái hoàn tiền | MISSING | repo:app/src/features/attendance/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-02, OQ-09, OQ-10, OQ-20, OQ-21, OQ-22).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Khấu trừ hoàn tiền ăn](../entities/meal-refund-credit.md)
- [Luồng báo vắng và hoàn tiền](../flows/fl-bao-vang-hoan-tien.md)
