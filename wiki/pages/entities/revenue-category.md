---
title: Thực Thể Danh Mục Thu CSDL Sở
type: entity
sources:
  - pages/sources/src-development-epics-manifest.md
  - pages/sources/src-open-questions-resolutions.md
  - repo:docs/guides/development/E-010-finance-fee-catalog/epic.md
spec_ids:
  - TC-19
  - TC-20
updated: 2026-11-05
---

# Thực Thể Danh Mục Thu CSDL Sở

## Định nghĩa
Đại diện cho danh mục các nguồn thu, khoản thu chuẩn hóa theo quy định của Sở Giáo Dục & Đào Tạo và hệ thống Managing Portal, làm cơ sở pháp lý để trường học thiết lập các khoản phí thu từ phụ huynh và đối soát dữ liệu với CSDL ngành.

## Thuộc tính & Quy tắc nghiệp vụ
- **Thuộc tính chính:** Mã danh mục (`code`), Tên khoản thu chuẩn (`name`), Đơn vị tính (`unit`), Căn cứ pháp lý (`legal_reference`), Ngày bắt đầu áp dụng (`effective_from`), Ngày kết thúc (`effective_to`).
- **Trạng thái:** `PUBLISHED` (Đang áp dụng), `DRAFT` (Bản nháp), `ARCHIVED` (Ngừng áp dụng).
- **Cơ chế đồng bộ:** Tích hợp nút đồng bộ trực tiếp (`Sync from CSDL Sở`) để kéo danh mục mới nhất từ máy chủ của cơ quan quản lý giáo dục.
- Không thể chỉnh sửa trực tiếp tên hoặc mã của các khoản thu bắt buộc do Sở ban hành; trường học chỉ được phép bật/tắt cờ `usable` (áp dụng tại trường mình hay không).
- **Hòa giải sai lệch dữ liệu & Xử lý lỗi ngắt quãng từng học sinh (OQ-15):**
  - Khi đồng bộ phát hiện Data Drift giữa CSDL Portal và CSDL ngành, hệ thống hiển thị cảnh báo đối chiếu 2 cột và hỗ trợ cập nhật theo Sở hoặc lập biên bản giải trình.
  - Đồng bộ lô áp dụng sub-transaction cho từng học sinh; lỗi ngắt quãng được đưa vào Retry Queue (3 lần Exponential Backoff) và Dead Letter Queue (DLQ), không làm gián đoạn toàn bộ đợt đồng bộ.

## Quan hệ
- Là căn cứ phân loại cha cho [Danh mục khoản phí](fee-catalog-item.md).
- Kết nối logic với [Màn hình danh mục thu](../screens/m4-sm7-danh-muc-thu.md) và cấu trúc kế toán học phí.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-19 | Quản lý danh mục thu chuẩn hóa kết nối cơ sở dữ liệu Bộ/Sở GD&ĐT (CSDL Sở) | Type `RevenueCategory`, Redux slice và mock data | MISSING | repo:app/src/types/revenueCategory.ts:1 |
| TC-20 | Ánh xạ mã tiểu mục tài chính và đồng bộ trạng thái danh mục thu với hệ thống Managing Portal | Action `syncStart`, `syncSuccess` trên Redux | MISSING | repo:app/src/store/slices/revenueCategorySlice.ts:1 |

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Màn hình danh mục thu](../screens/m4-sm7-danh-muc-thu.md)
- [Thực thể Danh mục khoản phí](fee-catalog-item.md)
- [Khái niệm Tích hợp CSDL Sở](../concepts/csdl-so-integration.md)
- [Luồng đồng bộ danh mục thu](../flows/fl-dong-bo-danh-muc-thu.md)
