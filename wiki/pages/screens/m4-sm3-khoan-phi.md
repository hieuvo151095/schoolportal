---
title: Màn Hình Danh Mục Khoản Phí
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-03
apps:
  - web
route_ids:
  - /{schoolCode}/finance/fee-catalog
status: missing
updated: 2026-11-05
---

# Màn Hình Danh Mục Khoản Phí

## Mục đích
Quản lý danh mục 24 khoản thu toàn trường (bắt buộc, tự chọn, đơn giá chuẩn và chu kỳ thu), bao gồm cấu hình các khoản thu ngoại khóa linh hoạt theo kỳ (`TERM_FIXED`) hoặc theo buổi thực tế (`PER_SESSION`) và gắn cờ phân rã Sub-invoice `is_separable` (OQ-14).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/finance/fee-catalog` | repo:app/src/pages/[schoolCode]/finance/fee-catalog.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| TC-03 | Quản lý danh mục 24 khoản thu toàn trường gồm 3 khoản hệ thống, 21 khoản tùy chỉnh và cấu hình biểu phí ngoại khóa OQ-14 | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-03 | Quản lý danh mục 24 khoản thu toàn trường gồm 3 khoản hệ thống và 21 khoản tùy chỉnh | Prototype frontend mockup, chưa có API backend | MISSING | repo:app/src/pages/[schoolCode]/finance/fee-catalog.tsx |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-14).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Thực thể Danh mục khoản phí](../entities/fee-catalog-item.md)
- [Thực thể Chính sách miễn giảm](../entities/discount-policy.md)
