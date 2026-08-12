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
  Title2,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { useMemo, useState } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { RangeFilterField } from '../../components/RangeFilterField'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { ensureSeededDanhMucPhi, getDanhMucPhiStore } from '../../storage/danhMucPhi'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import type { DonViTinh } from '../../types/domain'
import { computeTrangThaiKhoanThu, type TrangThaiKhoanThu } from '../../utils/danhMucThu'
import { COL_MA, COL_NGAY, COL_STT, COL_TEN, COL_TRANG_THAI_RONG } from '../../utils/tableColumnSizes'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { danhMucPhiColumns, type DanhMucPhiDisplayRow } from './columns'

const TAT_CA = 'all'

const TRANG_THAI_LIST: TrangThaiKhoanThu[] = ['Đang hoạt động', 'Ngưng hoạt động']

/** Rỗng hoặc chọn đủ tất cả đơn vị tính đều tương đương "không lọc" — hiện "Tất cả" cho cả 2
 * case, giống pattern trangThai của HoaDonUploadPage. */
function donViTinhDisplayValue(selected: DonViTinh[], allOptions: DonViTinh[]): string {
  if (selected.length === 0 || selected.length === allOptions.length) return 'Tất cả'
  if (selected.length === 1) return selected[0]
  return `Đã chọn ${selected.length} mục`
}

const columnSizingOptions = {
  stt: COL_STT,
  maPhi: COL_MA,
  tenPhi: COL_TEN,
  donViTinh: COL_MA,
  ngayBatDau: COL_NGAY,
  ngayKetThuc: COL_NGAY,
  thamChieuPhapLy: COL_TEN,
  trangThai: COL_TRANG_THAI_RONG,
}

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
})

interface DanhSachFilters {
  q: string
  donViTinh: DonViTinh[]
  ngayKetThucTu: string
  ngayKetThucDen: string
  trangThai: string
}

function buildFilterDefaults(donViTinhOptions: DonViTinh[]): DanhSachFilters {
  return {
    q: '',
    donViTinh: donViTinhOptions,
    ngayKetThucTu: '',
    ngayKetThucDen: '',
    trangThai: TAT_CA,
  }
}

/** Danh mục thu — THUẦN XEM (không còn CRUD phía trường, xem storage/danhMucPhi.ts). Dữ liệu
 * mirror từ Sở, trường chỉ tra cứu Mã phí/Tham chiếu pháp lý khi cần đối chiếu. */
export function DanhMucPhiUploadPage() {
  const styles = useStyles()
  const hoSo = getHoSoTruong()

  if (hoSo) ensureSeededDanhMucPhi(hoSo.nienKhoa)

  const allRows = useMemo(() => Object.values(getDanhMucPhiStore()).flat(), [])

  /** Danh sách Đơn vị tính lấy từ dữ liệu thực tế đang có, không phải enum cố định — để bộ lọc
   * luôn khớp với dữ liệu mirror từ Sở. */
  const donViTinhOptions = useMemo(
    () => Array.from(new Set(allRows.map((row) => row.donViTinh))).sort(),
    [allRows],
  )

  const [filters, setFilters] = useState<DanhSachFilters>(() => buildFilterDefaults(donViTinhOptions))
  const [draft, setDraft] = useFilterDraft<DanhSachFilters>(filters)

  const filteredRows = useMemo<DanhMucPhiDisplayRow[]>(() => {
    const rows = allRows.filter((row) => {
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (!row.maPhi.toLowerCase().includes(q) && !row.tenPhi.toLowerCase().includes(q)) return false
      }
      if (filters.donViTinh.length > 0 && !filters.donViTinh.includes(row.donViTinh)) return false
      // ngayKetThuc null = chưa có ngày kết thúc (vô thời hạn) — luôn hiện dù lọc theo ngày nào.
      if (filters.ngayKetThucTu && row.ngayKetThuc && row.ngayKetThuc < filters.ngayKetThucTu) return false
      if (filters.ngayKetThucDen && row.ngayKetThuc && row.ngayKetThuc > filters.ngayKetThucDen) return false
      if (filters.trangThai !== TAT_CA && computeTrangThaiKhoanThu(row) !== filters.trangThai) return false
      return true
    })
    return rows.map((row, index) => ({ ...row, stt: index + 1 }))
  }, [allRows, filters])

  return (
    <div className={styles.root}>
      <Title2>Danh mục thu</Title2>

      <FilterBar
        onApply={() => setFilters(draft)}
        onReset={() => {
          const resetDefaults = buildFilterDefaults(donViTinhOptions)
          setDraft(resetDefaults)
          setFilters(resetDefaults)
        }}
      >
        <Field label="Tìm kiếm">
          <Input value={draft.q} onChange={(_, data) => setDraft({ q: data.value })} placeholder="Mã thu hoặc tên danh mục..." />
        </Field>
        <Field label="Đơn vị tính">
          <Dropdown
            multiselect
            value={donViTinhDisplayValue(draft.donViTinh, donViTinhOptions)}
            selectedOptions={draft.donViTinh.length === donViTinhOptions.length ? [TAT_CA, ...draft.donViTinh] : draft.donViTinh}
            onOptionSelect={(_, data) => {
              if (data.optionValue === TAT_CA) {
                setDraft({ donViTinh: data.selectedOptions.includes(TAT_CA) ? [...donViTinhOptions] : [] })
                return
              }
              setDraft({ donViTinh: data.selectedOptions.filter((v) => v !== TAT_CA) as DonViTinh[] })
            }}
          >
            <Option value={TAT_CA}>Tất cả</Option>
            {donViTinhOptions.map((option) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))}
          </Dropdown>
        </Field>
        <RangeFilterField
          label="Ngày kết thúc"
          from={<Input type="date" value={draft.ngayKetThucTu} onChange={(_, data) => setDraft({ ngayKetThucTu: data.value })} />}
          to={<Input type="date" value={draft.ngayKetThucDen} onChange={(_, data) => setDraft({ ngayKetThucDen: data.value })} />}
        />
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
              columns={danhMucPhiColumns}
              getRowId={(item) => item.maPhi}
              resizableColumns
              columnSizingOptions={columnSizingOptions}
            >
              <TableHeaderRow />
              <DataGridBody<DanhMucPhiDisplayRow>>
                {({ item, rowId }) => (
                  <DataGridRow<DanhMucPhiDisplayRow> key={rowId}>
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
