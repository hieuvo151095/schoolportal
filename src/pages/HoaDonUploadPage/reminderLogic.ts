import { getHoaDonByKy } from '../../storage/hoaDon'
import { soNgayConLaiToiHan } from '../../utils/dongBo'
import { getKyOptions } from '../../utils/ky'

export interface KyReminder {
  ky: string
  soNgayConLai: number
}

const REMINDER_WINDOW_DAYS = 5

/** Kỳ cần nhắc đồng bộ nhất trong số các kỳ chưa đồng bộ: ưu tiên kỳ quá hạn/sắp hết hạn lâu
 * nhất trước (soNgayConLai nhỏ nhất — âm nhiều nhất nếu đã quá hạn). Trả về null nếu không có
 * kỳ nào trong 6 kỳ gần nhất cần nhắc (đã đồng bộ hết, hoặc còn hạn > 5 ngày). */
export function getKyCanNhac(): KyReminder | null {
  const candidates = getKyOptions()
    .filter((ky) => getHoaDonByKy(ky).length === 0)
    .map((ky) => ({ ky, soNgayConLai: soNgayConLaiToiHan(ky) }))
    .filter((candidate) => candidate.soNgayConLai <= REMINDER_WINDOW_DAYS)
    .sort((a, b) => a.soNgayConLai - b.soNgayConLai)

  return candidates[0] ?? null
}
