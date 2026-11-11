---
title: Màn Hình Cấu Hình Nhận Diện AI
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - CH-04
apps:
  - web
route_ids:
  - /{schoolCode}/setting/face-recognition
status: missing
updated: 2026-11-11
---

# Màn Hình Cấu Hình Nhận Diện AI

## Mục đích
Quản lý và đăng ký ảnh khuôn mặt nhận diện sinh trắc học cho học sinh toàn trường, phục vụ điểm danh AI tự động tại cổng trường.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/setting/face-recognition` | repo:app/src/pages/[schoolCode]/setting/face-recognition/index.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-04 | Cấu hình mô hình AI nhận diện khuôn mặt, ngưỡng nhạy độ tin cậy và chế độ bảo vệ quyền riêng tư Opt-Out OQ-16 | MISSING |

## Chuẩn hóa UI/UX Design System v2.6.0 & Hiến pháp
1. **Thống kê StatCards**:
   - 3 thẻ chỉ số chuẩn DS hiển thị "Tổng học sinh", "Đã đăng ký nhận diện (50%)", "Chưa đăng ký nhận diện (5 chưa có ảnh)".
2. **FilterBar Single Frame Line 38px**:
   - Ô tìm kiếm text xám gợi ý (`placeholder="Tìm theo tên học sinh"`).
   - Dropdown bộ lọc 38px với text xám hướng dẫn (`placeholder="Chọn lớp học"`, `placeholder="Chọn trạng thái nhận diện"`), bảo lưu logic mặc định.
3. **Thao tác dòng bảng (Three-Dots DropdownMenu)**:
   - Cột "Thao tác" dùng `<DropdownMenu>` 3 chấm với trigger `<IconButton icon="ellipsis-vertical">` ("Đăng ký ảnh khuôn mặt", "Cập nhật ảnh khuôn mặt", "Xem ảnh phóng to", "Xóa ảnh khuôn mặt").
4. **Right-Sheet SlideOver**:
   - Đăng ký và cập nhật ảnh khuôn mặt qua `<SlideOver>` trượt từ bên phải với preview ảnh trực quan.
5. **Hệ màu Semantic**:
   - `<StatusTag tone="success">` ("Đã đăng ký"), `<StatusTag tone="neutral">` ("Chưa đăng ký").
6. **Phân trang**:
   - Nút phân trang chuẩn hóa với `<IconButton icon="chevron-left">` và `<IconButton icon="chevron-right">`.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-04 | Cấu hình mô hình AI nhận diện khuôn mặt và ngưỡng nhạy độ tin cậy nhận diện | Frontend hoàn chỉnh theo Design System v2.6.0 và Hiến pháp UX/UI, tích hợp Redux slice và dữ liệu nhận diện | MISSING | repo:app/src/modules/setting/face-recognition/FaceRecognitionTable.tsx:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-04, OQ-16).

## Liên quan
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Hồ sơ sinh trắc khuôn mặt](../entities/face-biometric-registration.md)
- [Thư viện media](../entities/media-album.md)
- [Luồng đăng ký sinh trắc khuôn mặt](../flows/fl-dang-ky-sinh-trac-khuon-mat.md)
