---
title: Luồng Lập, Duyệt & Công Bố Thực Đơn Dinh Dưỡng Tuần
type: flow
sources:
  - pages/sources/src-prd-school-operating-portal.md
  - pages/sources/src-development-epics-manifest.md
  - repo:docs/guides/development/E-018-school-menu/epic.md
spec_ids:
  - NT-09
updated: 2026-11-05
---

# Luồng Lập, Duyệt & Công Bố Thực Đơn Dinh Dưỡng Tuần

## Mục tiêu
Đảm bảo quy trình lập khẩu phần dinh dưỡng bán trú cho học sinh được chuẩn bị trước chu đáo, có sự phê duyệt của ban chuyên môn y tế học đường và công bố minh bạch cho phụ huynh theo dõi.

## Các bước
| Bước | Vai trò | Ứng dụng | Hành động | Kết quả mong đợi |
|---|---|---|---|---|
| 1 | Bếp trưởng / Nhân viên dinh dưỡng | Web Admin | Vào màn hình Thực đơn, chọn Khối lớp và Tuần áp dụng (tối đa trước 8 tuần) | Mở lưới phân bổ món ăn theo ngày |
| 2 | Nhân viên dinh dưỡng | Web Admin | Nhập món ăn từng bữa (Sáng, Trưa, Xế chiều) hoặc tải lên file mẫu Excel | Lưới thực đơn hiển thị chi tiết |
| 3 | Nhân viên dinh dưỡng | Web Admin | Nhấn "Trình duyệt thực đơn" | Trạng thái chuyển thành `PENDING_APPROVAL` |
| 4 | Ban Giám Hiệu / Y tế trường | Web Admin | Kiểm tra hàm lượng dinh dưỡng và nguy cơ dị ứng thực phẩm, nhấn "Phê duyệt" | Chuyển trạng thái `APPROVED` |
| 5 | Ban Giám Hiệu | Web Admin | Nhấn "Công bố tới phụ huynh" | Đẩy thực đơn lên app di động của phụ huynh có con học khối tương ứng |

## Quy tắc chặn / validation
- Không được phép lập hoặc chỉnh sửa thực đơn của các tuần đã trôi qua trong quá khứ.
- Giới hạn lập trước tối đa không vượt quá 8 tuần so với ngày hiện tại (`max_future_weeks = 8`).

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| NT-09 | Lập và công bố thực đơn dinh dưỡng theo tuần bảo đảm an toàn vệ sinh thực phẩm | Giao diện tạo thực đơn theo tuần, tải file Excel và Redux slice | MISSING | repo:app/src/pages/[schoolCode]/school/menu/create.tsx:1 |

## Liên quan
- [Phân hệ Nhà trường](../overview/module-school-admin.md)
- [Thực thể Thực đơn dinh dưỡng tuần](../entities/weekly-menu.md)
- [Màn hình thực đơn](../screens/m5-sm8-thuc-don.md)
