import { createTableColumn, type TableColumnDefinition } from '@fluentui/react-components'
import type { HocSinhRow } from '../../types/domain'

/** Cấu trúc cột dùng chung giữa bảng chính Học sinh và bảng "Học sinh" trong pop-up module
 * Đồng bộ — CHỈ 1 nơi định nghĩa để không lệch cột giữa 2 nơi hiển thị. */
export const hocSinhColumns: TableColumnDefinition<HocSinhRow>[] = [
  createTableColumn<HocSinhRow>({ columnId: 'maHocSinh', renderHeaderCell: () => 'Mã HS', renderCell: (item) => item.maHocSinh }),
  createTableColumn<HocSinhRow>({ columnId: 'hoTen', renderHeaderCell: () => 'Họ tên', renderCell: (item) => item.hoTen }),
  createTableColumn<HocSinhRow>({ columnId: 'lop', renderHeaderCell: () => 'Lớp', renderCell: (item) => item.lop }),
  createTableColumn<HocSinhRow>({ columnId: 'khoi', renderHeaderCell: () => 'Khối', renderCell: (item) => item.khoi }),
  createTableColumn<HocSinhRow>({ columnId: 'gioiTinh', renderHeaderCell: () => 'Giới tính', renderCell: (item) => item.gioiTinh }),
  createTableColumn<HocSinhRow>({ columnId: 'nienKhoa', renderHeaderCell: () => 'Niên khoá', renderCell: (item) => item.nienKhoa }),
]
