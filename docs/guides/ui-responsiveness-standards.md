# Tài Liệu Tiêu Chuẩn Thiết Kế & Lập Trình Giao Diện Đa Thiết Bị (Responsive UI Standards)

Tài liệu này là quy chuẩn kỹ thuật bắt buộc cho toàn bộ đội ngũ phát triển và AI Coding Agents khi xây dựng, tinh chỉnh giao diện trên **ECO School Operating Portal**.

---

## 1. Mục Đích & Phạm Vi Áp Dụng
Đảm bảo trải nghiệm liền mạch giữa thiết bị di động (điện thoại thông minh của giáo viên, phụ huynh khi thao tác ngoài sân trường/cổng trường) và thiết bị máy tính để bàn/laptop (của ban giám hiệu, kế toán, văn thư).

---

## 2. Bảng Phân Vùng Điểm Ngắt (Responsive Breakpoints)

| Phân vùng | Viewport Width | Chiến lược giao diện |
|---|---|---|
| **Mobile** | `< 768px` (Chuẩn: 360px – 390px) | Drawer menu ☰, ẩn header phụ trợ, lưới số liệu 2 cột, bảng chuyển sang thẻ danh sách, đệm mép `16px`. |
| **Tablet** | `768px – 1279px` | Thanh menu icon rail 72px, bảng dữ liệu co giãn cột hoặc cuộn ngang có ghim cột tiêu đề. |
| **Desktop** | `≥ 1280px` (Chuẩn: 1440px) | Sidebar mở 240px, bảng dữ liệu đầy đủ tính năng lọc nâng cao, đệm mép `32px`. |

---

## 3. Bộ Quy Tắc Chuẩn Hóa Cốt Lõi (Core Responsive Rules)

### Quy tắc 1: AppShell & Header Tối Giản Trên Mobile
- Header cố định 56px (`var(--size-header-h)`).
- Ẩn tagline sản phẩm, ẩn ô tìm kiếm tính năng toàn trang, ẩn text tên người dùng (chỉ giữ avatar tròn).
- Bộ chọn niên khóa thu gọn hoặc tích hợp ngăn kéo.

### Quy tắc 2: Thanh Tab Không Bị Cắt Cụt (CountedTabs / Navigation Tabs)
- Container: `flex items-center gap-2 overflow-x-auto no-scrollbar -webkit-overflow-scrolling-touch`.
- Nút tab: Bắt buộc `flex-none whitespace-nowrap`, giữ số đếm và viền active liền mạch.

### Quy tắc 3: Bộ Lọc & Tìm Kiếm Đồng Bộ Chiều Rộng
- Trên mobile: Dàn xếp theo cột `flex-col sm:flex-row`.
- Ô tìm kiếm và dropdown bộ lọc phải mở rộng 100% bề rộng (`w-full`), tránh tình trạng ô trên rộng ô dưới hẹp so le nhau.

### Quy tắc 4: Nhóm Nút Tác Vụ Không Bị Che Chữ
- Nhóm nút thao tác hàng loạt hoặc công cụ phụ: nằm trong container cuộn ngang `overflow-x-auto no-scrollbar`.
- Nút bấm `flex-none whitespace-nowrap`, chiều cao tối thiểu $\ge 40\text{px}$.

### Quy tắc 5: Lưới Thẻ Thống Kê Cân Đối (2 Cột Trên Mobile)
- Luôn sử dụng bố cục 2 cột cân xứng: `grid grid-cols-2 lg:grid-cols-4 gap-3`.
- Tuyệt đối không để dồn 1 hàng làm bung vỡ ngang hoặc 1 cột làm trang dài vô tận.

### Quy tắc 6: Bảng Dữ Liệu Chuyển Thẻ (Table-to-Card Pattern)
- Màn hình mobile chuyển `<tr>` thành thẻ card độc lập:
  - Header thẻ: Tiêu đề + icon/avatar bên trái, nút ba chấm dropdown bên phải.
  - Thân thẻ: Chia rõ cặp Nhãn (`.ecomd-cell__label`, chữ xám) và Giá trị (`.ecomd-cell__value`, chữ đậm).
  - Nút hành động chính: Đặt ở góc dưới cùng thẻ với kích thước chạm ngón tay thoải mái.

### Quy tắc 7: Dropdown Cố Định Dưới Phần Tử Kích Hoạt
- Mọi dropdown phải bọc trong wrapper `relative`.
- Popup menu: `absolute top-full left-0 z-50 w-full` hoặc `right-0`.

---

## 4. Áp Dụng Cho Phân Hệ Học Tập (Academics Module)
1. **Thời khóa biểu (`/school/schedule`):**
   - Danh sách: Sửa tab không bị cắt chữ, bộ lọc chọn lớp và tìm kiếm đồng bộ `w-full`.
   - Chi tiết: Lưới 7 ngày (Thứ 2 - Thứ 7) bổ sung bộ chuyển ngày (Day Picker Tab) hoặc cuộn ngang có ghim cột tiết học.
2. **Bài tập (`/school/assignment`):**
   - Danh sách: Sửa tab không bị mất chữ "Bản nháp", thẻ bài tập hiển thị rõ tiến độ nộp bài và thời hạn.
3. **Điểm & Đánh giá (`/school/scoreboard`):**
   - Danh sách: Sửa tab cuộn ngang, ma trận nhiều học kỳ chuyển đổi linh hoạt qua bộ chọn kỳ trong từng thẻ lớp.
