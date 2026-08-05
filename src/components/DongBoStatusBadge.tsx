import { Badge } from '@fluentui/react-components'

interface DongBoStatusBadgeProps {
  daDongBo: boolean
}

/** Badge cho cột "Đồng bộ" ở bảng chính Danh mục Phí/Học sinh/Hoá đơn — bind trực tiếp field
 * `daDongBo` (đã dùng để tính "X bản ghi chờ đồng bộ" ở Tổng quan, xem useDashboardSummary.ts). */
export function DongBoStatusBadge({ daDongBo }: DongBoStatusBadgeProps) {
  return (
    <Badge appearance="filled" color={daDongBo ? 'success' : 'warning'}>
      {daDongBo ? 'Hoàn thành' : 'Chưa đồng bộ'}
    </Badge>
  )
}
