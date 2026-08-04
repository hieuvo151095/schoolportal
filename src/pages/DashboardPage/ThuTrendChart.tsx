import { Card, Caption1, Subtitle2, makeStyles, tokens } from '@fluentui/react-components'
import { formatCurrency } from '../../utils/date'
import type { ThuThangDiem } from './useDashboardSummary'

const CHART_HEIGHT = 140

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  chart: {
    display: 'flex',
    alignItems: 'flex-end',
    columnGap: tokens.spacingHorizontalM,
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    rowGap: tokens.spacingVerticalXS,
    flex: 1,
  },
  barTrack: {
    display: 'flex',
    alignItems: 'flex-end',
    height: `${CHART_HEIGHT}px`,
  },
  bar: {
    width: '32px',
    borderRadius: tokens.borderRadiusMedium,
    backgroundColor: tokens.colorBrandBackground,
  },
})

interface ThuTrendChartProps {
  points: ThuThangDiem[]
}

export function ThuTrendChart({ points }: ThuTrendChartProps) {
  const styles = useStyles()

  if (points.length < 2) return null

  const max = Math.max(...points.map((p) => p.daThu), 1)

  return (
    <Card className={styles.card}>
      <Subtitle2>Xu hướng thu theo tháng</Subtitle2>
      <div className={styles.chart}>
        {points.map((point) => (
          <div key={point.ky} className={styles.column}>
            <Caption1>{formatCurrency(point.daThu)}</Caption1>
            <div className={styles.barTrack}>
              <div className={styles.bar} style={{ height: `${Math.max(4, (point.daThu / max) * CHART_HEIGHT)}px` }} />
            </div>
            <Caption1>{point.ky}</Caption1>
          </div>
        ))}
      </div>
    </Card>
  )
}
