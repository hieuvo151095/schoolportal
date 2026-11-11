# AGENTS.md — Quy ước phát triển dự án ECO School Operating Portal

Tài liệu này định hình quy chuẩn cho các AI Coding Agents khi làm việc trong repository `eco-school-portal`.

---

## 1. Cấu Trúc Repository

- `app/`: Mã nguồn ứng dụng Next.js. Mọi thay đổi code frontend, logic nghiệp vụ, UI components và unit tests thực hiện tại đây.
- `docs/`: Tài liệu PRD đặc tả nghiệp vụ (`docs/prd/`), bộ hồ sơ kỹ thuật SEPO (`docs/ap/`) và tài liệu hướng dẫn (`docs/guides/`).
- `design/`: Hệ thống thiết kế (`design/system/`) và các mẫu giao diện chuẩn responsive (`design/preferences/`).
- `wiki/`: LLM Wiki lưu trữ SSOT về nghiệp vụ, quy tắc và ánh xạ spec ↔ code.
- `.harness/`: Chứa các symlink trỏ về bộ kit phát triển `harness-loop-kit`.

## 2. Quy Chuẩn Kỹ Thuật & Hiến Pháp UI/UX Design System (Bắt Buộc Tuyệt Đối)

Mọi tính năng mới và các đợt refactor/tinh chỉnh giao diện bắt buộc tuân thủ 100% các nguyên tắc cốt lõi sau:

### 2.1. Design System v2.6.0 (SSOT Tuyệt Đối & Cấm Tự Chế Components)
- Mọi giao diện bắt buộc sử dụng 100% các components từ `app/src/components/ds/` (`Button`, `IconButton`, `Dropdown`, `SelectField`, `FilterBar`, `SlideOver`, `PopupModal`, `Tabs`, `CountedTabs`, `StatCard`, `Badge`, `StatusTag`, `Tag`, `DataTable`, `DropdownMenu`, `SearchField`, `Icon`...) và semantic design tokens (`var(--text-heading)`, `var(--text-subtle)`, `var(--border-default)`, `var(--bg-surface)`, `var(--bg-subtle)`, `var(--eco-blue-strong)`...).
- **Tuyệt đối cấm tự chế components**: CẤM dùng các thẻ HTML nguyên bản (`<button>`, `<select>`, `<input>`) kèm class Tailwind tự chế để thay thế cho components của Design System. Khi cần nút bấm, bắt buộc dùng `<Button variant="primary|secondary|ghost|text">` hoặc `<IconButton>`. Khi cần dropdown, bắt buộc dùng `<Dropdown>` hoặc `<SelectField>`.

### 2.2. Chuẩn Thanh Công Cụ & Bộ Lọc (FilterBar SSOT — Single Frame Line 38px)
- **Chuẩn Single Frame Line (Đường Thẳng Duy Nhất 38px)**: Trên màn hình desktop, `FilterBar` bắt buộc chứa ô tìm kiếm bên trái (`width: 200px – 280px`), các dropdown bộ lọc ở giữa, và toàn bộ action buttons ("Xuất Excel", "Tạo mới...") nằm cân phải trên cùng một đường thẳng (frame line). Tuyệt đối không để action buttons nằm cô lập trên `PageHeader` hoặc rớt xuống hàng thứ hai.
- **Tuyệt đối CẤM Nhãn Trôi Nổi (No Floating Labels)**: CẤM tuyệt đối việc thêm nhãn `<label>` nằm trôi nổi phía trên các ô lọc (như "Năm học", "Khối lớp", "Phân loại", "Loại môn", "Trạng thái"...) làm vỡ cấu trúc single frame line và chiếm diện tích dọc thừa thãi.
- **Chữ Xám Hướng Dẫn Bên Trong Khung (Grey Guide Text / Placeholder Guide)**: Tương tự như ô tìm kiếm có text xám gợi ý, TẤT CẢ các trường lọc (Dropdown / SelectField) BẮT BUỘC hiển thị chữ xám hướng dẫn bên trong khung (`placeholder="Chọn năm học"`, `placeholder="Chọn khối lớp"`, `placeholder="Chọn môn học"`, `placeholder="Chọn trạng thái"`, `placeholder="Chọn loại phiếu"`, `placeholder="Chọn tháng"`...) với style chuẩn `text-slate-400 font-normal`.
- **Bảo Lưu Logic Lựa Chọn Mặc Định (Preserve Default Selection Logic)**: Khi ở trạng thái mặc định (như năm học hiện tại 2025-2026, tất cả khối lớp, tất cả trạng thái), trigger hiển thị text xám hướng dẫn để giao diện thoáng, tinh gọn và không bị cắt cụt nhãn (như "Năm học 20..."). Logic dữ liệu bên trong vẫn lưu trữ chính xác giá trị mặc định đang chọn. Chỉ khi người dùng chủ động chọn một giá trị cụ thể khác mặc định (ví dụ: "Khối 1", "Lớp 1A1"), ô mới hiển thị tên giá trị đã chọn bằng chữ `text-slate-800 font-medium`.
- **Đồng Bộ Kích Thước & Bo Góc (Uniform 38px & Radius 8px)**: Toàn bộ thành phần trong hàng lọc (Search input, Dropdown, Date range picker, Button lọc) đều có chiều cao cố định chuẩn 38px, font-size 13px (hoặc 12-13px cho Date range), padding cân xứng, bo góc đồng bộ `rounded-[var(--radius-8)]`.

### 2.3. Chuẩn Right-Sheet (SlideOver) Cho Thao Tác Tạo Mới / Chỉnh Sửa
- Mọi tác vụ "Tạo mới..." và "Chỉnh sửa..." (thêm học sinh, giáo viên, lớp học, soạn thông báo, tạo bình chọn, tạo thực đơn, soạn bài viết sổ tay, tạo sự kiện, tạo bài tập, tạo thời khóa biểu, thêm khoản phí, thêm phiếu chi, tạo hóa đơn...) BẮT BUỘC mở ngăn kéo trượt từ bên phải (Right-Sheet / `<SlideOver>` từ `@/components/ds`).
- **TUYỆT ĐỐI KHÔNG mở modal popup nổi giữa màn hình** làm đè layer hoặc gây che khuất bối cảnh dữ liệu bên dưới.
- **TUYỆT ĐỐI KHÔNG chuyển hướng sang trang full-page riêng biệt** (`/create`, `/edit`).
- `<SlideOver>` bắt buộc có Header rõ ràng với nút đóng (X), thân form cuộn độc lập (`overflow-y: auto`), và Footer cố định dưới đáy với 2 nút: "Hủy" (`variant="secondary"`) và "Lưu / Tạo mới" (`variant="primary"`).

### 2.4. Chuẩn Menu Thao Tác Dòng Bảng (Three-Dots DropdownMenu)
- Cột "Thao tác" trên mọi bảng dữ liệu bắt buộc sử dụng component `<DropdownMenu>` 3 chấm (`IconButton icon="ellipsis-vertical"` hoặc nút 3 chấm), menu xổ xuống chứa các thao tác bằng text thuần túy rõ ràng ("Xem chi tiết", "Chỉnh sửa", "Xóa"...).
- Tuyệt đối cấm bày một hàng icon hoặc button to kềnh càng trên từng dòng bảng làm rối mắt và chiếm dụng bề ngang bảng.
- Khi người dùng bấm "Chỉnh sửa" từ menu thao tác của dòng dữ liệu, BẮT BUỘC kích hoạt mở `<SlideOver>` chỉnh sửa ngay tại chỗ.

### 2.5. Chuẩn Hệ Màu Trạng Thái Semantic (StatusTag & Badge Tokens)
- Sử dụng thẻ `<StatusTag>` hoặc `<Badge>` từ Design System theo bảng màu semantic chuẩn:
  - **Success (Xanh lá)**: Đã hoàn thành, Đã thanh toán, Đã duyệt, Đã phát hành, Có mặt.
  - **Warning / Orange (Cam / Vàng)**: Chờ duyệt, Chờ xử lý, Thanh toán một phần, Nghỉ có phép, Đang tiến hành.
  - **Danger (Đỏ)**: Chưa thanh toán, Quá hạn, Nghỉ không phép, Đã hủy, Bị từ chối.
  - **Neutral (Xám)**: Bản nháp, Ngừng hoạt động, Chưa điểm danh.
- Tuyệt đối cấm dùng màu tự chế không theo biến semantic Design System tokens.

### 2.6. Chuẩn Bảng Dữ Liệu Lớn & Bảng Ma Trận (DataTable & Sticky Header)
- Bảng dài phải có header ghim cố định (`position: sticky; top: 0; z-index: 20; background: var(--bg-subtle)`).
- Số tiền luôn định dạng tiền tệ Việt Nam (VND với dấu chấm phân cách hàng nghìn `10.000.000 đ`) và căn phải (`text-right font-semibold tabular-nums`).
- Luôn hiển thị `emptyText` và `emptyIcon` khi không có kết quả tìm kiếm/lọc.

### 2.7. Chuẩn Kiểm Thử & Kỹ Thuật (Bắt Buộc Qua 100%)
- **Kiểm thử tiền định**: Khi sửa đổi hoặc bổ sung tính năng, phải đảm bảo toàn bộ các bài test trong `app/tests/` chạy qua 100% (`npm test` / `./verify.sh`).
- **TypeScript Strict**: Không được để xảy ra bất kỳ lỗi compile nào khi chạy `npx tsc --noEmit`.
- **Đồng bộ Wiki**: Khi cập nhật logic hoặc bổ sung màn hình mới, phải cập nhật tài liệu tương ứng trong `wiki/pages/` và kiểm tra bằng `python3 wiki/tools/lint_wiki.py wiki` đạt 0 lỗi, 0 cảnh báo.

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
