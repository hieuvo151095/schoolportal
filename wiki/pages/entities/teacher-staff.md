---
title: Giáo Viên & Nhân Viên (Teacher & Staff)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-03
  - NT-10
updated: 2026-11-05
---

# Giáo Viên & Nhân Viên (Teacher & Staff)

## Định nghĩa
Thực thể lưu trữ danh bạ nhân sự, thông tin hợp đồng, trình độ chuyên môn, vai trò phân công công việc (Chủ nhiệm, Bộ môn, Cán bộ bán trú, Kế toán) và quyền hạn kiểm duyệt nội dung của cán bộ giáo viên, nhân viên nhà trường.

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| NT-03 | Phân quyền kiểm duyệt nội dung 2 cấp: Giáo viên chính được đăng bài hoạt động trực tiếp; Giáo viên hỗ trợ chuyển bài sang trạng thái Chờ duyệt | Trường `approval_role` (`direct_publish` hoặc `require_approval`) |
| NT-03 | Quản lý phân công lớp chủ nhiệm và môn học giảng dạy theo từng học kỳ | Một giáo viên có thể dạy nhiều môn tại nhiều lớp |
| NT-10 | Điểm danh theo ca làm việc (ca sáng, ca chiều) và tổng hợp bảng chấm công tháng | Hỗ trợ chấm công định vị hoặc vân tay/khuôn mặt |

## Quan hệ
- Chủ nhiệm hoặc giảng dạy tại [Lớp học](classroom.md).
- Thực hiện [Điểm danh hằng ngày](attendance-daily.md) cho học sinh.
- Đăng tải bài viết tại [Bảng tin hoạt động lớp](class-activity.md).
- Tạo và phát hành [Thời khóa biểu tuần](timetable-weekly.md) và [Bài tập về nhà](homework-assignment.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-03 | Quản lý danh bạ giáo viên và cơ chế kiểm duyệt nội dung bài đăng 2 cấp | Frontend prototype chưa tích hợp trạng thái phân quyền duyệt bài | MISSING | repo:app/src/features/teachers/ |
| NT-10 | Điểm danh ca làm việc và tổng hợp bảng chấm công nhân viên nhà trường | Màn hình chấm công nhân viên đang dùng dữ liệu mock | MISSING | repo:app/src/features/staff-attendance/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-06).

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Màn hình giáo viên](../screens/m5-sm2-giao-vien.md)
- [Luồng phân công giáo viên và kiểm duyệt](../flows/fl-phan-cong-giao-vien-kiem-duyet.md)
