---
title: Màn Hình Chính Sách Miễn Giảm
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-prd-mien-giam-hoc-phi.md
spec_ids:
  - TC-09
  - TC-10
  - TC-15
  - TC-16
  - TC-17
  - TC-18
apps:
  - web
route_ids:
  - /{schoolCode}/school/discount
status: missing
updated: 2026-11-05
---

# Màn Hình Chính Sách Miễn Giảm

## Mục đích
Quản trị chính sách ưu đãi học phí, cảnh báo trùng lặp đối tượng, cấu hình nguyên tắc Best-rate hoặc cộng dồn, cho phép chuyển đổi linh hoạt hình thức giảm trừ `%` hoặc tiền mặt `đ`, và thiết lập chính sách ưu đãi anh/chị/em ruột (Sibling Discount) tự động liên kết học sinh theo số điện thoại phụ huynh, tự động áp dụng mức giảm cho con thứ 2/thứ 3 khi anh/chị đang học `ACTIVE` và tự động cập nhật hoặc ngừng áp dụng khi con lớn tốt nghiệp/chuyển trường (OQ-23).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/discount` | repo:app/src/pages/[schoolCode]/school/discount/index.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| TC-09 | Cảnh báo và yêu cầu xác nhận khi tạo chính sách miễn giảm trùng lặp đối tượng | MISSING |
| TC-10 | Hỗ trợ giảm trừ linh hoạt theo `%` hoặc tiền mặt `đ` kèm dấu chấm phân cách hàng nghìn | MISSING |
| TC-15 | Phân loại và cấu hình chính sách miễn giảm theo từng nhóm đối tượng học sinh (bao gồm chính sách Sibling Discount ưu đãi anh/chị/em ruột OQ-23) | MISSING |
| TC-16 | Quy tắc giải quyết xung đột chính sách miễn giảm theo phương án hưởng ưu đãi cao nhất | MISSING |
| TC-17 | Hỗ trợ phương thức giảm trừ linh hoạt theo tỷ lệ phần trăm hoặc tiền mặt cố định | MISSING |
| TC-18 | Quy trình thẩm định, phê duyệt hồ sơ miễn giảm học phí có lưu vết kiểm toán | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-09 | Cảnh báo và yêu cầu xác nhận khi tạo chính sách miễn giảm trùng lặp đối tượng | Modal cảnh báo trùng lặp đối tượng trên UI prototype | MISSING | repo:app/src/pages/[schoolCode]/school/discount/index.tsx:1 |
| TC-10 | Hỗ trợ giảm trừ linh hoạt theo `%` hoặc tiền mặt `đ` kèm dấu chấm phân cách hàng nghìn | Input tiền tệ tự động format dấu chấm | MISSING | repo:app/src/pages/[schoolCode]/school/discount/index.tsx:1 |
| TC-15 | Phân loại và cấu hình chính sách miễn giảm theo từng nhóm đối tượng học sinh | Type định nghĩa các đối tượng miễn giảm | MISSING | repo:app/src/types/discount.ts:1 |
| TC-16 | Quy tắc giải quyết xung đột chính sách miễn giảm theo phương án hưởng ưu đãi cao nhất | Validation logic kiểm tra xung đột chính sách | MISSING | repo:app/src/utils/discountValidation.ts:1 |
| TC-17 | Hỗ trợ phương thức giảm trừ linh hoạt theo tỷ lệ phần trăm hoặc tiền mặt cố định | Redux slice quản lý danh sách chính sách ưu đãi | MISSING | repo:app/src/store/slices/discountSlice.ts:1 |
| TC-18 | Quy trình thẩm định, phê duyệt hồ sơ miễn giảm học phí có lưu vết kiểm toán | Mock service trả về lịch sử phê duyệt | MISSING | repo:app/src/services/mockDiscountData.ts:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-03, OQ-07, OQ-23).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Thực thể Chính sách miễn giảm](../entities/discount-policy.md)
- [Khái niệm Thuật toán giải quyết xung đột miễn giảm](../concepts/discount-deduplication.md)
- [Luồng thiết lập miễn giảm](../flows/fl-thiet-lap-mien-giam.md)
- [Màn hình hóa đơn học phí](../screens/m4-sm1-hoc-phi.md)
