import { getHoaDonByKy } from '../../storage/hoaDon'
import { soNgayConLaiToiHan } from '../../utils/dongBo'
import { formatMonthYear } from '../../utils/date'

export interface KyReminder {
  ky: string
  soNgayConLai: number
}

const REMINDER_WINDOW_DAYS = 5

/** Kỳ báo cáo gần nhất — kỳ liền trước tháng hiện tại (MM/YYYY), theo đúng quy tắc hạn chót
 * "ngày 7 hằng tháng cho kỳ liền trước" (xem utils/dongBo.ts). */
function kyBaoCaoGanNhat(): string {
  const today = new Date()
  return formatMonthYear(new Date(today.getFullYear(), today.getMonth() - 1, 1))
}

/** Nhắc nhập dữ liệu hoá đơn cho ĐÚNG kỳ báo cáo gần nhất (kỳ liền trước tháng hiện tại) — không
 * còn quét ngược nhiều kỳ trong quá khứ để tìm kỳ quá hạn lâu nhất. Trả về null nếu kỳ đó đã có
 * dữ liệu (không cần nhắc), hoặc còn hạn quá xa (> 5 ngày). */
export function getKyCanNhac(): KyReminder | null {
  const ky = kyBaoCaoGanNhat()
  if (getHoaDonByKy(ky).length > 0) return null

  const soNgayConLai = soNgayConLaiToiHan(ky)
  if (soNgayConLai > REMINDER_WINDOW_DAYS) return null

  return { ky, soNgayConLai }
}
