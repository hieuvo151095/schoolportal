import { getDanhMucPhiStore } from '../../storage/danhMucPhi'
import { getHoaDonStore } from '../../storage/hoaDon'
import { getHoSoTruong } from '../../storage/hoSoTruong'
import { DEFAULT_KY } from '../../utils/ky'

export interface EntitySyncStatus {
  label: string
  coDuLieu: boolean
  contextLabel: string
  rowCount: number
  /** Số bản ghi daDongBo=false (mọi kỳ) — nhắc người dùng còn gì cần nộp báo cáo (khác dòng chờ ở
   * đúng contextLabel — soLuongChoDongBo tính trên TOÀN BỘ dữ liệu). */
  soLuongChoDongBo: number
  /** 'nienKhoa': theo niên khoá (1 lần/năm) — hiện "đã có dữ liệu" thay vì đếm dòng.
   * 'ky': theo kỳ (hàng tháng) — vẫn hiện số dòng để theo dõi sát hơn. */
  chuKy: 'nienKhoa' | 'ky'
}

export interface MiniKpi {
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
  hoaDon: EntitySyncStatus
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
  const danhMucPhiRows = danhMucPhiStore[nienKhoaHienTai] ?? []
  const hoaDonRows = getHoaDonStore()[DEFAULT_KY] ?? []

  const hoaDonStore = getHoaDonStore()
  const allHoaDon = Object.values(hoaDonStore).flat()

  const miniKpi: MiniKpi = {
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
      label: 'Danh mục thu',
      coDuLieu: danhMucPhiRows.length > 0,
      contextLabel: `Niên khoá ${nienKhoaHienTai}`,
      rowCount: danhMucPhiRows.length,
      soLuongChoDongBo: 0,
      chuKy: 'nienKhoa',
    },
    hoaDon: {
      label: 'Nhập dữ liệu',
      coDuLieu: hoaDonRows.length > 0,
      contextLabel: `Kỳ ${DEFAULT_KY}`,
      rowCount: hoaDonRows.length,
      soLuongChoDongBo: allHoaDon.filter((r) => !r.daDongBo).length,
      chuKy: 'ky',
    },
    miniKpi,
    xuHuongThu,
  }
}
