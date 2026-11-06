---
title: Màn Hình Quản Lý Học Sinh
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - NT-01
apps:
  - web
route_ids:
  - /{schoolCode}/school/students
status: missing
updated: 2026-11-05
---

# Màn Hình Quản Lý Học Sinh

## Mục đích
Quản lý danh bạ và hồ sơ học sinh 360 độ qua 5 tab ngữ cảnh chuyên sâu; hiển thị biểu tượng Khóa đồng bộ kỳ thi Sở GD&ĐT (`is_sync_locked` - OQ-15); cấu hình cờ quyền riêng tư sinh trắc học `opt_out_face_ai` và danh sách hạn chế tiếp cận tranh chấp giám hộ `restricted_guardians` (OQ-16); kích hoạt luồng rút hồ sơ / thôi học giữa kỳ kèm quyết toán Pro-rata (OQ-17); ghi nhận ngày bắt đầu học `enrollment_date` cho học sinh nhập học giữa tháng tính Prorated (OQ-22); quản lý số điện thoại chính `primary_phone` tự động liên kết nhóm anh chị em ruột hưởng Sibling Discount (OQ-23); và theo dõi đơn dặn thuốc y tế, lịch sử uống thuốc trong tab Y tế/Điểm danh (OQ-19).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/students` | repo:app/src/pages/[schoolCode]/school/students.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-01 | Quản lý danh bạ và hồ sơ học sinh 360° với 5 tab ngữ cảnh chuyên sâu, tích hợp sync lock OQ-15, opt-out AI/giám hộ OQ-16 và rút hồ sơ OQ-17 | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-01 | Quản lý danh bạ và hồ sơ học sinh 360° với 5 tab ngữ cảnh chuyên sâu | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/students.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-15, OQ-16, OQ-17, OQ-19, OQ-22, OQ-23).

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Thực thể Hồ sơ học sinh 360](../entities/student-profile.md)
- [Khái niệm Tích hợp CSDL Sở](../concepts/csdl-so-integration.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Khái niệm vòng đời học sinh](../concepts/student-lifecycle-transitions.md)
- [Luồng quản lý hồ sơ học sinh 360](../flows/fl-quan-ly-ho-so-hoc-sinh-360.md)
