import {
  Body1,
  Button,
  Card,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  MessageBar,
  MessageBarBody,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { ArrowUploadRegular } from '@fluentui/react-icons'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import type { RowError } from '../types'

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalXL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
})

interface StepValidationErrorsProps {
  missingColumns: string[]
  errors: RowError[]
  fileName: string | null
  onRetry: () => void
}

const columns: TableColumnDefinition<RowError>[] = [
  createTableColumn<RowError>({
    columnId: 'rowIndex',
    renderHeaderCell: () => 'Dòng',
    renderCell: (item) => item.rowIndex,
  }),
  createTableColumn<RowError>({
    columnId: 'columnLabel',
    renderHeaderCell: () => 'Cột',
    renderCell: (item) => item.columnLabel,
  }),
  createTableColumn<RowError>({
    columnId: 'message',
    renderHeaderCell: () => 'Lý do lỗi',
    renderCell: (item) => item.message,
  }),
]

export function StepValidationErrors({ missingColumns, errors, fileName, onRetry }: StepValidationErrorsProps) {
  const styles = useStyles()

  return (
    <Card className={styles.card}>
      <MessageBar intent="error">
        <MessageBarBody>
          File "{fileName}" chưa hợp lệ — sửa lỗi bên dưới và tải lên lại. Chưa thể xác nhận đồng bộ cho tới khi
          hết lỗi.
        </MessageBarBody>
      </MessageBar>

      {missingColumns.length > 0 ? (
        <Body1>Thiếu cột bắt buộc trong file: {missingColumns.join(', ')}</Body1>
      ) : (
        <DataGrid items={errors} columns={columns} getRowId={(item) => `${item.rowIndex}-${item.columnLabel}`}>
          <TableHeaderRow />
          <DataGridBody<RowError>>
            {({ item, rowId }) => (
              <DataGridRow<RowError> key={rowId}>
                {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
              </DataGridRow>
            )}
          </DataGridBody>
        </DataGrid>
      )}

      <Button appearance="primary" icon={<ArrowUploadRegular />} onClick={onRetry}>
        Chọn lại file
      </Button>
    </Card>
  )
}
