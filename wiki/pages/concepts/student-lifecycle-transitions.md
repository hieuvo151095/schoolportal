---
title: Khái Niệm Vòng Đời Chuyển Tiếp Học Sinh (Student Lifecycle Transitions)
type: concept
sources:
  - repo:docs/guides/knowledge.md
  - repo:docs/guides/decisions.md
  - pages/sources/src-open-questions-resolutions.md
updated: 2026-11-05
spec_ids:
  - NT-16
  - NT-17
  - NT-01
---

# Khái Niệm Vòng Đời Chuyển Tiếp Học Sinh (Student Lifecycle Transitions)

## Định nghĩa
Vòng đời chuyển tiếp học sinh là chu trình quản trị xuyên suốt trạng thái của học sinh từ khi nhập học (Enrolled), chuyển lớp trong năm học (Class Transfer), kết chuyển lên lớp khi sang năm học mới (Academic Year Promotion), rút hồ sơ/thôi học giữa kỳ (Withdrawn), chuyển vào kho lưu trữ lạnh (Archived), đến khi phục hồi trở lại (Restored) hoặc xóa vĩnh viễn (Purged).

## Quy tắc
1. **Bảo toàn dữ liệu 3 luồng khi chuyển lớp và chuyển năm học (NT-16):**
   - Khi chuyển một học sinh hoặc chuyển hàng loạt học sinh từ lớp nguồn sang lớp đích:
     - *Luồng tài chính (Fee Schedules):* Hủy gán định mức học phí của lớp cũ, tự động liên kết học sinh với định mức học phí đã cấu hình của lớp đích cho các kỳ hóa đơn chưa phát hành. Các hóa đơn đã phát hành giữ nguyên dữ liệu lịch sử.
     - *Luồng trao đổi (Chat & Communication):* Rút tài khoản phụ huynh khỏi nhóm chat của lớp cũ, tự động thêm phụ huynh vào nhóm chat lớp mới để cập nhật bảng tin hoạt động.
     - *Luồng học tập (Academic Records):* Bảo lưu toàn bộ điểm số, đánh giá thường xuyên và hồ sơ sức khỏe trong quá khứ gắn với niên khóa tương ứng; khởi tạo trang đánh giá mới tại lớp đích.
2. **Quy tắc cách ly và bảo vệ kho lưu trữ lạnh (NT-17, OQ-12):**
   - Học sinh khi chuyển sang trạng thái "Lưu trữ" sẽ được chuyển vào kho lạnh (`student-archive-record`).
   - Học sinh trong kho lưu trữ bị loại trừ 100% khỏi danh sách điểm danh, thực đơn ăn bán trú và danh sách sinh hóa đơn học phí hàng tháng.
   - **Chốt chặn khôi phục học sinh (OQ-12):**
     - Nếu lớp học cũ của học sinh vẫn tồn tại và đang hoạt động trong niên khóa hiện hành: cho phép phục hồi trực tiếp về lớp đó (kiểm tra sĩ số an toàn).
     - Nếu lớp học cũ đã kết thúc, giải tán hoặc đã bị xóa: Hệ thống CHẶN không cho phép phục hồi về trạng thái mồ côi; BẮT BUỘC quản trị viên phải chọn một **Lớp học đích đang hoạt động** thuộc niên khóa hiện hành, kiểm tra sĩ số lớp đích trước khi kích hoạt hoàn tất.
3. **Bảo toàn điểm số khi chuyển trường giữa kỳ (OQ-11):**
   - Học sinh chuyển trường giữa học kỳ trong hệ thống ECO được bảo toàn 100% các cột điểm kiểm tra thành phần (TX, GK) thông qua trích xuất bảng điểm ký số và map môn tương đương tại trường mới, đảm bảo đủ điều kiện tính điểm TBHK theo Thông tư 22/27 Bộ GD&ĐT.
4. **Quy trình xóa vĩnh viễn & Bảo toàn công nợ (LT-02, OQ-12):**
   - Chặn tuyệt đối xóa vĩnh viễn học sinh nếu còn bất kỳ khoản nợ học phí nào chưa thanh toán (`balance_due > 0`).
   - Chỉ cho phép xóa vĩnh viễn học sinh nằm trong kho lưu trữ đã tất toán hết công nợ sau khi đã qua bước xác nhận cảnh báo nguy hiểm màu đỏ (`LT-02`). Khi đã xóa, toàn bộ hồ sơ cá nhân bị dọn dẹp và không thể phục hồi.
5. **Quy tắc quyết toán hoàn tiền Pro-rata khi rút hồ sơ / thôi học giữa kỳ (OQ-17):**
   - Khi học sinh rút hồ sơ chuyển trường hoặc thôi học giữa kỳ, hệ thống áp dụng chính sách quyết toán minh bạch:
     - *(a) Khoản không hoàn lại (Non-refundable):* Phí ghi danh / nhập học đầu năm, Quỹ phát triển nhà trường / cơ sở vật chất đã phân bổ, đồng phục / sách vở đã bàn giao phụ huynh.
     - *(b) Khoản hoàn lại theo tỷ lệ thời gian học thực tế (Pro-rata Refund):*
       - Học phí chính khóa: $\text{Refund} = \text{Tuition} \times \frac{\text{Số tuần học còn lại}}{\text{Tổng số tuần học của kỳ}}$.
       - Tiền ăn bán trú: Hoàn 100% các ngày chưa học kể từ ngày quyết định thôi học có hiệu lực.
       - Tiền xe đưa đón & Câu lạc bộ ngoại khóa: Hoàn 100% các buổi/tháng chưa sử dụng.
     - *Công thức quyết toán ròng (Net Settlement):* $\text{Net} = \text{Tiền hoàn hợp lệ} + \text{Credit Balance hiện có} - \text{Nợ cũ chưa trả}$. Nếu $\text{Net} > 0$, nhà trường chi trả cho phụ huynh; nếu $\text{Net} < 0$, phụ huynh thanh toán nốt trước khi rút hồ sơ.
   - *Lập Phiếu chi hoàn tiền & Hủy hóa đơn tương lai:* Kế toán lập Biên bản thanh lý học phí, hệ thống tự động sinh Phiếu chi hoàn tiền (`TuitionRefundVoucher`) loại `STUDENT_WITHDRAWAL_REFUND` (duyệt 2 cấp Kế toán trưởng và Hiệu trưởng). Đồng thời, hệ thống tự động quét và **Hủy vĩnh viễn (Void/Cancel)** tất cả các hóa đơn dự kiến chưa phát hành trong tương lai.
   - *Thu hồi quyền truy cập Mobile App có kiểm soát:* Ngay khi chuyển trạng thái sang `WITHDRAWN`, hệ thống ngắt ngay lập tức quyền tương tác trực tiếp (chat, điểm danh, tin tức lớp), chuyển tài khoản phụ huynh sang chế độ **"Lưu trữ chỉ đọc" (`READ_ONLY_ARCHIVE`)** để phụ huynh tra cứu lịch sử điểm số và chứng từ tài chính cũ.

## Áp dụng ở đâu
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Hồ sơ học sinh 360](../entities/student-profile.md)
- [Hồ sơ lưu trữ học sinh](../entities/student-archive-record.md)
- [Phiếu chi nội bộ](../entities/expense-voucher.md)
- [Hóa đơn học phí](../entities/tuition-invoice.md)
- [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md)
- [Màn hình lớp học](../screens/m5-sm3-lop-hoc.md)
- [Màn hình kho lưu trữ](../screens/m5-sm14-luu-tru.md)
- [Màn hình niên khóa](../screens/m5-sm13-nam-hoc.md)
- [Màn hình hóa đơn học phí](../screens/m4-sm1-hoc-phi.md)
- [Màn hình khoản chi](../screens/m4-sm5-khoan-chi.md)
- [Luồng chuyển lớp và chuyển năm học](../flows/fl-chuyen-lop-va-chuyen-nam-hoc.md)
- [Luồng kho lưu trữ học sinh](../flows/fl-kho-luu-tru-hoc-sinh.md)

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-16 | Bảo toàn 3 luồng khi chuyển lớp và chuyển năm học | Đã có modal chuyển lớp và chuyển năm học trong prototype | MISSING | repo:app/src/types/class.ts:1 |
| NT-17 | Cách ly kho lạnh, kiểm tra lớp khi phục hồi và bảo vệ xóa 2 bước | Đã có màn hình `/school/archive` với modal xác nhận | MISSING | repo:app/src/pages/[schoolCode]/school/archive/index.tsx:1 |
| NT-01 | Quản lý hồ sơ học sinh 360 độ và thông tin phụ huynh | Đã có danh sách học sinh và trang chi tiết học sinh | MISSING | repo:app/src/types/student.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Thực thể hồ sơ học sinh](../entities/student-profile.md)
- [Thực thể hồ sơ lưu trữ học sinh](../entities/student-archive-record.md)
- [Thực thể Phiếu chi nội bộ](../entities/expense-voucher.md)
- [Thực thể Hóa đơn học phí](../entities/tuition-invoice.md)
- [Luồng chuyển lớp và chuyển năm học](../flows/fl-chuyen-lop-va-chuyen-nam-hoc.md)
- [Luồng kho lưu trữ học sinh](../flows/fl-kho-luu-tru-hoc-sinh.md)
- [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md)
- [Màn hình kho lưu trữ](../screens/m5-sm14-luu-tru.md)
- [Màn hình khoản chi](../screens/m4-sm5-khoan-chi.md)
