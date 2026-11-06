---
title: Màn Hình Báo Cáo Điểm Danh
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - VH-08
apps:
  - web
route_ids:
  - /{schoolCode}/operations/reports/attendance
status: missing
updated: 2026-11-05
---

# Màn Hình Báo Cáo Điểm Danh

## Mục đích
Tổng hợp lưới điểm danh tháng, thống kê chuyên cần, hiển thị trạng thái khóa đóng băng dữ liệu tháng cũ (Monthly Attendance Auto-Freeze - OQ-21) và xuất file Excel đối soát phục vụ thanh tra lưu trữ.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/operations/reports/attendance` | repo:app/src/pages/[schoolCode]/operations/reports/attendance.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| VH-08 | Xuất lưới điểm danh tháng và các mẫu báo cáo đánh giá định kỳ ra Excel | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| VH-08 | Xuất lưới điểm danh tháng và các mẫu báo cáo đánh giá định kỳ ra Excel | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/operations/reports/attendance.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-21).

## Liên quan
- [Phân hệ tương ứng](../overview/module-operations.md)
- [Thực thể liên quan](../entities/attendance-daily.md)
- [Thực thể liên quan](../entities/meal-refund-credit.md)
