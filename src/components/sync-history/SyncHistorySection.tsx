import {
  Body1,
  Card,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  Dropdown,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Option,
  Subtitle2,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { useMemo, useState } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { RangeFilterField } from '../../components/RangeFilterField'
import { ensureSeeded, getLichSuDongBoByLoai } from '../../storage/lichSuDongBo'
import { getSession } from '../../storage/session'
import type { LichSuDongBoEntry, LoaiDuLieuDongBo } from '../../types/domain'
import { formatDateTime } from '../../utils/date'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { ReviewUploadDialog } from '../../upload-engine/ReviewUploadDialog'
import { UploadActionsRow } from '../../upload-engine/UploadActionsRow'
import { useReviewUpload } from '../../upload-engine/useReviewUpload'
import type { UploadEntityConfig } from '../../upload-engine/types'
import { TableHeaderRow } from '../TableHeaderRow'
import { HISTORY_FILTER_DEFAULTS, useHistoryFilters, type HistoryFilters } from './useHistoryFilters'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  tableCard: {
    padding: tokens.spacingHorizontalL,
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  uploadRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    columnGap: tokens.spacingHorizontalM,
    flexWrap: 'wrap',
  },
  uploadContextField: {
    maxWidth: '220px',
  },
  tableScroll: {
    overflowX: 'auto',
  },
  contextField: {
    minWidth: '200px',
  },
})

interface SyncHistorySectionProps<TRow extends object> {
  loaiDuLieu: LoaiDuLieuDongBo
  contextLabel: string
  contextOptions: string[]
  successCountLabel: string
  uploadConfig: UploadEntityConfig<TRow>
  /** Chỉ cần thiết khi context (Niên khoá/Kỳ) không đọc được từ chính dữ liệu file — vd Học
   * sinh. Danh mục Phí/Hoá đơn bỏ qua prop này vì tự phát hiện từ file lúc upload. */
  defaultContextValue?: string
  onConfirmed: () => void
}

export function SyncHistorySection<TRow extends object>({
  loaiDuLieu,
  contextLabel,
  contextOptions,
  successCountLabel,
  uploadConfig,
  defaultContextValue,
  onConfirmed,
}: SyncHistorySectionProps<TRow>) {
  const styles = useStyles()

  const session = getSession()
  if (session) ensureSeeded(loaiDuLieu, session.maTruong)
  const entries = getLichSuDongBoByLoai(loaiDuLieu)

  const { filters, apply, reset } = useHistoryFilters()
  const [draft, setDraft] = useFilterDraft<HistoryFilters>(filters)

  const [contextDongBo, setContextDongBo] = useState(defaultContextValue ?? '')
  const review = useReviewUpload(uploadConfig, contextDongBo, onConfirmed)

  const columns = useMemo<TableColumnDefinition<LichSuDongBoEntry>[]>(
    () => [
      createTableColumn<LichSuDongBoEntry>({
        columnId: 'thoiDiem',
        renderHeaderCell: () => 'Thời điểm đồng bộ',
        renderCell: (item) => formatDateTime(item.thoiDiem),
      }),
      createTableColumn<LichSuDongBoEntry>({
        columnId: 'nienKhoaHoacKy',
        renderHeaderCell: () => contextLabel,
        renderCell: (item) => item.nienKhoaHoacKy,
      }),
      createTableColumn<LichSuDongBoEntry>({
        columnId: 'soDongThanhCong',
        renderHeaderCell: () => successCountLabel,
        renderCell: (item) => item.soDongThanhCong,
      }),
      createTableColumn<LichSuDongBoEntry>({
        columnId: 'soDongLoi',
        renderHeaderCell: () => 'Số dòng lỗi đã loại bỏ',
        renderCell: (item) => item.soDongLoi,
      }),
      createTableColumn<LichSuDongBoEntry>({
        columnId: 'tenFileExport',
        renderHeaderCell: () => 'Tên file',
        renderCell: (item) => item.tenFileExport,
      }),
      createTableColumn<LichSuDongBoEntry>({
        columnId: 'nguoiThucHien',
        renderHeaderCell: () => 'Người thực hiện',
        renderCell: (item) => item.nguoiThucHien,
      }),
    ],
    [contextLabel, successCountLabel],
  )

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        if (filters.q) {
          const q = filters.q.toLowerCase()
          if (!entry.tenFileExport.toLowerCase().includes(q) && !entry.nguoiThucHien.toLowerCase().includes(q)) {
            return false
          }
        }
        if (filters.context !== 'all' && entry.nienKhoaHoacKy !== filters.context) return false
        if (filters.tuNgay && entry.thoiDiem < filters.tuNgay) return false
        if (filters.denNgay && entry.thoiDiem > `${filters.denNgay}T23:59:59`) return false
        return true
      })
      .sort((a, b) => b.thoiDiem.localeCompare(a.thoiDiem))
  }, [entries, filters])

  return (
    <div className={styles.root}>
      <Subtitle2>Lịch sử đồng bộ</Subtitle2>

      <FilterBar
        onApply={() => apply(draft)}
        onReset={() => {
          setDraft(HISTORY_FILTER_DEFAULTS)
          reset()
        }}
      >
        <Field label="Tìm kiếm">
          <Input
            value={draft.q}
            onChange={(_, data) => setDraft({ q: data.value })}
            placeholder="Tên file hoặc người thực hiện..."
          />
        </Field>

        <Field label={contextLabel} className={styles.contextField}>
          <Dropdown
            value={draft.context === 'all' ? 'Tất cả' : draft.context}
            selectedOptions={[draft.context]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ context: data.optionValue })}
          >
            <Option value="all">Tất cả</Option>
            {contextOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        </Field>

        <RangeFilterField
          label="Thời điểm đồng bộ"
          from={<Input type="date" value={draft.tuNgay} onChange={(_, data) => setDraft({ tuNgay: data.value })} />}
          to={<Input type="date" value={draft.denNgay} onChange={(_, data) => setDraft({ denNgay: data.value })} />}
        />
      </FilterBar>

      <Card className={styles.tableCard}>
        <div className={styles.uploadRow}>
          {!review.dataDerived && (
            <Field label={`${contextLabel} áp dụng khi tải file lên`} className={styles.uploadContextField}>
              <Dropdown
                value={contextDongBo}
                selectedOptions={[contextDongBo]}
                onOptionSelect={(_, data) => data.optionValue && setContextDongBo(data.optionValue)}
              >
                {contextOptions.map((option) => (
                  <Option key={option} value={option}>
                    {option}
                  </Option>
                ))}
              </Dropdown>
            </Field>
          )}
          <UploadActionsRow config={uploadConfig} processing={review.processing} onFileSelected={review.handleFile} />
        </div>

        {review.confirmSummary && (
          <MessageBar intent="success">
            <MessageBarBody>
              Đã đồng bộ thành công {review.confirmSummary.soDong} dòng. Đã tải về file:{' '}
              {review.confirmSummary.tenFileExport}
            </MessageBarBody>
          </MessageBar>
        )}

        {filteredEntries.length === 0 ? (
          <Body1>Không có lần đồng bộ nào khớp bộ lọc.</Body1>
        ) : (
          <div className={styles.tableScroll}>
            <DataGrid
              items={filteredEntries}
              columns={columns}
              getRowId={(item) => item.id}
              resizableColumns
              columnSizingOptions={{
                thoiDiem: { minWidth: 140, defaultWidth: 150 },
                nienKhoaHoacKy: { minWidth: 100, defaultWidth: 110 },
                soDongThanhCong: { minWidth: 90, defaultWidth: 100 },
                soDongLoi: { minWidth: 140, defaultWidth: 150 },
                tenFileExport: { minWidth: 260, defaultWidth: 340 },
                nguoiThucHien: { minWidth: 160, defaultWidth: 180 },
              }}
            >
              <TableHeaderRow />
              <DataGridBody<LichSuDongBoEntry>>
                {({ item, rowId }) => (
                  <DataGridRow<LichSuDongBoEntry> key={rowId}>
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </div>
        )}
      </Card>

      <ReviewUploadDialog
        config={uploadConfig}
        open={review.open}
        fileName={review.fileName}
        missingColumns={review.missingColumns}
        reviewRows={review.reviewRows}
        hasErrors={review.hasErrors}
        dataDerived={review.dataDerived}
        detectedContextValue={review.detectedContextValue}
        onDeleteRow={review.deleteRow}
        onCancel={review.cancel}
        onConfirm={review.confirm}
      />
    </div>
  )
}
