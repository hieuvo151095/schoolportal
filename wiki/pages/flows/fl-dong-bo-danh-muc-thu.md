---
title: Luồng Đồng Bộ & Áp Dụng Danh Mục Thu CSDL Sở
type: flow
sources:
  - pages/sources/src-development-epics-manifest.md
  - pages/sources/src-open-questions-resolutions.md
  - repo:docs/guides/development/E-010-finance-fee-catalog/epic.md
spec_ids:
  - TC-19
  - TC-20
updated: 2026-11-05
---

# Luồng Đồng Bộ & Áp Dụng Danh Mục Thu CSDL Sở

## Mục tiêu
Đảm bảo các khoản phí thu từ học sinh trong toàn trường và thông tin định danh luôn tuân thủ đúng khung pháp lý và mã danh mục thu do Sở Giáo Dục & Đào Tạo ban hành, giải quyết sai lệch dữ liệu (Data Drift) và cô lập lỗi đồng bộ ngắt quãng từng học sinh.

## Các bước
| Bước | Vai trò | Ứng dụng | Hành động | Kết quả mong đợi |
|---|---|---|---|---|
| 1 | Ban Giám Hiệu / Kế toán | Web Admin | Vào màn hình Danh mục thu (`/school/revenue-categories`) | Hiển thị danh mục thu hiện hành |
| 2 | Kế toán trường | Web Admin | Nhấn nút "Đồng bộ từ CSDL Sở" | Hệ thống kích hoạt API kéo danh mục mới và quét Data Drift |
| 3 | Hệ thống | Server Backend | Kiểm tra và cập nhật danh mục, đánh dấu `ARCHIVED` cho các mục hết hiệu lực; phát hiện sai lệch dữ liệu với CSDL ngành | Cập nhật bảng danh mục; cảnh báo các điểm Data Drift nếu có |
| 4 | Kế toán trường | Web Admin | Xử lý hòa giải sai lệch dữ liệu (Data Drift Reconciliation - OQ-15): Chọn Cập nhật theo Sở hoặc lập Biên bản giải trình | Đồng bộ nhất quán dữ liệu pháp lý |
| 5 | Quản trị viên | Web Admin | Kích hoạt khóa đồng bộ kỳ thi `is_sync_locked = true` khi Sở chốt dữ liệu thi | Khóa cứng dữ liệu định danh học sinh, ngăn chặn chỉnh sửa trái phép |
| 6 | Kế toán trường | Web Admin | Chọn các khoản thu phù hợp với đặc thù trường và bật trạng thái áp dụng (`usable = true`) | Kích hoạt khoản thu cho trường |

## Quy tắc chặn / validation
- Không cho phép gán khoản phí học sinh vào một mục thu CSDL Sở đang có trạng thái `ARCHIVED` hoặc `active = false`.
- **Cơ chế Khóa dữ liệu kỳ thi (`is_sync_locked` - OQ-15):** Khi Sở GD&ĐT chốt kỳ thi, cờ khóa cứng thông tin định danh học sinh. Muốn mở khóa phải có phiếu phê duyệt của BGH và lưu vết vào `SyncLockAuditTrail`.
- **Cô lập lỗi ngắt quãng từng học sinh (OQ-15):** Khi đồng bộ hàng loạt, học sinh bị lỗi schema/dữ liệu được đưa vào Retry Queue (3 lần Exponential Backoff) hoặc Dead Letter Queue (DLQ). Toàn bộ các học sinh còn lại vẫn đồng bộ thành công, không rollback cả lô.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TC-19 | Quản lý danh mục thu chuẩn hóa kết nối cơ sở dữ liệu Bộ/Sở GD&ĐT (CSDL Sở) | Nút đồng bộ và bảng hiển thị danh mục thu | MISSING | repo:app/src/pages/[schoolCode]/school/revenue-categories/index.tsx:1 |
| TC-20 | Ánh xạ mã tiểu mục tài chính và đồng bộ trạng thái danh mục thu với hệ thống Managing Portal | Xử lý state `syncing`, cập nhật dữ liệu vào Redux store | MISSING | repo:app/src/store/slices/revenueCategorySlice.ts:1 |

## Liên quan
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Thực thể Danh mục thu CSDL Sở](../entities/revenue-category.md)
- [Thực thể Danh mục khoản phí](../entities/fee-catalog-item.md)
- [Khái niệm Tích hợp CSDL Sở](../concepts/csdl-so-integration.md)
- [Màn hình danh mục thu](../screens/m4-sm7-danh-muc-thu.md)
- [Màn hình khoản phí](../screens/m4-sm3-khoan-phi.md)
