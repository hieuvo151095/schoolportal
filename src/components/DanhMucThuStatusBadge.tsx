import { Badge } from '@fluentui/react-components'
import type { TrangThaiKhoanThu } from '../utils/danhMucThu'

interface DanhMucThuStatusBadgeProps {
  trangThai: TrangThaiKhoanThu
}

export function DanhMucThuStatusBadge({ trangThai }: DanhMucThuStatusBadgeProps) {
  return (
    <Badge appearance="filled" color={trangThai === 'Đang hoạt động' ? 'success' : 'danger'}>
      {trangThai}
    </Badge>
  )
}
