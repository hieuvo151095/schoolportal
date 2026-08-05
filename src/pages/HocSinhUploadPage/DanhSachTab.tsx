import {
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
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { useMemo, useState } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { ensureSeededHocSinh, getHocSinhStore } from '../../storage/hocSinh'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import type { HocSinhRow } from '../../types/domain'
import { ReviewUploadDialog } from '../../upload-engine/ReviewUploadDialog'
import { UploadActionsRow } from '../../upload-engine/UploadActionsRow'
import { useReviewUpload } from '../../upload-engine/useReviewUpload'
import { getNienKhoaOptions } from '../../utils/nienKhoa'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { hocSinhUploadConfig } from './hocSinhUploadConfig'

const TAT_CA = 'all'

type DisplayRow = HocSinhRow

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
  tableScroll: {
    overflowX: 'auto',
  },
  uploadRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    columnGap: tokens.spacingHorizontalS,
  },
})

interface DanhSachFilters {
  q: string
  lop: string
  khoi: string
  nienKhoa: string
}

const FILTER_DEFAULTS: DanhSachFilters = { q: '', lop: TAT_CA, khoi: TAT_CA, nienKhoa: TAT_CA }

const columns: TableColumnDefinition<DisplayRow>[] = [
  createTableColumn<DisplayRow>({ columnId: 'maHocSinh', renderHeaderCell: () => 'Mã HS', renderCell: (item) => item.maHocSinh }),
  createTableColumn<DisplayRow>({ columnId: 'hoTen', renderHeaderCell: () => 'Họ tên', renderCell: (item) => item.hoTen }),
  createTableColumn<DisplayRow>({ columnId: 'lop', renderHeaderCell: () => 'Lớp', renderCell: (item) => item.lop }),
  createTableColumn<DisplayRow>({ columnId: 'khoi', renderHeaderCell: () => 'Khối', renderCell: (item) => item.khoi }),
  createTableColumn<DisplayRow>({ columnId: 'gioiTinh', renderHeaderCell: () => 'Giới tính', renderCell: (item) => item.gioiTinh }),
  createTableColumn<DisplayRow>({ columnId: 'nienKhoa', renderHeaderCell: () => 'Niên khoá', renderCell: (item) => item.nienKhoa }),
]

export function DanhSachTab() {
  const styles = useStyles()
  const hoSo = getHoSoTruong()
  const nienKhoaOptions = getNienKhoaOptions()

  if (hoSo) ensureSeededHocSinh(hoSo.nienKhoa)

  /** Bump sau mỗi lần đồng bộ thành công để allRows đọc lại storage — nút upload giờ nằm ngay
   * trong tab này (không còn ở tab Lịch sử đồng bộ), nên component không remount qua key nữa. */
  const [refreshTick, setRefreshTick] = useState(0)
  const review = useReviewUpload(hocSinhUploadConfig, undefined, () => setRefreshTick((t) => t + 1))

  const allRows = useMemo(() => Object.values(getHocSinhStore()).flat(), [refreshTick])

  const lopOptions = useMemo(() => Array.from(new Set(allRows.map((row) => row.lop))).sort(), [allRows])
  const khoiOptions = useMemo(() => Array.from(new Set(allRows.map((row) => row.khoi))).sort(), [allRows])

  const [filters, setFilters] = useState<DanhSachFilters>(FILTER_DEFAULTS)
  const [draft, setDraft] = useFilterDraft<DanhSachFilters>(filters)

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (!row.maHocSinh.toLowerCase().includes(q) && !row.hoTen.toLowerCase().includes(q)) return false
      }
      if (filters.lop !== TAT_CA && row.lop !== filters.lop) return false
      if (filters.khoi !== TAT_CA && row.khoi !== filters.khoi) return false
      if (filters.nienKhoa !== TAT_CA && row.nienKhoa !== filters.nienKhoa) return false
      return true
    })
  }, [allRows, filters])

  return (
    <div className={styles.root}>
      {review.confirmSummary && (
        <MessageBar intent="success">
          <MessageBarBody>
            Đã đồng bộ thành công {review.confirmSummary.soDong} dòng. Đã tải về file: {review.confirmSummary.tenFileExport}
          </MessageBarBody>
        </MessageBar>
      )}

      <FilterBar
        onApply={() => setFilters(draft)}
        onReset={() => {
          setDraft(FILTER_DEFAULTS)
          setFilters(FILTER_DEFAULTS)
        }}
      >
        <Field label="Tìm kiếm">
          <Input value={draft.q} onChange={(_, data) => setDraft({ q: data.value })} placeholder="Mã HS hoặc họ tên..." />
        </Field>
        <Field label="Lớp">
          <Dropdown
            value={draft.lop === TAT_CA ? 'Tất cả' : draft.lop}
            selectedOptions={[draft.lop]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ lop: data.optionValue })}
          >
            <Option value={TAT_CA}>Tất cả</Option>
            {lopOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        </Field>
        <Field label="Khối">
          <Dropdown
            value={draft.khoi === TAT_CA ? 'Tất cả' : draft.khoi}
            selectedOptions={[draft.khoi]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ khoi: data.optionValue })}
          >
            <Option value={TAT_CA}>Tất cả</Option>
            {khoiOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        </Field>
        <Field label="Niên khoá">
          <Dropdown
            value={draft.nienKhoa === TAT_CA ? 'Tất cả' : draft.nienKhoa}
            selectedOptions={[draft.nienKhoa]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ nienKhoa: data.optionValue })}
          >
            <Option value={TAT_CA}>Tất cả</Option>
            {nienKhoaOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        </Field>
      </FilterBar>

      <Card className={styles.tableCard}>
        <div className={styles.uploadRow}>
          <UploadActionsRow config={hocSinhUploadConfig} processing={review.processing} onFileSelected={review.handleFile} />
        </div>

        {filteredRows.length === 0 ? (
          <MessageBar intent="info">
            <MessageBarBody>Chưa có dữ liệu khớp bộ lọc.</MessageBarBody>
          </MessageBar>
        ) : (
          <div className={styles.tableScroll}>
            <DataGrid items={filteredRows} columns={columns} getRowId={(item) => `${item.nienKhoa}-${item.maHocSinh}`} resizableColumns>
              <TableHeaderRow />
              <DataGridBody<DisplayRow>>
                {({ item, rowId }) => (
                  <DataGridRow<DisplayRow> key={rowId}>
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </div>
        )}
      </Card>

      <ReviewUploadDialog
        config={hocSinhUploadConfig}
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
