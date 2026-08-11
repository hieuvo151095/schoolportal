import { appendDongBoLichSu } from '../../storage/dongBoLichSu'
import { getHoaDonChoDongBo, getHoaDonStore, markHoaDonDaDongBo } from '../../storage/hoaDon'
import type { DongBoLichSuEntry, HoaDonDongBoResult, HoaDonRow, LyDoThatBaiHoaDon } from '../../types/domain'

/** ID ổn định cho 1 dòng trong bảng chọn nộp báo cáo / khoá tra cứu trong lịch sử — ghép Kỳ vì Mã
 * HĐ chỉ đảm bảo duy nhất TRONG PHẠM VI 1 kỳ, không phải toàn cục. */
export function hoaDonId(row: HoaDonRow): string {
  return `${row.ky}::${row.soHoaDon}`
}

/** Nội dung tooltip cho từng lý do "Thất bại" cấp hoá đơn — phân biệt rõ 2 case, không dùng chung
 * 1 câu (xem cột "Trạng thái" riêng trong pop-up "Chi tiết lần nộp báo cáo", DongBoDialog.tsx). */
export const LY_DO_THAT_BAI_HOA_DON_TEXT: Record<LyDoThatBaiHoaDon, string> = {
  'trung-du-lieu': 'Trùng dữ liệu — hoá đơn này đã được người dùng khác đồng bộ vài giây trước.',
  'loi-he-thong': 'Hệ thống tạm thời chưa đẩy lên được — lỗi kết nối/timeout, vui lòng thử nộp báo cáo lại sau.',
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
 * 'Đang xử lý' (chưa có kết quả cuối ngay — app demo không có backend thật xử lý bất đồng bộ,
 * dòng lịch sử tự chuyển 'Đã xử lý' sau 1 khoảng trễ mô phỏng, xem resolveDongBoDangXuLy() ở
 * storage/dongBoLichSu.ts). Đây là điểm sẽ gắn API thông báo dashportal thật sau này (phần C,
 * chưa build). */
export function performDongBo(pending: HoaDonRow[], selection: string[], nguoiThucHien: string): DongBoResult {
  const selectedHoaDon = pending.filter((r) => selection.includes(hoaDonId(r)))

  markHoaDonDaDongBo(selectedHoaDon.map((r) => ({ ky: r.ky, soHoaDon: r.soHoaDon })))

  // App demo — nộp báo cáo thật luôn coi từng hoá đơn đẩy lên portal Sở thành công (không mô
  // phỏng lỗi cấp hoá đơn ở luồng thật, chỉ dữ liệu mẫu mới minh hoạ 2 case "Thất bại", xem
  // mock-data/dongBoLichSuSeed.ts).
  const ketQuaHoaDon: Record<string, HoaDonDongBoResult> = Object.fromEntries(
    selectedHoaDon.map((r) => [hoaDonId(r), { trangThai: 'Thành công', lyDo: null } satisfies HoaDonDongBoResult]),
  )

  const entry: DongBoLichSuEntry = {
    id: `dong-bo-${Date.now()}`,
    thoiDiem: new Date().toISOString(),
    nguoiThucHien,
    trangThai: 'Đang xử lý',
    lyDoThatBai: null,
    soLuongHoaDon: selectedHoaDon.length,
    maHoaDon: selection,
    ketQuaHoaDon,
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
