---
title: Màn Hình Thư Viện Media & AI
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - VH-06
apps:
  - web
route_ids:
  - /{schoolCode}/operations/media
status: missing
updated: 2026-11-05
---

# Màn Hình Thư Viện Media & AI

## Mục đích
Quản lý album hình ảnh và video sự kiện của lớp và toàn trường, ứng dụng AI nhận diện khuôn mặt tự động gắn thẻ học sinh, đồng thời hỗ trợ chế độ bảo vệ quyền riêng tư sinh trắc học `opt_out_face_ai` (tự động làm mờ mặt và gắn biểu tượng lá chắn bảo vệ theo Nghị định 13/2023/NĐ-CP - OQ-16).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/operations/media` | repo:app/src/pages/[schoolCode]/operations/media.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| VH-06 | Thư viện media tự động gắn thẻ khuôn mặt học sinh bằng AI và tôn trọng cờ opt-out quyền riêng tư (OQ-16) | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-06 | Thư viện media tự động gắn thẻ khuôn mặt học sinh trong ảnh lớp bằng AI | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/operations/media.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-04, OQ-16).

## Liên quan
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Thực thể Thư viện media](../entities/media-album.md)
- [Thực thể Hồ sơ học sinh 360](../entities/student-profile.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Luồng nhận diện album ảnh](../flows/fl-nhan-dien-album-anh.md)
