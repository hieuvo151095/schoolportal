---
title: Phân Hệ Quản Trị Nhà Trường
type: overview
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
updated: 2026-11-05
---

# Phân Hệ Quản Trị Nhà Trường

## Tóm tắt
Phân hệ Nhà trường quản trị toàn bộ dữ liệu gốc của cơ sở giáo dục: Danh bạ học sinh 360°, giáo viên & nhân viên, phân công kiểm duyệt bài viết, quản trị lớp học (chính khóa/ngoại khóa) kèm chốt chặn an toàn khi xóa lớp, môn học, khối lớp, truyền thông bảng tin, khảo sát bình chọn, thực đơn dinh dưỡng, chấm công nhân viên, sổ tay phụ huynh, hòm thư góp ý, lịch sự kiện, niên khóa và kho lưu trữ.

## Bản đồ
| Nhóm | Trang |
|---|---|
| Thực thể | [Hồ sơ học sinh 360](../entities/student-profile.md), [Giáo viên & Nhân viên](../entities/teacher-staff.md), [Lớp học](../entities/classroom.md), [Niên khóa & Học kỳ](../entities/academic-year.md), [Bảng thông tin](../entities/school-announcement.md), [Khảo sát & Bình chọn](../entities/school-poll.md), [Thực đơn dinh dưỡng tuần](../entities/weekly-menu.md), [Lịch sự kiện](../entities/calendar-event.md), [Môn học](../entities/school-subject.md), [Khối lớp](../entities/grade-level.md), [Sổ tay phụ huynh](../entities/parent-handbook.md), [Góp ý & Khiếu nại](../entities/parent-feedback.md), [Điểm danh nhân sự](../entities/staff-attendance.md), [Hồ sơ lưu trữ học sinh](../entities/student-archive-record.md) |
| Khái niệm | [Chốt chặn an toàn khi xóa lớp](../concepts/class-deletion-guard.md), [Cơ chế kiểm duyệt 2 cấp](../concepts/rbac-two-tier-moderation.md), [Vòng đời chuyển tiếp học sinh](../concepts/student-lifecycle-transitions.md), [Điều phối ngoại khóa](../concepts/extracurricular-billing-scheduling.md) |
| Luồng | [Quản lý hồ sơ học sinh 360](../flows/fl-quan-ly-ho-so-hoc-sinh-360.md), [Chuyển lớp và chuyển năm học](../flows/fl-chuyen-lop-va-chuyen-nam-hoc.md), [Phân công giáo viên](../flows/fl-phan-cong-giao-vien-kiem-duyet.md), [Khảo sát bình chọn](../flows/fl-khao-sat-binh-chon.md), [Lập thực đơn dinh dưỡng](../flows/fl-lap-thuc-don-dinh-duong.md), [Tiếp nhận và xử lý góp ý](../flows/fl-tiep-nhan-xu-ly-gop-y.md), [Điểm danh chấm công nhân viên](../flows/fl-diem-danh-cham-cong-nv.md), [Kho lưu trữ học sinh](../flows/fl-kho-luu-tru-hoc-sinh.md) |
| Màn hình | [Học sinh](../screens/m5-sm1-hoc-sinh.md), [Giáo viên](../screens/m5-sm2-giao-vien.md), [Lớp học](../screens/m5-sm3-lop-hoc.md), [Môn học](../screens/m5-sm4-mon-hoc.md), [Khối lớp](../screens/m5-sm5-khoi-lop.md), [Bảng thông tin](../screens/m5-sm6-bang-thong-tin.md), [Bình chọn](../screens/m5-sm7-binh-chon.md), [Thực đơn](../screens/m5-sm8-thuc-don.md), [Điểm danh NV](../screens/m5-sm9-diem-danh-nv.md), [Sổ tay PH](../screens/m5-sm10-so-tay-ph.md), [Góp ý](../screens/m5-sm11-gop-y.md), [Lịch sự kiện](../screens/m5-sm12-lich-su-kien.md), [Năm học](../screens/m5-sm13-nam-hoc.md), [Lưu trữ](../screens/m5-sm14-luu-tru.md) |

## Liên quan
- [Tổng quan dự án](project-overview.md)
- [Phân hệ Vận hành](module-operations.md)
- [Phân hệ Học tập](module-academics.md)
