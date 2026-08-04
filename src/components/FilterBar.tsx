import { Button, Card, makeStyles, tokens } from '@fluentui/react-components'
import { ArrowResetRegular, CheckmarkRegular } from '@fluentui/react-icons'
import type { ReactNode } from 'react'

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalS,
    padding: tokens.spacingHorizontalL,
  },
  fields: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    columnGap: tokens.spacingHorizontalM,
    rowGap: tokens.spacingVerticalS,
    width: '100%',
    '& > .fui-Field': {
      minWidth: '200px',
    },
  },
  buttons: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    alignSelf: 'flex-end',
  },
})

interface FilterBarProps {
  children: ReactNode
  onApply: () => void
  onReset: () => void
}

/** Filter bar dùng chung — chỉnh filter chưa lọc ngay, phải bấm Áp dụng mới thực sự lọc dữ
 * liệu; Làm mới đưa toàn bộ filter về mặc định. */
export function FilterBar({ children, onApply, onReset }: FilterBarProps) {
  const styles = useStyles()

  return (
    <Card className={styles.card}>
      <div className={styles.fields}>{children}</div>
      <div className={styles.buttons}>
        <Button appearance="secondary" icon={<ArrowResetRegular />} onClick={onReset}>
          Làm mới
        </Button>
        <Button appearance="primary" icon={<CheckmarkRegular />} onClick={onApply}>
          Áp dụng
        </Button>
      </div>
    </Card>
  )
}
