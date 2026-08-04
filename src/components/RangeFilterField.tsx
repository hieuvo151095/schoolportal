import { Field, makeStyles, tokens } from '@fluentui/react-components'
import type { ReactNode } from 'react'

const useStyles = makeStyles({
  row: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
  control: {
    flex: 1,
    minWidth: 0,
  },
  separator: {
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
})

interface RangeFilterFieldProps {
  label: string
  from: ReactNode
  to: ReactNode
}

/** Gộp 2 control "từ"/"đến" vào 1 khung Field duy nhất — thay cho 2 Field riêng biệt. */
export function RangeFilterField({ label, from, to }: RangeFilterFieldProps) {
  const styles = useStyles()

  return (
    <Field label={label} style={{ minWidth: '340px' }}>
      <div className={styles.row}>
        <div className={styles.control}>{from}</div>
        <span className={styles.separator}>–</span>
        <div className={styles.control}>{to}</div>
      </div>
    </Field>
  )
}
