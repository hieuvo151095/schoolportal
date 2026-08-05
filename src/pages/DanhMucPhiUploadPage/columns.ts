import { createTableColumn, type TableColumnDefinition } from '@fluentui/react-components'
import type { KhoanPhiRow } from '../../types/domain'
import { formatCurrency } from '../../utils/date'

/** Cấu trúc cột dùng chung giữa bảng chính Danh mục Phí và bảng "Danh mục Phí" trong pop-up
 * module Đồng bộ — CHỈ 1 nơi định nghĩa để không lệch cột giữa 2 nơi hiển thị. */
export const danhMucPhiColumns: TableColumnDefinition<KhoanPhiRow>[] = [
  createTableColumn<KhoanPhiRow>({ columnId: 'maPhi', renderHeaderCell: () => 'Mã Phí', renderCell: (item) => item.maPhi }),
  createTableColumn<KhoanPhiRow>({ columnId: 'tenPhi', renderHeaderCell: () => 'Tên phí', renderCell: (item) => item.tenPhi }),
  createTableColumn<KhoanPhiRow>({
    columnId: 'soTien',
    renderHeaderCell: () => 'Số tiền',
    renderCell: (item) => formatCurrency(item.soTien),
  }),
  createTableColumn<KhoanPhiRow>({ columnId: 'donViTinh', renderHeaderCell: () => 'Đơn vị tính', renderCell: (item) => item.donViTinh }),
  createTableColumn<KhoanPhiRow>({ columnId: 'nguonThu', renderHeaderCell: () => 'Nguồn thu', renderCell: (item) => item.nguonThu }),
  createTableColumn<KhoanPhiRow>({ columnId: 'nhomPhi', renderHeaderCell: () => 'Nhóm phí', renderCell: (item) => item.nhomPhi }),
  createTableColumn<KhoanPhiRow>({ columnId: 'nienKhoa', renderHeaderCell: () => 'Niên khoá', renderCell: (item) => item.nienKhoa }),
  createTableColumn<KhoanPhiRow>({
    columnId: 'thamChieuPhapLy',
    renderHeaderCell: () => 'Tham chiếu pháp lý',
    renderCell: (item) => item.thamChieuPhapLy || '—',
  }),
  createTableColumn<KhoanPhiRow>({ columnId: 'ghiChu', renderHeaderCell: () => 'Ghi chú', renderCell: (item) => item.ghiChu || '—' }),
]
