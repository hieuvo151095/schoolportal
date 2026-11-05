# TeacherListPage

Mẫu trang danh sách ráp từ AppHeader, SidebarNav, PageHeader, StatCard, FilterBar và DataTable — khung cho mọi trang danh sách quản trị.

## Khi nào dùng

- **Dùng khi:**
  - Dựng một trang danh sách mới (giáo viên, học sinh, lớp, khoản phí).

## Bố cục

1. `AppHeader` trên cùng; dưới là `SidebarNav` bên trái và vùng nội dung.
2. Vùng nội dung: đệm `space-16` → `space-24` (từ 768px) → `space-32` (từ 1024px), nền `bg-canvas`, các khối cách nhau `space-24`.
3. Thứ tự khối: `PageHeader` → `StatCard.Group` → `FilterBar` + `DataTable` (cách nhau `space-16`).
4. Tương tác: nút menu trên AppHeader thu gọn SidebarNav; "Bộ lọc nâng cao" mở `PopupModal`, áp dụng xong nút chuyển sang `active`; cột "Thao tác" mở `DropdownMenu`; không có kết quả thì bảng hiện `EmptyState`.

## Nội dung & quy tắc

Màn dùng cung cấp: tiêu đề + mô tả, 3–5 chỉ số, bộ lọc + CTA, cột và hàng của bảng, mục đang chọn của SidebarNav.
