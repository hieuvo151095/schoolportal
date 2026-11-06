---
title: Màn Hình Báo Cáo Mở Rộng
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - VH-08
apps:
  - web
route_ids:
  - /{schoolCode}/operations/reports/extended
status: missing
updated: 2026-11-05
---

# Màn Hình Báo Cáo Mở Rộng

## Mục đích
Cung cấp các mẫu báo cáo tổng hợp chuyên sâu về sức khỏe, thể lực BMI và thống kê vận hành toàn trường.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/operations/reports/extended` | repo:app/src/pages/[schoolCode]/operations/reports/extended.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| VH-08 | Xuất lưới điểm danh tháng và các mẫu báo cáo đánh giá định kỳ ra Excel | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-08 | Xuất lưới điểm danh tháng và các mẫu báo cáo đánh giá định kỳ ra Excel | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/operations/reports/extended.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-operations.md)
- [Thực thể liên quan](../entities/attendance-daily.md)
- [Thực thể liên quan](../entities/student-profile.md)
