# Divider (Đường phân cách)

Đường kẻ thanh mảnh giúp phân định rõ ràng các khối thông tin, các phần của biểu mẫu hoặc các mục trong danh sách menu.

## Khi nào dùng

- **Dùng khi:**
  - Ngăn cách trực quan giữa các nhóm trường nhập liệu trong một biểu mẫu dài (ví dụ: Thông tin liên hệ vs Cấu hình điểm danh).
  - Phân tách giữa phần nội dung chính và chân trang/thanh tác vụ của modal (`PopupModal`).
  - Phân tách các mục hành động trong `DropdownMenu`.
- **Không dùng khi:**
  - Khoảng trống tự nhiên (`margin` / `gap`) đã đủ để người dùng phân biệt ranh giới giữa các khối.

## Biến thể & Props

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Hướng phân cách: ngang hoặc dọc. |
| `dashed` | `boolean` | `false` | Kiểu nét đứt thay vì nét liền. |
| `label` | `ReactNode` | — | Văn bản hoặc tiêu đề nhỏ nằm chính giữa đường phân cách. |
| `className` | `string` | — | Lớp CSS tùy biến. |

## Thông số kỹ thuật (Tokens)

- **Độ dày:** `1px`.
- **Màu sắc:** `var(--border-subtle)` (`#f1f5f9`) hoặc `var(--border-default)` (`#e2e8f0`).
- **Khoảng cách mặc định:** `margin: var(--space-16) 0` đối với đường ngang; `margin: 0 var(--space-8)` đối với đường dọc.
- **Nhãn giữa:** Kích thước chữ `12px` (hoặc `13px`), màu `var(--text-subtle)`, nền `var(--bg-surface)` để che đường kẻ phía sau.
