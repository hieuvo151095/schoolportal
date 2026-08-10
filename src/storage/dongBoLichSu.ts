import { buildDongBoLichSuSeed } from '../mock-data/dongBoLichSuSeed'
import type { DongBoLichSuEntry } from '../types/domain'
import { STORAGE_KEYS } from './keys'

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
