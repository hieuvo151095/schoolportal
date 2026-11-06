---
title: Bảng Tin Hoạt Động Lớp (Class Activity)
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-05
updated: 2026-11-05
---

# Bảng Tin Hoạt Động Lớp (Class Activity)

## Định nghĩa
Thực thể Bảng tin hoạt động lớp lưu trữ nhật ký hằng ngày của lớp học, các hình ảnh sinh hoạt, bài học trải nghiệm và tương tác phụ huynh (bình luận, thả tim).

## Thuộc tính / quy tắc nghiệp vụ
| Mã | Quy tắc | Ghi chú |
|---|---|---|
| VH-05 | Đăng bài viết kèm album hình ảnh/video, hỗ trợ gắn thẻ hashtag chủ đề (`#`) và nhắc tên học sinh (`@`) | Phụ huynh nhận được thông báo khi con được nhắc tên |
| VH-05 | Cơ chế kiểm duyệt 2 cấp: Bài đăng của giáo viên chính được đăng ngay; bài đăng của giáo viên hỗ trợ chuyển sang trạng thái Chờ duyệt (`pending_review`) | Chi tiết tại [Quyết định OQ-06](../sources/src-open-questions-resolutions.md) |

## Quan hệ
- Thuộc về một [Lớp học](classroom.md).
- Được đăng bởi [Giáo viên & Nhân viên](teacher-staff.md).
- Nhắc đến các [Hồ sơ học sinh 360](student-profile.md).
- Hiển thị trên [Màn hình hoạt động](../screens/m2-sm2-hoat-dong.md).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-05 | Đăng bài hoạt động lớp hỗ trợ gắn hashtag `#` chủ đề và nhắc tên học sinh `@` | Giao diện đăng bài chưa hỗ trợ autocomplete hashtag và mention học sinh | MISSING | repo:app/src/features/activity/ |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-06).

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Màn hình hoạt động](../screens/m2-sm2-hoat-dong.md)
- [Luồng đăng bài kiểm duyệt](../flows/fl-dang-bai-kiem-duyet.md)
