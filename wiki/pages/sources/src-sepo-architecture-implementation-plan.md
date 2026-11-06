---
title: Đặc Tả Bộ Hồ Sơ Kế Hoạch Kiến Trúc & Thi Công Kỹ Thuật (VOI, AP, ISP)
type: source
sources:
  - repo:docs/ap/index.html
  - repo:docs/ap/VOI_SchoolOperatingPortal.html
  - repo:docs/ap/AP_SchoolOperatingPortal_v1.0.0.html
  - repo:docs/ap/ISP_SchoolOperatingPortal_v1.0.0.html
updated: 2026-11-05
---

# Đặc Tả Bộ Hồ Sơ Kế Hoạch Kiến Trúc & Thi Công Kỹ Thuật (VOI, AP, ISP)

## Thông tin nguồn
- **Tên tài liệu:** Bộ Hồ Sơ Kế Hoạch SEPO (Architecture Plan - AP, Implementation Strategy Plan - ISP, Value-Outcome-Impact - VOI)
- **Đường dẫn gốc:** `repo:docs/ap/index.html` / `repo:docs/ap/VOI_SchoolOperatingPortal.html` / `repo:docs/ap/AP_SchoolOperatingPortal_v1.0.0.html` / `repo:docs/ap/ISP_SchoolOperatingPortal_v1.0.0.html`
- **Phiên bản:** v1.0.0
- **Phạm vi:** Khung đặc tả kiến trúc độc lập (AP), kế hoạch thi công kỹ thuật và tiêu chí nghiệm thu (ISP), cùng bản đồ định lượng giá trị kinh doanh (VOI) của School Operating Portal.

## Nội dung chính
Tài liệu định nghĩa bộ tiêu chuẩn chuyển giao và nghiệm thu chất lượng:
1. **Bản đồ giá trị dự án (VOI - Value-Outcome-Impact):**
   - Xác định 3 trụ cột giá trị cốt lõi: Vận hành không giấy tờ (Zero-paper operations), Tự động hóa kế toán học phí 100%, và Kênh gắn kết nhà trường - phụ huynh theo thời gian thực.
   - Các chỉ số KPI nghiệm thu: Thời gian điểm danh đầu ngày < 1 giây/lớp, tỷ lệ đối soát tự động VietQR đạt > 98%, tỷ lệ phụ huynh tiếp cận thông báo tức thì đạt 100%.
2. **Kế hoạch kiến trúc hệ thống (AP - Architecture Plan v1.0.0):**
   - Thiết kế mô hình dữ liệu tổng thể và phân bổ trách nhiệm giữa 7 phân hệ.
   - Sơ đồ tương tác API Contracts, định tuyến đa trường `/[schoolCode]/`, và cấu trúc Redux Store.
   - Ma trận phân quyền kiểm soát truy cập (RBAC) 3 cấp: Ban Giám Hiệu, Giáo Viên, Kế Toán.
3. **Kế hoạch thi công & Cổng kiểm chứng (ISP - Implementation Strategy Plan v1.0.0):**
   - Lộ trình chia gói thi công (WBS) thành các Sprint độc lập.
   - Kết nối cổng kiểm chứng Verify Gate (`verify.sh`) của AGY-Harness loop: bảo đảm 100% kỷ luật kiểm thử nhị phân trước khi chuyển giao.
   - Toàn bộ 703 unit tests trong `app/tests/` phải chạy qua xanh 100%.

## Điểm đáng chú ý / mâu thuẫn
- Hồ sơ AP và ISP được ghim phiên bản 1:1 theo chuẩn §A.30 nhằm đảm bảo không có sự sai lệch giữa bản vẽ thiết kế kiến trúc và mã nguồn thi công thực tế.

## Trang chịu ảnh hưởng
- [Tổng quan dự án](../overview/project-overview.md)
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Phân hệ Học tập](../overview/module-academics.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Khái niệm cô lập đa trường](../concepts/multi-tenancy-isolation.md)
