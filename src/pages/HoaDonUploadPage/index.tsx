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
import { useLocation } from 'react-router-dom'
import { useAppToast } from '../../components/AppToaster'
import { DongBoStatusBadge } from '../../components/DongBoStatusBadge'
import { FilterBar } from '../../components/FilterBar'
import { RangeFilterField } from '../../components/RangeFilterField'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { ensureSeededHoaDon, getHoaDonStore } from '../../storage/hoaDon'
import { getHocSinhByNienKhoa } from '../../storage/hocSinh'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import type { HinhThucThanhToan, HoaDonRow, TrangThaiHoaDon } from '../../types/domain'
import { AddRecordDialog } from '../../upload-engine/AddRecordDialog'
import { ReviewUploadDialog } from '../../upload-engine/ReviewUploadDialog'
import { UploadActionsRow } from '../../upload-engine/UploadActionsRow'
import { useReviewUpload } from '../../upload-engine/useReviewUpload'
import { DEFAULT_KY, getKyOptions } from '../../utils/ky'
import { COL_HANH_DONG, COL_NGUOI_KEP, COL_TRANG_THAI_RONG } from '../../utils/tableColumnSizes'
import { useFilterDraft } from '../../utils/useFilterDraft'
import { DongBoDialog } from '../DongBoPage/DongBoDialog'
import { useDongBoDialog } from '../DongBoPage/useDongBoDialog'
import { buildHoaDonDataColumns } from './columns'
import { hoaDonUploadConfig } from './hoaDonUploadConfig'
import { HoaDonBreakdownDialog } from './HoaDonBreakdownDialog'
import { ReminderBanner } from './ReminderBanner'

const TAT_CA = 'all'
const CHUA_DONG_BO = 'false'

const HINH_THUC_THANH_TOAN_LIST: HinhThucThanhToan[] = ['Tiền mặt', 'Chuyển khoản', 'Ví điện tử', 'QR Code']
const TRANG_THAI_LIST: TrangThaiHoaDon[] = ['Đã thanh toán', 'Thanh toán một phần', 'Chưa thanh toán']

/** Rỗng hoặc chọn đủ cả 3 trạng thái đều tương đương "không lọc" — hiện "Tất cả" cho cả 2 case.
 * Chọn đúng 1 trạng thái thì hiện tên trạng thái đó; chọn 2 thì hiện "Đã chọn N mục" (tên đầy đủ
 * của nhiều trạng thái cộng lại quá dài, làm vỡ layout Dropdown). */
function trangThaiDisplayValue(selected: TrangThaiHoaDon[]): string {
  if (selected.length === 0 || selected.length === TRANG_THAI_LIST.length) return 'Tất cả'
  if (selected.length === 1) return selected[0]
  return `Đã chọn ${selected.length} mục`
}

type DisplayRow = HoaDonRow & { hoTenHocSinh: string; lop: string }

interface HoaDonNavState {
  presetTrangThai?: TrangThaiHoaDon[]
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
  nowrapCell: {
    whiteSpace: 'nowrap',
  },
  uploadRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    columnGap: tokens.spacingHorizontalS,
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
  trangThai: TrangThaiHoaDon[]
  hinhThuc: string
  hanTu: string
  hanDen: string
  ngayTtTu: string
  ngayTtDen: string
  dongBo: string
}

function buildFilterDefaults(presetTrangThai?: TrangThaiHoaDon[]): DanhSachFilters {
  return {
    q: '',
    lop: TAT_CA,
    ky: TAT_CA,
    trangThai: presetTrangThai ?? [],
    hinhThuc: TAT_CA,
    hanTu: '',
    hanDen: '',
    ngayTtTu: '',
    ngayTtDen: '',
    dongBo: TAT_CA,
  }
}

function buildColumns(onXemChiTiet: (row: DisplayRow) => void): TableColumnDefinition<DisplayRow>[] {
  return [
    ...buildHoaDonDataColumns<DisplayRow>(),
    createTableColumn<DisplayRow>({
      columnId: 'danhMucPhi',
      renderHeaderCell: () => 'Danh mục phí',
      renderCell: (item) => (
        <Button appearance="outline" size="small" onClick={() => onXemChiTiet(item)}>
          Xem chi tiết
        </Button>
      ),
    }),
    createTableColumn<DisplayRow>({
      columnId: 'daDongBo',
      renderHeaderCell: () => 'Đồng bộ',
      renderCell: (item) => <DongBoStatusBadge daDongBo={item.daDongBo} />,
    }),
  ]
}

export function HoaDonUploadPage() {
  const styles = useStyles()
  const kyOptions = getKyOptions()
  const location = useLocation()
  const presetTrangThai = (location.state as HoaDonNavState | null)?.presetTrangThai
  const [selectedRow, setSelectedRow] = useState<DisplayRow | null>(null)
  const columns = useMemo(() => buildColumns(setSelectedRow), [setSelectedRow])
  const { showSuccess } = useAppToast()

  ensureSeededHoaDon(DEFAULT_KY)

  /** Bump sau mỗi lần lưu dữ liệu thành công để allRows đọc lại storage. */
  const [refreshTick, setRefreshTick] = useState(0)
  const review = useReviewUpload(hoaDonUploadConfig, undefined, () => setRefreshTick((t) => t + 1))
  const dongBoDialog = useDongBoDialog({ onSynced: () => setRefreshTick((t) => t + 1) })
  const [addOpen, setAddOpen] = useState(false)

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
  }, [hocSinhLookup, refreshTick])

  const lopOptions = useMemo(
    () => Array.from(new Set(allRows.map((row) => row.lop).filter(Boolean))).sort(),
    [allRows],
  )

  const [filters, setFilters] = useState<DanhSachFilters>(() => buildFilterDefaults(presetTrangThai))
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
      if (filters.trangThai.length > 0 && !filters.trangThai.includes(row.trangThai)) return false
      if (filters.hinhThuc !== TAT_CA && row.hinhThucThanhToan !== filters.hinhThuc) return false
      if (filters.hanTu && row.hanThanhToan < filters.hanTu) return false
      if (filters.hanDen && row.hanThanhToan > filters.hanDen) return false
      if (filters.ngayTtTu && (!row.ngayThanhToan || row.ngayThanhToan < filters.ngayTtTu)) return false
      if (filters.ngayTtDen && (!row.ngayThanhToan || row.ngayThanhToan > filters.ngayTtDen)) return false
      if (filters.dongBo !== TAT_CA && String(row.daDongBo) !== filters.dongBo) return false
      return true
    })
  }, [allRows, filters])

  return (
    <div className={styles.root}>
      <Title2>Hoá đơn</Title2>

      {review.confirmSummary && (
        <MessageBar intent="success">
          <MessageBarBody>Đã lưu thành công {review.confirmSummary.soDong} dòng.</MessageBarBody>
        </MessageBar>
      )}

      <ReminderBanner />

      <FilterBar
        onApply={() => setFilters(draft)}
        onReset={() => {
          setDraft(buildFilterDefaults())
          setFilters(buildFilterDefaults())
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
            multiselect
            value={trangThaiDisplayValue(draft.trangThai)}
            selectedOptions={draft.trangThai.length === TRANG_THAI_LIST.length ? [TAT_CA, ...draft.trangThai] : draft.trangThai}
            onOptionSelect={(_, data) => {
              if (data.optionValue === TAT_CA) {
                setDraft({ trangThai: data.selectedOptions.includes(TAT_CA) ? [...TRANG_THAI_LIST] : [] })
                return
              }
              setDraft({ trangThai: data.selectedOptions.filter((v) => v !== TAT_CA) as TrangThaiHoaDon[] })
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
          <UploadActionsRow config={hoaDonUploadConfig} processing={review.processing} onFileSelected={review.handleFile} />
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

      <ReviewUploadDialog
        config={hoaDonUploadConfig}
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
        defaultTab="hoaDon"
      />

      <AddRecordDialog
        config={hoaDonUploadConfig}
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
