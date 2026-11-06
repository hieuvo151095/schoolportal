---
title: Màn Hình Cấu Hình Biểu Phí Theo Lớp
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - TC-04
apps:
  - web
route_ids:
  - /{schoolCode}/finance/tuition-management
status: missing
updated: 2026-11-05
---

# Màn Hình Cấu Hình Biểu Phí Theo Lớp

## Mục đích
Gán gói khoản thu và đơn giá tùy chỉnh phù hợp cho từng lớp học hoặc khối học cụ thể.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/finance/tuition-management` | repo:app/src/pages/[schoolCode]/finance/tuition-management.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| TC-04 | Cấu hình gói biểu phí và đơn giá áp dụng riêng biệt cho từng lớp học hoặc khối lớp | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-04 | Cấu hình gói biểu phí và đơn giá áp dụng riêng biệt cho từng lớp học hoặc khối lớp | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/finance/tuition-management.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-finance.md)
- [Thực thể liên quan](../entities/fee-catalog-item.md)
- [Thực thể liên quan](../entities/classroom.md)
