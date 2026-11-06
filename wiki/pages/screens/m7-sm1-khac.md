---
title: Màn Hình Quản Trị Tài Khoản Cá Nhân & Thông Báo
type: screen
sources:
  - pages/sources/src-legacy-operating-portal-guide.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/legacy/operating-portal/M7-khac/SM1-khac.md
spec_ids:
  - CH-07
  - CH-08
apps:
  - web
route_ids:
  - /{schoolCode}/user/profile
  - /{schoolCode}/user/edit-profile
  - /{schoolCode}/user/notification
  - /system/announcement
status: missing
updated: 2026-11-05
---

# Màn Hình Quản Trị Tài Khoản Cá Nhân & Thông Báo

## Mục đích
Cung cấp menu tác vụ cá nhân từ avatar góc trên-phải cho quản trị viên trường học: xem và chỉnh sửa thông tin hồ sơ cá nhân, đổi mật khẩu, xem thông báo cá nhân theo 4 luồng sự kiện, chuyển đổi ngôn ngữ giao diện (Tiếng Việt / English), đăng xuất an toàn và tiếp nhận thông báo hệ thống từ nhà cung cấp.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/user/profile` | repo:app/src/components/layout/PortalLayout.tsx |
| web | `/{schoolCode}/user/edit-profile` | repo:app/src/components/layout/PortalLayout.tsx |
| web | `/{schoolCode}/user/notification` | repo:app/src/components/layout/PortalLayout.tsx |
| web | `/system/announcement` | repo:app/src/components/layout/PortalLayout.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-07 | Quản lý hồ sơ cá nhân của người dùng, đổi mật khẩu và lưu cấu hình ngôn ngữ giao diện theo tài khoản | MISSING |
| CH-08 | Trung tâm tiếp nhận và phân loại thông báo cá nhân theo 4 luồng sự kiện chuyên biệt | MISSING |

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-07 | Quản lý hồ sơ cá nhân của người dùng, đổi mật khẩu và lưu cấu hình ngôn ngữ giao diện theo tài khoản | PortalLayout mockup header avatar dropdown, chưa kết nối API cập nhật thông tin cá nhân | MISSING | repo:app/src/components/layout/PortalLayout.tsx:1 |
| CH-08 | Trung tâm tiếp nhận và phân loại thông báo cá nhân theo 4 luồng sự kiện chuyên biệt | Header có icon chuông thông báo nhưng trang chi tiết thông báo cá nhân chưa hoàn thiện | MISSING | repo:app/src/components/layout/PortalLayout.tsx:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Phân hệ Đăng nhập & Xác thực](../overview/module-auth.md)
- [Màn hình đăng nhập](../screens/m7-sm2-dang-nhap.md)
- [Thực thể Giáo viên & Nhân viên](../entities/teacher-staff.md)
- [Thực thể Phiên đăng nhập](../entities/auth-session.md)
