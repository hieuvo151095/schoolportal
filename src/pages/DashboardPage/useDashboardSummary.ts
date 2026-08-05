import { getDanhMucPhiStore } from '../../storage/danhMucPhi'
import { getHoaDonStore } from '../../storage/hoaDon'
import { getHocSinhStore } from '../../storage/hocSinh'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import { DEFAULT_KY } from '../../utils/ky'

export interface EntitySyncStatus {
  label: string
  coDuLieu: boolean
  contextLabel: string
  rowCount: number
  /** Số bản ghi daDongBo=false (mọi niên khoá/kỳ) — nhắc người dùng còn gì cần đồng bộ ở module
   * "Đồng bộ" (khác dòng chờ ở đúng contextLabel — soLuongChoDongBo tính trên TOÀN BỘ dữ liệu). */
  soLuongChoDongBo: number
  /** 'nienKhoa': đồng bộ theo niên khoá (1 lần/năm) — hiện "đã có dữ liệu" thay vì đếm dòng.
   * 'ky': đồng bộ theo kỳ (hàng tháng) — vẫn hiện số dòng để theo dõi sát hơn. */
  chuKy: 'nienKhoa' | 'ky'
}

export interface MiniKpi {
  tongHocSinh: number | null
  tongKhoanPhi: number | null
  tongHoaDonKyGanNhat: number | null
  daThuKyGanNhat: number | null
  conThuKyGanNhat: number | null
}

export interface ThuThangDiem {
  ky: string
  daThu: number
}

export interface DashboardSummary {
  nienKhoaHienTai: string
  danhMucPhi: EntitySyncStatus
  hocSinh: EntitySyncStatus
  hoaDon: EntitySyncStatus
  tongCongNo: number
  miniKpi: MiniKpi
  xuHuongThu: ThuThangDiem[]
}

/** "MM/YYYY" -> số YYYYMM để sắp xếp thời gian tăng dần. */
function kyToSortKey(ky: string): number {
  const [thang, nam] = ky.split('/').map(Number)
  return nam * 100 + thang
}

export function getDashboardSummary(): DashboardSummary {
  const hoSo = getHoSoTruong()
  const nienKhoaHienTai = hoSo?.nienKhoa ?? ''

  const danhMucPhiStore = getDanhMucPhiStore()
  const hocSinhStore = getHocSinhStore()
  const danhMucPhiRows = danhMucPhiStore[nienKhoaHienTai] ?? []
  const hocSinhRows = hocSinhStore[nienKhoaHienTai] ?? []
  const hoaDonRows = getHoaDonStore()[DEFAULT_KY] ?? []

  const hoaDonStore = getHoaDonStore()
  const allHoaDon = Object.values(hoaDonStore).flat()
  const tongCongNo = allHoaDon
    .filter((hd) => hd.trangThai !== 'Đã thanh toán')
    .reduce((sum, hd) => sum + (hd.soTien - hd.daTra), 0)

  const miniKpi: MiniKpi = {
    tongHocSinh: hocSinhRows.length > 0 ? hocSinhRows.length : null,
    tongKhoanPhi: danhMucPhiRows.length > 0 ? danhMucPhiRows.length : null,
    tongHoaDonKyGanNhat: hoaDonRows.length > 0 ? hoaDonRows.length : null,
    daThuKyGanNhat: hoaDonRows.length > 0 ? hoaDonRows.reduce((sum, hd) => sum + hd.daTra, 0) : null,
    conThuKyGanNhat:
      hoaDonRows.length > 0
        ? hoaDonRows
            .filter((hd) => hd.trangThai !== 'Đã thanh toán')
            .reduce((sum, hd) => sum + (hd.soTien - hd.daTra), 0)
        : null,
  }

  const kyCoDuLieu = Object.keys(hoaDonStore).filter((ky) => hoaDonStore[ky].length > 0)
  const xuHuongThu: ThuThangDiem[] =
    kyCoDuLieu.length >= 2
      ? kyCoDuLieu
          .sort((a, b) => kyToSortKey(a) - kyToSortKey(b))
          .map((ky) => ({ ky, daThu: hoaDonStore[ky].reduce((sum, hd) => sum + hd.daTra, 0) }))
      : []

  return {
    nienKhoaHienTai,
    danhMucPhi: {
      label: 'Danh mục Phí',
      coDuLieu: danhMucPhiRows.length > 0,
      contextLabel: `Niên khoá ${nienKhoaHienTai}`,
      rowCount: danhMucPhiRows.length,
      soLuongChoDongBo: Object.values(danhMucPhiStore).flat().filter((r) => !r.daDongBo).length,
      chuKy: 'nienKhoa',
    },
    hocSinh: {
      label: 'Học sinh',
      coDuLieu: hocSinhRows.length > 0,
      contextLabel: `Niên khoá ${nienKhoaHienTai}`,
      rowCount: hocSinhRows.length,
      soLuongChoDongBo: Object.values(hocSinhStore).flat().filter((r) => !r.daDongBo).length,
      chuKy: 'nienKhoa',
    },
    hoaDon: {
      label: 'Hoá đơn',
      coDuLieu: hoaDonRows.length > 0,
      contextLabel: `Kỳ ${DEFAULT_KY}`,
      rowCount: hoaDonRows.length,
      soLuongChoDongBo: allHoaDon.filter((r) => !r.daDongBo).length,
      chuKy: 'ky',
    },
    tongCongNo,
    miniKpi,
    xuHuongThu,
  }
}
