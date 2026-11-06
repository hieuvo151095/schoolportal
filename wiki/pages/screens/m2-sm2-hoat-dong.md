---
title: Màn Hình Nhật Ký Hoạt Động Lớp
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - VH-05
apps:
  - web
route_ids:
  - /{schoolCode}/operations/activity
status: missing
updated: 2026-11-05
---

# Màn Hình Nhật Ký Hoạt Động Lớp

## Mục đích
Ghi nhận và xuất bản nhật ký hoạt động hằng ngày của lớp học kèm hình ảnh, gắn hashtag chủ đề và nhắc tên học sinh với cơ chế duyệt 2 cấp.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/operations/activity` | repo:app/src/pages/[schoolCode]/operations/activity.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| VH-05 | Đăng bài hoạt động lớp hỗ trợ gắn hashtag `#` chủ đề và nhắc tên học sinh `@` | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-05 | Đăng bài hoạt động lớp hỗ trợ gắn hashtag `#` chủ đề và nhắc tên học sinh `@` | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/operations/activity.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-operations.md)
- [Thực thể liên quan](../entities/class-activity.md)
- [Thực thể liên quan](../entities/teacher-staff.md)
- [Luồng liên quan](../flows/fl-dang-bai-kiem-duyet.md)
