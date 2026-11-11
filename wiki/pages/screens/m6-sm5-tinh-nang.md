---
title: Màn Hình Bật Tắt Tính Năng & Học Kỳ
type: screen
sources:
  - pages/sources/src-prd-school-operating-portal.md
spec_ids:
  - CH-05
apps:
  - web
route_ids:
  - /{schoolCode}/setting/features
  - /{schoolCode}/setting/period
status: missing
updated: 2026-11-11
---

# Màn Hình Bật Tắt Tính Năng & Học Kỳ

## Mục đích
Quản lý bật/tắt các phân hệ và tính năng (Feature Flags) linh hoạt theo từng trường học và thiết lập mốc thời gian học kỳ theo năm học.

## App / route / file code
| App | Route | File |
|---|---|---|
| web | `/{schoolCode}/setting/features` | repo:app/src/pages/[schoolCode]/setting/features/index.tsx |
| web | `/{schoolCode}/setting/period` | repo:app/src/pages/[schoolCode]/setting/period/index.tsx |

## Yêu cầu spec
| Mã | Yêu cầu | Trạng thái |
|---|---|---|
| CH-05 | Quản lý bật/tắt các phân hệ và tính năng (Feature Flags) theo gói bản quyền phần mềm | MISSING |

## Chuẩn hóa UI/UX Design System v2.6.0 & Hiến pháp
1. **Điều hướng Tab**:
   - Component `<CountedTabs>` với tab "Hoạt Động" và "Học Kỳ".
2. **Bộ chọn Năm học (Dropdown)**:
   - Thay thế thẻ select bằng `<Dropdown>` chuẩn 38px, hiển thị chữ xám hướng dẫn (`placeholder="Chọn năm học"`), bảo lưu logic niên khóa hiện tại được chọn.
3. **Thao tác thêm học kỳ**:
   - Nút `+ Thêm học kỳ` (`<Button variant="primary">`) nằm cân phải trên cùng thanh công cụ, khóa tự động khi đã đủ 2 học kỳ/năm theo quy định BGD&ĐT.
4. **Bảng học kỳ & Thao tác dòng**:
   - Cột hành động dùng `<DropdownMenu>` 3 chấm với trigger `<IconButton icon="ellipsis-vertical">` ("Chỉnh sửa học kỳ").
   - Hỗ trợ chế độ chỉnh sửa trực tiếp (inline editing) với nút Lưu và Hủy trực quan.

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| CH-05 | Quản lý bật/tắt các phân hệ và tính năng (Feature Flags) theo gói bản quyền phần mềm | Frontend hoàn chỉnh theo Design System v2.6.0 và Hiến pháp UX/UI, tích hợp Redux slice và kiểm thử 100% | MISSING | repo:app/src/modules/setting/features/PeriodSettingsTab.tsx:1 |

## Câu hỏi mở
Không có câu hỏi mở tồn đọng (đã giải quyết dứt điểm tại [Bảng câu hỏi mở](../sources/src-open-questions-resolutions.md)).

## Liên quan
- [Phân hệ tương ứng](../overview/module-settings.md)
- [Khái niệm liên quan](../concepts/multi-tenancy-isolation.md)
