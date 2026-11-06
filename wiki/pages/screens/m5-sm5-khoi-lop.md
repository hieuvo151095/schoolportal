---
title: Màn Hình Quản Lý Khối Lớp
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-06
apps:
  - web
route_ids:
  - /{schoolCode}/school/grades
status: missing
updated: 2026-11-05
---

# Màn Hình Quản Lý Khối Lớp

## Mục đích
Quản trị danh mục các khối lớp (Khối Mầm, Chồi, Lá hoặc Khối 1 đến Khối 12) theo chương trình giáo dục.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/grades` | repo:app/src/pages/[schoolCode]/school/grades.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-06 | Quản lý danh mục khối lớp học và định tuyến chương trình liên cấp | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-06 | Quản lý danh mục khối lớp học và định tuyến chương trình liên cấp | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/grades.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-school-admin.md)
- [Thực thể liên quan](../entities/classroom.md)
