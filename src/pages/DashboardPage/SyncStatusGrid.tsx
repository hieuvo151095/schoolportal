import { Body1, Button, Card, Caption1, Subtitle2, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowRightRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'
import { SyncStatusBadge } from '../../components/SyncStatusBadge'
import { formatDateTime } from '../../utils/date'
import type { EntitySyncStatus } from './useDashboardSummary'

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  card: {
    padding: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

interface SyncStatusGridProps {
  danhMucPhi: EntitySyncStatus
  hocSinh: EntitySyncStatus
  hoaDon: EntitySyncStatus
}

export function SyncStatusGrid({ danhMucPhi, hocSinh, hoaDon }: SyncStatusGridProps) {
  const styles = useStyles()
  const navigate = useNavigate()

  const entities: { status: EntitySyncStatus; path: string }[] = [
    { status: danhMucPhi, path: '/danh-muc-phi' },
    { status: hocSinh, path: '/hoc-sinh' },
    { status: hoaDon, path: '/hoa-don' },
  ]

  return (
    <div className={styles.grid}>
      {entities.map(({ status, path }) => (
        <Card key={status.label} className={styles.card}>
          <div className={styles.header}>
            <Subtitle2>{status.label}</Subtitle2>
            <SyncStatusBadge synced={status.synced} />
          </div>
          <Body1>
            {status.contextLabel}: {status.synced ? `${status.rowCount} dòng` : 'chưa có dữ liệu'}
          </Body1>
          <Caption1>
            {status.lastSyncAt ? `Lần đồng bộ gần nhất: ${formatDateTime(status.lastSyncAt)}` : 'Chưa từng đồng bộ'}
          </Caption1>
          <Button
            appearance="secondary"
            size="small"
            iconPosition="after"
            icon={<ArrowRightRegular />}
            onClick={() => navigate(path)}
          >
            Đồng bộ ngay
          </Button>
        </Card>
      ))}
    </div>
  )
}
