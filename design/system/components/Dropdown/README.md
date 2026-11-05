# Dropdown (Hộp chọn nâng cao)

Menu lựa chọn tùy biến hỗ trợ tìm kiếm tức thì trên client, nhóm lựa chọn, icon đại diện, huy hiệu trạng thái và khả năng render giao diện trigger linh hoạt.

## Khi nào dùng

- **Dùng khi:**
  - Danh sách lựa chọn dài từ 6 mục trở lên cần chức năng tìm kiếm gõ phím (`searchable`) như danh sách khối lớp, môn học, giáo viên, học sinh.
  - Mỗi lựa chọn cần hiển thị nhiều thông tin phong phú (Icon + Tên chính + Mô tả phụ + Tag/Badge).
  - Cần trigger tùy biến (ví dụ: Nút lọc có đếm số lượng, Avatar người dùng, Thẻ trạng thái).
- **Không dùng khi:**
  - Danh sách ngắn (dưới 5 mục đơn giản) trong form cơ bản → Dùng `SelectField` (native select).
  - Menu chứa các hành động (Sửa, Xóa, Xuất file) → Dùng `DropdownMenu`.

## Biến thể & Props

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `options` | `Array<DropdownOption \| string>` | `[]` | Danh sách các mục lựa chọn. |
| `value` | `T` | — | Giá trị đang được chọn. |
| `onChange` | `(value: T, option?: DropdownOption) => void` | — | Callback khi chọn mục mới. |
| `searchable` | `boolean` | `false` | Bật ô tìm kiếm nhanh trong menu thả xuống. |
| `clearable` | `boolean` | `false` | Cho phép xóa trắng lựa chọn để đưa về mặc định. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Kích thước hiển thị của trigger. |
| `variant` | `'default' \| 'outlined' \| 'subtle' \| 'filter'` | `'default'` | Phong cách đồ họa của trigger. |
| `prefixIcon` | `IconName` | — | Icon hiển thị ở đầu ô chọn. |
| `placeholder` | `string` | `'Chọn...'` | Văn bản gợi ý khi chưa chọn giá trị. |

## Thông số kỹ thuật (Tokens)

- **Menu thả xuống:** Nền `var(--bg-surface)`, viền `1px solid var(--border-default)`, bo góc `var(--radius-8)`, đổ bóng `var(--shadow-lg)`.
- **Mục hover / focus:** Nền `var(--semantic-info-soft)` (`#eff6ff`), chữ `var(--text-heading)`.
- **Mục đang chọn:** Màu chữ `var(--eco-blue-strong)` (`#0070ce`), độ đậm `600`, icon tick bên phải.
