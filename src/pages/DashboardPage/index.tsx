import { Body1, Card, Subtitle2, Title2, makeStyles, tokens } from '@fluentui/react-components'
import { formatCurrency } from '../../utils/date'
import { HoSoTruongCard } from './HoSoTruongCard'
import { MiniKpiRow } from './MiniKpiRow'
import { SyncStatusGrid } from './SyncStatusGrid'
import { ThuTrendChart } from './ThuTrendChart'
import { getDashboardSummary } from './useDashboardSummary'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
  },
  topRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: tokens.spacingHorizontalM,
    alignItems: 'stretch',
    ...({ '@media (max-width: 900px)': { gridTemplateColumns: '1fr' } } as Record<string, unknown>),
  },
  kpiCard: {
    padding: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    rowGap: tokens.spacingVerticalXS,
  },
})

export function DashboardPage() {
  const styles = useStyles()
  const summary = getDashboardSummary()

  return (
    <div className={styles.root}>
      <Title2>Tổng quan</Title2>

      <div className={styles.topRow}>
        <HoSoTruongCard />

        <Card className={styles.kpiCard}>
          <Subtitle2>Số tiền còn phải thu</Subtitle2>
          <Body1 as="p" style={{ fontSize: '26px', fontWeight: 700 }}>
            {formatCurrency(summary.tongCongNo)}
          </Body1>
          <Body1>Toàn bộ các kỳ đã đồng bộ</Body1>
        </Card>
      </div>

      <MiniKpiRow miniKpi={summary.miniKpi} />

      <SyncStatusGrid danhMucPhi={summary.danhMucPhi} hocSinh={summary.hocSinh} hoaDon={summary.hoaDon} />

      <ThuTrendChart points={summary.xuHuongThu} />
    </div>
  )
}
