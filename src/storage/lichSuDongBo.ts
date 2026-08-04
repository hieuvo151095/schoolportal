import { buildSeedEntries } from '../mock-data/lichSuDongBoSeed'
import type { LichSuDongBoEntry, LoaiDuLieuDongBo } from '../types/domain'
import { STORAGE_KEYS } from './keys'

export function getLichSuDongBo(): LichSuDongBoEntry[] {
  const raw = localStorage.getItem(STORAGE_KEYS.lichSuDongBo)
  if (!raw) return []
  try {
    return JSON.parse(raw) as LichSuDongBoEntry[]
  } catch {
    return []
  }
}

export function getLichSuDongBoByLoai(loaiDuLieu: LoaiDuLieuDongBo): LichSuDongBoEntry[] {
  return getLichSuDongBo().filter((entry) => entry.loaiDuLieu === loaiDuLieu)
}

/** Append-only — không bao giờ ghi đè lịch sử đã có. */
export function appendLichSuDongBo(entry: LichSuDongBoEntry): void {
  const list = getLichSuDongBo()
  list.push(entry)
  localStorage.setItem(STORAGE_KEYS.lichSuDongBo, JSON.stringify(list))
}

/** Sinh sẵn tối thiểu 6 dòng lịch sử mẫu cho 1 module nếu module đó chưa có dòng nào — để
 * bảng Lịch sử đồng bộ không trống rỗng khi demo lần đầu. Idempotent. */
export function ensureSeeded(loaiDuLieu: LoaiDuLieuDongBo, maTruong: string): void {
  const existing = getLichSuDongBo()
  if (existing.some((entry) => entry.loaiDuLieu === loaiDuLieu)) return
  const seeded = buildSeedEntries(loaiDuLieu, maTruong)
  localStorage.setItem(STORAGE_KEYS.lichSuDongBo, JSON.stringify([...existing, ...seeded]))
}
