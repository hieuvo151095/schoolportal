---
title: Màn Hình Danh Mục Khoản Phí
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
spec_ids:
  - TC-03
  - TC-24
apps:
  - web
route_ids:
  - /{schoolCode}/school/school-fees
status: partial
updated: 2026-11-10
---

# Màn Hình Danh Mục Khoản Phí

## Mục đích
Quản lý danh mục 24 khoản thu toàn trường (bắt buộc, tự chọn, đơn giá chuẩn và chu kỳ thu), bao gồm cấu hình các khoản thu ngoại khóa linh hoạt theo kỳ (`TERM_FIXED`) hoặc theo buổi thực tế (`PER_SESSION`), gắn cờ phân rã Sub-invoice `is_separable` (OQ-14) và cấu hình bật/tắt Xuất HĐĐT an toàn 2 bước với phân tầng z-index nổi trên mặt bảng (TC-24).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/school-fees` | repo:app/src/pages/[schoolCode]/school/school-fees/index.tsx |
| web | Component Bảng Danh Mục | repo:app/src/modules/finance/catalog/FeeCatalogTable.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| TC-03 | Quản lý danh mục 24 khoản thu toàn trường gồm 3 khoản hệ thống, 21 khoản tùy chỉnh và cấu hình biểu phí ngoại khóa OQ-14 | DONE |
| TC-24 | Cột "Xuất HĐĐT" hiển thị tinh gọn "Có" / "Không" kèm icon `chevron-down`. Click mở menu chọn option; chỉ khi chọn option khác mới hiển thị pop-up confirm xác nhận. Toàn bộ dropdown/menu phải nổi trên layer bảng (`z-index: 1000`) | DONE |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-03 | Quản lý danh mục 24 khoản thu toàn trường gồm 3 khoản hệ thống và 21 khoản tùy chỉnh | Đã hoàn thiện giao diện và state Redux, chưa kết nối API backend | PARTIAL | repo:app/src/modules/finance/catalog/FeeCatalogTable.tsx |
| TC-24 | Dropdown Xuất HĐĐT chọn 2 bước (Có/Không + Popup Confirm) và z-index layer chuẩn | Đã thi công hoàn chỉnh trên frontend và Design System | DONE | repo:app/src/modules/finance/catalog/FeeCatalogTable.tsx:40 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-14).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Điều phối lịch học, biểu phí & phân rã ngoại khóa](../concepts/extracurricular-billing-scheduling.md)
- [Thực thể Danh mục khoản phí](../entities/fee-catalog-item.md)
- [Thực thể Chính sách miễn giảm](../entities/discount-policy.md)
