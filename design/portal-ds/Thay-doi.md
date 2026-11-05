# Lịch sử thay đổi

Phiên bản ghi theo dạng `vX.Y.Z`:

- **Z — sửa**: sửa chữ, tài liệu, lỗi hiển thị. Không đổi tên hay giá trị token, component, prop.
- **Y — thêm**: thêm token, component, prop mới. Mọi thứ đang dùng vẫn chạy như cũ.
- **X — thay đổi lớn**: đổi tên, xoá hoặc đổi giá trị token, component, prop. Thiết kế và code đang dùng phải sửa theo.

Mỗi lần cập nhật DS: thêm một mục mới ở đầu danh sách dưới đây, và đặt nhãn của lần cập nhật đúng bằng số phiên bản.

## v1.2.0 — 30/10/2026

Bổ sung ô nhập liệu cho màn Đăng nhập. Mọi thứ đang dùng vẫn chạy như cũ.

- **Component mới**:
  - `TextField`: ô nhập một dòng có nhãn, icon đầu ô, `error`/`hint`; `type="password"` có nút hiện/ẩn mật khẩu.
  - `ComboboxField`: ô chọn có tìm kiếm không phân biệt dấu (Sở GD&ĐT, danh sách trường), hỗ trợ bàn phím và ARIA combobox.
- **Icon mới**: `eye-slash`, `location-dot`.

## v1.1.0 — 28/10/2026

Bổ sung các phần chỉ hiện ra khi thao tác trên màn Danh sách giáo viên. Mọi thứ đang dùng vẫn chạy như cũ.

- **Component mới**:
  - `DropdownMenu`: menu thao tác hàng (Xem chi tiết hồ sơ, Phân công lớp học, Đổi email đăng nhập, đổi quyền, đổi trạng thái, Xóa giáo viên). `DataTable.RowAction` nhận `items` để mở menu.
  - `PopupModal`: hộp thoại "Bộ lọc nâng cao" — đầu có icon, tiêu đề, mô tả, nút đóng; `PopupModal.Section` cho nhóm tuỳ chọn; chân có `primaryAction`, `secondaryAction`, `extraAction`.
  - `EmptyState`: bảng không có kết quả ("Không tìm thấy giáo viên nào phù hợp"). `DataTable` thêm `emptyIcon`, `empty`.
- **Prop mới**: `Button` `variant` `ghost` ("Đóng") và `text` ("Đặt lại bộ lọc"), `active` + `indicator` (bộ lọc đang bật); `IconButton` `active`; `Checkbox` `description`; `FilterBar` `advanced.active`; `SidebarNav` `collapsed`; `AppHeader` `menuActive`.
- **Token mới**: `text-danger`, `title-md`, `overline-xs`, `space-20`, `size-30`, `radius-16`, `shadow-xl`, `shadow-2xl`.
- **Icon mới**: `shield-halved`, `trash-can`, `arrow-rotate-right` (81 icon).
- **Đổi giá trị** `bg-overlay`: `rgba(0,0,0,0.45)` → `rgba(15,23,42,0.5)` theo lớp phủ đang render. Trước bản này chưa component hay màn nào dùng token này, nên không có chỗ nào phải sửa.

## v1.0.0 — 28/10/2026

Phiên bản chính thức đầu tiên, chuẩn hoá cấu trúc theo [DS] ECO MERCHANT.

- **Token**: đặt tên lại theo quy ước chung của ECO (bảng bên dưới); 47 màu, 20 kiểu chữ, 2 font, 11 khoảng cách, 7 kích thước, 5 bo góc, 4 đổ bóng.
- **Font**: Inter 4.1 kèm file font (400 / 500 / 600 / 700 / 900) và giấy phép OFL; bỏ SF Pro và Be Vietnam Pro.
- **Component**: chuyển sang React (`window.ECOMD`), 16 component, có `index.d.ts`; preview chỉnh được thuộc tính.
- **Badge → StatusTag**: nền nhạt, viền và chữ đậm cùng tông, chữ đạt 4.5:1 ở mọi tone. Thêm tone `danger`.
- **Thêm**: `EmptyValue` (ô chưa có dữ liệu, tách từ Tag), `IconButton` (tách từ Button), `Button` `disabled`, `Checkbox` `indeterminate`, `DataTable` chọn hàng và `emptyText`, bộ icon 78 tên.
- **Tài liệu**: Quy ước dùng token, Quy ước hiển thị số, Lịch sử thay đổi; mục Accessibility gộp vào Quy ước dùng token › Cặp chữ và nền; README component theo một khung.

### Tên cũ → tên mới

Dành cho thiết kế và code dựng theo bản nháp trước 28/10/2026.

| Nhóm | Tên cũ | Tên mới |
|---|---|---|
| Màu ECO | `brand-blue` | `eco-blue-strong` |
|  | `brand-blue-hover` · `brand-blue-deep` | `eco-blue-hover` · `eco-blue-deep` |
|  | `brand-gold` · `brand-glyph` | `eco-yellow-strong` · `eco-yellow-light` |
|  | `artic-blue` · `deep-aqua` · `orange-citrus` | `eco-artic-blue` · `eco-deep-aqua` · `eco-orange-citrus` |
| Màu trạng thái | `success` · `success-ink` · `success-tint` · `success-line` | `semantic-success` · `semantic-success-strong` · `semantic-success-soft` · `border-success-soft` |
|  | `warning` · `warning-ink` · `warning-tint` · `warning-line` | `semantic-warning` · `semantic-warning-strong` · `semantic-warning-soft` · `border-warning-soft` |
|  | `info` · `info-line` | `semantic-info` · `border-info-soft` |
|  | `danger` | `semantic-danger` |
|  | `accent-purple-line` | `accent-purple-soft` |
| Chữ | `text-strong`, `text-ink` (`#1f1f1f`), `text-default` (`#1e293b`) | `text-heading` (`#0f172a`) — chữ nhập trong ô dùng `text-body` |
|  | `text-muted` (`#64748b`) | `text-subtle` |
|  | `text-subtle` (`#94a3b8`) | `text-muted` |
|  | `text-on-brand` | `text-inverse` |
| Nền | `surface-canvas` · `surface` · `surface-subtle` · `surface-muted` | `bg-canvas` · `bg-surface` · `bg-subtle` · `bg-muted` |
|  | `surface-row-hover` · `brand-blue-tint` · `info-tint` | `bg-row-hover` · `bg-selected` · `bg-info-tint` |
| Viền | `border` | `border-default` |
| Kiểu chữ | `page-title` · `brand-name` · `stat-value` | `h4` · `body-lg-bold` · `amount-sm` |
|  | `body` · `body-medium` · `label-strong` | `body-sm` · `body-sm-medium` · `body-sm-semibold` |
|  | `caption` · `caption-medium` · `caption-strong` · `table-head` | `body-xs` · `body-xs-medium` · `body-xs-semibold` · `body-xs-bold` |
|  | `micro` · `body-l` · `body-m` · `body-s` · `body-xs` (cũ) | `body-2xs` · `body-lg` · `body-md` · `body-sm` · `body-xs` |
| Font | `heading` | `sans` |
| Kích thước | `header-height` · `sidebar-width` | `size-header-h` · `size-sidebar-w` |
|  | `avatar-md` · `avatar-sm` · `icon-md` · `icon-sm` · `dot` | `size-40` · `size-32` · `size-16` · `size-14` · `size-8` |
| Đổ bóng | `shadow-hairline` | `shadow-xs` |
| Component | `Badge` | `StatusTag` |
|  | `Select` | `SelectField` |
|  | class `eco-*` | `window.ECOMD.<Comp>` (class `ecomd-*`) |

Chú ý hai tên đổi chiều: `text-muted` và `text-subtle` hoán đổi giá trị để khớp nghĩa với MERCHANT (`text-subtle` = nhãn, thông tin phụ; `text-muted` = thông tin không bắt buộc phải đọc).

### Đã bỏ

- Token không dùng: `primary-blue-hover`, `primary-yellow-hover`, `primary-yellow-active`, `eco-gold`, `semantic-green`, `color-danger`, `danger-bright`, `warning-text`, `border-neutral`, `pill-blue`, `pill-green`, `pill-amber`, `pill-amber-strong`, `pill-slate`, `shadow-xl`, `ring-focus`, `ring-avatar`, `ring-dot` (viền 2px viết trong component), `z-header`, `z-sidebar`.
- Thay đổi giá trị nhỏ khi gộp: `text-ink` `#1f1f1f` và `text-default` `#1e293b` → `#0f172a`; `shadow-hairline` → `shadow-xs`; `body-lg` 18/24 → 18/28; `h4` 24/30 · 700 (bản khai báo) → 24/32 · 900 (đúng tiêu đề trang đang render).
