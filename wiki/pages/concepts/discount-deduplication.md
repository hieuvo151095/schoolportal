---
title: Thuật Toán Giải Quyết Xung Đột Miễn Giảm (Discount Deduplication)
type: concept
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-09
  - TC-10
updated: 2026-11-05
---

# Thuật Toán Giải Quyết Xung Đột Miễn Giảm (Discount Deduplication)

## Định nghĩa
Thuật toán giải quyết xung đột chính sách miễn giảm là quy trình kiểm tra và xử lý khi một học sinh đồng thời thuộc diện thụ hưởng từ hai chính sách miễn giảm trở lên cho cùng một khoản thu (ví dụ: vừa thuộc lớp được giảm 10%, vừa có chính sách riêng cho con thương binh giảm 30%).

## Quy tắc
1. **Cảnh báo khi thiết lập chính sách (Design-time Check):**
   - Khi kế toán tạo hoặc cập nhật một chính sách miễn giảm trong modal `CreateDiscountPolicyModal`, hệ thống kiểm tra danh sách học sinh thuộc phạm vi áp dụng.
   - Nếu phát hiện học sinh đã có chính sách có hiệu lực cho cùng khoản thu, hiển thị cảnh báo chi tiết: Tên học sinh, lớp, khoản phí, tên chính sách cũ, mức giảm cũ, tên chính sách mới, mức giảm mới.
   - Bắt buộc người dùng tích vào checkbox xác nhận: `[ ] Tôi xác nhận thay thế chính sách cũ bằng chính sách mới này cho các học sinh bị trùng lặp nêu trên`. Nút lưu sẽ bị khóa nếu chưa tích xác nhận.
   - Khi lưu, hệ thống tự động loại trừ học sinh khỏi chính sách cũ.
2. **Quy tắc bảo đảm quyền lợi tối đa khi lập hóa đơn (Runtime Best-Rate Rule):**
   - Khi xuất hóa đơn học phí, nếu vì bất kỳ lý do dữ liệu nào học sinh vẫn có nhiều hơn một chính sách hợp lệ, hệ thống tự động so sánh số tiền giảm thực tế và **chỉ áp dụng duy nhất chính sách có mức giảm cao nhất** cho học sinh.
3. **Chuyển đổi linh hoạt đơn vị giảm trừ:**
   - Hỗ trợ giảm theo tỷ lệ `%` hoặc số tiền mặt cố định `đ`. Cho phép chuyển đổi đơn vị linh hoạt ngay trên dòng khoản thu của hóa đơn.
4. **Quy tắc tương tác với chính sách ưu đãi anh/chị/em ruột Sibling Discount (OQ-23):**
   - Chính sách `SIBLING_DISCOUNT` được hệ thống tự động áp dụng dựa trên số điện thoại chính phụ huynh (`primary_phone`) và trạng thái `ACTIVE` của anh/chị.
   - Khi học sinh đồng thời thụ hưởng chính sách Sibling Discount và một chính sách miễn giảm khác (ví dụ học bổng, con giáo viên), hệ thống áp dụng nguyên tắc Best-Rate (chọn mức giảm cao nhất có lợi nhất cho học sinh) trừ khi trường cấu hình chính sách cộng dồn đặc thù với trần không quá 100% học phí.
   - Xử lý chuyển trường/tốt nghiệp trong gia đình nhiều con: Khi con lớn ra trường, hệ thống tự động tính lại số lượng con `ACTIVE` trong gia đình và tự động điều chỉnh mức giảm của các con nhỏ hơn ở kỳ hóa đơn tiếp theo (M+1), không hồi tố kỳ cũ đã quyết toán.

## Áp dụng ở đâu
- [Chính sách miễn giảm](../entities/discount-policy.md)
- [Hóa đơn học phí](../entities/tuition-invoice.md)
- [Màn hình miễn giảm](../screens/m4-sm8-mien-giam.md)

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-09 | Cảnh báo và yêu cầu xác nhận khi tạo chính sách miễn giảm trùng lặp đối tượng | Modal frontend chưa tích hợp logic kiểm tra trùng lặp và checkbox xác nhận | MISSING | repo:app/src/features/finance/ |
| TC-10 | Hỗ trợ giảm trừ linh hoạt theo `%` hoặc tiền mặt `đ` kèm dấu chấm phân cách hàng nghìn | Prototype mới hiển thị đơn giản, chưa có toggle chuyển đổi đơn vị và định dạng số | MISSING | repo:app/src/features/finance/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-03, OQ-07, OQ-23).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Chính sách miễn giảm](../entities/discount-policy.md)
- [Luồng thiết lập miễn giảm](../flows/fl-thiet-lap-mien-giam.md)
