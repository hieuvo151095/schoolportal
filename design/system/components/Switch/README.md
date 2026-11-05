# Switch (Công tắc Bật / Tắt)

Công tắc chuyển đổi trạng thái nhị phân (On / Off) dạng pill, phản hồi tức thì mà không cần bấm nút "Lưu".

## Khi nào dùng

- **Dùng khi:**
  - Bật / tắt một tính năng hoặc dịch vụ hệ thống (ví dụ: Xuất hóa đơn điện tử SInvoice, Bật điểm danh đón/trả bằng khuôn mặt, Tự động gửi thông báo cho phụ huynh).
  - Trạng thái thay đổi có hiệu lực ngay lập tức hoặc phản ánh thiết lập trực quan.
- **Không dùng khi:**
  - Chọn một hoặc nhiều mục trong danh sách hoặc bảng dữ liệu → Dùng `Checkbox`.
  - Chọn 1 trong nhiều lựa chọn loại trừ nhau → Dùng `Radio` hoặc `SegmentedControl`.

## Biến thể & Props

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `checked` | `boolean` | `false` | Trạng thái bật (`true`) hoặc tắt (`false`). |
| `defaultChecked` | `boolean` | `false` | Trạng thái ban đầu không kiểm soát. |
| `disabled` | `boolean` | `false` | Vô hiệu hóa thao tác. |
| `label` | `ReactNode` | — | Nhãn văn bản mô tả tính năng. |
| `description` | `ReactNode` | — | Giải thích chi tiết cơ chế hoạt động bên dưới nhãn. |
| `onChange` | `(checked: boolean, e: Event) => void` | — | Callback kích hoạt khi trạng thái thay đổi. |

## Thông số kỹ thuật (Tokens)

- **Track (Thân công tắc):** Rộng 36px (hoặc 40px), cao 20px (hoặc 24px), `border-radius: var(--radius-full)`.
- **Màu nền Track khi Tắt:** `var(--border-strong)` hoặc `var(--border-default)`.
- **Màu nền Track khi Bật:** `var(--eco-blue-strong)` (`#0070ce`).
- **Thumb (Nút trượt):** Tròn 16px (hoặc 20px), màu `#ffffff`, đổ bóng `var(--shadow-xs)`. Hiệu ứng chuyển động `transition: all 0.15s ease`.
