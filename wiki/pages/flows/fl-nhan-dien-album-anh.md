---
title: Luồng Tải Ảnh & Nhận Diện Khuôn Mặt AI
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-tech-architecture-blueprint.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-06
  - CH-04
updated: 2026-11-05
---

# Luồng Tải Ảnh & Nhận Diện Khuôn Mặt AI

## Mục tiêu
Tự động hóa hoàn toàn việc phân loại hình ảnh lớp học, nhận diện khuôn mặt từng học sinh trong các album ảnh hoạt động và đưa vào portfolio cá nhân của học sinh mà không làm đơ giao diện hay nghẽn mạng, đồng thời bảo vệ nghiêm ngặt quyền riêng tư sinh trắc học theo Nghị định 13/2023/NĐ-CP.

## Các bước
| # | Vai trò | App / màn | Hành động | Kết quả | Mã |
|---|---|---|---|---|---|
| 1 | Giáo viên | [Màn hình thư viện](../screens/m2-sm3-thu-vien.md) | Chọn và tải lên album ảnh hoạt động lớp (lên đến 100 ảnh) | Ảnh được lưu lên Object Storage, hiển thị huy hiệu "Đang nhận diện..." | VH-06 |
| 2 | Hệ thống | BullMQ Worker | Worker trích xuất khuôn mặt, so khớp vector nhận diện; tự động kiểm tra cờ quyền riêng tư sinh trắc học `opt_out_face_ai` | Bỏ qua học sinh từ chối AI, tự động gán thẻ (`face_tag`) cho học sinh hợp lệ | CH-04 |
| 3 | Hệ thống | Privacy Filter | Nếu ảnh công bố ngoài lớp chứa học sinh có cờ `opt_out_face_ai`: áp dụng làm mờ mặt `AUTO_BLUR_FACE` | Bảo vệ hình ảnh cá nhân trẻ em theo luật định | CH-04 |
| 4 | Phụ huynh / GV | [Màn hình thư viện](../screens/m2-sm3-thu-vien.md) | Bấm lọc theo tên học sinh | Hiển thị toàn bộ ảnh có mặt học sinh đó trong các hoạt động | VH-06 |

## Quy tắc chặn / validation
- Chỉ những nhận diện có độ tin cậy vượt ngưỡng $\ge 0.85$ mới được tự động gán thẻ; các nhận diện dưới ngưỡng được đưa vào hàng đợi xác nhận thủ công (CH-04).
- Quá trình xử lý AI bắt buộc chạy bất đồng bộ ngoài luồng HTTP chính để tránh lỗi quá thời gian kết nối (VH-06).
- **Quyền riêng tư sinh trắc học & Opt-Out (OQ-16):** Tuyệt đối không trích xuất vector hay gắn thẻ tên cho bất kỳ học sinh nào có cờ `opt_out_face_ai = true`. Tự động làm mờ khuôn mặt học sinh đó khi ảnh được xuất bản công khai ra ngoài phạm vi lớp học.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-06 | Thư viện media tự động gắn thẻ khuôn mặt học sinh trong ảnh lớp bằng AI | Prototype thư viện ảnh chưa kết nối worker xử lý AI | MISSING | repo:app/src/features/media/ |
| CH-04 | Cấu hình mô hình AI nhận diện khuôn mặt và ngưỡng nhạy độ tin cậy nhận diện | Màn hình cấu hình AI mới là giao diện mockup tĩnh | MISSING | repo:app/src/features/settings/ |

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Thư viện media](../entities/media-album.md)
- [Hồ sơ sinh trắc khuôn mặt](../entities/face-biometric-registration.md)
- [Màn hình thư viện](../screens/m2-sm3-thu-vien.md)
