import { buildHocSinhSeed } from '../mock-data/hocSinhSeed'
import type { HocSinhRow } from '../types/domain'
import { STORAGE_KEYS } from './keys'

type HocSinhStore = Record<string, HocSinhRow[]>

function readStore(): HocSinhStore {
  const raw = localStorage.getItem(STORAGE_KEYS.hocSinh)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as HocSinhStore
  } catch {
    return {}
  }
}

export function getHocSinhStore(): HocSinhStore {
  return readStore()
}

export function getHocSinhByNienKhoa(nienKhoa: string): HocSinhRow[] {
  return readStore()[nienKhoa] ?? []
}

/** Ghi đè toàn bộ danh sách học sinh của 1 niên khoá — mỗi lần đồng bộ thay thế hoàn toàn dữ liệu cũ. */
export function saveHocSinhByNienKhoa(nienKhoa: string, rows: HocSinhRow[]): void {
  const store = readStore()
  store[nienKhoa] = rows
  localStorage.setItem(STORAGE_KEYS.hocSinh, JSON.stringify(store))
}

/** Sinh sẵn dữ liệu mẫu cho 1 niên khoá nếu chưa có dữ liệu — để Tab "Danh sách" không trống
 * khi demo lần đầu, và làm khoá ngoại sẵn có cho dữ liệu mẫu Hoá đơn. Idempotent. */
export function ensureSeededHocSinh(nienKhoa: string): void {
  const store = readStore()
  if (store[nienKhoa]?.length) return
  store[nienKhoa] = buildHocSinhSeed()
  localStorage.setItem(STORAGE_KEYS.hocSinh, JSON.stringify(store))
}
