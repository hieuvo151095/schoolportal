# AppHeader

Thanh trên cùng của app: nút menu, ô logo, tên sản phẩm kèm chip ngữ cảnh, tagline, ô tìm chức năng, thông báo và người dùng.

## Khi nào dùng

- **Dùng khi:**
  - Đầu mọi màn quản trị, phía trên `SidebarNav` và vùng nội dung.
- **Không dùng khi:**
  - Tiêu đề của một trang → `PageHeader`.

## Biến thể

| Prop | Giá trị | Dùng khi |
|---|---|---|
| `context` | chuỗi | Ngữ cảnh đang làm việc, ví dụ lớp "Lớp 1A1" → `Tag` warning dạng pill. |
| `tagline` | chuỗi | Mô tả ngắn dưới tên sản phẩm; tự ẩn dưới 640px. |
| `search` | props / `false` | Ô tìm chức năng (SearchField `sm`); tự ẩn dưới 768px. |
| `notification` | `true` | Có thông báo chưa đọc: chấm trên chuông. |
| `user` | `{ name, role, avatar }` | Người đang đăng nhập; tên và vai trò ẩn dưới 1024px. |
| `onMenu` | `false` | Ẩn nút menu. |
| `menuActive` | `true` | SidebarNav đang thu gọn: nút menu ở trạng thái đang bật. |

## Cách dùng

React:
```js
h(ECOMD.AppHeader, {
  context: 'Lớp 1A1', tagline: 'Hệ thống Quản Trị Vận Hành Giáo Dục Toàn Diện', notification: true,
  user: { name: 'Cô Nguyễn Thị Mai', role: 'GVCN - Lớp 1A1', avatar: url }, onMenu: toggleSidebar
})
```

Trên canvas:
```html
<x-import component-from-global-scope="ECOMD.AppHeader" context="Lớp 1A1" notification="{{yes}}" user="{{ {name:'Cô Nguyễn Thị Mai', role:'GVCN - Lớp 1A1'} }}"></x-import>
```

## Props

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `productName` | string | `'ECO School Portal'` | Tên sản phẩm. |
| `context` | string | — | Chip ngữ cảnh. |
| `tagline` | string | — | Dòng mô tả. |
| `logoIcon` | tên icon | `'school'` | Icon trên ô logo. |
| `search` | `SearchFieldProps \| false` | `{}` | Props ô tìm; `false` = ẩn. |
| `notification` | boolean | `false` | Chấm báo mới trên chuông. |
| `onNotification` | function | — | Bấm chuông. |
| `user` | `{ name, role?, avatar? }` | — | Người đăng nhập. |
| `onMenu` | function \| `false` | — | Bấm menu (bật / tắt thu gọn SidebarNav); `false` = ẩn nút. |
| `menuActive` | boolean | `false` | Nút menu đang bật. |
| `className`, `style` | | | Tuỳ biến bên ngoài. |

## Nội dung & quy tắc

Người dùng xưng kèm danh xưng: "Cô Nguyễn Thị Mai". Vai trò viết tắt quen thuộc: "GVCN - Lớp 1A1".

**Nên:**
- Giữ AppHeader cố định trên mọi màn.

**Không nên:**
- Đặt nút `primary` hoặc bộ lọc của trang lên AppHeader.

## Thông số

- Cao `size-header-h`, nền `bg-surface`, viền dưới 1px `border-default`, đệm ngang `space-24` (`space-16` dưới 1024px).
- Ô logo `size-40`, bo `radius-12`, gradient 135° `eco-blue-strong` → `eco-blue-deep`, bóng `shadow-xs`, icon 20px `eco-yellow-light`.
- Tên sản phẩm `body-lg-bold` `text-heading`; tagline `body-xs` `text-subtle`.
- Cụm công cụ có viền trái 1px `border-default`, đệm trái `space-12`. Avatar `sm` có vòng `eco-yellow-strong`; tên `body-xs-bold` `text-heading`, vai trò `body-2xs` `text-subtle`.
