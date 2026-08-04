import { buildHoaDonSeed } from '../mock-data/hoaDonSeed'
import type { HoaDonRow } from '../types/domain'
import { STORAGE_KEYS } from './keys'
import { ensureSeededHocSinh } from './hocSinh'
import { getHoSoTruong } from './hoSoTruong'

type HoaDonStore = Record<string, HoaDonRow[]>

function readStore(): HoaDonStore {
  const raw = localStorage.getItem(STORAGE_KEYS.hoaDon)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as HoaDonStore
  } catch {
    return {}
  }
}

export function getHoaDonStore(): HoaDonStore {
  return readStore()
}

export function getHoaDonByKy(ky: string): HoaDonRow[] {
  return readStore()[ky] ?? []
}

/** Ghi đè toàn bộ hoá đơn của 1 kỳ — mỗi lần đồng bộ thay thế hoàn toàn dữ liệu cũ. */
export function saveHoaDonByKy(ky: string, rows: HoaDonRow[]): void {
  const store = readStore()
  store[ky] = rows
  localStorage.setItem(STORAGE_KEYS.hoaDon, JSON.stringify(store))
}

/** Sinh sẵn dữ liệu mẫu cho 1 kỳ nếu chưa có dữ liệu — để Tab "Danh sách" không trống khi demo
 * lần đầu. Đảm bảo Học sinh đã có sẵn trước (khoá ngoại maHocSinh). Idempotent. */
export function ensureSeededHoaDon(ky: string): void {
  const store = readStore()
  if (store[ky]?.length) return
  const hoSo = getHoSoTruong()
  if (hoSo) ensureSeededHocSinh(hoSo.nienKhoa)
  store[ky] = buildHoaDonSeed(ky)
  localStorage.setItem(STORAGE_KEYS.hoaDon, JSON.stringify(store))
}
