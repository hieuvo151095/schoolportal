---
title: Màn Hình Hòm Thư Góp Ý
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - NT-12
apps:
  - web
route_ids:
  - /{schoolCode}/school/parent-feedback
status: missing
updated: 2026-11-05
---

# Màn Hình Hòm Thư Góp Ý

## Mục đích
Tiếp nhận, xử lý và phản hồi ý kiến đóng góp, khiếu nại của phụ huynh học sinh.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/parent-feedback` | repo:app/src/pages/[schoolCode]/school/parent-feedback.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| NT-12 | Hòm thư tiếp nhận và xử lý góp ý, phản hồi khiếu nại của phụ huynh học sinh | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-12 | Hòm thư tiếp nhận và xử lý góp ý, phản hồi khiếu nại của phụ huynh học sinh | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/school/parent-feedback.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-school-admin.md)
- [Thực thể liên quan](../entities/conversation-thread.md)
