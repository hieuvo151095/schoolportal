import { Badge } from '@fluentui/react-components'

interface SyncStatusBadgeProps {
  synced: boolean
}

export function SyncStatusBadge({ synced }: SyncStatusBadgeProps) {
  return (
    <Badge appearance="filled" color={synced ? 'success' : 'warning'}>
      {synced ? 'Đã đồng bộ' : 'Chưa đồng bộ'}
    </Badge>
  )
}
