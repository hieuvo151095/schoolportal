---
title: Màn Hình Điểm Danh Học Sinh
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-01
  - VH-02
  - VH-03
  - VH-04
  - VH-10
apps:
  - web
route_ids:
  - /{schoolCode}/operations/attendance
status: missing
updated: 2026-11-05
---

# Màn Hình Điểm Danh Học Sinh

## Mục đích
Cho phép giáo viên điểm danh Đón/Trả 1-chạm theo lớp (chính khóa và ngoại khóa), đo thân nhiệt, quản lý Sổ dặn thuốc y tế và xác nhận uống thuốc trưa (OQ-19), ghi nhận Đến muộn (kèm toggle báo suất ăn với bếp) và Đón sớm giữa buổi (không hoàn tiền ăn - OQ-20), xác thực người đón hộ, báo vắng phân loại có phép/không phép, xử lý đón về nửa ngày do y tế (`half_day_leave` hoàn 50% tiền ăn), kích hoạt chốt chặn giữ trẻ tạm thời bảo vệ pháp lý (`unclaimed_child_flag`) ngoài giờ sau 17:30, hiển thị Cảnh báo đỏ toàn màn hình (Red Modal Alert & Audio) tranh chấp giám hộ (`restricted_guardians` - OQ-16), và tự động khóa sổ đóng băng chỉ đọc vào ngày cuối tháng trước kỳ tính phí (Monthly Auto-Freeze - OQ-21).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/operations/attendance` | repo:app/src/pages/[schoolCode]/operations/attendance.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| VH-01 | Điểm danh đón và trả học sinh 1-chạm (lớp ngoại khóa OQ-14, đến muộn/đón sớm không hoàn tiền OQ-20, tự động đóng băng sổ cuối tháng OQ-21) | MISSING |
| VH-02 | Ghi nhận thân nhiệt, cảnh báo dấu hiệu sức khỏe y tế bất thường và quản lý Sổ dặn thuốc y tế, xác nhận uống thuốc trưa (OQ-19) | MISSING |
| VH-03 | Xác thực người đón hộ, chốt chặn ngoài giờ và chốt chặn an toàn tranh chấp giám hộ Red Alert (OQ-16) | MISSING |
| VH-04 | Báo vắng học sinh hàng loạt và phân loại vắng có phép hoặc không phép | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-01 | Điểm danh đón/trả 1-chạm, ghi nhận đến muộn/đón sớm và tự động khóa sổ cuối tháng | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/operations/attendance.tsx |
| VH-02 | Ghi nhận thân nhiệt và quản lý sổ dặn thuốc y tế, xác nhận đã cho uống thuốc lúc HH:mm | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/operations/attendance.tsx |
| VH-03 | Xác thực người đón hộ học sinh từ danh sách người đưa đón hợp lệ đã đăng ký | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/operations/attendance.tsx |
| VH-04 | Báo vắng học sinh hàng loạt và phân loại vắng có phép hoặc không phép | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/operations/attendance.tsx |
| VH-10 | Cơ chế cập nhật lạc quan (optimistic update) khi điểm danh và tự động hoàn tác thông báo lỗi khi mất mạng | Xử lý state cục bộ, chưa có cơ chế retry queue và hoàn tác lỗi mạng | MISSING | repo:app/src/pages/[schoolCode]/operations/attendance.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-02, OQ-10, OQ-14, OQ-16, OQ-19, OQ-20, OQ-21).

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Thực thể Điểm danh hằng ngày](../entities/attendance-daily.md)
- [Thực thể Khấu trừ hoàn tiền ăn](../entities/meal-refund-credit.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md)
- [Luồng điểm danh đón trả](../flows/fl-diem-danh-don-tra.md)
- [Luồng báo vắng và hoàn tiền](../flows/fl-bao-vang-hoan-tien.md)
