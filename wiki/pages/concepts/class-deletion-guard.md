---
title: Chốt Chặn An Toàn Khi Xóa Lớp (Class Deletion Guard)
type: concept
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - NT-04
updated: 2026-11-05
---

# Chốt Chặn An Toàn Khi Xóa Lớp (Class Deletion Guard)

## Định nghĩa
Chốt chặn an toàn khi xóa lớp là cơ chế kiểm tra tính toàn vẹn dữ liệu nghiêm ngặt trước khi cho phép quản trị viên thực hiện thao tác xóa một lớp học, nhằm ngăn ngừa triệt để nguy cơ tạo ra dữ liệu mồ côi (orphan records) trong học vụ và tài chính.

## Quy tắc
1. **Chặn xóa khi có học sinh:** Nếu lớp học đang có ít nhất 1 học sinh theo học (`student_count > 0`), nút Xóa lớp bị vô hiệu hóa hoàn toàn; giao diện hiển thị cảnh báo: *"Lớp học đang có học sinh. Vui lòng chuyển toàn bộ học sinh sang lớp khác trước khi xóa lớp."*
2. **Chặn xóa khi đã phát sinh tài chính & Chốt chặn bảo toàn công nợ (OQ-12):**
   - Nếu lớp học đã có hóa đơn học phí, giao dịch thanh toán hoặc khoản chi liên kết, hệ thống tuyệt đối cấm xóa vật lý (Hard Delete). Chỉ cho phép chuyển trạng thái lớp sang "Lưu trữ / Ngừng hoạt động" (`Archived`).
   - Nếu trong lớp còn bất kỳ học sinh nào có công nợ học phí chưa tất toán (`balance_due > 0` hoặc hóa đơn ở trạng thái `issued`, `partial_paid`, `overdue`), hệ thống khóa cứng không cho phép xóa vĩnh viễn.
   - Khi đóng/lưu trữ lớp cũ lúc kết thúc niên khóa: Toàn bộ công nợ được bảo toàn tuyệt đối, gắn với `student_id` và tự động mang sang niên khóa mới (Carried-over Debt) dưới dạng "Nợ kỳ trước" trên hóa đơn lớp mới. Kế toán vẫn có thể thu tiền và gạch nợ cho hóa đơn của lớp đã lưu trữ.
3. **Điều kiện xóa hợp lệ:** Chỉ các lớp rỗng hoàn toàn (0 học sinh, 0 hóa đơn, 0 công nợ, 0 thời khóa biểu đang hoạt động) mới được phép xóa vĩnh viễn khỏi cơ sở dữ liệu.
4. **Phân loại lớp rõ ràng:** Phân tách rạch ròi giữa Lớp chính khóa (bật trọn bộ tính năng: điểm danh, thời khóa biểu, sổ điểm, học phí) và Lớp ngoại khóa (chỉ bật tính năng điểm danh và bài tập riêng).

## Áp dụng ở đâu
- [Lớp học](../entities/classroom.md)
- [Màn hình lớp học](../screens/m5-sm3-lop-hoc.md)

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-04 | Phân loại lớp chính khóa và ngoại khóa kèm chốt chặn an toàn khi xóa lớp | Prototype frontend chưa tích hợp dialog kiểm tra ràng buộc tài chính và học sinh | MISSING | repo:app/src/features/classes/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-05).

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Lớp học](../entities/classroom.md)
- [Luồng chuyển lớp và chuyển năm học](../flows/fl-chuyen-lop-va-chuyen-nam-hoc.md)
