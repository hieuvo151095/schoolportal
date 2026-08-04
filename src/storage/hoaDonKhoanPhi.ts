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

/** Ghi đè toàn bộ khoản phí của 1 kỳ — mỗi lần đồng bộ Hoá đơn thay thế hoàn toàn dữ liệu cũ. */
export function saveHoaDonKhoanPhiByKy(ky: string, rows: HoaDonKhoanPhiRow[]): void {
  const store = readStore()
  store[ky] = rows
  localStorage.setItem(STORAGE_KEYS.hoaDonKhoanPhi, JSON.stringify(store))
}
