---
title: Bài Tập Về Nhà (Homework Assignment)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - HT-02
updated: 2026-11-05
---

# Bài Tập Về Nhà (Homework Assignment)

## Định nghĩa
Thực thể Bài tập về nhà lưu trữ các yêu cầu tự học, tài liệu bài tập, hạn nộp bài và kết quả nộp bài của học sinh do giáo viên bộ môn hoặc giáo viên chủ nhiệm giao.

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| HT-02 | Tạo bài tập kèm tiêu đề, hướng dẫn nội dung, file đính kèm (PDF, hình ảnh) và thời hạn nộp bài cụ thể | Thông báo tự động gửi đến phụ huynh |
| HT-02 | Quản lý danh sách nộp bài: Phân loại Đã nộp (`submitted`), Nộp muộn (`late`), và Chưa nộp (`missing`) | Giáo viên chấm điểm và để lại nhận xét |

## Quan hệ
- Được tạo bởi [Giáo viên & Nhân viên](teacher-staff.md).
- Giao cho [Lớp học](classroom.md) hoặc từng [Hồ sơ học sinh 360](student-profile.md).
- Hiển thị trên [Màn hình bài tập](../screens/m3-sm2-bai-tap.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| HT-02 | Tạo bài tập về nhà kèm hạn nộp và theo dõi trạng thái nộp bài của học sinh | Giao diện bài tập mới hiển thị danh sách tĩnh, chưa có API upload bài nộp | MISSING | repo:app/src/features/academics/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ Học tập](../overview/module-academics.md)
- [Màn hình bài tập](../screens/m3-sm2-bai-tap.md)
- [Thời khóa biểu tuần](timetable-weekly.md)
