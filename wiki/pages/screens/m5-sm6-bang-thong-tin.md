---
title: Màn Hình Bảng Thông Tin
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-07
apps:
  - web
route_ids:
  - /{schoolCode}/school/announcements
status: missing
updated: 2026-11-05
---

# Màn Hình Bảng Thông Tin

## Mục đích
Đăng tải các thông báo chính thức, tin tức nhà trường và thông điệp khẩn cấp tới toàn thể phụ huynh và giáo viên.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/announcements` | repo:app/src/pages/[schoolCode]/school/announcements.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-07 | Bảng thông tin điện tử truyền thông sự kiện và gửi thông báo khẩn cấp | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-07 | Bảng thông tin điện tử truyền thông sự kiện và gửi thông báo khẩn cấp | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/announcements.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-school-admin.md)
- [Thực thể liên quan](../entities/classroom.md)
