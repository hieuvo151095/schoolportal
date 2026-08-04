import { Body1, Caption1, makeStyles, tokens } from '@fluentui/react-components'
import type { ReactNode } from 'react'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
  },
  label: {
    color: tokens.colorNeutralForeground3,
  },
})

interface LabelValueFieldProps {
  label: string
  value: ReactNode
}

// Field hiển thị dạng 2 dòng xếp chồng (label nhỏ/xám phía trên, value to/đen phía dưới) —
// dùng cho phần thông tin tổng quan trong mọi popup chi tiết, thay cho dạng "Label: value"
// trên 1 dòng.
export function LabelValueField({ label, value }: LabelValueFieldProps) {
  const styles = useStyles()
  return (
    <div className={styles.root}>
      <Caption1 className={styles.label}>{label}</Caption1>
      <Body1>{value}</Body1>
    </div>
  )
}
