# AGENTS.md — Quy ước phát triển dự án ECO School Operating Portal

Tài liệu này định hình quy chuẩn cho các AI Coding Agents khi làm việc trong repository `eco-school-portal`.

---

## 1. Cấu Trúc Repository

- `app/`: Mã nguồn ứng dụng Next.js. Mọi thay đổi code frontend, logic nghiệp vụ, UI components và unit tests thực hiện tại đây.
- `docs/`: Tài liệu PRD đặc tả nghiệp vụ (`docs/prd/`), bộ hồ sơ kỹ thuật SEPO (`docs/ap/`) và tài liệu hướng dẫn (`docs/guides/`).
- `design/`: Hệ thống thiết kế (`design/system/`) và các mẫu giao diện chuẩn responsive (`design/preferences/`).
- `wiki/`: LLM Wiki lưu trữ SSOT về nghiệp vụ, quy tắc và ánh xạ spec ↔ code.
- `.harness/`: Chứa các symlink trỏ về bộ kit phát triển `harness-loop-kit`.

## 2. Quy Chuẩn Kỹ Thuật

- **Design System v2.6.0**: Mọi giao diện phải sử dụng các components trong `app/src/components/ds/` và tokens semantic (`var(--text-heading)`, `var(--border-default)`, `var(--bg-surface)`...).
- **Kiểm thử tiền định**: Khi sửa đổi hoặc bổ sung tính năng, phải đảm bảo toàn bộ các bài test trong `app/tests/` chạy qua 100% (`npm test` - hiện tại 711/711 tests).
- **TypeScript Strict**: Không được để xảy ra lỗi compile khi chạy `npx tsc --noEmit`.
- **Đồng bộ Wiki**: Khi cập nhật logic hoặc bổ sung màn hình mới, phải cập nhật tài liệu tương ứng trong `wiki/pages/` và kiểm tra bằng `python3 wiki/tools/lint_wiki.py wiki`.

## 3. Quy Chuẩn Mobile Responsive & Trải Nghiệm Di Động (Bắt Buộc)

Mọi màn hình trên School Operating Portal phải đáp ứng trơn tru cả 3 dải thiết bị theo Design System & Design Preference:
- **Desktop (≥ 1280px)**: SidebarNav 240px mở cố định, AppHeader đầy đủ breadcrumb/tools, vùng nội dung đệm `var(--space-24)` `var(--space-32)`.
- **Tablet (768px – 1279px)**: SidebarNav thu gọn thành thanh icon 72px (rail), mở rộng đè lên nội dung có scrim.
- **Mobile (< 768px, tối ưu chuẩn 360px – 390px)**: Sidebar ẩn hoàn toàn, bấm nút ☰ mở ngăn kéo (drawer 240px).

### 3.1. AppShell & AppHeader trên Mobile
- **Không phình chiều cao / không đè nội dung**: `AppHeader` cố định đúng 56px (`var(--size-header-h)`), `flex-nowrap`, `overflow-hidden`. Tuyệt đối cấm để header quấn dòng làm che lấp `PageHeader` hoặc các thẻ bên dưới.
- **Tối giản hóa thông tin thanh trên**: Trên màn hình mobile (< 768px), ẩn tagline sản phẩm (`hidden md:block`), ẩn ô tìm kiếm chức năng trên header, ẩn text tên và vai trò tài khoản (`hidden sm:flex`, chỉ giữ avatar tròn sm).
- **Bộ chọn niên khóa**: Trên mobile thu gọn hoặc tích hợp vào Sidebar Drawer để không chiếm diện tích ngang của header.

### 3.2. Thanh Tab Điều Hướng (CountedTabs / Tabs)
- **Cuộn ngang cảm ứng trơn tru**: Thanh tab phải có `overflow-x: auto`, `-webkit-overflow-scrolling: touch`, `scrollbar-width: none`.
- **Chống méo tab / chống lệch viền**: Mọi nút tab item bắt buộc có `flex: none` (`flex-shrink: 0`) và `white-space: nowrap`. Tuyệt đối không để tab bị co ép làm mất số đếm hoặc đứt gãy đường viền active indicator.

### 3.3. Thanh Công Cụ & Thao Tác Nhanh (Toolbar & Bulk Actions)
- **Bố cục linh hoạt**: Bộ lọc (Dropdown chọn lớp, Lịch ngày, Ô tìm kiếm) dàn xếp theo cột `flex-col sm:flex-row` co giãn 100% bề rộng trên mobile.
- **Không cắt xén nút tác vụ**: Nhóm nút tác vụ nhanh (như "Đón hàng loạt", "Trả hàng loạt", "Báo vắng", "Tạo mới") phải hỗ trợ cuộn ngang (`overflow-x: auto no-scrollbar`) và `flex-none whitespace-nowrap`, tuyệt đối cấm hiện tượng chữ bị cắt cụt (ví dụ: "Báo...").

### 3.4. Thẻ Thống Kê & Bảng Dữ Liệu
- **Lưới thẻ (StatCard Grid)**: Hiển thị 2 cột cân đối trên mobile (`repeat(auto-fit, minmax(150px, 1fr))` hoặc `grid-cols-2`), co giãn nội dung chữ kèm thanh tiến trình nhỏ gọn, không để card tràn ngang màn hình.
- **Bảng dữ liệu dạng thẻ (Card List View)**: Khi thu nhỏ về mobile, các hàng dữ liệu chuyển đổi sang bố cục thẻ di động, tách rõ nhãn (`.ecomd-cell__label`) và giá trị (`.ecomd-cell__value`), nút thao tác nằm ở góc phải trên.
- **Vùng chạm công thái học (Touch Target)**: Các nút bấm, icon thao tác và checkbox đạt tối thiểu 40px – 44px để người dùng chạm bằng ngón tay chính xác.
- **Khoảng cách**: Đệm lề mép trang mobile là `var(--space-16)` (16px), khoảng cách giữa các khối là `var(--space-16)` (16px).

### 3.5. Đồng Bộ Chiều Rộng Bộ Lọc & Định Vị Dropdown
- **Độ rộng đồng nhất**: Trên mobile, mọi dropdown chọn lớp/môn và ô tìm kiếm phải chiếm 100% bề rộng (`w-full`), tránh so le ô trên ngắn ô dưới dài.
- **Định vị Dropdown Popover**: Phần tử kích hoạt bắt buộc bọc trong container có class `relative`; menu dropdown đặt `absolute top-full left-0 z-50 w-full` (hoặc `right-0`), tuyệt đối không để menu bay lên góc trái trên màn hình.

### 3.6. Bảng Ma Trận Nhiều Cột & Thời Khóa Biểu Tuần Trên Mobile
- Với bảng ma trận nhiều cột (như thời khóa biểu 7 ngày hoặc bảng điểm 4 kỳ), trên mobile bắt buộc áp dụng một trong hai giải pháp:
  1. **Thanh chọn ngày/kỳ dạng tab cuộn ngang**: Xem chi tiết từng ngày/kỳ trên thẻ mobile, kèm nút xem toàn tuần.
  2. **Bảng cuộn ngang có ghim cột cố định (Sticky Column)**: Cột "Tiết học / Giờ" hoặc "Lớp học" được `position: sticky; left: 0`, các cột còn lại cuộn ngang mượt mà với `min-width` tối thiểu 120px/cột, tránh bóp nghẹt chữ.
