---
title: Đặc Tả Bộ Hồ Sơ Thiết Kế Kế Hoạch (Screens, Flows & Diagrams)
type: source
sources:
  - repo:docs/guides/planning/screens.md
  - repo:docs/guides/planning/flows.md
  - repo:docs/guides/planning/diagrams.md
updated: 2026-11-05
---

# Đặc Tả Bộ Hồ Sơ Thiết Kế Kế Hoạch (Screens, Flows & Diagrams)

## Thông tin nguồn
- **Tên tài liệu:** Planning Blueprints — Screen Catalog, Operational Flows & Sequence Diagrams
- **Đường dẫn gốc:** `repo:docs/guides/planning/screens.md` / `repo:docs/guides/planning/flows.md` / `repo:docs/guides/planning/diagrams.md`
- **Tiêu chuẩn quản trị:** Marcus Fleet Flow & Screen Engineering
- **Phạm vi:** Danh mục đầy đủ 41 màn hình và hơn 50 luồng nghiệp vụ chi tiết kèm sơ đồ Sequence Diagram chuẩn Mermaid.

## Nội dung chính
Tài liệu định nghĩa các thông số kiến trúc tương tác chuẩn:
1. **Danh mục màn hình hoàn chỉnh (Screen Inventory):**
   - Phân hệ Vận hành: `SCR-OPS-01` (Điểm danh), `SCR-OPS-02` (Hoạt động), `SCR-OPS-03` (Media/Album ảnh), `SCR-OPS-04` (Trao đổi), `SCR-OPS-05` (Báo cáo điểm danh), `SCR-OPS-06` (Báo cáo mở rộng).
   - Phân hệ Học tập: `SCR-ACAD-01` (Thời khóa biểu), `SCR-ACAD-02` (Bài tập), `SCR-ACAD-03` (Bảng điểm).
   - Phân hệ Tài chính: `SCR-FIN-01` (Học phí), `SCR-FIN-02` (Khoản phí), `SCR-FIN-03` (Quản lý học phí), `SCR-FIN-04` (Khoản chi), `SCR-FIN-05` (Đối soát), `SCR-FIN-06` (Báo cáo học phí), `SCR-FIN-07` (Miễn giảm), và Danh mục thu CSDL Sở.
   - Phân hệ Cấu hình: `SCR-SET-01` (Cấu hình học phí) và `SCR-SET-02` (Lịch sử giao dịch Sepay tại `/setting/fee/payment-history/`).
   - Phân hệ Nhà trường: 14 màn hình từ học sinh, giáo viên, lớp học, môn học, khối lớp, bảng tin, bình chọn, thực đơn, chấm công, sổ tay, góp ý, lịch sự kiện, niên khóa đến kho lưu trữ.
2. **Các luồng vận hành phức hợp (Operational Flows):**
   - Xử lý mất mạng khi điểm danh (Offline fallback & Optimistic rollbacks).
   - Luồng duyệt đơn xin nghỉ học của phụ huynh trước giờ quy định.
   - Luồng lưu trữ kho lạnh và phục hồi an toàn học sinh (bảo vệ sĩ số và tính hợp lệ của lớp).
   - Luồng đăng ký sinh trắc học khuôn mặt từ luồng camera hoặc tải tệp ảnh trực tiếp.
   - Luồng khóa tài khoản Super-Admin và đồng bộ trạng thái nhân sự từ CSDL Sở.

## Điểm đáng chú ý / mâu thuẫn
- Màn hình `SCR-SET-02` (Lịch Sử Giao Dịch Sepay tại `/setting/fee/payment-history/`) là một route độc lập trong prototype (`app/src/pages/[schoolCode]/setting/fee/payment-history/index.tsx`) hỗ trợ lọc theo tháng, tìm kiếm mã giao dịch và kiểm tra trạng thái khớp lệnh tự động.

## Trang chịu ảnh hưởng
- [Tổng quan dự án](../overview/project-overview.md)
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Phân hệ Học tập](../overview/module-academics.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Màn hình lịch sử thanh toán Sepay](../screens/m6-sm7-lich-su-thanh-toan.md)
- [Luồng nộp đơn xin nghỉ học](../flows/fl-don-xin-nghi-hoc.md)
- [Luồng kho lưu trữ học sinh](../flows/fl-kho-luu-tru-hoc-sinh.md)
- [Luồng đăng ký khuôn mặt](../flows/fl-dang-ky-sinh-trac-khuon-mat.md)
- [Luồng quản trị tài khoản](../flows/fl-quan-tri-tai-khoan-phan-quyen.md)
