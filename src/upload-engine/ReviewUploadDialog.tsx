import {
  Body1,
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  MessageBar,
  MessageBarActions,
  MessageBarBody,
  MessageBarTitle,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { CheckmarkCircleRegular, DeleteRegular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TableHeaderRow } from '../components/TableHeaderRow'
import type { ReviewRowWithErrors } from './useReviewUpload'
import type { UploadEntityConfig } from './types'

const PAGE_SIZE = 50

const useStyles = makeStyles({
  surface: {
    maxWidth: '96vw',
    width: '1800px',
  },
  tableScroll: {
    overflowX: 'auto',
    maxHeight: '50vh',
    overflowY: 'auto',
  },
  errorCell: {
    color: tokens.colorPaletteRedForeground1,
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalS,
    marginTop: tokens.spacingVerticalS,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  missingCodesList: {
    marginTop: tokens.spacingVerticalXS,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
  },
})

const ERROR_COLUMN_SIZING = { minWidth: 360, defaultWidth: 480, idealWidth: 480 }

interface ReviewUploadDialogProps<TRow extends object> {
  config: UploadEntityConfig<TRow>
  open: boolean
  fileName: string | null
  missingColumns: string[]
  reviewRows: ReviewRowWithErrors[]
  hasErrors: boolean
  dataDerived: boolean
  detectedContextValue: string | null
  onDeleteRow: (rowId: string) => void
  onCancel: () => void
  onConfirm: () => void
}

export function ReviewUploadDialog<TRow extends object>({
  config,
  open,
  fileName,
  missingColumns,
  reviewRows,
  hasErrors,
  dataDerived,
  detectedContextValue,
  onDeleteRow,
  onCancel,
  onConfirm,
}: ReviewUploadDialogProps<TRow>) {
  const styles = useStyles()
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(reviewRows.length / PAGE_SIZE))
  const pageRows = reviewRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  /** Gom nhóm lỗi khoá ngoại (Mã phí/Mã HS chưa đồng bộ...) theo module nguồn, đếm + liệt kê các
   * giá trị DUY NHẤT bị thiếu — dùng cho banner điều hướng riêng, nổi bật hơn bảng lỗi thông
   * thường, và cho danh sách mã cụ thể hiện ngay dưới banner (không cần cuộn hết bảng để đếm). */
  const crossRefGroups = useMemo(() => {
    const groups = new Map<string, { route: string; values: Set<string> }>()
    for (const row of reviewRows) {
      for (const error of row.errors) {
        if (!error.crossRef) continue
        const group = groups.get(error.crossRef.entityLabel) ?? { route: error.crossRef.route, values: new Set<string>() }
        group.values.add(error.crossRef.value)
        groups.set(error.crossRef.entityLabel, group)
      }
    }
    return Array.from(groups.entries()).map(([entityLabel, { route, values }]) => ({
      entityLabel,
      route,
      count: values.size,
      values: Array.from(values).sort(),
    }))
  }, [reviewRows])

  const columns = useMemo<TableColumnDefinition<ReviewRowWithErrors>[]>(() => {
    const fieldColumns = config.fields.map((field) =>
      createTableColumn<ReviewRowWithErrors>({
        columnId: field.key,
        renderHeaderCell: () => field.columnLabel,
        renderCell: (item) => {
          const value = item.coerced[field.key]
          return value === null || value === undefined || value === '' ? '—' : String(value)
        },
      }),
    )
    return [
      ...fieldColumns,
      createTableColumn<ReviewRowWithErrors>({
        columnId: '__errors',
        renderHeaderCell: () => 'Lỗi',
        renderCell: (item) =>
          item.errors.length === 0 ? (
            '—'
          ) : (
            <span className={styles.errorCell}>
              {item.errors.map((e) => `${e.columnLabel}: ${e.message}`).join('; ')}
            </span>
          ),
      }),
      createTableColumn<ReviewRowWithErrors>({
        columnId: '__actions',
        renderHeaderCell: () => '',
        renderCell: (item) => (
          <Button
            appearance="subtle"
            size="small"
            icon={<DeleteRegular />}
            onClick={() => onDeleteRow(item.id)}
            aria-label="Xoá dòng"
          >
            Xoá
          </Button>
        ),
      }),
    ]
  }, [config.fields, onDeleteRow, styles.errorCell])

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onCancel()}>
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <DialogTitle>Xem trước dữ liệu — {fileName}</DialogTitle>
          <DialogContent className={styles.content}>
            {missingColumns.length > 0 ? (
              <MessageBar intent="error">
                <MessageBarBody>Thiếu cột bắt buộc trong file: {missingColumns.join(', ')}</MessageBarBody>
              </MessageBar>
            ) : (
              <>
                {crossRefGroups.length > 0 && (
                  <MessageBar intent="error" shape="square">
                    <MessageBarBody>
                      <MessageBarTitle>
                        Phát hiện {crossRefGroups.map((g) => `${g.count} ${g.entityLabel.toLowerCase() === 'học sinh' ? 'Mã HS' : 'Mã phí'}`).join(' / ')} chưa được đồng bộ.
                      </MessageBarTitle>
                      Vui lòng chuyển sang tab tương ứng để đồng bộ dữ liệu còn thiếu trước, sau đó quay lại đồng bộ {config.entityLabel}.
                      <div className={styles.missingCodesList}>
                        {crossRefGroups.map((g) => (
                          <div key={g.entityLabel}>
                            {g.entityLabel.toLowerCase() === 'học sinh' ? 'Mã HS còn thiếu' : 'Mã phí còn thiếu'}: {g.values.join(', ')}
                          </div>
                        ))}
                      </div>
                    </MessageBarBody>
                    <MessageBarActions>
                      {crossRefGroups.map((g) => (
                        <Button key={g.entityLabel} appearance="outline" onClick={() => navigate(g.route)}>
                          Đi tới {g.entityLabel}
                        </Button>
                      ))}
                    </MessageBarActions>
                  </MessageBar>
                )}

                <Body1>Kiểm tra {reviewRows.length} dòng đã đọc từ file. Xoá dòng lỗi nếu cần — hệ thống tự kiểm tra lại.</Body1>

                {dataDerived && (
                  <MessageBar intent={detectedContextValue ? 'info' : 'warning'}>
                    <MessageBarBody>
                      {detectedContextValue
                        ? `Phát hiện: ${config.contextField.label} ${detectedContextValue}, ${reviewRows.length} dòng dữ liệu.`
                        : `Không xác định được ${config.contextField.label} chung cho file này — kiểm tra cột "${config.contextField.label}" ở từng dòng.`}
                    </MessageBarBody>
                  </MessageBar>
                )}

                <div className={styles.tableScroll}>
                  <DataGrid
                    items={pageRows}
                    columns={columns}
                    getRowId={(item) => item.id}
                    resizableColumns
                    columnSizingOptions={{ __errors: ERROR_COLUMN_SIZING }}
                  >
                    <TableHeaderRow />
                    <DataGridBody<ReviewRowWithErrors>>
                      {({ item, rowId }) => (
                        <DataGridRow<ReviewRowWithErrors> key={rowId}>
                          {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                        </DataGridRow>
                      )}
                    </DataGridBody>
                  </DataGrid>
                </div>

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

                {reviewRows.length === 0 ? (
                  <MessageBar intent="warning">
                    <MessageBarBody>Không còn dòng nào — chọn file khác để tiếp tục.</MessageBarBody>
                  </MessageBar>
                ) : hasErrors ? (
                  <MessageBar intent="error">
                    <MessageBarBody>
                      Còn dòng lỗi trong file — xoá hoặc sửa lại dòng lỗi trước khi đồng bộ.
                    </MessageBarBody>
                  </MessageBar>
                ) : (
                  <MessageBar intent="success">
                    <MessageBarBody>Sẵn sàng đồng bộ dữ liệu lên trang quản lý của Sở.</MessageBarBody>
                  </MessageBar>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onCancel}>
              Huỷ
            </Button>
            <Button
              appearance="primary"
              icon={<CheckmarkCircleRegular />}
              disabled={missingColumns.length > 0 || hasErrors || reviewRows.length === 0}
              onClick={onConfirm}
            >
              Đồng bộ
            </Button>
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
