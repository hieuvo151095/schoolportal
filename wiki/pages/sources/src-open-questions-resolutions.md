---
title: Bảng Câu Hỏi Mở & Quyết Định Dứt Điểm (Open Questions & Resolutions)
type: source
sources:
  - raw/specs/open-questions-resolutions.md
updated: 2026-11-05
---

# Bảng Câu Hỏi Mở & Quyết Định Dứt Điểm (Open Questions & Resolutions)

## Thông tin nguồn
| Trường | Giá trị |
|---|---|
| Đường dẫn | `raw/specs/open-questions-resolutions.md` |
| Người cung cấp | System Architect & Lead BA |
| Ngày | 2026-11-05 |
| Loại | Tài liệu quyết định kiến trúc & nghiệp vụ (Architecture & Business Decisions) |

## Nội dung chính
Giải quyết dứt điểm 23 bài toán và câu hỏi mở then chốt của dự án, loại bỏ hoàn toàn các yếu tố mơ hồ:
1. **OQ-01 Multi-tenancy:** Tiền tố `{schoolCode}` trên toàn bộ đường dẫn URL kết hợp PostgreSQL RLS.
2. **OQ-02 Hoàn tiền ăn:** Tự động tổng hợp ngày nghỉ có phép tháng M để khấu trừ vào hóa đơn tháng M+1.
3. **OQ-03 Xung đột miễn giảm:** Cảnh báo trùng lặp tại modal tạo + Checkbox xác nhận thay thế; Áp dụng mức giảm có lợi nhất khi xuất hóa đơn.
4. **OQ-04 AI Face Tagging:** Xử lý bất đồng bộ qua Object Storage và hàng đợi BullMQ/Worker.
5. **OQ-05 Chốt chặn xóa lớp:** Phân loại lớp chính khóa/ngoại khóa; Chặn tuyệt đối xóa lớp khi có học sinh hoặc dữ liệu tài chính.
6. **OQ-06 Phân quyền đăng bài:** Kiểm duyệt 2 cấp (Giáo viên chính đăng ngay, Giáo viên hỗ trợ chờ duyệt).
7. **OQ-07 Định dạng tiền tệ:** Dấu chấm phân cách hàng nghìn, hỗ trợ toggle chuyển đổi `%` và tiền mặt `đ`.
8. **OQ-08 Kiểm soát đồng thời:** Áp dụng Pessimistic Row Lock (`FOR UPDATE`) cho toàn bộ phân hệ tài chính.
9. **OQ-09 Tài chính & Hoàn tiền:** Sinh Credit Balance lũy kế hoặc hoàn tiền nếu hoàn vượt học phí; hoàn ăn theo snapshot đơn giá lớp cũ; VietQR hóa đơn hủy gom vào quỹ treo đối soát (`UNMATCHED_SUSPENSE_POOL`).
10. **OQ-10 Vận hành & Điểm danh:** Chặn giao trẻ cho người lạ nếu không xác thực phụ huynh; quy trình giữ trẻ ngoài giờ khẩn cấp 4 cấp phối hợp Công an; đón về nửa ngày do y tế trước 10:30 hoàn 50% tiền ăn.
11. **OQ-11 Học vụ & Đánh giá:** Kế thừa điểm TX, GK theo môn tương đương khi chuyển trường giữa kỳ tính TBHK MoET; sổ điểm đã khóa chỉ mở cục bộ 60 phút có duyệt BGH và ghi Audit Trail bất biến.
12. **OQ-12 Vòng đời dữ liệu:** Chặn tuyệt đối xóa vật lý lớp còn công nợ, lưu trữ lớp và mang nợ sang niên khóa mới; phục hồi học sinh từ Archive khi lớp cũ giải thể bắt buộc chọn lớp đích đang hoạt động.
13. **OQ-13 Bảo mật đa trường:** LocalStorage phân vùng theo mã trường; WebSocket phân kênh `{schoolCode}:user:{userId}:{channel}`; chuyển trường trên cùng tab kích hoạt `RESET_TENANT_STATE`.
14. **OQ-14 Ngoại khóa & Phân rã:** Conflict scheduler 4 chiều (học sinh, giáo viên, phòng, sĩ số); Biểu phí buổi/tháng; Phân rã Sub-invoice và Partial payment khi phụ huynh từ chối khoản ngoại khóa.
15. **OQ-15 Đồng bộ CSDL Sở:** Cờ `is_sync_locked` khi Sở chốt thi; Đối soát Data Drift 2 chiều; Retry Queue và Dead Letter Queue cô lập lỗi ngắt quãng từng học sinh.
16. **OQ-16 Quyền riêng tư AI & Giám hộ:** Cờ `opt_out_face_ai` tự động bỏ qua trích xuất vector khuôn mặt và làm mờ ảnh; Danh sách `restricted_guardians` và cảnh báo đỏ toàn màn hình cấm tuyệt đối giao trẻ.
17. **OQ-17 Thôi học giữa kỳ:** Quyết toán Pro-rata rạch ròi (khoản hoàn vs không hoàn); Lập phiếu chi hoàn tiền rút hồ sơ; Hủy hóa đơn tương lai; Thu hồi mobile app sang chế độ chỉ đọc lịch sử.
18. **OQ-18 VietQR bất thường:** Chuyển thừa tự động kết chuyển Credit Balance hoặc lập phiếu chi hoàn tiền; Chuyển thiếu vào trạng thái `PARTIAL_PAID` và sinh lại mã VietQR nợ; Đóng băng `FROZEN_UNDER_REVIEW` chặn xuất VAT khi tra soát chargeback.
19. **OQ-19 Sổ dặn thuốc y tế:** Phụ huynh gửi đơn dặn thuốc qua app; Giáo viên xác nhận "Đã cho uống thuốc lúc HH:mm" và gửi Push Notification an tâm tức thời tới phụ huynh.
20. **OQ-20 Đến muộn, đón sớm & Tiền ăn:** Ghi nhận Đến muộn (tùy chọn báo suất ăn với bếp), Đón sớm; Phụ huynh chủ động đón sớm KHÔNG hoàn tiền ăn; Suất ăn chỉ hoàn khi ngày lễ, nhà trường cho nghỉ, hoặc có đơn xin nghỉ cả ngày hợp lệ.
21. **OQ-21 Tự động khóa sổ điểm danh cuối tháng:** Loại bỏ nút nộp thủ công; Hệ thống tự động đóng băng dữ liệu điểm danh tháng cũ (Freeze / Read-Only) vào 23:59:59 ngày cuối tháng trước khi tiến trình tính phí kỳ mới khởi chạy.
22. **OQ-22 Học sinh nhập học giữa tháng & Hóa đơn riêng lẻ:** Nhập học giữa tháng tính học phí prorated chia theo ngày còn lại và tiền ăn theo số ngày ăn thực tế còn lại; Hệ thống chỉ tạo hóa đơn riêng lẻ cho từng học sinh, mã VietQR riêng biệt, gạch nợ độc lập (không gộp gia đình).
23. **OQ-23 Miễn giảm anh chị em ruột (Sibling Discount):** Nhận diện quan hệ gia đình qua số điện thoại phụ huynh; Tự động áp dụng mức giảm cho con thứ 2/thứ 3 khi anh/chị đang học `ACTIVE`; Tự động cập nhật hoặc ngừng khi con lớn ra trường.

## Mã yêu cầu được định nghĩa
| Mã | Quy tắc (kiểm được) | Nguồn (dòng/mục) |
|---|---|---|
| TC-02 | Tự động rà soát ngày nghỉ có phép tháng M và khấu trừ tiền ăn vào hóa đơn tháng M+1 | OQ-02 |
| TC-09 | Cảnh báo và yêu cầu xác nhận khi tạo chính sách miễn giảm trùng lặp đối tượng | OQ-03 |
| TC-10 | Hỗ trợ giảm trừ linh hoạt theo `%` hoặc tiền mặt `đ` kèm dấu chấm phân cách hàng nghìn | OQ-07 |
| NT-04 | Phân loại lớp chính khóa và ngoại khóa kèm chốt chặn an toàn khi xóa lớp | OQ-05 |

## Điểm đáng chú ý / mâu thuẫn
- Toàn bộ 23 câu hỏi mở và kịch bản đối kháng đã được giải quyết dứt điểm 100%. Không có bất kỳ câu hỏi chưa rõ nào tồn đọng trong wiki (100% đã được quyết định dứt điểm).

## Trang chịu ảnh hưởng
- [Cơ chế cô lập đa trường học](../concepts/multi-tenancy-isolation.md)
- [Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md)
- [Thuật toán giải quyết xung đột miễn giảm](../concepts/discount-deduplication.md)
- [Chốt chặn an toàn khi xóa lớp](../concepts/class-deletion-guard.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Kiến trúc thanh toán VietQR động](../concepts/vietqr-dynamic-reconciliation.md)
- [Chuẩn đánh giá học sinh MoET](../concepts/curriculum-assessment-standard.md)
- [Vòng đời chuyển tiếp học sinh](../concepts/student-lifecycle-transitions.md)
- [Kiến trúc tích hợp CSDL Sở](../concepts/csdl-so-integration.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Hồ sơ học sinh 360](../entities/student-profile.md)
- [Chính sách miễn giảm](../entities/discount-policy.md)
- [Lớp học](../entities/classroom.md)
- [Hóa đơn học phí](../entities/tuition-invoice.md)
- [Khấu trừ hoàn tiền ăn](../entities/meal-refund-credit.md)
- [Điểm danh hằng ngày](../entities/attendance-daily.md)
- [Đơn xin nghỉ học / Báo vắng](../entities/student-absence-request.md)
- [Sổ điểm đánh giá](../entities/gradebook-record.md)
- [Hồ sơ lưu trữ học sinh](../entities/student-archive-record.md)
- [Phiên đăng nhập](../entities/auth-session.md)
- [Hồ sơ sinh trắc khuôn mặt](../entities/face-biometric-registration.md)
- [Thời khóa biểu tuần](../entities/timetable-weekly.md)
- [Phiếu chi nội bộ](../entities/expense-voucher.md)
- [Phiên đối soát giao dịch](../entities/reconciliation-session.md)
- [Danh mục thu CSDL Sở](../entities/revenue-category.md)
- [Luồng điểm danh đón trả](../flows/fl-diem-danh-don-tra.md)
- [Luồng báo vắng và hoàn tiền](../flows/fl-bao-vang-hoan-tien.md)
- [Luồng nộp đơn xin nghỉ học](../flows/fl-don-xin-nghi-hoc.md)
- [Luồng chuyển lớp và chuyển năm học](../flows/fl-chuyen-lop-va-chuyen-nam-hoc.md)
- [Luồng nhập sổ điểm](../flows/fl-nhap-so-diem.md)
- [Luồng lưu trữ học sinh kho lạnh](../flows/fl-kho-luu-tru-hoc-sinh.md)
- [Luồng đối soát giao dịch](../flows/fl-doi-soat-giao-dich.md)
- [Luồng đăng nhập đa trường](../flows/fl-dang-nhap-da-truong.md)
- [Luồng lập thời khóa biểu](../flows/fl-lap-thoi-khoa-bieu.md)
- [Luồng lập và phát hành hóa đơn](../flows/fl-lap-phat-hanh-hoa-don.md)
- [Luồng nhận diện album ảnh](../flows/fl-nhan-dien-album-anh.md)
- [Luồng đồng bộ danh mục thu](../flows/fl-dong-bo-danh-muc-thu.md)
- [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md)
- [Màn hình thư viện](../screens/m2-sm3-thu-vien.md)
- [Màn hình thời khóa biểu](../screens/m3-sm1-thoi-khoa-bieu.md)
- [Màn hình sổ điểm đánh giá](../screens/m3-sm3-diem-danh-gia.md)
- [Màn hình hóa đơn học phí](../screens/m4-sm1-hoc-phi.md)
- [Màn hình đối soát thanh toán](../screens/m4-sm2-doi-soat.md)
- [Màn hình khoản chi](../screens/m4-sm5-khoan-chi.md)
- [Màn hình danh mục thu](../screens/m4-sm7-danh-muc-thu.md)
- [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md)
- [Màn hình quản lý lớp học](../screens/m5-sm3-lop-hoc.md)
- [Màn hình kho lưu trữ](../screens/m5-sm14-luu-tru.md)
- [Màn hình lịch sử thanh toán](../screens/m6-sm7-lich-su-thanh-toan.md)
- [Màn hình đăng nhập hệ thống](../screens/m7-sm2-dang-nhap.md)
