---
title: Chính Sách Miễn Giảm (Discount Policy)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-09
  - TC-10
updated: 2026-11-05
---

# Chính Sách Miễn Giảm (Discount Policy)

## Định nghĩa
Thực thể Chính sách miễn giảm quy định các chương trình ưu đãi, học bổng hoặc giảm trừ học phí áp dụng cho danh sách lớp hoặc học sinh cụ thể trong một khoảng thời gian xác định.

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| TC-09 | Khi tạo chính sách mới: Cảnh báo học sinh đã có chính sách trùng lặp cho cùng khoản phí; yêu cầu tích checkbox xác nhận thay thế trước khi lưu | Chi tiết tại [Thuật toán giải quyết xung đột miễn giảm](../concepts/discount-deduplication.md) |
| TC-09 | Khi xuất hóa đơn: Tự động chọn áp dụng mức giảm cao nhất cho học sinh nếu có nhiều chính sách cùng hiệu lực | Bảo đảm quyền lợi tối đa cho người học |
| TC-10 | Hỗ trợ giảm theo tỷ lệ `%` hoặc số tiền mặt cố định `đ`. Cho phép chuyển đổi đơn vị linh hoạt trên từng dòng thu | Định dạng có dấu chấm phân cách hàng nghìn |
| TC-09 | Chính sách ưu đãi anh/chị/em ruột Sibling Discount (OQ-23): Tự động nhận diện quan hệ ruột thịt qua số điện thoại chính của phụ huynh (`primary_phone`); tự động áp dụng mức giảm cho con thứ 2/thứ 3 khi anh/chị đang học `ACTIVE`; tự động điều chỉnh hạ bậc hoặc ngừng áp dụng khi con lớn chuyển trường/tốt nghiệp ở kỳ hóa đơn tiếp theo (M+1) không hồi tố | Chi tiết tại [Màn hình miễn giảm](../screens/m4-sm8-mien-giam.md) |

## Quan hệ
- Áp dụng cho [Hồ sơ học sinh 360](student-profile.md) hoặc toàn bộ học sinh trong [Lớp học](classroom.md).
- Gắn với một hoặc nhiều [Danh mục khoản phí](fee-catalog-item.md).
- Giảm trừ trực tiếp số tiền phải nộp trong [Hóa đơn học phí](tuition-invoice.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-09 | Cảnh báo và yêu cầu xác nhận khi tạo chính sách miễn giảm trùng lặp đối tượng | Modal tạo chính sách chưa có logic kiểm tra trùng lặp học sinh | MISSING | repo:app/src/features/finance/ |
| TC-10 | Hỗ trợ giảm trừ linh hoạt theo `%` hoặc tiền mặt `đ` kèm dấu chấm phân cách hàng nghìn | Chưa có toggle chuyển đổi đơn vị % và tiền mặt trên dòng khoản thu | MISSING | repo:app/src/features/finance/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-03, OQ-07, OQ-23).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Thuật toán giải quyết xung đột miễn giảm](../concepts/discount-deduplication.md)
- [Màn hình miễn giảm](../screens/m4-sm8-mien-giam.md)
- [Luồng thiết lập miễn giảm](../flows/fl-thiet-lap-mien-giam.md)
