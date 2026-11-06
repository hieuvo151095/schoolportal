---
title: Màn Hình Bình Chọn & Khảo Sát
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-08
apps:
  - web
route_ids:
  - /{schoolCode}/school/polls
status: missing
updated: 2026-11-05
---

# Màn Hình Bình Chọn & Khảo Sát

## Mục đích
Khởi tạo và tổng hợp các cuộc khảo sát ý kiến trực tuyến của phụ huynh và giáo viên.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/polls` | repo:app/src/pages/[schoolCode]/school/polls.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-08 | Khởi tạo bình chọn và khảo sát ý kiến trực tuyến của phụ huynh và giáo viên | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-08 | Khởi tạo bình chọn và khảo sát ý kiến trực tuyến của phụ huynh và giáo viên | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/polls.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-school-admin.md)
- [Thực thể liên quan](../entities/student-profile.md)
