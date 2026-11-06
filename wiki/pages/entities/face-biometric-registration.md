---
title: Thực Thể Hồ Sơ Nhận Diện Khuôn Mặt (Face Biometric Registration)
type: entity
sources:
  - repo:docs/guides/development/E-033-settings-face-recognition/epic.md
  - repo:docs/guides/decisions.md
  - pages/sources/src-open-questions-resolutions.md
updated: 2026-11-05
spec_ids:
  - CH-12
  - CH-04
---

# Thực Thể Hồ Sơ Nhận Diện Khuôn Mặt (Face Biometric Registration)

## Định nghĩa
Hồ sơ nhận diện khuôn mặt sinh trắc học là thực thể lưu trữ dữ liệu ảnh chân dung chuẩn hóa, vector đặc trưng khuôn mặt (face embedding vector) và nhật ký nhận diện của từng học sinh trong nhà trường, bảo đảm tuân thủ quyền riêng tư dữ liệu cá nhân theo Nghị định 13/2023/NĐ-CP.

## Thuộc tính / quy tắc nghiệp vụ
- **Mã định danh:** `id` (UUIDv4).
- **Học sinh:** `studentId` (liên kết duy nhất 1:1 với `student-profile`).
- **Trạng thái đăng ký sinh trắc:** `registrationStatus`:
  - `not_registered` (Chưa đăng ký): Học sinh chưa có ảnh mẫu chuẩn trong hệ thống.
  - `registered` (Đã đăng ký): Đã nạp thành công từ 1 đến 5 ảnh chân dung góc chuẩn và sinh vector AI.
  - `failed` (Đăng ký thất bại): Ảnh quá mờ, góc nghiêng > 30 độ hoặc độ phân giải không đạt chuẩn (< 300x300 px).
  - `opted_out` (Từ chối nhận diện sinh trắc): Phụ huynh kích hoạt quyền riêng tư `opt_out_face_ai = true`.
- **Danh sách ảnh mẫu:** `samplePhotos`: Mảng các đường dẫn ảnh an toàn trên Cloud Storage (tối đa 5 ảnh).
- **Vector đặc trưng AI:** `featureVector`: Mảng số thực 512 chiều được sinh bởi mô hình trích xuất đặc trưng khuôn mặt, mã hóa an toàn.
- **Ngày đăng ký & Người thao tác:** `registeredAt`, `registeredBy`.
- **Quy tắc bảo vệ nhân khẩu học (CH-12):** Tại màn hình đăng ký ảnh sinh trắc học (`/setting/face-recognition`), tuyệt đối không cho phép chỉnh sửa thông tin cá nhân (họ tên, ngày sinh, mã học sinh) nhằm tránh sai lệch hồ sơ pháp lý của học sinh. Mọi thay đổi nhân khẩu học bắt buộc phải thực hiện tại phân hệ Hồ sơ học sinh.
- **Quy tắc bất đồng bộ (CH-04):** Quá trình phân tích và trích xuất vector khuôn mặt phải được đẩy sang tác vụ nền Cloud Run worker, không chặn luồng giao diện của giáo viên.
- **Quyền riêng tư sinh trắc học & Opt-Out (OQ-16):** Tuân thủ Nghị định 13/2023/NĐ-CP, khi học sinh kích hoạt `opt_out_face_ai = true`, hệ thống chuyển trạng thái sang `opted_out`, xóa bỏ/vô hiệu hóa `featureVector`, không quét ảnh và tự động áp dụng cơ chế làm mờ mặt hoặc loại trừ khỏi album công bố bên ngoài.

## Quan hệ
- Thuộc về một [Học sinh](student-profile.md) duy nhất (`studentId`).
- Cung cấp mô hình nhận diện cho [Album truyền thông](media-album.md) để tự động tag tên học sinh.
- Hỗ trợ dữ liệu đối chiếu cho [Điểm danh hàng ngày](attendance-daily.md).
- Quản trị tại [Màn hình cấu hình nhận diện](../screens/m6-sm4-nhan-dien.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-12 | Bất biến thông tin nhân khẩu học tại màn hình quét ảnh | Form nhận diện chỉ cập nhật ảnh và trạng thái | MISSING | repo:app/src/features/settings/ |
| CH-04 | Đăng ký khuôn mặt AI và trích xuất vector đặc trưng | Đã có mock giao diện chụp ảnh webcam và tải file | MISSING | repo:app/src/features/settings/ |

## Liên quan
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Khái niệm nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Luồng đăng ký sinh trắc khuôn mặt](../flows/fl-dang-ky-sinh-trac-khuon-mat.md)
- [Màn hình cấu hình nhận diện](../screens/m6-sm4-nhan-dien.md)
