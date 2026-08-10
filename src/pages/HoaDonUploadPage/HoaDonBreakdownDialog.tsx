import {
  Button,
  DataGrid,
  DataGridBody,
  DataGridCell,
  DataGridRow,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  createTableColumn,
  makeStyles,
  tokens,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { useMemo } from 'react'
import { LabelValueField } from '../../components/LabelValueField'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { getDanhMucPhiByNienKhoa } from '../../storage/danhMucPhi'
import { getHoaDonKhoanPhiBySoHoaDon } from '../../storage/hoaDonKhoanPhi'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import type { HoaDonRow, KhoanPhiRow } from '../../types/domain'
import { formatCurrency, formatDate } from '../../utils/date'
import { COL_MA, COL_SO_TIEN, COL_TEN } from '../../utils/tableColumnSizes'

const useStyles = makeStyles({
  // maxWidth đủ rộng để bảng breakdown 7 cột hiện hết không cần cuộn ngang ở màn hình
  // desktop thường (>=1280px).
  surface: {
    maxWidth: '1200px',
    width: '95vw',
  },
  summary: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalXXXL,
    marginBottom: tokens.spacingVerticalL,
  },
  summaryCol: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  tongCong: {
    display: 'flex',
    justifyContent: 'flex-end',
    columnGap: tokens.spacingHorizontalM,
    marginTop: tokens.spacingVerticalS,
    fontWeight: tokens.fontWeightSemibold,
  },
})

const COL_NIEN_KHOA = { minWidth: 110, defaultWidth: 120 }

interface BreakdownLine {
  maPhi: string
  tenPhi: string
  soTien: number
  donViTinh: string
  nguonThu: string
  nhomPhi: string
  nienKhoa: string
}

function joinBreakdown(soHoaDon: string, ky: string, catalog: KhoanPhiRow[]): BreakdownLine[] {
  return getHoaDonKhoanPhiBySoHoaDon(ky, soHoaDon).map((line) => {
    const khoanPhi = catalog.find((kp) => kp.maPhi === line.maPhi)
    return {
      maPhi: line.maPhi,
      tenPhi: khoanPhi?.tenPhi ?? '—',
      soTien: line.soTien,
      donViTinh: khoanPhi?.donViTinh ?? '—',
      nguonThu: khoanPhi?.nguonThu ?? '—',
      nhomPhi: khoanPhi?.nhomPhi ?? '—',
      nienKhoa: khoanPhi?.nienKhoa ?? '—',
    }
  })
}

interface HoaDonBreakdownDialogProps {
  row: HoaDonRow | null
  onClose: () => void
}

export function HoaDonBreakdownDialog({ row, onClose }: HoaDonBreakdownDialogProps) {
  const styles = useStyles()

  const breakdown = useMemo(() => {
    if (!row) return []
    const nienKhoa = getHoSoTruong()?.nienKhoa
    const catalog = nienKhoa ? getDanhMucPhiByNienKhoa(nienKhoa) : []
    return joinBreakdown(row.soHoaDon, row.ky, catalog)
  }, [row])

  const tongBreakdown = useMemo(() => breakdown.reduce((sum, line) => sum + line.soTien, 0), [breakdown])

  const columns: TableColumnDefinition<BreakdownLine>[] = [
    createTableColumn<BreakdownLine>({ columnId: 'maPhi', renderHeaderCell: () => 'Mã phí', renderCell: (item) => item.maPhi }),
    createTableColumn<BreakdownLine>({ columnId: 'tenPhi', renderHeaderCell: () => 'Tên phí', renderCell: (item) => item.tenPhi }),
    createTableColumn<BreakdownLine>({
      columnId: 'soTien',
      renderHeaderCell: () => 'Số tiền',
      renderCell: (item) => formatCurrency(item.soTien),
    }),
    createTableColumn<BreakdownLine>({
      columnId: 'donViTinh',
      renderHeaderCell: () => 'Đơn vị tính',
      renderCell: (item) => item.donViTinh,
    }),
    createTableColumn<BreakdownLine>({
      columnId: 'nguonThu',
      renderHeaderCell: () => 'Nguồn thu',
      renderCell: (item) => item.nguonThu,
    }),
    createTableColumn<BreakdownLine>({ columnId: 'nhomPhi', renderHeaderCell: () => 'Nhóm phí', renderCell: (item) => item.nhomPhi }),
    createTableColumn<BreakdownLine>({
      columnId: 'nienKhoa',
      renderHeaderCell: () => 'Niên khoá',
      renderCell: (item) => item.nienKhoa,
    }),
  ]

  const columnSizingOptions = {
    maPhi: COL_MA,
    tenPhi: COL_TEN,
    soTien: COL_SO_TIEN,
    donViTinh: COL_MA,
    nguonThu: COL_MA,
    nhomPhi: COL_TEN,
    nienKhoa: COL_NIEN_KHOA,
  }

  return (
    <Dialog open={row !== null} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.surface}>
        {row && (
          <DialogBody>
            <DialogTitle>Chi tiết khoản phí hoá đơn</DialogTitle>
            <DialogContent>
              <div className={styles.summary}>
                <div className={styles.summaryCol}>
                  <LabelValueField label="Học sinh" value={`${row.hoTenHocSinh || row.maHocSinh} (${row.maHocSinh})`} />
                  <LabelValueField label="Tên hoá đơn" value={`Hoá đơn kỳ ${row.ky} — ${row.soHoaDon}`} />
                  <LabelValueField label="Hạn thanh toán" value={formatDate(row.hanThanhToan)} />
                  <LabelValueField label="Ngày thanh toán" value={row.ngayThanhToan ? formatDate(row.ngayThanhToan) : '—'} />
                </div>
                <div className={styles.summaryCol}>
                  <LabelValueField label="Hình thức thanh toán" value={row.hinhThucThanhToan ?? '—'} />
                  <LabelValueField label="Tạo bởi" value={row.taoBoi} />
                </div>
              </div>

              <DataGrid
                items={breakdown}
                columns={columns}
                getRowId={(item: BreakdownLine) => item.maPhi}
                resizableColumns
                columnSizingOptions={columnSizingOptions}
              >
                <TableHeaderRow />
                <DataGridBody<BreakdownLine>>
                  {({ item, rowId }) => (
                    <DataGridRow<BreakdownLine> key={rowId}>
                      {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                    </DataGridRow>
                  )}
                </DataGridBody>
              </DataGrid>

              <div className={styles.tongCong}>
                <span>Tổng cộng:</span>
                <span>{formatCurrency(tongBreakdown)}</span>
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={onClose}>
                Đóng
              </Button>
            </DialogActions>
          </DialogBody>
        )}
      </DialogSurface>
    </Dialog>
  )
}
