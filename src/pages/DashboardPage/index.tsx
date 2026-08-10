import { Title2, makeStyles, tokens } from '@fluentui/react-components'
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
})

export function DashboardPage() {
  const styles = useStyles()
  const summary = getDashboardSummary()

  return (
    <div className={styles.root}>
      <Title2>Tổng quan</Title2>

      <HoSoTruongCard />

      <MiniKpiRow miniKpi={summary.miniKpi} />

      <SyncStatusGrid danhMucPhi={summary.danhMucPhi} hoaDon={summary.hoaDon} />

      <ThuTrendChart points={summary.xuHuongThu} />
    </div>
  )
}
