import { Body1, Card, Caption1, makeStyles, tokens } from '@fluentui/react-components'
import { formatCurrency } from '../../utils/date'
import type { MiniKpi } from './useDashboardSummary'

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: tokens.spacingHorizontalM,
  },
  card: {
    padding: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXS,
  },
  value: {
    fontSize: '24px',
    fontWeight: 700,
  },
})

interface MiniKpiRowProps {
  miniKpi: MiniKpi
}

export function MiniKpiRow({ miniKpi }: MiniKpiRowProps) {
  const styles = useStyles()

  return (
    <div className={styles.grid}>
      <Card className={styles.card}>
        <Caption1>Tổng số khoản phí đang áp dụng</Caption1>
        <Body1 className={styles.value}>{miniKpi.tongKhoanPhi ?? '—'}</Body1>
      </Card>

      <Card className={styles.card}>
        <Caption1>Tổng hoá đơn kỳ gần nhất</Caption1>
        <Body1 className={styles.value}>{miniKpi.tongHoaDonKyGanNhat ?? '—'}</Body1>
        {miniKpi.daThuKyGanNhat !== null && miniKpi.conThuKyGanNhat !== null && (
          <Caption1>
            Đã thu: {formatCurrency(miniKpi.daThuKyGanNhat)} · Còn thu: {formatCurrency(miniKpi.conThuKyGanNhat)}
          </Caption1>
        )}
      </Card>
    </div>
  )
}
