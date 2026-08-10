import { createTableColumn, type TableColumnDefinition } from '@fluentui/react-components'
import type { KhoanPhiRow } from '../../types/domain'
import { formatDateTime } from '../../utils/date'

/** Dòng hiển thị của Danh mục thu — thêm STT tính theo vị trí trong danh sách đã lọc, không phải
 * field lưu trữ (DataGrid không cấp index cho renderCell). */
export type DanhMucPhiDisplayRow = KhoanPhiRow & { stt: number }

/** Danh mục thu giờ THUẦN XEM (không còn CRUD phía trường) — chỉ còn đúng 5 cột theo yêu cầu. */
export const danhMucPhiColumns: TableColumnDefinition<DanhMucPhiDisplayRow>[] = [
  createTableColumn<DanhMucPhiDisplayRow>({ columnId: 'stt', renderHeaderCell: () => 'STT', renderCell: (item) => item.stt }),
  createTableColumn<DanhMucPhiDisplayRow>({
    columnId: 'ngayCapNhat',
    renderHeaderCell: () => 'Ngày cập nhật',
    renderCell: (item) => formatDateTime(item.ngayCapNhat),
  }),
  createTableColumn<DanhMucPhiDisplayRow>({ columnId: 'maPhi', renderHeaderCell: () => 'Mã phí', renderCell: (item) => item.maPhi }),
  createTableColumn<DanhMucPhiDisplayRow>({
    columnId: 'tenPhi',
    renderHeaderCell: () => 'Danh mục phí',
    renderCell: (item) => item.tenPhi,
  }),
  createTableColumn<DanhMucPhiDisplayRow>({
    columnId: 'thamChieuPhapLy',
    renderHeaderCell: () => 'Tham chiếu pháp lý',
    renderCell: (item) => item.thamChieuPhapLy || '—',
  }),
]
