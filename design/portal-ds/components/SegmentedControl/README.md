# SegmentedControl Component

Thành phần chuyển đổi phân đoạn (Segmented Control / View Mode Switcher / Option Filter) chuẩn theo đặc tả `[DS] ECO ME DASHBOARD v1.1.0`.

## Tính năng
- Hỗ trợ chuyển đổi chế độ xem (View Mode): `Lưới` (Grid) vs `Danh sách` (List).
- Hỗ trợ lọc theo loại dữ liệu phân đoạn ngắn (Segmented Filter): `Tất cả` vs `Dạng lưới` vs `Dạng file`.
- Đồng bộ visual tokens 100%: Nền `var(--bg-muted)`, bo góc `var(--radius-8)`, active shadow `var(--shadow-xs)`, màu nhấn `var(--eco-blue-strong)`.
- Tuyệt đối không dùng emojis rời rạc, tích hợp trực tiếp SVG icon chuẩn Font Awesome.

## Sử dụng
```tsx
import { SegmentedControl } from '@/components/ds';

// 1. Chuyển đổi View Mode (ví dụ: Thư viện ảnh)
<SegmentedControl
  value={viewMode}
  onChange={setViewMode}
  items={[
    { key: 'grid', label: 'Lưới', icon: 'layer-group' },
    { key: 'list', label: 'Danh sách', icon: 'clipboard-list' },
  ]}
/>

// 2. Chuyển đổi Filter phân đoạn (ví dụ: Thời khóa biểu)
<SegmentedControl
  value={filterType}
  onChange={setFilterType}
  items={[
    { key: 'all', label: 'Tất cả' },
    { key: 'grid', label: 'Dạng lưới', icon: 'calendar-days' },
    { key: 'file', label: 'Dạng file', icon: 'file-lines' },
  ]}
/>
```
