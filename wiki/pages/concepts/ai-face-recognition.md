---
title: Đường Ống Nhận Diện Khuôn Mặt AI (AI Face Recognition Pipeline)
type: concept
sources:
  - pages/sources/src-tech-architecture-blueprint.md
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-06
  - CH-04
updated: 2026-11-05
---

# Đường Ống Nhận Diện Khuôn Mặt AI (AI Face Recognition Pipeline)

## Định nghĩa
Đường ống nhận diện khuôn mặt AI là hệ thống xử lý thị giác máy tính bất đồng bộ, tự động phát hiện và nhận diện khuôn mặt học sinh trong các album ảnh hoạt động lớp học, tự động gắn thẻ (tag) học sinh và phân bổ ảnh vào portfolio cá nhân, đồng thời tuân thủ quyền riêng tư sinh trắc học và hỗ trợ chốt chặn an toàn giám hộ trẻ em.

## Quy tắc
1. **Xử lý bất đồng bộ (Asynchronous Queue - OQ-04):**
   - Khi giáo viên tải lên nhiều ảnh (lên đến 100 ảnh/lần), ảnh được lưu trực tiếp vào Object Storage (Google Cloud Storage / MinIO).
   - Backend sinh job bất đồng bộ vào hàng đợi BullMQ và trả phản hồi `202 Accepted` ngay lập tức để không chặn giao diện người dùng.
2. **Bộ nhận diện AI Worker:**
   - Worker chạy ngầm trích xuất embedding khuôn mặt (Face Embeddings) từ ảnh và so sánh cosine similarity với vector khuôn mặt chuẩn của học sinh trong trường.
   - Ngưỡng tin cậy (Confidence Threshold) được cấu hình tại Cấu hình nhận diện (mặc định $\ge 0.85$).
3. **Cập nhật trạng thái thời gian thực:**
   - Khi nhận diện hoàn tất, worker lưu các thẻ `face_tag` vào PostgreSQL và phát sự kiện qua WebSocket để giao diện tự động cập nhật avatar học sinh được gắn thẻ mà không cần reload trang.
4. **Quyền riêng tư sinh trắc học khuôn mặt (AI Biometric Privacy Opt-Out - OQ-16):**
   - Tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân, hệ thống cung cấp cờ cấu hình `opt_out_face_ai` trong hồ sơ học sinh.
   - Khi phụ huynh bật `opt_out_face_ai = true`:
     - Worker AI tự động bỏ qua trích xuất vector khuôn mặt và tuyệt đối không gắn thẻ tên học sinh lên ảnh lớp.
     - Vô hiệu hóa và xóa dữ liệu vector khuôn mặt của học sinh trong bảng `face_biometric_registrations`.
     - Tự động áp dụng bộ lọc làm mờ khuôn mặt (`AUTO_BLUR_FACE`) hoặc loại trừ khỏi album công khai bên ngoài lớp (`EXCLUDE_FROM_PUBLIC_ALBUM`) theo yêu cầu phụ huynh.
5. **Chốt chặn an toàn tranh chấp quyền giám hộ (Restricted Custody Protection - OQ-16):**
   - Với các trường hợp tranh chấp quyền nuôi con hoặc có phán quyết của Tòa án cấm tiếp cận (`restricted_guardians`), hệ thống đồng bộ danh sách cảnh báo này sang phân hệ Vận hành.
   - Tại màn hình Điểm danh đón/trả (`m2-sm1-diem-danh`), học sinh được gắn Huy hiệu Khiên Đỏ (Custody Alert). Khi quét thẻ hoặc chọn người đón nằm trong danh sách hạn chế, hệ thống lập tức kích hoạt Cảnh báo đỏ toàn màn hình (Red Modal Alert) kèm chuông báo động, khóa nút giao trẻ và kích hoạt quy trình an ninh bảo vệ học sinh.

## Áp dụng ở đâu
- [Thư viện media](../entities/media-album.md)
- [Hồ sơ học sinh 360](../entities/student-profile.md)
- [Điểm danh hằng ngày](../entities/attendance-daily.md)
- [Hồ sơ sinh trắc khuôn mặt](../entities/face-biometric-registration.md)
- [Màn hình thư viện](../screens/m2-sm3-thu-vien.md)
- [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md)
- [Màn hình nhận diện](../screens/m6-sm4-nhan-dien.md)
- [Luồng nhận diện album ảnh](../flows/fl-nhan-dien-album-anh.md)
- [Luồng điểm danh đón trả](../flows/fl-diem-danh-don-tra.md)

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-06 | Thư viện media tự động gắn thẻ khuôn mặt học sinh trong ảnh lớp bằng AI | Prototype frontend hiển thị ảnh tĩnh, chưa kết nối BullMQ worker | MISSING | repo:app/src/features/media/ |
| CH-04 | Cấu hình mô hình AI nhận diện khuôn mặt và ngưỡng nhạy độ tin cậy nhận diện | Màn hình cài đặt AI mới có mockup giao diện | MISSING | repo:app/src/features/settings/ |

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Thư viện media](../entities/media-album.md)
- [Hồ sơ học sinh 360](../entities/student-profile.md)
- [Điểm danh hằng ngày](../entities/attendance-daily.md)
- [Hồ sơ sinh trắc khuôn mặt](../entities/face-biometric-registration.md)
- [Luồng nhận diện album ảnh](../flows/fl-nhan-dien-album-anh.md)
- [Luồng điểm danh đón trả](../flows/fl-diem-danh-don-tra.md)
- [Màn hình thư viện](../screens/m2-sm3-thu-vien.md)
- [Màn hình điểm danh](../screens/m2-sm1-diem-danh.md)
- [Màn hình nhận diện](../screens/m6-sm4-nhan-dien.md)
