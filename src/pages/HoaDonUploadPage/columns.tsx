import { Badge, createTableColumn, type TableColumnDefinition } from '@fluentui/react-components'
import type { HoaDonRow, TrangThaiHoaDon } from '../../types/domain'
import { formatCurrency, formatDate } from '../../utils/date'

const TRANG_THAI_COLOR: Record<TrangThaiHoaDon, 'success' | 'warning' | 'informative'> = {
  'Đã thanh toán': 'success',
  'Thanh toán một phần': 'warning',
  'Chưa thanh toán': 'informative',
}

/** Cấu trúc cột DỮ LIỆU dùng chung giữa bảng chính Hoá đơn và bảng "Hoá đơn" trong pop-up module
 * Đồng bộ — CHỈ 1 nơi định nghĩa để không lệch cột giữa 2 nơi hiển thị. Không gồm cột hành động
 * "Xem chi tiết"/"Danh mục phí" (đặc thù bảng chính, không cần trong pop-up Đồng bộ) — thêm riêng
 * ở nơi gọi qua buildHoaDonActionColumn nếu cần. */
export function buildHoaDonDataColumns<TRow extends HoaDonRow>(): TableColumnDefinition<TRow>[] {
  return [
    createTableColumn<TRow>({ columnId: 'soHoaDon', renderHeaderCell: () => 'Mã HĐ', renderCell: (item) => item.soHoaDon }),
    createTableColumn<TRow>({
      columnId: 'hocSinh',
      renderHeaderCell: () => 'Học sinh',
      renderCell: (item) => {
        const hoTen = (item as unknown as { hoTenHocSinh?: string }).hoTenHocSinh
        return `${hoTen || item.maHocSinh} (${item.maHocSinh})`
      },
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
      renderHeaderCell: () => 'Trạng thái',
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
      columnId: 'taoXacNhan',
      renderHeaderCell: () => 'Tạo bởi / Xác nhận bởi',
      renderCell: (item) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          {item.taoBoi} / {item.xacNhanBoi ?? '—'}
        </span>
      ),
    }),
  ]
}
