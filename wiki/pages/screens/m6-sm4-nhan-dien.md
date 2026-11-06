---
title: Màn Hình Cấu Hình Nhận Diện AI
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - CH-04
apps:
  - web
route_ids:
  - /{schoolCode}/settings/face-recognition
status: missing
updated: 2026-11-05
---

# Màn Hình Cấu Hình Nhận Diện AI

## Mục đích
Cấu hình tham số mô hình AI nhận diện khuôn mặt, độ nhạy ngưỡng tin cậy (mặc định $\ge 0.85$), huấn luyện vector mẫu, và thiết lập chế độ bảo vệ quyền riêng tư sinh trắc học Opt-Out (`AUTO_BLUR_FACE` / `EXCLUDE_FROM_PUBLIC_ALBUM` theo Nghị định 13/2023/NĐ-CP - OQ-16).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/settings/face-recognition` | repo:app/src/pages/[schoolCode]/settings/face-recognition.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-04 | Cấu hình mô hình AI nhận diện khuôn mặt, ngưỡng nhạy độ tin cậy và chế độ bảo vệ quyền riêng tư Opt-Out OQ-16 | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-04 | Cấu hình mô hình AI nhận diện khuôn mặt và ngưỡng nhạy độ tin cậy nhận diện | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/settings/face-recognition.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-04, OQ-16).

## Liên quan
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md)
- [Hồ sơ sinh trắc khuôn mặt](../entities/face-biometric-registration.md)
- [Thư viện media](../entities/media-album.md)
- [Luồng đăng ký sinh trắc khuôn mặt](../flows/fl-dang-ky-sinh-trac-khuon-mat.md)
