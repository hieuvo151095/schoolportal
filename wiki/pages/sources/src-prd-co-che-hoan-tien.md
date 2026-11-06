---
title: Đặc Tả Cơ Chế Hoàn Tiền Khi Nghỉ Học
type: source
sources:
  - raw/specs/prd-co-che-hoan-tien.md
  - repo:docs/prd/PRD_Co_Che_Hoan_Tien_Khi_Nghi_Hoc_VI.md
updated: 2026-11-05
---

# Đặc Tả Cơ Chế Hoàn Tiền Khi Nghỉ Học

## Thông tin nguồn
- **Tên tài liệu:** PRD Cơ Chế Hoàn Tiền Khi Nghỉ Học & Khấu Trừ Suất Ăn
- **Đường dẫn gốc:** `raw/specs/prd-co-che-hoan-tien.md` / `repo:docs/prd/PRD_Co_Che_Hoan_Tien_Khi_Nghi_Hoc_VI.md`
- **Phiên bản:** v1.0.0
- **Phạm vi:** Nghiệp vụ tính toán hoàn tiền ăn dựa trên dữ liệu điểm danh vắng có phép và kết chuyển sang đợt thu học phí tiếp theo

## Nội dung chính
Tài liệu định nghĩa chu trình khép kín giữa phân hệ Vận hành (Điểm danh hằng ngày) và phân hệ Tài chính (Hóa đơn học phí):
1. Điều kiện báo vắng hợp lệ: Phụ huynh phải gửi đơn xin nghỉ có phép qua ứng dụng trước giờ hạn chốt (mặc định 08:00 sáng ngày điểm danh) và được giáo viên chủ nhiệm phê duyệt.
2. Công thức tính tiền ăn hoàn trả:
   $$\text{Tiền hoàn} = \sum (\text{Số ngày nghỉ có phép hợp lệ} \times \text{Đơn giá suất ăn/ngày} \times \text{Tỷ lệ hoàn tiền ăn})$$
   Trong đó tỷ lệ hoàn tiền ăn được cấu hình tại trang Cấu hình học phí (thường là 100% hoặc theo chính sách từng trường).
3. Chu kỳ chốt số liệu và phê duyệt: Kế toán thực hiện chốt dữ liệu công nợ suất ăn vào ngày cuối cùng của tháng M.
4. Tự động kết chuyển sang hóa đơn tháng M+1: Hệ thống tự động sinh dòng giảm trừ âm (`-X.000 đ`) gắn mã tham chiếu ngày nghỉ lên hóa đơn học phí của tháng tiếp theo. Trường hợp học sinh thôi học/chuyển trường, sinh phiếu chi hoàn tiền trực tiếp.

## Mã yêu cầu được định nghĩa
| Mã | Tóm tắt quy tắc | Đoạn trong nguồn |
|---|---|---|
| TC-11 | Thiết lập điều kiện học sinh nghỉ học có phép hợp lệ để được khấu trừ hoàn tiền ăn | §2.1 |
| TC-12 | Công thức tính tiền ăn hoàn trả theo số bữa ăn thực tế và tỷ lệ khấu trừ cấu hình | §2.2 |
| TC-13 | Chốt dữ liệu nghỉ học tháng M, lập bảng tổng hợp công nợ tiền ăn và phê duyệt | §3.1 |
| TC-14 | Tự động kết chuyển suất hoàn tiền ăn thành dòng giảm trừ âm trên hóa đơn học phí tháng M+1 | §3.2 |

## Điểm đáng chú ý / mâu thuẫn
- Không có mâu thuẫn. Quy định rõ: vắng không phép hoặc báo vắng sau 08:00 sáng không được tính hoàn tiền ăn do bếp ăn nhà trường đã chuẩn bị khẩu phần thực phẩm trong ngày.

## Trang chịu ảnh hưởng
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Khái niệm Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md)
- [Thực thể Khấu trừ hoàn tiền ăn](../entities/meal-refund-credit.md)
- [Thực thể Hóa đơn học phí](../entities/tuition-invoice.md)
- [Luồng báo vắng và hoàn tiền](../flows/fl-bao-vang-hoan-tien.md)
- [Màn hình hóa đơn học phí](../screens/m4-sm1-hoc-phi.md)
- [Màn hình cấu hình học phí](../screens/m6-sm3-hoc-phi.md)
