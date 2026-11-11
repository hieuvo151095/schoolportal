---
title: Màn Hình Cấu Hình Thông Báo
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - CH-06
apps:
  - web
route_ids:
  - /{schoolCode}/setting/notification
status: missing
updated: 2026-11-11
---

# Màn Hình Cấu Hình Thông Báo

## Mục đích
Thiết lập ma trận quy tắc gửi thông báo tự động, nhắc nhở định kỳ và phân phối đa kênh (push notification di động và email) toàn trường.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/setting/notification` | repo:app/src/pages/[schoolCode]/setting/notification/index.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-06 | Cấu hình ma trận quy tắc gửi thông báo push và email đa kênh theo sự kiện | MISSING |

## Chuẩn hóa UI/UX Design System v2.6.0 & Hiến pháp
1. **Header chuẩn**:
   - Sử dụng `<PageHeader>` chuẩn Design System.
2. **Loại bỏ thẻ select thô & nhãn trôi nổi**:
   - Thay thế toàn bộ thẻ select bằng component `<Dropdown>` với text xám hướng dẫn (`placeholder="Chọn phạm vi áp dụng"`, `placeholder="Chọn ngày gửi"`, `placeholder="Chọn thời điểm nhắc"`).
3. **Thanh tác vụ cố định đáy trang (Sticky Action Bar)**:
   - Nút hành động chuẩn hóa: `<Button variant="primary">` ("Cập nhật cấu hình") và `<Button variant="secondary">` ("Khôi phục").
   - Hiển thị thời gian cập nhật gần nhất với icon clock.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-06 | Cấu hình ma trận quy tắc gửi thông báo push và email đa kênh theo sự kiện | Frontend hoàn chỉnh theo Design System v2.6.0 và Hiến pháp UX/UI, tích hợp Redux slice và dữ liệu mẫu | MISSING | repo:app/src/modules/setting/notification/NotificationSettingsShell.tsx:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-settings.md)
- [Thực thể liên quan](../entities/teacher-staff.md)
