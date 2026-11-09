---
title: Thực Thể Hồ Sơ Trường Học
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-031-settings-school-profile/epic.md
spec_ids:
  - CH-01
updated: 2026-11-09
---

# Thực Thể Hồ Sơ Trường Học

## Định nghĩa
Đại diện cho thông tin pháp lý, định danh tổ chức giáo dục, nhận diện thương hiệu, thông tin liên hệ và các tham số thiết lập chế độ hoạt động mặc định của nhà trường trên cổng vận hành.

## Thuộc tính & Quy tắc nghiệp vụ
- **Định danh tenant:** Mã trường (`school_code`), Tên chính thức (`school_name`), Mã số thuế / Quyết định thành lập.
- **Loại hình cơ sở giáo dục (`educational_type`):**
  - `mam_non`: Trường Mầm non (chế độ điểm danh 1 buổi, đón sáng trả chiều).
  - `k12`: Trường Phổ thông liên cấp K12 (chế độ điểm danh 2 buổi sáng/chiều).
- **Nhận diện thương hiệu:** Logo trường, Favicon, Banner trang chủ, Màu sắc chủ đạo (Theme).
- **Thông tin liên hệ:** Địa chỉ trụ sở, Số điện thoại văn phòng, Email tiếp nhận thông tin, Website chính thức, Tên hiệu trưởng / người đại diện pháp luật.
- **Thiết lập thời gian hoạt động:** Ngày làm việc trong tuần (Thứ 2 đến Thứ 6/Thứ 7), Giờ mở cửa, Giờ đóng cửa.
- **Cấu hình giờ đón/trả bằng Camera AI (`camera_attendance_rules`):**
  - Khung giờ đón/trả không được trùng nhau. Bật/tắt công tắc cho phép mở rộng camera ghi nhận cả ngày.
  - Trường Mầm non: Giờ đón (sự kiện đầu tiên, thông báo tức thì) và Giờ trả (sự kiện cuối cùng, thông báo mốc cuối khung giờ).
  - Trường K12: 2 buổi sáng/chiều (sự kiện đầu tiên, thông báo tức thì cho cả đón và trả).

## Quan hệ
- Là thực thể gốc (Root Tenant) bao bọc toàn bộ dữ liệu của [Hồ sơ học sinh 360](student-profile.md), [Giáo viên & Nhân viên](teacher-staff.md), [Lớp học](classroom.md) và các phân hệ.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-01 | Cấu hình thông tin pháp lý nhà trường, biểu tượng thương hiệu và niên khóa mặc định | Type `SchoolProfile`, `CameraAttendanceRules`, Redux slice và giao diện cài đặt hoàn chỉnh | MISSING | repo:app/src/types/schoolProfile.ts:1 |

## Liên quan
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Màn hình cấu hình trường học](../screens/m6-sm1-truong.md)
- [Khái niệm Cô lập đa trường học](../concepts/multi-tenancy-isolation.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
