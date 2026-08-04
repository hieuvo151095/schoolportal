import {
  Body1,
  Button,
  Card,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { ArrowUploadRegular, CheckmarkCircleRegular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import type { UploadEntityConfig } from '../types'

const PAGE_SIZE = 50

const useStyles = makeStyles({
  card: {
    padding: tokens.spacingHorizontalXL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
  },
  actions: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalS,
  },
})

interface StepPreviewConfirmProps<TRow extends object> {
  config: UploadEntityConfig<TRow>
  rows: TRow[]
  onConfirm: () => void
  onCancel: () => void
}

export function StepPreviewConfirm<TRow extends object>({
  config,
  rows,
  onConfirm,
  onCancel,
}: StepPreviewConfirmProps<TRow>) {
  const styles = useStyles()
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pageRows = rows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const columns = useMemo<TableColumnDefinition<TRow>[]>(
    () =>
      config.fields.map((field) =>
        createTableColumn<TRow>({
          columnId: field.key,
          renderHeaderCell: () => field.columnLabel,
          renderCell: (item) => {
            const value = item[field.key]
            return value === null || value === undefined || value === '' ? '—' : String(value)
          },
        }),
      ),
    [config.fields],
  )

  return (
    <Card className={styles.card}>
      <Body1>
        Xem trước {rows.length} dòng đã hợp lệ. Kiểm tra kỹ trước khi xác nhận — dữ liệu sẽ ghi đè toàn bộ dữ liệu
        cũ của {config.contextField.label.toLowerCase()} này.
      </Body1>

      <DataGrid items={pageRows} columns={columns} getRowId={(item) => JSON.stringify(item)} resizableColumns>
        <TableHeaderRow />
        <DataGridBody<TRow>>
          {({ item, rowId }) => (
            <DataGridRow<TRow> key={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}</DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <Button appearance="subtle" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Trang trước
          </Button>
          <Body1>
            Trang {page + 1}/{totalPages}
          </Body1>
          <Button appearance="subtle" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>
            Trang sau
          </Button>
        </div>
      )}

      <div className={styles.actions}>
        <Button appearance="primary" icon={<CheckmarkCircleRegular />} onClick={onConfirm}>
          Xác nhận đồng bộ
        </Button>
        <Button appearance="secondary" icon={<ArrowUploadRegular />} onClick={onCancel}>
          Chọn file khác
        </Button>
      </div>
    </Card>
  )
}
