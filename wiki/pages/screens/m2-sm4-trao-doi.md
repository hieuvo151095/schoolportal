---
title: Màn Hình Tin Nhắn Trao Đổi
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - VH-07
apps:
  - web
route_ids:
  - /{schoolCode}/operations/conversations
status: missing
updated: 2026-11-05
---

# Màn Hình Tin Nhắn Trao Đổi

## Mục đích
Cung cấp kênh liên lạc và hội thoại trực tiếp 1:1 bảo mật giữa giáo viên và phụ huynh học sinh.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/operations/conversations` | repo:app/src/pages/[schoolCode]/operations/conversations.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| VH-07 | Kênh trò chuyện tin nhắn đa chiều 1:1 trực tiếp giữa giáo viên và phụ huynh | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-07 | Kênh trò chuyện tin nhắn đa chiều 1:1 trực tiếp giữa giáo viên và phụ huynh | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/operations/conversations.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-operations.md)
- [Thực thể liên quan](../entities/conversation-thread.md)
- [Thực thể liên quan](../entities/teacher-staff.md)
- [Thực thể liên quan](../entities/student-profile.md)
