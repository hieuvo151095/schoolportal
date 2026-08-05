import {
  Badge,
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
  Tooltip,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { InfoRegular } from '@fluentui/react-icons'
import { useMemo, useState } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { RangeFilterField } from '../../components/RangeFilterField'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { ensureSeededDanhMucPhi } from '../../storage/danhMucPhi'
import { ensureSeededDongBoLichSu, getDongBoLichSu } from '../../storage/dongBoLichSu'
import { ensureSeededHoaDon } from '../../storage/hoaDon'
import { ensureSeededHocSinh } from '../../storage/hocSinh'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import type { DongBoLichSuEntry, TrangThaiDongBo } from '../../types/domain'
import { formatDateTime } from '../../utils/date'
import { DEFAULT_KY } from '../../utils/ky'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { DongBoDialog } from './DongBoDialog'
import { resolveChiTiet, type PendingData } from './dongBoLogic'
import { useDongBoDialog } from './useDongBoDialog'

const TAT_CA = 'all'
const TRANG_THAI_LIST: TrangThaiDongBo[] = ['Thành công', 'Thất bại']

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
  actionRow: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  trangThaiCell: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
})

function trangThaiFilterDisplay(selected: TrangThaiDongBo[]): string {
  if (selected.length === 0 || selected.length === TRANG_THAI_LIST.length) return 'Tất cả'
  if (selected.length === 1) return selected[0]
  return `Đã chọn ${selected.length} mục`
}

interface HistoryFilters {
  q: string
  trangThai: TrangThaiDongBo[]
  tuNgay: string
  denNgay: string
}

const FILTER_DEFAULTS: HistoryFilters = { q: '', trangThai: [], tuNgay: '', denNgay: '' }

const EMPTY_PENDING: PendingData = { danhMucPhi: [], hocSinh: [], hoaDon: [] }

export function DongBoPage() {
  const styles = useStyles()
  const hoSo = getHoSoTruong()

  if (hoSo) {
    ensureSeededDanhMucPhi(hoSo.nienKhoa)
    ensureSeededHocSinh(hoSo.nienKhoa)
  }
  ensureSeededHoaDon(DEFAULT_KY)
  ensureSeededDongBoLichSu()

  const [refreshTick, setRefreshTick] = useState(0)
  const entries = useMemo(() => getDongBoLichSu(), [refreshTick])

  const [filters, setFilters] = useState<HistoryFilters>(FILTER_DEFAULTS)
  const [draft, setDraft] = useFilterDraft<HistoryFilters>(filters)

  const dongBoDialog = useDongBoDialog({ onSynced: () => setRefreshTick((t) => t + 1) })
  const [viewEntry, setViewEntry] = useState<DongBoLichSuEntry | null>(null)

  const pendingForView = useMemo(() => (viewEntry ? resolveChiTiet(viewEntry.chiTietMa) : EMPTY_PENDING), [viewEntry])

  const filteredEntries = useMemo(() => {
    return entries
      .filter((entry) => {
        if (filters.q && !entry.nguoiThucHien.toLowerCase().includes(filters.q.toLowerCase())) return false
        if (filters.trangThai.length > 0 && !filters.trangThai.includes(entry.trangThai)) return false
        if (filters.tuNgay && entry.thoiDiem < filters.tuNgay) return false
        if (filters.denNgay && entry.thoiDiem > `${filters.denNgay}T23:59:59`) return false
        return true
      })
      .sort((a, b) => b.thoiDiem.localeCompare(a.thoiDiem))
  }, [entries, filters])

  const columns = useMemo<TableColumnDefinition<DongBoLichSuEntry>[]>(
    () => [
      createTableColumn<DongBoLichSuEntry>({
        columnId: 'thoiDiem',
        renderHeaderCell: () => 'Thời gian',
        renderCell: (item) => formatDateTime(item.thoiDiem),
      }),
      createTableColumn<DongBoLichSuEntry>({
        columnId: 'danhMucPhi',
        renderHeaderCell: () => 'Danh mục phí',
        renderCell: (item) => (item.soLuongDaChon.danhMucPhi > 0 ? item.soLuongDaChon.danhMucPhi : '—'),
      }),
      createTableColumn<DongBoLichSuEntry>({
        columnId: 'hocSinh',
        renderHeaderCell: () => 'Học sinh',
        renderCell: (item) => (item.soLuongDaChon.hocSinh > 0 ? item.soLuongDaChon.hocSinh : '—'),
      }),
      createTableColumn<DongBoLichSuEntry>({
        columnId: 'hoaDon',
        renderHeaderCell: () => 'Hoá đơn',
        renderCell: (item) => (item.soLuongDaChon.hoaDon > 0 ? item.soLuongDaChon.hoaDon : '—'),
      }),
      createTableColumn<DongBoLichSuEntry>({
        columnId: 'nguoiThucHien',
        renderHeaderCell: () => 'Người thực hiện',
        renderCell: (item) => item.nguoiThucHien,
      }),
      createTableColumn<DongBoLichSuEntry>({
        columnId: 'trangThai',
        renderHeaderCell: () => 'Trạng thái',
        renderCell: (item) => (
          <span className={styles.trangThaiCell}>
            <Badge appearance="filled" color={item.trangThai === 'Thành công' ? 'success' : 'danger'}>
              {item.trangThai}
            </Badge>
            {item.trangThai === 'Thất bại' && item.lyDoThatBai && (
              <Tooltip content={item.lyDoThatBai} relationship="label">
                <InfoRegular />
              </Tooltip>
            )}
          </span>
        ),
      }),
      createTableColumn<DongBoLichSuEntry>({
        columnId: 'chiTiet',
        renderHeaderCell: () => 'Chi tiết',
        renderCell: (item) => (
          <Button appearance="outline" size="small" onClick={() => setViewEntry(item)}>
            Chi tiết
          </Button>
        ),
      }),
    ],
    [styles.trangThaiCell],
  )

  return (
    <div className={styles.root}>
      <Title2>Đồng bộ</Title2>

      <FilterBar
        onApply={() => setFilters(draft)}
        onReset={() => {
          setDraft(FILTER_DEFAULTS)
          setFilters(FILTER_DEFAULTS)
        }}
      >
        <Field label="Tìm kiếm">
          <Input value={draft.q} onChange={(_, data) => setDraft({ q: data.value })} placeholder="Người thực hiện..." />
        </Field>
        <Field label="Trạng thái">
          <Dropdown
            multiselect
            value={trangThaiFilterDisplay(draft.trangThai)}
            selectedOptions={draft.trangThai.length === TRANG_THAI_LIST.length ? [TAT_CA, ...draft.trangThai] : draft.trangThai}
            onOptionSelect={(_, data) => {
              if (data.optionValue === TAT_CA) {
                setDraft({ trangThai: data.selectedOptions.includes(TAT_CA) ? [...TRANG_THAI_LIST] : [] })
                return
              }
              setDraft({ trangThai: data.selectedOptions.filter((v) => v !== TAT_CA) as TrangThaiDongBo[] })
            }}
          >
            <Option value={TAT_CA}>Tất cả</Option>
            {TRANG_THAI_LIST.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        </Field>
        <RangeFilterField
          label="Thời gian đồng bộ"
          from={<Input type="date" value={draft.tuNgay} onChange={(_, data) => setDraft({ tuNgay: data.value })} />}
          to={<Input type="date" value={draft.denNgay} onChange={(_, data) => setDraft({ denNgay: data.value })} />}
        />
      </FilterBar>

      <Card className={styles.tableCard}>
        <div className={styles.actionRow}>
          <Button appearance="primary" onClick={dongBoDialog.openDialog}>
            Đồng bộ dữ liệu
          </Button>
        </div>

        {filteredEntries.length === 0 ? (
          <MessageBar intent="info">
            <MessageBarBody>Không có lần đồng bộ nào khớp bộ lọc.</MessageBarBody>
          </MessageBar>
        ) : (
          <div className={styles.tableScroll}>
            <DataGrid items={filteredEntries} columns={columns} getRowId={(item) => item.id} resizableColumns>
              <TableHeaderRow />
              <DataGridBody<DongBoLichSuEntry>>
                {({ item, rowId }) => (
                  <DataGridRow<DongBoLichSuEntry> key={rowId}>
                    {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                  </DataGridRow>
                )}
              </DataGridBody>
            </DataGrid>
          </div>
        )}
      </Card>

      <DongBoDialog
        open={dongBoDialog.open}
        onClose={dongBoDialog.closeDialog}
        pending={dongBoDialog.pending}
        readOnly={false}
        onConfirm={dongBoDialog.confirm}
      />

      {viewEntry && (
        <DongBoDialog
          open={!!viewEntry}
          onClose={() => setViewEntry(null)}
          pending={pendingForView}
          readOnly
          headerInfo={viewEntry}
        />
      )}
    </div>
  )
}
