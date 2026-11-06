---
title: Phân Hệ Tài Chính & Học Phí
type: overview
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-open-questions-resolutions.md
  - pages/sources/src-prd-co-che-hoan-tien.md
  - pages/sources/src-prd-mien-giam-hoc-phi.md
  - pages/sources/src-development-epics-manifest.md
updated: 2026-11-05
---

# Phân Hệ Tài Chính & Học Phí

## Tóm tắt
Phân hệ Tài chính là trụ cột kế toán trường học, tự động hóa quy trình phát hành hóa đơn học phí với mã VietQR động, đối soát khấu trừ tiền ăn bán trú theo điểm danh tháng trước, quản lý danh mục 24 khoản thu, cấu hình biểu phí từng lớp, theo dõi phiếu chi nội bộ, chính sách miễn giảm học phí linh hoạt và chuẩn hóa Danh mục thu liên thông với CSDL Sở Giáo Dục & Đào Tạo.

## Bản đồ
| Nhóm | Trang |
|---|---|
| Thực thể | [Hóa đơn học phí](../entities/tuition-invoice.md), [Danh mục khoản phí](../entities/fee-catalog-item.md), [Chính sách miễn giảm](../entities/discount-policy.md), [Khấu trừ hoàn tiền ăn](../entities/meal-refund-credit.md), [Phiếu chi nội bộ](../entities/expense-voucher.md), [Danh mục thu CSDL Sở](../entities/revenue-category.md), [Phiên đối soát giao dịch](../entities/reconciliation-session.md) |
| Khái niệm | [Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md), [Thuật toán giải quyết xung đột miễn giảm](../concepts/discount-deduplication.md), [Kiến trúc VietQR và đối soát](../concepts/vietqr-dynamic-reconciliation.md), [Tích hợp CSDL Sở](../concepts/csdl-so-integration.md), [Điều phối ngoại khóa & Phân rã](../concepts/extracurricular-billing-scheduling.md) |
| Luồng | [Lập và phát hành hóa đơn](../flows/fl-lap-phat-hanh-hoa-don.md), [Báo vắng hoàn tiền](../flows/fl-bao-vang-hoan-tien.md), [Thiết lập miễn giảm](../flows/fl-thiet-lap-mien-giam.md), [Đối soát giao dịch](../flows/fl-doi-soat-giao-dich.md), [Lập duyệt phiếu chi](../flows/fl-lap-duyet-phieu-chi.md), [Đồng bộ danh mục thu](../flows/fl-dong-bo-danh-muc-thu.md) |
| Màn hình | [Hóa đơn học phí](../screens/m4-sm1-hoc-phi.md), [Đối soát](../screens/m4-sm2-doi-soat.md), [Khoản phí](../screens/m4-sm3-khoan-phi.md), [Quản lý học phí](../screens/m4-sm4-quan-ly-hoc-phi.md), [Khoản chi](../screens/m4-sm5-khoan-chi.md), [Báo cáo học phí](../screens/m4-sm6-bao-cao-hoc-phi.md), [Danh mục thu](../screens/m4-sm7-danh-muc-thu.md), [Miễn giảm](../screens/m4-sm8-mien-giam.md) |

## Liên quan
- [Tổng quan dự án](project-overview.md)
- [Phân hệ Vận hành](module-operations.md)
- [Phân hệ Cấu hình](module-settings.md)
