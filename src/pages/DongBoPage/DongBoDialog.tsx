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
  Tab,
  TabList,
  createTableColumn,
  makeStyles,
  tokens,
  type CheckboxProps,
  type TableColumnDefinition,
} from '@fluentui/react-components'
import { CheckmarkCircleRegular } from '@fluentui/react-icons'
import { useEffect, useMemo, useState } from 'react'
import { TableHeaderRow } from '../../components/TableHeaderRow'
import { danhMucPhiColumns } from '../DanhMucPhiUploadPage/columns'
import { hocSinhColumns } from '../HocSinhUploadPage/columns'
import { buildHoaDonDataColumns } from '../HoaDonUploadPage/columns'
import type { DongBoLichSuEntry, HoaDonRow, HocSinhRow, KhoanPhiRow, LoaiDuLieuDongBo } from '../../types/domain'
import { danhMucPhiId, hoaDonId, hocSinhId, type DongBoSelection, type PendingData } from './dongBoLogic'

const useStyles = makeStyles({
  surface: {
    maxWidth: '96vw',
    width: '1400px',
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
  overviewGroup: {
    display: 'flex',
    flexDirection: 'column',
    rowGap: tokens.spacingVerticalXS,
    padding: tokens.spacingHorizontalM,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  tabToolbar: {
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
    maxHeight: '40vh',
    overflowY: 'auto',
  },
})

const ENTITY_LABEL: Record<LoaiDuLieuDongBo, string> = {
  danhMucPhi: 'Danh mục Phí',
  hocSinh: 'Học sinh',
  hoaDon: 'Hoá đơn',
}

interface DongBoDialogProps {
  open: boolean
  onClose: () => void
  pending: PendingData
  readOnly: boolean
  onConfirm?: (selection: DongBoSelection) => void
  headerInfo?: Pick<DongBoLichSuEntry, 'thoiDiem' | 'nguoiThucHien' | 'trangThai' | 'lyDoThatBai'>
  /** Tab hiện sẵn khi mở pop-up — dùng khi mở từ 1 module cụ thể (nút "Bắt đầu đồng bộ" ở Danh
   * mục Phí/Học sinh/Hoá đơn). Mặc định 'danhMucPhi' khi không truyền (mở từ module Đồng bộ). */
  defaultTab?: LoaiDuLieuDongBo
}

function tickState(selectedCount: number, total: number): CheckboxProps['checked'] {
  if (total === 0 || selectedCount === 0) return false
  if (selectedCount === total) return true
  return 'mixed'
}

export function DongBoDialog({ open, onClose, pending, readOnly, onConfirm, headerInfo, defaultTab }: DongBoDialogProps) {
  const styles = useStyles()
  const [activeTab, setActiveTab] = useState<LoaiDuLieuDongBo>('danhMucPhi')
  const [selected, setSelected] = useState<Record<LoaiDuLieuDongBo, Set<string>>>({
    danhMucPhi: new Set(),
    hocSinh: new Set(),
    hoaDon: new Set(),
  })
  const [search, setSearch] = useState<Record<LoaiDuLieuDongBo, string>>({ danhMucPhi: '', hocSinh: '', hoaDon: '' })

  /** Mặc định TICK TẤT CẢ mỗi khi pop-up mở với 1 tập dữ liệu mới — readOnly luôn tick hết vì
   * pending truyền vào đã là đúng tập đã chọn của lần đồng bộ cũ, không có gì để bỏ chọn thêm. */
  useEffect(() => {
    if (!open) return
    setSelected({
      danhMucPhi: new Set(pending.danhMucPhi.map(danhMucPhiId)),
      hocSinh: new Set(pending.hocSinh.map(hocSinhId)),
      hoaDon: new Set(pending.hoaDon.map(hoaDonId)),
    })
    setSearch({ danhMucPhi: '', hocSinh: '', hoaDon: '' })
    setActiveTab(defaultTab ?? 'danhMucPhi')
  }, [open, pending, defaultTab])

  function toggleAll(loai: LoaiDuLieuDongBo, allIds: string[]) {
    setSelected((prev) => {
      const next = new Set(prev[loai])
      const allSelected = allIds.every((id) => next.has(id))
      if (allSelected) {
        for (const id of allIds) next.delete(id)
      } else {
        for (const id of allIds) next.add(id)
      }
      return { ...prev, [loai]: next }
    })
  }

  function toggleOne(loai: LoaiDuLieuDongBo, id: string) {
    setSelected((prev) => {
      const next = new Set(prev[loai])
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return { ...prev, [loai]: next }
    })
  }

  const totalSelected = selected.danhMucPhi.size + selected.hocSinh.size + selected.hoaDon.size

  function buildCheckboxColumn<T>(loai: LoaiDuLieuDongBo, idFn: (row: T) => string, allIds: string[]): TableColumnDefinition<T> {
    return createTableColumn<T>({
      columnId: '__checkbox',
      renderHeaderCell: () => (
        <Checkbox checked={tickState(selected[loai].size, allIds.length)} onChange={() => toggleAll(loai, allIds)} disabled={readOnly} />
      ),
      renderCell: (item) => (
        <Checkbox checked={selected[loai].has(idFn(item))} onChange={() => toggleOne(loai, idFn(item))} disabled={readOnly} />
      ),
    })
  }

  const danhMucPhiFiltered = useMemo(() => {
    const q = search.danhMucPhi.trim().toLowerCase()
    if (!q) return pending.danhMucPhi
    return pending.danhMucPhi.filter((r) => r.maPhi.toLowerCase().includes(q) || r.tenPhi.toLowerCase().includes(q))
  }, [pending.danhMucPhi, search.danhMucPhi])

  const hocSinhFiltered = useMemo(() => {
    const q = search.hocSinh.trim().toLowerCase()
    if (!q) return pending.hocSinh
    return pending.hocSinh.filter((r) => r.maHocSinh.toLowerCase().includes(q) || r.hoTen.toLowerCase().includes(q))
  }, [pending.hocSinh, search.hocSinh])

  const hoaDonFiltered = useMemo(() => {
    const q = search.hoaDon.trim().toLowerCase()
    if (!q) return pending.hoaDon
    return pending.hoaDon.filter((r) => r.soHoaDon.toLowerCase().includes(q) || r.maHocSinh.toLowerCase().includes(q))
  }, [pending.hoaDon, search.hoaDon])

  const danhMucPhiAllIds = useMemo(() => pending.danhMucPhi.map(danhMucPhiId), [pending.danhMucPhi])
  const hocSinhAllIds = useMemo(() => pending.hocSinh.map(hocSinhId), [pending.hocSinh])
  const hoaDonAllIds = useMemo(() => pending.hoaDon.map(hoaDonId), [pending.hoaDon])

  const danhMucPhiTableColumns = useMemo<TableColumnDefinition<KhoanPhiRow>[]>(
    () => [buildCheckboxColumn('danhMucPhi', danhMucPhiId, danhMucPhiAllIds), ...danhMucPhiColumns],
    [selected.danhMucPhi, danhMucPhiAllIds, readOnly],
  )
  const hocSinhTableColumns = useMemo<TableColumnDefinition<HocSinhRow>[]>(
    () => [buildCheckboxColumn('hocSinh', hocSinhId, hocSinhAllIds), ...hocSinhColumns],
    [selected.hocSinh, hocSinhAllIds, readOnly],
  )
  const hoaDonTableColumns = useMemo<TableColumnDefinition<HoaDonRow>[]>(
    () => [buildCheckboxColumn('hoaDon', hoaDonId, hoaDonAllIds), ...buildHoaDonDataColumns<HoaDonRow>()],
    [selected.hoaDon, hoaDonAllIds, readOnly],
  )

  function handleConfirm() {
    onConfirm?.({
      danhMucPhi: Array.from(selected.danhMucPhi),
      hocSinh: Array.from(selected.hocSinh),
      hoaDon: Array.from(selected.hoaDon),
    })
  }

  return (
    <Dialog open={open} onOpenChange={(_, data) => !data.open && onClose()}>
      <DialogSurface className={styles.surface}>
        <DialogBody>
          <DialogTitle>{readOnly ? 'Chi tiết lần đồng bộ' : 'Đồng bộ dữ liệu'}</DialogTitle>
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
                  <Badge appearance="filled" color={headerInfo.trangThai === 'Thành công' ? 'success' : 'danger'}>
                    {headerInfo.trangThai}
                  </Badge>
                </div>
              </div>
            )}

            {headerInfo?.trangThai === 'Thất bại' && headerInfo.lyDoThatBai && (
              <MessageBar intent="error">
                <MessageBarBody>{headerInfo.lyDoThatBai}</MessageBarBody>
              </MessageBar>
            )}

            <Body1>
              <strong>Tổng quan</strong>
            </Body1>
            <div className={styles.headerInfo}>
              {(['danhMucPhi', 'hocSinh', 'hoaDon'] as LoaiDuLieuDongBo[]).map((loai) => {
                const allIds = loai === 'danhMucPhi' ? danhMucPhiAllIds : loai === 'hocSinh' ? hocSinhAllIds : hoaDonAllIds
                return (
                  <div key={loai} className={styles.overviewGroup}>
                    <Checkbox
                      checked={tickState(selected[loai].size, allIds.length)}
                      onChange={() => toggleAll(loai, allIds)}
                      disabled={readOnly || allIds.length === 0}
                      label={`${ENTITY_LABEL[loai]} (${allIds.length} dữ liệu mới)`}
                    />
                  </div>
                )
              })}
            </div>

            <TabList selectedValue={activeTab} onTabSelect={(_, data) => setActiveTab(data.value as LoaiDuLieuDongBo)}>
              <Tab value="danhMucPhi">Danh mục Phí ({selected.danhMucPhi.size}/{danhMucPhiAllIds.length})</Tab>
              <Tab value="hocSinh">Học sinh ({selected.hocSinh.size}/{hocSinhAllIds.length})</Tab>
              <Tab value="hoaDon">Hoá đơn ({selected.hoaDon.size}/{hoaDonAllIds.length})</Tab>
            </TabList>

            {activeTab === 'danhMucPhi' && (
              <>
                <div className={styles.tabToolbar}>
                  <Field label="Tìm kiếm" className={styles.searchField}>
                    <Input
                      value={search.danhMucPhi}
                      onChange={(_, data) => setSearch((prev) => ({ ...prev, danhMucPhi: data.value }))}
                      placeholder="Mã phí hoặc tên phí..."
                    />
                  </Field>
                </div>
                {danhMucPhiFiltered.length === 0 ? (
                  <MessageBar intent="info">
                    <MessageBarBody>Không có dữ liệu.</MessageBarBody>
                  </MessageBar>
                ) : (
                  <div className={styles.tableScroll}>
                    <DataGrid items={danhMucPhiFiltered} columns={danhMucPhiTableColumns} getRowId={danhMucPhiId} resizableColumns>
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
              </>
            )}

            {activeTab === 'hocSinh' && (
              <>
                <div className={styles.tabToolbar}>
                  <Field label="Tìm kiếm" className={styles.searchField}>
                    <Input
                      value={search.hocSinh}
                      onChange={(_, data) => setSearch((prev) => ({ ...prev, hocSinh: data.value }))}
                      placeholder="Mã HS hoặc họ tên..."
                    />
                  </Field>
                </div>
                {hocSinhFiltered.length === 0 ? (
                  <MessageBar intent="info">
                    <MessageBarBody>Không có dữ liệu.</MessageBarBody>
                  </MessageBar>
                ) : (
                  <div className={styles.tableScroll}>
                    <DataGrid items={hocSinhFiltered} columns={hocSinhTableColumns} getRowId={hocSinhId} resizableColumns>
                      <TableHeaderRow />
                      <DataGridBody<HocSinhRow>>
                        {({ item, rowId }) => (
                          <DataGridRow<HocSinhRow> key={rowId}>
                            {({ renderCell }) => <DataGridCell>{renderCell(item)}</DataGridCell>}
                          </DataGridRow>
                        )}
                      </DataGridBody>
                    </DataGrid>
                  </div>
                )}
              </>
            )}

            {activeTab === 'hoaDon' && (
              <>
                <div className={styles.tabToolbar}>
                  <Field label="Tìm kiếm" className={styles.searchField}>
                    <Input
                      value={search.hoaDon}
                      onChange={(_, data) => setSearch((prev) => ({ ...prev, hoaDon: data.value }))}
                      placeholder="Mã HĐ hoặc Mã HS..."
                    />
                  </Field>
                </div>
                {hoaDonFiltered.length === 0 ? (
                  <MessageBar intent="info">
                    <MessageBarBody>Không có dữ liệu.</MessageBarBody>
                  </MessageBar>
                ) : (
                  <div className={styles.tableScroll}>
                    <DataGrid items={hoaDonFiltered} columns={hoaDonTableColumns} getRowId={hoaDonId} resizableColumns>
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
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button appearance="secondary" onClick={onClose}>
              {readOnly ? 'Đóng' : 'Huỷ'}
            </Button>
            {!readOnly && (
              <Button appearance="primary" icon={<CheckmarkCircleRegular />} disabled={totalSelected === 0} onClick={handleConfirm}>
                Đồng bộ
              </Button>
            )}
          </DialogActions>
        </DialogBody>
      </DialogSurface>
    </Dialog>
  )
}
