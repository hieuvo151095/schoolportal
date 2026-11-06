# Radio (Nút chọn duy nhất)

Nút chọn hình tròn cho phép người dùng chọn duy nhất 1 phương án trong một tập hợp các phương án loại trừ lẫn nhau.

## Khi nào dùng

- **Dùng khi:**
  - Chọn 1 trong số 2 đến 5 lựa chọn có thể hiển thị cùng lúc (ví dụ: Hình thức thu học phí: Theo tháng / Theo học kỳ / Cả năm; Loại phiếu chi: Nội bộ / Mua sắm).
  - Cần người dùng nhìn thấy rõ ràng toàn bộ các lựa chọn để so sánh trực tiếp.
- **Không dùng khi:**
  - Có nhiều hơn 5 lựa chọn → Dùng `SelectField` hoặc `Dropdown`.
  - Có thể chọn đồng thời nhiều mục → Dùng `Checkbox`.
  - Chuyển tab hoặc bộ lọc danh sách → Dùng `Tabs` hoặc `SegmentedControl`.

## Biến thể & Props

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `name` | `string` | — | Tên nhóm radio để ràng buộc chọn duy nhất. |
| `value` | `string` | — | Giá trị của phương án. |
| `checked` | `boolean` | `false` | Trạng thái được chọn. |
| `disabled` | `boolean` | `false` | Vô hiệu hóa lựa chọn. |
| `label` | `ReactNode` | — | Nhãn phương án. |
| `description` | `ReactNode` | — | Mô tả chi tiết cho phương án (hiển thị dưới nhãn). |
| `onChange` | `(e: Event) => void` | — | Callback khi phương án được chọn. |

## Thông số kỹ thuật (Tokens)

- **Vòng tròn ngoài:** Kích thước 18px (hoặc 16px), viền 1.5px, màu viền `var(--border-default)`.
- **Khi được chọn (`checked`):** Viền màu `var(--eco-blue-strong)`, chấm tròn trung tâm 8px màu `var(--eco-blue-strong)`.
- **Khoảng cách:** Cách nhãn chữ 8px (`var(--space-8)`). Kiểu chữ nhãn `body-sm`, màu `var(--text-body)`.
