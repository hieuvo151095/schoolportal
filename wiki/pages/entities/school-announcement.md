---
title: Thực Thể Bảng Thông Tin Nhà Trường
type: entity
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-024-school-announcements/epic.md
spec_ids:
  - NT-07
updated: 2026-11-05
---

# Thực Thể Bảng Thông Tin Nhà Trường

## Định nghĩa
Đại diện cho các bài thông báo, tin tức truyền thông nội bộ hoặc thông báo khẩn cấp do Ban Giám Hiệu hoặc giáo viên gửi tới toàn trường, từng khối hoặc từng lớp học cụ thể.

## Thuộc tính & Quy tắc nghiệp vụ
- Hỗ trợ phân loại: Thông báo chung, Thông báo học tập, Thông báo học phí, Thông báo khẩn cấp.
- Trạng thái phát hành: `DRAFT` (bản nháp), `PUBLISHED` (đã phát hành), `ARCHIVED` (lưu trữ).
- Hỗ trợ đính kèm tệp tin tài liệu (PDF, Word) và ảnh minh họa.
- Tích hợp cờ gửi thông báo đẩy (Push Notification) đến ứng dụng di động của phụ huynh khi kích hoạt trạng thái khẩn cấp.

## Quan hệ
- Thuộc về một Trường học (`school_id`) và do một [Giáo viên & Nhân viên](teacher-staff.md) soạn thảo.
- Có thể định tuyến gửi tới toàn trường hoặc nhắm mục tiêu vào các [Lớp học](classroom.md) nhất định.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-07 | Bảng thông tin điện tử truyền thông sự kiện và gửi thông báo khẩn cấp | Type `Announcement`, Redux slice và giao diện CRUD | MISSING | repo:app/src/types/announcement.ts:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Màn hình bảng thông tin](../screens/m5-sm6-bang-thong-tin.md)
- [Khái niệm Cơ chế kiểm duyệt 2 cấp](../concepts/rbac-two-tier-moderation.md)
