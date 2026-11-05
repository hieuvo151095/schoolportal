# BulkActionBar Component

Thanh thao tác hàng loạt (Bulk Action Bar) xuất hiện khi người dùng tích chọn ít nhất 1 dòng trong bảng dữ liệu (`selectedCount > 0`).

## Sử dụng
```tsx
import { BulkActionBar, Button } from '@/components/ds';

<BulkActionBar
  selectedCount={selectedStudentIds.length}
  totalCount={students.length}
  onClearSelection={() => setSelectedStudentIds([])}
>
  <Button variant="secondary" icon="check" onClick={handleBulkCheckIn}>Đón hàng loạt</Button>
  <Button variant="secondary" icon="arrow-right" onClick={handleBulkCheckOut}>Trả hàng loạt</Button>
</BulkActionBar>
```

## Tokens
- Nền: `var(--semantic-info-soft)`
- Viền dưới: `1px solid var(--border-info-soft)`
- Typography: `13px`, font weight 600, màu `var(--text-heading)`
