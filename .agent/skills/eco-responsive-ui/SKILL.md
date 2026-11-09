---
name: eco-responsive-ui
description: Quy chuẩn thiết kế và thi công giao diện Responsive chuẩn cho hệ thống ECO School Operating Portal trên 3 dải thiết bị (Mobile <768px, Tablet 768-1279px, Desktop >=1280px). Bắt buộc áp dụng khi phát triển tính năng mới hoặc tinh chỉnh UI/UX cho các module.
---

# ECO Responsive UI/UX Standards & Guidelines

Tài liệu này tổng hợp toàn bộ các nguyên tắc thiết kế và thi công giao diện Responsive chuẩn hóa cho hệ sinh thái **ECO School Operating Portal**, được đúc rút từ quá trình hoàn thiện các phân hệ cốt lõi (Vận hành, Cấu hình, Học tập).

---

## 1. Hệ Thống Điểm Ngắt (Breakpoints)

| Phân khúc | Kích thước | Bố cục chuẩn |
|---|---|---|
| **Mobile** | `< 768px` (Chuẩn test: 360px – 390px) | Drawer ẩn hoàn toàn (menu ☰), Header tối giản 56px, bảng dữ liệu chuyển thành danh sách thẻ (Card List), đệm lề trang `16px`. |
| **Tablet** | `768px – 1279px` | Sidebar thu gọn thành thanh icon rail 72px (bấm mở drawer có scrim), nội dung đệm `24px`. |
| **Desktop** | `≥ 1280px` (Chuẩn test: 1440px) | Sidebar mở cố định 240px, AppHeader đầy đủ công cụ, nội dung đệm `32px`. |

---

## 2. Các Tiêu Chuẩn Thành Phần Bắt Buộc (Mandatory Component Standards)

### 2.1. Thanh Tab Điều Hướng (CountedTabs / Tabs / SegmentedControl)
- **Lỗi phổ biến trước đây:** Tab bị bóp méo, co hẹp hoặc bị cắt cụt chữ (ví dụ: "Chờ phát hành..." thành "Chờ...", số đếm bị che khuất).
- **Quy chuẩn bắt buộc:**
  ```tsx
  // Container cuộn cảm ứng trơn tru, ẩn thanh cuộn xấu
  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -webkit-overflow-scrolling-touch py-1">
    {tabs.map((tab) => (
      <button
        key={tab.key}
        className="flex-none whitespace-nowrap px-3.5 py-2 text-xs font-semibold ..."
      >
        {tab.label} {tab.count !== undefined && <span className="ml-1.5 ...">{tab.count}</span>}
      </button>
    ))}
  </div>
  ```
  - Mọi nút tab item bắt buộc phải có `flex: none` (`flex-shrink: 0`) và `white-space: nowrap`.
  - Không được để tab bị co ép làm mất số đếm hoặc đứt gãy viền active indicator.

### 2.2. Bộ Lọc & Thanh Tìm Kiếm (Toolbar & Filter Bar)
- **Lỗi phổ biến trước đây:** Ô tìm kiếm bị co ngắn hơn dropdown bên trên, hoặc các nút xếp chồng không thẳng hàng.
- **Quy chuẩn bắt buộc:**
  - Trên mobile: Dàn xếp linh hoạt theo cột `flex-col sm:flex-row`.
  - Ô tìm kiếm và ô chọn lớp/môn phải có độ rộng đồng nhất (`w-full sm:w-auto` hoặc `w-full` khi ở chế độ mobile).
  - Khoảng cách giữa các hàng bộ lọc là `var(--space-12)` hoặc `gap-3`.

### 2.3. Thanh Tác Vụ Nhanh (Action Bar & Bulk Actions)
- **Lỗi phổ biến trước đây:** Nút thao tác hàng loạt bị cắt cụt chữ (ví dụ: "Đón hàng loạt" thành "Đón...").
- **Quy chuẩn bắt buộc:**
  - Nhóm nút thao tác hàng loạt trên mobile phải nằm trong hàng cuộn ngang:
    ```tsx
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full py-1">
      <Button className="flex-none whitespace-nowrap">Đón hàng loạt</Button>
      <Button className="flex-none whitespace-nowrap">Trả hàng loạt</Button>
    </div>
    ```
  - Chiều cao và vùng chạm tối thiểu: **40px – 44px** để bấm ngón tay chính xác (touch ergonomic target).
  - Vị trí icon: Các icon phụ trợ (như icon bánh răng Setting) phải nằm bên trái nút tác vụ hoặc được căn chỉnh công thái học hợp lý, không để lệch mép.

### 2.4. Lưới Thẻ Thống Kê (StatCard Grid)
- **Lỗi phổ biến trước đây:** StatCard bị tràn 1 hàng làm bung vỡ layout mobile hoặc hiển thị 1 cột quá dài.
- **Quy chuẩn bắt buộc:**
  - Hiển thị đúng **2 cột cân đối** trên mobile: `grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4`.
  - Co giãn font số liệu (`text-lg sm:text-2xl`), thanh tiến trình gọn gàng, không để card bung tràn ngang màn hình.

### 2.5. Chuyển Đổi Bảng Dữ Liệu Thành Thẻ Di Động (Table-to-Card Pattern)
- **Lỗi phổ biến trước đây:** Cố ép bảng nhiều cột vào mobile khiến chữ nhảy dòng từng chữ một hoặc cột "Nhân viên" quá rộng.
- **Quy chuẩn bắt buộc:**
  - Trên desktop: Hiển thị `<table>` chuẩn với `min-width` hợp lý cho từng cột.
  - Trên mobile: Ẩn `<table>` hoặc áp dụng CSS module chuyển đổi mỗi thẻ `<tr>` thành một `.ecomd-card`:
    - Tiêu đề học sinh/đối tượng + avatar ở góc trái trên.
    - Nút thao tác (hoặc ba chấm dropdown) cố định ở góc phải trên.
    - Tách bạch nhãn và giá trị: nhãn bên trái (`text-gray-500`), giá trị bên phải (`font-semibold text-gray-900`).
    - Nút hành động chính (Đón/Trả/Nhập điểm) nằm ở góc dưới hoặc thanh tác vụ riêng.

### 2.6. Thẻ Bài Đăng & Nhật Ký Hoạt Động (Post Cards & Feed)
- **Lỗi phổ biến trước đây:** Thông tin người đăng, lớp học, môn học và thời gian dồn chung 1 dòng bị đè lên nhau.
- **Quy chuẩn bắt buộc:**
  - Tên người đăng nằm riêng 1 hàng trên cùng (`font-bold text-sm text-gray-900`).
  - Hàng thứ 2: Chức vụ / Vai trò, kèm Lớp và Bộ môn.
  - Thời gian đăng (`HH:mm DD-MM`) đặt cùng hàng với nhãn Lớp học, tách biệt bằng dấu chấm phân cách `•`.

### 2.7. Hộp Hội Thoại & Nhắn Tin (Conversations / Chat)
- **Quy chuẩn bắt buộc:**
  - Tin nhắn của phụ huynh / người ngoài: Căn lề trái (`self-start`, nền trắng hoặc xám nhạt).
  - Tin nhắn của giáo viên / nhà trường: Căn lề phải (`self-end ml-auto items-end`, nền xanh thương hiệu `bg-eco-blue text-white`).
  - Thanh nhập tin nhắn và nút đính kèm mở rộng full width trên mobile, không bị bàn phím che lấp.

### 2.8. Dropdown & Popover Menu
- **Lỗi phổ biến trước đây:** Dropdown mở ra bị nhảy lên góc trên cùng bên trái màn hình do thiếu `relative` positioning.
- **Quy chuẩn bắt buộc:**
  - Phần tử kích hoạt bắt buộc bọc trong container có class `relative`.
  - Khung menu popup định vị `absolute top-full left-0 mt-1 z-50 w-full` (hoặc `right-0` tùy vị trí mép màn hình).

### 2.9. Tiêu Chuẩn Slide-Over Drawer Cho Tạo Mới / Chỉnh Sửa / Xem Chi Tiết (SlideOver Pattern)
- **Mục tiêu:** Thay thế hoàn toàn các popup nổi ở giữa màn hình (center modal) hay việc chuyển hướng trang không cần thiết khi người dùng Tạo mới, Chỉnh sửa hoặc Xem chi tiết một bản ghi trong các sub-module.
- **Quy chuẩn component bắt buộc:** Sử dụng component chuẩn `<SlideOver>` từ `@/components/ds`.
- **Hành vi Responsive:**
  - **Trên Desktop ($\ge 768\text{px}$ / $\ge 640\text{px}$):**
    - Neo cố định sát mép phải màn hình (`fixed right-0 top-0 bottom-0`), chiều rộng tiêu chuẩn `width={480}` đến `width={560}`.
    - Lớp mờ hậu cảnh (backdrop blur nhẹ), click ngoài hoặc nhấn phím `Escape` để đóng panel.
  - **Trên Mobile ($< 640\text{px}$):**
    - Chiếm trọn bề ngang màn hình (`100vw`, `inset-0`).
    - Thanh tiêu đề dính trên cùng (sticky header) gồm icon bo tròn mang sắc thái phân hệ, tiêu đề in đậm, mô tả phụ và nút đóng `✕` tối thiểu 44px touch target.
    - Thanh tác vụ dính dưới đáy (sticky bottom footer) chứa nút phụ ("Hủy") và nút tác vụ chính ("Tạo mới", "Lưu thay đổi", "Áp dụng bộ lọc") với khoảng đệm ngón tay chạm chuẩn xác.
- **Quy chuẩn bố cục trường dữ liệu (Form Fields):**
  - Các ô nhập xếp theo chiều dọc với nhãn rõ ràng, đánh dấu `*` màu đỏ cho trường bắt buộc.
  - Chú thích phụ (helper text) nằm ngay dưới mỗi trường, màu `var(--text-subtle)`.
  - Hỗ trợ nút hành động bổ sung ở góc trái footer (`extraAction`, ví dụ: "Đặt lại", "Xóa").

---

## 3. Checklist Kiểm Tra Trước Khi Hoàn Tất Tính Năng (Definition of Done)

- [ ] Mở trên màn hình chuẩn di động **iPhone 14 / Pixel 7 (390px x 844px)**.
- [ ] Không có thanh cuộn ngang toàn trang ngoài ý muốn (`body { overflow-x: hidden }`).
- [ ] Mọi tab điều hướng cuộn ngang mượt mà, không bị cắt chữ.
- [ ] Mọi ô input và combobox rộng đều nhau, dễ nhập liệu.
- [ ] Vùng chạm ngón tay (Touch Target) của các nút $\ge 40\text{px}$.
- [ ] Kiểm tra lại trên màn hình Laptop **1440px x 900px** đảm bảo giao diện desktop vẫn cân đối và chuẩn xác.
- [ ] Chạy `./verify.sh` bảo đảm 100% tests pass và `npx tsc --noEmit` 0 lỗi.
