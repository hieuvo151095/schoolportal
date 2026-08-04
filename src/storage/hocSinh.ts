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
