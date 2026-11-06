---
title: Đặc Tả Cơ Chế Miễn Giảm Học Phí
type: source
sources:
  - raw/specs/prd-mien-giam-hoc-phi.md
  - repo:docs/prd/PRD_Mien_Giam_Hoc_Phi_VI.md
updated: 2026-11-05
---

# Đặc Tả Cơ Chế Miễn Giảm Học Phí

## Thông tin nguồn
- **Tên tài liệu:** PRD Chính Sách Miễn Giảm Học Phí & Quản Lý Ưu Đãi
- **Đường dẫn gốc:** `raw/specs/prd-mien-giam-hoc-phi.md` / `repo:docs/prd/PRD_Mien_Giam_Hoc_Phi_VI.md`
- **Phiên bản:** v1.0.0
- **Phạm vi:** Nghiệp vụ thiết lập chính sách ưu đãi, giải quyết trùng lặp chính sách và áp dụng vào đợt phát hành hóa đơn

## Nội dung chính
Tài liệu định nghĩa toàn diện chính sách ưu đãi học phí trong trường học:
1. Phân loại đối tượng hưởng miễn giảm: Con cán bộ giáo viên - nhân viên trường, đối tượng chính sách xã hội (thương binh, hộ nghèo), gia đình có từ 2 con trở lên cùng theo học (anh chị em ruột), hoặc học sinh đạt học bổng năng khiếu.
2. Quy tắc xếp chồng chính sách và xử lý trùng lặp:
   - Mặc định áp dụng nguyên tắc **Best-rate** (chọn chính sách có mức giảm cao nhất cho học sinh).
   - Cho phép quản trị viên kích hoạt cấu hình cho phép cộng dồn (Stackable) kèm quy định trần giảm tối đa (ví dụ không quá 100% học phí).
   - Hệ thống chủ động hiển thị cảnh báo đỏ khi tạo mới chính sách có phạm vi đối tượng trùng nhau.
3. Linh hoạt hình thức khấu trừ: Cho phép cấu hình giảm trừ theo tỷ lệ phần trăm `%` hoặc số tiền mặt cố định `đ`. Khi nhập số tiền mặt, hệ thống tự động định dạng dấu chấm phân cách hàng nghìn.
4. Quy trình phê duyệt và lưu vết kiểm toán: Mọi trường hợp miễn giảm đặc biệt ngoài chính sách chuẩn phải được Ban Giám Hiệu phê duyệt điện tử và ghi nhận lịch sử thay đổi để phục vụ kiểm toán tài chính.

## Mã yêu cầu được định nghĩa
| Mã | Tóm tắt quy tắc | Đoạn trong nguồn |
|---|---|---|
| TC-15 | Phân loại và cấu hình chính sách miễn giảm theo từng nhóm đối tượng học sinh | §2.1 |
| TC-16 | Quy tắc giải quyết xung đột chính sách miễn giảm theo phương án hưởng ưu đãi cao nhất | §2.3 |
| TC-17 | Hỗ trợ phương thức giảm trừ linh hoạt theo tỷ lệ phần trăm hoặc tiền mặt cố định | §2.4 |
| TC-18 | Quy trình thẩm định, phê duyệt hồ sơ miễn giảm học phí có lưu vết kiểm toán | §3.2 |

## Điểm đáng chú ý / mâu thuẫn
- Không có mâu thuẫn. Đã giải quyết triệt để vấn đề giải quyết xung đột chính sách tại tài liệu quyết định OQ-03.

## Trang chịu ảnh hưởng
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Khái niệm Thuật toán giải quyết xung đột miễn giảm](../concepts/discount-deduplication.md)
- [Thực thể Chính sách miễn giảm](../entities/discount-policy.md)
- [Luồng thiết lập miễn giảm](../flows/fl-thiet-lap-mien-giam.md)
- [Màn hình chính sách miễn giảm](../screens/m4-sm8-mien-giam.md)
- [Màn hình hóa đơn học phí](../screens/m4-sm1-hoc-phi.md)
