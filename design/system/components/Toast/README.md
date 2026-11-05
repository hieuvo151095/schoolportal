# Toast (Thông báo nổi)

Hộp thông báo phản hồi nhanh, tự động biến mất sau một khoảng thời gian cố định, hiển thị ở góc màn hình để báo cáo kết quả của hành động người dùng (thành công, thất bại, cảnh báo).

## Khi nào dùng

- **Dùng khi:**
  - Báo thành công sau khi lưu biểu phí, tạo hóa đơn, chuyển lớp học sinh, duyệt chi thành công.
  - Cảnh báo lỗi hệ thống hoặc thao tác không hợp lệ ngắn gọn.
  - Phản hồi hành động nền mà không làm gián đoạn luồng công việc của người dùng.
- **Không dùng khi:**
  - Lỗi cần người dùng xác nhận hoặc giải quyết trước khi tiếp tục → Dùng `PopupModal`.
  - Thông báo cố định trên trang hoặc bảng biểu → Dùng `InlineNotice`.

## Biến thể & Props

| Prop | Kiểu | Mặc định | Ý nghĩa |
|---|---|---|---|
| `type` | `'success' \| 'danger' \| 'warning' \| 'info' \| 'neutral'` | `'neutral'` | Phân loại ngữ nghĩa kèm icon và màu sắc tương ứng. |
| `message` | `ReactNode` | — | Nội dung thông báo ngắn gọn (khuyến nghị dưới 100 ký tự). |
| `duration` | `number` | `4000` | Thời gian tự đóng (mili-giây). Nếu `= 0` thì không tự đóng. |
| `actionLabel` | `string` | — | Nhãn nút hành động phụ (ví dụ: "Hoàn tác", "Xem chi tiết"). |
| `onAction` | `() => void` | — | Callback khi bấm nút hành động. |
| `onClose` | `() => void` | — | Callback khi đóng toast. |

## Thông số kỹ thuật (Tokens)

- **Vị trí hiển thị:** Cố định góc trên bên phải (`top: 24px, right: 24px`) hoặc góc dưới bên phải, `z-index: 9999`.
- **Đổ bóng:** `var(--shadow-lg)`.
- **Bo góc:** `var(--radius-8)`.
- **Màu sắc theo loại:**
  - `success`: Nền `var(--semantic-success-soft)`, viền `var(--border-success-soft)`, chữ/icon `var(--semantic-success-strong)`.
  - `danger`: Nền `var(--semantic-danger-soft)`, viền `var(--border-danger-soft)`, chữ/icon `var(--semantic-danger-strong)`.
  - `warning`: Nền `var(--semantic-warning-soft)`, viền `var(--border-warning-soft)`, chữ/icon `var(--semantic-warning-strong)`.
  - `info`: Nền `var(--semantic-info-soft)`, viền `var(--border-info-soft)`, chữ/icon `var(--semantic-info-strong)`.
