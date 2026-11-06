---
title: Màn Hình Quản Lý Môn Học
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-05
apps:
  - web
route_ids:
  - /{schoolCode}/school/subjects
status: missing
updated: 2026-11-05
---

# Màn Hình Quản Lý Môn Học

## Mục đích
Quản lý danh mục môn học giảng dạy trong toàn trường và phân công tổ chuyên môn.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/subjects` | repo:app/src/pages/[schoolCode]/school/subjects.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-05 | Quản lý danh mục môn học và phân công giáo viên giảng dạy | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-05 | Quản lý danh mục môn học và phân công giáo viên giảng dạy | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/subjects.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-school-admin.md)
- [Thực thể liên quan](../entities/teacher-staff.md)
