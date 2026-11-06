---
title: Màn Hình Điểm Danh Nhân Viên
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-10
apps:
  - web
route_ids:
  - /{schoolCode}/school/staff-attendance
status: missing
updated: 2026-11-05
---

# Màn Hình Điểm Danh Nhân Viên

## Mục đích
Chấm công ca làm việc và tổng hợp ngày công nhân sự nhà trường.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/staff-attendance` | repo:app/src/pages/[schoolCode]/school/staff-attendance.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-10 | Điểm danh ca làm việc và tổng hợp bảng chấm công nhân viên nhà trường | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-10 | Điểm danh ca làm việc và tổng hợp bảng chấm công nhân viên nhà trường | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/staff-attendance.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-school-admin.md)
- [Thực thể liên quan](../entities/teacher-staff.md)
