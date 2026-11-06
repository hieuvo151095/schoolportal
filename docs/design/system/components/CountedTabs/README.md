# CountedTabs Component

Thanh Tab có số đếm (Counted Tabs) được tích hợp trực tiếp trên đỉnh của Card nội dung / DataTable theo đặc tả `[DS] ECO ME DASHBOARD v1.1.0`.

## Sử dụng
```tsx
import { CountedTabs } from '@/components/ds';

<CountedTabs
  activeId={statusFilter}
  onChange={setStatusFilter}
  tabs={[
    { id: 'all', label: 'Tất cả', count: 8 },
    { id: 'present', label: 'Có mặt', count: 5 },
    { id: 'absent', label: 'Vắng', count: 1 },
  ]}
/>
```

## Tokens
- Chiều cao tab: `48px`
- Active indicator: `2px solid var(--eco-blue-strong)`
- Badge số đếm active: nền `var(--bg-info-tint)`, chữ `var(--eco-blue-strong)`
- Badge số đếm inactive: nền `var(--bg-muted)`, chữ `var(--text-subtle)`
