---
title: Màn Hình Sổ Tay Phụ Huynh
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-11
apps:
  - web
route_ids:
  - /{schoolCode}/school/parent-handbook
status: missing
updated: 2026-11-05
---

# Màn Hình Sổ Tay Phụ Huynh

## Mục đích
Cung cấp sổ tay điện tử chứa nội quy, hướng dẫn và quy trình liên lạc nhà trường cho phụ huynh.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/parent-handbook` | repo:app/src/pages/[schoolCode]/school/parent-handbook.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-11 | Sổ tay phụ huynh điện tử công bố quy định và hướng dẫn của nhà trường | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-11 | Sổ tay phụ huynh điện tử công bố quy định và hướng dẫn của nhà trường | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/parent-handbook.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-school-admin.md)
- [Thực thể liên quan](../entities/student-profile.md)
