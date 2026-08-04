import { DataGridHeader, DataGridHeaderCell, DataGridRow, makeStyles, tokens } from '@fluentui/react-components'

const useStyles = makeStyles({
  headerCell: {
    fontWeight: tokens.fontWeightSemibold,
    whiteSpace: 'normal',
    lineHeight: tokens.lineHeightBase200,
  },
})

// Hàng header dùng chung cho mọi DataGrid trong app — tên cột luôn in đậm, xuống dòng
// nếu dài thay vì bị cắt/ellipsis.
export function TableHeaderRow() {
  const styles = useStyles()

  return (
    <DataGridHeader>
      <DataGridRow>
        {({ renderHeaderCell }) => <DataGridHeaderCell className={styles.headerCell}>{renderHeaderCell()}</DataGridHeaderCell>}
      </DataGridRow>
    </DataGridHeader>
  )
}
