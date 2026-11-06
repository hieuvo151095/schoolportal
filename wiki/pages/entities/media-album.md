---
title: Thư Viện Media (Media Album)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-06
updated: 2026-11-05
---

# Thư Viện Media (Media Album)

## Định nghĩa
Thực thể Thư viện media lưu trữ và quản lý toàn bộ các tập tin ảnh, video sự kiện và hình ảnh lớp học, đồng thời tích hợp các thẻ nhận diện khuôn mặt tự động bằng AI.

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| VH-06 | Hỗ trợ tải lên hàng loạt ảnh (tối đa 100 ảnh/lần) với dung lượng tối ưu | Lưu trữ an toàn trên Object Storage |
| VH-06 | Tự động nhận diện khuôn mặt và gắn thẻ học sinh trong ảnh qua hàng đợi BullMQ ngầm | Chi tiết tại [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md) |
| VH-06 | Tự động gom nhóm album ảnh theo từng học sinh, giúp phụ huynh lọc ảnh con nhanh chóng | Portfolio ảnh cá nhân hóa |
| VH-06 | Quyền riêng tư AI & Làm mờ ảnh (OQ-16): Tôn trọng cờ `opt_out_face_ai`, không gắn thẻ tên, tự động kích hoạt làm mờ mặt `AUTO_BLUR_FACE` hoặc loại khỏi album công khai theo Nghị định 13/2023/NĐ-CP | Biểu tượng lá chắn bảo vệ quyền riêng tư |

## Quan hệ
- Thuộc về [Lớp học](classroom.md) hoặc Sự kiện toàn trường.
- Gắn thẻ nhiều [Hồ sơ học sinh 360](student-profile.md).
- Hiển thị trên [Màn hình thư viện](../screens/m2-sm3-thu-vien.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-06 | Thư viện media tự động gắn thẻ khuôn mặt học sinh trong ảnh lớp bằng AI | Prototype frontend chưa tích hợp upload S3/GCS và AI tagging | MISSING | repo:app/src/features/media/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-04, OQ-16).

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Màn hình thư viện](../screens/m2-sm3-thu-vien.md)
- [Luồng nhận diện album ảnh](../flows/fl-nhan-dien-album-anh.md)
