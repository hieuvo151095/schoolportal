import {
  Card,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Title2,
  makeStyles,
  tokens,
} from '@fluentui/react-components'
import { useMemo, useState } from 'react'
import { FilterBar } from '../../components/FilterBar'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { ensureSeededDanhMucPhi, getDanhMucPhiStore } from '../../storage/danhMucPhi'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import { COL_MA, COL_NGAY, COL_STT, COL_TEN, COL_TRANG_THAI_RONG } from '../../utils/tableColumnSizes'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { danhMucPhiColumns, type DanhMucPhiDisplayRow } from './columns'

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
}

const FILTER_DEFAULTS: DanhSachFilters = { q: '' }

/** Danh mục thu — THUẦN XEM (không còn CRUD phía trường, xem storage/danhMucPhi.ts). Dữ liệu
 * mirror từ Sở, trường chỉ tra cứu Mã phí/Tham chiếu pháp lý khi cần đối chiếu. */
export function DanhMucPhiUploadPage() {
  const styles = useStyles()
  const hoSo = getHoSoTruong()

  if (hoSo) ensureSeededDanhMucPhi(hoSo.nienKhoa)

  const allRows = useMemo(() => Object.values(getDanhMucPhiStore()).flat(), [])

  const [filters, setFilters] = useState<DanhSachFilters>(FILTER_DEFAULTS)
  const [draft, setDraft] = useFilterDraft<DanhSachFilters>(filters)

  const filteredRows = useMemo<DanhMucPhiDisplayRow[]>(() => {
    const rows = allRows.filter((row) => {
      if (filters.q) {
        const q = filters.q.toLowerCase()
        if (!row.maPhi.toLowerCase().includes(q) && !row.tenPhi.toLowerCase().includes(q)) return false
      }
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
          setDraft(FILTER_DEFAULTS)
          setFilters(FILTER_DEFAULTS)
        }}
      >
        <Field label="Tìm kiếm">
          <Input value={draft.q} onChange={(_, data) => setDraft({ q: data.value })} placeholder="Mã thu hoặc tên danh mục..." />
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
