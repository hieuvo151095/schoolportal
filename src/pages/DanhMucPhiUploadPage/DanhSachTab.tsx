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
import { ensureSeededDanhMucPhi, getDanhMucPhiStore } from '../../storage/danhMucPhi'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import type { KhoanPhiRow, NguonThu, NhomPhi } from '../../types/domain'
import { formatCurrency } from '../../utils/date'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { getNienKhoaOptions } from '../../utils/nienKhoa'

const NGUON_THU_LIST: NguonThu[] = ['Học phí', 'Dịch vụ', 'Bán trú']
const NHOM_PHI_LIST: NhomPhi[] = ['Thu theo tháng', 'Thu theo năm', 'Thu không định kỳ']
const TAT_CA = 'all'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  tableCard: {
    padding: tokens.spacingHorizontalL,
  },
  tableScroll: {
    overflowX: 'auto',
  },
})

interface DanhSachFilters {
  q: string
  nguonThu: string
  nhomPhi: string
  nienKhoa: string
}

const FILTER_DEFAULTS: DanhSachFilters = { q: '', nguonThu: TAT_CA, nhomPhi: TAT_CA, nienKhoa: TAT_CA }

const columns: TableColumnDefinition<KhoanPhiRow>[] = [
  createTableColumn<KhoanPhiRow>({ columnId: 'maPhi', renderHeaderCell: () => 'Mã Phí', renderCell: (item) => item.maPhi }),
  createTableColumn<KhoanPhiRow>({ columnId: 'tenPhi', renderHeaderCell: () => 'Tên phí', renderCell: (item) => item.tenPhi }),
  createTableColumn<KhoanPhiRow>({
    columnId: 'soTien',
    renderHeaderCell: () => 'Số tiền',
    renderCell: (item) => formatCurrency(item.soTien),
  }),
  createTableColumn<KhoanPhiRow>({ columnId: 'donViTinh', renderHeaderCell: () => 'Đơn vị tính', renderCell: (item) => item.donViTinh }),
  createTableColumn<KhoanPhiRow>({ columnId: 'nguonThu', renderHeaderCell: () => 'Nguồn thu', renderCell: (item) => item.nguonThu }),
  createTableColumn<KhoanPhiRow>({ columnId: 'nhomPhi', renderHeaderCell: () => 'Nhóm phí', renderCell: (item) => item.nhomPhi }),
  createTableColumn<KhoanPhiRow>({ columnId: 'nienKhoa', renderHeaderCell: () => 'Niên khoá', renderCell: (item) => item.nienKhoa }),
  createTableColumn<KhoanPhiRow>({
    columnId: 'thamChieuPhapLy',
    renderHeaderCell: () => 'Tham chiếu pháp lý',
    renderCell: (item) => item.thamChieuPhapLy || '—',
  }),
  createTableColumn<KhoanPhiRow>({ columnId: 'ghiChu', renderHeaderCell: () => 'Ghi chú', renderCell: (item) => item.ghiChu || '—' }),
]

export function DanhSachTab() {
  const styles = useStyles()
  const hoSo = getHoSoTruong()
  const nienKhoaOptions = getNienKhoaOptions()

  if (hoSo) ensureSeededDanhMucPhi(hoSo.nienKhoa)
  const allRows = useMemo(() => Object.values(getDanhMucPhiStore()).flat(), [])

  const [filters, setFilters] = useState<DanhSachFilters>(FILTER_DEFAULTS)
  const [draft, setDraft] = useFilterDraft<DanhSachFilters>(filters)

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (!row.maPhi.toLowerCase().includes(q) && !row.tenPhi.toLowerCase().includes(q)) return false
      }
      if (filters.nguonThu !== TAT_CA && row.nguonThu !== filters.nguonThu) return false
      if (filters.nhomPhi !== TAT_CA && row.nhomPhi !== filters.nhomPhi) return false
      if (filters.nienKhoa !== TAT_CA && row.nienKhoa !== filters.nienKhoa) return false
      return true
    })
  }, [allRows, filters])

  return (
    <div className={styles.root}>
      <FilterBar
        onApply={() => setFilters(draft)}
        onReset={() => {
          setDraft(FILTER_DEFAULTS)
          setFilters(FILTER_DEFAULTS)
        }}
      >
        <Field label="Tìm kiếm">
          <Input value={draft.q} onChange={(_, data) => setDraft({ q: data.value })} placeholder="Mã phí hoặc tên phí..." />
        </Field>
        <Field label="Nguồn thu">
          <Dropdown
            value={draft.nguonThu === TAT_CA ? 'Tất cả' : draft.nguonThu}
            selectedOptions={[draft.nguonThu]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ nguonThu: data.optionValue })}
          >
            <Option value={TAT_CA}>Tất cả</Option>
            {NGUON_THU_LIST.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        </Field>
        <Field label="Nhóm phí">
          <Dropdown
            value={draft.nhomPhi === TAT_CA ? 'Tất cả' : draft.nhomPhi}
            selectedOptions={[draft.nhomPhi]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ nhomPhi: data.optionValue })}
          >
            <Option value={TAT_CA}>Tất cả</Option>
            {NHOM_PHI_LIST.map((option) => (
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
        {filteredRows.length === 0 ? (
          <MessageBar intent="info">
            <MessageBarBody>Chưa có dữ liệu khớp bộ lọc.</MessageBarBody>
          </MessageBar>
        ) : (
          <div className={styles.tableScroll}>
            <DataGrid items={filteredRows} columns={columns} getRowId={(item) => item.maPhi} resizableColumns>
              <TableHeaderRow />
              <DataGridBody<KhoanPhiRow>>
                {({ item, rowId }) => (
                  <DataGridRow<KhoanPhiRow> key={rowId}>
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </div>
        )}
      </Card>
    </div>
  )
}
