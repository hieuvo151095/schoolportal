---
title: Màn Hình Cấu Hình Trường Học
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - CH-01
apps:
  - web
route_ids:
  - /{schoolCode}/settings/school-profile
status: missing
updated: 2026-11-09
---

# Màn Hình Cấu Hình Trường Học

## Mục đích
Cập nhật thông tin pháp lý nhà trường, địa chỉ, hotline, logo thương hiệu, niên khóa, giờ hoạt động tuần và cấu hình khung giờ đón/trả bằng camera nhận diện AI.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/setting/school` | repo:app/src/pages/[schoolCode]/setting/school/index.tsx |
| web | `/{schoolCode}/setting/school/edit` | repo:app/src/pages/[schoolCode]/setting/school/edit.tsx |
| web | `/{schoolCode}/setting/school/weekdays` | repo:app/src/pages/[schoolCode]/setting/school/weekdays.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-01 | Cấu hình thông tin pháp lý nhà trường, biểu tượng thương hiệu, niên khóa mặc định và khung giờ đón/trả camera theo loại hình trường (Mầm non 1 buổi vs K12 2 buổi) | MISSING |

## Quy tắc cấu hình giờ đón/trả bằng Camera AI
Camera AI tại cổng trường chỉ ghi nhận dữ liệu điểm danh trong khung giờ được thiết lập (hoặc ghi nhận cả ngày khi tắt giới hạn). Khung giờ đón và trả không được trùng nhau.

1. **Trường Mầm non (1 buổi):**
   - **Giờ đón học sinh (`pickup`):** Mặc định `06:30` – `11:45`. Check-in lấy sự kiện nhận diện khuôn mặt đầu tiên và tự động phát thông báo đẩy tới phụ huynh ngay lập tức.
   - **Giờ trả học sinh (`dropoff`):** Mặc định `14:15` – `17:30`. Check-out theo dõi và lấy sự kiện nhận diện cuối cùng trong khung giờ; thông báo đẩy chỉ được gửi tới phụ huynh tại mốc kết thúc khung giờ (`17:30`) để loại trừ sai sót khi trẻ di chuyển qua lại khu vực cổng.

2. **Trường K12 (2 buổi):**
   - Thiết lập độc lập 2 buổi:
     - Buổi sáng: Giờ đón sáng (`06:30` – `08:30`) & Giờ trả sáng (`11:15` – `12:30`).
     - Buổi chiều: Giờ đón chiều (`12:45` – `14:00`) & Giờ trả chiều (`16:00` – `17:45`).
   - Cả sự kiện đón và trả ở cả hai buổi đều lấy sự kiện nhận diện đầu tiên và phát thông báo đẩy tới phụ huynh ngay lập tức.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-01 | Cấu hình thông tin pháp lý nhà trường, biểu tượng thương hiệu và niên khóa mặc định | Prototype frontend hoàn chỉnh với Redux slice, hỗ trợ form thông tin cơ bản, giờ mở cửa tuần và cấu hình giờ đón/trả camera cho Mầm non/K12 | MISSING | repo:app/src/modules/setting/school/CameraAttendanceForm.tsx:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-settings.md)
- [Khái niệm liên quan](../concepts/multi-tenancy-isolation.md)
- [Thực thể Hồ sơ trường học](../entities/school-profile.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Luồng điểm danh đón trả](../flows/fl-diem-danh-don-tra.md)
