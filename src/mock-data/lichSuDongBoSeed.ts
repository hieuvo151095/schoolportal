import type { LichSuDongBoEntry, LoaiDuLieuDongBo, TrangThaiDongBo } from '../types/domain'
import { getKyOptions } from '../utils/ky'
import { getNienKhoaOptions } from '../utils/nienKhoa'

const NGUOI_THUC_HIEN_LIST = ['Nguyễn Thị Kế toán', 'Trần Văn Hiệu phó', 'Lê Thị Văn thư']

const SUCCESS_COUNT_BASE: Record<LoaiDuLieuDongBo, number> = {
  danhMucPhi: 12,
  hocSinh: 180,
  hoaDon: 240,
}

function sanitizeForFileName(value: string): string {
  return value.replace(/[/\\]/g, '-')
}

function buildEntry(
  loaiDuLieu: LoaiDuLieuDongBo,
  maTruong: string,
  contextValue: string,
  index: number,
  daysAgo: number,
): LichSuDongBoEntry {
  const trangThaiCycle: TrangThaiDongBo[] = ['Thành công', 'Thành công', 'Thành công có cảnh báo', 'Thành công', 'Thất bại', 'Thành công']
  const trangThai = trangThaiCycle[index % trangThaiCycle.length]
  const baseCount = SUCCESS_COUNT_BASE[loaiDuLieu] + index
  const soDongThanhCong = trangThai === 'Thất bại' ? 0 : baseCount
  const soDongLoi = trangThai === 'Thành công' ? 0 : trangThai === 'Thất bại' ? baseCount : Math.max(1, Math.floor(baseCount * 0.05))

  const thoiDiem = new Date()
  thoiDiem.setDate(thoiDiem.getDate() - daysAgo)

  const pad = (n: number) => String(n).padStart(2, '0')
  const timestamp = `${thoiDiem.getFullYear()}${pad(thoiDiem.getMonth() + 1)}${pad(thoiDiem.getDate())}${pad(thoiDiem.getHours())}${pad(thoiDiem.getMinutes())}${pad(thoiDiem.getSeconds())}`

  return {
    id: `seed-${loaiDuLieu}-${index}`,
    thoiDiem: thoiDiem.toISOString(),
    loaiDuLieu,
    nienKhoaHoacKy: contextValue,
    soDongThanhCong,
    soDongLoi,
    trangThai,
    tenFileExport: `dong-bo_${sanitizeForFileName(maTruong)}_${loaiDuLieu}_${sanitizeForFileName(contextValue)}_${timestamp}.json`,
    nguoiThucHien: NGUOI_THUC_HIEN_LIST[index % NGUOI_THUC_HIEN_LIST.length],
  }
}

/** Sinh tối thiểu 6 dòng lịch sử đồng bộ mẫu cho 1 module, trải qua nhiều Niên khoá/Kỳ khác
 * nhau — dùng để bảng Lịch sử đồng bộ không trống rỗng khi demo lần đầu. */
export function buildSeedEntries(loaiDuLieu: LoaiDuLieuDongBo, maTruong: string): LichSuDongBoEntry[] {
  if (loaiDuLieu === 'hoaDon') {
    const kyOptions = [...getKyOptions()].reverse() // mới nhất trước, để index 0 gần đây nhất
    return kyOptions.map((ky, index) => buildEntry(loaiDuLieu, maTruong, ky, index, index * 6 + 2))
  }

  // Danh mục Phí / Học sinh: 3 niên khoá x 2 dòng/niên khoá = 6 dòng.
  const nienKhoaOptions = getNienKhoaOptions()
  const entries: LichSuDongBoEntry[] = []
  let index = 0
  for (const nienKhoa of nienKhoaOptions) {
    for (let i = 0; i < 2; i++) {
      entries.push(buildEntry(loaiDuLieu, maTruong, nienKhoa, index, index * 15 + 3))
      index++
    }
  }
  return entries
}
