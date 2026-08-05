import type { HoaDonKhoanPhiRow } from '../types/domain'
import { STORAGE_KEYS } from './keys'

type HoaDonKhoanPhiStore = Record<string, HoaDonKhoanPhiRow[]>

function readStore(): HoaDonKhoanPhiStore {
  const raw = localStorage.getItem(STORAGE_KEYS.hoaDonKhoanPhi)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as HoaDonKhoanPhiStore
  } catch {
    return {}
  }
}

export function getHoaDonKhoanPhiByKy(ky: string): HoaDonKhoanPhiRow[] {
  return readStore()[ky] ?? []
}

export function getHoaDonKhoanPhiBySoHoaDon(ky: string, soHoaDon: string): HoaDonKhoanPhiRow[] {
  return getHoaDonKhoanPhiByKy(ky).filter((row) => row.soHoaDon === soHoaDon)
}

/** Thêm khoản phí mới vào 1 kỳ — nối vào dữ liệu cũ, không xoá dữ liệu đã có (mọi soHoaDon trong
 * rows đều là hoá đơn mới hoàn toàn, do uploadConfig.existingDataCheck đã chặn trùng soHoaDon với
 * dữ liệu cũ từ trước, nên không có rủi ro trùng khoản phí của 1 hoá đơn cũ đã tồn tại). */
export function saveHoaDonKhoanPhiByKy(ky: string, rows: HoaDonKhoanPhiRow[]): void {
  const store = readStore()
  store[ky] = [...(store[ky] ?? []), ...rows]
  localStorage.setItem(STORAGE_KEYS.hoaDonKhoanPhi, JSON.stringify(store))
}
