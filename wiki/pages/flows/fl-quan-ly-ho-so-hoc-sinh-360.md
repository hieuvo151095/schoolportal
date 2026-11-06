---
title: Luồng Quản Lý Hồ Sơ Học Sinh 360
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - NT-01
updated: 2026-11-05
---

# Luồng Quản Lý Hồ Sơ Học Sinh 360

## Mục tiêu
Quản lý toàn diện hồ sơ học sinh qua 5 tab ngữ cảnh chuyên sâu, cập nhật thông tin nhân thân, phụ huynh liên hệ, lịch sử phát triển thể lực, theo dõi tổng thể quá trình học tập, đồng thời thực thi chốt chặn Khóa đồng bộ kỳ thi (`is_sync_locked`), quyền riêng tư sinh trắc AI (`opt_out_face_ai`), và danh sách hạn chế tiếp cận tranh chấp giám hộ (`restricted_guardians`).

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | Quản trị viên | [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md) | Thêm mới học sinh hoặc mở hồ sơ học sinh từ danh sách | Mở màn hình chi tiết hồ sơ học sinh 360 độ | NT-01 |
| 2 | Quản trị viên | [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md) | Nhập thông tin nhân thân, ngày bắt đầu học `enrollment_date` (phục vụ hóa đơn lẻ ngày Prorated OQ-22), CCCD/Định danh, và danh bạ liên hệ phụ huynh (số điện thoại chính `primary_phone` tự động nhóm gia đình hưởng Sibling Discount OQ-23) | Cập nhật dữ liệu gốc của học sinh và liên kết anh/chị/em ruột | NT-01 |
| 2b | Quản trị viên | [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md) | Cấu hình bảo vệ: bật/tắt cờ `opt_out_face_ai`, cập nhật danh sách `restricted_guardians` kèm phán quyết Tòa án (OQ-16) | Áp dụng chế độ bảo vệ quyền riêng tư và an toàn giám hộ | NT-01 |
| 3 | Quản trị viên / GV | [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md) | Chuyển qua các tab Hoạt động, Thư viện, Điểm danh (theo dõi Sổ dặn thuốc y tế và lịch sử uống thuốc `student_medical_logs` - OQ-19), Học phí (xem số dư Credit Balance, hóa đơn riêng lẻ) | Dữ liệu ngữ cảnh được tải đầy đủ theo từng phân hệ | NT-01 |

## Quy tắc chặn / validation
- Mã định danh học sinh (Mã học sinh hoặc CCCD) không được trùng lặp trong cùng một cơ sở trường học (NT-01).
- Mỗi học sinh bắt buộc phải có ít nhất một số điện thoại phụ huynh hợp lệ để nhận thông báo (NT-01).
- **Chốt chặn Khóa dữ liệu kỳ thi (`is_sync_locked = true` - OQ-15):** Khi Sở GD&ĐT chốt kỳ thi, các trường định danh (`full_name`, `dob`, `gender`, `national_id_number`, `moet_student_code`) bị khóa cứng chỉ đọc; cấm chỉnh sửa nếu không có phiếu phê duyệt của BGH.
- **Quyền riêng tư sinh trắc & Tranh chấp giám hộ (OQ-16):** Bật `opt_out_face_ai = true` kích hoạt làm mờ ảnh và xóa vector nhận diện; khai báo `restricted_guardians` kích hoạt Huy hiệu Khiên Đỏ và Cảnh báo đỏ tại màn hình điểm danh.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-01 | Quản lý danh bạ và hồ sơ học sinh 360° với 5 tab ngữ cảnh chuyên sâu | Frontend prototype hiển thị tab nhưng chưa đồng bộ dữ liệu thời gian thực | MISSING | repo:app/src/features/students/ |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Kiến trúc tích hợp CSDL Sở](../concepts/csdl-so-integration.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Vòng đời chuyển tiếp học sinh](../concepts/student-lifecycle-transitions.md)
- [Hồ sơ học sinh 360](../entities/student-profile.md)
- [Màn hình học sinh](../screens/m5-sm1-hoc-sinh.md)
