import { Badge } from '@fluentui/react-components'

interface SyncStatusBadgeProps {
  coDuLieu: boolean
}

export function SyncStatusBadge({ coDuLieu }: SyncStatusBadgeProps) {
  return (
    <Badge appearance="filled" color={coDuLieu ? 'success' : 'warning'}>
      {coDuLieu ? 'Đã có dữ liệu' : 'Chưa có dữ liệu'}
    </Badge>
  )
}
