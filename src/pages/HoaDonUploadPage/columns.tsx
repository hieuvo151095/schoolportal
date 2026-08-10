import { Badge, createTableColumn, type TableColumnDefinition } from '@fluentui/react-components'
import type { HoaDonRow, TrangThaiHoaDon } from '../../types/domain'
import { formatCurrency, formatDate } from '../../utils/date'

const TRANG_THAI_COLOR: Record<TrangThaiHoaDon, 'success' | 'warning' | 'informative'> = {
  'Đã thanh toán': 'success',
  'Thanh toán một phần': 'warning',
  'Chưa thanh toán': 'informative',
}

/** Cấu trúc cột DỮ LIỆU dùng chung giữa bảng chính Hoá đơn và bảng "Hoá đơn" trong pop-up module
 * Nộp báo cáo — CHỈ 1 nơi định nghĩa để không lệch cột giữa 2 nơi hiển thị. Không gồm cột hành
 * động "Xem chi tiết" hay cột "Trạng thái" (đồng bộ/báo cáo, đặc thù bảng chính) — thêm riêng ở
 * nơi gọi. Cột thanh toán đặt tên "Trạng thái thanh toán" (không phải "Trạng thái" đơn thuần) để
 * không trùng với cột "Trạng thái" (Đã báo cáo/Chưa báo cáo) ở bảng chính. */
export function buildHoaDonDataColumns<TRow extends HoaDonRow>(): TableColumnDefinition<TRow>[] {
  return [
    createTableColumn<TRow>({ columnId: 'soHoaDon', renderHeaderCell: () => 'Mã HĐ', renderCell: (item) => item.soHoaDon }),
    createTableColumn<TRow>({
      columnId: 'hoTenHocSinh',
      renderHeaderCell: () => 'Tên học sinh',
      renderCell: (item) => item.hoTenHocSinh,
    }),
    createTableColumn<TRow>({
      columnId: 'maHocSinh',
      renderHeaderCell: () => 'Mã học sinh',
      renderCell: (item) => item.maHocSinh,
    }),
    createTableColumn<TRow>({ columnId: 'ky', renderHeaderCell: () => 'Kỳ', renderCell: (item) => item.ky }),
    createTableColumn<TRow>({
      columnId: 'hanThanhToan',
      renderHeaderCell: () => 'Hạn thanh toán',
      renderCell: (item) => formatDate(item.hanThanhToan),
    }),
    createTableColumn<TRow>({
      columnId: 'soTien',
      renderHeaderCell: () => 'Số tiền',
      renderCell: (item) => formatCurrency(item.soTien),
    }),
    createTableColumn<TRow>({
      columnId: 'hinhThucThanhToan',
      renderHeaderCell: () => 'Hình thức thanh toán',
      renderCell: (item) => item.hinhThucThanhToan ?? '—',
    }),
    createTableColumn<TRow>({
      columnId: 'ngayThanhToan',
      renderHeaderCell: () => 'Ngày thanh toán',
      renderCell: (item) => (item.ngayThanhToan ? formatDate(item.ngayThanhToan) : '—'),
    }),
    createTableColumn<TRow>({
      columnId: 'trangThai',
      renderHeaderCell: () => 'Trạng thái thanh toán',
      renderCell: (item) => (
        <Badge appearance="tint" color={TRANG_THAI_COLOR[item.trangThai]} style={{ whiteSpace: 'nowrap' }}>
          {item.trangThai}
        </Badge>
      ),
    }),
    createTableColumn<TRow>({
      columnId: 'daTra',
      renderHeaderCell: () => 'Số tiền đã trả',
      renderCell: (item) => (item.trangThai === 'Thanh toán một phần' ? formatCurrency(item.daTra) : '—'),
    }),
    createTableColumn<TRow>({
      columnId: 'taoBoi',
      renderHeaderCell: () => 'Tạo bởi',
      renderCell: (item) => <span style={{ whiteSpace: 'nowrap' }}>{item.taoBoi}</span>,
    }),
  ]
}
