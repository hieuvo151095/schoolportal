---
title: Đặc Tả Kho Tri Thức Kỹ Thuật & Danh Mục Anti-Pattern
type: source
sources:
  - repo:docs/guides/knowledge.md
updated: 2026-11-05
---

# Đặc Tả Kho Tri Thức Kỹ Thuật & Danh Mục Anti-Pattern

## Thông tin nguồn
- **Tên tài liệu:** Technical Knowledge Base & Architectural Standards
- **Đường dẫn gốc:** `repo:docs/guides/knowledge.md`
- **Tiêu chuẩn quản trị:** Marcus Fleet V34 Enterprise Standard
- **Phạm vi:** 1026 dòng quy định tiêu chuẩn kỹ thuật đa tầng, nguyên tắc vệ sinh state multi-tenant, danh mục điều cấm kỵ "Never Do", công thức tính điểm và học phí chuẩn Bộ GD&ĐT.

## Nội dung chính
Tài liệu định hình các chuẩn mực kỹ thuật bắt buộc:
1. **Kiến trúc phân tầng và công nghệ chuẩn:**
   - Frontend: Next.js Pages Router (`pages/[schoolCode]/...`), Redux Toolkit feature slices, kiến trúc Hybrid Tailwind CSS + `styled-components`, NextAuth.js JWE cookies, Typography font `Baloo Chettan 2` (tiêu đề) và `Quicksand` (nội dung).
   - Backend & API: Laravel 11 headless API, RESTful scoped `/{schoolCode}/api/1.0/...`, bắt buộc header `X-School-Code` bảo đảm cô lập tenant.
   - Hạ tầng: Stateless Google Cloud Run containers kết hợp OpenResty reverse proxy gateway SSL/rate-limit.
   - Giám sát: Sentry (~10% trace sampling), Google Analytics 4, Microsoft Clarity.
2. **Quy tắc vệ sinh state multi-tenant (Multi-Tenant State Hygiene):**
   - Khi chuyển trường hoặc đăng nhập dưới tenant khác, toàn bộ Redux state phải bị xóa sạch thông qua action `RESET_TENANT_STATE`.
   - Mọi cache key trong RTK Query hoặc TanStack Query phải có tiền tố `schoolCode`.
3. **Danh mục điều cấm kỵ ("Never Do" List):**
   - Tuyệt đối không hardcode mã trường, schema CSDL, hoặc logo thương hiệu.
   - Tuyệt đối không lưu token hoặc bệnh án học sinh dạng unencrypted trong `localStorage`.
   - Tuyệt đối không cho phép giờ trả học sinh nhỏ hơn hoặc bằng giờ đón học sinh (`MSG01`).
   - Tuyệt đối không chạy nhận diện khuôn mặt đồng bộ trên web server thread; bắt buộc đẩy sang Cloud Run worker nền.
   - Tuyệt đối không cho phép xóa thời khóa biểu đã xuất bản, và không cho sao chép thời khóa biểu dạng tệp đính kèm.
   - Tuyệt đối không cho phép xóa bài tập đã có học sinh nộp bài, và không cho sửa tiêu đề bài tập đã giao.
   - Tuyệt đối không tính điểm trung bình học kỳ (TBHK) khi thiếu điểm thi giữa kỳ hoặc cuối kỳ.
   - Tuyệt đối không tạo hóa đơn trùng lặp cho học sinh đã có hóa đơn trong tháng thu phí.
   - Tuyệt đối không ghi đè lịch sử thanh toán; dữ liệu giao dịch phải append-only và mang tính tích lũy.
4. **Công thức tính điểm Bộ GD&ĐT & Hoàn tiền ăn:**
   - Điểm trung bình môn học kỳ: $\text{TBHK} = \frac{\sum TX + 2GK + 3CK}{k+5}$, làm tròn 1 chữ số thập phân.
   - Tiền khấu trừ bữa ăn: $\text{deductedAmount} = \text{excusedAbsenceDays} \times \text{dailyMealRate}$.
   - Cú pháp mã chuyển khoản VietQR chuẩn hóa: `HOCPHI {invoiceNo}`.

## Điểm đáng chú ý / mâu thuẫn
- Danh mục "Never Do" là danh sách các lỗi vi phạm nghiêm trọng từng xuất hiện trong hệ thống cũ, được nâng cấp thành các chốt chặn tự động trên cả frontend và backend.

## Trang chịu ảnh hưởng
- [Tổng quan dự án](../overview/project-overview.md)
- [Phân hệ Vận hành](../overview/module-operations.md)
- [Phân hệ Học tập](../overview/module-academics.md)
- [Phân hệ Tài chính](../overview/module-finance.md)
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Khái niệm cô lập đa trường](../concepts/multi-tenancy-isolation.md)
- [Khái niệm chuẩn đánh giá học sinh](../concepts/curriculum-assessment-standard.md)
- [Khái niệm hoàn tiền ăn](../concepts/meal-refund-engine.md)
