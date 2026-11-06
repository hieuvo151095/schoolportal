---
title: Đặc Tả Khảo Sát Hệ Thống Cũ (Legacy Portal QLTH)
type: source
sources:
  - repo:docs/guides/legacy/operating-portal/00-inventory.md
  - repo:docs/guides/legacy/operating-portal/M7-khac/SM1-khac.md
updated: 2026-11-05
---

# Đặc Tả Khảo Sát Hệ Thống Cũ (Legacy Portal QLTH)

## Thông tin nguồn
- **Tên tài liệu:** Báo Cáo Khảo Sát Hệ Thống Quản Lý Trường Học Cũ (Portal QLTH)
- **Đường dẫn gốc:** `repo:docs/guides/legacy/operating-portal/00-inventory.md` / `repo:docs/guides/legacy/operating-portal/M7-khac/SM1-khac.md`
- **Phiên bản:** Phase 1 Inventory & Deep Dives
- **Phạm vi:** 30 modules và nhóm tính năng "Khác" (M7-SM1) truy cập qua menu avatar người dùng

## Nội dung chính
Tài liệu tổng hợp các chi tiết vận hành thực tế được ghi nhận từ hệ thống đang chạy:
1. Bản kê khai 30 module chức năng trải dài qua 6 menu sidebar chính và các trang chuyên biệt.
2. Nhóm chức năng cấp tài khoản cá nhân (M7-SM1 "Khác"):
   - Menu avatar góc trên cùng bên phải màn hình: Tài khoản, Thông báo cá nhân, Ngôn ngữ, Đăng xuất.
   - Trang xem thông tin cá nhân (`/user/profile`) và trang chỉnh sửa thông tin (`/user/edit-profile`), đổi mật khẩu.
   - Trung tâm thông báo cá nhân gồm 4 tab: Hoạt Động, Trao Đổi, Học Phí, Khác (kèm badge đếm số lượng chưa đọc).
   - Bộ chuyển đổi ngôn ngữ giao diện (Tiếng Việt / English) áp dụng ngay lập tức cho các nhãn UI mà không tải lại trang.
   - Hộp thoại xác nhận trước khi đăng xuất khỏi hệ thống nhằm bảo vệ phiên làm việc.
   - Kênh thông báo hệ thống cấp nền tảng từ nhà cung cấp (`/system/announcement`).

## Điểm đáng chú ý / mâu thuẫn
- Module "Managing Portal" (`docs/guides/legacy/Portal Vận hành QLTH/`) là công cụ quản trị nội bộ dành cho nhân viên vận hành SaaS của Finviet / SOHA, không thuộc phạm vi người dùng trường học của `eco-school-portal`. Chỉ có các điểm tích hợp như SSO và đồng bộ CSDL Sở là liên thông với School Operating Portal.

## Trang chịu ảnh hưởng
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Phân hệ Đăng nhập & Xác thực](../overview/module-auth.md)
- [Màn hình quản trị tài khoản cá nhân](../screens/m7-sm1-khac.md)
- [Màn hình đăng nhập hệ thống](../screens/m7-sm2-dang-nhap.md)
