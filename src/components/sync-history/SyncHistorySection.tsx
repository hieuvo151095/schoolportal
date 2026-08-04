import {
  Badge,
  Body1,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  Dropdown,
  Field,
  Input,
  Option,
  Subtitle2,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { getSession } from '../../storage/session'
import { ensureSeeded, getLichSuDongBoByLoai } from '../../storage/lichSuDongBo'
import type { LichSuDongBoEntry, LoaiDuLieuDongBo, TrangThaiDongBo } from '../../types/domain'
import { formatDateTime } from '../../utils/date'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { HISTORY_FILTER_DEFAULTS, useHistoryFilters, type HistoryFilters } from './useHistoryFilters'
import { TableHeaderRow } from '../TableHeaderRow'

const TRANG_THAI_LIST: TrangThaiDongBo[] = ['Thành công', 'Thành công có cảnh báo', 'Thất bại']

const TRANG_THAI_COLOR: Record<TrangThaiDongBo, 'success' | 'warning' | 'danger'> = {
  'Thành công': 'success',
  'Thành công có cảnh báo': 'warning',
  'Thất bại': 'danger',
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  tableScroll: {
    overflowX: 'auto',
  },
  contextField: {
    minWidth: '200px',
  },
})

interface SyncHistorySectionProps {
  loaiDuLieu: LoaiDuLieuDongBo
  contextLabel: string
  contextOptions: string[]
  successCountLabel: string
}

export function SyncHistorySection({
  loaiDuLieu,
  contextLabel,
  contextOptions,
  successCountLabel,
}: SyncHistorySectionProps) {
  const styles = useStyles()

  const session = getSession()
  if (session) ensureSeeded(loaiDuLieu, session.maTruong)
  const entries = getLichSuDongBoByLoai(loaiDuLieu)

  const { filters, apply, reset } = useHistoryFilters()
  const [draft, setDraft] = useFilterDraft<HistoryFilters>(filters)

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
        renderHeaderCell: () => 'Số dòng lỗi',
        renderCell: (item) => item.soDongLoi,
      }),
      createTableColumn<LichSuDongBoEntry>({
        columnId: 'trangThai',
        renderHeaderCell: () => 'Trạng thái',
        renderCell: (item) => (
          <Badge appearance="filled" color={TRANG_THAI_COLOR[item.trangThai]}>
            {item.trangThai}
          </Badge>
        ),
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
        if (filters.trangThai.length > 0 && !filters.trangThai.includes(entry.trangThai)) return false
        if (filters.tuNgay && entry.thoiDiem < filters.tuNgay) return false
        if (filters.denNgay && entry.thoiDiem > `${filters.denNgay}T23:59:59`) return false
        return true
      })
      .sort((a, b) => b.thoiDiem.localeCompare(a.thoiDiem))
  }, [entries, filters])

  return (
    <div className={styles.root}>
      <Subtitle2>Lịch sử đồng bộ</Subtitle2>

      <FilterBar onApply={() => apply(draft)} onReset={() => { setDraft(HISTORY_FILTER_DEFAULTS); reset() }}>
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

        <Field label="Trạng thái" className={styles.contextField}>
          <Dropdown
            multiselect
            value={draft.trangThai.length === 0 ? 'Tất cả' : draft.trangThai.join(', ')}
            selectedOptions={draft.trangThai}
            onOptionSelect={(_, data) => setDraft({ trangThai: data.selectedOptions as TrangThaiDongBo[] })}
          >
            {TRANG_THAI_LIST.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        </Field>

        <Field label="Từ ngày">
          <Input type="date" value={draft.tuNgay} onChange={(_, data) => setDraft({ tuNgay: data.value })} />
        </Field>

        <Field label="Đến ngày">
          <Input type="date" value={draft.denNgay} onChange={(_, data) => setDraft({ denNgay: data.value })} />
        </Field>
      </FilterBar>

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
              soDongLoi: { minWidth: 80, defaultWidth: 90 },
              trangThai: { minWidth: 160, defaultWidth: 180 },
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
    </div>
  )
}
