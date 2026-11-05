# SidebarNav

Điều hướng dọc chia nhóm chức năng, có mục đang chọn và chân niên khóa / học kỳ.

## Khi nào dùng

- **Dùng khi:**
  - Điều hướng chính của app, bên trái vùng nội dung, dưới `AppHeader`.
- **Không dùng khi:**
  - Chuyển giữa các phần trong một trang → tab của trang.

## Biến thể

| Prop | Giá trị | Dùng khi |
|---|---|---|
| `activeKey` / `item.active` | key hoặc label | Mục của trang hiện tại; chỉ một mục. |
| `footer` | danh sách nhãn – giá trị | Ngữ cảnh thời gian: Niên khóa, Học kỳ (`tone: 'success'` cho kỳ đang diễn ra). |
| `collapsed` | `true` | Thu gọn hoàn toàn để nhường chỗ cho nội dung; bật / tắt bằng nút menu trên AppHeader. |
| `hoverKey` | key hoặc label | Chỉ để vẽ hover trong mockup. |

## Cách dùng

React:
```js
h(ECOMD.SidebarNav, {
  groups: [{ label: 'NHÀ TRƯỜNG', items: [{ icon: 'graduation-cap', label: 'Học sinh', href: '/kid' }, { icon: 'chalkboard-user', label: 'Giáo viên', href: '/teacher' }] }],
  activeKey: 'Giáo viên',
  footer: [{ label: 'Niên khóa:', value: '2026 - 2027' }, { label: 'Học kỳ:', value: 'Học kỳ I', tone: 'success' }]
})
```

Trên canvas:
```html
<x-import component-from-global-scope="ECOMD.SidebarNav" groups="{{nav}}" active-key="Giáo viên"></x-import>
```

## Props

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `groups` | `Array<{ label?, items }>` | — | Nhóm và mục; mục `{ key?, icon, label, href?, active?, onClick? }`. |
| `activeKey` | string | — | Mục đang chọn (theo `key`, không có thì theo `label`). |
| `hoverKey` | string | — | Ép hover trong mockup. |
| `footer` | `Array<{ label, value, tone? }>` | — | Dòng chân sidebar. |
| `collapsed` | boolean | `false` | Thu gọn (rộng 0). |
| `label` | string | `'Điều hướng chính'` | `aria-label` của `nav`. |
| `className`, `style` | | | Tuỳ biến bên ngoài. |

## Nội dung & quy tắc

Nhãn nhóm VIẾT HOA ("VẬN HÀNH", "HỌC TẬP", "TÀI CHÍNH", "NHÀ TRƯỜNG", "CẤU HÌNH"). Nhãn mục ngắn một dòng; được viết tắt quen thuộc ("BC Điểm danh", "Sổ tay PH").

**Nên:**
- Mỗi mục một icon riêng theo chức năng.
- Đặt `aria-current="page"` cho mục đang chọn (component đã làm).

**Không nên:**
- Chọn nhiều mục cùng lúc.
- Lồng mục con nhiều cấp.

## Thông số

- Rộng `size-sidebar-w` (thu gọn: 0, chuyển động 300ms), nền `bg-surface`, viền phải 1px `border-default`; đệm `space-16`, nhóm cách nhau `space-24`, mục cách nhau `space-4`.
- Nhãn nhóm `overline` `text-muted`, đệm ngang `space-12`, cách mục `space-8`.
- Mục: đệm `space-8` `space-12`, bo `radius-8`, icon 16px `text-muted` cách chữ `space-12`, chữ `body-sm-medium` `text-nav`. Hover: nền `bg-muted`, chữ `text-heading`. Đang chọn: nền `bg-selected`, chữ + icon `eco-blue-strong`, `body-sm-semibold`.
- Chân: đệm `space-16`, nền `bg-subtle`, viền trên `border-default`; nhãn `body-xs` `text-subtle`, giá trị `body-xs-semibold` `text-heading` (tone success: `semantic-success-strong`).
