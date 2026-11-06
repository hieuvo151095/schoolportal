---
title: Luồng Thiết Lập Chính Sách Miễn Giảm Học Phí
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-09
  - TC-10
updated: 2026-11-05
---

# Luồng Thiết Lập Chính Sách Miễn Giảm Học Phí

## Mục tiêu
Cho phép ban giám hiệu hoặc kế toán viên thiết lập các chính sách ưu đãi học phí cho từng đối tượng học sinh hoặc theo lớp học, kiểm soát trùng lặp chính sách và bảo đảm quyền lợi tối đa cho học sinh.

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | Kế toán / BGH | [Màn hình miễn giảm](../screens/m4-sm8-mien-giam.md) | Mở modal tạo mới chính sách thông thường (theo lớp/học sinh) hoặc cấu hình chính sách hệ thống Sibling Discount ưu đãi anh chị em ruột (`SIBLING_DISCOUNT` - OQ-23) | Hệ thống xác định danh sách học sinh thụ hưởng hoặc kích hoạt quy tắc phân bậc gia đình | TC-09 |
| 2 | Kế toán / BGH | [Màn hình miễn giảm](../screens/m4-sm8-mien-giam.md) | Chọn khoản phí áp dụng (tính theo tập giao các khoản phí của các nhóm đã chọn) và nhập mức giảm (`%` hoặc tiền mặt `đ`) | Hệ thống kiểm tra trùng lặp với các chính sách hiện hành | TC-10 |
| 3 | Kế toán / BGH | [Màn hình miễn giảm](../screens/m4-sm8-mien-giam.md) | Nếu phát hiện trùng lặp, tích xác nhận checkbox thay thế và bấm "Lưu chính sách" | Chính sách được kích hoạt, loại trừ học sinh khỏi chính sách cũ | TC-09 |

## Quy tắc chặn / validation
- Nút "Lưu chính sách" bị chặn và vô hiệu hóa nếu phát hiện học sinh bị trùng lặp chính sách cho cùng một khoản phí mà người dùng chưa tích vào checkbox xác nhận thay thế (TC-09).
- Mức giảm theo phần trăm không được vượt quá 100%; mức giảm theo tiền mặt không được là số âm (TC-10).
- **Chính sách ưu đãi anh/chị/em ruột Sibling Discount (OQ-23):**
  - Tự động nhóm học sinh theo số điện thoại chính của phụ huynh (`primary_phone`) kết hợp CCCD phụ huynh trong Hồ sơ học sinh 360, sắp xếp thứ tự theo ngày sinh `dob` (con 1 sinh trước, con 2, con 3).
  - Cấu hình bậc giảm: Bậc 1 (con thứ 1: 0%), Bậc 2 (con thứ 2: giảm $X\%$), Bậc 3+ (con thứ 3 trở đi: giảm $Y\%$).
  - Điều kiện áp dụng: Con thứ 2/thứ 3 chỉ được giảm khi người anh/chị lớn hơn đang có trạng thái học tập `ACTIVE`.
  - Vòng đời cập nhật động: Khi người con lớn tốt nghiệp hoặc thôi học/chuyển trường (`GRADUATED`, `TRANSFERRED_OUT`, `WITHDRAWN`, `ARCHIVED`), hệ thống tự động đánh giá lại số con `ACTIVE` và hạ bậc ưu đãi ở kỳ lập hóa đơn tiếp theo (M+1), ghi log kiểm toán `DiscountAuditTrail`.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-09 | Cảnh báo và yêu cầu xác nhận khi tạo chính sách miễn giảm trùng lặp đối tượng | Modal tạo mới chính sách chưa có kiểm tra tập giao và cảnh báo trùng lặp | MISSING | repo:app/src/features/finance/ |
| TC-10 | Hỗ trợ giảm trừ linh hoạt theo `%` hoặc tiền mặt `đ` kèm dấu chấm phân cách hàng nghìn | Chưa có toggle chuyển đổi đơn vị và định dạng số phân cách hàng nghìn | MISSING | repo:app/src/features/finance/ |

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Chính sách miễn giảm](../entities/discount-policy.md)
- [Thuật toán giải quyết xung đột miễn giảm](../concepts/discount-deduplication.md)
- [Màn hình miễn giảm](../screens/m4-sm8-mien-giam.md)
