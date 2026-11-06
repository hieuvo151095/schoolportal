---
title: Phân Hệ Cấu Hình Hệ Thống
type: overview
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - pages/sources/src-legacy-operating-portal-guide.md
updated: 2026-11-05
---

# Phân Hệ Cấu Hình Hệ Thống

## Tóm tắt
Phân hệ Cấu hình trao quyền cho Quản trị viên cấp cao thiết lập các thông số vận hành nền tảng: Thông tin pháp lý & thương hiệu nhà trường, quản trị tài khoản người dùng, hồ sơ cá nhân và đổi mật khẩu, tham số tính toán học phí & hoàn tiền ăn, mô hình AI nhận diện khuôn mặt, bật/tắt tính năng theo gói bản quyền và ma trận quy tắc gửi thông báo đa kênh.

## Bản đồ
| Nhóm | Trang |
|---|---|
| Thực thể | [Hồ sơ trường học](../entities/school-profile.md), [Giáo viên & Nhân viên](../entities/teacher-staff.md), [Phiên đăng nhập](../entities/auth-session.md), [Hồ sơ nhận diện khuôn mặt](../entities/face-biometric-registration.md) |
| Khái niệm | [Đường ống nhận diện khuôn mặt AI](../concepts/ai-face-recognition.md), [Cơ chế hoàn tiền ăn tự động](../concepts/meal-refund-engine.md), [Kiến trúc giao diện & Hệ thống Token](../concepts/design-system-tokens-principles.md) |
| Luồng | [Đăng ký sinh trắc khuôn mặt](../flows/fl-dang-ky-sinh-trac-khuon-mat.md), [Quản trị tài khoản đa vai trò](../flows/fl-quan-tri-tai-khoan-phan-quyen.md) |
| Màn hình | [Trường học](../screens/m6-sm1-truong.md), [Tài khoản](../screens/m6-sm2-tai-khoan.md), [Tham số học phí](../screens/m6-sm3-hoc-phi.md), [Nhận diện AI](../screens/m6-sm4-nhan-dien.md), [Tính năng](../screens/m6-sm5-tinh-nang.md), [Thông báo](../screens/m6-sm6-thong-bao.md), [Lịch sử giao dịch Sepay](../screens/m6-sm7-lich-su-thanh-toan.md), [Tài khoản cá nhân & Thông báo](../screens/m7-sm1-khac.md) |

## Liên quan
- [Tổng quan dự án](project-overview.md)
- [Phân hệ Tài chính](module-finance.md)
- [Phân hệ Đăng nhập](module-auth.md)
