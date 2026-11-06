---
title: Màn Hình Quản Lý Giáo Viên
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-03
apps:
  - web
route_ids:
  - /{schoolCode}/school/teachers
status: missing
updated: 2026-11-05
---

# Màn Hình Quản Lý Giáo Viên

## Mục đích
Quản lý hồ sơ giáo viên, phân công chủ nhiệm/bộ môn và cơ chế duyệt bài 2 cấp.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/teachers` | repo:app/src/pages/[schoolCode]/school/teachers.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-03 | Quản lý danh bạ giáo viên và cơ chế kiểm duyệt nội dung bài đăng 2 cấp | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-03 | Quản lý danh bạ giáo viên và cơ chế kiểm duyệt nội dung bài đăng 2 cấp | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/teachers.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-school-admin.md)
- [Thực thể liên quan](../entities/teacher-staff.md)
- [Luồng liên quan](../flows/fl-phan-cong-giao-vien-kiem-duyet.md)
