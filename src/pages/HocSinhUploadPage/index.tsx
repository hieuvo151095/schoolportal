import {
  Button,
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
  Title2,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { useMemo, useState } from 'react'
import { useAppToast } from '../../components/AppToaster'
import { DongBoStatusBadge } from '../../components/DongBoStatusBadge'
import { FilterBar } from '../../components/FilterBar'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { ensureSeededHocSinh, getHocSinhStore } from '../../storage/hocSinh'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import type { HocSinhRow } from '../../types/domain'
import { AddRecordDialog } from '../../upload-engine/AddRecordDialog'
import { ReviewUploadDialog } from '../../upload-engine/ReviewUploadDialog'
import { UploadActionsRow } from '../../upload-engine/UploadActionsRow'
import { useReviewUpload } from '../../upload-engine/useReviewUpload'
import { getNienKhoaOptions } from '../../utils/nienKhoa'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { DongBoDialog } from '../DongBoPage/DongBoDialog'
import { useDongBoDialog } from '../DongBoPage/useDongBoDialog'
import { hocSinhColumns } from './columns'
import { hocSinhUploadConfig } from './hocSinhUploadConfig'

const TAT_CA = 'all'
const CHUA_DONG_BO = 'false'

type DisplayRow = HocSinhRow

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalL,
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
  dongBo: string
}

const FILTER_DEFAULTS: DanhSachFilters = { q: '', lop: TAT_CA, khoi: TAT_CA, nienKhoa: TAT_CA, dongBo: TAT_CA }

export function HocSinhUploadPage() {
  const styles = useStyles()
  const hoSo = getHoSoTruong()
  const nienKhoaOptions = getNienKhoaOptions()
  const { showSuccess } = useAppToast()

  if (hoSo) ensureSeededHocSinh(hoSo.nienKhoa)

  /** Bump sau mỗi lần lưu dữ liệu thành công để allRows đọc lại storage. */
  const [refreshTick, setRefreshTick] = useState(0)
  const review = useReviewUpload(hocSinhUploadConfig, undefined, () => setRefreshTick((t) => t + 1))
  const dongBoDialog = useDongBoDialog({ onSynced: () => setRefreshTick((t) => t + 1) })
  const [addOpen, setAddOpen] = useState(false)

  const allRows = useMemo(() => Object.values(getHocSinhStore()).flat(), [refreshTick])

  const lopOptions = useMemo(() => Array.from(new Set(allRows.map((row) => row.lop))).sort(), [allRows])
  const khoiOptions = useMemo(() => Array.from(new Set(allRows.map((row) => row.khoi))).sort(), [allRows])

  const [filters, setFilters] = useState<DanhSachFilters>(FILTER_DEFAULTS)
  const [draft, setDraft] = useFilterDraft<DanhSachFilters>(filters)

  const columns = useMemo<TableColumnDefinition<DisplayRow>[]>(
    () => [
      ...hocSinhColumns,
      createTableColumn<DisplayRow>({
        columnId: 'daDongBo',
        renderHeaderCell: () => 'Đồng bộ',
        renderCell: (item) => <DongBoStatusBadge daDongBo={item.daDongBo} />,
      }),
    ],
    [],
  )

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (!row.maHocSinh.toLowerCase().includes(q) && !row.hoTen.toLowerCase().includes(q)) return false
      }
      if (filters.lop !== TAT_CA && row.lop !== filters.lop) return false
      if (filters.khoi !== TAT_CA && row.khoi !== filters.khoi) return false
      if (filters.nienKhoa !== TAT_CA && row.nienKhoa !== filters.nienKhoa) return false
      if (filters.dongBo !== TAT_CA && String(row.daDongBo) !== filters.dongBo) return false
      return true
    })
  }, [allRows, filters])

  return (
    <div className={styles.root}>
      <Title2>Học sinh</Title2>

      {review.confirmSummary && (
        <MessageBar intent="success">
          <MessageBarBody>Đã lưu thành công {review.confirmSummary.soDong} dòng.</MessageBarBody>
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
        <Field label="Đồng bộ">
          <Dropdown
            value={draft.dongBo === TAT_CA ? 'Tất cả' : draft.dongBo === CHUA_DONG_BO ? 'Chưa đồng bộ' : 'Hoàn thành'}
            selectedOptions={[draft.dongBo]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ dongBo: data.optionValue })}
          >
            <Option value={TAT_CA}>Tất cả</Option>
            <Option value="true">Hoàn thành</Option>
            <Option value={CHUA_DONG_BO}>Chưa đồng bộ</Option>
          </Dropdown>
        </Field>
      </FilterBar>

      <Card className={styles.tableCard}>
        <div className={styles.uploadRow}>
          {filters.dongBo === CHUA_DONG_BO && (
            <Button appearance="secondary" onClick={dongBoDialog.openDialog}>
              Bắt đầu đồng bộ
            </Button>
          )}
          <UploadActionsRow config={hocSinhUploadConfig} processing={review.processing} onFileSelected={review.handleFile} />
          <Button appearance="secondary" onClick={() => setAddOpen(true)}>
            Thêm mới
          </Button>
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

      <DongBoDialog
        open={dongBoDialog.open}
        onClose={dongBoDialog.closeDialog}
        pending={dongBoDialog.pending}
        readOnly={false}
        onConfirm={dongBoDialog.confirm}
        defaultTab="hocSinh"
      />

      <AddRecordDialog
        config={hocSinhUploadConfig}
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={() => {
          setRefreshTick((t) => t + 1)
          showSuccess('Đã thêm mới dữ liệu thành công')
        }}
      />
    </div>
  )
}
