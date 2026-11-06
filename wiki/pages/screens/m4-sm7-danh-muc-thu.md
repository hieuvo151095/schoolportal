---
title: Màn Hình Danh Mục Thu (Revenue Categories)
type: screen
sources:
  - pages/sources/src-development-epics-manifest.md
  - pages/sources/src-open-questions-resolutions.md
  - repo:docs/guides/development/E-010-finance-fee-catalog/epic.md
spec_ids:
  - TC-19
  - TC-20
apps:
  - web
route_ids:
  - /{schoolCode}/school/revenue-categories
status: missing
updated: 2026-11-05
---

# Màn Hình Danh Mục Thu (Revenue Categories)

## Mục đích
Quản lý danh mục các khoản thu chuẩn hóa kết nối với Cơ sở dữ liệu Bộ/Sở Giáo Dục & Đào Tạo (CSDL Sở) và đồng bộ trạng thái áp dụng thu học phí với Managing Portal; hiển thị trạng thái Khóa dữ liệu kỳ thi (`is_sync_locked`), bảng đối soát hòa giải sai lệch dữ liệu (Data Drift), và theo dõi hàng đợi thử lại (Retry Queue / DLQ) khi xảy ra lỗi ngắt quãng từng học sinh (OQ-15).

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/school/revenue-categories` | repo:app/src/pages/[schoolCode]/school/revenue-categories/index.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| TC-19 | Quản lý danh mục thu chuẩn hóa kết nối CSDL Sở, hòa giải Data Drift và Retry Queue DLQ OQ-15 | MISSING |
| TC-20 | Ánh xạ mã tiểu mục tài chính và đồng bộ trạng thái danh mục thu với hệ thống Managing Portal | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-19 | Quản lý danh mục thu chuẩn hóa kết nối cơ sở dữ liệu Bộ/Sở GD&ĐT (CSDL Sở) | Prototype frontend mockup với giao diện bảng DataTable, bộ lọc trạng thái và nút đồng bộ CSDL Sở | MISSING | repo:app/src/pages/[schoolCode]/school/revenue-categories/index.tsx:34 |
| TC-20 | Ánh xạ mã tiểu mục tài chính và đồng bộ trạng thái danh mục thu với hệ thống Managing Portal | Redux slice quản lý state, chưa kết nối API backend thật | MISSING | repo:app/src/store/slices/revenueCategorySlice.ts:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md) mục OQ-15).

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Thực thể Danh mục thu CSDL Sở](../entities/revenue-category.md)
- [Thực thể Danh mục khoản phí](../entities/fee-catalog-item.md)
- [Thực thể Hồ sơ học sinh 360](../entities/student-profile.md)
- [Khái niệm Tích hợp CSDL Sở](../concepts/csdl-so-integration.md)
- [Luồng đồng bộ danh mục thu](../flows/fl-dong-bo-danh-muc-thu.md)
- [Màn hình khoản phí](../screens/m4-sm3-khoan-phi.md)
