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
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { useMemo, useState } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { RangeFilterField } from '../../components/RangeFilterField'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { ensureSeededHoaDon, getHoaDonStore } from '../../storage/hoaDon'
import { getHocSinhByNienKhoa } from '../../storage/hocSinh'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import type { HinhThucThanhToan, HoaDonRow, TrangThaiHoaDon } from '../../types/domain'
import { formatCurrency, formatDate } from '../../utils/date'
import { DEFAULT_KY, getKyOptions } from '../../utils/ky'
import { COL_HANH_DONG, COL_NGUOI_KEP, COL_TRANG_THAI_RONG } from '../../utils/tableColumnSizes'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { HoaDonBreakdownDialog } from './HoaDonBreakdownDialog'
import { ReminderBanner } from './ReminderBanner'

const TAT_CA = 'all'

const HINH_THUC_THANH_TOAN_LIST: HinhThucThanhToan[] = ['Tiền mặt', 'Chuyển khoản', 'Ví điện tử', 'QR Code']
const TRANG_THAI_LIST: TrangThaiHoaDon[] = ['Đã thanh toán', 'Thanh toán một phần', 'Chưa thanh toán']

const TRANG_THAI_COLOR: Record<TrangThaiHoaDon, 'success' | 'warning' | 'informative'> = {
  'Đã thanh toán': 'success',
  'Thanh toán một phần': 'warning',
  'Chưa thanh toán': 'informative',
}

type DisplayRow = HoaDonRow & { hoTenHocSinh: string; lop: string }

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
  nowrapCell: {
    whiteSpace: 'nowrap',
  },
})

const columnSizingOptions = {
  trangThai: COL_TRANG_THAI_RONG,
  taoXacNhan: COL_NGUOI_KEP,
  danhMucPhi: COL_HANH_DONG,
}

interface DanhSachFilters {
  q: string
  lop: string
  ky: string
  trangThai: string
  hinhThuc: string
  hanTu: string
  hanDen: string
  ngayTtTu: string
  ngayTtDen: string
}

const FILTER_DEFAULTS: DanhSachFilters = {
  q: '',
  lop: TAT_CA,
  ky: TAT_CA,
  trangThai: TAT_CA,
  hinhThuc: TAT_CA,
  hanTu: '',
  hanDen: '',
  ngayTtTu: '',
  ngayTtDen: '',
}

function buildColumns(onXemChiTiet: (row: DisplayRow) => void): TableColumnDefinition<DisplayRow>[] {
  return [
    createTableColumn<DisplayRow>({ columnId: 'soHoaDon', renderHeaderCell: () => 'Mã HĐ', renderCell: (item) => item.soHoaDon }),
    createTableColumn<DisplayRow>({
      columnId: 'hocSinh',
      renderHeaderCell: () => 'Học sinh',
      renderCell: (item) => `${item.hoTenHocSinh || item.maHocSinh} (${item.maHocSinh})`,
    }),
    createTableColumn<DisplayRow>({ columnId: 'ky', renderHeaderCell: () => 'Kỳ', renderCell: (item) => item.ky }),
    createTableColumn<DisplayRow>({
      columnId: 'hanThanhToan',
      renderHeaderCell: () => 'Hạn thanh toán',
      renderCell: (item) => formatDate(item.hanThanhToan),
    }),
    createTableColumn<DisplayRow>({
      columnId: 'soTien',
      renderHeaderCell: () => 'Số tiền',
      renderCell: (item) => formatCurrency(item.soTien),
    }),
    createTableColumn<DisplayRow>({
      columnId: 'hinhThucThanhToan',
      renderHeaderCell: () => 'Hình thức thanh toán',
      renderCell: (item) => item.hinhThucThanhToan ?? '—',
    }),
    createTableColumn<DisplayRow>({
      columnId: 'ngayThanhToan',
      renderHeaderCell: () => 'Ngày thanh toán',
      renderCell: (item) => (item.ngayThanhToan ? formatDate(item.ngayThanhToan) : '—'),
    }),
    createTableColumn<DisplayRow>({
      columnId: 'trangThai',
      renderHeaderCell: () => 'Trạng thái',
      renderCell: (item) => (
        <Badge appearance="tint" color={TRANG_THAI_COLOR[item.trangThai]} style={{ whiteSpace: 'nowrap' }}>
          {item.trangThai}
        </Badge>
      ),
    }),
    createTableColumn<DisplayRow>({
      columnId: 'daTra',
      renderHeaderCell: () => 'Số tiền đã trả',
      renderCell: (item) => (item.trangThai === 'Thanh toán một phần' ? formatCurrency(item.daTra) : '—'),
    }),
    createTableColumn<DisplayRow>({
      columnId: 'taoXacNhan',
      renderHeaderCell: () => 'Tạo bởi / Xác nhận bởi',
      renderCell: (item) => (
        <span style={{ whiteSpace: 'nowrap' }}>
          {item.taoBoi} / {item.xacNhanBoi ?? '—'}
        </span>
      ),
    }),
    createTableColumn<DisplayRow>({
      columnId: 'danhMucPhi',
      renderHeaderCell: () => 'Danh mục phí',
      renderCell: (item) => (
        <Button appearance="outline" size="small" onClick={() => onXemChiTiet(item)}>
          Xem chi tiết
        </Button>
      ),
    }),
  ]
}

export function DanhSachTab() {
  const styles = useStyles()
  const kyOptions = getKyOptions()
  const [selectedRow, setSelectedRow] = useState<DisplayRow | null>(null)
  const columns = useMemo(() => buildColumns(setSelectedRow), [setSelectedRow])

  ensureSeededHoaDon(DEFAULT_KY)

  const hoSo = getHoSoTruong()
  const hocSinhLookup = useMemo(() => {
    const map = new Map<string, { hoTen: string; lop: string }>()
    if (hoSo) {
      for (const hs of getHocSinhByNienKhoa(hoSo.nienKhoa)) {
        map.set(hs.maHocSinh, { hoTen: hs.hoTen, lop: hs.lop })
      }
    }
    return map
  }, [hoSo])

  const allRows = useMemo(() => {
    const store = getHoaDonStore()
    return Object.values(store)
      .flat()
      .map((row) => ({
        ...row,
        hoTenHocSinh: hocSinhLookup.get(row.maHocSinh)?.hoTen ?? '',
        lop: hocSinhLookup.get(row.maHocSinh)?.lop ?? '',
      }))
  }, [hocSinhLookup])

  const lopOptions = useMemo(
    () => Array.from(new Set(allRows.map((row) => row.lop).filter(Boolean))).sort(),
    [allRows],
  )

  const [filters, setFilters] = useState<DanhSachFilters>(FILTER_DEFAULTS)
  const [draft, setDraft] = useFilterDraft<DanhSachFilters>(filters)

  const filteredRows = useMemo(() => {
    return allRows.filter((row) => {
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (
          !row.soHoaDon.toLowerCase().includes(q) &&
          !row.maHocSinh.toLowerCase().includes(q) &&
          !row.hoTenHocSinh.toLowerCase().includes(q)
        )
          return false
      }
      if (filters.lop !== TAT_CA && row.lop !== filters.lop) return false
      if (filters.ky !== TAT_CA && row.ky !== filters.ky) return false
      if (filters.trangThai !== TAT_CA && row.trangThai !== filters.trangThai) return false
      if (filters.hinhThuc !== TAT_CA && row.hinhThucThanhToan !== filters.hinhThuc) return false
      if (filters.hanTu && row.hanThanhToan < filters.hanTu) return false
      if (filters.hanDen && row.hanThanhToan > filters.hanDen) return false
      if (filters.ngayTtTu && (!row.ngayThanhToan || row.ngayThanhToan < filters.ngayTtTu)) return false
      if (filters.ngayTtDen && (!row.ngayThanhToan || row.ngayThanhToan > filters.ngayTtDen)) return false
      return true
    })
  }, [allRows, filters])

  return (
    <div className={styles.root}>
      <ReminderBanner />

      <FilterBar
        onApply={() => setFilters(draft)}
        onReset={() => {
          setDraft(FILTER_DEFAULTS)
          setFilters(FILTER_DEFAULTS)
        }}
      >
        <Field label="Tìm kiếm">
          <Input value={draft.q} onChange={(_, data) => setDraft({ q: data.value })} placeholder="Mã HĐ, mã HS hoặc tên..." />
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
        <Field label="Kỳ">
          <Dropdown
            value={draft.ky === TAT_CA ? 'Tất cả' : draft.ky}
            selectedOptions={[draft.ky]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ ky: data.optionValue })}
          >
            <Option value={TAT_CA}>Tất cả</Option>
            {kyOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        </Field>
        <Field label="Trạng thái">
          <Dropdown
            value={draft.trangThai === TAT_CA ? 'Tất cả' : draft.trangThai}
            selectedOptions={[draft.trangThai]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ trangThai: data.optionValue })}
          >
            <Option value={TAT_CA}>Tất cả</Option>
            {TRANG_THAI_LIST.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        </Field>
        <Field label="Hình thức thanh toán">
          <Dropdown
            value={draft.hinhThuc === TAT_CA ? 'Tất cả' : draft.hinhThuc}
            selectedOptions={[draft.hinhThuc]}
            onOptionSelect={(_, data) => data.optionValue && setDraft({ hinhThuc: data.optionValue })}
          >
            <Option value={TAT_CA}>Tất cả</Option>
            {HINH_THUC_THANH_TOAN_LIST.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        </Field>
        <RangeFilterField
          label="Hạn thanh toán"
          from={<Input type="date" value={draft.hanTu} onChange={(_, data) => setDraft({ hanTu: data.value })} />}
          to={<Input type="date" value={draft.hanDen} onChange={(_, data) => setDraft({ hanDen: data.value })} />}
        />
        <RangeFilterField
          label="Ngày thanh toán"
          from={<Input type="date" value={draft.ngayTtTu} onChange={(_, data) => setDraft({ ngayTtTu: data.value })} />}
          to={<Input type="date" value={draft.ngayTtDen} onChange={(_, data) => setDraft({ ngayTtDen: data.value })} />}
        />
      </FilterBar>

      <Card className={styles.tableCard}>
        {filteredRows.length === 0 ? (
          <MessageBar intent="info">
            <MessageBarBody>Chưa có dữ liệu khớp bộ lọc.</MessageBarBody>
          </MessageBar>
        ) : (
          <div className={styles.tableScroll}>
            <DataGrid
              items={filteredRows}
              columns={columns}
              getRowId={(item) => `${item.ky}-${item.soHoaDon}`}
              resizableColumns
              columnSizingOptions={columnSizingOptions}
            >
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

      <HoaDonBreakdownDialog row={selectedRow} onClose={() => setSelectedRow(null)} />
    </div>
  )
}
