import { Badge } from '@fluentui/react-components'

interface DongBoStatusBadgeProps {
  daDongBo: boolean
}

/** Badge cho cột "Trạng thái" ở bảng Nhập dữ liệu (Hoá đơn) — bind trực tiếp field `daDongBo`
 * (đã dùng để tính "X bản ghi chờ nộp báo cáo" ở Tổng quan, xem useDashboardSummary.ts). */
export function DongBoStatusBadge({ daDongBo }: DongBoStatusBadgeProps) {
  return (
    <Badge appearance="filled" color={daDongBo ? 'success' : 'warning'}>
      {daDongBo ? 'Đã báo cáo' : 'Chưa báo cáo'}
    </Badge>
  )
}
