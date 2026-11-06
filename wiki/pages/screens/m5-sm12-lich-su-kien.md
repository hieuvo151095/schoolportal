---
title: Màn Hình Lịch Sự Kiện
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-13
apps:
  - web
route_ids:
  - /{schoolCode}/school/calendar
status: missing
updated: 2026-11-05
---

# Màn Hình Lịch Sự Kiện

## Mục đích
Quản lý và hiển thị lịch các ngày lễ, kỳ thi, hoạt động dã ngoại và sự kiện toàn trường.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/calendar` | repo:app/src/pages/[schoolCode]/school/calendar.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-13 | Lịch sự kiện và hoạt động trải nghiệm ngoại khóa toàn trường | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-13 | Lịch sự kiện và hoạt động trải nghiệm ngoại khóa toàn trường | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/calendar.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-school-admin.md)
- [Thực thể liên quan](../entities/classroom.md)
