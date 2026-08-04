import { getDanhMucPhiStore } from '../../storage/danhMucPhi'
import { getHoaDonStore } from '../../storage/hoaDon'
import { getHocSinhStore } from '../../storage/hocSinh'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import { getLichSuDongBo } from '../../storage/lichSuDongBo'
import type { LoaiDuLieuDongBo } from '../../types/domain'
import { DEFAULT_KY } from '../../utils/ky'

export interface EntitySyncStatus {
  label: string
  synced: boolean
  contextLabel: string
  rowCount: number
  lastSyncAt: string | null
}

export interface DashboardSummary {
  nienKhoaHienTai: string
  danhMucPhi: EntitySyncStatus
  hocSinh: EntitySyncStatus
  hoaDon: EntitySyncStatus
  tongCongNo: number
}

function getLastSyncAt(loaiDuLieu: LoaiDuLieuDongBo): string | null {
  const entries = getLichSuDongBo().filter((e) => e.loaiDuLieu === loaiDuLieu)
  if (entries.length === 0) return null
  return entries.reduce((latest, e) => (e.thoiDiem > latest ? e.thoiDiem : latest), entries[0].thoiDiem)
}

export function getDashboardSummary(): DashboardSummary {
  const hoSo = getHoSoTruong()
  const nienKhoaHienTai = hoSo?.nienKhoa ?? ''

  const danhMucPhiRows = getDanhMucPhiStore()[nienKhoaHienTai] ?? []
  const hocSinhRows = getHocSinhStore()[nienKhoaHienTai] ?? []
  const hoaDonRows = getHoaDonStore()[DEFAULT_KY] ?? []

  const allHoaDon = Object.values(getHoaDonStore()).flat()
  const tongCongNo = allHoaDon
    .filter((hd) => hd.trangThai !== 'Đã thanh toán')
    .reduce((sum, hd) => sum + (hd.soTien - hd.daTra), 0)

  return {
    nienKhoaHienTai,
    danhMucPhi: {
      label: 'Danh mục Phí',
      synced: danhMucPhiRows.length > 0,
      contextLabel: `Niên khoá ${nienKhoaHienTai}`,
      rowCount: danhMucPhiRows.length,
      lastSyncAt: getLastSyncAt('danhMucPhi'),
    },
    hocSinh: {
      label: 'Học sinh',
      synced: hocSinhRows.length > 0,
      contextLabel: `Niên khoá ${nienKhoaHienTai}`,
      rowCount: hocSinhRows.length,
      lastSyncAt: getLastSyncAt('hocSinh'),
    },
    hoaDon: {
      label: 'Hoá đơn',
      synced: hoaDonRows.length > 0,
      contextLabel: `Kỳ ${DEFAULT_KY}`,
      rowCount: hoaDonRows.length,
      lastSyncAt: getLastSyncAt('hoaDon'),
    },
    tongCongNo,
  }
}
