---
title: Lớp Học (Classroom)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - NT-04
  - NT-02
updated: 2026-11-05
---

# Lớp Học (Classroom)

## Định nghĩa
Thực thể Lớp học đại diện cho đơn vị tổ chức học tập và sinh hoạt của học sinh trong một niên khóa. Hệ thống phân chia rạch ròi giữa Lớp chính khóa và Lớp ngoại khóa (câu lạc bộ năng khiếu, kỹ năng, thể thao).

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| NT-04 | Phân loại lớp: Lớp chính khóa (bật toàn diện điểm danh, học vụ, học phí) và Lớp ngoại khóa (chỉ bật điểm danh và bài tập riêng) | Thuộc tính `class_type`: `standard` hoặc `extracurricular` |
| NT-04 | Chốt chặn an toàn khi xóa lớp: Cấm xóa khi có học sinh hoặc đã phát sinh giao dịch tài chính; chỉ cho phép xóa lớp rỗng | Xem chi tiết tại [Chốt chặn an toàn khi xóa lớp](../concepts/class-deletion-guard.md) |
| NT-04 | Chốt chặn bảo toàn công nợ (OQ-12): Cấm xóa vĩnh viễn nếu còn học sinh nợ học phí (`balance_due > 0`); chuyển sang `Archived` khi kết thúc năm học | Công nợ chuyển sang năm học mới theo học sinh |
| NT-04 | Lớp ngoại khóa & Biểu phí linh hoạt (OQ-14): Kiểm tra xung đột lịch 4 chiều; hỗ trợ tính phí `TERM_FIXED` (cố định tháng/kỳ) hoặc `PER_SESSION` (theo buổi điểm danh thực tế) | Chi tiết tại [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md) |
| NT-02 | Mỗi lớp thuộc về một Khối lớp và một Niên khóa cụ thể; có giáo viên chủ nhiệm và phòng học cố định | Hỗ trợ chuyển giao niên khóa |

## Quan hệ
- Chứa danh sách các [Hồ sơ học sinh 360](student-profile.md).
- Được phân công phụ trách bởi [Giáo viên & Nhân viên](teacher-staff.md).
- Có cấu hình [Biểu phí theo lớp](fee-catalog-item.md).
- Gắn liền với các bản ghi [Điểm danh hằng ngày](attendance-daily.md) và [Thời khóa biểu tuần](timetable-weekly.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-04 | Phân loại lớp chính khóa và ngoại khóa kèm chốt chặn an toàn khi xóa lớp | Logic chốt chặn xóa lớp chưa có API backend kiểm tra ràng buộc | MISSING | repo:app/src/features/classes/ |
| NT-02 | Chuyển lớp học sinh và chuyển năm học hàng loạt với bảo toàn kết quả học tập | Chưa có chức năng backend chuyển đổi lớp học hàng loạt | MISSING | repo:app/src/features/classes/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-05 và OQ-14).

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Chốt chặn an toàn khi xóa lớp](../concepts/class-deletion-guard.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Màn hình lớp học](../screens/m5-sm3-lop-hoc.md)
