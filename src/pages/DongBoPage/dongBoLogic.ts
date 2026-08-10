import { appendDongBoLichSu } from '../../storage/dongBoLichSu'
import { getHoaDonChoDongBo, getHoaDonStore, markHoaDonDaDongBo } from '../../storage/hoaDon'
import type { DongBoLichSuEntry, HoaDonRow } from '../../types/domain'

/** ID ổn định cho 1 dòng trong bảng chọn nộp báo cáo / khoá tra cứu trong lịch sử — ghép Kỳ vì Mã
 * HĐ chỉ đảm bảo duy nhất TRONG PHẠM VI 1 kỳ, không phải toàn cục. */
export function hoaDonId(row: HoaDonRow): string {
  return `${row.ky}::${row.soHoaDon}`
}

/** Toàn bộ hoá đơn daDongBo=false — nguồn dữ liệu cho pop-up "Nộp báo cáo" (chế độ tạo mới, khác
 * chế độ xem lại "Chi tiết" 1 lần đã qua). */
export function getPendingHoaDon(): HoaDonRow[] {
  return getHoaDonChoDongBo()
}

export interface DongBoResult {
  entry: DongBoLichSuEntry
}

/** Thực thi 1 lần nộp báo cáo — set daDongBo=true cho các hoá đơn đã chọn, ghi 1 dòng lịch sử
 * Thành công. Đây là điểm sẽ gắn API thông báo dashportal thật sau này (phần C, chưa build). */
export function performDongBo(pending: HoaDonRow[], selection: string[], nguoiThucHien: string): DongBoResult {
  const selectedHoaDon = pending.filter((r) => selection.includes(hoaDonId(r)))

  markHoaDonDaDongBo(selectedHoaDon.map((r) => ({ ky: r.ky, soHoaDon: r.soHoaDon })))

  const entry: DongBoLichSuEntry = {
    id: `dong-bo-${Date.now()}`,
    thoiDiem: new Date().toISOString(),
    nguoiThucHien,
    trangThai: 'Thành công',
    lyDoThatBai: null,
    soLuongHoaDon: selectedHoaDon.length,
    maHoaDon: selection,
  }
  appendDongBoLichSu(entry)

  return { entry }
}

/** Tra cứu lại dữ liệu HIỆN TẠI cho đúng các Mã HĐ đã lưu trong 1 dòng lịch sử — dùng cho "Chi
 * tiết" xem lại. Đọc TOÀN BỘ bản ghi (cả daDongBo true/false) vì 1 dòng lịch sử có thể tham chiếu
 * bản ghi đã đổi trạng thái ở lần nộp báo cáo SAU đó. */
export function resolveChiTiet(maHoaDon: string[]): HoaDonRow[] {
  const hoaDonAll = Object.values(getHoaDonStore()).flat()
  return hoaDonAll.filter((r) => maHoaDon.includes(hoaDonId(r)))
}
