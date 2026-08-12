import { buildDongBoLichSuSeed } from '../mock-data/dongBoLichSuSeed'
import type { DongBoLichSuEntry } from '../types/domain'
import { finalizeHoaDonMerge } from './hoaDon'
import { STORAGE_KEYS } from './keys'

/** App demo không có backend thật xử lý bất đồng bộ — mô phỏng độ trễ xử lý bằng 1 mốc thời gian
 * cố định: 'Đang xử lý' đủ lâu (quá NGUONG_TU_CHUYEN_MS kể từ thoiDiem) thì tự chuyển 'Đã xử lý'
 * ở lần đọc lịch sử kế tiếp (gọi resolveDongBoDangXuLy khi trang tải lại), xem DongBoPage/index.tsx. */
const NGUONG_TU_CHUYEN_MS = 8000

export function getDongBoLichSu(): DongBoLichSuEntry[] {
  const raw = localStorage.getItem(STORAGE_KEYS.dongBoLichSu)
  if (!raw) return []
  try {
    return JSON.parse(raw) as DongBoLichSuEntry[]
  } catch {
    return []
  }
}

/** Append-only — không bao giờ ghi đè lịch sử đã có. */
export function appendDongBoLichSu(entry: DongBoLichSuEntry): void {
  const list = getDongBoLichSu()
  list.push(entry)
  localStorage.setItem(STORAGE_KEYS.dongBoLichSu, JSON.stringify(list))
}

/** Sinh sẵn vài dòng lịch sử mẫu nếu chưa có dòng nào — để bảng không trống khi demo lần đầu.
 * Gọi SAU khi module Hoá đơn đã ensureSeeded (dữ liệu mẫu tham chiếu trong seed phải tồn tại
 * thật để nút "Chi tiết" mở lại đúng nội dung). Idempotent. */
export function ensureSeededDongBoLichSu(): void {
  if (getDongBoLichSu().length > 0) return
  localStorage.setItem(STORAGE_KEYS.dongBoLichSu, JSON.stringify(buildDongBoLichSuSeed()))
}

/** Tự chuyển các dòng 'Đang xử lý' đã đủ lâu (>= NGUONG_TU_CHUYEN_MS) sang 'Đã xử lý' — mô phỏng
 * việc xử lý bất đồng bộ hoàn tất, xoá lyDoThatBai vì không còn ý nghĩa khi đã xong. Gọi khi
 * DongBoPage tải lại (component mount/re-render), xem DongBoPage/index.tsx.
 *
 * Đúng lúc 1 entry chuyển 'Đã xử lý', hoàn tất luôn merge Số tiền đã trả cho các hoá đơn trong đó
 * đang chờ cộng dồn (finalizeHoaDonMerge — chỉ tác dụng lên hoá đơn có daTraCu, tức đã ghi đè
 * trùng Mã HĐ với hoá đơn cũ "Thanh toán một phần" lúc lưu, xem storage/hoaDon.ts saveHoaDonByKy).
 * maHoaDon là mảng id dạng '<ky>::<soHoaDon>', phải khớp đúng định dạng hoaDonId() ở
 * pages/DongBoPage/dongBoLogic.ts. */
export function resolveDongBoDangXuLy(): void {
  const list = getDongBoLichSu()
  const now = Date.now()
  let changed = false

  const next = list.map((entry) => {
    if (entry.trangThai !== 'Đang xử lý') return entry
    if (now - new Date(entry.thoiDiem).getTime() < NGUONG_TU_CHUYEN_MS) return entry
    changed = true
    finalizeHoaDonMerge(
      entry.maHoaDon.map((id) => {
        const [ky, soHoaDon] = id.split('::')
        return { ky, soHoaDon }
      }),
    )
    return { ...entry, trangThai: 'Đã xử lý' as const, lyDoThatBai: null }
  })

  if (changed) localStorage.setItem(STORAGE_KEYS.dongBoLichSu, JSON.stringify(next))
}
