import {
  Badge,
  Body1,
  Button,
  Checkbox,
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
  Field,
  Input,
  MessageBar,
  MessageBarBody,
  Tooltip,
  createTableColumn,
  makeStyles,
  tokens,
  type CheckboxProps,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { CheckmarkCircleRegular, InfoRegular } from '@fluentui/react-icons'
import { useEffect, useMemo, useState } from 'react'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { buildHoaDonDataColumns } from '../HoaDonUploadPage/columns'
import type { DongBoLichSuEntry, HoaDonRow } from '../../types/domain'
import { COL_BADGE, COL_KY, COL_MA, COL_NGAY, COL_SO_TIEN, COL_TEN, COL_TRANG_THAI_RONG } from '../../utils/tableColumnSizes'
import { hoaDonId, LY_DO_THAT_BAI_HOA_DON_TEXT } from './dongBoLogic'

// Cỡ RIÊNG cho bảng hoá đơn trong pop-up này — thu gọn hơn bảng chính Hoá đơn để vừa trong khung
// pop-up, không cần kéo scroll ngang mới thấy hết cột (đặc biệt cột "Trạng thái" cấp hoá đơn ở
// cuối bảng).
const columnSizingOptions = {
  __checkbox: { minWidth: 40, defaultWidth: 44 },
  soHoaDon: COL_MA,
  hoTenHocSinh: COL_TEN,
  maHocSinh: COL_MA,
  ky: COL_KY,
  hanThanhToan: COL_NGAY,
  soTien: COL_SO_TIEN,
  daTra: COL_SO_TIEN,
  hinhThucThanhToan: COL_MA,
  ngayThanhToan: COL_NGAY,
  trangThai: COL_TRANG_THAI_RONG,
  __trangThaiHoaDon: COL_BADGE,
}

const useStyles = makeStyles({
  surface: {
    maxWidth: '96vw',
    width: '1700px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalM,
  },
  headerInfo: {
    display: 'flex',
    columnGap: tokens.spacingHorizontalXXL,
    flexWrap: 'wrap',
  },
  headerInfoItem: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXXS,
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalM,
  },
  searchField: {
    maxWidth: '320px',
  },
  tableScroll: {
    overflowX: 'auto',
    maxHeight: '55vh',
    overflowY: 'auto',
  },
  trangThaiCell: {
    display: 'flex',
    alignItems: 'center',
    columnGap: tokens.spacingHorizontalXS,
  },
})

interface DongBoDialogProps {
  open: boolean
  onClose: () => void
  pending: HoaDonRow[]
  readOnly: boolean
  onConfirm?: (selection: string[]) => void
  headerInfo?: Pick<DongBoLichSuEntry, 'thoiDiem' | 'nguoiThucHien' | 'trangThai' | 'lyDoThatBai' | 'ketQuaHoaDon'>
}

function tickState(selectedCount: number, total: number): CheckboxProps['checked'] {
  if (total === 0 || selectedCount === 0) return false
  if (selectedCount === total) return true
  return 'mixed'
}

export function DongBoDialog({ open, onClose, pending, readOnly, onConfirm, headerInfo }: DongBoDialogProps) {
  const styles = useStyles()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [search, setSearch] = useState('')

  /** Mặc định TICK TẤT CẢ mỗi khi pop-up mở với 1 tập dữ liệu mới — readOnly luôn tick hết vì
   * pending truyền vào đã là đúng tập đã chọn của lần nộp báo cáo cũ, không có gì để bỏ chọn thêm. */
  useEffect(() => {
    if (!open) return
    setSelected(new Set(pending.map(hoaDonId)))
    setSearch('')
  }, [open, pending])

  const allIds = useMemo(() => pending.map(hoaDonId), [pending])

  function toggleAll() {
    setSelected((prev) => {
      const next = new Set(prev)
      const allSelected = allIds.every((id) => next.has(id))
      if (allSelected) {
        for (const id of allIds) next.delete(id)
      } else {
        for (const id of allIds) next.add(id)
      }
      return next
    })
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return pending
    return pending.filter(
      (r) =>
        r.soHoaDon.toLowerCase().includes(q) ||
        r.maHocSinh.toLowerCase().includes(q) ||
        r.hoTenHocSinh.toLowerCase().includes(q),
    )
  }, [pending, search])

  const tableColumns = useMemo<TableColumnDefinition<HoaDonRow>[]>(
    () => [
      createTableColumn<HoaDonRow>({
        columnId: '__checkbox',
        renderHeaderCell: () => (
          <Checkbox checked={tickState(selected.size, allIds.length)} onChange={toggleAll} disabled={readOnly} />
        ),
        renderCell: (item) => (
          <Checkbox checked={selected.has(hoaDonId(item))} onChange={() => toggleOne(hoaDonId(item))} disabled={readOnly} />
        ),
      }),
      ...buildHoaDonDataColumns<HoaDonRow>(),
      // Chỉ hiện ở pop-up "Chi tiết" (readOnly, có headerInfo) — không hiện ở pop-up "Nộp báo cáo"
      // (chế độ tạo mới), vì lúc đó CHƯA có kết quả đẩy lên portal Sở của từng hoá đơn để hiện.
      // Cột này track theo TỪNG DÒNG hoá đơn (Thành công/Thất bại), khác hẳn badge "Trạng thái"
      // tổng của cả lần nộp báo cáo hiện phía trên bảng (Đã xử lý/Đang xử lý, không đổi).
      ...(readOnly && headerInfo
        ? [
            createTableColumn<HoaDonRow>({
              columnId: '__trangThaiHoaDon',
              renderHeaderCell: () => 'Trạng thái',
              renderCell: (item) => {
                const ketQua = headerInfo.ketQuaHoaDon?.[hoaDonId(item)]
                const trangThaiDong = ketQua?.trangThai ?? 'Thành công'
                return (
                  <span className={styles.trangThaiCell}>
                    <Badge appearance="filled" color={trangThaiDong === 'Thành công' ? 'success' : 'danger'}>
                      {trangThaiDong}
                    </Badge>
                    {trangThaiDong === 'Thất bại' && ketQua?.lyDo && (
                      <Tooltip content={LY_DO_THAT_BAI_HOA_DON_TEXT[ketQua.lyDo]} relationship="label">
                        <InfoRegular />
                      </Tooltip>
                    )}
                  </span>
                )
              },
            }),
          ]
        : []),
    ],
    [selected, allIds, readOnly, headerInfo, styles.trangThaiCell],
  )

  function handleConfirm() {
    onConfirm?.(Array.from(selected))
  }

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <DialogTitle>{readOnly ? 'Chi tiết lần nộp báo cáo' : 'Nộp báo cáo'}</DialogTitle>
          <DialogContent className={styles.content}>
            {headerInfo && (
              <div className={styles.headerInfo}>
                <div className={styles.headerInfoItem}>
                  <Body1>
                    <strong>Thời gian</strong>
                  </Body1>
                  <Body1>{new Date(headerInfo.thoiDiem).toLocaleString('vi-VN')}</Body1>
                </div>
                <div className={styles.headerInfoItem}>
                  <Body1>
                    <strong>Người thực hiện</strong>
                  </Body1>
                  <Body1>{headerInfo.nguoiThucHien}</Body1>
                </div>
                <div className={styles.headerInfoItem}>
                  <Body1>
                    <strong>Trạng thái</strong>
                  </Body1>
                  <Badge appearance="filled" color={headerInfo.trangThai === 'Đã xử lý' ? 'success' : 'warning'}>
                    {headerInfo.trangThai}
                  </Badge>
                </div>
              </div>
            )}

            {headerInfo?.trangThai === 'Đang xử lý' && headerInfo.lyDoThatBai && (
              <MessageBar intent="error">
                <MessageBarBody>{headerInfo.lyDoThatBai}</MessageBarBody>
              </MessageBar>
            )}

            <div className={styles.toolbar}>
              <Body1>
                Đã chọn {selected.size}/{allIds.length} hoá đơn
              </Body1>
              <Field label="Tìm kiếm" className={styles.searchField}>
                <Input value={search} onChange={(_, data) => setSearch(data.value)} placeholder="Mã HĐ, Mã HS hoặc tên học sinh..." />
              </Field>
            </div>

            {filtered.length === 0 ? (
              <MessageBar intent="info">
                <MessageBarBody>Không có dữ liệu.</MessageBarBody>
              </MessageBar>
            ) : (
              <div className={styles.tableScroll}>
                <DataGrid
                  items={filtered}
                  columns={tableColumns}
                  getRowId={hoaDonId}
                  resizableColumns
                  columnSizingOptions={columnSizingOptions}
                >
                  <TableHeaderRow />
                  <DataGridBody<HoaDonRow>>
                    {({ item, rowId }) => (
                      <DataGridRow<HoaDonRow> key={rowId}>
                        {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                      </DataGridRow>
                    )}
                  </DataGridBody>
                </DataGrid>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {readOnly ? 'Đóng' : 'Huỷ'}
            </Button>
            {!readOnly && (
              <Button appearance="primary" icon={<CheckmarkCircleRegular />} disabled={selected.size === 0} onClick={handleConfirm}>
                Nộp báo cáo
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
