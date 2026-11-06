---
title: Khái Niệm Kiến Trúc Giao Diện & Hệ Thống Token (Design System Principles)
type: concept
sources:
  - repo:docs/guides/knowledge.md
  - repo:docs/guides/decisions.md
  - repo:docs/design/portal-ds/README.md
updated: 2026-11-05
spec_ids:
  - TQ-01
  - CH-09
---

# Khái Niệm Kiến Trúc Giao Diện & Hệ Thống Token (Design System Principles)

## Định nghĩa
Kiến trúc giao diện của School Operating Portal được xây dựng theo chuẩn **ECO Design System 1.0 (v2.6.0)**, áp dụng mô hình phân tách trách nhiệm lai (Hybrid Styling Architecture) giữa Tailwind CSS và Styled Components. Toàn bộ các giá trị màu sắc, khoảng cách, kích thước và font chữ được quy chuẩn thành hệ thống Token Semantic dạng biến CSS (`var(--<token>)`).

## Quy tắc
1. **Phân định trách nhiệm Hybrid Styling (ADR-002):**
   - **Tailwind CSS:** Được dùng độc quyền cho hình học bên ngoài (outer geometry), bố cục khung responsive flexbox và CSS Grid, căn lề và các khoảng đệm căn bản (`p-*`, `m-*`, `flex`, `grid`, `gap-*`).
   - **Styled Components:** Được dùng độc quyền cho việc đóng gói các thành phần nguyên tử (atomic widgets), trạng thái tương tác phức tạp (hover, active, disabled, focus), hiệu ứng động và việc tiêu thụ các biến CSS token.
   - **Quy tắc cấm kỵ (Knowledge §4):** Tuyệt đối cấm viết mã màu hex hoặc chuỗi CSS inline tùy ý trong component; cấm dùng các class màu Tailwind mặc định như `blue-500`, `red-500` mà phải tham chiếu qua biến semantic token.
2. **Nguyên tắc xác nhận trước thay đổi logic & thông báo phản hồi (ADR-008):**
   - **Modal xác nhận (Pop-up Modal):** Mọi hành động của người dùng làm thay đổi logic tính toán, thay đổi trạng thái danh mục (ví dụ: bật/tắt xuất hóa đơn điện tử, đóng góp ý, chuyển trạng thái chấm công, phân công giáo viên) bắt buộc phải hiển thị hộp thoại xác nhận giải thích tác động trước khi thực thi.
   - **Thông báo thành công (Global Toast):** Sau khi hoàn thành thao tác, kết quả phải được thông báo qua hệ thống toast toàn cục (`addToast`) ở góc trên cùng bên phải màn hình, không dùng hộp thoại `alert()` của trình duyệt.
3. **Chuẩn hóa menu hành động ba chấm (ADR-007):**
   - Cột "Thao tác" trên mọi bảng dữ liệu được chuẩn hóa thành một nút bấm ba chấm (`•••` - `IconButton`) mở dropdown menu ngữ cảnh.
   - Menu tự động tính toán vị trí để lật ngược lên trên khi nằm sát mép dưới của bảng, ngăn chặn hiện tượng bị cắt khuất giao diện.
4. **Độc lập dirty state và bảo vệ thay đổi chưa lưu (CH-09):**
   - Các màn hình cấu hình nhiều khối độc lập (như Cấu hình học phí, Hồ sơ trường) quản lý cờ `dirtyFlags` riêng cho từng khối.
   - Khi người dùng rời trang mà còn thay đổi chưa lưu, hệ thống kích hoạt modal cảnh báo điều hướng.

## Áp dụng ở đâu
- [Tổng quan dự án](../overview/project-overview.md)
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Màn hình tổng quan](../screens/m1-sm1-tong-quan.md)
- [Màn hình học phí](../screens/m4-sm1-hoc-phi.md)
- [Màn hình cấu hình học phí](../screens/m6-sm3-hoc-phi.md)
- [Màn hình lịch sử thanh toán Sepay](../screens/m6-sm7-lich-su-thanh-toan.md)

## Khác biệt spec ↔ code
| Mã spec | Spec yêu cầu | Code hiện tại | Mức | Bằng chứng |
|---|---|---|---|---|
| TQ-01 | Giao diện điều hành tổng quan chuẩn Design System v2.6.0 | Toàn bộ mã frontend trong `app/src/components/ds/` | MISSING | — |
| CH-09 | Độc lập dirty state từng khối và bảo vệ điều hướng chưa lưu | Đã hiện thực `UnsavedChangesModal` và slice Redux | MISSING | — |

## Liên quan
- [Tổng quan dự án](../overview/project-overview.md)
- [Phân hệ Cấu hình](../overview/module-settings.md)
- [Đặc tả Hệ thống thiết kế](../sources/src-portal-design-system.md)
- [Màn hình tổng quan](../screens/m1-sm1-tong-quan.md)
