import { createTableColumn, type TableColumnDefinition } from '@fluentui/react-components'
import { DanhMucThuStatusBadge } from '../../components/DanhMucThuStatusBadge'
import type { KhoanPhiRow } from '../../types/domain'
import { computeTrangThaiKhoanThu } from '../../utils/danhMucThu'
import { formatDate } from '../../utils/date'

/** Dòng hiển thị của Danh mục thu — thêm STT tính theo vị trí trong danh sách đã lọc, không phải
 * field lưu trữ (DataGrid không cấp index cho renderCell). */
export type DanhMucPhiDisplayRow = KhoanPhiRow & { stt: number }

/** Danh mục thu giờ THUẦN XEM (không còn CRUD phía trường) — đồng bộ đúng bộ cột bảng "Quản lý
 * danh mục" bên dashportal, TRỪ cột "Hành động" (sửa/xoá là quyền của Sở, không thuộc trường). */
export const danhMucPhiColumns: TableColumnDefinition<DanhMucPhiDisplayRow>[] = [
  createTableColumn<DanhMucPhiDisplayRow>({ columnId: 'stt', renderHeaderCell: () => 'STT', renderCell: (item) => item.stt }),
  createTableColumn<DanhMucPhiDisplayRow>({
    columnId: 'maPhi',
    renderHeaderCell: () => 'Mã khoản thu',
    renderCell: (item) => item.maPhi,
  }),
  createTableColumn<DanhMucPhiDisplayRow>({
    columnId: 'tenPhi',
    renderHeaderCell: () => 'Tên khoản thu',
    renderCell: (item) => item.tenPhi,
  }),
  createTableColumn<DanhMucPhiDisplayRow>({
    columnId: 'donViTinh',
    renderHeaderCell: () => 'Đơn vị tính',
    renderCell: (item) => item.donViTinh,
  }),
  createTableColumn<DanhMucPhiDisplayRow>({
    columnId: 'ngayBatDau',
    renderHeaderCell: () => 'Ngày bắt đầu',
    renderCell: (item) => formatDate(item.ngayBatDau),
  }),
  createTableColumn<DanhMucPhiDisplayRow>({
    columnId: 'ngayKetThuc',
    renderHeaderCell: () => 'Ngày kết thúc',
    renderCell: (item) => (item.ngayKetThuc ? formatDate(item.ngayKetThuc) : '—'),
  }),
  createTableColumn<DanhMucPhiDisplayRow>({
    columnId: 'thamChieuPhapLy',
    renderHeaderCell: () => 'Tham chiếu pháp lý',
    renderCell: (item) => item.thamChieuPhapLy || '—',
  }),
  createTableColumn<DanhMucPhiDisplayRow>({
    columnId: 'trangThai',
    renderHeaderCell: () => 'Trạng thái',
    renderCell: (item) => <DanhMucThuStatusBadge trangThai={computeTrangThaiKhoanThu(item)} />,
  }),
]
