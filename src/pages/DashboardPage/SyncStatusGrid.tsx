import { Body1, Button, Card, Caption1, Subtitle2, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowRightRegular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'
import { SyncStatusBadge } from '../../components/SyncStatusBadge'
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
  // Đẩy nút xuống đáy card bất kể nội dung phía trên dài ngắn khác nhau — cả 2 nút luôn thẳng
  // hàng ngang.
  action: {
    marginTop: 'auto',
  },
})

interface SyncStatusGridProps {
  danhMucPhi: EntitySyncStatus
  hoaDon: EntitySyncStatus
}

export function SyncStatusGrid({ danhMucPhi, hoaDon }: SyncStatusGridProps) {
  const styles = useStyles()
  const navigate = useNavigate()

  const entities: { status: EntitySyncStatus; path: string; buttonLabel: string }[] = [
    { status: danhMucPhi, path: '/danh-muc-phi', buttonLabel: 'Kiểm tra' },
    { status: hoaDon, path: '/hoa-don', buttonLabel: 'Nhập liệu' },
  ]

  return (
    <div className={styles.grid}>
      {entities.map(({ status, path, buttonLabel }) => (
        <Card key={status.label} className={styles.card}>
          <div className={styles.header}>
            <Subtitle2>{status.label}</Subtitle2>
            <SyncStatusBadge coDuLieu={status.coDuLieu} />
          </div>
          <Body1>
            {status.contextLabel}:{' '}
            {status.coDuLieu
              ? status.chuKy === 'nienKhoa'
                ? 'đã có dữ liệu'
                : `${status.rowCount} dòng`
              : 'chưa có dữ liệu'}
          </Body1>
          <Caption1>
            {status.soLuongChoDongBo > 0
              ? `${status.soLuongChoDongBo} bản ghi chờ báo cáo`
              : 'Không có bản ghi chờ báo cáo'}
          </Caption1>
          <Button
            className={styles.action}
            appearance="secondary"
            size="small"
            iconPosition="after"
            icon={<ArrowRightRegular />}
            onClick={() => navigate(path)}
          >
            {buttonLabel}
          </Button>
        </Card>
      ))}
    </div>
  )
}
