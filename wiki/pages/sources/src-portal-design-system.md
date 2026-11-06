---
title: Đặc Tả Hệ Thống Thiết Kế Giao Diện (ECO Design System)
type: source
sources:
  - repo:docs/design/portal-ds/README.md
  - repo:docs/design/portal-ds/Quy-uoc-token.md
  - repo:docs/design/portal-ds/Quy-uoc-so.md
updated: 2026-11-05
---

# Đặc Tả Hệ Thống Thiết Kế Giao Diện (ECO Design System)

## Thông tin nguồn
- **Tên tài liệu:** ECO Design System (ECO ME Dashboard / Portal DS)
- **Đường dẫn gốc:** `repo:docs/design/portal-ds/README.md` / `repo:docs/design/portal-ds/Quy-uoc-token.md` / `repo:docs/design/portal-ds/Quy-uoc-so.md`
- **Phiên bản:** v1.1.0 (chuẩn Design System v2.6.0 trong `app/src/components/ds/`)
- **Phạm vi:** Nền tảng token semantic, quy ước màu sắc, font chữ Inter / Baloo Chettan 2, icon Font Awesome 6, và quy ước định dạng số/tiền tệ chuẩn Việt Nam.

## Nội dung chính
Tài liệu định nghĩa các quy tắc chuẩn hóa giao diện người dùng:
1. **Hệ thống Token Semantic:**
   - Màu sắc: `var(--bg-app)`, `var(--bg-surface)`, `var(--text-heading)`, `var(--text-body)`, `var(--text-muted)`, `var(--border-default)`, `var(--primary-default)`, `var(--color-success)`, `var(--color-danger)`, `var(--color-warning)`.
   - Typography: Font chữ Inter (SIL Open Font License 1.1) kết hợp Baloo Chettan 2 (tiêu đề, số nổi bật) và Quicksand (nội dung thân thiện). Cấm sử dụng SF Pro do vi phạm điều khoản cấp phép ngoài Apple.
   - Thang khoảng cách: Bước nhảy 4px chuẩn (`4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`...), kèm các bước tinh chỉnh `2px`, `6px`, `10px`, `14px` cho control bảng biểu.
2. **Quy ước hiển thị số & tiền tệ:**
   - Tiền tệ: Luôn định dạng theo chuẩn Việt Nam với dấu chấm phân cách hàng nghìn (ví dụ: `1.500.000 ₫` hoặc `1.500.000 đ`).
   - Cấm số âm trong hóa đơn và công thức miễn giảm: giá trị phải được clamp trong khoảng $[0, \text{grossAmount}]$.
   - Điểm số: Làm tròn đến đúng 1 chữ số thập phân (ví dụ: `8.5`, `9.0`).
3. **Quy chuẩn Component UI:**
   - Toàn bộ form và màn hình quản trị phải sử dụng bộ component tái sử dụng từ `app/src/components/ds/` (`Button`, `TextField`, `SelectField`, `DataTable`, `FilterBar`, `PopupModal`, `StatusTag`, `StatCard`, `CountedTabs`, `BulkActionBar`).
   - Mọi thao tác làm thay đổi logic nghiệp vụ hoặc xóa dữ liệu bắt buộc phải dùng `PopupModal` xác nhận; các hành động thành công phản hồi qua toast `addToast`.

## Điểm đáng chú ý / mâu thuẫn
- Cấm tuyệt đối viết mã màu hex hoặc CSS pixel trực tiếp trong component; mọi thuộc tính giao diện phải thông qua biến CSS semantic tokens.

## Trang chịu ảnh hưởng
- [Tổng quan dự án](../overview/project-overview.md)
- [Khái niệm thiết kế giao diện](../concepts/design-system-tokens-principles.md)
- [Màn hình tổng quan](../screens/m1-sm1-tong-quan.md)
- [Màn hình học phí](../screens/m4-sm1-hoc-phi.md)
- [Màn hình lịch sử thanh toán](../screens/m6-sm7-lich-su-thanh-toan.md)
